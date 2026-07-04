import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExamShell from "../features/exam/ExamShell";
import ResultsView from "../features/exam/ResultsView";
import {
  getActiveExamBlueprint,
  getCurrentUser,
  saveExamAttemptForStudent,
  scoreBlueprintAttempt
} from "../services/storage";

function createEmptyResponses(sections) {
  return sections.map((section) => section.questions.map(() => null));
}

function createEmptyQuestionMetrics(sections) {
  return sections.map((section) =>
    section.questions.map(() => ({
      timeSpentMs: 0,
      answerEvents: []
    }))
  );
}

export default function ExamPage() {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [blueprint, setBlueprint] = useState(null);
  const [responses, setResponses] = useState([]);
  const [activeSection, setActiveSection] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [phase, setPhase] = useState("loading");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [questionMetrics, setQuestionMetrics] = useState([]);
  const activeQuestionStartedAt = useRef(Date.now());
  const questionMetricsRef = useRef([]);

  useEffect(() => {
    let mounted = true;

    function loadExam() {
      try {
        const activeBlueprint = getActiveExamBlueprint();
        if (!mounted) return;

        if (!activeBlueprint) {
          setError("No published exam is available yet. Ask an admin to publish a mock exam.");
          setPhase("error");
          return;
        }

        setBlueprint(activeBlueprint);
        setSections(activeBlueprint.sections);
        setResponses(createEmptyResponses(activeBlueprint.sections));
        const initialMetrics = createEmptyQuestionMetrics(activeBlueprint.sections);
        questionMetricsRef.current = initialMetrics;
        setQuestionMetrics(initialMetrics);
        setPhase("welcome");
      } catch (err) {
        console.error("Exam blueprint storage error:", err);
        if (mounted) {
          setError("Unable to load the exam blueprint from localStorage.");
          setPhase("error");
        }
      }
    }

    loadExam();

    return () => {
      mounted = false;
    };
  }, []);

  const currentSection = sections[activeSection];
  const currentQuestion = currentSection?.questions[activeQuestion];
  const response = responses[activeSection]?.[activeQuestion] ?? null;

  const progress = useMemo(() => {
    const flatResponses = responses.flat();
    return {
      answered: flatResponses.filter((item) => Array.isArray(item) ? item.length > 0 : item !== null && item !== "").length,
      total: flatResponses.length
    };
  }, [responses]);

  const recordActiveQuestionTime = useCallback(() => {
    if (phase !== "testing") return questionMetricsRef.current;
    const elapsedMs = Math.max(0, Date.now() - activeQuestionStartedAt.current);
    if (!elapsedMs) return questionMetricsRef.current;

    const nextMetrics = questionMetricsRef.current.map((sectionMetrics, sectionIndex) =>
        sectionIndex === activeSection
          ? sectionMetrics.map((item, questionIndex) =>
              questionIndex === activeQuestion ? { ...item, timeSpentMs: Number(item.timeSpentMs || 0) + elapsedMs } : item
            )
          : sectionMetrics
    );
    questionMetricsRef.current = nextMetrics;
    setQuestionMetrics(nextMetrics);
    activeQuestionStartedAt.current = Date.now();
    return nextMetrics;
  }, [activeQuestion, activeSection, phase]);

  const saveResponse = useCallback((value) => {
    const previousResponse = responses[activeSection]?.[activeQuestion] ?? null;
    const elapsedMs = Math.max(0, Date.now() - activeQuestionStartedAt.current);

    const nextMetrics = questionMetricsRef.current.map((sectionMetrics, sectionIndex) =>
        sectionIndex === activeSection
          ? sectionMetrics.map((item, questionIndex) =>
              questionIndex === activeQuestion
                ? {
                    ...item,
                    answerEvents: [
                      ...(item.answerEvents || []),
                      {
                        at: new Date().toISOString(),
                        elapsedMs,
                        from: previousResponse,
                        to: value
                      }
                    ]
                  }
                : item
            )
          : sectionMetrics
    );
    questionMetricsRef.current = nextMetrics;
    setQuestionMetrics(nextMetrics);

    setResponses((current) =>
      current.map((sectionResponses, sectionIndex) =>
        sectionIndex === activeSection
          ? sectionResponses.map((item, questionIndex) => (questionIndex === activeQuestion ? value : item))
          : sectionResponses
      )
    );
  }, [activeQuestion, activeSection, responses]);

  const submitAttempt = useCallback(() => {
    try {
      const finalQuestionMetrics = recordActiveQuestionTime();
      setPhase("submitting");
      const user = getCurrentUser();
      const scoredResults = scoreBlueprintAttempt(blueprint, responses, { questionMetrics: finalQuestionMetrics });
      const durationSeconds = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : 0;
      saveExamAttemptForStudent(user, blueprint, responses, scoredResults, { durationSeconds, questionMetrics: finalQuestionMetrics });
      setResults(scoredResults);
      setPhase("results");
    } catch (err) {
      console.error("Exam submission storage error:", err);
      setError("Unable to save the exam attempt to localStorage.");
      setPhase("error");
    }
  }, [blueprint, recordActiveQuestionTime, responses, startedAt]);

  const next = useCallback(() => {
    recordActiveQuestionTime();
    const section = sections[activeSection];
    if (!section) return;

    if (activeQuestion < section.questions.length - 1) {
      setActiveQuestion((current) => current + 1);
      return;
    }

    if (activeSection < sections.length - 1) {
      setActiveSection((current) => current + 1);
      setActiveQuestion(0);
      setPhase("intermission");
      return;
    }

    submitAttempt();
  }, [activeQuestion, activeSection, recordActiveQuestionTime, sections, submitAttempt]);

  const previous = useCallback(() => {
    recordActiveQuestionTime();
    setActiveQuestion((current) => Math.max(0, current - 1));
  }, [recordActiveQuestionTime]);

  const jump = useCallback((questionIndex) => {
    recordActiveQuestionTime();
    setActiveQuestion(questionIndex);
  }, [recordActiveQuestionTime]);

  function updatePhase(nextPhase) {
    if (nextPhase === "testing" && !startedAt) {
      setStartedAt(Date.now());
    }
    if (nextPhase === "testing") {
      activeQuestionStartedAt.current = Date.now();
    }
    setPhase(nextPhase);
  }

  if (phase === "loading" || phase === "submitting") {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-100 p-6">
        <div className="glass-card max-w-xl p-8 text-center">
          <p className="text-xs font-black uppercase tracking-wider text-blue-600">
            {phase === "loading" ? "Loading Exam" : "Submitting Attempt"}
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">
            {phase === "loading" ? "Fetching the active exam from localStorage..." : "Saving your results to localStorage..."}
          </h1>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-100 p-6">
        <div className="glass-card max-w-xl border-l-4 border-rose-500 p-8">
          <p className="text-xs font-black uppercase tracking-wider text-rose-600">Exam unavailable</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">Exam flow unavailable.</h1>
          <p className="mt-3 text-sm text-slate-600">{error}</p>
          <button onClick={() => navigate("/dashboard")} className="mt-6 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (phase === "results") {
    return <ResultsView results={results} onBack={() => navigate("/dashboard")} />;
  }

  return (
    <ExamShell
      phase={phase}
      examTitle={blueprint?.title}
      setPhase={updatePhase}
      sections={sections}
      activeSection={activeSection}
      activeQuestion={activeQuestion}
      currentSection={currentSection}
      currentQuestion={currentQuestion}
      response={response}
      responses={responses}
      progress={progress}
      onSaveResponse={saveResponse}
      onNext={next}
      onPrevious={previous}
      onJump={jump}
      onExit={() => navigate("/dashboard")}
    />
  );
}

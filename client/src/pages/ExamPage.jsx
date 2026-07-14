import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBookOpen, FaClock, FaClipboardCheck, FaLayerGroup, FaPlay } from "react-icons/fa";
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
          setPhase("empty");
          return;
        }

        setBlueprint(activeBlueprint);
        setSections(activeBlueprint.sections);
        setResponses(createEmptyResponses(activeBlueprint.sections));
        const initialMetrics = createEmptyQuestionMetrics(activeBlueprint.sections);
        questionMetricsRef.current = initialMetrics;
        setQuestionMetrics(initialMetrics);
        setPhase("overview");
      } catch (err) {
        console.error("Exam blueprint storage error:", err);
        if (mounted) {
          setError("The published exam could not be loaded. Please return to the dashboard and try again.");
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
      setError("Your exam attempt could not be saved. Please return to the dashboard and try again.");
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
          <p className="page-eyebrow">
            {phase === "loading" ? "Loading Exam" : "Submitting Attempt"}
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">
            {phase === "loading" ? "Preparing the available mock exam..." : "Saving your scored attempt..."}
          </h1>
        </div>
      </div>
    );
  }

  if (phase === "empty") {
    return (
      <div className="min-h-screen bg-slate-50 p-5 md:p-8">
        <div className="page-shell">
          <header className="page-header">
            <p className="page-eyebrow">Mock Exams</p>
            <h1 className="page-title">ACET Mock Exams</h1>
            <p className="page-description">Practice the exam experience with scored, section-based mock tests.</p>
          </header>
          <section className="state-panel border-l-4 border-slate-300">
            <div className="inline-flex rounded-xl bg-slate-100 p-3 text-xl text-slate-600"><FaClipboardCheck /></div>
            <h2 className="mt-5 text-2xl font-black text-slate-950">No mock exam has been published yet.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">An administrator needs to publish an exam before you can begin. You can continue with your dashboard or study plan in the meantime.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => navigate("/dashboard")} className="button-primary"><FaArrowLeft /> Dashboard</button>
              <button type="button" onClick={() => navigate("/reviewers")} className="button-secondary"><FaBookOpen /> Study Plan</button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (phase === "overview") {
    const questionCount = sections.reduce((total, section) => total + (section.questions?.length || 0), 0);
    const durationSeconds = sections.reduce((total, section) => total + Number(section.allottedTimeSec || 0), 0);
    const durationMinutes = durationSeconds > 0 ? Math.ceil(durationSeconds / 60) : null;

    return (
      <div className="min-h-screen bg-slate-50 p-5 md:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <button type="button" onClick={() => navigate("/dashboard")} className="button-subtle -ml-4"><FaArrowLeft /> Back to Dashboard</button>
          <section className="card-section overflow-hidden p-0 md:p-0">
            <div className="border-b border-blue-100 bg-blue-50 p-5 md:p-8">
              <p className="page-eyebrow">Published Mock Exam</p>
              <h1 className="mt-2 break-words text-3xl font-black text-slate-950 md:text-4xl">{blueprint?.title || "ACET Mock Exam"}</h1>
              {blueprint?.description && <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{blueprint.description}</p>}
            </div>
            <div className="space-y-6 p-5 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ExamFact icon={FaLayerGroup} label="Sections" value={sections.length} />
                <ExamFact icon={FaClipboardCheck} label="Questions" value={questionCount} />
                {durationMinutes !== null && <ExamFact icon={FaClock} label="Estimated time" value={`${durationMinutes} min`} />}
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-lg font-black text-slate-950">Before you begin</h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  <li>Each section has its own timer and begins after a short section overview.</li>
                  <li>You can move between questions within the current section before its time expires.</li>
                  <li>Your answers, answer changes, and time per question are recorded for scoring and diagnostics.</li>
                  <li>Leaving the exam before submission will end this session without saving a scored attempt.</li>
                </ul>
              </div>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => navigate("/dashboard")} className="button-secondary">Return to Dashboard</button>
                <button type="button" onClick={() => updatePhase("intermission")} className="button-primary"><FaPlay /> Start ACET Mock Exam</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <div className="state-panel max-w-xl border-l-4 border-rose-500" role="alert">
          <p className="text-xs font-black uppercase tracking-wider text-rose-600">Unable to load exam</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">Something went wrong while preparing the exam.</h1>
          <p className="mt-3 text-sm text-slate-600">{error}</p>
          <button onClick={() => navigate("/dashboard")} className="button-primary mt-6">
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

function ExamFact({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-blue-50 p-2.5 text-primary"><Icon /></span>
        <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 text-lg font-black text-slate-950">{value}</p></div>
      </div>
    </div>
  );
}

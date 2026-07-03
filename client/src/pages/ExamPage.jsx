import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExamBlueprint, submitExamAttempt } from "../api/dashboardApi";
import ExamShell from "../features/exam/ExamShell";
import ResultsView from "../features/exam/ResultsView";

function createEmptyResponses(sections) {
  return sections.map((section) => section.questions.map(() => null));
}

export default function ExamPage() {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [responses, setResponses] = useState([]);
  const [activeSection, setActiveSection] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [phase, setPhase] = useState("loading");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadExam() {
      try {
        const blueprint = await getExamBlueprint();
        if (!mounted) return;

        setSections(blueprint);
        setResponses(createEmptyResponses(blueprint));
        setPhase("welcome");
      } catch (err) {
        console.error("Exam blueprint API error:", err);
        if (mounted) {
          setError("Unable to load the exam blueprint from the backend.");
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
      answered: flatResponses.filter((item) => item !== null && item !== "").length,
      total: flatResponses.length
    };
  }, [responses]);

  const saveResponse = useCallback((value) => {
    setResponses((current) =>
      current.map((sectionResponses, sectionIndex) =>
        sectionIndex === activeSection
          ? sectionResponses.map((item, questionIndex) => (questionIndex === activeQuestion ? value : item))
          : sectionResponses
      )
    );
  }, [activeQuestion, activeSection]);

  const submitAttempt = useCallback(async () => {
    try {
      setPhase("submitting");
      const scoredResults = await submitExamAttempt(responses);
      setResults(scoredResults);
      setPhase("results");
    } catch (err) {
      console.error("Exam submission API error:", err);
      setError("Unable to submit the exam attempt to the backend.");
      setPhase("error");
    }
  }, [responses]);

  const next = useCallback(() => {
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
  }, [activeQuestion, activeSection, sections, submitAttempt]);

  const previous = useCallback(() => {
    setActiveQuestion((current) => Math.max(0, current - 1));
  }, []);

  if (phase === "loading" || phase === "submitting") {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-100 p-6">
        <div className="glass-card max-w-xl p-8 text-center">
          <p className="text-xs font-black uppercase tracking-wider text-blue-600">
            {phase === "loading" ? "Loading Exam" : "Submitting Attempt"}
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">
            {phase === "loading" ? "Fetching the exam from the backend..." : "Saving your results to the database..."}
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
          <h1 className="mt-3 text-3xl font-black text-slate-950">Backend exam flow failed.</h1>
          <p className="mt-3 text-sm text-slate-600">{error}</p>
          <button onClick={() => navigate("/")} className="mt-6 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (phase === "results") {
    return <ResultsView results={results} onBack={() => navigate("/")} />;
  }

  return (
    <ExamShell
      phase={phase}
      setPhase={setPhase}
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
      onJump={setActiveQuestion}
      onExit={() => navigate("/")}
    />
  );
}

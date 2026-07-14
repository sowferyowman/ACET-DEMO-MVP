import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaBrain, FaCheckCircle, FaPlay, FaTimesCircle } from "react-icons/fa";
import { getCurrentUser, getQuestionsForSubject, getWeaknessAnalysis, scoreDrillAttempt } from "../services/storage";

export default function WeaknessDrillsPage() {
  const user = getCurrentUser();
  const analysis = useMemo(() => getWeaknessAnalysis(user?.email), [user?.email]);
  const [activeSubject, setActiveSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [results, setResults] = useState(null);

  function startDrill(subject) {
    const diagnosticFocus = analysis.diagnosticInsights?.find((item) => item.category === subject.subject);
    const pulledQuestions = getQuestionsForSubject(subject.subject, 10, diagnosticFocus).slice(0, 10);
    setActiveSubject(subject.subject);
    setQuestions(pulledQuestions);
    setResponses({});
    setResults(null);
  }

  function saveResponse(index, value) {
    setResponses((current) => ({ ...current, [index]: value }));
  }

  function toggleCheckbox(questionIndex, optionIndex) {
    const current = Array.isArray(responses[questionIndex]) ? responses[questionIndex] : [];
    if (current.includes(optionIndex)) {
      saveResponse(questionIndex, current.filter((item) => item !== optionIndex));
      return;
    }
    saveResponse(questionIndex, [...current, optionIndex]);
  }

  function submitDrill() {
    const orderedResponses = questions.map((_, index) => responses[index]);
    setResults(scoreDrillAttempt(questions, orderedResponses));
  }

  if (!analysis.hasAttempts) {
    return (
      <div className="page-shell">
        <header className="page-header">
          <p className="page-eyebrow">Weakness Drills</p>
          <h1 className="page-title">Recommended Practice Blocks</h1>
          <p className="page-description">Targeted practice is based on your completed mock exam results.</p>
        </header>
        <section className="state-panel border-l-4 border-blue-600">
          <div className="inline-flex rounded-xl bg-blue-50 p-3 text-xl text-primary"><FaBrain /></div>
          <h2 className="mt-5 text-2xl font-black text-slate-950">Complete a mock exam to receive drill recommendations.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">After your first scored attempt, this page will use your subject results and question diagnostics to identify useful practice areas.</p>
          <Link to="/exam" className="button-primary mt-6"><FaPlay /> View Mock Exams</Link>
        </section>
      </div>
    );
  }

  if (activeSubject) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <button onClick={() => setActiveSubject(null)} className="button-secondary">
          <FaArrowLeft /> Back to Recommendations
        </button>

        <header className="page-header">
          <p className="page-eyebrow">Weakness Drill</p>
          <h1 className="page-title">{activeSubject} Practice Block</h1>
          <p className="page-description">Practice questions currently available for this subject category.</p>
        </header>

        {!questions.length ? (
          <div className="glass-card p-8">
            <h2 className="text-2xl font-black text-slate-950">No question pool available yet.</h2>
            <p className="mt-2 text-sm text-slate-600">No practice questions are available for this subject yet.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {questions.map((question, index) => (
              <article key={`${question.stem}-${index}`} className="glass-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-blue-600">Item {index + 1}</p>
                    <div className="mt-2 text-xl font-black text-slate-950" dangerouslySetInnerHTML={{ __html: question.stem }} />
                  </div>
                  {results && (
                    results.items[index].isCorrect ? <FaCheckCircle className="text-2xl text-emerald-500" /> : <FaTimesCircle className="text-2xl text-rose-500" />
                  )}
                </div>

                {renderQuestionInput(question, index)}

                {results && (
                  <div className={`mt-4 rounded-lg p-4 text-sm font-semibold ${results.items[index].isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                    {results.items[index].explanation}
                  </div>
                )}
              </article>
            ))}

            {!results ? (
              <button onClick={submitDrill} className="rounded-lg bg-primary px-5 py-3 text-sm font-black text-white hover:bg-blue-800">
                Submit Drill
              </button>
            ) : (
              <div className="glass-card border-l-4 border-blue-600 p-6">
                <p className="text-xs font-black uppercase tracking-wider text-blue-600">Drill Result</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">{results.pct}%</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{results.correct} of {results.total} correct</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <p className="page-eyebrow">Weakness Drills</p>
        <h1 className="page-title">Recommended Practice Blocks</h1>
        <p className="page-description">Based on your lowest-performing mock exam subject categories.</p>
      </header>

      <DiagnosticReport analysis={analysis} />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {analysis.weakSubjects.map((subject) => (
          <article key={subject.subject} className="glass-card p-6">
            <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-700">
              <FaBrain />
            </div>
            <h2 className="text-xl font-black text-slate-950">Recommended Drill: {subject.subject} Practice Block</h2>
            <p className="mt-2 text-sm text-slate-500">Average accuracy: {subject.averagePct}%</p>
            <p className="mt-1 text-sm text-slate-500">Lowest recent accuracy: {subject.lowestPct}%</p>
            <button onClick={() => startDrill(subject)} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-black text-white hover:bg-blue-800">
              <FaPlay /> Start Drill
            </button>
          </article>
        ))}
      </div>
    </div>
  );

  function renderQuestionInput(question, index) {
    const type = question.type || "multiple_choice";
    if (type === "multiple_choice" || type === "mcq") {
      return (
        <div className="mt-5 space-y-2">
          {question.choiceOpts.map((option, optionIndex) => (
            <button
              key={optionIndex}
              onClick={() => saveResponse(index, optionIndex)}
              disabled={Boolean(results)}
              className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-bold ${responses[index] === optionIndex ? "border-primary bg-blue-50 text-primary" : "border-slate-200 bg-white text-slate-700"}`}
            >
              <span>{String.fromCharCode(65 + optionIndex)}.</span> {option}
            </button>
          ))}
        </div>
      );
    }

    if (type === "checkboxes") {
      return (
        <div className="mt-5 space-y-2">
          {question.choiceOpts.map((option, optionIndex) => {
            const selected = Array.isArray(responses[index]) && responses[index].includes(optionIndex);
            return (
              <button
                key={optionIndex}
                onClick={() => toggleCheckbox(index, optionIndex)}
                disabled={Boolean(results)}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-bold ${selected ? "border-primary bg-blue-50 text-primary" : "border-slate-200 bg-white text-slate-700"}`}
              >
                <span>{selected ? "[x]" : "[ ]"}</span> {option}
              </button>
            );
          })}
        </div>
      );
    }

    return (
      <input
        value={responses[index] || ""}
        disabled={Boolean(results)}
        onChange={(event) => saveResponse(index, event.target.value)}
        className="mt-5 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        placeholder="Type your answer..."
      />
    );
  }
}

function DiagnosticReport({ analysis }) {
  const diagnostic = analysis.primaryDiagnostic;
  const narrative = buildDiagnosticNarrative(analysis);

  return (
    <section className="glass-card border-l-4 border-blue-600 bg-blue-50/40 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
      <p className="text-xs font-black uppercase tracking-wider text-blue-600">Performance Diagnostic</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">{diagnostic ? getDiagnosticHeadline(diagnostic) : "Personalized insights unlock after your first mock."}</h2>
        </div>
        {diagnostic && (
          <div className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-right">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">Avg. Time</p>
            <p className="text-lg font-black text-blue-700">{formatAverageTime(diagnostic.averageSeconds)}</p>
          </div>
        )}
      </div>

      <p className="mt-4 max-w-4xl text-sm font-semibold leading-7 text-slate-700">{narrative}</p>

      {diagnostic && (
        <div className="mt-5 flex flex-wrap gap-2">
          {diagnostic.path?.map((label) => (
            <span key={label} className="rounded-lg border border-blue-100 bg-white px-3 py-1.5 text-xs font-black text-slate-600">
              {label}
            </span>
          ))}
          <span className="rounded-lg border border-rose-100 bg-white px-3 py-1.5 text-xs font-black text-rose-600">
            {diagnostic.errors} error{diagnostic.errors === 1 ? "" : "s"} detected
          </span>
        </div>
      )}
    </section>
  );
}

function buildDiagnosticNarrative(analysis) {
  const diagnostic = analysis.primaryDiagnostic;
  if (!analysis.hasAttempts || !diagnostic) {
    return analysis.hasAttempts
      ? "Complete another mock exam to add more per-question timing, answer-change, and diagnostic data to this report."
      : "Take a mock exam first to identify performance bottlenecks and useful practice areas.";
  }

  const target = diagnostic.skillTag && diagnostic.skillTag !== "Untyped Skill"
    ? `${diagnostic.subcategory} with ${diagnostic.skillTag}`
    : diagnostic.subcategory || diagnostic.category;
  const remainingQuestions = Math.max(1, Math.round(diagnostic.errors * 2));

  if (diagnostic.insightType === "self-doubt") {
    return `Your recent attempts show correct choices changing to wrong answers under pressure during ${diagnostic.category}. Review your reasoning before changing an answer, especially for ${target}.`;
  }

  if (diagnostic.insightType === "time-bottleneck") {
    return `Timing data points to a bottleneck in ${target}. You spend an average of ${formatAverageTime(diagnostic.averageSeconds)} on these questions, which may leave less time for the final ${remainingQuestions} questions in that block.`;
  }

  return `Your misses are clustering around ${target}. The drills below prioritize available questions that match those diagnostic labels.`;
}

function getDiagnosticHeadline(diagnostic) {
  if (diagnostic.insightType === "self-doubt") return "Behavioral pattern: second-guessing under pressure";
  if (diagnostic.insightType === "time-bottleneck") return "Time bottleneck detected";
  return "Structural weakness detected";
}

function formatAverageTime(seconds = 0) {
  if (!seconds) return "No timing yet";
  if (seconds < 60) return `${seconds}s`;
  return `${(seconds / 60).toFixed(1)} min`;
}

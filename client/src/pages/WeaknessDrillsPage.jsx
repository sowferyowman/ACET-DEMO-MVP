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
      <div className="min-h-screen bg-gradient-to-b from-[#001c44] to-[#000c1d] p-6">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <p className="text-xs font-black uppercase tracking-wider text-blue-400">Weakness Drills</p>
            <h1 className="text-3xl font-black text-white mt-1">Recommended Practice Blocks</h1>
            <p className="text-white/50 mt-1">Targeted practice is based on your completed mock exam results.</p>
          </header>
          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
            <div className="inline-flex rounded-xl bg-blue-500/10 p-4 text-3xl text-blue-400"><FaBrain /></div>
            <h2 className="mt-4 text-2xl font-black text-white">Complete a mock exam to receive drill recommendations.</h2>
            <p className="mt-2 max-w-2xl mx-auto text-sm text-white/60">After your first scored attempt, this page will use your subject results and question diagnostics to identify useful practice areas.</p>
            <Link to="/exam" className="inline-flex items-center gap-2 mt-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-sm font-bold text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/25">
              <FaPlay /> View Mock Exams
            </Link>
          </section>
        </div>
      </div>
    );
  }

  if (activeSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#001c44] to-[#000c1d] p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <button onClick={() => setActiveSubject(null)} className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200">
            <FaArrowLeft /> Back to Recommendations
          </button>

          <header>
            <p className="text-xs font-black uppercase tracking-wider text-blue-400">Weakness Drill</p>
            <h1 className="text-3xl font-black text-white mt-1">{activeSubject} Practice Block</h1>
            <p className="text-white/50 mt-1">Practice questions currently available for this subject category.</p>
          </header>

          {!questions.length ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-black text-white">No question pool available yet.</h2>
              <p className="mt-2 text-sm text-white/50">No practice questions are available for this subject yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <article key={`${question.stem}-${index}`} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-xl shadow-black/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-black uppercase tracking-wider text-blue-400">Item {index + 1}</span>
                        {results && (
                          results.items[index].isCorrect ? 
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold"><FaCheckCircle /> Correct</span> : 
                            <span className="inline-flex items-center gap-1 text-rose-400 text-xs font-bold"><FaTimesCircle /> Incorrect</span>
                        )}
                      </div>
                      <div className="text-lg font-bold text-white" dangerouslySetInnerHTML={{ __html: question.stem }} />
                    </div>
                  </div>

                  {renderQuestionInput(question, index)}

                  {results && (
                    <div className={`mt-4 rounded-lg p-4 text-sm font-semibold ${results.items[index].isCorrect ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                      {results.items[index].explanation}
                    </div>
                  )}
                </article>
              ))}

              {!results ? (
                <button onClick={submitDrill} className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-sm font-black text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/25">
                  Submit Drill
                </button>
              ) : (
                <div className="bg-white/5 backdrop-blur-xl border border-blue-500/20 rounded-xl p-6 shadow-xl shadow-black/10">
                  <p className="text-xs font-black uppercase tracking-wider text-blue-400">Drill Result</p>
                  <h2 className="mt-2 text-3xl font-black text-white">{results.pct}%</h2>
                  <p className="mt-1 text-sm font-semibold text-white/60">{results.correct} of {results.total} correct</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001c44] to-[#000c1d] p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <p className="text-xs font-black uppercase tracking-wider text-blue-400">Weakness Drills</p>
          <h1 className="text-3xl font-black text-white mt-1">Recommended Practice Blocks</h1>
          <p className="text-white/50 mt-1">Based on your lowest-performing mock exam subject categories.</p>
        </header>

        <DiagnosticReport analysis={analysis} />

        {/* List-style landscape layout - Dark Theme */}
        <div className="space-y-3">
          {analysis.weakSubjects.map((subject) => (
            <article 
              key={subject.subject} 
              className="group flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-xl shadow-black/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-black/20 cursor-pointer"
              onClick={() => startDrill(subject)}
            >
              <div className="flex items-center gap-5 flex-1 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors duration-300">
                  <FaBrain className="text-xl" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white truncate">{subject.subject}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-white/50">Avg: <span className="text-white/80 font-semibold">{subject.averagePct}%</span></span>
                    <span className="text-sm text-white/50">Lowest: <span className="text-rose-400 font-semibold">{subject.lowestPct}%</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-xs text-white/50">Accuracy</span>
                    <span className="text-sm font-bold text-white">{subject.averagePct}%</span>
                  </div>
                  <button 
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      startDrill(subject);
                    }}
                  >
                    <FaPlay className="text-xs" /> Start
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );

  function renderQuestionInput(question, index) {
    const type = question.type || "multiple_choice";
    if (type === "multiple_choice" || type === "mcq") {
      return (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          {question.choiceOpts.map((option, optionIndex) => (
            <button
              key={optionIndex}
              onClick={() => saveResponse(index, optionIndex)}
              disabled={Boolean(results)}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-bold transition-all duration-200 ${
                responses[index] === optionIndex 
                  ? "border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10" 
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20"
              } ${results ? "cursor-not-allowed opacity-70" : ""}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-black">
                {String.fromCharCode(65 + optionIndex)}
              </span>
              {option}
            </button>
          ))}
        </div>
      );
    }

    if (type === "checkboxes") {
      return (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          {question.choiceOpts.map((option, optionIndex) => {
            const selected = Array.isArray(responses[index]) && responses[index].includes(optionIndex);
            return (
              <button
                key={optionIndex}
                onClick={() => toggleCheckbox(index, optionIndex)}
                disabled={Boolean(results)}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-bold transition-all duration-200 ${
                  selected 
                    ? "border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10" 
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20"
                } ${results ? "cursor-not-allowed opacity-70" : ""}`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-black">
                  {selected ? "✓" : "□"}
                </span>
                {option}
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
        className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white placeholder:text-white/30 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
        placeholder="Type your answer..."
      />
    );
  }
}

function DiagnosticReport({ analysis }) {
  const diagnostic = analysis.primaryDiagnostic;
  const narrative = buildDiagnosticNarrative(analysis);

  return (
    <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl shadow-black/10 mb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-blue-400">Performance Diagnostic</p>
          <h2 className="mt-2 text-2xl font-black text-white">{diagnostic ? getDiagnosticHeadline(diagnostic) : "Personalized insights unlock after your first mock."}</h2>
        </div>
        {diagnostic && (
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-right">
            <p className="text-xs font-black uppercase tracking-wider text-white/40">Avg. Time</p>
            <p className="text-lg font-black text-blue-400">{formatAverageTime(diagnostic.averageSeconds)}</p>
          </div>
        )}
      </div>

      <p className="mt-4 max-w-4xl text-sm font-semibold leading-7 text-white/70">{narrative}</p>

      {diagnostic && (
        <div className="mt-5 flex flex-wrap gap-2">
          {diagnostic.path?.map((label) => (
            <span key={label} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-black text-white/60">
              {label}
            </span>
          ))}
          <span className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-black text-rose-400">
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
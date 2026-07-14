import { useState } from "react";
import { FaBookOpen, FaCheckCircle } from "react-icons/fa";
import ResourceCard from "../features/studyPlan/ResourceCard";
import { getCurrentUser, getReviewerBlueprints, getReviewerProgress, setReviewerModuleCompletion } from "../services/storage";

export default function ReviewersPage() {
  const user = getCurrentUser();
  const reviewers = getReviewerBlueprints();
  const [progress, setProgress] = useState(() => getReviewerProgress(user?.email));

  function toggleModule(reviewerId, moduleId, completed) {
    const nextProgress = setReviewerModuleCompletion(user.email, reviewerId, moduleId, !completed);
    setProgress(nextProgress);
  }

  if (!reviewers.length) {
    return (
      <div className="page-shell">
        <header className="page-header"><p className="page-eyebrow">Study Plan</p><h1 className="page-title">Published Study Modules</h1><p className="page-description">Work through the reading materials and resources prepared for your ACET review.</p></header>
        <div className="state-panel border-l-4 border-slate-300">
          <p className="text-sm font-bold uppercase tracking-wider text-slate-500">No study modules yet</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Published study materials will appear here.</h2>
          <p className="mt-2 text-sm text-slate-600">Check back after new reviewers have been made available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <p className="page-eyebrow">Study Plan</p>
        <h1 className="page-title">Published Study Modules</h1>
        <p className="page-description">Read each module, use its attached resource, and update your progress as you study.</p>
      </header>

      <div className="space-y-6">
        {reviewers.map((reviewer) => {
          const completedModules = progress[reviewer.id] || [];
          return (
            <article key={reviewer.id} className="glass-card overflow-hidden">
              <div className="border-b border-slate-200 bg-slate-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-blue-50 p-3 text-blue-700">
                    <FaBookOpen />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-blue-600">{reviewer.subjectCategory}</p>
                    <h2 className="mt-1 text-2xl font-black text-slate-950">{reviewer.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{completedModules.length} of {reviewer.modules.length} modules completed</p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {reviewer.modules.map((module, index) => {
                  const completed = completedModules.includes(module.id);
                  return (
                    <section key={module.id} className="grid gap-6 p-6 lg:grid-cols-[1fr_18rem]">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-wider text-slate-400">Chapter {index + 1}</p>
                        <h3 className="mt-1 text-xl font-black text-slate-900">{module.title}</h3>
                        <div className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">{module.content}</div>
                        <button
                          onClick={() => toggleModule(reviewer.id, module.id, completed)}
                          aria-pressed={completed}
                          className={`mt-5 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-black transition focus-visible:outline-none focus-visible:ring-4 ${completed ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-100" : "border-primary bg-primary text-white hover:bg-blue-800 focus-visible:ring-blue-100"}`}
                        >
                          <FaCheckCircle /> {completed ? "Mark as incomplete" : "Mark as complete"}
                        </button>
                      </div>

                      <aside><ResourceCard url={module.videoUrl} title={module.title} /></aside>
                    </section>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from "react";
import { FaBookOpen, FaCheckCircle, FaPlayCircle } from "react-icons/fa";
import { getCurrentUser, getReviewerBlueprints, getReviewerProgress, markReviewerModuleComplete } from "../services/storage";

export default function ReviewersPage() {
  const user = getCurrentUser();
  const reviewers = getReviewerBlueprints();
  const [progress, setProgress] = useState(() => getReviewerProgress(user?.email));

  function completeModule(reviewerId, moduleId) {
    markReviewerModuleComplete(user.email, reviewerId, moduleId);
    setProgress(getReviewerProgress(user.email));
  }

  if (!reviewers.length) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="glass-card p-8">
          <p className="text-sm font-bold uppercase tracking-wider text-slate-500">No reviewers yet</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Admin-created reviewers will appear here.</h2>
          <p className="mt-2 text-sm text-slate-500">Publish a reviewer from the Admin Workspace to sync course modules into this student view.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <p className="text-sm font-black uppercase tracking-wider text-blue-600">Student Reviewers</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Published Study Modules</h1>
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
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-slate-400">Chapter {index + 1}</p>
                        <h3 className="mt-1 text-xl font-black text-slate-900">{module.title}</h3>
                        <div className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">{module.content}</div>
                        <button
                          onClick={() => completeModule(reviewer.id, module.id)}
                          disabled={completed}
                          className={`mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-black ${completed ? "bg-emerald-50 text-emerald-700" : "bg-primary text-white hover:bg-blue-800"}`}
                        >
                          <FaCheckCircle /> {completed ? "Completed" : "Mark as Complete"}
                        </button>
                      </div>

                      <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                          <FaPlayCircle className="text-blue-600" /> Video Resource
                        </div>
                        {module.videoUrl ? (
                          <a href={module.videoUrl} target="_blank" rel="noreferrer" className="mt-3 block break-words text-sm font-bold text-blue-700 hover:text-blue-900">
                            {module.videoUrl}
                          </a>
                        ) : (
                          <p className="mt-3 text-sm text-slate-500">No video link provided for this module.</p>
                        )}
                      </aside>
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

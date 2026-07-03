import { FaBrain, FaPlay } from "react-icons/fa";

export default function ExamHistory({ exams, aiInsight }) {
  const hasAiInsight = Boolean(aiInsight);

  return (
    <section id="exams" className="space-y-6">
      <header>
        <h2 className="text-3xl font-black text-slate-950">Exam History and AI Analysis</h2>
        <p className="mt-1 text-sm text-slate-500">Review completed mocks and AI-flagged weaknesses.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="glass-card overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
              <h3 className="text-sm font-bold text-slate-800">Full Mock Exam Log</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-white text-xs uppercase text-slate-500 shadow-sm">
                  <tr>
                    <th className="px-6 py-3 font-bold">Exam Name</th>
                    <th className="px-6 py-3 font-bold">Score</th>
                    <th className="px-6 py-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr key={`${exam.name}-${exam.takenAt}`} className="border-b transition hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {exam.name}
                        <span className="block text-xs font-normal text-slate-400">{exam.takenAt}</span>
                      </td>
                      <td className="px-6 py-4 text-lg font-black text-blue-600">{exam.score}%</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{exam.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {hasAiInsight && <div className="glass-card border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-white p-6">
            <div className="mb-4 flex items-center gap-4">
              <FaBrain className="text-3xl text-purple-600" />
              <div>
                <h3 className="text-xl font-black text-slate-950">{aiInsight.title}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-purple-600">{aiInsight.priority}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">{aiInsight.detail}</p>
          </div>}
        </div>

        <div className="glass-card h-max border-t-4 border-indigo-500 p-6">
          <h3 className="font-black text-slate-950">AI Intervention Quizzes</h3>
          <p className="mb-4 mt-1 text-xs text-slate-500">Generated to fix specific error patterns.</p>
          <div className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-indigo-500 hover:shadow-md">
            <p className="text-sm font-bold text-slate-950">Syllogism Drill</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">5 mins, 10 items</p>
              <button className="inline-flex items-center gap-2 rounded bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white">
                <FaPlay /> Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

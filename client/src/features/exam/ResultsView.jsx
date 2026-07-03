import { FaArrowLeft, FaBrain } from "react-icons/fa";

export default function ResultsView({ results, onBack }) {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <button onClick={onBack} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">
          <FaArrowLeft /> Dashboard
        </button>

        <div className="glass-card p-8 text-center">
          <p className="text-xs font-black uppercase tracking-wider text-blue-600">Mock Complete</p>
          <h1 className="mt-2 text-5xl font-black text-slate-950">{results?.finalPct ?? 0}%</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            {results?.correct ?? 0} / {results?.total ?? 0} items correct
          </p>
          <p className="mt-4 text-sm text-slate-600">AI target score after interventions: {results?.targetScore ?? 0}%</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {results?.subjectScores?.map((subject) => (
            <div key={subject.title} className="glass-card p-5">
              <div className="mb-2 flex items-end justify-between">
                <h3 className="font-black text-slate-800">{subject.title}</h3>
                <span className="text-sm font-black text-slate-500">{subject.pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div className={`h-full ${subject.pct >= 80 ? "bg-emerald-500" : subject.pct < 70 ? "bg-rose-500" : "bg-blue-600"}`} style={{ width: `${subject.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-950">AI Generated Drills</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {results?.weaknesses?.length ? (
              results.weaknesses.map((weakness) => (
                <div key={weakness.title} className="glass-card border-rose-100 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <FaBrain className="text-rose-500" />
                    <h3 className="font-black text-slate-800">{weakness.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500">
                    Focus required on <strong className="text-slate-700">{weakness.topicFocus}</strong>.
                  </p>
                  <button className="mt-4 w-full rounded-lg bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800">Start 5-Min Drill</button>
                </div>
              ))
            ) : (
              <div className="glass-card bg-emerald-600 p-6 text-white md:col-span-2">
                <h3 className="text-xl font-black">Exceptional Performance</h3>
                <p className="mt-2 text-sm text-emerald-50">You scored above 80% in all subjects. An advanced challenge set is ready.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

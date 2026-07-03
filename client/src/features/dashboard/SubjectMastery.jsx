const bars = {
  emerald: "bg-emerald-500 text-emerald-600",
  blue: "bg-blue-500 text-blue-600",
  amber: "bg-amber-400 text-amber-600",
  rose: "bg-rose-500 text-rose-600"
};

export default function SubjectMastery({ subjects }) {
  return (
    <div className="glass-card p-6">
      <h3 className="mb-6 text-lg font-bold text-slate-800">Aggregate Subject Mastery</h3>
      <div className="space-y-6">
        {subjects.map((subject) => (
          <div key={subject.name}>
            <div className="mb-1 flex items-end justify-between">
              <span className="text-sm font-bold text-slate-700">{subject.name}</span>
              <span className={`text-sm font-black ${bars[subject.color]?.split(" ")[1]}`}>{subject.mastery}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div className={`h-full rounded-full ${bars[subject.color]?.split(" ")[0]}`} style={{ width: `${subject.mastery}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

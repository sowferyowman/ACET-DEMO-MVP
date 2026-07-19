const bars = {
  emerald: "bg-emerald-500 text-emerald-600",
  blue: "bg-sky-500 text-sky-600",
  amber: "bg-amber-400 text-amber-600",
  rose: "bg-rose-500 text-rose-600"
};

export default function SubjectMastery({ subjects }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300">
      <h3 className="mb-6 text-lg font-black text-slate-800 tracking-tight">
        Aggregate Subject Mastery
      </h3>
      
      {subjects.length ? (
        <div className="space-y-6">
          {subjects.map((subject) => (
            <div 
              key={subject.name} 
              className="group/row transition-all duration-300 hover:scale-[1.01] hover:translate-x-1"
            >
              <div className="mb-1.5 flex items-end justify-between">
                <span className="text-sm font-bold text-slate-700 transition-colors duration-300 group-hover/row:text-slate-950">
                  {subject.name}
                </span>
                <span className={`text-sm font-black transition-colors duration-300 ${bars[subject.color]?.split(" ")[1] || "text-slate-600 dark:text-slate-400"}`}>
                  {subject.mastery}%
                </span>
              </div>
              
              <div className="h-3 overflow-hidden rounded-full bg-slate-200 p-[1.5px] transition-all duration-300">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(59,130,246,0.25)] ${bars[subject.color]?.split(" ")[0] || "bg-slate-500"}`} 
                  style={{ width: `${subject.mastery}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
          <div>
            <p className="text-sm font-black text-slate-700">No mastery data yet</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Subject bars appear after a scored exam.</p>
          </div>
        </div>
      )}
    </div>
  );
}

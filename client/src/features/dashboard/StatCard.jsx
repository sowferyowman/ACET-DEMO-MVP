const accents = {
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
  purple: "border-violet-200 bg-violet-50 text-violet-700",
  teal: "border-emerald-200 bg-emerald-50 text-emerald-700"
};

export default function StatCard({ stat }) {
  const accent = accents[stat.accent] || accents.blue;

  return (
    <div className={`rounded-2xl border p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${accent}`}>
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">{stat.label}</p>
      <p className="mt-2 text-3xl font-black text-slate-900">{stat.value}</p>
      <p className="mt-3 inline-flex rounded-lg bg-white/75 px-3 py-1.5 text-xs font-bold">
        {stat.detail}
      </p>
    </div>
  );
}

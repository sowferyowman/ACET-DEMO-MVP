const accents = {
  blue: "border-blue-600 text-blue-700 bg-blue-50",
  indigo: "border-indigo-500 text-indigo-700 bg-indigo-50",
  purple: "border-purple-500 text-purple-700 bg-purple-50",
  teal: "border-teal-500 text-teal-700 bg-teal-50"
};

export default function StatCard({ stat }) {
  return (
    <div className={`glass-card relative overflow-hidden border-l-4 p-6 ${accents[stat.accent] || accents.blue}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
      <p className="mt-2 text-3xl font-black text-slate-800">{stat.value}</p>
      <p className="mt-3 inline-flex rounded bg-white/70 px-2 py-1 text-xs font-bold">{stat.detail}</p>
    </div>
  );
}

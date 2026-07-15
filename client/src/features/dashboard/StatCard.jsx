export default function StatCard({ stat }) {
  // Map accent colors to gradient classes
  const getGradient = (accent) => {
    const gradients = {
      blue: 'from-blue-400 to-blue-600',
      indigo: 'from-indigo-400 to-indigo-600',
      purple: 'from-purple-400 to-purple-600',
      teal: 'from-teal-400 to-teal-600'
    };
    return gradients[accent] || gradients.blue;
  };

  // Map accent colors to text colors
  const getTextColor = (accent) => {
    const colors = {
      blue: 'text-blue-400',
      indigo: 'text-indigo-400',
      purple: 'text-purple-400',
      teal: 'text-teal-400'
    };
    return colors[accent] || colors.blue;
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl shadow-black/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20">
      {/* Spotlight glow effect */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/5 blur-2xl group-hover:from-blue-400/20 group-hover:to-blue-500/10 transition-all duration-500"></div>
      
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${getGradient(stat.accent)} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <p className="text-xs font-bold uppercase tracking-wider text-white/50">{stat.label}</p>
        <p className={`mt-2 text-3xl font-black ${getTextColor(stat.accent)}`}>
          {stat.value}
        </p>
        <p className="mt-3 inline-flex rounded-lg bg-white/5 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-white/40 border border-white/5">
          {stat.detail}
        </p>
      </div>
    </div>
  );
}
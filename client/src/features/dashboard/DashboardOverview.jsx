import { FaDownload } from "react-icons/fa";
import ProgressChart from "./ProgressChart";
import StatCard from "./StatCard";
import SubjectMastery from "./SubjectMastery";

export default function DashboardOverview({ data }) {
  const examCount = data.exams.length;

  return (
    <section id="dashboard" className="space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-950">ACET Performance Overview</h2>
          <p className="mt-1 text-sm text-slate-500">Metrics based on {examCount} completed mock examination{examCount === 1 ? "" : "s"}.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50">
          <FaDownload /> Export Report
        </button>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800">Exam Progression Trajectory</h3>
          <div className="mt-4 h-72">
            <ProgressChart points={data.progression} />
          </div>
        </div>
        <SubjectMastery subjects={data.subjects} />
      </div>
    </section>
  );
}

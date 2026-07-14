import { useDashboardData } from "../hooks/useDashboardData";
import DashboardOverview from "../features/dashboard/DashboardOverview";
import ExamHistory from "../features/exams/ExamHistory";
import StudyPlan from "../features/studyPlan/StudyPlan";

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="glass-card p-8">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Loading database metrics</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Checking your student records...</h2>
          <p className="mt-2 text-sm text-slate-500">Charts and metrics will render after the API returns live dashboard data.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="glass-card border-l-4 border-rose-500 p-8">
          <p className="text-sm font-bold uppercase tracking-wider text-rose-600">Dashboard unavailable</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Unable to reach the database-backed API.</h2>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.hasDashboardData) {
    return (
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="glass-card p-8">
          <p className="text-sm font-bold uppercase tracking-wider text-slate-500">No dashboard records yet</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Complete an exam attempt to generate your dashboard.</h2>
          <p className="mt-2 text-sm text-slate-500">Your premium 4-week preparation plan is already loaded below while performance charts wait for your first scored mock.</p>
        </div>
        <StudyPlan items={data?.studyPlan || []} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <DashboardOverview data={data} />
      <ExamHistory exams={data.exams} aiInsight={data.aiInsight} />
      <StudyPlan items={data.studyPlan} />
    </div>
  );
}


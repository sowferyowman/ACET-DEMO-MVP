import { Link } from "react-router-dom";
import { FaArrowRight, FaChartLine, FaExclamationTriangle } from "react-icons/fa";
import { useDashboardData } from "../hooks/useDashboardData";
import DashboardOverview from "../features/dashboard/DashboardOverview";
import ExamHistory from "../features/exams/ExamHistory";
import StudyPlan from "../features/studyPlan/StudyPlan";
import { getCurrentUser } from "../services/storage";

export default function DashboardPage() {
  const { data, loading, error, retry } = useDashboardData();
  const user = getCurrentUser();
  const displayName = user?.nickname || user?.name || "Student";

  if (loading) {
    return (
      <div className="page-shell" aria-live="polite" aria-busy="true">
        <div className="state-panel border-l-4 border-blue-600">
          <p className="page-eyebrow">Loading dashboard</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Checking your student records...</h2>
          <p className="mt-2 text-sm text-slate-600">Your performance summary will appear in a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell">
        <div className="state-panel border-l-4 border-rose-500" role="alert">
          <FaExclamationTriangle className="text-xl text-rose-600" />
          <p className="text-sm font-bold uppercase tracking-wider text-rose-600">Dashboard unavailable</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">We couldn’t load your dashboard.</h2>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <button type="button" onClick={retry} className="button-primary mt-6">Try Again</button>
        </div>
      </div>
    );
  }

  if (!data || !data.hasDashboardData) {
    return (
      <div className="page-shell">
        <header className="page-header">
          <p className="page-eyebrow">Dashboard</p>
          <h1 className="page-title">Welcome back, {displayName}</h1>
          <p className="page-description">Your ACET preparation progress and study plan live here.</p>
        </header>
        <div className="state-panel border-l-4 border-blue-600">
          <div className="inline-flex rounded-xl bg-blue-50 p-3 text-xl text-primary"><FaChartLine /></div>
          <p className="mt-5 text-sm font-bold uppercase tracking-wider text-slate-500">No exam analytics yet</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Complete a scored mock exam to unlock your performance dashboard.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Scores, subject mastery, and attempt history will appear here after your first completed mock. Until then, you can review the study plan below.</p>
          <Link to="/exam" className="button-primary mt-6">View Mock Exams <FaArrowRight /></Link>
        </div>
        <StudyPlan items={data?.studyPlan || []} />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <p className="page-eyebrow">Dashboard</p>
        <h1 className="page-title">Welcome back, {displayName}</h1>
        <p className="page-description">Review your latest ACET performance and continue your preparation.</p>
      </header>
      <DashboardOverview data={data} />
      <ExamHistory exams={data.exams} aiInsight={data.aiInsight} />
      <StudyPlan items={data.studyPlan} />
    </div>
  );
}


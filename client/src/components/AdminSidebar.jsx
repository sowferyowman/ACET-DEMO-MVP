import { useNavigate } from "react-router-dom";
import { FaBookOpen, FaBullseye, FaClipboardList, FaGraduationCap, FaSignOutAlt } from "react-icons/fa";
import { getCurrentUser, logoutUser } from "../services/storage";

export default function AdminSidebar({ active = "exam", onModeChange }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  function goToBuilder(mode) {
    onModeChange?.(mode);
    navigate(`/admin/dashboard?mode=${mode}`);
  }

  function logout() {
    logoutUser();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-slate-950 text-white shadow-xl md:flex">
      <div className="flex items-center gap-3 p-6">
        <div className="rounded-lg bg-white p-2 text-slate-950 shadow-lg">
          <FaGraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">EXAMS.PH</h1>
          <p className="text-[10px] font-bold tracking-widest text-blue-200">ADMIN PANEL</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        <button
          onClick={() => goToBuilder("exam")}
          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
            active === "exam" ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <FaClipboardList /> Create Exam
        </button>
        <button
          onClick={() => goToBuilder("reviewer")}
          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
            active === "reviewer" ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <FaBookOpen /> Create Reviewer
        </button>
        <button
          onClick={() => navigate("/admin/drills")}
          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
            active === "drill" ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <FaBullseye /> Create Drill
        </button>
      </nav>

      <div className="border-t border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-white text-sm font-black text-slate-950">AD</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{user?.name || "Admin Workspace"}</p>
            <p className="text-xs font-semibold text-blue-300">Admin Account</p>
          </div>
          <button onClick={logout} className="text-slate-300 transition hover:text-white" aria-label="Logout">
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </aside>
  );
}

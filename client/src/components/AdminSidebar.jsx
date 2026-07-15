import { useNavigate } from "react-router-dom";
import { FaBookOpen, FaBullseye, FaClipboardList, FaGraduationCap, FaSignOutAlt } from "react-icons/fa";
import { getCurrentUser, logoutUser } from "../services/storage";

export default function AdminSidebar({ active = "exam", onModeChange }) {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const displayName = user?.name || "Admin Workspace";
  const initials = getInitials(displayName);

  function goToBuilder(mode) {
    onModeChange?.(mode);
    navigate(`/admin/dashboard?mode=${mode}`);
  }

  function logout() {
    logoutUser();
    navigate("/login", { replace: true });
  }

  return (
    <>
      <style>{`
        /* Consistent Premium Ateneo Blue Sidebar Studio Gradient */
        .sidebar-gradient {
          background-color: #00122c !important;
          background-image: linear-gradient(180deg, #001c44 0%, #000c1d 100%) !important;
        }

        /* Profile Banner matching background tint */
        .profile-container {
          background-color: rgba(0, 12, 29, 0.6) !important;
        }
      `}</style>

      <aside className="sidebar-gradient hidden w-64 shrink-0 flex-col text-white shadow-xl border-r border-white/5 md:flex">
        {/* Header Block */}
        <div className="flex items-center gap-3 p-6">
          <div className="rounded-xl bg-white/10 border border-white/10 p-2 text-white shadow-lg backdrop-blur-sm">
            <FaGraduationCap className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-black tracking-tight text-white leading-none">EXAMS.PH</h1>
            <p className="text-[9px] font-black tracking-[0.25em] text-blue-400 mt-1">ADMIN PANEL</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-4" aria-label="Admin navigation">
          <button
            type="button"
            onClick={() => goToBuilder("exam")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/25 ${
              active === "exam"
                ? "bg-white/10 text-white border border-white/10 shadow-inner"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <FaClipboardList className="shrink-0 text-base" /> 
            <span>Create Exam</span>
          </button>

          <button
            type="button"
            onClick={() => goToBuilder("reviewer")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/25 ${
              active === "reviewer"
                ? "bg-white/10 text-white border border-white/10 shadow-inner"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <FaBookOpen className="shrink-0 text-base" /> 
            <span>Create Reviewer</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/drills")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/25 ${
              active === "drill"
                ? "bg-white/10 text-white border border-white/10 shadow-inner"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <FaBullseye className="shrink-0 text-base" /> 
            <span>Create Drill</span>
          </button>
        </nav>

        {/* Profile Footer block */}
        <div className="profile-container border-t border-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-sm font-black text-white shadow-inner">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white leading-tight">{displayName}</p>
              <p className="text-[11px] font-bold text-blue-400 mt-0.5">Admin Account</p>
            </div>
            <button 
              onClick={logout} 
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20" 
              aria-label="Log out" 
              title="Log out"
            >
              <FaSignOutAlt />
            </button>
          </div>  
        </div>
      </aside>
    </>
  );
}

function getInitials(value) {
  return String(value || "Admin Workspace")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
import { Outlet, useNavigate } from "react-router-dom";
import { FaBrain, FaCalendarAlt, FaChartLine, FaGraduationCap, FaTrophy } from "react-icons/fa";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: FaChartLine },
  { id: "exams", label: "My Exams and AI", icon: FaBrain },
  { id: "plan", label: "Smart Study Plan", icon: FaCalendarAlt },
  { id: "community", label: "Community Rewards", icon: FaTrophy }
];

export default function DashboardLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col bg-primary text-white shadow-xl md:flex">
        <div className="flex items-center gap-3 p-6">
          <div className="rounded-lg bg-white p-2 text-primary shadow-lg">
            <FaGraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">EXAMS.PH</h1>
            <p className="text-[10px] font-bold tracking-widest text-blue-200">ENTERPRISE PREP</p>
          </div>
        </div>

        <div className="px-4 pb-6">
          <button
            onClick={() => navigate("/exam")}
            className="w-full rounded-lg bg-blue-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-blue-400"
          >
            Start ACET Mock
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                href={`#${item.id}`}
                key={item.id}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-blue-100 transition hover:bg-blue-800 hover:text-white first:bg-white first:text-primary"
              >
                <Icon /> {item.label}
              </a>
            );
          })}
        </nav>

        <div className="border-t border-blue-800 bg-blue-950 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-white text-sm font-black text-primary">SM</div>
            <div>
              <p className="text-sm font-bold">Stanly Mejia</p>
              <p className="text-xs font-semibold text-yellow-300">Student Account</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-5 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaBell, FaBookOpen, FaBrain, FaBars, FaChartLine, FaClipboardList, FaCog, FaComments, FaGraduationCap, FaSignOutAlt, FaTimes, FaTrophy } from "react-icons/fa";
import { getCurrentUser, getNotificationsForUser, logoutUser, markNotificationsRead } from "../services/storage";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: FaChartLine },
  { to: "/exam", label: "Mock Exams", icon: FaClipboardList },
  { to: "/reviewers", label: "Study Plan", icon: FaBookOpen },
  { to: "/weakness-drills", label: "Weakness Drills", icon: FaBrain },
  { to: "/community", label: "Community Forum", icon: FaComments },
  { to: "/rewards", label: "Rewards & Badges", icon: FaTrophy },
  { to: "/settings", label: "Settings", icon: FaCog }
];

const SIDEBAR_PREFERENCE_KEY = "acetStudentSidebarCollapsed";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentUser());
  const [notifications, setNotifications] = useState(() => getNotificationsForUser(getCurrentUser()?.id));
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem(SIDEBAR_PREFERENCE_KEY) === "true");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const displayName = user?.nickname || user?.name || user?.email || "Student";
  const initials = getInitials(displayName);
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  useEffect(() => {
    localStorage.setItem(SIDEBAR_PREFERENCE_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function closeOnEscape(event) {
      if (event.key === "Escape") setMobileMenuOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    function refreshUser(event) {
      const nextUser = event.detail || getCurrentUser();
      setUser(nextUser);
      setNotifications(getNotificationsForUser(nextUser?.id));
    }

    window.addEventListener("currentActiveUserUpdated", refreshUser);
    window.addEventListener("storage", refreshUser);
    return () => {
      window.removeEventListener("currentActiveUserUpdated", refreshUser);
      window.removeEventListener("storage", refreshUser);
    };
  }, []);

  useEffect(() => {
    function refreshNotifications() {
      setNotifications(getNotificationsForUser(user?.id));
    }

    window.addEventListener("notificationsUpdated", refreshNotifications);
    window.addEventListener("storage", refreshNotifications);
    return () => {
      window.removeEventListener("notificationsUpdated", refreshNotifications);
      window.removeEventListener("storage", refreshNotifications);
    };
  }, [user?.id]);

  function toggleNotifications() {
    setNotificationsOpen((open) => {
      const nextOpen = !open;
      if (nextOpen && user?.id) {
        setNotifications(markNotificationsRead(user.id));
      }
      return nextOpen;
    });
  }

  function openNotification(notificationId) {
    if (!user?.id) return;
    setNotifications(markNotificationsRead(user.id, notificationId));
    setNotificationsOpen(false);
  }

  function logout() {
    logoutUser();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className={`hidden shrink-0 flex-col bg-primary text-white shadow-xl transition-[width] duration-200 md:flex ${sidebarCollapsed ? "w-20" : "w-64"}`}>
        <div className={`flex items-center ${sidebarCollapsed ? "justify-center p-4" : "gap-3 p-6"}`}>
          <div className="rounded-lg bg-white p-2 text-primary shadow-lg">
            <FaGraduationCap className="h-6 w-6" />
          </div>
          {!sidebarCollapsed && <div className="min-w-0">
            <h1 className="text-2xl font-black tracking-tight">EXAMS.PH</h1>
            <p className="text-[10px] font-bold tracking-widest text-blue-200">STUDENT PREP</p>
          </div>}
        </div>

        <div className={`pb-5 ${sidebarCollapsed ? "px-3" : "px-4"}`}>
          <button
            onClick={() => navigate("/exam")}
            className={`flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 text-sm font-bold text-white transition hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/50 ${sidebarCollapsed ? "h-11 px-0" : "px-4 py-2.5"}`}
            aria-label="Start ACET mock exam"
            title={sidebarCollapsed ? "Start ACET mock exam" : undefined}
          >
            <FaClipboardList /> {!sidebarCollapsed && "Mock Exam"}
          </button>
        </div>

        <nav className={`flex-1 space-y-2 ${sidebarCollapsed ? "px-3" : "px-4"}`} aria-label="Student navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                to={item.to}
                key={item.to}
                title={sidebarCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center rounded-lg py-3 text-sm font-semibold transition hover:bg-blue-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-200 ${sidebarCollapsed ? "justify-center px-0" : "gap-3 px-4"} ${
                    isActive ? "bg-white text-primary" : "text-blue-100"
                  }`
                }
              >
                <Icon className="shrink-0" /> {!sidebarCollapsed && item.label}
                {sidebarCollapsed && <span className="sr-only">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setSidebarCollapsed((value) => !value)}
          className="mx-3 mb-3 inline-flex items-center justify-center gap-2 rounded-lg border border-blue-700 px-3 py-2 text-xs font-bold text-blue-100 transition hover:bg-blue-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={sidebarCollapsed ? "Expand sidebar" : undefined}
        >
          {sidebarCollapsed ? <FaAngleDoubleRight /> : <><FaAngleDoubleLeft /> Collapse</>}
        </button>

        <div className={`border-t border-blue-800 bg-blue-950 ${sidebarCollapsed ? "p-3" : "p-4"}`}>
          <div className={`flex items-center ${sidebarCollapsed ? "flex-col gap-3" : "gap-3"}`}>
            <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-white text-sm font-black text-primary">{initials}</div>
            {!sidebarCollapsed && <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{displayName}</p>
              <p className="text-xs font-semibold text-yellow-300">Student Account</p>
            </div>}
            <button onClick={logout} className="rounded-lg p-2 text-blue-100 transition hover:bg-blue-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200" aria-label="Log out" title={sidebarCollapsed ? "Log out" : undefined}>
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </aside>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button className="absolute inset-0 bg-slate-950/55" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation menu" />
          <aside id="student-mobile-navigation" className="relative flex h-full w-[min(20rem,88vw)] flex-col bg-primary text-white shadow-2xl" aria-label="Student navigation">
            <div className="flex items-center justify-between border-b border-blue-800 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white p-2 text-primary"><FaGraduationCap /></div>
                <div><p className="text-xl font-black">EXAMS.PH</p><p className="text-[10px] font-bold tracking-widest text-blue-200">STUDENT PREP</p></div>
              </div>
              <button className="rounded-lg p-2 text-blue-100 hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation menu"><FaTimes /></button>
            </div>
            <nav className="flex-1 space-y-2 overflow-y-auto p-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return <NavLink key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 ${isActive ? "bg-white text-primary" : "text-blue-100 hover:bg-blue-800"}`}><Icon />{item.label}</NavLink>;
              })}
            </nav>
            <div className="border-t border-blue-800 bg-blue-950 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-sm font-black text-primary">{initials}</div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{displayName}</p><p className="truncate text-xs text-blue-200">{user?.email}</p></div>
                <button onClick={logout} className="rounded-lg p-2 text-blue-100 hover:bg-blue-800" aria-label="Log out"><FaSignOutAlt /></button>
              </div>
            </div>
          </aside>
        </div>
      )}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-4">
            <button type="button" onClick={() => setMobileMenuOpen(true)} className="icon-button md:hidden" aria-label="Open navigation menu" aria-expanded={mobileMenuOpen} aria-controls="student-mobile-navigation"><FaBars /></button>
            <div className="hidden md:block" aria-hidden="true" />
            <div className="relative">
              <button
                type="button"
                onClick={toggleNotifications}
                className="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                aria-label={notificationsOpen ? "Close notifications" : "Open notifications"}
                aria-expanded={notificationsOpen}
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-rose-600 px-1.5 text-[10px] font-black text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-[min(20rem,calc(100vw-2.5rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                  <div className="border-b border-slate-100 p-4">
                    <p className="text-sm font-black text-slate-950">Notifications</p>
                    <p className="text-xs font-semibold text-slate-500">Latest student updates and forum activity</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.slice(0, 8).map((notification) => (
                      <button
                        type="button"
                        key={notification.id}
                        onClick={() => openNotification(notification.id)}
                        className="block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50"
                      >
                        <div className="flex items-start gap-3">
                          <span className={`mt-1 h-2.5 w-2.5 rounded-full ${notification.isRead ? "bg-slate-200" : "bg-rose-500"}`} />
                          <div className="min-w-0">
                            <p className="break-words text-sm font-bold text-slate-800">{notification.message}</p>
                            <p className="mt-1 text-xs font-semibold text-slate-400">{formatNotificationTime(notification.timestamp)}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                    {!notifications.length && <p className="p-4 text-sm font-semibold text-slate-500">No notifications yet.</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="p-5 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function getInitials(value) {
  return String(value || "Student")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatNotificationTime(timestamp) {
  const diffMs = Date.now() - Number(timestamp || 0);
  const minutes = Math.max(1, Math.round(diffMs / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

import { useState } from "react";
import { FaCheckCircle, FaGoogle, FaMobileAlt, FaSave, FaUserCircle } from "react-icons/fa";
import { getCurrentUser, updateCurrentStudentProfile } from "../services/storage";

export default function SettingsPage() {
  const currentUser = getCurrentUser();
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    nickname: currentUser?.nickname || "",
    smsNumber: currentUser?.smsNumber || ""
  });
  const [message, setMessage] = useState("");

  function saveSettings(event) {
    event.preventDefault();
    updateCurrentStudentProfile({
      name: form.name.trim(),
      nickname: form.nickname.trim(),
      smsNumber: form.smsNumber.trim()
    });
    setMessage("Settings saved. Your sidebar profile has been updated.");
  }

  const displayName = form.nickname || form.name || currentUser?.email || "Student";
  const initials = getInitials(displayName);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-black uppercase tracking-wider text-blue-600">Student Workspace</p>
        <h1 className="text-3xl font-black text-slate-950">Settings</h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">Manage identity, recovery, and connected services for this local student account.</p>
      </header>

      <form onSubmit={saveSettings} className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <section className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-xl font-black text-primary">
                {initials || <FaUserCircle />}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">Profile Avatar Placeholder</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">{displayName}</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Displayed Name" value={form.name} onChange={(name) => setForm((current) => ({ ...current, name }))} placeholder="Full name" />
              <Field label="Nickname" value={form.nickname} onChange={(nickname) => setForm((current) => ({ ...current, nickname }))} placeholder="Sidebar display name" />
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-primary">
                <FaMobileAlt />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">Security & Recovery</p>
                <h2 className="text-xl font-black text-slate-950">SMS Recovery Number</h2>
              </div>
            </div>
            <Field label="Linked Mobile Number (SMS)" value={form.smsNumber} onChange={(smsNumber) => setForm((current) => ({ ...current, smsNumber }))} placeholder="+639123456789" className="mt-5" />
          </div>
        </section>

        <aside className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-rose-50 text-rose-500">
                  <FaGoogle />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">Connected Services</p>
                  <h2 className="text-lg font-black text-slate-950">Google Sign-In</h2>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${currentUser?.isGoogleLinked ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {currentUser?.isGoogleLinked ? "Linked" : "Not Linked"}
              </span>
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
              {currentUser?.isGoogleLinked
                ? "This profile was created or accessed through Google Sign-In."
                : "Use the Google button on the login page to link a Google-backed student profile."}
            </p>
          </div>

          <div className="glass-card p-6">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Account Health</p>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-700">
              <FaCheckCircle />
              <p className="text-sm font-black">Profile onboarding complete</p>
            </div>
          </div>

          <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition hover:bg-blue-800">
            <FaSave /> Save Settings
          </button>
          {message && <p className="rounded-lg bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">{message}</p>}
        </aside>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        placeholder={placeholder}
      />
    </label>
  );
}

function getInitials(value) {
  return String(value || "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

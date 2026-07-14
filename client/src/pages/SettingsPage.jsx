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
  const normalizedSms = form.smsNumber.replace(/[\s()-]/g, "");
  const smsIsValid = !normalizedSms || /^\+?\d{10,15}$/.test(normalizedSms);

  function saveSettings(event) {
    event.preventDefault();
    if (!smsIsValid) {
      setMessage("Enter a valid mobile number before saving.");
      return;
    }
    updateCurrentStudentProfile({
      name: form.name.trim(),
      nickname: form.nickname.trim(),
      smsNumber: form.smsNumber.trim()
    });
    setMessage("Settings saved. Your profile has been updated.");
  }

  const displayName = form.nickname || form.name || currentUser?.email || "Student";
  const initials = getInitials(displayName);

  return (
    <div className="page-shell">
      <header className="page-header">
        <p className="page-eyebrow">Account</p>
        <h1 className="page-title">Settings</h1>
        <p className="page-description">Manage the profile, recovery information, and connected service already supported by your account.</p>
      </header>

      <form onSubmit={saveSettings} className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <section className="space-y-6">
          <div className="card-section">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-xl font-black text-primary">
                {initials || <FaUserCircle />}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">Profile</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">{displayName}</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Name" value={form.name} onChange={(name) => setForm((current) => ({ ...current, name }))} placeholder="Full name" autoComplete="name" />
              <Field label="Display name or nickname" value={form.nickname} onChange={(nickname) => setForm((current) => ({ ...current, nickname }))} placeholder="Name shown in the app" />
            </div>
          </div>

          <div className="card-section">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-primary">
                <FaMobileAlt />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">Recovery</p>
                <h2 className="text-xl font-black text-slate-950">Recovery Number</h2>
              </div>
            </div>
            <Field label="Mobile number" value={form.smsNumber} onChange={(smsNumber) => setForm((current) => ({ ...current, smsNumber }))} placeholder="+639123456789" className="mt-5" type="tel" autoComplete="tel" invalid={!smsIsValid} helper="Use 10–15 digits, optionally starting with +. This stores recovery information only; SMS recovery is not enabled in this MVP." />
          </div>
        </section>

        <aside className="space-y-6">
          <div className="card-section">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-600">
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
                : "This account is not currently associated with Google Sign-In."}
            </p>
          </div>

          <div className="card-section">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Profile setup</p>
            <h2 className="mt-1 text-lg font-black text-slate-950">Setup checklist</h2>
            <div className="mt-4 space-y-3">
              <ChecklistItem complete={Boolean(form.name.trim())} label="Name added" />
              <ChecklistItem complete={Boolean(form.nickname.trim())} label="Display name or nickname added" />
              <ChecklistItem complete={Boolean(form.smsNumber.trim()) && smsIsValid} label="Recovery number added" />
              <ChecklistItem complete={Boolean(currentUser?.isGoogleLinked)} label="Google account linked (optional)" />
            </div>
          </div>

          <button className="button-primary w-full" disabled={!smsIsValid}>
            <FaSave /> Save Settings
          </button>
          {message && <p className="rounded-lg bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">{message}</p>}
        </aside>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, className = "", helper, invalid = false, type = "text", autoComplete }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        aria-invalid={invalid}
        className={`mt-2 w-full rounded-lg border px-4 py-3 text-sm font-semibold outline-none focus:ring-4 ${invalid ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"}`}
        placeholder={placeholder}
      />
      {helper && <span className={`mt-2 block text-xs leading-5 ${invalid ? "font-semibold text-rose-600" : "text-slate-500"}`}>{invalid ? "Enter 10–15 digits, optionally starting with +." : helper}</span>}
    </label>
  );
}

function ChecklistItem({ complete, label }) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${complete ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
        {complete ? <FaCheckCircle /> : <span aria-hidden="true">•</span>}
      </span>
      <span>{label}{!complete && !label.includes("optional") ? " — missing" : ""}</span>
    </div>
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

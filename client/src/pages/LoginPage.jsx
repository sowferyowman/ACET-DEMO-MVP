import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaGoogle, FaLock, FaMobileAlt, FaUserPlus } from "react-icons/fa";
import { createStudentAccount, loginUser, signInWithGoogleProfile } from "../services/storage";

const googleDemoProfile = {
  name: "Google Student",
  email: "google.student@example.com"
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [createForm, setCreateForm] = useState({ email: "", password: "", smsNumber: "" });
  const [recoveryForm, setRecoveryForm] = useState({ smsNumber: "" });

  function routeAfterAuth(user) {
    if (user.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    navigate(user.profileCompleted ? "/dashboard" : "/student-profiling", { replace: true });
  }

  function handleSignIn(event) {
    event.preventDefault();
    setMessage("");
    const user = loginUser(signInForm.email.trim(), signInForm.password);
    if (!user) {
      setMessage("Invalid email or password.");
      return;
    }
    routeAfterAuth(user);
  }

  function handleCreateAccount(event) {
    event.preventDefault();
    setMessage("");
    const result = createStudentAccount(createForm);
    if (result.error) {
      setMessage(result.error);
      return;
    }
    routeAfterAuth(result.user);
  }

  function handleGoogleSignIn() {
    const user = signInWithGoogleProfile(googleDemoProfile);
    routeAfterAuth(user);
  }

  function handleRecovery(event) {
    event.preventDefault();
    setMessage(`Verification code sent to ${recoveryForm.smsNumber}. Use this demo flow to reset your password.`);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden rounded-2xl bg-primary p-8 text-white shadow-xl lg:block">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-100 hover:text-white">
            <FaArrowLeft /> Back to EXAMS.PH
          </Link>
          <div className="mt-20">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-200">Student Account</p>
            <h1 className="mt-4 text-4xl font-black leading-tight">Lorem ipsum dolor sit amet.</h1>
            <p className="mt-4 text-sm font-semibold leading-7 text-blue-100">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamcod.
            </p>
          </div>
          <div className="mt-16 grid gap-3 text-sm font-bold text-blue-50">
            <div className="rounded-xl border border-blue-400/40 bg-white/10 p-4">Lorem ipsum dolor sit amet</div>
            <div className="rounded-xl border border-blue-400/40 bg-white/10 p-4">Lorem ipsum dolor sit amet</div>
            <div className="rounded-xl border border-blue-400/40 bg-white/10 p-4">Lorem ipsum dolor sit amet</div>
          </div>
        </section>

        <section className="glass-card mx-auto w-full max-w-xl p-6 md:p-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 lg:hidden">
            <FaArrowLeft /> Back
          </Link>

          <div className="mt-4 flex items-center gap-3 lg:mt-0">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-primary">
              {mode === "signin" ? <FaLock /> : <FaUserPlus />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-950">{mode === "signin" ? "Welcome back" : "Create student account"}</h2>
              <p className="text-sm font-semibold text-slate-500">
                {mode === "signin" ? "Use your student email or legacy username." : "Email, password, and SMS recovery are required."}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            {[
              ["signin", "Sign In"],
              ["create", "Create Account"]
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setMode(value);
                  setRecoveryOpen(false);
                  setMessage("");
                }}
                className={`rounded-lg px-4 py-2 text-sm font-black transition ${mode === value ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <FaGoogle className="text-rose-500" /> Sign in with Google
          </button>

          {mode === "signin" ? (
            <form onSubmit={handleSignIn} className="mt-6 space-y-4">
              <TextInput label="Email or Username" value={signInForm.email} onChange={(email) => setSignInForm((current) => ({ ...current, email }))} placeholder="student1 or student@example.com" />
              <TextInput label="Password" type="password" value={signInForm.password} onChange={(password) => setSignInForm((current) => ({ ...current, password }))} placeholder="Your password" />
              <RecoveryLink onClick={() => setRecoveryOpen((open) => !open)} />
              <button className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition hover:bg-blue-800">Sign In</button>
            </form>
          ) : (
            <form onSubmit={handleCreateAccount} className="mt-6 space-y-4">
              <TextInput label="Email" type="email" value={createForm.email} onChange={(email) => setCreateForm((current) => ({ ...current, email }))} placeholder="student@example.com" />
              <TextInput label="Password" type="password" value={createForm.password} onChange={(password) => setCreateForm((current) => ({ ...current, password }))} placeholder="Create a secure password" />
              <TextInput label="Mobile Number (SMS)" value={createForm.smsNumber} onChange={(smsNumber) => setCreateForm((current) => ({ ...current, smsNumber }))} placeholder="+639123456789" icon={<FaMobileAlt />} />
              <RecoveryLink onClick={() => setRecoveryOpen((open) => !open)} />
              <button className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition hover:bg-blue-800">Create Account</button>
            </form>
          )}

          {recoveryOpen && (
            <form onSubmit={handleRecovery} className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-black text-slate-900">Password Recovery</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">Enter the linked mobile number to simulate sending an SMS verification code.</p>
              <TextInput label="Linked Mobile Number" value={recoveryForm.smsNumber} onChange={(smsNumber) => setRecoveryForm({ smsNumber })} placeholder="+639123456789" compact />
              <button className="mt-3 rounded-lg bg-white px-4 py-2 text-xs font-black text-primary shadow-sm hover:bg-blue-50">Send SMS Code</button>
            </form>
          )}

          {message && <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">{message}</p>}

          <div className="mt-5 rounded-lg bg-slate-50 p-4 text-xs font-semibold text-slate-500">
            <p>Admin: admin1 / pass1234</p>
            <p className="mt-1">Student: student1 / 123</p>
          </div>
        </section>
      </div>
    </main>
  );
}

function TextInput({ label, value, onChange, placeholder, type = "text", icon = null, compact = false }) {
  return (
    <label className={`block ${compact ? "mt-3" : ""}`}>
      <span className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</span>
      <div className="relative mt-2">
        {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${icon ? "pl-10" : ""}`}
          placeholder={placeholder}
          required
        />
      </div>
    </label>
  );
}

function RecoveryLink({ onClick }) {
  return (
    <button type="button" onClick={onClick} className="text-sm font-black text-primary hover:text-blue-800">
      Forgot Password?
    </button>
  );
}

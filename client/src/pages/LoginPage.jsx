import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const user = login(form.username.trim(), form.password);

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard", { replace: true });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-6">
      <form onSubmit={handleSubmit} className="glass-card w-full max-w-md p-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900">
          <FaArrowLeft /> Back
        </Link>

        <div className="mt-8 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary text-white">
            <FaLock />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-950">Login to EXAMS.PH</h1>
            <p className="text-sm text-slate-500">Routes are assigned from your account role.</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Username</span>
            <input
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="student1"
              required
            />
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="123"
              required
            />
          </label>
        </div>

        {error && <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}

        <button className="mt-6 w-full rounded-lg bg-primary px-5 py-3 text-sm font-black text-white transition hover:bg-blue-800">
          Sign In
        </button>

        <div className="mt-5 rounded-lg bg-slate-50 p-4 text-xs font-semibold text-slate-500">
          <p>Admin: admin1 / pass1234</p>
          <p className="mt-1">Student: student1 / 123</p>
        </div>
      </form>
    </main>
  );
}

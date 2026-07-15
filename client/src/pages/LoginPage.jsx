import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaArrowLeft, FaGoogle, FaLock, FaMobileAlt, FaUserPlus } from "react-icons/fa";
import { createStudentAccount, loginUser, signInWithGoogleProfile } from "../services/storage";

const googleDemoProfile = {
  name: "Google Student",
  email: "google.student@example.com"
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
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
    <>
      <style>{`
        /* Ateneo Blue Studio Spotlight Backdrop */
        .studio-background {
          background-color: #00122c;
          background-image: radial-gradient(
            circle at 50% 50%, 
            #003b88 0%, 
            #00204a 50%, 
            #000c1d 90%
          );
          background-attachment: fixed;
        }

        /* Custom Input styling matching the dark blue aesthetic */
        .blue-input {
          background-color: rgba(0, 12, 29, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
          transition: all 0.3s ease !important;
        }

        .blue-input:focus {
          border-color: #3b82f6 !important;
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
        }
        
        .blue-input::placeholder {
          color: #71717a !important;
        }
      `}</style>

      <main className="studio-background relative min-h-screen w-full overflow-hidden text-white flex items-center justify-center p-4">
        {/* Main Sign-In Card Container */}
        <div className="relative w-full max-w-lg bg-[#00122c]/65 border border-white/10 rounded-2xl backdrop-blur-xl p-8 md:p-10 shadow-2xl">
          
          {/* ← Back Button repositioned inside the upper-left of the card */}
          <div className="absolute top-8 left-8 md:top-10 md:left-10">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors duration-200"
            >
              <FaArrowLeft className="text-xs" />
              <span>Back</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="flex flex-col items-center mt-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              {mode === "signin" ? <FaLock className="text-white text-lg" /> : <FaUserPlus className="text-white text-lg" />}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {mode === "signin" ? "Welcome back" : "Create student account"}
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              {mode === "signin" ? "Use your student email or legacy username." : "Email, password, and SMS recovery are required."}
            </p>
          </div>

          {/* Tabs: Sign In / Create Account */}
          <div className="flex gap-2 bg-black/25 p-1.5 rounded-xl mt-8 border border-white/5">
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
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  mode === value 
                    ? "bg-white/10 text-white shadow-md border border-white/10" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sign In with Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full mt-6 flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/10 bg-[#00122c]/50 hover:bg-white/5 transition-all text-sm font-semibold text-white"
          >
            <FaGoogle className="text-rose-500" /> 
            <span>Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#00122c] px-3 text-zinc-500 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Render Active Forms */}
          {mode === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <TextInput 
                label="Email or Username" 
                value={signInForm.email} 
                onChange={(email) => setSignInForm((current) => ({ ...current, email }))} 
                placeholder="student1 or student@example.com" 
              />
              <TextInput 
                label="Password" 
                type="password" 
                value={signInForm.password} 
                onChange={(password) => setSignInForm((current) => ({ ...current, password }))} 
                placeholder="Your password" 
              />
              <div className="flex justify-end">
                <RecoveryLink onClick={() => setRecoveryOpen((open) => !open)} />
              </div>
              <button className="w-full py-3 bg-white text-[#00204a] font-bold rounded-xl hover:bg-zinc-100 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg mt-2">
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <TextInput 
                label="Email" 
                type="email" 
                value={createForm.email} 
                onChange={(email) => setCreateForm((current) => ({ ...current, email }))} 
                placeholder="student@example.com" 
              />
              <TextInput 
                label="Password" 
                type="password" 
                value={createForm.password} 
                onChange={(password) => setCreateForm((current) => ({ ...current, password }))} 
                placeholder="Create a secure password" 
              />
              <TextInput 
                label="Mobile Number (SMS)" 
                value={createForm.smsNumber} 
                onChange={(smsNumber) => setCreateForm((current) => ({ ...current, smsNumber }))} 
                placeholder="+63**********" 
                icon={<FaMobileAlt />} 
              />
              <div className="flex justify-end">
                <RecoveryLink onClick={() => setRecoveryOpen((open) => !open)} />
              </div>
              <button className="w-full py-3 bg-white text-[#00204a] font-bold rounded-xl hover:bg-zinc-100 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg mt-2">
                Create Account
              </button>
            </form>
          )}

          {/* Password Recovery Flow */}
          {recoveryOpen && (
            <form onSubmit={handleRecovery} className="mt-5 rounded-xl border border-blue-900/30 bg-[#00122c]/80 p-4">
              <p className="text-sm font-bold text-white">Password Recovery</p>
              <p className="mt-1 text-xs text-zinc-400">
                Enter the linked mobile number to simulate sending an SMS verification code.
              </p>
              <TextInput 
                label="Linked Mobile Number" 
                value={recoveryForm.smsNumber} 
                onChange={(smsNumber) => setRecoveryForm({ smsNumber })} 
                placeholder="+639123456789" 
                compact 
              />
              <button className="mt-3 rounded-lg bg-white/10 border border-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition-all">
                Send SMS Code
              </button>
            </form>
          )}

          {/* Messaging Alert Box */}
          {message && (
            <p className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-sm font-semibold text-amber-400">
              {message}
            </p>
          )}

          {/* Helper Credentials Box */}
          <div className="mt-8 bg-black/25 rounded-xl p-4 border border-white/5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              Demo Access
            </p>
            <div className="text-xs text-zinc-400 space-y-1">
              <p><span className="font-medium text-zinc-300">Admin:</span> admin1 / pass1234</p>
              <p className="mt-1"><span className="font-medium text-zinc-300">Student:</span> student1 / 123</p>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}

function TextInput({ label, value, onChange, placeholder, type = "text", icon = null, compact = false }) {
  return (
    <label className={`block ${compact ? "mt-3" : ""}`}>
      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{label}</span>
      <div className="relative mt-2">
        {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`blue-input w-full rounded-xl px-4 py-3 text-sm font-semibold ${icon ? "pl-10" : ""}`}
          placeholder={placeholder}
          required
        />
      </div>
    </label>
  );
}

function RecoveryLink({ onClick }) {
  return (
    <button type="button" onClick={onClick} className="text-xs text-blue-400 hover:underline transition-colors">
      Forgot Password?
    </button>
  );
}
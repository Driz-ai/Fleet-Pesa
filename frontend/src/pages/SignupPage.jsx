import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Eye, EyeOff, Loader2 } from "lucide-react";
import { register } from "../lib/api.js";

function normalizePhone(value) {
  return value.replace(/\s/g, "");
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("owner");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  function validate() {
    if (username.trim().length < 3) return "Username must be at least 3 characters";
    if (!name.trim()) return "Enter your full name";
    if (!/^07\d{8}$/.test(normalizePhone(phone))) return "Enter a valid phone number, e.g. 0708419329";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);
    try {
      await register({ role, username: username.trim(), name: name.trim(), phone: normalizePhone(phone), password });
      setCreated(true);
    } catch (requestError) {
      setError(requestError?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center"><Truck className="w-5 h-5 text-white" strokeWidth={2} /></div>
        <span className="text-xl font-bold text-slate-900">FleetPesa</span>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        {created ? (
          <div className="text-center py-8" role="status">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-green-50 text-3xl text-green-600">✓</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Account created successfully</h1>
            <p className="text-slate-500 mb-6">Your FleetPesa account is ready. Sign in to continue.</p>
            <button type="button" onClick={() => navigate("/login", { state: { success: "Account created. You can now sign in." } })} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-colors">Continue to Sign In</button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
              <p className="text-slate-500 mb-6">Register to manage your fleet</p>
            </div>

            <div className="flex bg-slate-100 rounded-lg p-1 mb-6" role="tablist">
              <button type="button" role="tab" aria-selected={role === "owner"} onClick={() => setRole("owner")} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${role === "owner" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}>Fleet Owner</button>
              <button type="button" role="tab" aria-selected={role === "driver"} onClick={() => setRole("driver")} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${role === "driver" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}>Driver</button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4"><label htmlFor="username" className="block text-xs font-semibold text-slate-500 tracking-wide uppercase mb-1.5">Username</label><input id="username" type="text" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-900" /></div>
              <div className="mb-4"><label htmlFor="name" className="block text-xs font-semibold text-slate-500 tracking-wide uppercase mb-1.5">Full Name</label><input id="name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-900" /></div>
              <div className="mb-4"><label htmlFor="phone" className="block text-xs font-semibold text-slate-500 tracking-wide uppercase mb-1.5">Phone Number</label><input id="phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="0798765432" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-900" /></div>

              <PasswordField id="password" label="Password" value={password} onChange={setPassword} visible={showPassword} onToggle={() => setShowPassword((visible) => !visible)} />
              <PasswordField id="confirm-password" label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} visible={showConfirmPassword} onToggle={() => setShowConfirmPassword((visible) => !visible)} />

              {error && <p className="text-sm text-red-600 mt-2" role="alert">{error}</p>}
              <button type="submit" disabled={loading} className="w-full mt-6 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">{loading && <Loader2 className="w-4 h-4 animate-spin" />}{loading ? "Creating account..." : "Create Account"}</button>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-center text-xs font-medium text-slate-400"><span className="flex items-center gap-1 whitespace-nowrap"><i className="h-2 w-2 rounded-full bg-green-600" />Secure</span><span aria-hidden="true">•</span><span className="flex items-center gap-1 whitespace-nowrap"><i className="h-2 w-2 rounded-full bg-green-600" />Instant M-Pesa</span><span aria-hidden="true">•</span><span className="flex items-center gap-1 whitespace-nowrap"><i className="h-2 w-2 rounded-full bg-green-600" />Built for Kenyan fleets</span></div>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">Already have an account? <button type="button" onClick={() => navigate("/login")} className="font-semibold text-slate-900 hover:underline">Sign in</button></p>
          </>
        )}
      </div>
    </div>
  );
}

function PasswordField({ id, label, value, onChange, visible, onToggle }) {
  return (
    <div className="mb-2">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-500 tracking-wide uppercase mb-1.5">{label}</label>
      <div className="relative">
        <input id={id} type={visible ? "text" : "password"} autoComplete="new-password" value={value} onChange={(event) => onChange(event.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 pr-11 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-900" />
        <button type="button" onClick={onToggle} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600" aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}>{visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
      </div>
    </div>
  );
}

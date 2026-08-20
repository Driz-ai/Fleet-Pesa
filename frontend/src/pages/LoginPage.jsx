import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Truck, Eye, EyeOff, Loader2 } from "lucide-react";
import { login } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export function normalizePhone(value) {
  return value.replace(/\s/g, "");
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const [role, setRole] = useState("owner");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(location.state?.success || "");

  const validate = () => {
    const cleanPhone = normalizePhone(phone);
    if (!/^\+254\d{9}$/.test(cleanPhone)) {
      return "Enter a valid phone number, e.g. +254 712 345 678";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Expected API response: { token, user: { role, ... } }.
      const data = await login({ role, phone: normalizePhone(phone), password });
      if (!data?.token || !data?.user?.role) {
        throw new Error("Sign in response was incomplete. Please try again.");
      }
      setAuth({ token: data.token, user: data.user });
      navigate(data.user.role === "driver" ? "/driver/remittance" : "/owner/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Sign in failed. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <span className="text-xl font-bold text-slate-900">FleetPesa</span>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-slate-500 mb-6">Sign in to your fleet dashboard</p>
        </div>

        {success && <p className="text-sm text-emerald-600 mb-4" role="status">{success}</p>}

        <div className="flex bg-slate-100 rounded-lg p-1 mb-6" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={role === "owner"}
            onClick={() => setRole("owner")}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${
              role === "owner" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
            }`}
          >
            Fleet Owner
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === "driver"}
            onClick={() => setRole("driver")}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${
              role === "driver" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
            }`}
          >
            Driver
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-xs font-semibold text-slate-500 tracking-wide uppercase mb-1.5"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254 712 345 678"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-900"
            />
          </div>

          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-500 tracking-wide uppercase mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 pr-11 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 mt-2" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          No account yet?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="font-semibold text-slate-900 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
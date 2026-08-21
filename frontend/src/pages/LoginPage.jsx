import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export function normalizePhone(value) {
  return value.replace(/\s/g, "");
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const { isDark } = useTheme();
  const [role, setRole] = useState("owner");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(location.state?.success || "");

  useEffect(() => {
    if (!success) return undefined;
    const timeoutId = window.setTimeout(() => setSuccess(""), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [success]);

  const validate = () => {
    const cleanPhone = normalizePhone(phone);
    if (!/^07\d{8}$/.test(cleanPhone)) {
      return "Enter a valid phone number, e.g. 0712345678";
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
      // Mock sign-in keeps the frontend demo usable before backend auth is ready.
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockUser = {
        id: role === "driver" ? "mock-driver-1" : "mock-owner-1",
        name: role === "driver" ? "Peter Omondi" : "Martin Otieno",
        phone: normalizePhone(phone),
        role,
      };
      setAuth({ token: `mock-token-${role}`, user: mockUser });
      const destination = role === "driver"
        ? "/driver/remittance"
        : "/owner/dashboard";
      navigate(destination, {
        replace: true,
        state: { success: "Successfully signed in." },
      });
    } catch (err) {
      setError(err?.message || "Sign in failed. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-h-screen w-full flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 rounded-[22px] bg-white p-1.5 shadow-[0_6px_16px_rgba(16,40,68,0.08)] ring-1 ring-slate-200/60">
        <img
          src={isDark ? "/Fleet-pesa%20Logo%20Light.jpg" : "/Fleet-pesa%20Logo%20Dark.jpg"}
          alt="FleetPesa"
          className="h-auto w-56 max-w-full rounded-[16px] object-contain"
        />
      </div>

      <div className="login-card w-full max-w-md rounded-2xl shadow-sm p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-slate-500 mb-6">
            {role === "driver" ? "Sign in to your remittance dashboard" : "Sign in to your fleet dashboard"}
          </p>
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
              placeholder="0712345678"
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

          <button
            type="button"
            className="forgot-password"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </button>

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

          <div
            className="trust-line mt-4 flex items-center justify-center gap-2 text-center font-medium text-slate-900"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#16A34A] text-white">
                <svg viewBox="0 0 20 20" className="h-2.5 w-2.5" fill="none" aria-hidden="true">
                  <path d="M5.5 10.5L8.5 13.5L14.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Secure
            </span>

            <span aria-hidden="true" className="text-slate-900">•</span>

            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#16A34A] text-white">
                <svg viewBox="0 0 20 20" className="h-2.5 w-2.5" fill="none" aria-hidden="true">
                  <path d="M5.5 10.5L8.5 13.5L14.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Instant M-Pesa
            </span>

            <span aria-hidden="true" className="text-slate-900">•</span>

            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#16A34A] text-white">
                <svg viewBox="0 0 20 20" className="h-2.5 w-2.5" fill="none" aria-hidden="true">
                  <path d="M5.5 10.5L8.5 13.5L14.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Built for Kenyan fleets
            </span>
          </div>
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
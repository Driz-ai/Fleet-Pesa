import { useState } from "react";
import { forgotPassword, resetPassword } from  "../lib/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { normalizePhone } from "./LoginPage.jsx";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();


  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("phone");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoOtp, setDemoOtp] = useState("");

async function handlePasswordSubmit(event) {
  event.preventDefault();

  if (newPassword.length < 8) {
    setError("Password must be at least 8 characters");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  if (!resetToken) {
    setError(
      "Password reset session has expired. Please start again."
    );
    return;
  }

  try {
    setLoading(true);
    setError("");

    console.log(
      "[RESET PASSWORD] Token present:",
      resetToken.length
    );

    await resetPassword(
      resetToken,
      newPassword
    );

    sessionStorage.removeItem(
      `fleetpesa_otp_${phone}`
    );

    navigate("/login", {
      replace: true,
      state: {
        success:
          "Password updated. You can now sign in.",
      },
    });

  } catch (error) {
    console.error(
      "[RESET PASSWORD ERROR]",
      error
    );

    setError(
      error.message ||
      "Unable to reset password."
    );
  } finally {
    setLoading(false);
  }
}


async function handlePhoneSubmit(event) {
  event.preventDefault();

  const cleanPhone = normalizePhone(phone);

  // Accept Kenyan numbers starting with 07 or 01
  if (!/^(07|01)\d{8}$/.test(cleanPhone)) {
    setError("Enter a valid phone number, e.g. 0712345678 or 0112345678");
    return;
  }

  try {
    setLoading(true);
    setError("");

    // Ask the Flask backend for a password reset token
    const response = await forgotPassword(cleanPhone);

    console.log("[FORGOT PASSWORD RESPONSE]", response);

    if (!response?.reset_token) {
      setError(
        response?.message ||
        "Unable to create password reset session."
      );
      return;
    }

    // IMPORTANT: save the backend reset token
    setResetToken(response.reset_token);

    // Keep your demo OTP for testing
    const generatedOtp = String(
      Math.floor(100000 + Math.random() * 900000)
    );

    sessionStorage.setItem(
      `fleetpesa_otp_${cleanPhone}`,
      generatedOtp
    );

    setPhone(cleanPhone);
    setDemoOtp(generatedOtp);
    setStep("otp");

  } catch (error) {
    console.error(
      "[FORGOT PASSWORD ERROR]",
      error
    );

    setError(
      error.message ||
      "Unable to process password reset request."
    );
  } finally {
    setLoading(false);
  }
}



function handleOtpSubmit(event) {
  event.preventDefault();

  const expectedOtp = sessionStorage.getItem(
    `fleetpesa_otp_${phone}`
  );

  if (!/^\d{6}$/.test(otp) || otp !== expectedOtp) {
    setError("Enter the six-digit code sent to your phone");
    return;
  }

  setError("");
  setStep("password");
}

async function handlePasswordSubmit(event) {
  event.preventDefault();

  if (newPassword.length < 8) {
    setError("Password must be at least 8 characters");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  if (!resetToken) {
    setError("Password reset token is missing. Please start again.");
    return;
  }

  try {
    setError("");
    setLoading(true);

    await resetPassword(resetToken, newPassword);

    sessionStorage.removeItem(`fleetpesa_otp_${phone}`);

    navigate("/login", {
      replace: true,
      state: {
        success: "Password updated. You can now sign in.",
      },
    });
  } catch (error) {
    setError(error.message || "Unable to reset password.");
  } finally {
    setLoading(false);
  }
}


  function handleOtpSubmit(event) {
    event.preventDefault();
    const expectedOtp = sessionStorage.getItem(`fleetpesa_otp_${phone}`);
    if (!/^\d{6}$/.test(otp) || otp !== expectedOtp) {
      setError("Enter the six-digit code sent to your phone");
      return;
    }

    setError("");
    setStep("password");
  }

async function handlePasswordSubmit(event) {
  event.preventDefault();

  if (newPassword.length < 8) {
    setError("Password must be at least 8 characters");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  if (!resetToken) {
    setError("Password reset session has expired. Please start again.");
    return;
  }

  setError("");
  setLoading(true);

  try {
    const data = await resetPassword(
      resetToken,
      newPassword
    );

    console.log(
      "[RESET PASSWORD] Backend response:",
      data
    );

    navigate("/login", {
      replace: true,
      state: {
        success: "Password updated. You can now sign in.",
      },
    });

  } catch (error) {
    console.error(
      "[RESET PASSWORD ERROR]",
      error
    );

    setError(
      error.message ||
      "Unable to reset password. Please try again."
    );

  } finally {
    setLoading(false);
  }
}


  return (
    <div className="login-page min-h-screen w-full flex flex-col items-center justify-center px-4 py-12">
      <div className="login-card w-full max-w-md rounded-2xl shadow-sm p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Reset your password</h1>
          <p className="text-slate-500">
            {step === "phone" && "Enter your registered phone number"}
            {step === "otp" && "Enter the one-time password sent to your phone"}
            {step === "password" && "Create a new password for your account"}
          </p>
        </div>

        {step === "phone" && (
          <form onSubmit={handlePhoneSubmit} noValidate>
            <label htmlFor="recovery-phone" className="block text-xs font-semibold text-slate-500 tracking-wide uppercase mb-1.5">Phone Number</label>
            <input id="recovery-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="0712345678" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-900" />
            {error && <p className="text-sm text-red-600 mt-2" role="alert">{error}</p>}
            <button type="submit" className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-colors">Continue</button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} noValidate>
            <p className="text-sm text-slate-500 mb-4">A one-time password was sent to {phone}.</p>
            <label htmlFor="recovery-otp" className="block text-xs font-semibold text-slate-500 tracking-wide uppercase mb-1.5">One-time password</label>
            <input id="recovery-otp" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} placeholder="123456" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-center tracking-[0.35em] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-900" />
            <p className="mt-3 text-xs text-slate-400" role="status">Demo OTP: {demoOtp}</p>
            {error && <p className="text-sm text-red-600 mt-2" role="alert">{error}</p>}
            <button type="submit" className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-colors">Verify code</button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} noValidate>
            <p className="text-sm text-slate-500 mb-4">Resetting password for {phone}</p>
            <label htmlFor="new-password" className="block text-xs font-semibold text-slate-500 tracking-wide uppercase mb-1.5">New Password</label>
            <div className="relative mb-4">
              <input id="new-password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 pr-11 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-900" />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400" aria-label={showPassword ? "Hide new password" : "Show new password"}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            <label htmlFor="confirm-recovery-password" className="block text-xs font-semibold text-slate-500 tracking-wide uppercase mb-1.5">Confirm Password</label>
            <div className="relative">
              <input id="confirm-recovery-password" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 pr-11 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-900" />
              <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400" aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            {error && <p className="text-sm text-red-600 mt-2" role="alert">{error}</p>}
            <button type="submit" disabled={loading} className="w-full mt-6 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">{loading && <Loader2 className="w-4 h-4 animate-spin" />}{loading ? "Updating password..." : "Update Password"}</button>
          </form>
        )}

        <button type="button" onClick={() => navigate("/login")} className="w-full mt-5 text-sm font-medium text-slate-500 hover:text-slate-900">Back to sign in</button>
      </div>
    </div>
  );
}

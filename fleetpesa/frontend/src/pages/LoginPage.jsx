import { useState } from "react";
import { Truck, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage({ onLogin, onNavigateToSignup }) {
  const [role, setRole] = useState("owner");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const cleanPhone = phone.replace(/\s/g, "");
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
      if (onLogin) {
        await onLogin({ role, phone: phone.replace(/\s/g, ""), password });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    } catch (err) {
      setError(err?.message || "Sign in failed. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  
}
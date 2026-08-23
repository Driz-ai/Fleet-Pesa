import { createContext, useContext, useState } from "react";
import { updatePassword, updateProfile } from "../lib/api.js";
import { useAuth } from "./AuthContext.jsx";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { token, user, setAuth } = useAuth();
  const [state, setState] = useState({ loading: false, error: "", success: "" });

  async function saveProfile(values) {
    setState({ loading: true, error: "", success: "" });
    try { const response = await updateProfile(values); setAuth({ token, user: response.user }); setState({ loading: false, error: "", success: "Profile updated successfully." }); return response.user; }
    catch (error) { setState({ loading: false, error: error.message, success: "" }); throw error; }
  }

  async function savePassword(values) {
    setState({ loading: true, error: "", success: "" });
    try { await updatePassword(values); setState({ loading: false, error: "", success: "Password updated successfully." }); }
    catch (error) { setState({ loading: false, error: error.message, success: "" }); throw error; }
  }

  return <SettingsContext.Provider value={{ user, state, saveProfile, savePassword }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within a SettingsProvider");
  return context;
}
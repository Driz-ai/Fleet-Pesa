import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const storedUser = localStorage.getItem("fleetpesa_user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("fleetpesa_token"));
  const [user, setUser] = useState(readStoredUser);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      setAuth: (authData) => {
        const nextToken = authData?.token;
        const nextUser = authData?.user || null;
        if (nextToken) {
          localStorage.setItem("fleetpesa_token", nextToken);
        }
        if (nextUser) {
          localStorage.setItem("fleetpesa_user", JSON.stringify(nextUser));
        }
        setToken(nextToken || null);
        setUser(nextUser);
      },
      logout: () => {
        localStorage.removeItem("fleetpesa_token");
        localStorage.removeItem("fleetpesa_user");
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import { AppShell } from "./components/layout/AppShell.jsx";
import RemmitancePage from "./pages/driver/RemittancePage.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/owner/dashboard"
            element={<ProtectedRoute><AppShell /></ProtectedRoute>}
          />
          <Route
            path="/driver/remittance"
            element={<ProtectedRoute><RemmitancePage /></ProtectedRoute>}
          />
          <Route path="/dashboard" element={<Navigate to="/owner/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

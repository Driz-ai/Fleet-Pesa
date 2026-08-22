import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import { AppShell } from "./components/layout/AppShell.jsx";
import DashboardPage from "./pages/owner/DashboardPage.jsx";
import VehicleDetailPage from "./pages/owner/VehicleDetailPage.jsx";
import FleetPage from "./pages/owner/FleetPage.jsx";
import RemmitancePage from "./pages/driver/RemittancePage.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route
              path="/owner"
              element={<ProtectedRoute><AppShell /></ProtectedRoute>}
            >
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="fleet" element={<FleetPage />} />
              <Route path="vehicles/:id" element={<VehicleDetailPage />} />
            </Route>

            <Route
              path="/driver/remittance"
              element={<ProtectedRoute><RemmitancePage /></ProtectedRoute>}
            />
            <Route path="/dashboard" element={<Navigate to="/owner/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
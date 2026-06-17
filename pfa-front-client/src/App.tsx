import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./features/auth/pages/LandingPage";
import LoginPage from "./features/auth/pages/LoginPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import DashboardPage from "./features/dashboard/DashboardPage";
import MesReclamationsPage from "./features/reclamations/pages/MesReclamationsPage";
import NotificationsPage from "./features/notifications/pages/NotificationsPage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import ProtectedRoute from "./middleware/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mes-reclamations"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <MesReclamationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mes-reclamations/:id"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <MesReclamationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

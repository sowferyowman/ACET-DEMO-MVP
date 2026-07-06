import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import CommunityRewards from "./features/community/CommunityRewards";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CreateDrill from "./pages/CreateDrill";
import DashboardPage from "./pages/DashboardPage";
import ExamPage from "./pages/ExamPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ReviewersPage from "./pages/ReviewersPage";
import SettingsPage from "./pages/SettingsPage";
import StudentProfilingPage from "./pages/StudentProfilingPage";
import WeaknessDrillsPage from "./pages/WeaknessDrillsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute allowedRole="student" />}>
        <Route path="/student-profiling" element={<StudentProfilingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/reviewers" element={<DashboardLayout />}>
          <Route index element={<ReviewersPage />} />
        </Route>
        <Route path="/weakness-drills" element={<DashboardLayout />}>
          <Route index element={<WeaknessDrillsPage />} />
        </Route>
        <Route path="/community" element={<DashboardLayout />}>
          <Route index element={<CommunityRewards />} />
        </Route>
        <Route path="/settings" element={<DashboardLayout />}>
          <Route index element={<SettingsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/drills" element={<CreateDrill />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

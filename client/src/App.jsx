import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import ExamPage from "./pages/ExamPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
      </Route>
      <Route path="/exam" element={<ExamPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

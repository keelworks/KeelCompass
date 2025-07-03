import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import Auth from "./pages/Auth";
import AuthGuard from "./pages/AuthGuard";
import Dashboard from "./pages/Dashboard";
import CreateQuestionDashboard from "./pages/CreateQuestion";
import QnA from "./pages/QnA";
import Fallback from "./pages/Fallback";

function App() {
  return (
    <Routes>
      <Route path="/" element={
        localStorage.getItem("token")
          ? <Navigate to="/dashboard" replace />
          : <Auth />
      } />
      <Route element={<AuthGuard><Outlet /></AuthGuard>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/qna" element={<QnA />} />
        <Route path="/questions/new" element={<CreateQuestionDashboard />} />
      </Route>
      <Route path="*" element={<Fallback />} />
    </Routes>
  );
}

export default App;

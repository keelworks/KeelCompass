import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import AuthGuard from "./components/auth/AuthGuard";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PostQuestionDashboard from "./pages/PostQuestionDashboard";
import QnA from "./pages/QnA";
import PostQuestionQnA from "./pages/PostQuestionQnA";
import Fallback from "./pages/Fallback";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      <Route element={<AuthGuard><Outlet /></AuthGuard>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/post-question" element={<PostQuestionDashboard />} />
        <Route path="/qna" element={<QnA />} />
        <Route path="/qna/post-question" element={<PostQuestionQnA />} />
        <Route path="*" element={<Fallback />} />
      </Route>

      <Route path="/" element={
        localStorage.getItem("token")
          ? <Navigate to="/dashboard" replace />
          : <Navigate to="/auth" replace />
      } />
    </Routes>
  );
}

export default App;

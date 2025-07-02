import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import AuthGuard from "./components/auth/AuthGuard";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import QnA from "./pages/QnA";
import PostQuestionQnA from "./pages/CreateQuestionQnA";
import CreateQuestionDashboard from "./pages/CreateQuestionDashboard";
import Fallback from "./pages/Fallback";

function App() {
  return (
    <Routes>
      <Route path="/" element={
        localStorage.getItem("token")
          ? <Navigate to="/dashboard" replace />
          : <AuthPage />
      } />
      <Route element={<AuthGuard><Outlet /></AuthGuard>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/post-question" element={<CreateQuestionDashboard />} />
        <Route path="/qna" element={<QnA />} />
        <Route path="/qna/post-question" element={<PostQuestionQnA />} />
      </Route>
      <Route path="*" element={<Fallback />} />
    </Routes>
  );
}

export default App;

import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import Auth from "./pages/Auth";
import CompleteProfile from "./pages/CompleteProfile";
import AuthGuard from "./pages/AuthGuard";
import Dashboard from "./pages/Dashboard";
import QuestionCreate from "./pages/QuestionCreate";
import QnA from "./pages/QnA";
import Interests from "./pages/Interests";
import Admin from "./pages/Admin";
import Fallback from "./pages/Fallback";


const getValidTokenPayload = (token: string | null): { username?: string } | null => {
  if (!token) return null;

  try {
    // Parse JWT token to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;

    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      // Remove expired token
      localStorage.removeItem("token");
      return null;
    }

    return payload;
  } catch {
    // Invalid token format
    localStorage.removeItem("token");
    return null;
  }
};

function App() {
  const tokenPayload = getValidTokenPayload(localStorage.getItem("token"));

  return (
    <Routes>
      <Route path="/" element={
        tokenPayload
          ? <Navigate to={tokenPayload.username ? "/dashboard" : "/complete-profile"} replace />
          : <Auth />
      } />
      <Route path="/complete-profile" element={<AuthGuard><CompleteProfile /></AuthGuard>} />
      <Route element={<AuthGuard><Outlet /></AuthGuard>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/qna" element={<QnA />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/questions/new" element={<QuestionCreate />} />
      </Route>

      <Route path="*" element={<Fallback />} />
    </Routes>
  );
}

export default App;

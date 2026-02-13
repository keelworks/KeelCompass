import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import Auth from "./pages/Auth";
import AuthGuard from "./pages/AuthGuard";
import Dashboard from "./pages/Dashboard";
import QuestionCreate from "./pages/QuestionCreate";
import QnA from "./pages/QnA";
import Fallback from "./pages/Fallback";


const isValidToken = (token: string | null) => {
  if (!token) return false;
  
  try {
    // Parse JWT token to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      // Remove expired token
      localStorage.removeItem("token");
      return false;
    }
    
    return true;
  } catch {
    // Invalid token format
    localStorage.removeItem("token");
    return false;
  }
};

/*function App() {
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
        <Route path="/questions/new" element={<QuestionCreate />} />
      </Route>
      
      
      <Route path="*" element={<Fallback />} />
    </Routes>
  );
}*/

function App() {
  return (
    <Routes>
      <Route path="/" element={
        isValidToken(localStorage.getItem("token"))
          ? <Navigate to="/dashboard" replace />
          : <Auth />
      } />
      <Route element={<AuthGuard><Outlet /></AuthGuard>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/qna" element={<QnA />} />
        <Route path="/questions/new" element={<QuestionCreate />} />
      </Route>
      
      <Route path="*" element={<Fallback />} />
    </Routes>
  );
}

export default App;

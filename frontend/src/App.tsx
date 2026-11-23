import { Suspense, lazy } from "react";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import Auth from "./pages/Auth";
import CompleteProfile from "./pages/CompleteProfile";
import AuthGuard from "./pages/AuthGuard";
import Dashboard from "./pages/Dashboard";
import QuestionCreate from "./pages/QuestionCreate";
import QuestionPage from "./pages/QuestionPage";
import Interests from "./pages/Interests";
import Fallback from "./pages/Fallback";
import Spinner from "./components/ui/Spinner";

// secondary pages (not visited every session) are code-split out of the
// main bundle, which otherwise ships all of Admin/Stats/Leaderboard/Settings
// to every user regardless of whether they ever open them
const Settings = lazy(() => import("./pages/Settings"));
const QnA = lazy(() => import("./pages/QnA"));
const Admin = lazy(() => import("./pages/Admin"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Stats = lazy(() => import("./pages/Stats"));

function RouteFallback() {
  return (
    <div className="flex items-center justify-center w-full h-[60vh]">
      <Spinner size={28} className="text-brand-600 dark:text-teal-400" />
    </div>
  );
}


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
        <Route
          path="/settings"
          element={<Suspense fallback={<RouteFallback />}><Settings /></Suspense>}
        />
        <Route
          path="/qna"
          element={<Suspense fallback={<RouteFallback />}><QnA /></Suspense>}
        />
        <Route path="/interests" element={<Interests />} />
        <Route
          path="/admin"
          element={<Suspense fallback={<RouteFallback />}><Admin /></Suspense>}
        />
        <Route
          path="/leaderboard"
          element={<Suspense fallback={<RouteFallback />}><Leaderboard /></Suspense>}
        />
        <Route
          path="/stats"
          element={<Suspense fallback={<RouteFallback />}><Stats /></Suspense>}
        />
        <Route path="/questions/new" element={<QuestionCreate />} />
        <Route path="/questions/:id" element={<QuestionPage />} />
      </Route>

      <Route path="*" element={<Fallback />} />
    </Routes>
  );
}

export default App;

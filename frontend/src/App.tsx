import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import QnA from './pages/QnA';
import './App.css';
import PostQuestion from './components/qna/PostQuestion';
import PostQuestionDashboard from './components/dashboard/PostQuestionDashboard';
import AuthPage from './pages/AuthPage'; // Ensure './pages/AuthPage.tsx' exists or correct the path

// Function to check authentication
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token !== null && token !== ""; // Ensure token exists and is not empty
};

// Protects routes to ensure only authenticated users can access them
const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
  return isAuthenticated() ? element : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* AuthPage is always the first page if not authenticated */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Redirect '/' to '/dashboard' if logged in, otherwise go to '/auth' */}
        <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />} />

        {/* Dashboard - Only accessible after login */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />

        {/* Other protected routes */}
        <Route path="/qna" element={<ProtectedRoute element={<QnA />} />} />
        <Route path="/post-question" element={<ProtectedRoute element={<PostQuestion />} />} />
        <Route path="/post-question-dashboard" element={<ProtectedRoute element={<PostQuestionDashboard />} />} />

        {/* Password Reset (accessible without login) */}
        <Route path="/reset-password" element={<div>Password Reset Page</div>} />

        {/* Redirect unknown routes to '/auth' */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
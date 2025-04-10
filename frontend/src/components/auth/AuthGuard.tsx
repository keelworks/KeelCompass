import { Navigate } from "react-router-dom";

const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    return !isExpired;
  } catch (err) {
    console.error("Token validation error:", err);
    return false;
  }
};

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  if (!isTokenValid()) {
    localStorage.clear();
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default AuthGuard;

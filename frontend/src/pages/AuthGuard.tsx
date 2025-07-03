import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  let isValid = false;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      isValid = !isExpired;
    } catch (err) {
      console.error("Token validation error:", err);
      isValid = false;
    }
  }

  if (!isValid) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthGuard;

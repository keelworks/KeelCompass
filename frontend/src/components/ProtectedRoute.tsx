import { Navigate } from "react-router-dom";
import { useAuthStore } from "../utils/store";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

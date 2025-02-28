import { Navigate } from "react-router-dom";
import { useAuthStore } from "../utils/store";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;


<button
                className="flex items-center px-3 py-1 font-medium border border-gray-300 rounded-full"
                style={{
                  height: "36px",
                  borderRadius: "18px",
                  color: "#063E53",
                  backgroundColor: "#064C651A",
                }}
              >
                +
              </button>
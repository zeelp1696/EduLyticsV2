import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  // Personal login stores token in localStorage
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("authToken")
      : null;

  if (!user && !token) {
    // neutral default: personal login
    return <Navigate to="/personal/login" replace />;
  }

  return children;
};

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null; // Or spinner
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role.toUpperCase()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

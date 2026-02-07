import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ADMIN_EMAIL = "admin@gmail.com";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (user.email !== ADMIN_EMAIL) {
    return <Navigate to="/homeuser" replace />;
  }

  return children;
};

export default AdminRoute;

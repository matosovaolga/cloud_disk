import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const GuestRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? <Navigate to="/" replace /> : children;
};

export default GuestRoute;

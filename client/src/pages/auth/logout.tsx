import useAuthStore from "@/store/auth-store";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const LogoutHandler = () => {
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to="/login" replace />;
};

export default LogoutHandler;

import useAuthStore from "@/store/auth-store";
import { JSX } from "react";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = useAuthStore((state) => state.isAuthenticated);

  if (isAuth) return <Navigate to="/dashboard" replace />;

  return children;
};

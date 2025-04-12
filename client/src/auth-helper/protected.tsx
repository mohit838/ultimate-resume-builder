import LoaderSpinner from "@/components/common/loader";
import useAuthStore from "@/store/auth-store";
import { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (isLoading) return <LoaderSpinner />;

  if (!isAuth)
    return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

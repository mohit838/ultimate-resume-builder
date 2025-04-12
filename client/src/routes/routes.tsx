import { ProtectedRoute } from "@/auth-helper/protected";
import { PublicRoute } from "@/auth-helper/public";
import LoginPage from "@/pages/auth/login";
import LogoutHandler from "@/pages/auth/logout";
import OtpVerificationPage from "@/pages/auth/otp-verification-page";
import ResetPasswordPage from "@/pages/auth/reset-password";
import SignupPage from "@/pages/auth/signup";
import DashboardPage from "@/pages/dashboard/dashboard";
import NotFoundPage from "@/pages/not-found/NotFound";
import ResumePage from "@/pages/resume/resume";
import Enable2faPage from "@/pages/settings/enable-2fa/enable-2fa";
import ProfilePage from "@/pages/settings/profile/profile";
import { Navigate, useRoutes } from "react-router-dom";

const ResumeRouters = () => {
  const routes = useRoutes([
    { path: "/", element: <Navigate to={"/dashboard"} /> },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/resume",
      element: (
        <ProtectedRoute>
          <ResumePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/resume",
      element: (
        <ProtectedRoute>
          <ResumePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/settings/profile",
      element: (
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/settings/enable-2fa",
      element: (
        <ProtectedRoute>
          <Enable2faPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/logout",
      element: (
        <ProtectedRoute>
          <LogoutHandler />
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      ),
    },
    {
      path: "/signup",
      element: (
        <PublicRoute>
          <SignupPage />
        </PublicRoute>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <PublicRoute>
          <ResetPasswordPage />
        </PublicRoute>
      ),
    },
    {
      path: "/verify-otp",
      element: (
        <PublicRoute>
          <OtpVerificationPage />
        </PublicRoute>
      ),
    },
    // not-found routes
    { path: "*", element: <NotFoundPage /> },
  ]);

  return routes;
};

export default ResumeRouters;

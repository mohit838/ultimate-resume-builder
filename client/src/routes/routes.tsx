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

const protectedRoutes = [
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/resume", element: <ResumePage /> },
  { path: "/settings/profile", element: <ProfilePage /> },
  { path: "/settings/enable-2fa", element: <Enable2faPage /> },
  { path: "/logout", element: <LogoutHandler /> },
];

const publicRoutes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/forgot-password", element: <ResetPasswordPage /> },
  { path: "/verify-otp", element: <OtpVerificationPage /> },
];

const ResumeRouters = () => {
  const routes = useRoutes([
    { path: "/", element: <Navigate to="/dashboard" /> },
    ...protectedRoutes.map((r) => ({
      path: r.path,
      element: <ProtectedRoute>{r.element}</ProtectedRoute>,
    })),
    ...publicRoutes.map((r) => ({
      path: r.path,
      element: <PublicRoute>{r.element}</PublicRoute>,
    })),
    { path: "*", element: <NotFoundPage /> },
  ]);

  return routes;
};

export default ResumeRouters;

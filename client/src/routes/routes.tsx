import LoginPage from "@/pages/auth/login";
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
    { path: "/dashboard", element: <DashboardPage /> },
    { path: "/resume", element: <ResumePage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignupPage /> },
    { path: "/resume", element: <ResumePage /> },
    { path: "/settings/profile", element: <ProfilePage /> },
    { path: "/settings/enable-2fa", element: <Enable2faPage /> },
    // not-found routes
    { path: "*", element: <NotFoundPage /> },
  ]);

  return routes;
};

export default ResumeRouters;

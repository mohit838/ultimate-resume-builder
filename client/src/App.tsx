import ResumeRouters from "@/routes/routes";
import useAuthStore from "@/store/auth-store";
import { useLocation } from "react-router-dom";
import { ResumeLayout } from "./components/layouts/resume-layout";

// Valid routes that use public layout
const publicPaths = [
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
];

const App = () => {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();
  const isPublicRoute = publicPaths.includes(location.pathname);

  // show without layout
  if (!isAuth && isPublicRoute) {
    return <ResumeRouters />;
  }

  // fallback: catch for 404 outside of auth
  if (!isAuth && !publicPaths.includes(location.pathname)) {
    return <ResumeRouters />;
  }

  // Default: render with layout
  return (
    <ResumeLayout>
      <ResumeRouters />
    </ResumeLayout>
  );
};

export default App;

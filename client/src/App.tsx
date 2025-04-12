import ResumeRouters from "@/routes/routes";
import useAuthStore from "@/store/auth-store";
import { useLocation } from "react-router-dom";
import { ResumeLayout } from "./components/layouts/resume-layout";

const App = () => {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  const isPublicRoute = ["/login", "/signup", "/forgot-password"].includes(
    location.pathname
  );

  // For public pages like login/signup
  if (!isAuth && isPublicRoute) {
    return <ResumeRouters />;
  }

  // For all other routes, show CMS layout
  return (
    <ResumeLayout>
      <ResumeRouters />
    </ResumeLayout>
  );
};

export default App;

import { useTokenStore } from "@/store/store";
import { Navigate, useLocation } from "react-router";

const ProjectGuard = ({ children }: { children: React.ReactNode }) => {
  const token = useTokenStore((state) => state.token);
  const location = useLocation();

  // Agar token empty hai
  if (token === "") {
    if (location.pathname !== "/auth/login") {
      return <Navigate to="/auth/login" replace />;
    }
    return children;
  }

  if (token !== "" && location.pathname === "/auth/login") {
    // return <Navigate to="/" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProjectGuard;

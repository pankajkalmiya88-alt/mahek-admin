import { useTokenStore } from "@/store/store";
import { Navigate } from "react-router";

const AuthGuard = ({ children }: any) => {
  const token = useTokenStore((state) => state.token);

  if (token === "") {
    return <Navigate to={"/auth/login"} />;
  }
  else{
    return children;
  }

  // return children
};

export default AuthGuard;

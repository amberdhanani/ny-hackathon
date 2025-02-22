import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";


const CustomRoute = ({ children, path }: { children: React.ReactNode; path?: string }) => {
  const { currentAuthUser, loading } = useAuth();
  if (loading) return null;
  if (!currentAuthUser && path !== "/login") {
    return <Navigate to={"/login"} replace />;
  }
  if (currentAuthUser && path === "/login") {
    return <Navigate to={"/analytics"} />;
  }
  return <>{children}</>;
};

export default CustomRoute;
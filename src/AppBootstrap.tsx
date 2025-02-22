import React from "react";
import { useAuth } from "./contexts/AuthContext";
import UserContainer from "./UserContainer";
import SiteRoutes from "./routes/Routes";
import { BrowserRouter as Router } from "react-router-dom";

const AppBootstrap = () => {
  const { currentAuthUser } = useAuth();

  return (
    <Router>
      <SiteRoutes/>
    </Router>
  )}

export default AppBootstrap;

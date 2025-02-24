import React from "react";

import SiteRoutes from "./routes/Routes";
import { BrowserRouter as Router } from "react-router-dom";

const AppBootstrap = () => {


  return (
    <Router>
      <SiteRoutes/>
    </Router>
  )}

export default AppBootstrap;

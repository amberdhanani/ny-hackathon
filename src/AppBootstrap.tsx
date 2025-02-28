import React from "react";

import SiteRoutes from "./routes/Routes";
import { BrowserRouter as Router } from "react-router-dom";
import { DBProvider } from "./providers/DBProvider";

const AppBootstrap = () => {
  return (
    <Router>
      <DBProvider>
        <SiteRoutes />
      </DBProvider>
    </Router>
  );
};

export default AppBootstrap;

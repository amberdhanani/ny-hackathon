import React from "react";

import SiteRoutes from "./routes/Routes";
import { BrowserRouter as Router } from "react-router-dom";
import { DBProvider } from "./providers/DBProvider";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";

const AppBootstrap = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
      <DBProvider>
        <SiteRoutes />
      </DBProvider>
      </ThemeProvider>
    </Router>
  );
};

export default AppBootstrap;

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useAuth } from "./contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function NavBar({ title }: { title: string }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Track the selected button
  const [selected, setSelected] = React.useState(location.pathname);

  // Update state when the route changes (useful for direct URL navigation)
  React.useEffect(() => {
    setSelected(location.pathname);
  }, [location.pathname]);

  // Dynamic styles for buttons
  const buttonStyle = (path: string) => ({
    color: selected === path ? "#4F46E5" : "rgba(1,9,65,.6)", // Change text color when selected
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: selected === path ? "rgba(79, 70, 229, 0.06)" : "transparent",
    "&:hover": {
      backgroundColor: "rgba(79, 70, 229, 0.06)",
    },
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ backgroundColor: "#fff" }} position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Box>
            <img src="/logo.svg" alt="logo" style={{ height: "64px" }} />
          </Box>

          {/* Navigation Buttons with Dotter Circle SVG Icons */}
          <Box sx={{ display: "flex", gap: "20px" }}>
            <Button onClick={() => navigate("/analytics")} sx={buttonStyle("/analytics")}>
              <img src="/dotter-circle.svg" alt="dotter circle" style={{ width: "24px", height: "24px" }} />
              Analytics
            </Button>

            <Button onClick={() => navigate("/transcripts")} sx={buttonStyle("/transcripts")}>
              <img src="/dotter-circle.svg" alt="dotter circle" style={{ width: "24px", height: "24px" }} />
              Transcripts
            </Button>

            <Button onClick={() => navigate("/new-recording")} sx={buttonStyle("/new-recording")}>
              <img src="/dotter-circle.svg" alt="dotter circle" style={{ width: "24px", height: "24px" }} />
              New Recording
            </Button>
          </Box>

          {/* Styled Logout Button */}
          <Box>
            <Button
              onClick={() => logout()}
              sx={{
                color: "#4F46E5",
                border: "2px solid #4F46E5",
                borderRadius: "8px",
                padding: "6px 16px",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "rgba(79, 70, 229, 0.1)",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";


export default function NavBar({ title }: { title: string }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ backgroundColor: "#fff" }} position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box>
            <img src="/logo.svg" alt="logo" style={{ height: "64px" }} />
          </Box>
          <Box>
            <Button onClick={() => { navigate("/analytics") }} sx={{ color: "rgba(1,9,65,.6)" }}>Analytics</Button>
            <Button onClick={() => { navigate("/transcripts") }} sx={{ color: "rgba(1,9,65,.6)" }}>Transcripts</Button>
            <Button onClick={() => { navigate("/new-recording") }} sx={{ color: "rgba(1,9,65,.6)" }}>New Recording</Button>
          </Box>
          <Box><Button onClick={() => logout()} sx={{ color: "rgba(1,9,65,.6)" }}>Logout</Button>
            </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

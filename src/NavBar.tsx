import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";


export default function NavBar({title}: {title: string}) {
   const {logout} = useAuth();
   const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ChatterCheck - {title}
          </Typography>
          <Button onClick={()=> {navigate ("/analytics")}} color="inherit">Analytics</Button>
          <Button onClick={()=> {navigate ("/transcripts")}}color="inherit">Transcripts</Button>
          <Button onClick={()=> {navigate ("/new-recording")}}color="inherit">New Recording</Button>
          <Button onClick= { () => logout ()} color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

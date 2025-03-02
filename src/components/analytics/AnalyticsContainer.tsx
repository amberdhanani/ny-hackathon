import { Box, Container, Grid, Typography } from '@mui/material';
import React from 'react'
import NavBar from '../../NavBar';
import { useNavigate } from 'react-router-dom';

const AnalyticsContainer: React.FC = () => {
  // Use process.env.PUBLIC_URL to correctly reference SVGs in public/assets
  const communicationSummary = `${process.env.PUBLIC_URL}/assets/communication-summary.svg`;
  const trendsLeft = `${process.env.PUBLIC_URL}/assets/trends-left.svg`;
  const trendsRight = `${process.env.PUBLIC_URL}/assets/trends-right.svg`;

  return (
    <Box className="analytics-page">
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ paddingY: 4 }}>
        {/* Page Title */}
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Your Communication Summary
        </Typography>

        {/* Communication Summary (Main Graph) */}
        <Box
          sx={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <img
            src="/assets/communication-summary.svg"
            alt="Communication Summary"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Box>

        {/* Trends Section */}
        <Grid container spacing={3}>
          {/* Left Trends Box */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                background: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: "10px" }}>
                Trends (6M)
              </Typography>
              <img
                src="/assets/trends-left.svg"
                alt="Trends Data"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Box>
          </Grid>

          {/* Right Trends Graph */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                background: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: "10px" }}>
                Trends Over Time
              </Typography>
              <img
                src="/assets/trends-right.svg"
                alt="Trends Graph"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AnalyticsContainer;
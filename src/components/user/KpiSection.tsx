"use client";

import { Box, Grid, Typography, Paper } from "@mui/material";

const kpis = [
  { label: "Penduduk", value: 29779 },
  { label: "Keluarga", value: 2385 },
  { label: "Laki-Laki", value: 10473 },
  { label: "Perempuan", value: 10306 },
];

export default function KpiSection() {
  return (
    <Box sx={{ px: 4, py: 6 }}>
      {/* Header */}
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={4}
        sx={{ color: "green",
          letterSpacing: 0.5,
         }}
      >
        Data Statistik Nagari
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {kpis.map((kpi, index) => (
          <Grid
            key={index}
            size={{ xs: 12, sm: 6, md: 3 }}
            display="flex"
            justifyContent="center"
          >
            <Paper
              elevation={4}
              sx={{
                background: "linear-gradient(135deg, #d9c77a, #a39357)",
                color: "#000",
                minHeight: 120,
                width: "100%",
                maxWidth: 250,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 3,
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                },
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mb: 0.5 }}
              >
                {kpi.value.toLocaleString("id-ID")}
              </Typography>
              <Typography variant="body1">{kpi.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

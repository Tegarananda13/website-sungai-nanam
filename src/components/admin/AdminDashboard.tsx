"use client";

import { Box, Typography, Grid, Card, CardContent, List, ListItem, ListItemText } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";


const kpiData = [
  { name: "Penduduk", value: 1200 },
  { name: "Keluarga", value: 350 },
  { name: "Laki-laki", value: 600 },
  { name: "Perempuan", value: 600 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const trafficData = [
  { tanggal: "Sen", jumlah: 20 },
  { tanggal: "Sel", jumlah: 40 },
  { tanggal: "Rab", jumlah: 35 },
  { tanggal: "Kam", jumlah: 50 },
  { tanggal: "Jum", jumlah: 70 },
  { tanggal: "Sab", jumlah: 60 },
  { tanggal: "Min", jumlah: 90 },
];

const wisataData = [
  { name: "Air Terjun", pengunjung: 120 },
  { name: "Kebun Teh", pengunjung: 95 },
  { name: "Bukit Indah", pengunjung: 75 },
];

const beritaTerbaru = [
  { id: 1, title: "Festival Nagari Dimulai", date: "2025-07-28" },
  { id: 2, title: "Panen Raya Sungai Nanam", date: "2025-07-25" },
  { id: 3, title: "Wisata Baru Dibuka", date: "2025-07-22" },
];

export default function AdminDashboard() {
  return (
    <Box sx={{ px: 4, mt: 4, mb: 10 }}>
      <Typography variant="h4" fontWeight="bold" mb={4} color="green">
        Dashboard Admin
      </Typography>

      {/* KPI Summary */}
      <Grid container spacing={3} columns={12} mb={4}>
        {kpiData.map((kpi) => (
          <Grid key={kpi.name} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ bgcolor: "#b3a367", color: "black" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {kpi.name}
                </Typography>
                <Typography variant="h4">{kpi.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Traffic & KPI Visualization */}
      <Grid container spacing={3} columns={12} mb={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Jumlah Kunjungan Website
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trafficData}>
                  <XAxis dataKey="tanggal" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="jumlah" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Komposisi KPI Penduduk
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={kpiData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {kpiData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Wisata Terpopuler & Berita Terbaru */}
      <Grid container spacing={3} columns={12}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Wisata Terpopuler
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={wisataData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="pengunjung" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Berita Terbaru
              </Typography>
              <List>
                {beritaTerbaru.map((berita) => (
                  <ListItem key={berita.id} divider>
                    <ListItemText
                      primary={berita.title}
                      secondary={`Tanggal: ${berita.date}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

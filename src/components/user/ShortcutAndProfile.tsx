"use client";

import { useEffect, useState } from "react";
import { Box, Grid, Typography, Paper, IconButton } from "@mui/material";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface BerandaData {
  description: string | null;
}

const shortcuts = [
  {
    label: "Profil Nagari",
    icon: <AccountTreeIcon sx={{ fontSize: 60 }} />, // diperbesar
    href: "/profil-nagari",
  },
  {
    label: "Berita",
    icon: <NewspaperIcon sx={{ fontSize: 60 }} />, // diperbesar
    href: "/berita",
  },
  {
    label: "Wisata",
    icon: <TravelExploreIcon sx={{ fontSize: 60 }} />, // diperbesar
    href: "/wisata",
  },
];

export default function ShortcutAndProfile() {
  const router = useRouter();
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const fetchDescription = async () => {
      const { data, error } = await supabase
        .from("beranda")
        .select("description")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Supabase description fetch error:", error.message);
      } else {
        setDescription(data?.description || "");
      }
    };

    fetchDescription();
  }, []);

  return (
    <Box sx={{ px: 4, py: 6 }}>
      {/* Tentang Nagari */}
      <Box sx={{ mb: 6, textAlign: "center", maxWidth: 800, mx: "auto" }}>
        <Typography variant="h4" fontWeight="bold" color="green" gutterBottom>
          Tentang Nagari Sungai Nanam
        </Typography>
        <Typography variant="body1">
          {description}
        </Typography>
      </Box>

      {/* Tombol Shortcut */}
      <Grid container spacing={3} justifyContent="center">
        {shortcuts.map((item, index) => (
          <Grid
            key={index}
            sx={{
              flexBasis: { xs: "100%", sm: "33.333%" },
              maxWidth: { xs: "100%", sm: "33.333%" },
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Paper
              elevation={3}
              onClick={() => router.push(item.href)}
              sx={{
                backgroundColor: "#f0eada",
                height: 180, // diperbesar
                width: "100%",
                maxWidth: 220, // diperbesar
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                borderRadius: 3,
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 6,
                },
              }}
            >
              <IconButton color="primary" sx={{ mb: 1 }}>
                {item.icon}
              </IconButton>
              <Typography variant="subtitle1" fontWeight="bold">
                {item.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

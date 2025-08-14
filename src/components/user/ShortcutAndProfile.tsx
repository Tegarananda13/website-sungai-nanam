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
    icon: <AccountTreeIcon sx={{ fontSize: 60 }} />,
    href: "/profil-nagari",
  },
  {
    label: "Berita",
    icon: <NewspaperIcon sx={{ fontSize: 60 }} />,
    href: "/berita",
  },
  {
    label: "Wisata",
    icon: <TravelExploreIcon sx={{ fontSize: 60 }} />,
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
      {/* Judul Tentang Nagari */}
      <Typography
        variant="h4"
        fontWeight="bold"
        color="green"
        textAlign="center"
        sx={{ mb: 2 }}
      >
        Tentang Nagari Sungai Nanam
      </Typography>

      {/* Deskripsi Tentang Nagari */}
      <Paper
        elevation={3}
        sx={{
          mb: 6,
          px: 4,
          py: 3,
          maxWidth: 900,
          mx: "auto",
          textAlign: "center",
          borderRadius: 3,
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          {description}
        </Typography>
      </Paper>

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
                height: 200,
                width: "100%",
                maxWidth: 260, // sedikit dilebarkan
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

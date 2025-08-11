"use client";

import { useEffect, useState } from "react";
import { Box, Grid, Typography, Paper, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface BerandaData {
  description: string | null;
}

const shortcuts = [
  {
    label: "Profil Nagari",
    icon: <InfoIcon sx={{ fontSize: 50 }} />,
    href: "/profil-nagari",
  },
  {
    label: "Berita",
    icon: <NewspaperIcon sx={{ fontSize: 50 }} />,
    href: "/berita",
  },
  {
    label: "Wisata",
    icon: <TravelExploreIcon sx={{ fontSize: 50 }} />,
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
      <Grid
        container
        spacing={4}
        wrap="nowrap"
        alignItems="flex-start"
      >
        {/* Shortcut Buttons (kiri) */}
        <Grid
          sx={{
            flexBasis: { xs: "60%", md: "60%" },
            maxWidth: { xs: "60%", md: "60%" },
          }}
        >
          <Grid container spacing={3}>
            {shortcuts.map((item, index) => (
              <Grid
                key={index}
                sx={{
                  flexBasis: { xs: "100%", sm: "33.333%" },
                  maxWidth: { xs: "100%", sm: "33.333%" },
                }}
              >
                <Paper
                  elevation={3}
                  onClick={() => router.push(item.href)}
                  sx={{
                    backgroundColor: "#f0eada",
                    height: 160,
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
        </Grid>

        {/* Tentang Nagari (kanan) */}
        <Grid
          sx={{
            flexBasis: { xs: "40%", md: "40%" },
            maxWidth: { xs: "40%", md: "40%" },
            pl: { xs: 2, md: 4 },
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="green" gutterBottom>
            Tentang Nagari Sungai Nanam
          </Typography>
          <Typography variant="body1">
            {description ||
              "Nagari Sungai Nanam merupakan salah satu nagari yang terletak di Kecamatan Lembah Gumanti, Kabupaten Solok."}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

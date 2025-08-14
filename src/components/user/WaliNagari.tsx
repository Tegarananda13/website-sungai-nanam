"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Grid, Avatar, Paper } from "@mui/material";
import { supabase } from "@/lib/supabase";

interface BerandaData {
  wali_name: string | null;
  wali_description: string | null;
  wali_photo: string | null;
}

export default function WaliNagari() {
  const [wali, setWali] = useState<BerandaData>({
    wali_name: "",
    wali_description: "",
    wali_photo: "",
  });

  useEffect(() => {
    const fetchWali = async () => {
      const { data, error } = await supabase
        .from("beranda")
        .select("wali_name, wali_description, wali_photo")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Supabase Wali fetch error:", error.message);
      } else if (data) {
        setWali(data);
      }
    };

    fetchWali();
  }, []);

  return (
    <Box sx={{ px: 4, py: 6 }}>
      <Typography variant="h4" fontWeight="bold" color="green" mb={4} textAlign="center">
        Profil Wali Nagari
      </Typography>

      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          backgroundColor: "#fafafa",
        }}
      >
        <Grid
          container
          spacing={4}
          sx={{
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
          }}
        >
          {/* Teks di kiri */}
          <Grid sx={{ flex: { md: 2 }, width: { xs: "100%", md: "66.66%" } }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {wali.wali_name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              gutterBottom
            >
              Wali Nagari Sungai Nanam
            </Typography>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.7, textAlign: "justify" }}
            >
              {wali.wali_description}
            </Typography>
          </Grid>

          {/* Foto di kanan */}
          <Grid
            sx={{
              flex: { md: 1 },
              width: { xs: "100%", md: "33.33%" },
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Avatar
              alt={wali.wali_name || "Wali Nagari"}
              src={wali.wali_photo ?? ""} // aman, kalau undefined/null jadi string kosong
              sx={{
                width: 200,
                height: 200,
                border: "4px solid white",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { supabase } from "@/lib/supabase";

interface BerandaData {
  hero_title: string;
  hero_subtitle: string;
  hero_image: string | null;
}

export default function Hero() {
  const [data, setData] = useState<BerandaData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("beranda")
        .select("hero_title, hero_subtitle, hero_image")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Supabase Hero fetch error:", error.message);
      } else {
        setData(data);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
        backgroundImage: `url(${data?.hero_image || "/sungai-nanam.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay gelap */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      />

      {/* Teks selamat datang */}
      <Box sx={{ position: "relative", zIndex: 2, px: 2 }}>
        <Typography variant="h3" fontWeight="bold" mt={1}>
          {data?.hero_title || "Selamat Datang Di"}
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {data?.hero_subtitle || "Website Nagari Sungai Nanam"}
        </Typography>
      </Box>
    </Box>
  );
}

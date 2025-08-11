"use client"

import { useEffect, useState } from "react"
import { Box, Typography, Paper } from "@mui/material"
import { supabase } from "@/lib/supabase"

export default function SejarahSection() {
  const [sejarah, setSejarah] = useState("")
  const [sejarahImage, setSejarahImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("profil_nagari")
        .select("sejarah, sejarah_image")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single()

      if (data) {
        setSejarah(data.sejarah || "")
        setSejarahImage(data.sejarah_image || null)
      }
    }
    fetchData()
  }, [])

  return (
    <Box sx={{ mt: 8, px: { xs: 2, md: 10 }, mb: 8 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" color="green" mb={2}>
            Sejarah Nagari Sungai Nanam
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="justify">
            {sejarah}
          </Typography>
        </Box>

        {sejarahImage ? (
          <Box
            component="img"
            src={sejarahImage}
            alt="Sejarah Nagari"
            sx={{
              width: "100%",
              height: 250,
              objectFit: "cover",
              borderRadius: 3,
              boxShadow: 3,
            }}
          />
        ) : (
          <Paper
            elevation={3}
            sx={{
              height: 250,
              backgroundColor: "#f5f5f5",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "gray",
              fontStyle: "italic",
            }}
          >
            Gambar sejarah
          </Paper>
        )}
      </Box>
    </Box>
  )
}

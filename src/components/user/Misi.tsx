"use client"

import { useEffect, useState } from "react"
import { Box, Typography } from "@mui/material"
import StarIcon from "@mui/icons-material/Star"
import { supabase } from "@/lib/supabase"

export default function Misi() {
  const [misiList, setMisiList] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("profil_nagari").select("misi").order("updated_at", { ascending: false }).limit(1).single()
      if (data?.misi) {
        setMisiList(data.misi)
      }
    }
    fetchData()
  }, [])

  return (
    <Box sx={{ py: 6, px: 3 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" color="green" mb={4}>
        Misi
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3, maxWidth: 1000, mx: "auto" }}>
        {misiList.map((item, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: "100%", sm: "47%" },
              backgroundColor: "#F7F5E6",
              p: 2,
              boxShadow: 3,
              borderRadius: 2,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <StarIcon sx={{ color: "#A89753", mr: 1, mt: 0.5 }} />
            <Typography>{item}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Box, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { supabase } from "@/lib/supabase"

export default function Visi() {
  const [visiList, setVisiList] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("profil_nagari").select("visi").order("updated_at", { ascending: false }).limit(1).single()
      if (data?.visi) {
        setVisiList(data.visi)
      }
    }
    fetchData()
  }, [])

  return (
    <Box sx={{ py: 6, px: 2 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" color="green" mb={4}>
        Visi
      </Typography>

      <Card sx={{ maxWidth: 900, mx: "auto", backgroundColor: "#F7F5E6", boxShadow: 5 }}>
        <CardContent>
          <List>
            {visiList.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: "#A89753" }} />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  )
}

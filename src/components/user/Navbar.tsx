// components/Navbar.tsx
"use client"

import { AppBar, Toolbar, Button, Box, Typography, Stack } from "@mui/material"
import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
  const navItems = [
    { label: "Beranda", href: "/" },
    { label: "Profil Nagari", href: "/profil-nagari" },
    { label: "Berita", href: "/berita" },
    { label: "Wisata", href: "/wisata" },
  ]

  return (
    <AppBar position="static" sx={{ backgroundColor: "#A89753" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo + Nama Nagari */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              perspective: "500px",
              animation: "spinY 4s linear infinite",
              "@keyframes spinY": {
                from: { transform: "rotateY(0deg)" },
                to: { transform: "rotateY(360deg)" },
              },
            }}
          >
            <Image
              src="/logo-solok.png"
              alt="Logo Solok"
              width={40}
              height={40}
              style={{ marginRight: 8 }}
            />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" lineHeight={1}>
              Nagari Sungai Nanam
            </Typography>
            <Typography variant="caption" sx={{ color: "#222" }}>
              Kabupaten Solok
            </Typography>
          </Box>
        </Box>

        {/* Navigasi */}
        <Stack direction="row" spacing={2}>
          {navItems.map((item, index) => (
            <Button
              key={index}
              component={Link}
              href={item.href}
              sx={{
                position: "relative",
                color: "black", // emas terang
                fontWeight: "normal",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                px: 2,
                transition: "color 0.3s ease",
                "&:hover": {
                  color: "#000", // jadi hitam saat hover
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: "0%",
                  height: "2px",
                  left: 0,
                  bottom: 0,
                  backgroundColor: "#000",
                  transition: "width 0.3s ease",
                },
                "&:hover::after": {
                  width: "100%",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

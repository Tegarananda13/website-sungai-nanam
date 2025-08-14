"use client"

import {Box, Typography, Link, Divider, Stack,} from "@mui/material"
import Image from "next/image"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import HomeIcon from "@mui/icons-material/Home"
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0f1f1d",
        color: "white",
        py: 4,
        px: { xs: 3, md: 8 },
      }}
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="flex-start"
        gap={6}
      >
        {/* Kolom 1: Logo */}
        <Box
          flexShrink={0}
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Image
            src="/logo-solok.png"
            alt="Logo Nagari Sungai Nanam"
            width={100}
            height={100}
            style={{ objectFit: "contain" }}
          />
        </Box>

        {/* Kolom 2: Info Kontak */}
        <Box flex={1}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Pemerintah Nagari Sungai Nanam
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <LocationOnIcon sx={{ mr: 1 }} />
            <Typography>Jl. Raya Sungai Nanam No. 1, Solok Selatan</Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <EmailIcon sx={{ mr: 1 }} />
            <Typography>nagarisungainanam@email.com</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <PhoneIcon sx={{ mr: 1 }} />
            <Typography>+62 812-3456-7890</Typography>
          </Box>
        </Box>

        {/* Kolom 3: Navigasi */}
        <Box flex={1}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Navigasi
          </Typography>
          <Stack spacing={1}>
            <Link href="/" color="inherit" underline="hover" sx={{ display: "flex", alignItems: "center" }}>
              <HomeIcon sx={{ mr: 1 }} /> Beranda
            </Link>
            <Link href="/profil-nagari" color="inherit" underline="hover" sx={{ display: "flex", alignItems: "center" }}>
              <AccountTreeIcon sx={{ mr: 1 }} /> Profil Nagari
            </Link>
            <Link href="/berita" color="inherit" underline="hover" sx={{ display: "flex", alignItems: "center" }}>
              <NewspaperIcon sx={{ mr: 1 }} /> Berita
            </Link>
            <Link href="/wisata" color="inherit" underline="hover" sx={{ display: "flex", alignItems: "center" }}>
              <TravelExploreIcon sx={{ mr: 1 }} /> Wisata
            </Link>
          </Stack>
        </Box>
      </Box>

      <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.2)" }} />

      <Typography textAlign="center" variant="body2">
        © {new Date().getFullYear()} Pemerintah Nagari Sungai Nanam. All rights reserved.
      </Typography>
    </Box>
  )
}

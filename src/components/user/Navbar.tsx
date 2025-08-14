"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import InfoIcon from "@mui/icons-material/Info";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import MapIcon from "@mui/icons-material/Map";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Beranda", href: "/", icon: <HomeIcon /> },
    { label: "Profil Nagari", href: "/profil-nagari", icon: <AccountTreeIcon /> },
    { label: "Berita", href: "/berita", icon: <NewspaperIcon /> },
    { label: "Wisata", href: "/wisata", icon: <MapIcon /> },
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: "#0f1f1d" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo + Nama */}
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
            <Typography variant="subtitle1" fontWeight="bold" color="green" lineHeight={1}>
              Nagari Sungai Nanam
            </Typography>
            <Typography variant="caption" sx={{ color: "#ccc" }}>
              Kabupaten Solok
            </Typography>
          </Box>
        </Box>

        {/* Menu Desktop */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          {navItems.map((item, index) => (
            <Button
              key={index}
              component={Link}
              href={item.href}
              sx={{
                position: "relative",
                color: "white",
                fontWeight: "normal",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                px: 2,
                transition: "color 0.3s ease",
                "&:hover": { color: "#a5d6a7" },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: "0%",
                  height: "2px",
                  left: 0,
                  bottom: 0,
                  backgroundColor: "#a5d6a7",
                  transition: "width 0.3s ease",
                },
                "&:hover::after": { width: "100%" },
              }}
              startIcon={item.icon}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        {/* Burger Menu Mobile */}
        <IconButton
          sx={{ display: { xs: "flex", md: "none" }, color: "white" }}
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          anchor="right"
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{
            sx: { backgroundColor: "#0f1f1d", color: "white" },
          }}
        >
          <Box sx={{ width: 250 }}>
            <List>
              {navItems.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    onClick={() => setOpen(false)}
                  >
                    <ListItemIcon sx={{ color: "white" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}

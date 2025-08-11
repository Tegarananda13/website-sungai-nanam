"use client";

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LandscapeIcon from "@mui/icons-material/Landscape";
import ArticleIcon from "@mui/icons-material/Article";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const menuItems = [
  { text: "Dashboard", icon: <HomeIcon />, href: "/admin/dashboard" },
  { text: "Beranda", icon: <DashboardIcon />, href: "/admin/beranda" },
  { text: "Profil Nagari", icon: <AccountTreeIcon />, href: "/admin/profil-nagari" },
  { text: "Berita", icon: <ArticleIcon />, href: "/admin/berita" },
  { text: "Wisata", icon: <LandscapeIcon />, href: "/admin/wisata" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <Box
      sx={{
        width: 240,
        bgcolor: "#b3a367",
        color: "black",
        height: "100vh",
        p: 2,
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header dan Menu Utama */}
      <Box>
        <Box sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}>
          Dashboard Admin
        </Box>

        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              component={Link}
              href={item.href}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: pathname === item.href ? "rgba(0,0,0,0.15)" : "transparent",
                "&:hover": { bgcolor: "rgba(0,0,0,0.15)" },
              }}
            >
              <ListItemIcon sx={{ color: "black" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Logout Button */}
      <Box>
        <Divider sx={{ my: 2, borderColor: "rgba(0,0,0,0.3)" }} />
        <List>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              "&:hover": { bgcolor: "rgba(0,0,0,0.15)" },
            }}
          >
            <ListItemIcon sx={{ color: "black" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );
}

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
import HomeIcon from "@mui/icons-material/Home";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import LogoutIcon from "@mui/icons-material/Logout";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const menuItems = [
  { text: "Beranda", icon: <HomeIcon />, href: "/admin/beranda" },
  { text: "Profil Nagari", icon: <AccountTreeIcon />, href: "/admin/profil-nagari" },
  { text: "Berita", icon: <NewspaperIcon />, href: "/admin/berita" },
  { text: "Wisata", icon: <TravelExploreIcon />, href: "/admin/wisata" },
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
        bgcolor: "#0f1f1d",
        color: "white", // teks default putih
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
                bgcolor: pathname === item.href ? "rgba(255,255,255,0.1)" : "transparent",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                color: "white", // teks putih
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Logout Button */}
      <Box>
        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.3)" }} />
        <List>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              color: "white",
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );
}

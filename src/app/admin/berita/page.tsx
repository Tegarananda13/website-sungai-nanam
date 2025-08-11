"use client";

import { Box, Typography } from "@mui/material";
import AdminBeritaPage from "@/components/admin/AdminBeritaPage";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminBerita() {
  const { loading, authenticated } = useAdminAuth();

  if (loading) {
    return <Typography textAlign="center">Memeriksa sesi...</Typography>;
  }

  if (!authenticated) {
    return null; // useAdminAuth akan redirect ke /login jika belum login
  }

  return (
    <Box sx={{ p: 4 }}>
      <AdminBeritaPage />
    </Box>
  );
}

"use client";

import { Box, Typography } from "@mui/material";
import AdminProfilNagariForm from "@/components/admin/AdminProfilNagariForm";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminProfilNagariPage() {
  const { loading, authenticated } = useAdminAuth();

  if (loading) {
    return <Typography textAlign="center">Memeriksa sesi...</Typography>;
  }

  if (!authenticated) {
    // ❌ Jangan render apapun jika belum login, karena useAdminAuth akan redirect
    return null;
  }

  return (
    <Box sx={{ p: 4 }}>
      <AdminProfilNagariForm />
    </Box>
  );
}

"use client";

import { Box, Typography } from "@mui/material";
import AdminBerandaForm from "@/components/admin/AdminBerandaForm";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminBerandaPage() {
  const { loading, authenticated } = useAdminAuth();

  if (loading) {
    return <Typography textAlign="center">Memeriksa sesi...</Typography>;
  }

  if (!authenticated) {
    return null;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4} color="green">
        Kelola Beranda
      </Typography>
      <AdminBerandaForm />
    </Box>
  );
}

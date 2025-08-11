// app/wisata/page.tsx
"use client";

import { Box, Typography } from "@mui/material";
import AdminWisataPage from "@/components/admin/AdminWisataPage";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function WisataAdminPage() {
  const { loading, authenticated } = useAdminAuth();

  if (loading) {
    return <Typography textAlign="center">Memeriksa sesi...</Typography>;
  }

  if (!authenticated) {
    return null; // Karena useAdminAuth sudah melakukan redirect
  }

  return (
    <Box sx={{ p: 4 }}>
      <AdminWisataPage />
    </Box>
  );
}

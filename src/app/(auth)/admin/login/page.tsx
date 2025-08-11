// app/admin/login/page.tsx
"use client";

import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { Box } from "@mui/material";

export default function AdminLoginPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f0f0",
      }}
    >
      <AdminLoginForm />
    </Box>
  );
}

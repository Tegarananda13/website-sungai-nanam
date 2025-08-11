"use client";

import { Box } from "@mui/material";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Box sx={{ display: "flex" }}>
        <AdminSidebar />
        <Box sx={{ flexGrow: 1, ml: "240px", p: 3 }}>{children}</Box>
      </Box>
    </ProtectedRoute>
  );
}

"use client";

import dynamic from "next/dynamic";
import { Typography } from "@mui/material";
import { useAdminAuth } from "@/hooks/useAdminAuth";

// ✅ Lazy load AdminDashboard untuk hindari SSR
const AdminDashboard = dynamic(() => import("@/components/admin/AdminDashboard"), {
  ssr: false,
});

export default function DashboardPage() {
  const { loading, authenticated } = useAdminAuth();

  if (loading) {
    return <Typography textAlign="center">Memeriksa sesi...</Typography>;
  }

  if (!authenticated) {
    // ❌ Tidak perlu render apapun karena useAdminAuth sudah redirect
    return null;
  }

  // ✅ Full client-side, bebas hydration mismatch
  return (
    <div suppressHydrationWarning>
      <AdminDashboard />
    </div>
  );
}

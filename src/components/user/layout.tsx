"use client";

import type { ReactNode } from "react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar di atas */}
      <Navbar />

      {/* Konten halaman */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Footer di bawah */}
      <Footer />
    </div>
  );
}

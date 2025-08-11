"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/admin/login"); // arahkan ke login kalau belum login
      } else {
        setChecking(false); // lanjut render konten
      }
    };

    checkSession();
  }, [router]);

  if (checking) return null; // atau bisa return loading spinner

  return <>{children}</>;
}

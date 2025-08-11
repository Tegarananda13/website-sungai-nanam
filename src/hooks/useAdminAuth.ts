"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function useAdminAuth() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        // ❌ Belum login → redirect ke login
        router.replace("/admin/login");
      } else {
        // ✅ Sudah login
        setAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();

    // Optional: listen perubahan login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/admin/login");
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return { loading, authenticated };
}

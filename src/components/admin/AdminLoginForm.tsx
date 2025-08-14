"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { supabase } from "@/lib/supabase";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 🔹 1. Proses login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // 🔹 2. Jika login gagal
      console.error("Login error:", error.message);
      setError("Email atau password salah!");
      setLoading(false);
      return;
    }

    // 🔹 3. Cek session untuk memastikan user authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setError("Login gagal: Session tidak terbentuk ❌");
      setLoading(false);
      return;
    }

    console.log("✅ Login sukses:", sessionData.session.user);

    // 🔹 4. Redirect ke dashboard admin
    window.location.href = "/admin/beranda";
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: 400,
        bgcolor: "rgba(255,255,255,0.9)",
        p: 4,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" textAlign="center" fontWeight="bold" color= "green" mb={2}>
        Admin Login
      </Typography>

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
      />

      {error && (
        <Typography color="error" textAlign="center" fontSize={14}>
          {error}
        </Typography>
      )}

      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
        {loading ? "Memproses..." : "Login"}
      </Button>
    </Box>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";

interface Wisata {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  location: string | null;
  contact: string | null;
  created_at: string;
  views?: number;
}

export default function WisataDetail() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [wisata, setWisata] = useState<Wisata | null>(null);
  const [wisataTerbaru, setWisataTerbaru] = useState<Wisata[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil detail wisata & wisata terbaru
  useEffect(() => {
    const fetchData = async () => {
      // 🔹 Ambil detail wisata
      const { data: detail, error } = await supabase
        .from("wisata")
        .select("*")
        .eq("id", id)
        .single();

      if (!detail || error) {
        console.error("Fetch error:", error?.message);
        setLoading(false);
        return;
      }

      setWisata(detail);

      // 🔹 Increment views
      const currentViews = detail.views || 0;
      await supabase.from("wisata").update({ views: currentViews + 1 }).eq("id", id);

      // 🔹 Ambil 5 wisata terbaru (selain yang sekarang)
      const { data: latest } = await supabase
        .from("wisata")
        .select("*")
        .neq("id", id)
        .order("created_at", { ascending: false })
        .limit(5);

      setWisataTerbaru(latest || []);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (!wisata)
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography>Wisata tidak ditemukan.</Typography>
      </Box>
    );

  return (
    <>
      <Navbar />

      {/* Tombol Kembali */}
      <IconButton
        onClick={() => router.push("/wisata")}
        sx={{
          position: "fixed",
          top: 80,
          left: 16,
          bgcolor: "rgba(255,255,255,0.8)",
          zIndex: 99,
          "&:hover": { bgcolor: "rgba(255,255,255,1)" },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Konten */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          px: { xs: 2, md: 6 },
          py: 6,
          maxWidth: 1400,
          mx: "auto",
        }}
      >
        {/* Kolom Kiri - Konten Wisata */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            {wisata.name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {new Date(wisata.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • 👁 {wisata.views ?? 0}x
            </Typography>
          </Box>

          {wisata.image_url && (
            <Box mb={3}>
              <img
                src={wisata.image_url}
                alt={wisata.name}
                style={{
                  width: "100%",
                  borderRadius: 8,
                  maxHeight: 500,
                  objectFit: "cover",
                }}
              />
            </Box>
          )}

          <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Typography
                variant="body1"
                color="text.primary"
                textAlign="justify"
                sx={{ lineHeight: 1.8 }}
              >
                {wisata.description}
              </Typography>

              {wisata.location && (
                <Typography variant="body2" color="text.secondary" mt={3}>
                  📍 Lokasi: {wisata.location}
                </Typography>
              )}
              {wisata.contact && (
                <Typography variant="body2" color="text.secondary">
                  📞 Kontak: {wisata.contact}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Kolom Kanan - Wisata Terbaru */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#f9f9f9",
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
            height: "fit-content",
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Wisata Terbaru
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {wisataTerbaru.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Tidak ada wisata terbaru
            </Typography>
          )}

          {wisataTerbaru.map((w) => (
            <Box
              key={w.id}
              sx={{
                display: "flex",
                gap: 2,
                mb: 2,
                cursor: "pointer",
                "&:hover": { opacity: 0.8 },
              }}
              onClick={() => router.push(`/wisata/${w.id}`)}
            >
              {w.image_url && (
                <img
                  src={w.image_url}
                  alt={w.name}
                  style={{
                    width: 80,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
              )}
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {w.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(w.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {" • 👁 "}
                  {w.views ?? 0}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Footer />
    </>
  );
}

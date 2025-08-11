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

interface Berita {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author?: string;
  views?: number;
}

export default function BeritaDetail() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [berita, setBerita] = useState<Berita | null>(null);
  const [beritaTerbaru, setBeritaTerbaru] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil detail berita dan list berita terbaru
  useEffect(() => {
    const fetchData = async () => {
      // Ambil detail berita
      const { data: detail, error } = await supabase
        .from("berita")
        .select("*")
        .eq("id", id)
        .single();

      if (!detail || error) {
        console.error("Fetch error:", error?.message);
        setLoading(false);
        return;
      }

      setBerita(detail);

      // Increment views
      const currentViews = detail.views || 0;
      await supabase.from("berita").update({ views: currentViews + 1 }).eq("id", id);

      // Ambil 5 berita terbaru (selain berita ini)
      const { data: latest } = await supabase
        .from("berita")
        .select("*")
        .neq("id", id)
        .order("created_at", { ascending: false })
        .limit(5);

      setBeritaTerbaru(latest || []);
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

  if (!berita)
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography>Berita tidak ditemukan.</Typography>
      </Box>
    );

  return (
    <>
      <Navbar />

      {/* Tombol Kembali */}
      <IconButton
        onClick={() => router.push("/berita")}
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
        {/* Kolom Kiri - Konten Berita */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            {berita.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {new Date(berita.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Ditulis oleh {berita.author || "Admin"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • 👁 {berita.views ?? 0}x
            </Typography>
          </Box>

          {berita.image_url && (
            <Box mb={3}>
              <img
                src={berita.image_url}
                alt={berita.title}
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
                {berita.content}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Kolom Kanan - Sidebar Berita Terbaru */}
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
            Berita Terbaru
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {beritaTerbaru.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Tidak ada berita terbaru
            </Typography>
          )}

          {beritaTerbaru.map((b) => (
            <Box
              key={b.id}
              sx={{
                display: "flex",
                gap: 2,
                mb: 2,
                cursor: "pointer",
                "&:hover": { opacity: 0.8 },
              }}
              onClick={() => router.push(`/berita/${b.id}`)}
            >
              {b.image_url && (
                <img
                  src={b.image_url}
                  alt={b.title}
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
                  {b.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(b.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {" • 👁 "}
                  {b.views ?? 0}
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

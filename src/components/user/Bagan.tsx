"use client";

import { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { supabase } from "@/lib/supabase";

export default function Bagan() {
  const [baganUrl, setBaganUrl] = useState<string | null>(null);
  const [sejarahUrl, setSejarahUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPdf = async () => {
      const { data, error } = await supabase
        .from("profil_nagari")
        .select("bagan_pdf, sejarah_pdf")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching PDF:", error.message);
      }

      setBaganUrl(data?.bagan_pdf || null);
      setSejarahUrl(data?.sejarah_pdf || null);
      setLoading(false);
    };
    fetchPdf();
  }, []);

  return (
    <Box my={6} textAlign="center">
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Bagan & Sejarah Nagari Sungai Nanam
      </Typography>
      <Typography mb={3}>
        Anda dapat mengunduh struktur pemerintahan dan sejarah lengkap nagari
        dalam format PDF berikut:
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          {baganUrl ? (
            <Button
              variant="contained"
              color="secondary"
              href={baganUrl}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<PictureAsPdfIcon />}
            >
              Download Bagan PDF
            </Button>
          ) : (
            <Typography color="error">Bagan belum tersedia</Typography>
          )}

          {sejarahUrl ? (
            <Button
              variant="contained"
              color="primary"
              href={sejarahUrl}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<PictureAsPdfIcon />}
            >
              Download Sejarah PDF
            </Button>
          ) : (
            <Typography color="error">Sejarah belum tersedia</Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

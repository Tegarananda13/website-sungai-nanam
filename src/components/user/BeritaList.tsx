"use client";

import { Box, Typography, Card, CardContent, Grid, Pagination, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Berita {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

export default function BeritaList() {
  const [page, setPage] = useState(1);
  const beritaPerPage = 6;
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch berita dari Supabase
  useEffect(() => {
    const fetchBerita = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("berita")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch Berita error:", error.message);
      } else {
        setBeritaList(data || []);
      }
      setLoading(false);
    };

    fetchBerita();
  }, []);

  // 🔹 Pagination
  const beritaToDisplay = beritaList.slice((page - 1) * beritaPerPage, page * beritaPerPage);

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 6 }}>
      {/* Judul & Deskripsi */}
      <Typography variant="h4" align="center" fontWeight="bold" color="green" mb={1}>
        Berita Nagari
      </Typography>
      <Typography variant="body1" align="center" mb={4}>
        Menyajikan informasi terbaru tentang peristiwa dan kegiatan di Sungai Nanam.
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Grid Berita */}
          <Grid
            container
            spacing={3}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
              },
            }}
          >
            {beritaToDisplay.map((berita) => (
              <Box key={berita.id}>
                <Link href={`/berita/${berita.id}`} style={{ textDecoration: "none" }}>
                  <Card
                    sx={{
                      bgcolor: "#fff",
                      color: "black",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    {/* Gambar Berita */}
                    {berita.image_url ? (
                      <img
                        src={berita.image_url}
                        alt={berita.title}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderTopLeftRadius: "4px",
                          borderTopRightRadius: "4px",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "200px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "#eee",
                          color: "#666",
                          fontStyle: "italic",
                          borderTopLeftRadius: "4px",
                          borderTopRightRadius: "4px",
                        }}
                      >
                        Tidak ada gambar
                      </Box>
                    )}

                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom noWrap>
                        {berita.title}
                      </Typography>
                      <Typography variant="body2" sx={{ display: "-webkit-box", overflow: "hidden", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                        {berita.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Box>
            ))}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={Math.ceil(beritaList.length / beritaPerPage)}
              page={page}
              onChange={(e, val) => {
                setPage(val);
                window.scrollTo({ top: 0, behavior: "smooth" }); // scroll ke atas
              }}
              color="primary"
              shape="rounded"
            />
          </Box>
        </>
      )}
    </Box>
  );
}

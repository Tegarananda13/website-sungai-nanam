"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useRouter } from "next/navigation";

interface Wisata {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  location?: string;
  contact?: string;
}

export default function WisataList() {
  const [wisataList, setWisataList] = useState<Wisata[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const wisataPerPage = 6;
  const router = useRouter();

  useEffect(() => {
    const fetchWisata = async () => {
      const { data, error } = await supabase
        .from("wisata")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error(error.message);
      else setWisataList(data || []);
      setLoading(false);
    };

    fetchWisata();
  }, []);

  const wisataToDisplay = wisataList.slice((page - 1) * wisataPerPage, page * wisataPerPage);

  if (loading)
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 6 }}>
      {/* Judul & Deskripsi */}
      <Typography variant="h4" align="center" fontWeight="bold" color="green" mb={1}>
        Wisata Nagari
      </Typography>
      <Typography variant="body1" align="center" mb={4}>
        Menyajikan informasi wisata yang terdapat di Sungai Nanam.
      </Typography>
      {/* Grid daftar wisata */}
      <Box
        sx={{
          display: "grid",
          gap: 4,
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
        }}
      >
        {wisataToDisplay.map((item) => (
          <Card
            key={item.id}
            sx={{ cursor: "pointer", "&:hover": { boxShadow: 5 } }}
            onClick={() => router.push(`/wisata/${item.id}`)}
          >
            {item.image_url && (
              <CardMedia
                component="img"
                image={item.image_url}
                alt={item.name}
                sx={{
                  height: 200,
                  objectFit: "cover",
                  width: "100%", // pastikan lebar juga penuh
                }}
              />
            )}
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {item.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Pagination
          count={Math.ceil(wisataList.length / wisataPerPage)}
          page={page}
          onChange={(e, val) => {
            setPage(val);
            window.scrollTo({ top: 0, behavior: "smooth" }); // scroll ke atas
          }}
          color="primary"
          shape="rounded"
        />
      </Box>
    </Box>
  );
}

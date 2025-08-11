"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Box,
  TextField,
  Button,
  Typography,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

interface Berita {
  id: string;
  title: string;
  content: string;
  author: string;
  image_url: string | null;
  created_at: string;
}

export default function AdminBeritaPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [beritaList, setBeritaList] = useState<Berita[]>([]);

  const fetchBerita = async () => {
    const { data, error } = await supabase
      .from("berita")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setBeritaList(data);
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("berita")
      .upload(fileName, file, { upsert: true });

    if (error || !data) throw new Error(error?.message || "Upload failed");

    const { data: urlData } = supabase.storage
      .from("berita")
      .getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProgress(30);

    try {
      let imageUrl = preview || "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        setProgress(60);
      }

      if (editingId) {
        const { error } = await supabase
          .from("berita")
          .update({
            title,
            content,
            author,
            image_url: imageUrl,
          })
          .eq("id", editingId);

        if (error) throw error;
        alert("✅ Berita berhasil diperbarui!");
      } else {
        const { error } = await supabase.from("berita").insert([
          {
            title,
            content,
            author: author || "Admin",
            image_url: imageUrl,
            views: 0,
          },
        ]);
        if (error) throw error;
        alert("✅ Berita berhasil disimpan!");
      }

      setProgress(100);
      resetForm();
      fetchBerita();
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menyimpan berita");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setAuthor("Admin");
    setImageFile(null);
    setPreview(null);
    setEditingId(null);
    setProgress(0);
  };

  const handleEdit = (berita: Berita) => {
    setEditingId(berita.id);
    setTitle(berita.title);
    setContent(berita.content);
    setAuthor(berita.author);
    setPreview(berita.image_url || null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;

    const { error } = await supabase.from("berita").delete().eq("id", id);
    if (error) {
      alert("❌ Gagal menghapus berita");
      return;
    }

    alert("✅ Berita berhasil dihapus!");
    fetchBerita();
  };

  return (
    <Box sx={{ display: "flex", gap: 6, px: 3, py: 4 }}>
      {/* Form kiri */}
      <Box component="form" onSubmit={handleSave} sx={{ flex: 1 }}>
        <Typography variant="h4" fontWeight="bold" color="green" mb={2}>
          {editingId ? "Edit Berita" : "Kelola Berita"}
        </Typography>

        <TextField
          label="Judul Berita"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Penulis"
          fullWidth
          margin="normal"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <TextField
          label="Isi Berita"
          fullWidth
          multiline
          rows={6}
          margin="normal"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {preview && (
          <Box my={2} position="relative">
            <img
              src={preview}
              alt="Preview"
              style={{ width: "100%", borderRadius: 8 }}
            />
            <Button
              variant="contained"
              color="error"
              size="small"
              sx={{ position: "absolute", top: 8, right: 8 }}
              onClick={() => {
                setPreview(null);
                setImageFile(null);
              }}
            >
              Hapus Gambar
            </Button>
          </Box>
        )}

        <Stack spacing={2} mt={2}>
          <Button variant="outlined" component="label">
            Pilih Gambar
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />
          </Button>

          {loading && (
            <LinearProgress variant="determinate" value={progress} />
          )}

          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: editingId ? "#2196F3" : "#4CAF50",
              "&:hover": {
                bgcolor: editingId ? "#1976D2" : "#45A049",
              },
            }}
            disabled={loading}
          >
            {loading
              ? "Menyimpan..."
              : editingId
              ? "Update Berita"
              : "Simpan Berita"}
          </Button>

          {editingId && (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ArrowBackIcon />}
              onClick={resetForm}
            >
              Batal Edit
            </Button>
          )}
        </Stack>
      </Box>

      {/* Daftar berita (tabel kanan) */}
      <Box sx={{ flex: 2 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Daftar Berita
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Gambar</TableCell>
                <TableCell>Judul</TableCell>
                <TableCell>Penulis</TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {beritaList.map((berita) => (
                <TableRow key={berita.id}>
                  <TableCell>
                    {berita.image_url ? (
                      <img
                        src={berita.image_url}
                        alt={berita.title}
                        style={{
                          width: 60,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{berita.title}</TableCell>
                  <TableCell>{berita.author}</TableCell>
                  <TableCell>
                    {new Date(berita.created_at).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(berita)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(berita.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

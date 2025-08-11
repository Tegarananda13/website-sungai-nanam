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
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Wisata {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  location?: string;
  contact?: string;
}

export default function AdminWisataPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [wisataList, setWisataList] = useState<Wisata[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchWisata = async () => {
    const { data } = await supabase
      .from("wisata")
      .select("*")
      .order("created_at", { ascending: false });
    setWisataList(data || []);
  };

  useEffect(() => {
    fetchWisata();
  }, []);

  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("wisata") // bucket name sesuai yang kamu punya
      .upload(fileName, file, { upsert: true });
    if (error || !data) throw new Error(error?.message || "Upload gagal");

    const { data: urlData } = supabase.storage
      .from("wisata")
      .getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setLocation("");
    setContact("");
    setImageFile(null);
    setPreview(null);
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProgress(30);

    try {
      let imageUrl = "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        setProgress(60);
      }

      if (editingId) {
        // UPDATE
        const { error } = await supabase
          .from("wisata")
          .update({
            name,
            description,
            location,
            contact,
            ...(imageUrl && { image_url: imageUrl }),
          })
          .eq("id", editingId);

        if (error) throw error;
        alert("Wisata berhasil diperbarui ✅");
      } else {
        // INSERT
        const { error } = await supabase.from("wisata").insert([
          {
            name,
            description,
            location,
            contact,
            image_url: imageUrl,
          },
        ]);

        if (error) throw error;
        alert("Wisata berhasil ditambahkan ✅");
      }

      setProgress(100);
      fetchWisata();
      resetForm();
      setProgress(0);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan wisata ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus wisata ini?")) return;
    const { error } = await supabase.from("wisata").delete().eq("id", id);
    if (!error) fetchWisata();
  };

  const handleEdit = (wisata: Wisata) => {
    setEditingId(wisata.id);
    setName(wisata.name);
    setDescription(wisata.description);
    setLocation(wisata.location || "");
    setContact(wisata.contact || "");
    setPreview(wisata.image_url || null);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ display: "flex", gap: 6, px: 3, py: 4 }}>
      {/* Form kiri */}
      <Box component="form" onSubmit={handleSave} sx={{ flex: 1 }}>
        <Typography variant="h4" mb={2} fontWeight="bold" color="green">
          {editingId ? "Edit Wisata" : "Kelola Wisata"}
        </Typography>

        <TextField
          label="Nama Wisata"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Deskripsi"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <TextField
          label="Lokasi"
          fullWidth
          margin="normal"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <TextField
          label="Kontak"
          fullWidth
          margin="normal"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
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
              ? "Update Wisata"
              : "Simpan Wisata"}
          </Button>

          {editingId && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={resetForm}
              startIcon={<span>✖</span>}
            >
              Batal Edit
            </Button>
          )}
        </Stack>
      </Box>

      {/* Tabel kanan */}
      <Box sx={{ flex: 2 }}>
        <Typography variant="h5" mb={2}>
          Daftar Wisata
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Gambar</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Lokasi</TableCell>
              <TableCell>Kontak</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wisataList.map((w) => (
              <TableRow key={w.id}>
                <TableCell>
                  {w.image_url ? (
                    <img
                      src={w.image_url}
                      alt={w.name}
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
                <TableCell>{w.name}</TableCell>
                <TableCell>{w.location || "-"}</TableCell>
                <TableCell>{w.contact || "-"}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(w)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(w.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

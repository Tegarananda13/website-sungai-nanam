"use client";

import { useEffect, useState } from "react";
import { 
  Box, TextField, Button, Typography, LinearProgress, Stack, IconButton 
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import { supabase } from "@/lib/supabase";

interface AdminBerandaFormProps {
  onSaved?: () => void;
}

export default function AdminBerandaForm({ onSaved }: AdminBerandaFormProps) {
  const [welcomeText, setWelcomeText] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [waliName, setWaliName] = useState("");
  const [waliDesc, setWaliDesc] = useState("");

  const [bgImage, setBgImage] = useState<File | null>(null);
  const [waliPhoto, setWaliPhoto] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [oldBgImageUrl, setOldBgImageUrl] = useState<string | null>(null);
  const [oldWaliPhotoUrl, setOldWaliPhotoUrl] = useState<string | null>(null);

  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [waliPreview, setWaliPreview] = useState<string | null>(null);

  const [currentId, setCurrentId] = useState<string | null>(null);

  // Fetch data awal
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("beranda")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Supabase fetch error:", error.message);
        return;
      }

      if (data && data.length > 0) {
        const row = data[0];
        setCurrentId(row.id);
        setWelcomeText(row.hero_title || "");
        setSubtitle(row.hero_subtitle || "");
        setShortDesc(row.description || "");
        setWaliName(row.wali_name || "");
        setWaliDesc(row.wali_description || "");
        setOldBgImageUrl(row.hero_image || null);
        setOldWaliPhotoUrl(row.wali_photo || null);
      }
    };

    fetchData();
  }, []);

  // Upload file ke bucket Supabase
  const uploadFileToBucket = async (file: File, folder: string): Promise<string> => {
    const fileName = `${folder}-${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("beranda").upload(fileName, file, {
      upsert: true,
    });

    if (error || !data) throw new Error(error?.message || "Upload failed");

    // Ambil public URL
    const { data: urlData } = supabase.storage.from("beranda").getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProgress(30);

    try {
      let bgImageUrl = oldBgImageUrl || "";
      let waliPhotoUrl = oldWaliPhotoUrl || "";

      if (bgImage) {
        bgImageUrl = await uploadFileToBucket(bgImage, "heroImage");
        setProgress(60);
      } else if (!bgImage && !bgPreview && !oldBgImageUrl) {
        // Jika gambar dihapus semua (hapus preview & old URL), kosongkan di DB
        bgImageUrl = "";
      }

      if (waliPhoto) {
        waliPhotoUrl = await uploadFileToBucket(waliPhoto, "waliPhoto");
        setProgress(90);
      } else if (!waliPhoto && !waliPreview && !oldWaliPhotoUrl) {
        waliPhotoUrl = "";
      }

      const payload = {
        hero_title: welcomeText,
        hero_subtitle: subtitle,
        description: shortDesc,
        wali_name: waliName,
        wali_description: waliDesc,
        hero_image: bgImageUrl || null,
        wali_photo: waliPhotoUrl || null,
        updated_at: new Date().toISOString(),
      };

      let saveError = null;
      if (currentId) {
        const { error } = await supabase.from("beranda").update(payload).eq("id", currentId);
        saveError = error;
      } else {
        const { data, error } = await supabase.from("beranda").insert(payload).select().single();
        saveError = error;
        if (data) setCurrentId(data.id);
      }

      if (saveError) throw new Error(saveError.message);

      setProgress(100);
      alert("Data Beranda berhasil disimpan ✅");

      // Reset local file & preview hanya jika berhasil simpan
      setBgImage(null);
      setWaliPhoto(null);
      setBgPreview(null);
      setWaliPreview(null);
      setOldBgImageUrl(payload.hero_image);
      setOldWaliPhotoUrl(payload.wali_photo);
      setProgress(0);

      if (onSaved) onSaved();
    } catch (err) {
      console.error("Save error:", err);
      alert("Gagal menyimpan data ❌");
    } finally {
      setLoading(false);
    }
  };

  // Hapus gambar Background lokal & lama
  const handleRemoveBgImage = () => {
    setBgImage(null);
    setBgPreview(null);
    setOldBgImageUrl(null);
  };

  // Hapus gambar Wali lokal & lama
  const handleRemoveWaliPhoto = () => {
    setWaliPhoto(null);
    setWaliPreview(null);
    setOldWaliPhotoUrl(null);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600 }}
    >
      {/* Background Image */}
      <Typography variant="h6" fontWeight="bold">Background Image</Typography>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
        {(bgPreview || oldBgImageUrl) && (
          <img
            src={bgPreview || oldBgImageUrl!}
            alt="Preview Background"
            style={{ width: "100%", borderRadius: 8, maxHeight: 200, objectFit: "cover" }}
          />
        )}
        {(bgPreview || oldBgImageUrl) && (
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={handleRemoveBgImage}
          >
            Hapus Gambar
          </Button>
        )}
      </Stack>

      <input
        type="file"
        accept="image/*"
        id="bgImageInput"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setBgImage(file);
          if (file) setBgPreview(URL.createObjectURL(file));
        }}
      />
      <label htmlFor="bgImageInput">
        <Button 
          variant="outlined" 
          color="primary" 
          component="span" 
          startIcon={<UploadIcon />}
        >
          Pilih Gambar Background
        </Button>
      </label>

      {/* Teks */}
      <Typography variant="h6" fontWeight="bold">Teks Selamat Datang</Typography>
      <TextField fullWidth value={welcomeText} onChange={(e) => setWelcomeText(e.target.value)} />

      <Typography variant="h6" fontWeight="bold">Subjudul (Opsional)</Typography>
      <TextField fullWidth value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />

      <Typography variant="h6" fontWeight="bold">Deskripsi Singkat Nagari</Typography>
      <TextField fullWidth multiline rows={3} value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} />

      {/* Wali Nagari */}
      <Typography variant="h6" fontWeight="bold">Profil Wali Nagari</Typography>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
        {(waliPreview || oldWaliPhotoUrl) && (
          <img
            src={waliPreview || oldWaliPhotoUrl!}
            alt="Preview Wali"
            style={{ width: 120, borderRadius: "50%", objectFit: "cover" }}
          />
        )}
        {(waliPreview || oldWaliPhotoUrl) && (
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={handleRemoveWaliPhoto}
          >
            Hapus Foto
          </Button>
        )}
      </Stack>

      <TextField
        fullWidth
        label="Nama Wali Nagari"
        value={waliName}
        onChange={(e) => setWaliName(e.target.value)}
      />
      <TextField
        fullWidth
        label="Deskripsi Singkat Wali Nagari"
        multiline
        rows={3}
        value={waliDesc}
        onChange={(e) => setWaliDesc(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        id="waliPhotoInput"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setWaliPhoto(file);
          if (file) setWaliPreview(URL.createObjectURL(file));
        }}
      />
      <label htmlFor="waliPhotoInput">
        <Button 
          variant="outlined" 
          color="secondary" 
          component="span" 
          startIcon={<UploadIcon />}
        >
          Pilih Foto Wali Nagari
        </Button>
      </label>

      {loading && <LinearProgress variant="determinate" value={progress} />}
      <Button type="submit" variant="contained" sx={{ bgcolor: "green" }} disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </Box>
  );
}

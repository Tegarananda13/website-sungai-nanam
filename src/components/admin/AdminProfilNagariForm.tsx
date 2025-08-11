"use client";

import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  Stack,
} from "@mui/material";
import { supabase } from "@/lib/supabase";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function AdminProfilNagariForm() {
  const [sejarah, setSejarah] = useState("");
  const [sejarahImage, setSejarahImage] = useState<File | null>(null);
  const [sejarahPreview, setSejarahPreview] = useState<string | null>(null);
  const [oldSejarahImageUrl, setOldSejarahImageUrl] = useState<string | null>(null);

  // Sejarah PDF
  const [sejarahPdf, setSejarahPdf] = useState<File | null>(null);
  const [sejarahPdfPreview, setSejarahPdfPreview] = useState<string | null>(null);
  const [oldSejarahPdfUrl, setOldSejarahPdfUrl] = useState<string | null>(null);

  // Visi & Misi
  const [visiList, setVisiList] = useState<string[]>([]);
  const [misiList, setMisiList] = useState<string[]>([]);

  // Bagan PDF
  const [baganPdf, setBaganPdf] = useState<File | null>(null);
  const [baganPreview, setBaganPreview] = useState<string | null>(null);
  const [oldBaganUrl, setOldBaganUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("profil_nagari")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Fetch error:", error.message);
        return;
      }

      if (data && data.length > 0) {
        const row = data[0];
        setCurrentId(row.id);
        setSejarah(row.sejarah || "");
        setVisiList(row.visi || []);
        setMisiList(row.misi || []);
        setOldSejarahImageUrl(row.sejarah_image || null);
        setOldSejarahPdfUrl(row.sejarah_pdf || null);
        setOldBaganUrl(row.bagan_pdf || null);
      }
    };

    fetchData();
  }, []);

  const uploadFileToBucket = async (file: File, folder: string): Promise<string> => {
    const fileName = `${folder}-${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("profil-nagari")
      .upload(fileName, file, { upsert: true });

    if (error || !data) throw new Error(error?.message || "Upload failed");

    const { data: urlData } = supabase.storage.from("profil-nagari").getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProgress(20);

    try {
      let sejarahImageUrl = oldSejarahImageUrl || "";
      let sejarahPdfUrl = oldSejarahPdfUrl || "";
      let baganPdfUrl = oldBaganUrl || "";

      if (sejarahImage) {
        sejarahImageUrl = await uploadFileToBucket(sejarahImage, "sejarahImage");
        setProgress(40);
      }
      if (sejarahPdf) {
        sejarahPdfUrl = await uploadFileToBucket(sejarahPdf, "sejarahPDF");
        setProgress(55);
      }
      if (baganPdf) {
        baganPdfUrl = await uploadFileToBucket(baganPdf, "baganPDF");
        setProgress(70);
      }

      const payload = {
        sejarah,
        sejarah_image: sejarahImageUrl || null,
        sejarah_pdf: sejarahPdfUrl || null,
        visi: visiList,
        misi: misiList,
        bagan_pdf: baganPdfUrl || null,
        updated_at: new Date().toISOString(),
      };

      let saveError = null;
      if (currentId) {
        const { error } = await supabase.from("profil_nagari").update(payload).eq("id", currentId);
        saveError = error;
      } else {
        const { data, error } = await supabase.from("profil_nagari").insert(payload).select().single();
        saveError = error;
        if (data) setCurrentId(data.id);
      }

      if (saveError) throw new Error(saveError.message);

      setProgress(100);
      alert("Profil Nagari berhasil disimpan ✅");

      // Reset upload fields (preview dan file)
      setSejarahImage(null);
      setSejarahPreview(null);
      setSejarahPdf(null);
      setSejarahPdfPreview(null);
      setBaganPdf(null);
      setBaganPreview(null);
      setProgress(0);
    } catch (err) {
      console.error("Save error:", err);
      alert("Gagal menyimpan data ❌");
    } finally {
      setLoading(false);
    }
  };

  // Visi & Misi handlers
  const addVisi = () => setVisiList([...visiList, ""]);
  const updateVisi = (index: number, value: string) => {
    const newList = [...visiList];
    newList[index] = value;
    setVisiList(newList);
  };
  const removeVisi = (index: number) => setVisiList(visiList.filter((_, i) => i !== index));

  const addMisi = () => setMisiList([...misiList, ""]);
  const updateMisi = (index: number, value: string) => {
    const newList = [...misiList];
    newList[index] = value;
    setMisiList(newList);
  };
  const removeMisi = (index: number) => setMisiList(misiList.filter((_, i) => i !== index));

  // Hapus PDF handlers
  const handleRemoveSejarahPdf = () => {
    setSejarahPdf(null);
    setSejarahPdfPreview(null);
    setOldSejarahPdfUrl(null);
  };

  const handleRemoveBaganPdf = () => {
    setBaganPdf(null);
    setBaganPreview(null);
    setOldBaganUrl(null);
  };

  // Hapus Gambar Sejarah
  const handleRemoveSejarahImage = () => {
    setSejarahImage(null);
    setSejarahPreview(null);
    setOldSejarahImageUrl(null);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 700 }}
    >
      <Typography variant="h4" fontWeight="bold" color="green">
        Kelola Profil Nagari
      </Typography>

      {/* Sejarah */}
      <Typography variant="h6" fontWeight="bold">
        Sejarah Nagari
      </Typography>
      <TextField fullWidth multiline rows={5} value={sejarah} onChange={(e) => setSejarah(e.target.value)} />

      {/* Upload Gambar Sejarah */}
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
        Gambar Sejarah
      </Typography>
      {(sejarahPreview || oldSejarahImageUrl) && (
        <Box sx={{ position: "relative", display: "inline-block", borderRadius: 2, overflow: "hidden" }}>
          <img
            src={sejarahPreview || oldSejarahImageUrl!}
            alt="Preview Sejarah"
            style={{ display: "block", maxWidth: "100%", height: "auto" }}
          />
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleRemoveSejarahImage}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              minWidth: 100,
              padding: "4px 8px",
              fontWeight: "bold",
              zIndex: 10,
              opacity: 0.8,
              "&:hover": { opacity: 1 },
            }}
          >
            Hapus Gambar
          </Button>
        </Box>
      )}
      <Button variant="outlined" component="label" sx={{ mt: 1 }}>
        Pilih Gambar
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setSejarahImage(file);
            if (file) setSejarahPreview(URL.createObjectURL(file));
          }}
        />
      </Button>



      {/* Visi */}
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>
        Daftar Visi
      </Typography>
      <List>
        {visiList.map((item, index) => (
          <ListItem key={index} sx={{ gap: 2 }}>
            <TextField fullWidth value={item} onChange={(e) => updateVisi(index, e.target.value)} />
            <IconButton color="error" onClick={() => removeVisi(index)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={addVisi}>
        Tambah Visi
      </Button>

      {/* Misi */}
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>
        Daftar Misi
      </Typography>
      <List>
        {misiList.map((item, index) => (
          <ListItem key={index} sx={{ gap: 2 }}>
            <TextField fullWidth value={item} onChange={(e) => updateMisi(index, e.target.value)} />
            <IconButton color="error" onClick={() => removeMisi(index)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={addMisi}>
        Tambah Misi
      </Button>

      {/* Upload Bagan PDF */}
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>
        Bagan PDF
      </Typography>
      <Stack direction="row" alignItems="center" spacing={2}>
        {(baganPreview || oldBaganUrl) && (
          <>
            <Typography noWrap sx={{ maxWidth: 250 }}>
              {baganPdf?.name || baganPreview || "File PDF tersedia"}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              component="a"
              href={oldBaganUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
            >
              Lihat Bagan Lama
            </Button>
            <Button variant="contained" color="error" size="small" onClick={handleRemoveBaganPdf}>
              Hapus PDF
            </Button>
          </>
        )}
      </Stack>
      <Button variant="outlined" component="label" sx={{ mt: 1 }}>
        Pilih PDF
        <input
          type="file"
          hidden
          accept="application/pdf"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setBaganPdf(file);
            if (file) setBaganPreview(file.name);
          }}
        />
      </Button>

      {/* Upload Sejarah PDF */}
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>
        Sejarah PDF
      </Typography>
      <Stack direction="row" alignItems="center" spacing={2}>
        {(sejarahPdfPreview || oldSejarahPdfUrl) && (
          <>
            <Typography noWrap sx={{ maxWidth: 250 }}>
              {sejarahPdf?.name || sejarahPdfPreview || "File PDF tersedia"}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              component="a"
              href={oldSejarahPdfUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
            >
              Lihat Sejarah Lama
            </Button>
            <Button variant="contained" color="error" size="small" onClick={handleRemoveSejarahPdf}>
              Hapus PDF
            </Button>
          </>
        )}
      </Stack>
      <Button variant="outlined" component="label" sx={{ mt: 1 }}>
        Pilih PDF
        <input
          type="file"
          hidden
          accept="application/pdf"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setSejarahPdf(file);
            if (file) setSejarahPdfPreview(file.name);
          }}
        />
      </Button>

      {loading && <LinearProgress variant="determinate" value={progress} />}
      <Button type="submit" variant="contained" sx={{ bgcolor: "green" }} disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </Box>
  );
}

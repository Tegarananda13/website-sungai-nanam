import Navbar from "@/components/user/Navbar"
import Footer from "@/components/user/Footer"
import BeritaList from "@/components/user/BeritaList"

export default function Berita() {
  return (
    <>
      <main>
        <Navbar />
        <BeritaList />
        <Footer />
      </main>
    </>
  )
}
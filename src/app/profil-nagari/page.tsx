import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'
import Visi from '@/components/user/Visi'
import Misi from '@/components/user/Misi'
import SejarahSection from '@/components/user/SejarahSection'
import Bagan from '@/components/user/Bagan'

export default function Profil() {
  return (
    <>
      <main>
        <Navbar />
        <SejarahSection />
        <Visi />
        <Misi />
        <Bagan />
        <Footer />
      </main>
    </>
  )
}
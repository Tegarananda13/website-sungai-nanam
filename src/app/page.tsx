import Link from 'next/link'
import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'
import Hero from '@/components/user/Hero'
import KpiSection from '@/components/user/KpiSection'
import MapSection from '@/components/user/MapSection'
import ShortcutAndProfile from '@/components/user/ShortcutAndProfile'
import WaliNagari from '@/components/user/WaliNagari'

export default function UserHomePage() {
  return (
    <>
      <main>
        <Navbar />
        <Hero />
        <ShortcutAndProfile />
        <WaliNagari />
        <KpiSection />
        <MapSection />
        <Footer />
      </main>
    </>
  )
}

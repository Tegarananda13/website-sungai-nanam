import "./globals.css"
import ThemeRegistry from "@/components/ThemeRegistry"

export const metadata = {
  title: "Nagari Sungai Nanam",
  description: "Website Profil Nagari Sungai Nanam",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}

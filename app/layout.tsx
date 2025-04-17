import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Julia Villagómez - Sitio Oficial",
  description: "Sitio web oficial de campaña",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Script id="gallery-init">
          {`
            // Inicializar el almacenamiento de galerías si es necesario
            if (typeof window !== 'undefined') {
              window.addEventListener('load', function() {
                console.log('Inicializando almacenamiento de galerías...');
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}


import './globals.css'
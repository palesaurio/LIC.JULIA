"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import { GalleryManager } from "@/components/gallery-manager"
import { getGalleryItems, saveGalleryItems, initializeGalleryStore } from "@/lib/gallery-store"

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Inicializar el almacenamiento de galerías
  useEffect(() => {
    initializeGalleryStore()
    setIsLoading(false)
  }, [])

  // Check if user is authenticated (in a real app, this would verify a token)
  useEffect(() => {
    // This is a simplified check - in a real app, you'd verify a token
    const checkAuth = () => {
      // For demo purposes, we're just setting it to true
      // In a real app, you'd verify the user's session
      setIsAuthenticated(true)
    }

    checkAuth()
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // We're not redirecting in this demo to allow viewing the dashboard
      // In a real app, you would uncomment this:
      // router.push('/admin')
    }
  }, [isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-pink mx-auto"></div>
          <p className="mt-4 text-brand-pink">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-brand-pink text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <Button
            variant="outline"
            className="text-white border-white hover:bg-brand-pink-dark"
            onClick={() => router.push("/")}
          >
            Volver al sitio
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8">
        <Tabs defaultValue="hero">
          <TabsList className="mb-8 bg-pink-100 p-1 flex flex-wrap">
            <TabsTrigger value="hero" className="data-[state=active]:bg-brand-pink data-[state=active]:text-white">
              Galería Principal
            </TabsTrigger>
            <TabsTrigger value="eventos" className="data-[state=active]:bg-brand-pink data-[state=active]:text-white">
              Eventos Comunitarios
            </TabsTrigger>
            <TabsTrigger
              value="actividades"
              className="data-[state=active]:bg-brand-pink data-[state=active]:text-white"
            >
              Actividades Políticas
            </TabsTrigger>
            <TabsTrigger
              value="propuestas-accion"
              className="data-[state=active]:bg-brand-pink data-[state=active]:text-white"
            >
              Propuestas en Acción
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-brand-pink data-[state=active]:text-white">
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <GalleryManager
              galleryId="hero"
              galleryTitle="Galería Principal"
              initialItems={getGalleryItems("hero")}
              onUpdateGallery={(items) => saveGalleryItems("hero", items)}
            />
          </TabsContent>

          <TabsContent value="eventos">
            <GalleryManager
              galleryId="eventos"
              galleryTitle="Eventos Comunitarios"
              initialItems={getGalleryItems("eventos")}
              onUpdateGallery={(items) => saveGalleryItems("eventos", items)}
            />
          </TabsContent>

          <TabsContent value="actividades">
            <GalleryManager
              galleryId="actividades"
              galleryTitle="Actividades Políticas"
              initialItems={getGalleryItems("actividades")}
              onUpdateGallery={(items) => saveGalleryItems("actividades", items)}
            />
          </TabsContent>

          <TabsContent value="propuestas-accion">
            <GalleryManager
              galleryId="propuestas-accion"
              galleryTitle="Propuestas en Acción"
              initialItems={getGalleryItems("propuestas-accion")}
              onUpdateGallery={(items) => saveGalleryItems("propuestas-accion", items)}
            />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader className="bg-pink-50">
                <CardTitle className="text-brand-pink">Configuración del sitio</CardTitle>
                <CardDescription>Administra la configuración general del sitio web</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-title">Título del sitio</Label>
                    <Input id="site-title" defaultValue="Julia Villagómez" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-description">Descripción</Label>
                    <Textarea id="site-description" defaultValue="Sitio web oficial de campaña" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email de contacto</Label>
                    <Input id="contact-email" defaultValue="lic.juliavillagomez31@gmail.com" />
                  </div>
                  <Button className="bg-brand-pink hover:bg-brand-pink-dark">
                    <Save size={16} className="mr-2" />
                    Guardar cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

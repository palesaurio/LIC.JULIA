"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getGalleryItems, listenToGalleryChanges, type GalleryItem, type GalleryType } from "@/lib/gallery-store"

interface GallerySectionProps {
  title: string
  id: string
  description: string
}

export function GallerySection({ title, id, description }: GallerySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Cargar las imágenes de la galería
  useEffect(() => {
    // Cargar las imágenes iniciales
    const items = getGalleryItems(id as GalleryType)
    setGalleryItems(items)
    setIsLoading(false)

    // Escuchar cambios en la galería
    const unsubscribe = listenToGalleryChanges((type, items) => {
      if (type === id) {
        // Ordenar por el campo featured primero, luego por order
        const sortedItems = [...items].sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return (a.order || 0) - (b.order || 0)
        })
        setGalleryItems(sortedItems)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [id])

  // Auto-rotate gallery items
  useEffect(() => {
    const interval = setInterval(() => {
      if (galleryItems.length > 1) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryItems.length)
      }
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [galleryItems.length])

  const nextSlide = () => {
    if (galleryItems.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryItems.length)
    }
  }

  const prevSlide = () => {
    if (galleryItems.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + galleryItems.length) % galleryItems.length)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-pink-200">
        <div className="p-4 bg-brand-pink text-white">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </div>
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-pink"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-pink-200">
      <div className="p-4 bg-brand-pink text-white">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 relative h-[300px] md:h-[400px]">
          {galleryItems.length > 0 ? (
            <>
              <Image
                src={galleryItems[currentIndex].imageUrl || "/placeholder.svg"}
                alt={galleryItems[currentIndex].title}
                fill
                className="object-cover"
              />
              {galleryItems.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white" onClick={prevSlide}>
                    <ChevronLeft className="h-6 w-6" />
                    <span className="sr-only">Anterior</span>
                  </Button>
                  <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white" onClick={nextSlide}>
                    <ChevronRight className="h-6 w-6" />
                    <span className="sr-only">Siguiente</span>
                  </Button>
                </div>
              )}
              {galleryItems[currentIndex].featured && (
                <div className="absolute top-2 right-2 bg-brand-pink text-white px-2 py-1 rounded-md text-xs font-medium">
                  Destacada
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <p className="text-gray-500">No hay imágenes disponibles</p>
            </div>
          )}
        </div>

        <div className="md:w-1/2 p-6">
          {galleryItems.length > 0 ? (
            <>
              <h3 className="text-2xl font-bold text-brand-pink mb-2">{galleryItems[currentIndex].title}</h3>
              <p className="text-gray-700 mb-4">{galleryItems[currentIndex].description}</p>

              <div className="flex justify-center mt-6 gap-2">
                {galleryItems.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-brand-pink" : "bg-gray-300"}`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500">No hay información disponible</p>
          )}
        </div>
      </div>
    </div>
  )
}

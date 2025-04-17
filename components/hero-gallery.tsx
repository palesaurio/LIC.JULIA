"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getGalleryItems, listenToGalleryChanges, type GalleryItem } from "@/lib/gallery-store"

export function HeroGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Cargar las imágenes de la galería principal
  useEffect(() => {
    // Cargar las imágenes iniciales
    const items = getGalleryItems("hero")
    setGalleryItems(items)
    setIsLoading(false)

    // Escuchar cambios en la galería
    const unsubscribe = listenToGalleryChanges((type, items) => {
      if (type === "hero") {
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
  }, [])

  // Auto-rotate gallery items every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (galleryItems.length > 1) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryItems.length)
      }
    }, 3000) // Change image every 3 seconds

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
      <div className="relative rounded-lg shadow-lg overflow-hidden bg-gray-100">
        <div className="aspect-[4/3] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-pink"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-lg shadow-lg overflow-hidden">
      <div className="aspect-[4/3] relative">
        {galleryItems.length > 0 ? (
          <>
            <Image
              src={galleryItems[currentIndex].imageUrl || "/placeholder.svg"}
              alt={galleryItems[currentIndex].alt || galleryItems[currentIndex].title}
              fill
              className="object-cover transition-opacity duration-500"
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
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {galleryItems.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex ? "bg-brand-pink" : "bg-white/70"
                  } transition-colors`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <p className="text-gray-500">No hay imágenes disponibles</p>
          </div>
        )}
      </div>
    </div>
  )
}

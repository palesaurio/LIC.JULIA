"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample gallery data - this would come from your database in a real app
const SAMPLE_GALLERY = [
  {
    id: 1,
    imageUrl: "/placeholder.svg?height=400&width=600",
    title: "Visita a la comunidad",
    description: "Reunión con líderes comunitarios para discutir necesidades locales.",
    link: "#comunidad",
  },
  {
    id: 2,
    imageUrl: "/placeholder.svg?height=400&width=600",
    title: "Foro educativo",
    description: "Participación en foro sobre el futuro de la educación en nuestra región.",
    link: "#educacion",
  },
  {
    id: 3,
    imageUrl: "/placeholder.svg?height=400&width=600",
    title: "Proyecto de salud",
    description: "Inauguración de nueva clínica comunitaria para mejorar servicios de salud.",
    link: "#salud",
  },
]

export function DynamicGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [galleryItems, setGalleryItems] = useState(SAMPLE_GALLERY)

  // Auto-rotate gallery items
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryItems.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [galleryItems.length])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryItems.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + galleryItems.length) % galleryItems.length)
  }

  return (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 relative h-[300px] md:h-[500px]">
          <Image
            src={galleryItems[currentIndex].imageUrl || "/placeholder.svg"}
            alt={galleryItems[currentIndex].title}
            fill
            className="object-cover"
          />
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
        </div>
        <div className="md:w-1/2 p-6">
          <h3 className="text-2xl font-bold text-pink-600 mb-2">{galleryItems[currentIndex].title}</h3>
          <p className="text-gray-700 mb-4">{galleryItems[currentIndex].description}</p>
          <Link href={galleryItems[currentIndex].link}>
            <Button className="bg-pink-600 hover:bg-pink-700 text-white">Más información</Button>
          </Link>
          <div className="flex justify-center mt-6 gap-2">
            {galleryItems.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-pink-600" : "bg-pink-200"}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

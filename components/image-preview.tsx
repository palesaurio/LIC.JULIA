"use client"

import { useState } from "react"

interface ImagePreviewProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export function ImagePreview({ src, alt, className = "", width = 400, height = 300 }: ImagePreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-pink"></div>
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-red-500">
          <p>Error al cargar la imagen</p>
        </div>
      ) : (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className={`w-full h-full object-cover ${isLoading ? "opacity-0" : "opacity-100"}`}
          style={{ transition: "opacity 0.3s ease" }}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  )
}

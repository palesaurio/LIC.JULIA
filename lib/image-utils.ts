/**
 * Utilidades para el manejo de imágenes
 */

/**
 * Convierte un archivo a una URL de datos (base64)
 */
export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Comprueba si una URL es válida
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Comprueba si una imagen existe y es accesible
 */
export async function imageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

/**
 * Optimiza el tamaño de una imagen
 */
export async function optimizeImage(file: File, maxWidth = 1200): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("No se pudo crear el contexto del canvas"))
        return
      }

      // Calcular las nuevas dimensiones manteniendo la proporción
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      // Dibujar la imagen en el canvas
      ctx.drawImage(img, 0, 0, width, height)

      // Convertir el canvas a blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("No se pudo convertir la imagen"))
          }
        },
        "image/jpeg",
        0.85, // Calidad de compresión
      )
    }

    img.onerror = () => reject(new Error("Error al cargar la imagen"))
    img.src = URL.createObjectURL(file)
  })
}

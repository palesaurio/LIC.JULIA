/**
 * Sistema de almacenamiento para las galerías
 * Este archivo simula una base de datos usando localStorage
 */

export interface GalleryItem {
  id: number
  imageUrl: string
  title: string
  description: string
  alt?: string
  order?: number // Nuevo campo para controlar el orden
  featured?: boolean // Nuevo campo para marcar como destacada
}

// Tipos de galerías disponibles
export type GalleryType = "hero" | "eventos" | "actividades" | "propuestas-accion"

// Datos iniciales para las galerías
const INITIAL_GALLERIES: Record<GalleryType, GalleryItem[]> = {
  hero: [
    {
      id: 1,
      imageUrl: "/placeholder.svg?height=600&width=800",
      title: "Julia Villagómez en campaña",
      description: "Trabajando por un mejor futuro para nuestra comunidad",
      alt: "Julia Villagómez en campaña",
      order: 0,
    },
    {
      id: 2,
      imageUrl: "/placeholder.svg?height=600&width=800",
      title: "Reunión con la comunidad",
      description: "Escuchando las necesidades de los ciudadanos",
      alt: "Reunión con la comunidad",
      order: 1,
    },
    {
      id: 3,
      imageUrl: "/placeholder.svg?height=600&width=800",
      title: "Propuestas para el futuro",
      description: "Presentando nuestras propuestas para el desarrollo",
      alt: "Propuestas para el futuro",
      order: 2,
    },
  ],
  eventos: [
    {
      id: 1,
      imageUrl: "/placeholder.svg?height=400&width=600",
      title: "Visita a la comunidad",
      description: "Reunión con líderes comunitarios para discutir necesidades locales.",
      order: 0,
    },
    {
      id: 2,
      imageUrl: "/placeholder.svg?height=400&width=600",
      title: "Evento comunitario",
      description: "Participación en evento comunitario local.",
      order: 1,
    },
  ],
  actividades: [
    {
      id: 1,
      imageUrl: "/placeholder.svg?height=400&width=600",
      title: "Foro político",
      description: "Participación en foro sobre políticas públicas.",
      order: 0,
    },
    {
      id: 2,
      imageUrl: "/placeholder.svg?height=400&width=600",
      title: "Reunión de trabajo",
      description: "Reunión con equipo de trabajo para planificar estrategias.",
      order: 1,
    },
  ],
  "propuestas-accion": [
    {
      id: 1,
      imageUrl: "/placeholder.svg?height=400&width=600",
      title: "Proyecto de salud",
      description: "Inauguración de nueva clínica comunitaria para mejorar servicios de salud.",
      order: 0,
    },
    {
      id: 2,
      imageUrl: "/placeholder.svg?height=400&width=600",
      title: "Programa educativo",
      description: "Lanzamiento de programa educativo para jóvenes.",
      order: 1,
    },
  ],
}

// Función para obtener los elementos de una galería
export function getGalleryItems(galleryType: GalleryType): GalleryItem[] {
  if (typeof window === "undefined") {
    return INITIAL_GALLERIES[galleryType]
  }

  try {
    const storedItems = localStorage.getItem(`gallery-${galleryType}`)
    if (storedItems) {
      const items = JSON.parse(storedItems) as GalleryItem[]
      // Ordenar los elementos por el campo order
      return items.sort((a, b) => (a.order || 0) - (b.order || 0))
    }
  } catch (error) {
    console.error(`Error loading gallery ${galleryType} from localStorage:`, error)
  }

  return INITIAL_GALLERIES[galleryType]
}

// Función para guardar los elementos de una galería
export function saveGalleryItems(galleryType: GalleryType, items: GalleryItem[]): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    // Asegurarse de que todos los elementos tengan un valor de orden
    const itemsWithOrder = items.map((item, index) => ({
      ...item,
      order: item.order !== undefined ? item.order : index,
    }))

    localStorage.setItem(`gallery-${galleryType}`, JSON.stringify(itemsWithOrder))
    // Disparar un evento personalizado para notificar a otros componentes
    window.dispatchEvent(new CustomEvent("gallery-updated", { detail: { type: galleryType, items: itemsWithOrder } }))
  } catch (error) {
    console.error(`Error saving gallery ${galleryType} to localStorage:`, error)
  }
}

// Función para actualizar un elemento específico de la galería
export function updateGalleryItem(galleryType: GalleryType, updatedItem: GalleryItem): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    const items = getGalleryItems(galleryType)
    const updatedItems = items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    saveGalleryItems(galleryType, updatedItems)
  } catch (error) {
    console.error(`Error updating gallery item in ${galleryType}:`, error)
  }
}

// Función para reordenar los elementos de una galería
export function reorderGalleryItems(galleryType: GalleryType, itemIds: number[]): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    const items = getGalleryItems(galleryType)
    const reorderedItems = itemIds.map((id, index) => {
      const item = items.find((i) => i.id === id)
      if (item) {
        return { ...item, order: index }
      }
      throw new Error(`Item with id ${id} not found in gallery ${galleryType}`)
    })

    saveGalleryItems(galleryType, reorderedItems)
  } catch (error) {
    console.error(`Error reordering gallery items in ${galleryType}:`, error)
  }
}

// Función para escuchar cambios en las galerías
export function listenToGalleryChanges(callback: (galleryType: GalleryType, items: GalleryItem[]) => void): () => void {
  if (typeof window === "undefined") {
    return () => {}
  }

  const handleGalleryUpdate = (event: Event) => {
    const customEvent = event as CustomEvent<{ type: GalleryType; items: GalleryItem[] }>
    callback(customEvent.detail.type, customEvent.detail.items)
  }

  window.addEventListener("gallery-updated", handleGalleryUpdate)

  // Devolver función para eliminar el listener
  return () => {
    window.removeEventListener("gallery-updated", handleGalleryUpdate)
  }
}

// Inicializar el almacenamiento si es necesario
export function initializeGalleryStore(): void {
  if (typeof window === "undefined") {
    return
  }

  // Comprobar si ya hay datos guardados
  Object.keys(INITIAL_GALLERIES).forEach((galleryType) => {
    const key = `gallery-${galleryType}`
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(INITIAL_GALLERIES[galleryType as GalleryType]))
    }
  })
}

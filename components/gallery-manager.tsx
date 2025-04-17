"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Trash2, FolderPlus, Edit, ArrowUp, ArrowDown, Star } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImagePreview } from "@/components/image-preview"
import { optimizeImage } from "@/lib/image-utils"
import { fileToDataUrl } from "@/lib/image-utils"
import type { GalleryItem } from "@/lib/gallery-store"
import { EditGalleryItem } from "@/components/edit-gallery-item"

interface GalleryManagerProps {
  galleryId: string
  galleryTitle: string
  initialItems: GalleryItem[]
  onUpdateGallery: (items: GalleryItem[]) => void
}

export function GalleryManager({ galleryId, galleryTitle, initialItems, onUpdateGallery }: GalleryManagerProps) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialItems || [])
  const [newItem, setNewItem] = useState<Omit<GalleryItem, "id">>({
    title: "",
    description: "",
    imageUrl: "/placeholder.svg?height=400&width=600",
  })
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Actualizar el estado local cuando cambian los initialItems
  useEffect(() => {
    setGalleryItems(initialItems || [])
  }, [initialItems])

  // Función para agregar una nueva imagen a la galería
  const handleAddGalleryItem = async () => {
    if (newItem.title && newItem.description) {
      try {
        setIsProcessing(true)

        // Crear un nuevo elemento para la galería
        const newGalleryItem: GalleryItem = {
          id: Date.now(), // Use timestamp as a simple unique ID
          ...newItem,
          order: galleryItems.length, // Añadir al final por defecto
        }

        // Si la imagen es una URL de objeto, convertirla a base64 para persistencia
        if (newItem.imageUrl.startsWith("blob:")) {
          try {
            // Obtener el blob de la URL
            const response = await fetch(newItem.imageUrl)
            const blob = await response.blob()

            // Convertir el blob a base64
            const base64 = await fileToDataUrl(new File([blob], "image.jpg", { type: blob.type }))

            // Actualizar la URL de la imagen
            newGalleryItem.imageUrl = base64
          } catch (error) {
            console.error("Error al convertir blob a base64:", error)
          }
        }

        // Actualizar el estado local
        const updatedItems = [...galleryItems, newGalleryItem]
        setGalleryItems(updatedItems)

        // Notificar al componente padre
        onUpdateGallery(updatedItems)

        // Reset form
        setNewItem({
          title: "",
          description: "",
          imageUrl: "/placeholder.svg?height=400&width=600",
        })

        // Show success message
        setUploadSuccess(true)
        setTimeout(() => setUploadSuccess(false), 3000)
      } catch (error) {
        console.error("Error al agregar imagen:", error)
        setUploadError("Error al procesar la imagen. Intente nuevamente.")
        setTimeout(() => setUploadError(""), 3000)
      } finally {
        setIsProcessing(false)
      }
    } else {
      setUploadError("Por favor complete todos los campos")
      setTimeout(() => setUploadError(""), 3000)
    }
  }

  // Función para eliminar una imagen de la galería
  const handleDeleteItem = (id: number) => {
    const updatedItems = galleryItems.filter((item) => item.id !== id)

    // Reordenar los elementos restantes
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      order: index,
    }))

    setGalleryItems(reorderedItems)
    onUpdateGallery(reorderedItems)
  }

  // Función para manejar la carga de imágenes
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      try {
        setIsProcessing(true)
        setUploadSuccess(false)
        setUploadError("Procesando imagen...")

        // Optimizar la imagen antes de usarla
        const optimizedBlob = await optimizeImage(file, 1200)

        // Crear una URL temporal para la imagen optimizada
        const imageUrl = URL.createObjectURL(optimizedBlob)

        // Actualizar el estado con la nueva URL de imagen
        setNewItem({
          ...newItem,
          imageUrl: imageUrl,
        })

        // Limpiar el mensaje de error/carga
        setUploadError("")
      } catch (error) {
        console.error("Error al procesar la imagen:", error)
        setUploadError("Error al procesar la imagen. Intente nuevamente.")
        setTimeout(() => setUploadError(""), 3000)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  // Función para editar un elemento de la galería
  const handleEditItem = (item: GalleryItem) => {
    setEditingItem(item)
    setIsEditDialogOpen(true)
  }

  // Función para guardar los cambios de un elemento editado
  const handleSaveEditedItem = (updatedItem: GalleryItem) => {
    const updatedItems = galleryItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    setGalleryItems(updatedItems)
    onUpdateGallery(updatedItems)
  }

  // Función para mover un elemento hacia arriba en la galería
  const handleMoveUp = (index: number) => {
    if (index <= 0) return

    const newItems = [...galleryItems]
    const itemToMove = { ...newItems[index], order: index - 1 }
    const itemToReplace = { ...newItems[index - 1], order: index }

    newItems[index] = itemToReplace
    newItems[index - 1] = itemToMove

    setGalleryItems(newItems)
    onUpdateGallery(newItems)
  }

  // Función para mover un elemento hacia abajo en la galería
  const handleMoveDown = (index: number) => {
    if (index >= galleryItems.length - 1) return

    const newItems = [...galleryItems]
    const itemToMove = { ...newItems[index], order: index + 1 }
    const itemToReplace = { ...newItems[index + 1], order: index }

    newItems[index] = itemToReplace
    newItems[index + 1] = itemToMove

    setGalleryItems(newItems)
    onUpdateGallery(newItems)
  }

  // Función para marcar/desmarcar un elemento como destacado
  const handleToggleFeatured = (item: GalleryItem) => {
    const updatedItem = { ...item, featured: !item.featured }
    const updatedItems = galleryItems.map((i) => (i.id === item.id ? updatedItem : i))
    setGalleryItems(updatedItems)
    onUpdateGallery(updatedItems)
  }

  return (
    <div className="space-y-8">
      <Card className="border-pink-200">
        <CardHeader className="bg-pink-50">
          <CardTitle className="text-brand-pink">Agregar imagen a {galleryTitle}</CardTitle>
          <CardDescription>Sube una nueva imagen para la galería de {galleryTitle.toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent>
          {uploadSuccess && (
            <Alert className="mb-4 bg-green-50 border-green-500 text-green-700">
              <AlertDescription>Imagen agregada exitosamente a la galería</AlertDescription>
            </Alert>
          )}

          {uploadError && (
            <Alert className="mb-4 bg-red-50 border-red-500 text-red-700">
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${galleryId}`}>Título</Label>
                <Input
                  id={`title-${galleryId}`}
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`image-${galleryId}`}>Imagen</Label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-brand-pink text-brand-pink hover:bg-pink-50"
                      onClick={() => document.getElementById(`image-upload-${galleryId}`)?.click()}
                      disabled={isProcessing}
                    >
                      <Upload size={16} />
                      Subir imagen
                    </Button>
                    <Input
                      id={`image-upload-${galleryId}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isProcessing}
                    />
                    <span className="text-sm text-gray-500">
                      {newItem.imageUrl !== "/placeholder.svg?height=400&width=600"
                        ? "Imagen seleccionada"
                        : "Ninguna imagen seleccionada"}
                    </span>
                  </div>

                  {/* Vista previa de la imagen */}
                  {newItem.imageUrl !== "/placeholder.svg?height=400&width=600" && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
                      <ImagePreview
                        src={newItem.imageUrl || "/placeholder.svg"}
                        alt="Vista previa"
                        width={200}
                        height={150}
                        className="rounded-md border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`description-${galleryId}`}>Descripción</Label>
              <Textarea
                id={`description-${galleryId}`}
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                disabled={isProcessing}
              />
            </div>
            <div className="flex items-center gap-4">
              <Button
                className="bg-brand-pink hover:bg-brand-pink-dark text-white"
                onClick={handleAddGalleryItem}
                disabled={isProcessing}
              >
                <FolderPlus size={16} className="mr-2" />
                Agregar a la galería
              </Button>
              <span className="text-sm text-gray-500">Las imágenes se guardarán en la galería: {galleryTitle}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-pink-200">
        <CardHeader className="bg-pink-50">
          <CardTitle className="text-brand-pink">Imágenes en {galleryTitle}</CardTitle>
          <CardDescription>
            Administra las imágenes que aparecen en la galería de {galleryTitle.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {galleryItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay imágenes en esta galería. Agrega algunas usando el formulario de arriba.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryItems.map((item, index) => (
                <Card
                  key={item.id}
                  className={`overflow-hidden ${item.featured ? "border-2 border-brand-pink" : "border-pink-100"}`}
                >
                  <div className="aspect-video relative">
                    <ImagePreview
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full"
                    />
                    {item.featured && (
                      <div className="absolute top-2 right-2 bg-brand-pink text-white px-2 py-1 rounded-md text-xs font-medium">
                        Destacada
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-brand-pink">{item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.description}</p>
                    <div className="flex justify-between mt-4">
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="h-8 w-8 p-0"
                          title="Mover arriba"
                        >
                          <ArrowUp size={16} />
                          <span className="sr-only">Mover arriba</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === galleryItems.length - 1}
                          className="h-8 w-8 p-0"
                          title="Mover abajo"
                        >
                          <ArrowDown size={16} />
                          <span className="sr-only">Mover abajo</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFeatured(item)}
                          className={`h-8 w-8 p-0 ${item.featured ? "bg-brand-pink text-white" : ""}`}
                          title={item.featured ? "Quitar destacado" : "Destacar"}
                        >
                          <Star size={16} />
                          <span className="sr-only">Destacar</span>
                        </Button>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                          className="h-8 px-2 py-0"
                        >
                          <Edit size={16} className="mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="bg-red-500 hover:bg-red-600 h-8 px-2 py-0"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para editar imágenes */}
      {editingItem && (
        <EditGalleryItem
          item={editingItem}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveEditedItem}
        />
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Save } from "lucide-react"
import { ImagePreview } from "@/components/image-preview"
import { optimizeImage, fileToDataUrl } from "@/lib/image-utils"
import type { GalleryItem } from "@/lib/gallery-store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EditGalleryItemProps {
  item: GalleryItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedItem: GalleryItem) => void
}

export function EditGalleryItem({ item, open, onOpenChange, onSave }: EditGalleryItemProps) {
  const [editedItem, setEditedItem] = useState<GalleryItem>({ ...item })
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadError, setUploadError] = useState("")

  // Función para manejar la carga de imágenes
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      try {
        setIsProcessing(true)
        setUploadError("Procesando imagen...")

        // Optimizar la imagen antes de usarla
        const optimizedBlob = await optimizeImage(file, 1200)

        // Convertir a base64 para persistencia
        const base64 = await fileToDataUrl(new File([optimizedBlob], file.name, { type: file.type }))

        // Actualizar el estado con la nueva URL de imagen
        setEditedItem({
          ...editedItem,
          imageUrl: base64,
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

  // Función para guardar los cambios
  const handleSave = () => {
    onSave(editedItem)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-brand-pink">Editar imagen</DialogTitle>
          <DialogDescription>Modifica los detalles de esta imagen de la galería.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={editedItem.title}
                onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value })}
                disabled={isProcessing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={editedItem.description}
                onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                disabled={isProcessing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Imagen</Label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-brand-pink text-brand-pink hover:bg-pink-50"
                    onClick={() => document.getElementById("edit-image-upload")?.click()}
                    disabled={isProcessing}
                  >
                    <Upload size={16} />
                    Cambiar imagen
                  </Button>
                  <Input
                    id="edit-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isProcessing}
                  />
                  {uploadError && <span className="text-sm text-red-500">{uploadError}</span>}
                </div>

                {/* Vista previa de la imagen */}
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
                  <ImagePreview
                    src={editedItem.imageUrl || "/placeholder.svg"}
                    alt="Vista previa"
                    width={300}
                    height={200}
                    className="rounded-md border border-gray-200"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={!!editedItem.featured}
                  onChange={(e) => setEditedItem({ ...editedItem, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-brand-pink focus:ring-brand-pink"
                />
                <Label htmlFor="edit-featured">Marcar como imagen destacada</Label>
              </div>
              <p className="text-xs text-gray-500">
                Las imágenes destacadas aparecerán primero en la galería y pueden tener un tratamiento especial.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="bg-brand-pink hover:bg-brand-pink-dark" onClick={handleSave} disabled={isProcessing}>
            <Save size={16} className="mr-2" />
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

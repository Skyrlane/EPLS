"use client"

import { useState, useRef } from "react"
import { UploadCloud, X, FileIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { uploadFileWithUniqueFileName } from "@/lib/firebase-helpers"
import { cn } from "@/lib/utils"

export interface FileUploadProps {
  /** Fonction appelée quand un fichier est téléchargé */
  onUploadComplete?: (fileData: { url: string; path: string; filename: string }) => void
  /** Fonction appelée quand un fichier est supprimé */
  onFileRemoved?: () => void
  /** URL du fichier actuel s'il existe déjà */
  currentFileUrl?: string
  /** Chemin pour le stockage Firebase */
  storagePath: string
  /** Types de fichiers acceptés, ex: "image/*" ou ".pdf,.docx" */
  accept?: string
  /** Taille maximale en Mo */
  maxSizeMB?: number
  /** Hauteur du composant */
  height?: "auto" | "small" | "medium" | "large"
  /** Indique si l'upload est en cours */
  isUploading?: boolean
  /** Personnaliser le texte affiché */
  label?: string
  /** Message affiché en cas d'erreur */
  error?: string
}

export function FileUpload({
  onUploadComplete,
  onFileRemoved,
  currentFileUrl,
  storagePath,
  accept = "*",
  maxSizeMB = 5,
  height = "medium",
  isUploading: externalIsUploading,
  label = "Cliquez pour télécharger",
  error: externalError,
}: FileUploadProps) {
  const [filePreview, setFilePreview] = useState<string | null>(currentFileUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isImage = accept.includes("image")

  // Calculer la hauteur en fonction de la propriété
  const heightClasses = {
    auto: "min-h-[100px]",
    small: "h-32",
    medium: "h-48",
    large: "h-64"
  }

  const isLoading = externalIsUploading || isUploading
  const errorMessage = externalError || error

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier la taille du fichier
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`La taille du fichier dépasse la limite de ${maxSizeMB} Mo`)
      return
    }

    setFileName(file.name)
    setError(null)

    // Si c'est une image, créer un aperçu
    if (isImage) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      // Pour les autres types de fichiers, définir un aperçu générique
      setFilePreview("file")
    }

    // Uploader le fichier
    try {
      setIsUploading(true)
      const { url, path } = await uploadFileWithUniqueFileName(file, storagePath)
      
      if (onUploadComplete) {
        onUploadComplete({ 
          url, 
          path, 
          filename: file.name 
        })
      }
      
      setFilePreview(isImage ? url : "file")
    } catch (err) {
      console.error("Erreur lors du téléchargement:", err)
      setError("Une erreur est survenue lors du téléchargement")
      setFilePreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    // Note: ceci ne supprime pas physiquement le fichier de Firebase Storage
    // Il faudrait implémenter cette logique dans l'application
    setFilePreview(null)
    setFileName(null)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    
    if (onFileRemoved) {
      onFileRemoved()
    }
  }

  return (
    <div className="w-full">
      {errorMessage && (
        <div className="mb-2 text-sm text-red-500">{errorMessage}</div>
      )}
      
      <div className={cn(
        "flex items-center justify-center w-full relative border-2 border-dashed rounded-lg",
        isLoading ? "cursor-not-allowed bg-gray-50 border-gray-200" : "cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300",
        heightClasses[height],
        {
          "bg-red-50 border-red-300": errorMessage,
        }
      )}>
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
            <p className="text-sm text-gray-600">Téléchargement en cours...</p>
          </div>
        )}

        {filePreview ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            {isImage ? (
              // Affichage pour les images
              <div className="relative max-h-full max-w-full w-auto h-auto">
                <Image
                  src={filePreview}
                  alt="Aperçu"
                  width={300}
                  height={300}
                  className="max-h-full max-w-full object-contain rounded-lg"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
            ) : (
              // Affichage pour les autres types de fichiers
              <div className="flex flex-col items-center">
                <FileIcon className="w-12 h-12 text-primary mb-2" />
                <p className="text-sm text-gray-700 max-w-full truncate">
                  {fileName || "Fichier téléchargé"}
                </p>
              </div>
            )}
            
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleRemoveFile}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Supprimer le fichier</span>
            </Button>
          </div>
        ) : (
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-full"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-700">
                <span className="font-medium">{label}</span>
              </p>
              <p className="text-xs text-gray-500">
                {isImage
                  ? "PNG, JPG ou GIF"
                  : accept === "*" 
                    ? "Tous types de fichiers" 
                    : `Types acceptés: ${accept}`
                }
                {" "}
                (max. {maxSizeMB} Mo)
              </p>
            </div>
            <input
              id="file-upload"
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
              disabled={isLoading}
            />
          </label>
        )}
      </div>
    </div>
  )
} 
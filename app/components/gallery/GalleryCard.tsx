import Image from "next/image"
import { GalleryImageProps } from "./GalleryData"
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

interface GalleryCardProps extends GalleryImageProps {}

export function GalleryCard({ id, src, alt, description }: GalleryCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
          <div className="relative h-60 w-full">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="p-4 bg-white">
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative h-80 sm:h-full">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-lg text-gray-700">{description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
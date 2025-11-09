import { useState } from "react";
import Image from "next/image";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface Image {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface GallerySectionProps {
  title?: string;
  description?: string;
  images: Image[];
}

export function GallerySection({
  title = "Notre galerie",
  description = "Découvrez la vie de notre église en images",
  images,
}: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  return (
    <SectionContainer background="white">
      <SectionHeader 
        title={title} 
        description={description}
      />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
      
      {/* Modal pour afficher l'image en plein écran */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 p-2 text-white bg-black/50 rounded-full z-10"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="h-6 w-6" />
          </button>
          
          <div 
            className="relative max-w-4xl w-full max-h-[80vh] h-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={selectedImage.width}
              height={selectedImage.height}
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      )}
    </SectionContainer>
  );
} 
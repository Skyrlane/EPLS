import { GalleryCategoryProps } from "./GalleryData"
import { GalleryCard } from "./GalleryCard"

interface GalleryCategoryComponentProps {
  category: GalleryCategoryProps
}

export function GalleryCategory({ category }: GalleryCategoryComponentProps) {
  return (
    <section id={category.id} className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-primary">{category.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.images.map((image) => (
          <GalleryCard key={image.id} {...image} />
        ))}
      </div>
    </section>
  )
} 
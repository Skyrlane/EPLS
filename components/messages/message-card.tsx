import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MessageCircle, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessageCardProps {
  id?: string;
  title: string;
  date: string;
  category: string;
  description: string;
  preacher: string;
  imageUrl?: string;
  className?: string;
}

export function MessageCard({
  id,
  title,
  date,
  category,
  description,
  preacher,
  imageUrl,
  className,
}: MessageCardProps) {
  // Formatter la date (exemple: "12 janvier 2023")
  const formattedDate = format(new Date(date), "d MMMM yyyy", { locale: fr });
  
  // Limiter la description à 120 caractères
  const truncatedDescription = description.length > 120
    ? `${description.substring(0, 120)}...`
    : description;
  
  return (
    <div
      className={cn(
        "flex flex-col h-full overflow-hidden bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      {/* En-tête avec catégorie */}
      <div className="px-5 py-3 border-b">
        <Badge variant="outline" className="text-xs font-medium">
          {category}
        </Badge>
      </div>

      {/* Contenu */}
      <div className="flex-1 p-5 space-y-4">
        <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary">
          {title}
        </h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>{preacher}</span>
          </div>
        </div>

        <p className="text-muted-foreground line-clamp-3">
          {truncatedDescription}
        </p>
      </div>

      {/* Pied avec bouton */}
      <div className="px-5 py-4 mt-auto border-t">
        {id ? (
          <Link href={`/messages/${id}`} className="w-full">
            <Button variant="outline" className="w-full" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Voir le détail
            </Button>
          </Link>
        ) : (
          <Button variant="outline" className="w-full" size="sm" disabled>
            <MessageCircle className="w-4 h-4 mr-2" />
            Voir le détail
          </Button>
        )}
      </div>
    </div>
  );
} 
import Link from "next/link";
import { PlayCircleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  date: string;
  series?: string;
  likes?: number;
  speaker: {
    name: string;
    image?: string;
  };
  videoUrl?: string;
}

interface LatestMessageCardProps {
  message: Message;
  className?: string;
}

export function LatestMessageCard({ message, className }: LatestMessageCardProps) {
  return (
    <div className={cn(
      "overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-300 card-hover",
      className
    )}>
      <Link href={`/messages/${message.id}`} className="relative block">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={message.coverImage || "/images/messages/default-message.jpg"}
            alt={`Image du message: ${message.title}`}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-white/20 backdrop-blur-sm p-3 md:p-4 hover:bg-white/30 transition-all transform hover:scale-110">
              <PlayCircleIcon className="h-10 w-10 md:h-16 md:w-16 text-white" />
            </div>
          </div>
        </div>
      </Link>
      <div className="p-4 bg-card">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {message.series && (
            <Badge variant="secondary">
              {message.series}
            </Badge>
          )}
          <time className="text-sm text-muted-foreground">
            {message.date}
          </time>
        </div>
        <Link
          href={`/messages/${message.id}`}
          className="hover:text-primary no-underline group"
        >
          <h3 className="mb-2 line-clamp-1 text-xl font-semibold group-hover:text-primary">
            {message.title}
          </h3>
        </Link>
        <p className="mb-4 line-clamp-2 text-muted-foreground">
          {message.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {message.speaker.image ? (
                <AvatarImage src={message.speaker.image} alt={message.speaker.name} />
              ) : (
                <AvatarFallback>{message.speaker.name.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <span className="text-sm font-medium">
              {message.speaker.name}
            </span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/messages/${message.id}`}
              className="flex items-center gap-1"
            >
              <PlayCircleIcon className="h-4 w-4" />
              Voir
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

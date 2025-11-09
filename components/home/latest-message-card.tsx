import Link from "next/link";
import { ImageBlock } from "@/components/ui/image-block";
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
      "overflow-hidden rounded-lg border border-border shadow-sm transition-all duration-300 card-hover",
      "dark:bg-slate-900 dark:border-slate-800",
      className
    )}>
      <Link href={`/messages/${message.id}`} className="relative block">
        <div className="aspect-video w-full overflow-hidden">
          <ImageBlock
            src={message.coverImage || "/images/messages/default-message.jpg"}
            alt={`Image du message: ${message.title}`}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            type="card"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-white/20 backdrop-blur-sm p-3 md:p-4 hover:bg-white/30 transition-all transform hover:scale-110">
              <PlayCircleIcon className="h-10 w-10 md:h-16 md:w-16 text-white" />
            </div>
          </div>
        </div>
      </Link>
      <div className="p-4 bg-white dark:bg-slate-900">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {message.series && (
            <Badge variant="secondary" className="dark:bg-primary/20 dark:text-primary-foreground">
              {message.series}
            </Badge>
          )}
          <time className="text-sm text-muted-foreground dark:text-gray-300">
            {message.date}
          </time>
        </div>
        <Link 
          href={`/messages/${message.id}`} 
          className="hover:text-primary no-underline group"
        >
          <h3 className="mb-2 line-clamp-1 text-xl font-semibold dark:text-white group-hover:text-primary">
            {message.title}
          </h3>
        </Link>
        <p className="mb-4 line-clamp-2 text-muted-foreground dark:text-gray-300">
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
            <span className="text-sm font-medium dark:text-gray-200">
              {message.speaker.name}
            </span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link 
              href={`/messages/${message.id}`} 
              className="flex items-center gap-1 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
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
"use client"

import React, { useState } from 'react';
import { HeartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MessageLikeButtonProps {
  messageId: string;
  initialLikes: number;
}

export function MessageLikeButton({ messageId, initialLikes }: MessageLikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setHasLiked(!hasLiked);
    
    // Ici, on pourrait ajouter une fonction pour enregistrer le "like" dans Firebase
    // par exemple: saveLike(messageId, !hasLiked);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1 px-2 hover:bg-primary/10"
      onClick={(e) => {
        e.preventDefault(); // Empêche la navigation si le bouton est à l'intérieur d'un lien
        handleLike();
      }}
    >
      <HeartIcon
        className={`h-4 w-4 ${hasLiked ? "fill-primary text-primary" : "text-muted-foreground"}`}
      />
      <span className="text-sm">{likes}</span>
    </Button>
  );
} 
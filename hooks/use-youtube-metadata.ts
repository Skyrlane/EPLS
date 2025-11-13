"use client";

import { useState, useEffect } from "react";
import { getYouTubeMetadata } from "@/lib/youtube-utils";

interface YouTubeMetadata {
  duration: string | null;
  thumbnail: string;
  title: string | null;
  description: string | null;
}

export function useYouTubeMetadata(videoId: string | null) {
  const [metadata, setMetadata] = useState<YouTubeMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoId) {
      setMetadata(null);
      return;
    }

    setLoading(true);
    setError(null);

    getYouTubeMetadata(videoId)
      .then((data) => {
        if (data) {
          setMetadata(data);
        } else {
          setError("Impossible de récupérer les métadonnées");
        }
      })
      .catch((err) => {
        console.error("Erreur:", err);
        setError("Erreur lors de la récupération des métadonnées");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [videoId]);

  return { metadata, loading, error };
}

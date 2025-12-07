interface YouTubeEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

/**
 * Extrait l'ID de la vidéo depuis une URL YouTube
 */
function extractYouTubeId(url: string): string | null {
  // Supporte les formats:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Composant pour afficher une vidéo YouTube embarquée
 * Extrait automatiquement l'ID de la vidéo depuis l'URL
 */
export function YouTubeEmbed({ url, title = "Vidéo YouTube", className = "" }: YouTubeEmbedProps) {
  const videoId = extractYouTubeId(url);
  
  if (!videoId) {
    return (
      <div className={`bg-slate-100 dark:bg-slate-800 rounded-lg p-8 text-center ${className}`}>
        <p className="text-muted-foreground">URL YouTube invalide</p>
      </div>
    );
  }

  return (
    <div className={`aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 ${className}`}>
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

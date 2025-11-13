/**
 * Utilitaires pour l'intégration YouTube
 */

/**
 * Extraire l'ID YouTube depuis différents formats d'URL
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * Générer l'URL d'embed YouTube
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Parser une durée ISO 8601 (PT1H30M45S) vers format lisible (1:30:45)
 */
function parseDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Récupérer les métadonnées YouTube via l'API
 */
export async function getYouTubeMetadata(videoId: string) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    
    if (!apiKey) {
      console.warn("YouTube API key non configurée, utilisation de la thumbnail par défaut");
      return {
        duration: null,
        thumbnail: getYouTubeThumbnail(videoId),
        title: null,
        description: null,
      };
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des métadonnées YouTube");
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const video = data.items[0];

      // Parser la durée ISO 8601 → MM:SS
      const duration = parseDuration(video.contentDetails.duration);

      // Thumbnail haute qualité
      const thumbnail =
        video.snippet.thumbnails.maxres?.url ||
        video.snippet.thumbnails.high?.url ||
        video.snippet.thumbnails.medium?.url ||
        getYouTubeThumbnail(videoId);

      return {
        duration,
        thumbnail,
        title: video.snippet.title,
        description: video.snippet.description,
      };
    }
  } catch (error) {
    console.error("Erreur YouTube API:", error);
  }

  // Fallback
  return {
    duration: null,
    thumbnail: getYouTubeThumbnail(videoId),
    title: null,
    description: null,
  };
}

/**
 * Thumbnail par défaut YouTube (sans API)
 */
export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * Valider une URL YouTube
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

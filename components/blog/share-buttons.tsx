"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [fullUrl, setFullUrl] = useState(url);

  // Transformer l'URL relative en URL absolue côté client
  useEffect(() => {
    setFullUrl(window.location.origin + url);
  }, [url]);

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`, '_blank');
  };

  const shareByEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(fullUrl)}`, '_blank');
  };

  return (
    <div className="inline-flex gap-2">
      <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full" onClick={shareOnFacebook}>
        <span className="sr-only">Partager sur Facebook</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          stroke="currentColor"
          fill="none"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      </Button>
      <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full" onClick={shareOnTwitter}>
        <span className="sr-only">Partager sur Twitter</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          stroke="currentColor"
          fill="none"
        >
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
        </svg>
      </Button>
      <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full" onClick={shareByEmail}>
        <span className="sr-only">Partager par email</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          stroke="currentColor"
          fill="none"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </Button>
    </div>
  );
} 
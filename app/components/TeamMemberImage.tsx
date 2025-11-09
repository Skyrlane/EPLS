import Image from 'next/image';
import { useState } from 'react';

interface TeamMemberImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function TeamMemberImage({ 
  src, 
  alt, 
  className = '', 
  width = 100, 
  height = 100 
}: TeamMemberImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  const handleError = () => {
    // Si l'image n'est pas trouvée, utiliser une image par défaut
    setImgSrc('/images/placeholder-person.svg');
    setError(true);
  };

  return (
    <div className={`relative ${className}`}>
      <Image 
        src={imgSrc} 
        alt={alt}
        width={width}
        height={height}
        className={`rounded-full object-cover ${error ? 'bg-slate-200' : ''}`}
        onError={handleError}
      />
    </div>
  );
} 
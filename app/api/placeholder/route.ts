import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Récupérer l'URL
  const url = new URL(request.url);
  
  // Récupérer les dimensions depuis les paramètres de requête
  const width = parseInt(url.searchParams.get('width') || '400');
  const height = parseInt(url.searchParams.get('height') || '300');
  
  // Récupérer le texte personnalisé (optionnel)
  const text = url.searchParams.get('text') || 'Image à venir';
  
  // Générer un SVG avec les dimensions spécifiées
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f0f0f0"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#a0a0a0">
      ${text}
    </text>
    <path d="M${width*0.3},${height*0.45} Q${width*0.5},${height*0.25} ${width*0.7},${height*0.45}" stroke="#c0c0c0" stroke-width="3" fill="none"/>
    <path d="M${width*0.38},${height*0.35} Q${width*0.45},${height*0.25} ${width*0.52},${height*0.35}" stroke="#c0c0c0" stroke-width="2" fill="none"/>
    <rect x="${width*0.3}" y="${height*0.45}" width="${width*0.4}" height="${height*0.3}" fill="#e0e0e0" rx="10"/>
    <rect x="${width*0.33}" y="${height*0.5}" width="${width*0.34}" height="${height*0.2}" fill="#d0d0d0" rx="5"/>
    <circle cx="${width*0.5}" cy="${height*0.6}" r="${Math.min(width, height)*0.075}" fill="#c0c0c0"/>
    <path d="M${width*0.47},${height*0.6} L${width*0.53},${height*0.6} M${width*0.5},${height*0.57} L${width*0.5},${height*0.63}" stroke="#b0b0b0" stroke-width="3"/>
  </svg>`;

  // Renvoyer le SVG
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
} 
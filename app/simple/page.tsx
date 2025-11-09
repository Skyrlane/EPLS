"use client";

import { useState, useEffect } from "react";

export default function SimplePage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Page Simple</h1>
      <p>Cette page est rendue côté client et devrait fonctionner même si d'autres parties de l'application posent problème.</p>
      <p>État du montage: {mounted ? "Monté" : "Non monté"}</p>
    </div>
  );
} 
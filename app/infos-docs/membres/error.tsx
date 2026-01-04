'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Loguer l'erreur sur le serveur
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-32 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Une erreur est survenue</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Nous n'avons pas pu charger les informations sur les membres. Veuillez réessayer ultérieurement.
        </p>
        <Button
          onClick={() => reset()}
          variant="default"
          size="lg"
          className="mx-auto"
        >
          Réessayer
        </Button>
      </div>
    </div>
  )
} 
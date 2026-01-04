"use client"

import React from 'react'
import QRCode from 'react-qr-code'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

interface VisioconferenceLinkProps {
  meetingUrl: string
  title?: string
  subtitle?: string
  description?: string
  className?: string
}

export function VisioconferenceLink({
  meetingUrl,
  title = "Cultes en visioconférences",
  subtitle = "Les cultes ont lieu à l'église le dimanche à 10h et sont retransmis en visioconférences Zoom.",
  description = "Code à scanner pour l'accès à la visioconférence :",
  className
}: VisioconferenceLinkProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-primary">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        
        <div className="p-4 bg-card rounded-lg mb-4 shadow-sm">
          <QRCode 
            value={meetingUrl}
            size={180}
            style={{ maxWidth: "100%", height: "auto" }}
            level="M"
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
        </div>
        
        <Button asChild variant="outline" size="sm" className="gap-1">
          <Link href={meetingUrl} target="_blank" rel="noopener noreferrer">
            <span>Lien Meet</span>
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
} 
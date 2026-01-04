"use client"

import { cn } from "@/lib/utils"

interface BankInfoBlockProps {
  title: string
  iban: string
  bic: string
  className?: string
}

/**
 * Composant pour afficher les informations bancaires
 * avec un contraste optimal en mode sombre
 */
export function BankInfoBlock({ title, iban, bic, className }: BankInfoBlockProps) {
  return (
    <div
      className={cn(
        "bg-muted border border-border p-4 rounded-md mb-4",
        className
      )}
    >
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-foreground">IBAN : {iban}</p>
      <p className="text-foreground">BIC : {bic}</p>
    </div>
  )
} 
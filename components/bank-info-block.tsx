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
        "bg-slate-50 dark:bg-slate-800 dark:border dark:border-slate-700 p-4 rounded-md mb-4",
        className
      )}
    >
      <p className="font-medium dark:font-semibold dark:text-white">{title}</p>
      <p className="dark:text-gray-100">IBAN : {iban}</p>
      <p className="dark:text-gray-100">BIC : {bic}</p>
    </div>
  )
} 
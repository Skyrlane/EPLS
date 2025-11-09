"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/hooks/use-theme"
import { Button } from "@/components/ui/button"
import { SunIcon, MoonIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeSwitchProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "icon" | "default" | "sm" | "lg"
}

/**
 * Bouton simple pour basculer entre les modes clair et sombre
 */
export function ThemeSwitch({ 
  className, 
  variant = "ghost", 
  size = "icon",
  ...props 
}: ThemeSwitchProps) {
  const [mounted, setMounted] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  
  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={cn("relative", className)}
        disabled
        aria-hidden="true"
        {...props}
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      </Button>
    )
  }

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={toggleTheme}
      className={cn("relative", className)}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      title={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      {...props}
    >
      <div className="relative w-[1.2rem] h-[1.2rem]">
        <SunIcon 
          className={cn(
            "absolute h-[1.2rem] w-[1.2rem] transition-all duration-300",
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          )} 
        />
        <MoonIcon 
          className={cn(
            "absolute h-[1.2rem] w-[1.2rem] transition-all duration-300",
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          )} 
        />
      </div>
      <span className="sr-only">
        {isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      </span>
    </Button>
  )
} 
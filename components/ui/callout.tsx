import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CalloutProps {
  title?: string
  children: ReactNode
  className?: string
  variant?: "default" | "warning" | "info" | "success"
}

export function Callout({ title, children, className, variant = "default" }: CalloutProps) {
  const variantClasses = {
    default: "bg-muted border-muted-foreground/20",
    warning: "bg-secondary/50 border-secondary",
    info: "bg-accent border-accent-foreground/20",
    success: "bg-primary/10 border-primary/30",
  }

  return (
    <div className={cn(
      "p-4 rounded-md border",
      variantClasses[variant],
      className
    )}>
      {title && <h4 className="text-sm font-medium mb-2">{title}</h4>}
      <div className="text-sm">{children}</div>
    </div>
  )
} 
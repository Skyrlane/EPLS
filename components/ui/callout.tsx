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
    warning: "bg-yellow-100 border-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-600/30",
    info: "bg-blue-100 border-blue-400 dark:bg-blue-900/20 dark:border-blue-600/30",
    success: "bg-green-100 border-green-400 dark:bg-green-900/20 dark:border-green-600/30",
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
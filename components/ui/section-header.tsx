import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({ 
  title, 
  description, 
  centered = true, 
  className 
}: SectionHeaderProps) {
  return (
    <div className={cn(
      "mb-12",
      centered && "text-center",
      className
    )}>
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      {description && (
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
} 
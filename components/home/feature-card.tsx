import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  content: string;
  linkText: string;
  linkHref: string;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  content,
  linkText,
  linkHref,
  className,
}: FeatureCardProps) {
  return (
    <Card className={cn(
      "hover:shadow-lg transition-all duration-300 card-hover",
      "hover:-translate-y-1 sm:h-full flex flex-col justify-between",
      className
    )}>
      <div>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>{title}</span>
          </CardTitle>
          <CardDescription className="text-sm mt-1">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-foreground">{content}</p>
        </CardContent>
      </div>
      <CardFooter className="pt-4">
        <Button
          asChild
          variant="outline"
          className="w-full border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-[1.02]"
        >
          <Link href={linkHref}>{linkText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

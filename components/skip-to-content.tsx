import { FC } from "react";

export const SkipToContent: FC = () => {
  return (
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      Aller au contenu principal
    </a>
  );
}; 
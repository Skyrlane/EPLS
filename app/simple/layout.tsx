import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page Simple"
}

export default function SimpleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  )
} 
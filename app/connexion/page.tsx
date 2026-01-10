"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { LoginForm } from "@/components/auth/login-form"
import { PageHeader } from "@/components/ui/page-header"
import { BreadcrumbItem } from "@/components/ui/breadcrumbs"

export default function ConnexionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/"

  const { user } = useAuth()

  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user) {
      router.push(callbackUrl)
    }
  }, [user, router, callbackUrl])

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Connexion", href: "/connexion", isCurrent: true },
  ];

  return (
    <>
      <PageHeader
        title="Connexion"
        breadcrumbs={breadcrumbItems}
      />

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <LoginForm callbackUrl={callbackUrl} />
          </div>
        </div>
      </section>
    </>
  )
} 
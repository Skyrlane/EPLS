"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      toast.success("Message envoyé. Nous vous répondrons dans les plus brefs délais.")
      setIsSubmitting(false)

      // Reset form
      const form = e.target as HTMLFormElement
      form.reset()
    }, 1500)
  }

  return (
    <>
      {/* Page Header */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Contact</h1>

          {/* Breadcrumbs */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-primary hover:text-primary/80">
                  Accueil
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-700">Contact</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Nous contacter</CardTitle>
                    <CardDescription>
                      Remplissez le formulaire ci-dessous pour nous envoyer un message. Nous vous répondrons dans les
                      plus brefs délais.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Prénom</Label>
                          <Input id="firstName" name="firstName" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nom</Label>
                          <Input id="lastName" name="lastName" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone (optionnel)</Label>
                        <Input id="phone" name="phone" type="tel" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Sujet</Label>
                        <Select name="subject">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un sujet" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">Renseignement général</SelectItem>
                            <SelectItem value="culte">Culte et activités</SelectItem>
                            <SelectItem value="priere">Demande de prière</SelectItem>
                            <SelectItem value="rencontre">Demande de rencontre</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" name="message" rows={5} required />
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox id="consent" name="consent" required />
                        <Label htmlFor="consent" className="text-sm">
                          J&apos;accepte que mes données soient traitées conformément à la politique de confidentialité
                          de l&apos;église.
                        </Label>
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Nos coordonnées</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Adresse</h3>
                        <p className="text-gray-600">
                          18 rue de Franche-Comté
                          <br />
                          67380 Lingolsheim
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Téléphone</h3>
                        <p className="text-gray-600">03 88 XX XX XX</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-gray-600">contact@protestants-libres.fr</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Horaires des cultes</h3>
                        <p className="text-gray-600">Dimanche à 10h00</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Map */}
                <Card>
                  <CardHeader>
                    <CardTitle>Nous trouver</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video w-full h-auto rounded-md overflow-hidden">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2640.1174767242967!2d7.685536815651687!3d48.56556477925861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4796c8c1e9f1e2c9%3A0x9f2f5d9c5b9b5b5b!2s18%20Rue%20de%20Franche-Comt%C3%A9%2C%2067380%20Lingolsheim!5e0!3m2!1sfr!2sfr!4v1617289123456!5m2!1sfr!2sfr"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        title="Carte de localisation de l'église"
                      ></iframe>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Transports en commun</h3>
                      <p className="text-gray-600">
                        Bus ligne 12, arrêt "Franche-Comté"
                        <br />
                        Tram ligne B, arrêt "Lingolsheim Alouettes" puis 5 minutes à pied
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

// Schéma de validation
const contactSchema = z.object({
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message trop court (minimum 10 caractères)'),
})

// L'adresse email de destination est configurable via variable d'environnement
// Pour modifier l'adresse : changer CONTACT_EMAIL dans .env.local
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'sam-dumay@outlook.com'

export async function POST(request: NextRequest) {
  try {
    // Vérifier que la clé API Resend est configurée
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('RESEND_API_KEY non configurée')
      return NextResponse.json(
        { error: 'Configuration email manquante' },
        { status: 500 }
      )
    }

    const resend = new Resend(resendApiKey)

    // Parser et valider les données
    const body = await request.json()
    const validationResult = contactSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, phone, subject, message } = validationResult.data

    // Mapper le sujet pour l'affichage
    const subjectLabels: Record<string, string> = {
      general: 'Renseignement général',
      culte: 'Culte et activités',
      priere: 'Demande de prière',
      rencontre: 'Demande de rencontre',
      autre: 'Autre',
    }

    const subjectLabel = subject ? subjectLabels[subject] || subject : 'Non spécifié'

    // Envoyer l'email
    const { data, error } = await resend.emails.send({
      from: 'EPLS Contact <onboarding@resend.dev>', // Utilise le domaine Resend par défaut pour les tests
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `[EPLS Contact] ${subjectLabel} - ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Nouveau message de contact</h1>
            <p style="margin: 5px 0 0 0;">Église Protestante Libre de Strasbourg</p>
          </div>

          <div style="padding: 20px; background-color: #f8fafc;">
            <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
              Informations du contact
            </h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-weight: bold; width: 120px;">Nom :</td>
                <td style="padding: 10px 0;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold;">Email :</td>
                <td style="padding: 10px 0;">
                  <a href="mailto:${email}" style="color: #1e40af;">${email}</a>
                </td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px 0; font-weight: bold;">Téléphone :</td>
                <td style="padding: 10px 0;">${phone}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0; font-weight: bold;">Sujet :</td>
                <td style="padding: 10px 0;">${subjectLabel}</td>
              </tr>
            </table>

            <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; margin-top: 30px;">
              Message
            </h2>

            <div style="background-color: white; padding: 15px; border-radius: 8px; border-left: 4px solid #1e40af;">
              <p style="white-space: pre-wrap; margin: 0; line-height: 1.6;">${message}</p>
            </div>
          </div>

          <div style="background-color: #e2e8f0; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
            <p style="margin: 0;">
              Ce message a été envoyé via le formulaire de contact du site EPLS.<br>
              Vous pouvez répondre directement à cet email pour contacter ${firstName}.
            </p>
          </div>
        </div>
      `,
      text: `
Nouveau message de contact - EPLS

Nom: ${firstName} ${lastName}
Email: ${email}
${phone ? `Téléphone: ${phone}` : ''}
Sujet: ${subjectLabel}

Message:
${message}

---
Ce message a été envoyé via le formulaire de contact du site EPLS.
      `.trim(),
    })

    if (error) {
      console.error('Erreur Resend:', error)
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error('Erreur API contact:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

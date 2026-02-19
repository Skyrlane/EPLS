# External Integrations

**Analysis Date:** 2026-02-19

## APIs & External Services

**AI & Language Models:**
- Anthropic Claude API - Chat and text generation
  - SDK: `@ai-sdk/anthropic`
  - Route: `src/app/api/anthropic/chat/route.ts`
  - Model: `claude-3-5-sonnet-20240620`
  - Env var: `NEXT_PUBLIC_ANTHROPIC_API_KEY`
  - Streaming support via Vercel AI SDK

- OpenAI - Chat and transcription
  - SDK: `@ai-sdk/openai` (chat), `openai` npm package (transcription)
  - Chat route: `src/app/api/openai/chat/route.ts`
  - Transcription route: `src/app/api/openai/transcribe/route.ts`
  - Models: `gpt-4o` (chat), `whisper-1` (speech-to-text)
  - Env var: `NEXT_PUBLIC_OPENAI_API_KEY`, `OPENAI_API_KEY`
  - Audio file processing: temporary file write in `tmp/` directory

**Image Generation:**
- Replicate - Image generation via Stable Diffusion
  - SDK: `replicate`
  - Route: `src/app/api/replicate/generate-image/route.ts`
  - Model: `stability-ai/stable-diffusion` (512x512, 50 steps)
  - Env var: `REPLICATE_API_TOKEN`
  - Configuration: 7.5 guidance scale, DPMSolverMultistep scheduler

**Speech Services:**
- Deepgram - Real-time transcription
  - SDK: `@deepgram/sdk`
  - Route: `src/app/api/deepgram/route.ts`
  - Env var: `DEEPGRAM_API_KEY`
  - Endpoint: Returns API key to client for frontend transcription

**Email Delivery:**
- Resend - Transactional email service
  - SDK: `resend`
  - Route: `app/api/contact/route.ts`
  - Env var: `RESEND_API_KEY`
  - From: `onboarding@resend.dev` (test domain)
  - Features: HTML + plaintext templates, reply-to functionality

**Content & Media:**
- YouTube - Embedded video content and metadata
  - Integration: `lib/youtube-utils.ts`
  - URL parsing and embed generation
  - Metadata fetching via YouTube Data API v3
  - Env var: `NEXT_PUBLIC_YOUTUBE_API_KEY` (optional - falls back to thumbnail)
  - API endpoint: `https://www.googleapis.com/youtube/v3/videos`
  - Thumbnail quality fallback: maxres → high → medium → default

## Data Storage

**Databases:**
- Firestore (Google Cloud) - Primary document database
  - Cloud provider: Firebase (epls-production project)
  - Location: europe-west3
  - Client: Firebase SDK `firebase` 10.13.0
  - Admin: Firebase Admin SDK 13.2.0
  - Configuration: `lib/firebase.ts`, `lib/firebase-admin.ts`, `firebase.json`
  - Collections: events, messages, articles, members, notifications, echos
  - Rules file: `firestore.rules`
  - Indexes file: `firestore.indexes.json`

**File Storage:**
- Firebase Storage - Media files (images, videos, documents)
  - Client: Firebase SDK `firebase`
  - Admin: Firebase Admin SDK
  - Access: `lib/firebase/storage.ts`
  - Hook: `hooks/use-storage.ts` for upload with progress tracking
  - URL patterns: `https://firebasestorage.googleapis.com/`, `https://*.firebasestorage.app`

**Spreadsheets & CMS:**
- Airtable - Article and content management
  - API: REST API v0
  - Tables:
    - "Articles Rédigés" (source articles): `tblBuFhvKR0W9D27R`
    - "Articles Publiés" (published): `tbl5gJPpg0Z6s6By0`
  - Base ID: `appSR5QciyUJsgoht`
  - Client: `lib/airtable-client.ts`
  - Env var: `NEXT_PUBLIC_AIRTABLE_API_KEY`, `NEXT_PUBLIC_AIRTABLE_BASE_ID`
  - Functions:
    - `getUnimportedArticles()` - Fetch from source table
    - `createPublishedArticle()` - POST to published table
    - `updatePublishedArticle()` - PATCH published table
    - `deletePublishedArticle()` - DELETE from published table

**Caching:**
- In-memory caching via Firebase Realtime features
- React Query concepts mentioned in CLAUDE.md but not implemented in dependencies

## Authentication & Identity

**Auth Provider:**
- Firebase Authentication (custom credentials)
  - Provider: Google Firebase
  - Methods: Email/password, social (configured via Firebase console)
  - Configuration: `lib/firebase.ts` (client), `lib/firebase-admin.ts` (server)
  - Hook: `hooks/use-firebase-auth.ts` with signIn, signUp, signOut, resetPassword, updateProfile
  - Context: `hooks/use-auth.ts` provides user, isAuthenticated, isLoading
  - Implementation: Custom error handling with mock fallback for missing credentials
  - Environment emulator support available (commented in code)

## Monitoring & Observability

**Error Tracking:**
- None detected - No Sentry, LogRocket, or similar service integrated

**Logs:**
- Console logging only (console.log, console.error)
- No centralized logging service detected

**Analytics:**
- Google Analytics support in Firebase config (`measurementId`)
  - Not actively used in codebase (no GA tracking events found)

## CI/CD & Deployment

**Hosting:**
- Vercel (implied by Next.js setup and edge runtime support)
  - Next.js 14 optimized
  - Edge functions supported

**CI Pipeline:**
- None detected - No GitHub Actions, GitLab CI, or similar

**Deployment Configuration:**
- Firebase: `firebase.json` specifies Firestore config for epls-production
- `.firebaserc`: Project default set to `epls-production`

## Environment Configuration

**Required env vars for full functionality:**

**Public (NEXT_PUBLIC_):**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)
- `NEXT_PUBLIC_AIRTABLE_API_KEY`
- `NEXT_PUBLIC_AIRTABLE_BASE_ID`
- `NEXT_PUBLIC_ANTHROPIC_API_KEY` (optional)
- `NEXT_PUBLIC_OPENAI_API_KEY` (optional)
- `NEXT_PUBLIC_YOUTUBE_API_KEY` (optional - video metadata)
- `NEXT_PUBLIC_SITE_URL` (default: https://epls.fr)

**Private (process.env):**
- `OPENAI_API_KEY` (server-side transcription)
- `DEEPGRAM_API_KEY` (speech-to-text)
- `REPLICATE_API_TOKEN` (image generation)
- `RESEND_API_KEY` (email delivery)
- `FIREBASE_PROJECT_ID` (admin SDK)
- `FIREBASE_CLIENT_EMAIL` (admin SDK)
- `FIREBASE_PRIVATE_KEY` (admin SDK - newline handling required)
- `FIREBASE_DATABASE_URL` (optional - admin SDK)
- `CONTACT_EMAIL` (email recipient, defaults to sam-dumay@outlook.com)

**Secrets location:**
- `.env.local` (development)
- `.env.example` (template)
- Environment variables injected by deployment platform (Vercel)

## Webhooks & Callbacks

**Incoming:**
- `app/api/contact/route.ts` - POST endpoint for contact form submissions
  - Validates via Zod schema
  - Sends email via Resend
  - Returns `{ success: true, id: data?.id }`

- `app/api/cron/publish-scheduled/route.ts` - Cron job endpoint (likely from Vercel)
  - Publishes scheduled articles
  - Synchronizes with Airtable

- `app/api/placeholder/route.ts` - Image placeholder generation

**Outgoing:**
- Firebase Firestore triggers (configured via rules, not code)
- No HTTP webhooks to external services detected

---

*Integration audit: 2026-02-19*

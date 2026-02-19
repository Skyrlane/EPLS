# Technology Stack

**Analysis Date:** 2026-02-19

## Languages

**Primary:**
- TypeScript 5.x - Full codebase (strict mode enabled)
- JavaScript - Build configuration and scripts

**Secondary:**
- HTML5 - Generated via React components
- CSS - Via Tailwind and PostCSS

## Runtime

**Environment:**
- Node.js (version not explicitly specified, uses current LTS)
- Edge Runtime - Supported for streaming AI routes (`src/app/api/anthropic/chat/route.ts`, `src/app/api/openai/chat/route.ts`)

**Package Manager:**
- npm - Default package manager
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 14.2.7 - App Router + React Server Components
  - Image optimization with `next/image`
  - Built-in API routes (`app/api/`)
  - Environment variable support (NEXT_PUBLIC_* and process.env)

**React:**
- React 18.x - UI framework
- React DOM 18.x - DOM rendering
- React Hook Form 7.55.0 - Form state management
- React Day Picker 9.11.1 - Date selection component

**UI Components:**
- Shadcn/UI (Radix UI based) - Pre-built accessible components
  - Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu, Label, Popover, Progress, Radio Group, Select, Separator, Switch, Tabs, Toast, Tooltip

**Styling:**
- Tailwind CSS 3.4.1 - Utility-first CSS framework
  - Dark mode support via class strategy
  - Custom theme variables (HSL colors, border radius)
  - Animation plugin support

**Animation:**
- Framer Motion 11.3.31 - Production animation library
- Tailwind Animate 1.0.7 - Tailwind animation utilities

**Testing:**
- Jest 29.7.0 - Test runner
  - jsdom environment for DOM testing
  - Module name mapping for path aliases
  - Code coverage collection enabled
- Testing Library React 16.3.0 - Component testing utilities
- Testing Library Jest DOM 6.6.3 - Custom matchers

**Build/Dev Tools:**
- PostCSS 8.x - CSS processing
- Babel 7.x - JavaScript transpilation (with module resolver plugin)
- tsx 4.20.6 - TypeScript execution for scripts

## Key Dependencies

**Critical:**
- Firebase 10.13.0 - Primary backend (Auth, Firestore, Storage)
  - See `lib/firebase.ts`, `lib/firebase-admin.ts` for initialization
  - Emulator support available for development
- Firebase Admin 13.2.0 - Server-side Firebase operations
- Zod - Schema validation (client and server)
- next-safe-action 7.10.5 - Server Action wrapper for validation

**AI & LLM Integration:**
- @ai-sdk/anthropic 0.0.48 - Anthropic Claude integration
- @ai-sdk/openai 0.0.54 - OpenAI integration (GPT-4o)
- ai 3.3.20 - Vercel AI SDK for streaming responses
- Replicate 0.32.0 - Image generation (Stable Diffusion)
  - Used in `src/app/api/replicate/generate-image/route.ts`

**Audio Processing:**
- @deepgram/sdk 3.6.0 - Speech-to-text via Deepgram API
  - Exposed via `src/app/api/deepgram/route.ts`
- OpenAI SDK - Audio transcription (Whisper)
  - Exposed via `src/app/api/openai/transcribe/route.ts`

**Email:**
- Resend 6.6.0 - Email delivery service
  - Contact form integration: `app/api/contact/route.ts`

**Content Processing:**
- React Markdown 9.0.1 - Markdown rendering
- Marked 17.0.0 - Markdown parsing
- Cheerio 1.1.2 - HTML parsing/manipulation
- DOMPurify 3.3.0 - XSS sanitization for user content

**Utilities:**
- date-fns 3.6.0 - Date manipulation
- Lucide React 0.436.0 - Icon library
- clsx 2.1.1 - Conditional className helper
- Tailwind Merge 3.2.0 - Resolve Tailwind conflicts
- Class Variance Authority 0.7.1 - Type-safe component variants
- React QR Code 2.0.15 - QR code generation
- Yet Another React Lightbox 3.25.0 - Image gallery/lightbox
- React Dropzone 14.3.8 - File drag-and-drop

**Theme Management:**
- next-themes 0.4.6 - Dark mode provider

## Configuration

**Environment:**
- TypeScript configuration: `tsconfig.json`
  - Strict mode enabled
  - Path alias: `@/*` → root directory
  - Target: ES2015
- Next.js config: `next.config.mjs`
  - Remote image patterns configured for Firebase, Replicate, Unsplash, YouTube, Airtable CDN
  - Image CSP policy for iframe sandboxing
  - API rewrites to OpenAI (legacy)
  - ESLint and TypeScript build errors ignored

**Build:**
- Jest configuration: `jest.config.js`
  - Module name mapper for CSS and image imports
  - Test environment: jsdom
  - Coverage collection for `components/`, `lib/`, `src/`
- Babel configuration: `babel.config.*`
  - Module resolver plugin for path aliases

**Key env variables required:**
- Firebase: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`
- Airtable: `NEXT_PUBLIC_AIRTABLE_API_KEY`, `NEXT_PUBLIC_AIRTABLE_BASE_ID`
- AI: `NEXT_PUBLIC_ANTHROPIC_API_KEY`, `NEXT_PUBLIC_OPENAI_API_KEY`
- Audio: `DEEPGRAM_API_KEY`, `OPENAI_API_KEY`
- Image Gen: `REPLICATE_API_TOKEN`
- Email: `RESEND_API_KEY`
- Site: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_YOUTUBE_API_KEY`
- Firebase Admin: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

## Platform Requirements

**Development:**
- Node.js 18+ (recommended)
- npm 8+
- Modern browser with ES2015 support
- Firebase emulators optional (see `lib/firebase.ts` line 98)

**Production:**
- Vercel (recommended for Next.js 14)
- Firebase project (cloud platform)
- External service API keys (Anthropic, OpenAI, Replicate, Deepgram, Resend, Airtable, YouTube API)

---

*Stack analysis: 2026-02-19*

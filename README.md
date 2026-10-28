# Sushin Bandha - AI Portfolio Site

[![Version](https://img.shields.io/badge/version-4.1.0-blue?style=for-the-badge)](./AGENTS.md)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://sushin-bandha.vercel.app)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?style=for-the-badge&logo=tailwind-css)

## Overview

A modern, AI-powered portfolio website showcasing technical expertise in AI, product management, and software engineering. Features a conversational RAG-backed chatbot for visitor engagement, production-ready security hardening, and responsive design with Tailwind CSS and Shadcn/UI components.

**Live Site:** [www.sushinbandha.com](https://www.sushinbandha.com)

## Key Features

- **AI-Powered Chatbot:** RAG (Retrieval-Augmented Generation) chatbot using Google Gemini with in-house embedding generation and vector search
- **Responsive Design:** Fully responsive across mobile, tablet, and desktop with dark/light theme support
- **Production Security:** HSTS headers, X-Frame-Options, CSP, Permissions-Policy, and strict build validation
- **Professional Portfolio Sections:**
  - Hero section with call-to-action
  - Featured projects and case studies
  - Professional experience and internships
  - Skills and technical expertise
  - Certifications
  - Contact form with email integration

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/ui component library
- **UI Components:** Radix UI primitives
- **Animations:** Framer Motion (scroll-triggered entrance animations, staggered children)
- **AI/ML:** Google Gemini 2.5 Flash-Lite + Vercel AI SDK
- **Utilities:** Lucide React icons, Date-fns, Zod validation
- **Deployment:** Vercel with Edge Functions and Analytics

## Project Structure

```
├── app/
│   ├── (deck)/              # Home page — the Flight Deck (own root layout, no Tailwind)
│   │   ├── layout.tsx       # Fonts, analytics, visit tracker
│   │   ├── page.tsx         # Renders deck-markup.html + content JSON from lib/*.ts
│   │   ├── deck-markup.html # Static markup: header, hero runway, section shells, AiRa, dialogs
│   │   └── deck.css         # Deck tokens, day/night panels, every section's styles
│   ├── (site)/              # Inner pages (Tailwind + React chatbot)
│   │   ├── layout.tsx
│   │   └── projects/preflight-briefer/
│   └── api/
│       ├── chat/            # RAG chatbot endpoint (AiRa on both layouts)
│       ├── contact/         # Contact form submission
│       ├── wx/              # Visitor's local weather for the sky
│       └── debug-ip/        # IP debugging utility
├── public/
│   └── flight-deck.js       # Deck runtime: sky + projected world, altimeter, sections, AiRa, keys
├── components/
│   ├── chatbot.tsx          # AiRa chatbot for the inner pages
│   └── ui/                  # Shadcn/ui primitives
├── lib/
│   ├── projects.ts          # Project data
│   ├── experience.ts        # Logbook entries
│   ├── education.ts         # Degree, highlights, coursework
│   ├── skills.ts            # Skill categories + narratives
│   ├── profile.ts           # Hero roles + interests
│   ├── site-metadata.ts     # Shared SEO metadata
│   ├── embeddings.json      # Pre-computed embeddings
│   ├── vector-search.ts     # Semantic search utilities
│   ├── utils.ts             # Helper functions
│   └── certifications.ts    # Certification data
├── scripts/
│   └── generate-embeddings.ts  # Embedding generation pipeline
├── public/
│   └── robots.txt           # Search engine indexing
├── middleware.ts            # IP whitelist (optional)
└── next.config.mjs          # Next.js configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add GOOGLE_GENERATIVE_AI_API_KEY, RESEND_API_KEY, DATABASE_URL

# Initialize database (run SQL in Neon console)
# See scripts/init-db.sql for the schema

# Generate embeddings (optional, for chatbot context)
pnpm build:embeddings
```

### Development

```bash
# Start dev server
pnpm dev

# Open browser to http://localhost:3000
```

### Build & Deploy

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Features in Detail

### Database Integration

Contact form submissions are automatically saved to a Neon PostgreSQL database with:
- Full contact details (name, email, subject, message)
- IP address tracking
- Geolocation data (country, region, city, coordinates)
- Timestamp for each submission

**Database Schema:** See `scripts/init-db.sql` for the table structure.

**Querying submissions:**
```sql
-- View all submissions
SELECT * FROM contact_submissions ORDER BY submitted_at DESC;

-- View summary (using the provided view)
SELECT * FROM contact_submissions_summary;

-- Filter by location
SELECT * FROM contact_submissions WHERE country = 'United States';
```

### RAG Chatbot

The portfolio includes an in-house built conversational assistant powered by Google Gemini:
- Embedding generation from portfolio documents
- Vector search for semantic matching
- Context-aware responses
- Rate limiting (10 requests/hour per session)
- Mobile-responsive UI

### Security Hardening

- **HSTS:** Enforces HTTPS with 2-year expiration
- **X-Frame-Options:** Prevents clickjacking
- **X-Content-Type-Options:** Disables MIME-type sniffing
- **Referrer-Policy:** Strict referrer controls
- **Permissions-Policy:** Restricts camera, microphone, geolocation
- **COOP/CORP:** Cross-origin security

## Environment Variables

Create `.env.local` with:

```
# Google Gemini API for chatbot
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here

# Resend API for contact form emails
RESEND_API_KEY=your_resend_key_here

# Neon PostgreSQL database for contact submissions
DATABASE_URL=postgresql://neondb_owner:password@host.neon.tech/neondb?sslmode=require

# Optional: IP whitelisting
IP_WHITELIST_ENABLED=false  # Set to 'true' to enable IP filtering
IP_WHITELIST=127.0.0.1      # Comma-separated IP list (if enabled)
```

## Deployment on Vercel

This site is optimized for Vercel deployment:

```bash
# Push to GitHub
git push

# Vercel auto-deploys on push to main branch
# View deployment: https://vercel.com/dashboard
```

## Scripts

- `pnpm dev` — Start development server
- `pnpm build` — Production build with strict checks
- `pnpm start` — Start production server
- `pnpm lint` — Run ESLint validation
- `pnpm build:embeddings` — Generate/update chatbot embeddings

## Content Management

### Projects

Update featured projects in `lib/projects.ts`:

```typescript
export const projects: Project[] = [
  {
    id: 1,
    title: "Project Title",
    description: "...",
    tags: ["Tech1", "Tech2"],
    image: "https://...",
    githubUrl: "", // Leave empty if not ready
    liveUrl: "", // Add when available
  },
  // ...
];
```

### Experience

Modify professional experience in `lib/experience.ts`. Update the `experiences` array with new internships, roles, or volunteer positions.

### Certifications

Edit `lib/certifications.ts` to add/update certifications and achievements.

## Changelog

### v4.1.0 - 2026-10-09
- Home page rebuilt from the approved v4 walk-through mock (Saira Condensed / Instrument Sans type, PFD hero, route nav with transponder, crew certificate, paper logbook, split-flap departures + boarding passes, ground-school syllabus, radar scope, patches/badges/passport stamps, COM radio contact, vitals-monitor dividers, AiRa First Officer, day/night panels, keyboard map).
- No aircraft: the hero is a centered runway 28 (threshold bars, numbers, PAPI, edge lights). Scrolling climbs from the runway to FL410 and the background keeps changing all the way down — a projected world (Indiana farmland grid, the Wabash, town lights after dusk), cloud decks you climb through, motion streaks, a darker sky and Earth curvature near the top.
- Sky follows the visitor's clock and `/api/wx` conditions; contact form posts to `/api/contact`; AiRa uses `/api/chat` with an offline fallback built from site content.
- Content stays resume-synced (v4.0.1 data in `lib/*.ts`): 25 credentials incl. NJ/IN EMT licenses and the Google AI Professional Certificate, Fall 2026 rotations, 60,000+ patrons. No AP credits, no email.
- Home page moved to its own root layout (`app/(deck)`), inner pages to `app/(site)`. Removed the v4.0 React flight components and the `three` dependency. Spoken announcements removed; sound is cockpit tones only.

### v4.0.1 - 2026-10-09
- Content synced to the updated resumes: 60,000+ patron events, Fall 2026 clinical rotations, NJ/IN EMT licenses, Google AI Professional Certificate, Golf Cart Safety (25 credentials), Scikit-learn for BASF, HCI and Database Systems coursework, languages. Downloadable resume and chatbot knowledge refreshed.

### v4.0.0 - 2026-10-09 (Major Release — "Flight Deck")
- Full redesign: the page is a flight plan. Scrolling climbs from KLAF through CREWS → LOGBK → GATES → GRNDS → RADAR → PATCH → CENTR, with a live altimeter and route strip in the header.
- Sky follows the visitor's local time and weather (`/api/wx`, Open-Meteo via Vercel IP geolocation, KLAF fallback); clouds sink below you as you climb.
- three.js high-wing trainer in the hero, banking with the pointer; horizon between first and last name; runway in perspective.
- Experience as a pilot logbook, projects as a split-flap departures board (animates only once fully in view) with boarding passes, skills on a radar scope, certifications as patches/passport stamps/wings — all 21 certs including AHA BLS.
- Contact form as a radio panel (no email shown anywhere), AiRa relabelled First Officer, transponder easter eggs (7700, 7600, 2027), plane cursor, keyboard shortcuts (`?`).
- AP credits removed from all copy. `X-Frame-Options` changed to `SAMEORIGIN` so certificate PDFs open in the in-page viewer.
- Removed legacy section components, ambient background, floating orbs, cursor system, tilt cards, theme toggle (site is dark-cockpit only).


### v3.3.0 - 2026-04-06
- **Universal CSS variable design token system**: `app/globals.css` is now the single source of truth for all colors. Added semantic tokens: `--surface-raised/overlay/input/hover/tag`, `--border-subtle/strong`, `--success/error/warning/info` (with `-foreground` and `-border` variants), and `--ai-glow/secondary/gradient-from/to` plus `--scrollbar-*` tokens.
- **Scrollbar**: Previously hardcoded hex values `#EDE8E3` and `#0F172A` now reference `hsl(var(--scrollbar-track))` — adapts automatically with the theme.
- **Glass utilities**: `glass-neural` and `glass-lab` no longer reference `#020617` or `bg-stone-100` — backgrounds and borders derive from `--background`, `--surface-overlay`, and `--border-subtle`.
- **Border utilities**: All `border-glow*` variants replaced hardcoded `border-stone-300 dark:border-slate-800` with `hsl(var(--border-subtle))`.
- **Text gradients**: `text-gradient-cyan` and `text-gradient-ai` now use `hsl(var(--foreground))` and `hsl(var(--primary))` instead of hardcoded slate/indigo hex.
- **Body overrides removed**: Duplicate `body.dark` / `body:not(.dark)` hex overrides removed — CSS variable layer (`bg-background`) handles this correctly.
- **tailwind.config.ts**: Added `surface-*`, `border-subtle/strong`, `success/error/warning/info`, and `ai-glow/ai-secondary` color entries pointing to CSS variables. Fixed `gradient-lab` to `#F5F3F0` (was wrong `#F8FAFC`).
- **16 components updated**: All hardcoded `slate-*`, `stone-*`, `gray-*` structural color classes replaced with semantic tokens. Status banners in projects use `bg-error` / `bg-warning`. Contact form alerts use `bg-success` / `bg-error`. Chatbot warning notice uses `bg-warning`. Input backgrounds use `bg-surface-input`. Hover states use `bg-surface-hover`. Skill/course/experience tags use `bg-surface-tag`. Borders use `border-border-subtle`. Mode toggle uses `border-border-subtle`. Digital-human and AI avatar inline rgba values replaced with `hsl()` notation using the same hue values as the CSS variables.

### v3.2.0 - 2026-04-06
- **Light theme neutral palette**: Replaced blue-tinted light theme with a warm, sophisticated "Warm Neutral Studio" palette — off-white backgrounds (`#F5F3F0`), warm stone borders, muted warm-gray text. All CSS variables, glass utilities, and border utilities updated for visual consistency.
- **Chatbot theme-awareness**: Chat panel now properly adapts to light and dark themes. Previously it was hardcoded to the dark glass style regardless of active theme. All border, background, and glass classes in the chatbot are now theme-aware using the established CSS variable system.

### v3.0.0 - 2026-04-02 (Major Release)
- **Section Reorder**: Restructured page flow to logical narrative order — Hero → About → Interests → Experience → Projects → Education → Skills → Certifications → Contact
- **Navbar**: Updated navigation link order to match new section sequence
- **Framer Motion Animations**: Added scroll-triggered entrance animations to all 7 non-hero sections using `whileInView` + `viewport={{ once: true }}`:
  - Section headings and subtitles fade+slide up on viewport entry
  - Cards and grid items stagger in sequence (`staggerChildren` 0.06–0.14s depending on density)
  - Experience timeline cards animate individually as user scrolls
  - Education section has multi-level stagger: card → list items → badges
  - Skills badges stagger with a subtle scale-in effect
- **TypeScript**: All Framer Motion variant objects explicitly typed as `Variants` to satisfy strict type checking
- **Build**: Verified `pnpm build` passes cleanly (12 static pages, 0 errors, 0 warnings)

## Future Enhancements

- [ ] GitHub repository links (coming soon)
- [ ] Live demo links for projects
- [ ] Blog/articles section
- [ ] Testimonials carousel
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features

## Contributing

This is a personal portfolio site. For feature requests or bug reports, use the in-site contact form.

## License

© 2026 Sushin Bandha. All rights reserved.

## Support

For issues or questions:
1. Check the [SECURITY.md](./SECURITY.md) file for security-related inquiries
2. Use the "Get In Touch" form on the site
3. Contact via GitHub issues
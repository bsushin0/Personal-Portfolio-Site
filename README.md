# Sushin Bandha - AI Portfolio Site

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
- **AI/ML:** Google Gemini 2.5 Flash-Lite + Vercel AI SDK
- **Utilities:** Lucide React icons, Date-fns, Zod validation
- **Deployment:** Vercel with Edge Functions and Analytics

## Project Structure

```
├── app/
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page
│   └── api/
│       ├── chat/            # RAG chatbot endpoint
│       ├── contact/         # Contact form submission
│       └── debug-ip/        # IP debugging utility
├── components/
│   ├── development-banner.tsx  # Active dev notice
│   ├── chatbot.tsx          # Conversational AI component
│   ├── hero.tsx             # Landing hero section
│   ├── projects.tsx         # Featured projects showcase
│   ├── experience.tsx       # Professional experience
│   ├── skills.tsx           # Technical skills
│   ├── certifications.tsx   # Educational certifications
│   ├── contact-form.tsx     # Get in touch form
│   ├── navbar.tsx           # Navigation bar
│   └── ui/                  # Shadcn/ui primitives
├── lib/
│   ├── projects.ts          # Project data
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

### Development Banner

Sticky banner visible on first load:
- Encourages user feedback and suggestions
- Links to contact form
- Dismissible by close button
- Stays on top of all elements (z-[60])

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

Modify professional experience in `components/experience.tsx`. Update the `experiences` array with new internships, roles, or volunteer positions.

### Certifications

Edit `lib/certifications.ts` to add/update certifications and achievements.

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
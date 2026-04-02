# AGENTS.md - Personal Portfolio Site

## Current Version: 2.1.4
**Last Updated**: 2026-04-02
**Status**: Active Development

## ⚠️ CRITICAL: Git Workflow
**NEVER PUSH TO MAIN.** All development work must go through the `Main-Dev` branch. The `main` branch is production and should only be updated via approved pull requests or manual merges by the repository owner. **ALWAYS ASK FOR EXPLICIT CONSENT EVERYTIME YOU PUSH TO REMOTE REPOSITORY.**
If owner ever simply says "push" then push all current changes to Main-Dev.

## Project Context
**Personal AI portfolio website** (www.sushinbandha.com) showcasing technical excellence in AI, product management, and software engineering. Maintained on **GitHub** (github.com/bsushin0/Personal-Portfolio-Site), deployed on **Vercel**. 

**Core Purpose:** Demonstrate deep technical knowledge, real-world project accomplishments, and strategic expertise through a polished, modern, interactive web experience that positions Sushin as a strong candidate for AI/ML, product, or software engineering roles.

**Live Site:** [www.sushinbandha.com](https://www.sushinbandha.com) | [sushin-bandha.vercel.app](https://sushin-bandha.vercel.app)

## Current State & Features (Production-Ready)
✅ **Core Portfolio**
- Professional hero section with Cyber-Human Android avatar
- Responsive design (mobile, tablet, desktop) with dark/light theme support
- Featured projects showcase with case studies
- Professional experience and internship timeline
- Technical skills inventory
- Certifications and educational credentials
- Contact form with email submission

✅ **AI-Powered Interaction**
- RAG chatbot using Google Gemini 2.5 Flash-Lite via Vercel AI SDK
- Pre-computed embeddings from curated markdown bio knowledge base
- Strict fact-based responses with 60% semantic similarity threshold
- Low-temperature (0.3) generation for deterministic, factual output
- Graceful degradation with contact form integration

✅ **Security & Production Hardening**
- HSTS headers, X-Frame-Options, CSP, Permissions-Policy
- Strict build validation and type checking
- Neon PostgreSQL integration with optional IP whitelist middleware
- Visit logging and analytics tracking
- Production-ready error handling

✅ **Analytics & Monitoring**
- Vercel Analytics integration
- Vercel Speed Insights
- Visit logging to database
- IP-based filtering (optional)

## Completed Work Log

### v2.1.4 - 2026-04-02
- **CSS**: Added `animate-pulse-glow` keyframe animation to globals.css (was used in chatbot.tsx but undefined)
- **Analytics**: Added `<Analytics />` from `@vercel/analytics/next` to app/layout.tsx
- **SEO**: Updated metadata title to "Sushin Bandha - AI Engineer & Product Manager"; rewrote description to reflect actual AI/PM focus
- **SEO**: Added OpenGraph and Twitter Card meta tags with `metadataBase` set to production URL
- **SEO**: Created `app/sitemap.ts` for search engine crawlers (generates `/sitemap.xml`)
- **Dead code**: Removed `components/holographic-bust.tsx` and `components/holographic-hero.tsx` (confirmed unused via grep)
- **Footer**: Fixed title from "AI & Cybersecurity Specialist" to "AI Engineer & Product Manager"
- **Skills**: Fixed section subtitle to say "product leadership" instead of "cybersecurity"
- **Navbar**: Added "About" (`#about`) and "Skills" (`#skills`) links
- **Certifications**: Removed broken image path (`/Data Handling Cert.png` — file not in public/) from Data Handling cert
- **Certifications**: Fixed EMT issuer from generic "EMT Certification" to "National Registry of Emergency Medical Technicians (NREMT)"

## Current Priorities & Focus Areas

### Active Development Areas
- **Chatbot Refinement** - Monitor responses, tune similarity thresholds, improve knowledge base structure
- **Content Freshness** - Keep bio files (private/documents/bio/) synchronized with latest accomplishments
- **Performance** - Monitor Core Web Vitals, optimize bundle size, ensure sub-2s load times
- **SEO & Discoverability** - Verify site indexing, optimize meta tags, improve search rankings

### Maintenance Tasks
- Rebuild embeddings (`pnpm build:embeddings`) after bio content updates
- Review chatbot logs for inaccurate or off-topic responses
- Update projects section with new accomplishments
- Monitor security advisories and keep dependencies current

### Known Limitations
- No automated test suite (portfolio site with manual visual validation)
- Embeddings rebuild requires manual triggering (not automated on deploy)
- Chatbot knowledge limited to curated bio files (intentional design for accuracy)
- Certification images missing from public/ (Data Handling cert image not uploaded; EMT has no image)
- Navbar has 8 items which may overflow on smaller desktop screens

### Next Steps (Prioritized)
1. **[PATCH]** Add certification images to public/ or remove image display from certifications UI if not available
2. **[COMPONENT]** Collapse navbar items on medium breakpoints or implement a dropdown for overflow prevention
3. **[COMPONENT]** Add `og:image` social preview image to public/ and reference in OpenGraph/Twitter metadata
4. **[PATCH]** Audit all `#` placeholder `credentialUrl` values in certifications — add real links or remove button
5. **[COMPONENT]** Add structured data (JSON-LD) for Person schema to improve SEO rich results
6. **[PATCH]** Replace Shield icon with a more appropriate icon for "Product & Leadership" skills category

## Chat Agent Guidance
This portfolio includes a retrieval-augmented chatbot designed to accurately represent Sushin Bandha. The chatbot uses curated markdown bio files as its primary knowledge source and follows strict rules to prevent hallucination.

### Knowledge Base Structure
The chatbot's knowledge comes exclusively from curated markdown files in `private/documents/bio/`:
- `01-profile.md` - Professional summary and value proposition
- `02-experience.md` - Work history, internships, and roles
- `03-projects.md` - Technical projects and accomplishments
- `04-skills.md` - Technical skills and competencies
- `05-certifications.md` - Certifications and credentials
- `06-education.md` - Academic background
- `07-hobbies-interests.md` - Personal interests and activities
- `08-goals.md` - Career goals and aspirations (specific metrics and timelines)
- `09-contact.md` - Contact information and preferences

### Core Principles
- **Fact-Based Only**: Answer ONLY from the markdown bio files. No speculation or assumptions.
- **Logical Inferences**: Make inferences only when necessarily true from known facts.
  - ✅ GOOD: "Since Sushin interned at PSEG building ML models, he has Python and ML framework experience"
  - ❌ BAD: "Sushin probably knows TensorFlow" (not stated, not necessarily true)
- **Confidence Threshold**: Require 60%+ semantic similarity for confident answers.
- **Graceful Degradation**: If below threshold or no relevant context, say: "I don't have specific information about that. Would you like to use the contact form to ask Sushin directly?"
- **No Hallucination**: Never invent facts, job titles, dates, project details, or technical skills.

### Retrieval Strategy
- Generate query embedding using Google `text-embedding-004`
- Search pre-computed embeddings from markdown bio chunks
- Filter results with minimum 60% cosine similarity
- Return top 5 relevant chunks as context
- Use low temperature (0.3) for factual, deterministic responses

### Contact Form Integration
If user wants to connect with Sushin, collect:
1. Name
2. Email address
3. Company/organization
4. Brief message

Once all four are provided, offer to submit via contact form.

### Positioning Strategy
- Highlight AI/ML engineering expertise with real project examples
- Showcase product management experience and business acumen
- Emphasize software engineering rigor and operational excellence
- Reference specific accomplishments from context (e.g., "During PSEG internship..." or "In the BASF project...")
- Position as strong candidate for AI/ML, product, or software engineering roles

### Response Style
- Professional but conversational tone
- Concise (2-4 short paragraphs maximum)
- Cite sources naturally without formal citations
- Decline off-topic questions politely and offer contact form

### Maintenance Checklist
- Keep curated markdown bios in `private/documents/bio/` up-to-date
- Re-run `pnpm run build:embeddings` after content changes
- Verify retrieval quality and tune similarity thresholds if needed
- Periodically review chatbot responses for accuracy and tone
- Monitor for hallucination or off-topic responses

## Build & Commands
- **Build**: `pnpm build` - Compile Next.js app for production
- **Dev**: `pnpm dev` - Local development server (localhost:3000)
- **Lint**: `pnpm lint` - Run ESLint validation
- **Embeddings**: `pnpm run build:embeddings` - Generate/refresh vector embeddings from bio markdown files
- **DB Init**: `pnpm run db:init` - Initialize PostgreSQL schema (Neon)
- **Start**: `pnpm start` - Run production build (post-`pnpm build`)
- **No automated tests** - Portfolio site with visual/manual validation

## Architecture
**Next.js 15** App Router (TypeScript) + **Tailwind** + **Shadcn/ui** components + **Radix UI**.
- `app/` - Layout, page routes
- `components/` - Reusable section components (hero, projects, experience, etc.)
- `components/ui/` - Shadcn/ui primitive components (button, input, etc.)
- `lib/` - Utilities (theme, utils, vector search, document processing)
- `hooks/` - Custom React hooks
- `public/` - Static assets
- `private/documents/bio/` - Curated markdown knowledge base (not deployed)

## Code Style
- **Imports**: Use `@/*` path aliases (e.g., `@/components/ui/button`)
- **Components**: Functional with `"use client"` for interactivity
- **Styling**: Tailwind classes + `cn()` utility for conditional classes
- **Types**: Strict TypeScript; use interface for component props
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Exports**: Use `export default` for components, named for utilities
- **Dark mode**: Prefix with `dark:` for dark theme overrides
- **Error handling**: Components fail gracefully; no error boundaries needed for portfolio

## Digital Human (Cyber-Human Android)
The Hero section features a "Cyber-Human Android" avatar component that transforms a standard profile photo into a futuristic AI interface.

### Component Location
- **File**: `components/digital-human.tsx`
- **Used in**: `components/hero.tsx`
- **Image asset**: `public/avatar-portrait.jpg` (required)

### Visual Features
- **Metallic Re-Skin**: CSS filters (`grayscale(30%) contrast(1.15) brightness(0.95)`) transform the photo to look like a high-end android
- **Slate Tint Overlay**: `bg-slate-900/40 mix-blend-hard-light` adds cool metallic blue tint
- **Purple Power Core**: Glowing indigo blur in the chest/tie area with `mix-blend-overlay animate-pulse`
- **Cyber Eyes**: Cyan glowing dots that track cursor movement with inverse parallax
- **HUD Scanner Interface**: Status badge ("SYSTEM ONLINE"), facial target frame, animated scan line

### Interactive Features
- **Mouse Tracking**: 3D parallax tilt effect (max ±5°) using `perspective(1000px) rotateX/rotateY`
- **Breathing Animation**: Subtle `scale(1.02) translateY(-5px)` loop via `animate-breathe`
- **Scan Line**: Animated line sweeps top-to-bottom via `animate-scan-fast`

### Tailwind Animations (in `tailwind.config.ts`)
```ts
keyframes: {
  breathe: {
    "0%, 100%": { transform: "scale(1) translateY(0)" },
    "50%": { transform: "scale(1.02) translateY(-5px)" },
  },
  scan: {
    "0%": { top: "0%", opacity: "0" },
    "50%": { opacity: "1" },
    "100%": { top: "100%", opacity: "0" },
  },
}
animation: {
  breathe: "breathe 6s ease-in-out infinite",
  "scan-fast": "scan 3s linear infinite",
}
```

### Customization Notes
- Eye position: `top-[36%] left-[34%]` / `right-[34%]` — adjust if face position changes
- Power core position: `bottom-[20%]` — adjust based on portrait framing
- Tilt sensitivity: Modify the `* 5` multiplier in rotation calculations
- `framer-motion` is installed but currently unused (available for future enhancements)

### Legacy Components (Deleted)
- `components/holographic-bust.tsx` — Removed in v2.1.4 (was unused SVG-based avatar)
- `components/holographic-hero.tsx` — Removed in v2.1.4 (was unused hero variant)

## Strategic Direction & Project Goals

### Vision
Present Sushin as a **full-stack AI/ML engineer** with **product acumen** and **operational excellence**. The portfolio is both a polished resume and a working demonstration of technical capability in web development, AI systems, and infrastructure.

### Core Positioning
1. **AI/ML Engineering** - Real projects with tangible impact (PSEG ML, BASF optimization, etc.)
2. **Product Thinking** - Business impact, user feedback, iteration discipline
3. **Software Engineering** - Shipping production systems, security, scalability
4. **Technical Depth** - TypeScript, embeddings, RAG systems, databases, deployment

### Key Goals
- **Engagement**: RAG chatbot demonstrates conversational AI implementation and knowledge management
- **Credibility**: Case studies and project details prove real-world execution
- **Discoverability**: SEO-optimized, fast-loading, mobile-responsive for recruiter/interviewer experience
- **Authenticity**: Strict fact-based chatbot prevents misinformation; positions Sushin as honest communicator
- **Scalability**: Production-hardened infrastructure ready for high traffic (Vercel + Neon)

### Content Strategy
- Keep curated markdown bios (`private/documents/bio/`) current and aligned with career narrative
- Refresh embeddings (`pnpm build:embeddings`) whenever bio content changes
- Iterate chatbot responses based on user feedback (monitor tone, accuracy, helpfulness)
- Add case study depth to projects section as new accomplishments emerge
- Periodically audit analytics to understand visitor behavior and optimize information architecture

## Operational Guidance
- Do **not** push or commit unless explicitly authorized. If authorization to commit is given, use professional, comprehensive commit messages that summarize the changes and rationale.
- By default, apply requested changes locally and await explicit commit/push approval.

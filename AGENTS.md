# AGENTS.md - Personal Portfolio Site

## Current Version: 3.2.0
**Last Updated**: 2026-04-06
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

### v3.2.0 - 2026-04-06 (COMPONENT)
- **Light theme neutral palette**: Replaced blue-tinted "Clean Lab" light theme with a warm, sophisticated "Warm Neutral Studio" palette. `:root` CSS variables updated: background (`34 20% 95%`), foreground (`20 14% 11%`), card/popover (`36 25% 97%`), secondary/muted/border/input all shifted to warm stone/amber tones. Body background changed from `#F8FAFC` to `#F5F3F0`. Scrollbar track updated from `#F8FAFC` to `#EDE8E3`.
- **Light theme glass utilities**: `glass-lab` and `glass-lab-sm` updated from `bg-white/70 border-slate-200/70` to `bg-stone-100/70 border-stone-300/60` for visual consistency with warm palette.
- **Light theme border utilities**: `border-glow`, `border-glow-lg`, `border-glow-purple`, `border-glow-purple-lg` light-mode values updated from `border-slate-200` to `border-stone-300`.
- **Chatbot theme-awareness**: Chat panel was hardcoding `glass-dark` (the dark-only glass style), rendering the panel with near-black background regardless of active theme. Changed to `glass-effect` which adapts light vs dark automatically. All inline border references inside the chatbot panel (`border-slate-200`) updated to `border-stone-300` (light) with `dark:border-slate-800` preserved. Input field background updated from `bg-white/70` to `bg-stone-50/70` in light mode. Assistant message bubbles and loading indicator container updated to match.
- **Build**: Verified `pnpm build` passes cleanly (13 static pages, 0 errors, 0 warnings).

### v3.0.0 - 2026-04-02 (MAJOR)
- **Section Reorder**: Restructured `app/page.tsx` section order to match logical narrative flow: Hero → About → Interests → Experience → Projects → Education → Skills → Certifications → Contact (previously Education appeared between Experience and Skills, Projects appeared after Education)
- **Navbar**: Updated `navItems` array in `components/navbar.tsx` to match new page order — Projects now appears before Education in the nav list
- **Framer Motion — About**: Added `"use client"` directive, imported `motion` + `Variants`; heading fades up on scroll (`whileInView`), highlight cards stagger in with `containerVariants` + `staggerChildren: 0.12`
- **Framer Motion — Interests**: Added `"use client"`, scroll-triggered heading fade + 3-card staggered entrance
- **Framer Motion — Experience**: Added `"use client"`, heading fade, each timeline card animates in individually with `whileInView viewport={{ once: true, amount: 0.2 }}` — prevents overly-eager trigger for tall cards
- **Framer Motion — Projects**: Extended existing `"use client"` with heading fade + `staggerChildren: 0.14` on the project card grid
- **Framer Motion — Education**: Added `"use client"`, heading fade, degree header card fades up, Programs & Highlights list items stagger with `x: -16` slide, Coursework badges stagger with scale-in animation
- **Framer Motion — Skills**: Added `"use client"`, heading fade, category cards stagger in, skill badges inside each card also stagger with scale animation
- **Framer Motion — Certifications**: Added `"use client"`, heading fade + certification cards stagger in
- **Framer Motion — Contact**: Extended existing `"use client"` with heading fade and form section fade-up with slight delay
- **TypeScript**: All `Variants` objects explicitly typed as `Variants` from framer-motion to satisfy strict type checker (`ease: "easeOut"` requires the framer-motion `Easing` type, not `string`)
- **Build**: Verified `pnpm build` passes cleanly (12 static pages, 0 errors, 0 warnings)

### v2.3.0 - 2026-04-02
- **Content**: Enriched About bio from a single generic paragraph to two substantive paragraphs covering: CS/AI major at Purdue, private pilot license pursuit, EMT certification goal, 27 AP transfer credits, Data Mine participation, ACERIAS seminar, two summers at PSEG (IAM ownership, 300+ UAT/SIT cases, 25-person team lead), BASF 92%-accurate ML forecasting system, and aerospace/national security focus
- **Content**: Expanded About highlight cards from thin one-line descriptions to substantive bullets covering real accomplishments per category — Education, Product & ML, Security, Leadership
- **Component**: Created `components/education.tsx` — dedicated Education section with degree header card (institution, dates, GPA, academic standing), Programs & Highlights panel (Data Mine, ACERIAS, upward GPA trend 2.66→3.28, 27 AP credits), and Relevant Coursework badge grid (10 core courses + footer note for additional courses including ongoing aviation coursework)
- **Page**: Added `Education` component to `app/page.tsx`, inserted after Experience in the page flow
- **Navbar**: Added "Education" → `#education` link to desktop and mobile navs, positioned after Experience
- **Build**: Verified `pnpm build` passes cleanly (12 static pages generated, 0 errors, 0 warnings)

### v2.2.0 - 2026-04-02
- **Assets**: Created `public/project-banners/wine-forecasting.svg` — dark-theme SVG banner for the Wine Varietals Yield Forecasting project featuring a wine glass silhouette, bar/line forecast chart with Q1–Q4 data points, accuracy badge (92%), and MLOps pipeline label; color palette uses wine/magenta/violet tones matching portfolio dark aesthetic
- **Assets**: Created `public/project-banners/project-aira.svg` — dark-theme SVG banner for Project AiRa featuring a full RAG pipeline diagram (Query → Embedding → Vector Search → LLM → Response), a code editor window showing `aira_rag.py`, feature pills for In-House Embed / Vector Search / Anti-Hallucination / Production-Grade; color palette uses cyan/indigo/violet tones
- **Data**: Updated `lib/projects.ts` — replaced `placehold.co` external image URLs for Wine Forecasting and Project AiRa with local `/project-banners/wine-forecasting.svg` and `/project-banners/project-aira.svg` paths; all three projects now use self-hosted SVG banners with no external image dependencies
- **Build**: Verified `pnpm build` passes cleanly (12 static pages generated, 0 errors, 0 warnings)

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

## Versioning Criteria (Semantic Versioning)

| Bump | When to use | Examples |
|------|-------------|---------|
| **PATCH** `x.y.z` | Small fixes, content corrections, removing dead code, minor CSS/copy tweaks, dependency updates | CSS keyframe fix, analytics tag, SEO meta, dead component removal |
| **MINOR** `x.y.0` | New components, significant content additions, new assets, new features, meaningful UI improvements | New SVG banners, enriched About content, new Education component |
| **MAJOR** `x.0.0` | Large-scale restructuring, cross-cutting changes across many components, architectural shifts | Full section reorder + Framer Motion across all sections |

The "Next Steps" section uses `[PATCH]` and `[COMPONENT]` tags to pre-label upcoming work by bump level. Always update `## Current Version` and `**Last Updated**` at the top of this file when bumping.

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
- Navbar has 9 items which may overflow on smaller desktop screens — hamburger/dropdown menu on medium breakpoints is the planned fix
- Framer Motion animations use `whileInView` + `once: true` — no reduced-motion preference check yet (a11y improvement opportunity)

### Next Steps (Prioritized)
1. **[COMPONENT]** Collapse navbar into a dropdown/hamburger menu on medium breakpoints to handle the 9-item overflow (now more urgent given navbar growth)
3. **[PATCH]** Add certification images to public/ or remove image display from certifications UI if not available
4. **[COMPONENT]** Add `og:image` social preview image to public/ and reference in OpenGraph/Twitter metadata
5. **[PATCH]** Audit all `#` placeholder `credentialUrl` values in certifications — add real links or remove button
6. **[COMPONENT]** Add structured data (JSON-LD) for Person schema to improve SEO rich results
7. **[PATCH]** Replace Shield icon with a more appropriate icon for "Product & Leadership" skills category
8. **[COMPONENT]** Investigate and add project detail/modal views for projects — clicking a card could expand to show full case study content

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
- `framer-motion` is now actively used across all major sections for scroll-triggered entrance animations

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

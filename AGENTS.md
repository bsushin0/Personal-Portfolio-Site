# AGENTS.md - Personal Portfolio Site

## ⚠️ CRITICAL: Git Workflow
**NEVER PUSH TO MAIN.** All development work must go through the `Main-Dev` branch. The `main` branch is production and should only be updated via approved pull requests or manual merges by the repository owner. **ALWAYS ASK FOR EXPLICIT CONSENT EVERYTIME YOU PUSH TO REMOTE REPOSITORY.**

## Project Context
**Personal portfolio website** showcasing excellence in AI. Maintained on **GitHub** (github.com/bsushin0/Personal-Portfolio-Site), deployed on **Vercel**. Purpose: demonstrate deep technical knowledge, project accomplishments, and expertise in CS/AI through a polished, modern web experience.

## Latest Improvements
- Conversational portfolio chatbot powered by embeddings-backed vector search
- Strict fact-based responses with logical inference rules (60% similarity threshold)
- Curated markdown bio files as primary knowledge base
- Document processing pipeline prioritizing markdown over PDFs
- Low-temperature (0.3) generation for deterministic, factual responses

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
- **Build**: `pnpm build`
- **Dev**: `pnpm dev` (localhost:3000)
- **Lint**: `pnpm lint`
- **Embeddings**: `pnpm run build:embeddings`
- **No tests** - This is a static portfolio site

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

## Strategic Direction
Build an AI-first portfolio that demonstrates engineering rigor and product polish. Keep content authoritative and current via automated embedding refresh, pair strong storytelling with interactive chat UX, and highlight CS/AI depth alongside shipped, real-world projects.

## Operational Guidance
- Do **not** push or commit unless explicitly authorized. If authorization to commit is given, use professional, comprehensive commit messages that summarize the changes and rationale.
- By default, apply requested changes locally and await explicit commit/push approval.

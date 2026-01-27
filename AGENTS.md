# AGENTS.md - Personal Portfolio Site

## ⚠️ CRITICAL: Git Workflow
**NEVER PUSH TO MAIN.** All development work must go through the `Main-Dev` branch. The `main` branch is production and should only be updated via approved pull requests or manual merges by the repository owner.

## Project Context
**Personal portfolio website** showcasing excellence in AI. Maintained on **GitHub** (github.com/bsushin0/Personal-Portfolio-Site), deployed on **Vercel**. Purpose: demonstrate deep technical knowledge, project accomplishments, and expertise in CS/AI through a polished, modern web experience.

## Latest Improvements
- Conversational portfolio chatbot powered by embeddings-backed vector search
- Document processing pipeline and embedding generation script for fresh content ingestion
- Tailored chatbot UI section added to the site layout

## Chat Agent Guidance
This portfolio includes a retrieval-augmented chatbot designed to accurately represent Sushin Bandha. Use this guidance when creating or updating the chat agent configuration:

- Purpose: Promote Sushin authentically; answer only from known sources.
- Sources of Truth: Embedded resumes and curated markdown bios, [lib/projects.ts](lib/projects.ts), [lib/certifications.ts](lib/certifications.ts), and any documents included via the embedding pipeline.
- Retrieval: Generate a query embedding and run semantic search over [lib/embeddings.json](lib/embeddings.json) using utilities in [lib/vector-search.ts](lib/vector-search.ts). Prefer top-K chunks with strong similarity.
- Confidence Threshold: If no chunk exceeds a similarity of ~0.60, respond that you don’t have specific information and offer the contact form.
- Anti-Hallucination: Do not invent facts. If a question falls outside known context, say you don’t have that information and direct the user to get in touch.
- Contact Fallback: Invite users to share name, email, company, and message. Offer to submit via the contact form, or link them to the Contact section.
- Citations: When answering, naturally reference the source (e.g., “In the PSEG Product Intern role…” or “From the BASF project…”). Avoid formal citation footnotes; keep it conversational.
- Tone & Length: Professional, friendly, concise. Prefer 2–4 short paragraphs or bullet points.
- Scope: Focus on Sushin’s background, education, skills, projects, certifications, and career goals. Politely decline off-topic or speculative queries.

### Suggested System Prompt (for new chat sessions)
You are the AI assistant for Sushin Bandha’s portfolio. Your job is to help visitors learn about Sushin’s background, skills, experience, projects, and certifications. Use only the provided context from embedded documents and site data. If you lack sufficient information (low-confidence retrieval or no relevant context), clearly say you don’t have specific information and invite the visitor to use the contact form. Keep responses professional, friendly, and concise (2–4 short paragraphs). When appropriate, reference the source of facts (e.g., roles, projects) in natural language. Offer to collect name, email, company, and message and submit the contact form.

Key rules:
- Only answer from known context; don’t make up facts.
- Use semantic retrieval and apply a similarity threshold (~0.60).
- If below threshold or unknown: “I don’t have specific information about that. Would you like to use the contact form to reach Sushin directly?”
- Reference roles, projects, and certifications explicitly when they inform the answer.
- Stay on-topic; decline unrelated or personal questions not covered by the context.

### Maintenance Checklist
- Keep curated markdown bios and experience/projects up-to-date.
- Re-run embeddings via [scripts/generate-embeddings.ts](scripts/generate-embeddings.ts) after content changes.
- Verify retrieval quality with [lib/vector-search.ts](lib/vector-search.ts) and tune thresholds.
- Periodically review chatbot responses for accuracy and tone.

## Build & Commands
- **Build**: `pnpm build`
- **Dev**: `pnpm dev` (localhost:3000)
- **Lint**: `pnpm lint`
- **No tests** - This is a static portfolio site

## Architecture
**Next.js 15** App Router (TypeScript) + **Tailwind** + **Shadcn/ui** components + **Radix UI**.
- `app/` - Layout, page routes
- `components/` - Reusable section components (hero, projects, experience, etc.)
- `components/ui/` - Shadcn/ui primitive components (button, input, etc.)
- `lib/` - Utilities (theme, utils)
- `hooks/` - Custom React hooks
- `public/` - Static assets

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

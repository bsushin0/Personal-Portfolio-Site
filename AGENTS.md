# AGENTS.md - Personal Portfolio Site

## Project Context
**Personal portfolio website** showcasing excellence in Computer Science and AI systems. Maintained on **GitHub** (github.com/bsushin0/Personal-Portfolio-Site), deployed on **Vercel**. Purpose: demonstrate deep technical knowledge, project accomplishments, and expertise in CS/AI through a polished, modern web experience.

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
Build with polished UX/design to reflect excellence in engineering. Showcase CS fundamentals, AI/ML knowledge, and scalable system design through visual presentation and content quality.

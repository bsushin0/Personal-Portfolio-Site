---
name: CSS variable design token system
description: globals.css is the single source of truth for all palette values; new semantic tokens and their Tailwind equivalents as of v3.3.0
type: project
---

As of v3.3.0 the design token system is fully established. `app/globals.css` `:root` and `.dark` blocks define all color values. `tailwind.config.ts` exposes these as Tailwind utility classes.

**New tokens added in v3.3.0** (both `:root` and `.dark`):
- Surface: `--surface-raised`, `--surface-overlay`, `--surface-input`, `--surface-hover`, `--surface-tag`
- Borders: `--border-subtle`, `--border-strong`
- Status: `--success`, `--success-foreground`, `--success-border`, `--error`, `--error-foreground`, `--error-border`, `--warning`, `--warning-foreground`, `--warning-border`, `--info`, `--info-foreground`
- AI accent: `--ai-glow` (cyan 188°), `--ai-secondary` (purple 278°), `--ai-gradient-from`, `--ai-gradient-to`
- Scrollbar: `--scrollbar-track`, `--scrollbar-thumb`, `--scrollbar-thumb-hover`

**Tailwind class equivalents** (use these in components):
- `bg-surface-input` / `bg-surface-hover/70` / `bg-surface-tag`
- `border-border-subtle` / `border-border-subtle/80`
- `bg-success/10`, `text-success`, `border-success-border/30` (same pattern for error/warning)
- `bg-ai-glow`, `text-ai-glow`, `border-ai-glow/20`
- `bg-warning/10`, `text-warning`, `border-warning-border/40`

**Conventions established**:
- Never use bare `slate-*`, `stone-*`, or `gray-*` for structural/neutral colors in components
- Status colors (success/error/warning) are acceptable as semantic tokens, not raw green/red/yellow
- For JS-driven dynamic inline styles (ai-avatar, digital-human) use `hsl(188 100% 50% / alpha)` syntax with the channel values matching the CSS variable definition — not raw rgba()
- Glass utilities (`glass-neural`, `glass-lab`, `glass-effect`) fully derive from CSS variables; do not hardcode colors inside them

**Why:** Centralized palette means theme changes only require editing globals.css.
**How to apply:** Any new component writing color classes should consult this token list first before reaching for raw Tailwind palette classes.

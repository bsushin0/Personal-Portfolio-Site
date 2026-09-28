---
name: Framer Motion animation pattern
description: How scroll animations are implemented in this portfolio — Variants typing requirement, whileInView pattern, and animation conventions
type: project
---

Framer Motion v12 is installed and actively used across all major sections as of v3.0.0.

**Why:** Established in v3.0.0 major release to add scroll-triggered entrance animations to all non-hero sections.

**How to apply:**
- Always import `type Variants` from `framer-motion` and type variant objects explicitly (`const x: Variants = {...}`) — TypeScript strict mode rejects plain objects because `ease: "easeOut"` resolves to `string` instead of the `Easing` type.
- Use `whileInView` + `viewport={{ once: true }}` so animations play only once.
- Section headings use `amount: 0.3`; card grids use `amount: 0.1`–`0.15` (lower threshold) so they trigger before the user has scrolled past them.
- Individual tall cards (Experience timeline) use `amount: 0.2` on each card individually rather than on the container.
- Stagger delays: badges = 0.05–0.06s, cards = 0.12–0.14s.
- Hero section intentionally has NO animations — it loads immediately.
- All animated components must have `"use client"` directive.

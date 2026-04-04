# 🎨 Quick Reference: Sophisticated AI Lab Theme

## Color Palette (Copy-Paste Ready)

### Primary Colors
```css
--primary-accent: #6366F1;          /* Indigo - All buttons, links, accents */
--dark-bg: #020617;                 /* Deep Slate - Dark mode background */
--dark-surface: #0F172A;            /* Slate Blue - Dark mode cards */
--light-bg: #F8FAFC;                /* Ghost White - Light mode background */
--light-surface: #FFFFFF;           /* Clean White - Light mode cards */
```

### Text Colors
```css
--dark-mode-text: #F1F5F9;          /* Light Slate - Dark mode body text */
--light-mode-text: #0F172A;         /* Deep Slate - Light mode body text */
```

### Border Colors
```css
--light-border: #E2E8F0;            /* Slate 200 - Light mode borders */
--dark-border: #1E293B;             /* Slate 800 - Dark mode borders */
```

---

## Common Tailwind Classes

### Text Colors
```tsx
// Primary text
className="text-foreground"                    /* Auto-adapts to light/dark */

// Muted text (secondary)
className="text-foreground/70"                 /* 70% opacity */

// Dimmed text (tertiary)
className="text-foreground/60"                 /* 60% opacity */

// Accent (Indigo)
className="text-primary"                       /* #6366F1 */
```

### Backgrounds
```tsx
// Card/surface
className="bg-background"                      /* Solid foreground color */

// Button primary
className="bg-primary text-primary-foreground" /* Indigo button */

// Light hover
className="hover:bg-slate-100/70 dark:hover:bg-slate-900/40"
```

### Borders
```tsx
// Standard border
className="border border-slate-200 dark:border-slate-800"

// Subtle border (muted)
className="border border-slate-200/80 dark:border-slate-800/80"

// With glass effect
className="glass-effect border-glow"           /* Uses subtle slate border */
```

### Shadows
```tsx
// Soft shadow (light mode cards)
className="shadow-[0_20px_50px_rgba(0,0,0,0.05)]"

// Glass effect
className="backdrop-blur-md bg-background/70 border border-slate-200/70 dark:border-slate-800/70"

// Indigo glow (accent only)
className="shadow-lg shadow-indigo-500/15"     /* Subtle indigo shadow */
```

---

## Component Templates

### Button (Primary)
```tsx
<Button>
  Click Me
</Button>
/* Auto-applies: bg-primary hover:bg-primary/90 */
```

### Button (Secondary)
```tsx
<Button variant="outline">
  Secondary
</Button>
/* Auto-applies: border-slate-200 dark:border-slate-800 */
```

### Card
```tsx
<Card className="glass-effect-sm border-glow">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
/* Auto-applies: soft borders, refined glass effect */
```

### Section Heading
```tsx
<h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
  Section Title
</h2>
/* Auto-applies: solid foreground color, tight tracking, spacing */
```

### Icon Badge
```tsx
<div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
  <Icon />
</div>
/* Indigo accent badge with subtle styling */
```

### Form Input
```tsx
<Input
  placeholder="Enter text..."
  className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 focus:border-indigo-500"
/>
```

### Glass Effect (Navbar)
```tsx
<nav className="backdrop-blur-md bg-background/70 border-b border-slate-200/70 dark:border-slate-800/70">
  {/* Content */}
</nav>
```

---

## Spacing Guide

### Padding
```tsx
/* Standard padding */
className="p-4"      /* 16px */
className="p-6"      /* 24px */

/* Vertical padding */
className="py-20"    /* 80px top/bottom */
className="py-12"    /* 48px top/bottom */
```

### Gaps
```tsx
/* Standard gap */
className="gap-4"    /* 16px */
className="gap-6"    /* 24px */

/* Large gap (breathing room) */
className="gap-8"    /* 32px */
className="gap-12"   /* 48px */
```

### Margins
```tsx
/* Heading spacing */
className="mb-4"     /* 16px margin bottom */
className="mb-6"     /* 24px margin bottom */
className="mb-16"    /* 64px margin bottom */
```

---

## Dark/Light Mode Classes

### Conditional Colors
```tsx
/* Text that changes based on mode */
className="text-slate-900 dark:text-slate-50"

/* Background that changes */
className="bg-white dark:bg-slate-900"

/* Border that changes */
className="border-slate-200 dark:border-slate-800"
```

### Testing in Dev
```bash
# Light mode preview
Open DevTools → Settings → Emulate CSS media → prefers-color-scheme: light

# Dark mode preview
Open DevTools → Settings → Emulate CSS media → prefers-color-scheme: dark
```

---

## Color Not in Palette?

### When to Add Color
✅ **Use case**: Special status indicators (error, warning, success)  
❌ **Don't use**: Just for visual variety

### How to Do It Right
```tsx
/* Error state - use red, but subtly */
className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"

/* Success state - use green */
className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"

/* Warning state - use yellow */
className="text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30"
```

---

## Common Mistakes to Avoid

❌ **Don't use pure colors**
```tsx
// BAD: Pure white text on background
className="text-white"

// GOOD: Light slate (part of palette)
className="text-foreground"
```

❌ **Don't use cyan/blue anymore**
```tsx
// BAD: Old cyan accent
className="text-cyan-400 border-cyan-500/30"

// GOOD: New indigo accent
className="text-primary border-indigo-500/20"
```

❌ **Don't add bright borders**
```tsx
// BAD: Bright cyan glow
className="border-cyan-400 shadow-cyan-500/50"

// GOOD: Soft slate border
className="border-slate-200 dark:border-slate-800"
```

❌ **Don't mix multiple accent colors**
```tsx
// BAD: Multi-color badges
className="bg-blue-500/20"  // One component
className="bg-purple-500/20" // Another

// GOOD: Single accent color
className="bg-indigo-500/10"  // Unified
```

---

## Build & Deploy

```bash
# Verify theme is correct
npm run build

# Start dev server
npm run dev

# Check in browser
open http://localhost:3000

# Push to remote (when ready)
git add .
git commit -m "refactor: apply Sophisticated AI Lab theme"
git push origin Main-Dev

# Deploy on Vercel (automatic)
# No additional steps needed
```

---

## Theme File Locations

| Purpose | File |
|---------|------|
| Colors & spacing config | `tailwind.config.ts` |
| CSS variables & utilities | `app/globals.css` |
| Component imports | `components/*.tsx` |
| Global layout | `app/layout.tsx` |

---

## CSS Variables (For Reference)

```css
:root {
  /* Light mode */
  --background: 210 40% 98%;        /* #F8FAFC */
  --foreground: 222 47% 11%;        /* #0F172A */
  --primary: 239 84% 67%;           /* #6366F1 */
  --border: 214 32% 91%;            /* #E2E8F0 */
  --card: 0 0% 100%;                /* #FFFFFF */
}

.dark {
  /* Dark mode */
  --background: 222 47% 5%;         /* #020617 */
  --foreground: 210 40% 96%;        /* #F1F5F9 */
  --primary: 239 84% 67%;           /* #6366F1 */
  --border: 215 28% 17%;            /* #1E293B */
  --card: 222 47% 11%;              /* #0F172A */
}
```

---

## Quick Checklist for New Components

When adding new components:

- [ ] Use `text-foreground` for primary text (not hardcoded color)
- [ ] Use `text-foreground/70` for secondary text
- [ ] Use `text-primary` for interactive elements (links, accents)
- [ ] Use `border-slate-200 dark:border-slate-800` for borders
- [ ] Use `bg-background` for page backgrounds
- [ ] Use `bg-primary` for primary buttons
- [ ] Add `dark:` variants for dark mode support
- [ ] Test both light and dark modes

---

## Need Help?

📖 Full documentation:
- `THEME_REFACTOR.md` — Complete refactor details
- `THEME_BEFORE_AFTER.md` — Visual comparisons
- `REFACTOR_COMPLETION_REPORT.md` — Full report

🎨 Color picker:
- Visual reference: Check [Color Palette](#color-palette-copy-paste-ready) above

---

**Version**: 1.0  
**Date**: February 4, 2026  
**Status**: ✅ Production Ready

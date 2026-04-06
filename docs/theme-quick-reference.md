# Quick Reference: Sophisticated AI Lab Theme

## Color Palette

### Primary Colors
```css
--primary-accent: #6366F1;          /* Indigo - All buttons, links, accents */
--dark-bg: #020617;                 /* Deep Slate - Dark mode background */
--dark-surface: #0F172A;            /* Slate Blue - Dark mode cards */
--light-bg: #F5F3F0;                /* Warm Off-White - Light mode background */
--light-surface: warm stone tones;  /* Light mode cards */
```

### Text Colors
```css
--dark-mode-text: #F1F5F9;          /* Light Slate - Dark mode body text */
--light-mode-text: #0F172A;         /* Deep Slate - Light mode body text */
```

---

## Common Tailwind Classes

### Text Colors
```tsx
className="text-foreground"          // Primary text — auto-adapts light/dark
className="text-foreground/70"       // Muted (secondary)
className="text-foreground/60"       // Dimmed (tertiary)
className="text-primary"             // Indigo accent (#6366F1)
```

### Backgrounds
```tsx
className="bg-background"            // Page background
className="bg-primary text-primary-foreground"  // Indigo button
className="bg-surface-tag"           // Tag/badge background
className="bg-surface-input"         // Form input background
className="bg-surface-hover"         // Hover state background
```

### Borders
```tsx
className="border border-border-subtle"          // Standard border
className="border border-border-subtle/80"       // Subtle border
className="glass-effect border-glow"             // Glass with border
```

### Shadows
```tsx
className="shadow-[0_20px_50px_rgba(0,0,0,0.05)]"  // Soft card shadow
className="shadow-lg shadow-indigo-500/15"           // Indigo glow (accent only)
```

---

## Component Templates

### Button (Primary)
```tsx
<Button>Click Me</Button>
// Auto-applies: bg-primary hover:bg-primary/90
```

### Card
```tsx
<Card className="glass-effect-sm border-glow">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Section Heading
```tsx
<h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
  Section Title
</h2>
```

### Icon Badge
```tsx
<div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
  <Icon />
</div>
```

### Form Input
```tsx
<Input
  placeholder="Enter text..."
  className="bg-surface-input border-border-subtle focus:border-primary"
/>
```

---

## Quick Checklist for New Components

When adding new components:

- [ ] Use `text-foreground` for primary text (not hardcoded color)
- [ ] Use `text-foreground/70` for secondary text
- [ ] Use `text-primary` for interactive elements (links, accents)
- [ ] Use `border-border-subtle` for borders
- [ ] Use `bg-surface-input` for form inputs
- [ ] Use `bg-primary` for primary buttons
- [ ] Add `dark:` variants when not using CSS variables
- [ ] Test both light and dark modes

---

## Common Mistakes to Avoid

```tsx
// BAD: Hardcoded colors
className="text-white border-cyan-400 bg-slate-900"

// GOOD: CSS variable tokens
className="text-foreground border-border-subtle bg-background"
```

```tsx
// BAD: Old cyan accent
className="text-cyan-400 border-cyan-500/30"

// GOOD: Indigo accent
className="text-primary border-indigo-500/20"
```

```tsx
// BAD: Multi-color badges
className="bg-blue-500/20"  // component A
className="bg-purple-500/20" // component B

// GOOD: Unified surface token
className="bg-surface-tag"  // both components
```

---

## CSS Variables Reference

```css
:root {
  /* Light mode (Warm Neutral Studio) */
  --background: 34 20% 95%;          /* #F5F3F0 */
  --foreground: 20 14% 11%;          /* warm dark */
  --primary: 239 84% 67%;            /* #6366F1 */
  --border-subtle: warm stone;
}

.dark {
  /* Dark mode (Deep Slate) */
  --background: 222 47% 5%;          /* #020617 */
  --foreground: 210 40% 96%;         /* #F1F5F9 */
  --primary: 239 84% 67%;            /* #6366F1 */
  --border-subtle: slate;
}
```

Full variable list: `app/globals.css`
Full refactor details: `docs/theme-refactor.md`

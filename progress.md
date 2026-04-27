# Progress Tracker

All active goals and work logs are recorded here by Mira and her team.

---

<!-- Agents append entries below in this format:

## [YYYY-MM-DD] [agent-name]
- Task: [what was done]
- Files modified: [list]
- Files created: [list]
- Status: COMPLETE | BLOCKED | IN PROGRESS
- Next: [next agent, or NONE]

-->

## [2026-04-27] mira — v3.12.2
- Task: Hero → button scroll transition with shared layout animation (AiRa avatar morphs from hero to corner button on scroll)
- Files modified:
  - context/chat-context.tsx — added isPastHero + setIsPastHero to ChatContextValue and ChatProvider state
  - components/hero.tsx — added layoutId="aira-avatar" motion.div wrapping AiAvatar; intro speech bubble (INTRO_MESSAGE, fires once per session after 1.5s, auto-dismisses after 5s, hasShownIntroRef gate); avatar visibility toggled via isPastHero from context; AnimatePresence + X close button on tooltip; imported useChatContext, AnimatePresence, X, useState
  - components/chatbot.tsx — AvatarCornerButton reads isPastHero/setIsPastHero from context (removed local state); IntersectionObserver threshold lowered 0.15→0.05; always mounted (removed AnimatePresence gate); State 1 renders placeholder outlined ring with 12% ghost silhouette; State 2/3 renders layoutId="aira-avatar" motion.button with spring stiffness:280 damping:22; tooltip only shown when isPastHero; removed outer AnimatePresence wrapper in Chatbot export
  - app/layout.tsx — added LayoutGroup id="aira-shared" wrapping {children} + Chatbot so all three layoutId instances share the same group
  - package.json — 3.12.1 → 3.12.2
- Status: COMPLETE
- Next: NONE

## [2026-04-27] mira — v3.12.1
- Task: Four focused fixes — tooltip randomization, animation lag, avatar alignment, coursework modals
- Files modified:
  - components/chatbot.tsx — replaced single-message SECTION_TIPS with per-section message pools (3–4 messages each); pickTooltip() selects randomly with no-consecutive-repeat via lastUsedIndex ref; isAnimatingRef gate debounces rapid IntersectionObserver crossings (600ms lockout); tooltip simplified to single CTA string (no quip/cta split); avatar container refactored to position:relative w-16 h-16 fixed container with pulse ring at inset:-4px and avatar button at inset:0 (concentric circles fix); added will-change:transform,opacity to outer motion.div, tooltip, and pulse ring; AnimatePresence mode="wait" on tooltip to prevent double-fire re-renders
  - components/education.tsx — added courseDetails record with first-person factual narratives for all 12 Purdue courses + 10 Anthropic Academy courses; CourseBadge component with cursor-pointer + hover highlight + keyboard support; CourseModal using Radix Dialog (same pattern as skills.tsx); section subtitle updated to hint at click affordance
  - package.json — 3.12.0 → 3.12.1
- Status: COMPLETE
- Next: NONE

## [2026-04-27] mira — v3.12.0
- Task: Avatar UX overhaul — eliminate dual-avatar, unified single avatar system
- Files modified:
  - components/chatbot.tsx — added AvatarCornerButton with layoutId="aira-avatar" shared to chat header; IntersectionObserver hero detection; section-aware tooltips with CTA copy (4s auto-dismiss, X close, click-to-open-chat); prefers-reduced-motion respected; corner-avatar-float + corner-avatar-pulse CSS animations; no RAF setState on scroll/mouse
  - app/layout.tsx — removed AvatarGuide import and mount
  - app/globals.css — renamed guide keyframes to corner-avatar-float / corner-avatar-pulse
  - package.json (3.11.2 → 3.12.0)
- Files deleted:
  - components/avatar-guide.tsx
- Status: COMPLETE
- Next: NONE

## [2026-04-27] mira — v3.11.0
- Task: Three interactivity features — background personality animations, avatar guide bubble, avatar-to-chat morph
- Files modified:
  - components/ambient-background.tsx — personality animation system (shooting star, orb pulse, constellation, ripple, color shift) on 8–20s random timer; all effects respect prefers-reduced-motion
  - components/chatbot.tsx — rewired to ChatContext; Framer Motion layoutId avatar morphs between trigger button and chat header; AvatarFace SVG replaces Sparkles icon in all avatar positions (trigger, header, message rows)
  - app/layout.tsx — added ChatProvider wrapper, mounted AvatarGuide
  - app/globals.css — added avatar-guide-float and guide-pulse-ring keyframes
  - package.json (3.10.1 → 3.11.0)
- Files created:
  - context/chat-context.tsx — shared ChatProvider + useChatContext hook (isOpen, openChat, closeChat, toggleChat)
  - components/avatar-guide.tsx — floating avatar bubble that appears after hero scroll-past; IntersectionObserver per section fires contextual tooltips (3s auto-dismiss); click scrolls to top; chat sub-button opens chat
- Status: COMPLETE
- Next: NONE

## [2026-04-27] mira
- Task: v3.9.0 — five-feature release: featured project reorder, site-wide cursor/tilt animations, skills popups, cert PDF viewer, experience card collapse+modal
- Files modified:
  - lib/projects.ts (AiRa → id:2 moves to featured slot, Wine Varietals → second)
  - lib/certifications.ts (added pdfPath field to type + all 20 entries)
  - components/certifications.tsx (TiltCard on all cards, CertPdfModal with iframe #toolbar=0)
  - components/skills.tsx (TiltCard on all category cards, SkillModal with narrative + appliedAt for every skill)
  - components/experience.tsx (collapsed summary cards + ExperienceModal with bullets + biopic narrative per role)
  - package.json (3.8.0 → 3.9.0)
- Files created:
  - components/ui/dialog.tsx (Radix Dialog wrapper)
  - public/certs/nremt.pdf
  - public/certs/ferpa.pdf
  - public/certs/hipaa.pdf
  - public/certs/glba.pdf
  - public/certs/data-classification.pdf
  - public/certs/protecting-ssn.pdf
  - public/certs/claude-101.pdf
  - public/certs/claude-code-101.pdf
  - public/certs/intro-claude-work.pdf
  - public/certs/claude-code-action.pdf
  - public/certs/ai-fluency-framework.pdf
  - public/certs/claude-api.pdf
  - public/certs/intro-mcp.pdf
  - public/certs/ai-fluency-educators.pdf
  - public/certs/ai-fluency-students.pdf
  - public/certs/claude-vertex-ai.pdf
  - public/certs/teaching-ai-fluency.pdf
  - public/certs/ai-fluency-nonprofits.pdf
  - public/certs/intro-agent-skills.pdf
  - public/certs/intro-subagents.pdf
- Status: COMPLETE
- Next: NONE

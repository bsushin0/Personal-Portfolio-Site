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

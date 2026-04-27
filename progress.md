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

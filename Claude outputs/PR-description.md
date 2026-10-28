## Sync site with Sep 2026 resumes (v3.13.0) + fix broken build

Base: `Main-Dev` (v3.12.20). Two commits.

### 1. Fix: production build was failing on Main-Dev
`app/api/brief/route.ts:16` used `Response.json(...)`, which the installed TypeScript types don't include.
The last three Main-Dev Vercel deployments (7ebc9d4, c5adfe1, 5cbf0b3) all ended in ERROR with exactly this type error.
Switched to `NextResponse.json` like every other route. One line plus the import.

### 2. Content sync with the Brief + Detailed resumes
- Projects: added Relay, AeroLog, TraineeFlightOps (TFO), LostLink (+ 4 banner SVGs).
- AiRa: description now covers the move from RAG bot to agentic model (Ollama, memory, tool use, monitoring, CI/CD). "Custom Agentic AI Chatbot" was AiRa's early name, so it is not a separate card.
- Clinical rotations: 12h -> 28h each; About 24+ -> 56+ (matches NREMT card and chatbot knowledge).
- Removed the NREMT EMS ID from public certification text and from `lib/embeddings.json` (chatbot knowledge).
- Skills: added Figma. About: short paragraph on TFO and Relay. `progress.md` + version 3.13.0.

### Needs your decision before merge to main
- **Clinical hours.** v3.12.17 (f2e003c, June) deliberately changed 28h -> 12h and 56+ -> 24+. This PR reverses that per the resume. If 12h is the real number, revert the 6 lines in `components/experience.tsx`, the About line, and set the NREMT card/chatbot text to 24+.
- **NREMT certificate PDF** (`/certs/nremt.pdf`) is served publicly. Check it does not show the EMS ID.

### Verified
- `tsc --noEmit` clean; `next build` succeeds (19/19 pages) with dummy env vars.
- Production build served locally and checked in Chromium (desktop + 390px mobile): all 8 project cards and banners render, no horizontal overflow, clinical modal shows 28-hour, EMS ID absent from page text. Only console errors are the Vercel-only `/_vercel/*` script 404s, which are expected off-Vercel.

### Known / not done
- Chatbot knowledge (`lib/embeddings.json`) does not yet know Relay/AeroLog/TFO/LostLink. Regenerate with `pnpm build:embeddings` on a machine that has the private bio files.
- `app/api/contact/route.ts` builds `new Resend(process.env.RESEND_API_KEY || "")` at import time, so a build with no `RESEND_API_KEY` in that environment fails. Confirm the key exists in Vercel's **Preview** scope or the PR preview will fail.
- 3 pre-existing react-hooks lint warnings (cursor-system, chatbot) are unchanged.

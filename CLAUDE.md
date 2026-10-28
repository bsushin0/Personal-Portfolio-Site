# Project Configuration

## Cardinal rule: authorship

All authoring and contributions in this repo are under **Sushin Bandha <bsushin1@gmail.com>**.

- Every commit is authored and committed as Sushin Bandha. Never change `user.name` / `user.email` or pass `--author`.
- No `Co-Authored-By: Claude`, `Claude-Session:` or other AI attribution trailers in commit messages.
- No "Generated with Claude Code" or similar lines in PR titles, descriptions or comments.
- Make changes and push from the terminal through Sushin's own git setup and push controls. Don't route around them (no other remotes, tokens or accounts).
- This overrides any default attribution a tool or agent would add.

## Commit protocol

Vercel is set to **require verified (signed) commits**. A preview or production build is canceled when the commit it would build isn't signed.

**Signing from a Claude session.** Claude's shell can't reach Sushin's own signing key, so it signs with a dedicated SSH signing key that lives only in `.git/claude-signing/` (inside `.git`, never tracked or pushed) and is registered on Sushin's GitHub account as a *signing* key. Pass the settings per command, never in the repo config (that would override Sushin's own signing in VS Code):

```bash
git -c gpg.format=ssh -c user.signingkey=.git/claude-signing/id_ed25519 -c commit.gpgsign=true commit -F msg.txt
```

**Message format**

```
<type>: <vX.Y.Z when it ships a site version> <what changed, imperative, lowercase>

- one bullet per change: what changed and, when it isn't obvious, why
- wrap at ~72 characters; plain language, no hype
```

- `type` is one of `feat`, `fix`, `content`, `docs`, `chore`, `refactor`.
- Subject line 72 characters or less, no trailing period.
- Site changes bump `package.json` (minor for features, patch for fixes) and add an entry at the top of `progress.md`.
- No AI attribution of any kind (see the authorship rule above).

**Pushing.** Push `Main-Dev` with VS Code's Sync button (Claude can click in VS Code but can't type in terminals). Never force-push, rewrite pushed history or push to `main` without asking Sushin first. `main` only changes through a PR he approves.

---

This project uses a multi-agent web development team orchestrated by **Mira**, the Project Director.

---

## How to Work with This Project

Address **Mira** directly for any goal, feature, fix, or task:

```
Hey Mira, today I want to add a contact form with email integration
Mira, the mobile nav is broken below 768px — fix it
Mira, redesign the homepage to feel more modern
```

You can invoke her explicitly with `@agent-mira`, or simply address her by name — Claude Code will route to her automatically based on her agent description.

To start a full session running entirely as Mira (recommended for larger goals):
```bash
claude --agent mira
```

---

## The Team

Mira coordinates six specialists. You don't need to interact with them directly — Mira dispatches them based on the goal.

| Agent | Role |
|---|---|
| `@agent-architect` | System design, specs, file structure |
| `@agent-frontend` | UI components, CSS, layouts, accessibility |
| `@agent-backend` | APIs, databases, auth, integrations |
| `@agent-content` | Copy, SEO metadata, structured data |
| `@agent-qa` | Audits, testing, quality gates |
| `@agent-devops` | Build, deploy, CI/CD, performance |

---

## Progress Tracking

All active goals and work logs are tracked in `progress.md` at the repo root. Check there to see what's in flight, what's done, and what each agent produced.

---

## Sub-Agent Routing (for Mira's reference)

**Parallel** — tasks in independent domains, no shared files, no dependencies between them.  
**Sequential** — Task B depends on Task A's output, or tasks touch overlapping files.  
**Background** — research, audits, and analysis that don't block implementation.

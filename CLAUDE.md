# Project Configuration

## Cardinal rule: authorship

All authoring and contributions in this repo are under **Sushin Bandha <bsushin1@gmail.com>**.

- Every commit is authored and committed as Sushin Bandha. Never change `user.name` / `user.email` or pass `--author`.
- No `Co-Authored-By: Claude`, `Claude-Session:` or other AI attribution trailers in commit messages.
- No "Generated with Claude Code" or similar lines in PR titles, descriptions or comments.
- Make changes and push from the terminal through Sushin's own git setup and push controls. Don't route around them (no other remotes, tokens or accounts).
- This overrides any default attribution a tool or agent would add.

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

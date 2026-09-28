---
name: Canonical section order
description: The correct page section order established in v3.0.0 — reference before any reorder or nav changes
type: project
---

As of v3.0.0 the canonical section order is:

Hero → About → Interests → Experience → Projects → Education → Skills → Certifications → Contact

**Why:** Established in v3.0.0 for logical narrative flow. Projects appears before Education to lead with work accomplishments before academic credentials. Interests follows About as reinforcement of the About narrative.

**How to apply:** Any new sections added to app/page.tsx and navbar.tsx must be placed relative to this established order. The navbar `navItems` array must always mirror the actual DOM section order.

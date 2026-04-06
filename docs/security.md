# Security Configuration - Document Storage

## Overview
All sensitive documents (resumes, cover letters, application materials) are stored in the `private/` folder which is git-ignored and not web-accessible.

## Folder Structure

```
/public/
  └── Sushin_Bandha_Resume.pdf  # Publicly served resume (for direct download links)

/private/  # NOT accessible via web, gitignored
  ├── AI_CONTEXT.md             # AI agent context file
  ├── README.md
  └── documents/
      └── bio/                  # Chatbot knowledge base (markdown files)
```

## Security Measures

1. **Git Protection**: `/private/` added to `.gitignore` — never committed
2. **Deployment Protection**: Documents excluded via `.vercelignore`
3. **Web Inaccessibility**: Files stored outside `public/` directory
4. **API-Only Access**: Only server-side API routes can read private files

## How It Works

### Contact Form Email Automation
- User submits contact form
- Server-side API (`/app/api/contact/route.ts`) reads resume from `public/Sushin_Bandha_Resume.pdf`
- Resume attached to automated email reply
- File is NEVER served directly at a guessable URL

### What should NOT work (direct web access):
```
https://yoursite.com/private/resume/any-file.pdf  # 404
```

## Headers & Production Security

The following security headers are set in `next.config.mjs` and/or `middleware.ts`:
- `Strict-Transport-Security` (HSTS)
- `X-Frame-Options: DENY`
- `Content-Security-Policy`
- `Permissions-Policy`

## Maintenance

### Adding a new resume version:
1. Replace `public/Sushin_Bandha_Resume.pdf` with the new file
2. The contact form API will automatically use the updated file

### Important Rules
- Never move sensitive files to `public/`
- Never remove `/private/` from `.gitignore`
- Resume served publicly via `public/Sushin_Bandha_Resume.pdf` is intentional for download links

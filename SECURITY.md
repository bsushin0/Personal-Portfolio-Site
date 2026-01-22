# Security Configuration - Document Storage

## Overview
All sensitive documents (resumes, cover letters, application materials) have been moved from the publicly accessible `public/` folder to a secured `private/` folder.

## What Changed

### Before
- ❌ All PDFs and DOCX files were in `public/` folder
- ❌ Anyone could access documents by guessing the URL
- ❌ All documents were committed to Git
- ❌ All documents were deployed to Vercel

### After
- ✅ All documents moved to `private/` folder (not web-accessible)
- ✅ Only server-side code can access these files
- ✅ Private folder is gitignored (never committed)
- ✅ Documents folder excluded from deployment
- ✅ Only certification image remains in `public/`

## Folder Structure

```
/public/
  └── Data Handling Cert.png  # Only publicly accessible file (needed for website display)

/private/  # NOT accessible via web, gitignored
  ├── README.md
  ├── resume/
  │   └── sushin-bandha-resume.pdf  # Used by contact form API
  └── documents/
      └── [125 resume/cover letter files]  # Archived, not deployed
```

## Security Measures

1. **Git Protection**: `/private/` added to `.gitignore`
2. **Deployment Protection**: Documents excluded via `.vercelignore`
3. **Web Inaccessibility**: Files stored outside `public/` directory
4. **API-Only Access**: Only `/app/api/contact/route.ts` can read the resume

## How It Works

### Contact Form Email Automation
- User submits contact form
- Server-side API (`/app/api/contact/route.ts`) reads resume from `private/resume/`
- Resume attached to automated email reply
- File is NEVER served directly to web browsers
- URL like `https://site.com/sushin-bandha-resume.pdf` returns 404

### Certification Display
- `Data Handling Cert.png` remains in `public/` folder
- Referenced in `/lib/certifications.ts`
- Displayed on website via Next.js Image component
- This is the ONLY file that should be publicly accessible

## Testing Security

### What should work:
```bash
# Server-side access (in API routes)
const resumePath = path.join(process.cwd(), 'private', 'resume', 'sushin-bandha-resume.pdf')
fs.readFileSync(resumePath) // ✅ Works
```

### What should NOT work:
```bash
# Direct web access
https://yoursite.com/private/resume/sushin-bandha-resume.pdf  # ❌ 404
https://yoursite.com/sushin-bandha-resume.pdf                # ❌ 404
https://yoursite.com/any-resume-file.pdf                     # ❌ 404
```

### What should work for public:
```bash
https://yoursite.com/Data%20Handling%20Cert.png  # ✅ Works (needed for site)
```

## Maintenance

### Adding a new resume version:
1. Copy new resume to `private/resume/sushin-bandha-resume.pdf`
2. Do NOT commit this file (it's gitignored)
3. Upload directly to production server if needed

### For Vercel deployment:
- The `private/resume/` folder will be included in deployment (for API access)
- The `private/documents/` folder will NOT be deployed (excluded in `.vercelignore`)
- Neither folder will be committed to Git (both gitignored)

## Important Notes

⚠️ **Never move files back to `public/` folder**
⚠️ **Never remove `/private/` from `.gitignore`**
⚠️ **Only `Data Handling Cert.png` should be in `public/`**
⚠️ **Resume in `private/resume/` must be manually uploaded to Vercel if changed**

## Files Updated

1. `/app/api/contact/route.ts` - Updated to read from `private/resume/`
2. `/.gitignore` - Added `/private/`
3. `/.vercelignore` - Excluded `private/documents/`
4. `/private/README.md` - Documentation
5. `SECURITY.md` - This file

All 125 PDF and DOCX files have been successfully secured! 🔒

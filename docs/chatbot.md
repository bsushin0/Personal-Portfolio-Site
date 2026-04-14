# RAG AI Chatbot Setup Guide

This portfolio includes a free, in-house RAG (Retrieval-Augmented Generation) AI chatbot powered by Google Gemini API. The chatbot uses curated markdown bio files as its primary knowledge base to provide accurate, fact-based responses about Sushin Bandha.

## Features

- **Conversational AI Assistant** - Answers questions about Sushin's background, skills, and experience
- **RAG-Powered** - Uses pre-computed embeddings from curated markdown bio files
- **Strict Fact-Based Responses** - Only answers from known context, makes logical inferences carefully
- **Contact Form Integration** - Collects information and can submit contact form on user's behalf
- **100% Free** - Uses Google Gemini free tier (no paid services required)
- **Fast & Efficient** - Client-side vector search with pre-computed embeddings
- **Theme-Matched UI** - Glass-morphism design matching the portfolio theme

## Knowledge Base

The chatbot's primary knowledge source is the curated markdown files in `private/documents/bio/`:

- `01-profile.md` - Professional summary and elevator pitch
- `02-experience.md` - Work history and internships
- `03-projects.md` - Technical projects and accomplishments
- `04-skills.md` - Technical skills and competencies
- `05-certifications.md` - Certifications and credentials
- `06-education.md` - Academic background
- `07-hobbies-interests.md` - Personal interests and activities
- `08-goals.md` - Career goals and aspirations
- `09-contact.md` - Contact information and preferences

These files are processed into embeddings and used for semantic search during conversations.

## Setup Instructions

### 1. Get Google AI API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Add your API key:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

### 3. Generate Embeddings

Process your markdown bio files and generate embeddings:

```bash
# Make sure you have markdown files in private/documents/bio/
pnpm run build:embeddings
```

This will:
- Extract text from markdown files in `private/documents/bio/`
- Chunk text into 512-token segments with 50-token overlap
- Generate embeddings using Google Gemini `text-embedding-004` model
- Save pre-computed embeddings to `lib/embeddings.json`

**Required Directory Structure**:
```
private/
└── documents/
    └── bio/
        ├── 01-profile.md
        ├── 02-experience.md
        ├── 03-projects.md
        ├── 04-skills.md
        ├── 05-certifications.md
        ├── 06-education.md
        ├── 07-hobbies-interests.md
        ├── 08-goals.md
        └── 09-contact.md
```

### 4. Build and Run

```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start
```

### 5. Deploy to Vercel

1. Push your code to GitHub (including `lib/embeddings.json`)
2. Import project in Vercel
3. Add environment variable:
   - Key: `GOOGLE_GENERATIVE_AI_API_KEY`
   - Value: Your Google AI API key
4. Deploy!

## Retrieval Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| Embedding model | `text-embedding-004` | Google, 768 dimensions |
| Similarity threshold | 0.60 | 60% minimum confidence |
| Top-K results | 5 | Most relevant chunks |
| Temperature | 0.3 | Low for factual, deterministic output |
| Rate limit | 10 msgs/hr | Per IP/session |

Modify these in `app/api/chat/route.ts`:
- `MIN_SIMILARITY: 0.60`
- `TOP_K: 5`
- `temperature: 0.3`

## Customization

### Modify System Prompt

Edit the `SYSTEM_PROMPT` in `app/api/chat/route.ts` to change the chatbot's personality, goals, and response rules.

### Update Knowledge Base

1. Edit markdown files in `private/documents/bio/`
2. Run `pnpm run build:embeddings` to regenerate embeddings
3. Redeploy or restart your development server

### Change Model

Replace model ID in `app/api/chat/route.ts`:
- `gemini-2.5-flash-lite` - Fast, free tier (current)
- `gemini-2.5-flash` - Stable, balanced speed/quality
- `gemini-2.5-pro` - Higher quality (slower, may exceed free tier)

## Troubleshooting

### No embeddings.json file
Run `pnpm run build:embeddings` first. Make sure:
- Markdown files exist in `private/documents/bio/`
- `GOOGLE_GENERATIVE_AI_API_KEY` is set
- You have internet connection for API calls

### Rate limit errors
Google's free tier has limits. Solutions:
- Implement client-side caching
- Increase `MAX_REQUESTS_PER_HOUR` cautiously
- Consider upgrading to paid tier for production traffic

### Chatbot not responding
Check:
- Environment variable is set in Vercel
- `lib/embeddings.json` is committed to repository
- API key is valid and not expired
- Check Vercel function logs for errors

## Free Tier Limits

**Google Gemini Free Tier**:
- Rate limits vary (typically 15-60 RPM depending on model)
- No cost for input/output tokens on free models

**Vercel Free Tier**:
- 10-second function timeout (Hobby plan)
- 100GB bandwidth/month

**Monthly Cost: $0** (assuming free tier stays within limits)

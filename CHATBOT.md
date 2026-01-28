# RAG AI Chatbot Setup Guide

This portfolio includes a free, in-house RAG (Retrieval-Augmented Generation) AI chatbot powered by Google Gemini API. The chatbot uses curated markdown bio files as its primary knowledge base to provide accurate, fact-based responses about Sushin Bandha.

## Features

- 🤖 **Conversational AI Assistant** - Answers questions about Sushin's background, skills, and experience
- 📚 **RAG-Powered** - Uses pre-computed embeddings from curated markdown bio files
- 🎯 **Strict Fact-Based Responses** - Only answers from known context, makes logical inferences carefully
- 💬 **Contact Form Integration** - Collects information and can submit contact form on user's behalf
- 🌐 **100% Free** - Uses Google Gemini free tier (no paid services required)
- ⚡ **Fast & Efficient** - Client-side vector search with pre-computed embeddings
- 🎨 **Theme-Matched UI** - Glass-morphism design matching the portfolio theme

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

## Chatbot Behavior

### Response Philosophy

The chatbot follows strict rules to prevent hallucination and misinformation:

1. **Answer ONLY from context** - Uses only information from the curated markdown files
2. **Logical inferences only** - Makes inferences only when necessarily true
   - ✅ GOOD: "Since Sushin completed an AI internship at PSEG and built ML models, he has experience with Python"
   - ❌ BAD: "Sushin probably knows TensorFlow" (not stated, speculative)
3. **Confidence threshold** - Requires 60%+ similarity for confident responses
4. **Graceful degradation** - Offers contact form when lacking specific information
5. **No speculation** - Never invents facts or makes assumptions

### Retrieval Strategy

- **Embedding Model**: Google `text-embedding-004` (768 dimensions)
- **Similarity Threshold**: 0.60 (60% minimum confidence)
- **Top-K Results**: 5 most relevant chunks
- **Temperature**: 0.3 (low temperature for factual, deterministic responses)

## Setup Instructions

### 1. Get Google AI API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
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
- Optionally include resume PDFs from `private/resume/` as supplementary context
- Chunk text into 512-token segments with 50-token overlap
- Generate embeddings using Google Gemini `text-embedding-004` model
- Save pre-computed embeddings to `lib/embeddings.json`

**Required Directory Structure**:
```
private/
├── documents/
│   └── bio/
│       ├── 01-profile.md
│       ├── 02-experience.md
│       ├── 03-projects.md
│       ├── 04-skills.md
│       ├── 05-certifications.md
│       ├── 06-education.md
│       ├── 07-hobbies-interests.md
│       ├── 08-goals.md
│       └── 09-contact.md
└── resume/
    └── sushin-bandha-resume.pdf (optional)
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

## How It Works

### Architecture

```
┌─────────────────────────────────────────┐
│ BUILD TIME                              │
├─────────────────────────────────────────┤
│ 1. Parse markdown bio files             │
│ 2. Chunk into 512-token segments        │
│ 3. Generate embeddings (Gemini API)     │
│ 4. Save to lib/embeddings.json          │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ RUNTIME (User Query)                    │
├─────────────────────────────────────────┤
│ 1. User sends message                   │
│ 2. Generate query embedding             │
│ 3. Vector similarity search (cosine)    │
│ 4. Filter by 60%+ similarity threshold  │
│ 5. Construct context for LLM            │
│ 6. Generate response (Gemini, T=0.3)    │
│ 7. Return factual response              │
└─────────────────────────────────────────┘
```

### Key Components

- **[lib/document-processor.ts](lib/document-processor.ts)** - Markdown/PDF parsing and text chunking
- **[lib/vector-search.ts](lib/vector-search.ts)** - Cosine similarity search with thresholding
- **[scripts/generate-embeddings.ts](scripts/generate-embeddings.ts)** - Embedding generation script
- **[app/api/chat/route.ts](app/api/chat/route.ts)** - Chat API with strict RAG implementation
- **[components/chatbot.tsx](components/chatbot.tsx)** - Floating chat UI widget
- **[private/documents/bio/*.md](private/documents/bio/)** - Primary knowledge base (markdown files)

### Rate Limiting

The chatbot includes built-in rate limiting:
- **10 messages per hour** per IP/session
- Protects Google API free tier quotas
- Graceful error messages when limit exceeded

## Customization

### Modify System Prompt

Edit the `SYSTEM_PROMPT` in [app/api/chat/route.ts](app/api/chat/route.ts) to change the chatbot's personality, goals, and response rules. Current rules enforce strict fact-based responses with no speculation.

### Adjust Retrieval Parameters

In [app/api/chat/route.ts](app/api/chat/route.ts), modify:
- `MIN_SIMILARITY: 0.60` - Minimum similarity threshold (60% confidence)
- `TOP_K: 5` - Number of relevant chunks to retrieve
- `temperature: 0.3` - Lower = more factual, higher = more creative

### Update Knowledge Base

To update the chatbot's knowledge:

1. Edit markdown files in `private/documents/bio/`
2. Run `pnpm run build:embeddings` to regenerate embeddings
3. Redeploy or restart your development server

### Change Model

Replace `gemini-2.0-flash-exp` with other Gemini models:
- `gemini-2.0-flash-exp` - Experimental, latest features (current)
- `gemini-2.5-flash` - Stable, balanced speed/quality
- `gemini-2.5-pro` - Higher quality (slower, may exceed free tier)

### Style Customization

The chatbot UI in [components/chatbot.tsx](components/chatbot.tsx) uses your portfolio's existing theme (cyan/purple gradients, glass-morphism). Modify Tailwind classes to customize appearance.

## Troubleshooting

### No embeddings.json file

Run `pnpm run build:embeddings` first. Make sure:
- PDF files exist in `private/` folders
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
- Free models: gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash-exp
- Rate limits vary (typically 15-60 RPM)
- No cost for input/output tokens on free models
- Content may be used to improve Google's products

**Vercel Free Tier**:
- 10-second function timeout (Hobby plan)
- 100GB bandwidth/month
- Edge Functions: 30-second timeout

## Cost Estimate

**Monthly Cost** (assuming free tier stays within limits):
- LLM API (Gemini): **$0**
- Embedding API (Gemini): **$0**
- Vercel Hosting: **$0**

**Total: $0/month** ✅

## Support

For issues or questions:
1. Check Vercel function logs
2. Verify environment variables
3. Test API key with Google AI Studio
4. Review console errors in browser DevTools

## License

Same as parent project (check root LICENSE file)

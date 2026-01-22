# RAG AI Chatbot Setup Guide

This portfolio includes a free, in-house RAG (Retrieval-Augmented Generation) AI chatbot powered by Google Gemini API.

## Features

- 🤖 **Conversational AI Assistant** - Answers questions about Sushin's background, skills, and experience
- 📚 **RAG-Powered** - Uses pre-computed embeddings from resume and application documents
- 💬 **Contact Form Integration** - Collects information and can submit contact form on user's behalf
- 🌐 **100% Free** - Uses Google Gemini free tier (no paid services required)
- ⚡ **Fast & Efficient** - Client-side vector search with pre-computed embeddings (~350KB)
- 🎨 **Theme-Matched UI** - Glass-morphism design matching the portfolio theme

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

Process your documents and generate embeddings:

```bash
# Make sure you have documents in private/documents/ and private/resume/
pnpm run build:embeddings
```

This will:
- Extract text from PDF documents in `private/` folders
- Chunk text into 512-token segments
- Generate embeddings using Google Gemini API
- Save pre-computed embeddings to `lib/embeddings.json` (~350KB)

**Note**: The `private/` folder should contain:
- `private/resume/sushin-bandha-resume.pdf` (main resume)
- `private/documents/*.pdf` (cover letters, specialized resumes, etc.)

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
│ 1. Parse PDF documents                  │
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
│ 3. Search similar chunks (in-memory)    │
│ 4. Construct context for LLM            │
│ 5. Generate response (Gemini Flash)     │
│ 6. Stream to client                     │
└─────────────────────────────────────────┘
```

### Key Components

- **[lib/document-processor.ts](lib/document-processor.ts)** - PDF parsing and text chunking
- **[lib/vector-search.ts](lib/vector-search.ts)** - Cosine similarity search
- **[scripts/generate-embeddings.ts](scripts/generate-embeddings.ts)** - Embedding generation script
- **[app/api/chat/route.ts](app/api/chat/route.ts)** - Chat API with RAG
- **[components/chatbot.tsx](components/chatbot.tsx)** - Floating chat UI widget

### Rate Limiting

The chatbot includes built-in rate limiting:
- **10 messages per hour** per IP/session
- Protects Google API free tier quotas
- Graceful error messages when limit exceeded

## Customization

### Modify System Prompt

Edit the `SYSTEM_PROMPT` in [app/api/chat/route.ts](app/api/chat/route.ts) to change the chatbot's personality, goals, and behavior.

### Adjust Retrieval Parameters

In [app/api/chat/route.ts](app/api/chat/route.ts), modify:
- `topK: 3` - Number of relevant chunks to retrieve (default: 3)
- `minSimilarity: 0.5` - Minimum similarity threshold (0.0-1.0)

### Change Model

Replace `gemini-2.0-flash-exp` with other free Gemini models:
- `gemini-2.5-flash` - Balanced speed/quality
- `gemini-2.5-pro` - Higher quality (slower)

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

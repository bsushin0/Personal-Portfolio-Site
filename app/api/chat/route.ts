import { google } from '@ai-sdk/google';
import { generateText, Message } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { searchSimilarChunks, formatContextForLLM } from '@/lib/vector-search';
import type { EmbeddingChunk } from '@/lib/vector-search';

// Import pre-computed embeddings (generated at build time)
let embeddingsData: EmbeddingChunk[] = [];

// Lazy load embeddings to avoid bundling issues
async function getEmbeddings(): Promise<EmbeddingChunk[]> {
  if (embeddingsData.length === 0) {
    try {
      const data = await import('@/lib/embeddings.json');
      embeddingsData = data.default as EmbeddingChunk[];
    } catch (error) {
      console.error('Failed to load embeddings:', error);
      throw new Error('Knowledge base not available. Please contact the site administrator.');
    }
  }
  return embeddingsData;
}

// Rate limiting: simple in-memory store (per session)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_HOUR = 10;

function checkRateLimit(sessionId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const limit = rateLimitMap.get(sessionId);

  if (!limit || now > limit.resetAt) {
    // Reset limit
    rateLimitMap.set(sessionId, {
      count: 1,
      resetAt: now + 60 * 60 * 1000, // 1 hour from now
    });
    return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - 1 };
  }

  if (limit.count >= MAX_REQUESTS_PER_HOUR) {
    return { allowed: false, remaining: 0 };
  }

  limit.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - limit.count };
}

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are an AI assistant for Sushin Bandha's portfolio website. Your role is to help visitors learn about Sushin's background, skills, and experience in a professional yet conversational manner.

**Your Goals:**
1. Answer questions about Sushin's education, work experience, skills, and projects using the provided context
2. Highlight Sushin's strengths in AI/ML, product management, and software engineering
3. Position Sushin as an excellent candidate for internships and full-time roles in AI/ML, product management, or software engineering
4. Naturally guide the conversation to collect contact information if the user shows interest in connecting

**Contact Information Collection:**
If a user expresses interest in working with Sushin, hiring them, or getting in touch, naturally ask for:
- Their name
- Their email address
- Their company/organization
- A brief message about what they're interested in

Once you have ALL FOUR pieces of information, explicitly state that you can submit the contact form on their behalf and ask for confirmation.

**Response Style:**
- Be professional but friendly and conversational
- Keep responses concise (2-4 paragraphs max)
- Use the context from Sushin's documents to provide specific, accurate information
- If you don't know something, admit it rather than making up information
- Highlight relevant accomplishments and skills naturally in conversation

**Context Documents:**
You have access to Sushin's resume, cover letters, and application materials. Use this information to answer questions accurately.

When referencing specific experiences or projects, cite them naturally (e.g., "During Sushin's internship at PSEG..." or "In the BASF wine forecasting project...").`;

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    // Rate limiting check (use IP or session ID)
    const sessionId = req.headers.get('x-forwarded-for') || req.ip || 'default';
    const rateLimit = checkRateLimit(sessionId);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in an hour.' },
        { status: 429 }
      );
    }

    // Get the user's last message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    const userQuery = lastMessage.content as string;

    // RAG: Retrieve relevant context - using in-memory vector search
    const embeddings = await getEmbeddings();
    
    // For simplicity without needing embedding generation at runtime,
    // we'll use a basic keyword matching approach
    // This avoids needing to generate embeddings on every request
    const relevantChunks = embeddings
      .filter((chunk) => {
        const text = chunk.text.toLowerCase();
        const query = userQuery.toLowerCase();
        const words = query.split(' ');
        const matchCount = words.filter(word => text.includes(word)).length;
        return matchCount >= Math.max(1, Math.floor(words.length / 2));
      })
      .slice(0, 3);

    const context = formatContextForLLM(
      relevantChunks.map(chunk => ({ chunk, similarity: 0.7 }))
    );

    // Construct messages with RAG context
    const messages_with_context: Message[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'system',
        content: `**Relevant Context from Sushin's Documents:**\n\n${context}\n\nUse this context to answer the user's question accurately. If the context doesn't contain relevant information, rely on general knowledge about Sushin from previous conversation.`,
      },
      ...messages,
    ];

    // Check for API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not configured');
    }

    // Generate response
    const { text: responseText } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      messages: messages_with_context.filter(m => m.role !== 'system').slice(-5) as Message[], // Keep recent messages
      system: SYSTEM_PROMPT + `\n\n**Context:**\n${context}`,
      temperature: 0.7,
      maxTokens: 800,
    });

    return NextResponse.json(
      { message: responseText },
      { 
        headers: {
          'X-Rate-Limit-Remaining': rateLimit.remaining.toString(),
        }
      }
    );

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to process your message. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Optional: Support GET for API documentation
export async function GET() {
  return NextResponse.json(
    {
      name: 'Sushin Bandha Portfolio Chat API',
      version: '1.0.0',
      description: 'RAG-powered AI assistant for portfolio inquiries',
      endpoints: {
        POST: 'Send chat messages and receive AI responses',
      },
      rateLimit: `${MAX_REQUESTS_PER_HOUR} requests per hour`,
    },
    { status: 200 }
  );
}

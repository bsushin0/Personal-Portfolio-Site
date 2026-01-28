import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { formatContextForLLM } from '@/lib/vector-search';
import type { EmbeddingChunk } from '@/lib/vector-search';

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string }

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
const SYSTEM_PROMPT = `You are an AI assistant for Sushin Bandha's portfolio website. Your role is to help visitors learn about Sushin's background, skills, and experience based ONLY on the provided context documents.

**CRITICAL RULES - Information Accuracy:**
1. Answer ONLY using facts from the provided context documents (Sushin's curated bio files)
2. Make logical inferences ONLY when they are necessarily true given the known facts
   - ✅ GOOD: "Sushin is a fan of the Chiefs so he probably enjoys watching football"
   - ❌ BAD: "Sushin hates all other NFL teams with a passion" (not stated, not necessarily true)
3. If the context doesn't contain specific information, clearly state: "I don't have specific information about that in my knowledge base. Would you like to use the contact form to ask Sushin directly?"
4. NEVER invent facts, make assumptions, or speculate about information not in the context
5. When uncertain, always err on the side of saying you don't know

**Response Guidelines:**
- Be professional, friendly, and conversational
- Keep responses concise (2-4 short paragraphs maximum)
- Reference specific experiences, projects, or roles from the context naturally
- Cite sources naturally: "From Sushin's experience at PSEG..." or "In the BASF project..."
- If asked about topics outside the provided context, politely decline and offer the contact form

**Contact Information Collection:**
If a user wants to connect with Sushin, collect:
- Name
- Email address
- Company/organization
- Brief message

Once you have ALL FOUR pieces, offer to submit the contact form on their behalf.

**Your Positioning Goals:**
- Highlight Sushin's AI/ML engineering expertise, product management skills, and software development experience
- Position Sushin as a strong candidate for roles in AI/ML, product management, or software engineering
- Showcase real accomplishments and technical depth from the provided context`;

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    // Rate limiting check (use IP or session ID)
    const sessionId = (req.headers.get('x-forwarded-for')?.split(',')[0].trim()) || 'default';
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

    // RAG: Retrieve relevant context using keyword-based matching
    const embeddings = await getEmbeddings();
    
    // Use keyword matching to find relevant chunks
    const queryLower = userQuery.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 3);
    
    const relevantChunks = embeddings
      .map(chunk => {
        const textLower = chunk.text.toLowerCase();
        const matchCount = queryWords.filter(word => textLower.includes(word)).length;
        const matchScore = queryWords.length > 0 ? matchCount / queryWords.length : 0;
        return { chunk, similarity: matchScore };
      })
      .filter(result => result.similarity >= 0.3) // At least 30% word match
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    // Format context from relevant chunks
    const context = formatContextForLLM(relevantChunks);
    
    // Check if we have sufficient context
    const hasRelevantContext = relevantChunks.length > 0 && relevantChunks[0].similarity >= 0.3;

    // Construct system message with strict context guidance
    const contextInstruction = hasRelevantContext
      ? `**Relevant Context from Sushin's Bio Documents:**\n\n${context}\n\n**IMPORTANT:** Answer ONLY using the information above. Make logical inferences only when they are necessarily true. If the context doesn't contain specific information needed to answer the question, say so clearly and offer the contact form.`
      : `**No relevant context found** (insufficient keyword match).\n\nRespond that you don't have specific information about this topic and invite the user to use the contact form to reach Sushin directly with their question.`;

    // Check for API key with graceful failure
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'Chat is temporarily unavailable: missing API key configuration.' },
        { status: 503 }
      );
    }

    // Generate response with strict context adherence
    const { text: responseText } = await generateText({
      model: google('gemini-2.5-flash-lite'),
      messages: messages.slice(-5) as ChatMessage[], // Keep recent conversation history
      system: SYSTEM_PROMPT + `\n\n${contextInstruction}`,
      temperature: 0.3, // Lower temperature for more factual, less creative responses
      maxOutputTokens: 600,
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

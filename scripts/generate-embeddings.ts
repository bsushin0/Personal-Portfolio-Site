#!/usr/bin/env tsx
/**
 * Generate embeddings for portfolio documents using OpenAI API
 * 
 * Usage:
 *   OPENAI_API_KEY=your_key pnpm tsx scripts/generate-embeddings.ts
 * 
 * Output:
 *   lib/embeddings.json - Pre-computed embeddings for client-side RAG
 */

import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';
import { processCuratedDocuments } from '../lib/document-processor';
import type { DocumentChunk } from '../lib/document-processor';
import type { EmbeddingChunk } from '../lib/vector-search';

const PRIVATE_DIR = path.join(process.cwd(), 'private');
const OUTPUT_FILE = path.join(process.cwd(), 'lib', 'embeddings.json');

async function generateEmbeddings() {
  console.log('🚀 Starting embedding generation...\n');

  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable not set');
    console.error('   Get your API key from: https://platform.openai.com/api-keys');
    process.exit(1);
  }

  // Step 1: Process documents into chunks
  console.log('📄 Processing documents from private/ directory...');
  const chunks = await processCuratedDocuments(PRIVATE_DIR);

  if (chunks.length === 0) {
    console.error('❌ No chunks generated from documents');
    process.exit(1);
  }

  console.log(`✅ Generated ${chunks.length} text chunks\n`);

  // Step 2: Generate embeddings using Gemini
  console.log('🧠 Generating embeddings via OpenAI API...');
  console.log(`   Model: text-embedding-3-small`);
  console.log(`   Chunks to embed: ${chunks.length}\n`);

  // Initialize OpenAI client
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const embeddingChunks: EmbeddingChunk[] = [];

  try {
    // Process in batches of 100 (OpenAI supports batch embedding)
    const batchSize = 100;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(chunks.length / batchSize);

      console.log(`   Processing batch ${batchNum}/${totalBatches} (${batch.length} chunks)...`);

      // Generate embeddings for batch
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: batch.map(chunk => chunk.text),
      });

      // Combine chunks with their embeddings
      for (let j = 0; j < batch.length; j++) {
        embeddingChunks.push({
          ...batch[j],
          embedding: response.data[j].embedding,
        });
      }

      // Rate limiting: wait 500ms between batches
      if (i + batchSize < chunks.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`✅ Generated ${embeddingChunks.length} embeddings\n`);
  } catch (error) {
    console.error('❌ Error generating embeddings:', error);
    process.exit(1);
  }

  // Step 3: Calculate file size
  const jsonString = JSON.stringify(embeddingChunks, null, 2);
  const sizeInBytes = Buffer.byteLength(jsonString, 'utf8');
  const sizeInKB = (sizeInBytes / 1024).toFixed(2);
  const sizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2);

  console.log('📊 Embedding Statistics:');
  console.log(`   Total chunks: ${embeddingChunks.length}`);
  console.log(`   Embedding dimensions: ${embeddingChunks[0]?.embedding.length || 0}`);
  console.log(`   Output size: ${sizeInKB} KB (${sizeInMB} MB)`);
  console.log(`   Average chunk length: ${Math.round(chunks.reduce((sum, c) => sum + c.text.length, 0) / chunks.length)} characters\n`);

  // Step 4: Save to file
  console.log(`💾 Saving embeddings to ${OUTPUT_FILE}...`);
  
  // Ensure lib directory exists
  const libDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, jsonString, 'utf8');

  console.log('✅ Embeddings saved successfully!\n');

  // Step 5: Create a summary file for inspection
  const summaryFile = path.join(process.cwd(), 'lib', 'embeddings-summary.json');
  const summary = {
    generatedAt: new Date().toISOString(),
    totalChunks: embeddingChunks.length,
    embeddingDimensions: embeddingChunks[0]?.embedding.length || 0,
    fileSizeKB: parseFloat(sizeInKB),
    sources: Array.from(new Set(chunks.map(c => c.metadata.source))),
    averageChunkLength: Math.round(chunks.reduce((sum, c) => sum + c.text.length, 0) / chunks.length),
  };

  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
  console.log(`📋 Summary saved to ${summaryFile}\n`);

  console.log('🎉 Done! Embeddings are ready for use in the RAG chatbot.');
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Commit lib/embeddings.json to your repository`);
  console.log(`   2. Deploy to Vercel with GOOGLE_GENERATIVE_AI_API_KEY environment variable`);
  console.log(`   3. The chatbot will use these pre-computed embeddings at runtime\n`);
}

// Run the script
generateEmbeddings().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

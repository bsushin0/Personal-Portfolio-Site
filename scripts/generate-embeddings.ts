#!/usr/bin/env tsx
/**
 * Generate embeddings for portfolio documents
 * 
 * NOTE: Currently using keyword-based matching instead of semantic embeddings.
 * This script processes markdown files and creates placeholder embeddings
 * for compatibility with the existing structure. No API keys required.
 * 
 * Usage:
 *   pnpm tsx scripts/generate-embeddings.ts
 * 
 * Output:
 *   lib/embeddings.json - Document chunks with empty placeholder embeddings
 */

import * as fs from 'fs';
import * as path from 'path';
import { processCuratedDocuments } from '../lib/document-processor';
import type { EmbeddingChunk } from '../lib/vector-search';

const PRIVATE_DIR = path.join(process.cwd(), 'private');
const OUTPUT_FILE = path.join(process.cwd(), 'lib', 'embeddings.json');

async function generateEmbeddings() {
  console.log('🚀 Starting document processing...\n');

  // Step 1: Process documents into chunks
  console.log('📄 Processing documents from private/ directory...');
  const chunks = await processCuratedDocuments(PRIVATE_DIR);

  if (chunks.length === 0) {
    console.error('❌ No chunks generated from documents');
    process.exit(1);
  }

  console.log(`✅ Generated ${chunks.length} text chunks\n`);

  // Step 2: Create chunks with placeholder embeddings
  console.log('🧠 Creating placeholder embeddings (keyword-based matching)...');
  console.log(`   Mode: No API required - using keyword matching at runtime`);
  console.log(`   Chunks to process: ${chunks.length}\n`);

  // Create embedding chunks with empty vectors (not used in keyword matching)
  const embeddingChunks: EmbeddingChunk[] = chunks.map(chunk => ({
    ...chunk,
    embedding: [], // Empty array - embeddings not used with keyword matching
  }));

  console.log(`✅ Processed ${embeddingChunks.length} chunks\n`);

  // Step 3: Calculate file size
  const jsonString = JSON.stringify(embeddingChunks, null, 2);
  const sizeInBytes = Buffer.byteLength(jsonString, 'utf8');
  const sizeInKB = (sizeInBytes / 1024).toFixed(2);
  const sizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2);

  console.log('📊 Embedding Statistics:');
  console.log(`   Total chunks: ${embeddingChunks.length}`);
  console.log(`   Embedding dimensions: N/A (keyword-based matching)`);
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
    matchingStrategy: 'keyword-based',
    embeddingDimensions: 0,
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
  console.log(`   3. The chatbot will use keyword matching at runtime (no embedding API calls)\n`);
}

// Run the script
generateEmbeddings().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

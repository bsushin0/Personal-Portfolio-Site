import fs from 'fs';
import path from 'path';
import * as pdfModule from 'pdf-parse';

export interface DocumentChunk {
  id: string;
  text: string;
  metadata: {
    source: string;
    chunkIndex: number;
    totalChunks: number;
  };
}

/**
 * Extract text from a PDF file
 */
export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfCandidate = (pdfModule as unknown as { PDFParse?: unknown; default?: unknown }).PDFParse
      ?? (pdfModule as unknown as { default?: unknown }).default
      ?? (pdfModule as unknown as unknown);
    const pdfFn = typeof pdfCandidate === 'function'
      ? pdfCandidate
      : typeof (pdfCandidate as { default?: unknown })?.default === 'function'
        ? (pdfCandidate as { default: (buffer: Buffer) => Promise<{ text: string }> }).default
        : null;

    if (!pdfFn) {
      throw new Error('pdf-parse import did not resolve to a callable function');
    }

    const data = await pdfFn(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`Error extracting text from ${filePath}:`, error);
    return '';
  }
}

/**
 * Chunk text into segments of approximately maxTokens size
 * Simple implementation: splits by sentences and groups them
 */
export function chunkText(
  text: string,
  maxTokens: number = 512,
  overlapTokens: number = 50
): string[] {
  // Simple approximation: ~4 characters per token
  const maxChars = maxTokens * 4;
  const overlapChars = overlapTokens * 4;

  // Split by sentences (periods followed by space or end of string)
  const sentences = text.match(/[^.!?]+[.!?]+[\s]*/g) || [text];

  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    // If adding this sentence would exceed max, save current chunk and start new one
    if (currentChunk.length + sentence.length > maxChars && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      
      // Create overlap by taking the last portion of current chunk
      const overlapStart = Math.max(0, currentChunk.length - overlapChars);
      currentChunk = currentChunk.slice(overlapStart) + sentence;
    } else {
      currentChunk += sentence;
    }
  }

  // Add the last chunk if it has content
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(chunk => chunk.length > 20); // Filter out very short chunks
}

/**
 * Process a single PDF document into chunks
 */
export async function processDocument(
  filePath: string,
  maxTokens: number = 512
): Promise<DocumentChunk[]> {
  const text = await extractTextFromPDF(filePath);
  
  if (!text || text.length === 0) {
    console.warn(`No text extracted from ${filePath}`);
    return [];
  }

  const chunks = chunkText(text, maxTokens);
  const fileName = path.basename(filePath);

  return chunks.map((chunk, index) => ({
    id: `${fileName}-chunk-${index}`,
    text: chunk,
    metadata: {
      source: fileName,
      chunkIndex: index,
      totalChunks: chunks.length,
    },
  }));
}

/**
 * Process all PDF files in a directory
 */
export async function processDirectory(
  dirPath: string,
  maxTokens: number = 512
): Promise<DocumentChunk[]> {
  const allChunks: DocumentChunk[] = [];

  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return allChunks;
  }

  const files = fs.readdirSync(dirPath);
  const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

  console.log(`Found ${pdfFiles.length} PDF files in ${dirPath}`);

  for (const file of pdfFiles) {
    const filePath = path.join(dirPath, file);
    console.log(`Processing: ${file}`);
    
    const chunks = await processDocument(filePath, maxTokens);
    allChunks.push(...chunks);
    
    console.log(`  → Generated ${chunks.length} chunks`);
  }

  return allChunks;
}

/**
 * Process curated list of important documents
 * Returns chunks from the most relevant documents for the portfolio
 */
export async function processCuratedDocuments(
  privateDir: string
): Promise<DocumentChunk[]> {
  const documentsDir = path.join(privateDir, 'documents');
  const resumeDir = path.join(privateDir, 'resume');

  // Priority documents for RAG knowledge base
  const curatedFiles = [
    // Main resume
    path.join(resumeDir, 'sushin-bandha-resume.pdf'),
    
    // Key specialized resumes (if they exist)
    path.join(documentsDir, 'Sushin Bandha AI_CyberSec Resume.pdf'),
    path.join(documentsDir, 'Sushin Bandha IT - AI Intern.pdf'),
    
    // Recent cover letters showing communication style
    path.join(documentsDir, 'Sushin Bandha - Oracle Cover Letter.pdf'),
    path.join(documentsDir, 'Sushin Bandha - SAP Cover Letter.pdf'),
  ];

  const allChunks: DocumentChunk[] = [];

  for (const filePath of curatedFiles) {
    if (fs.existsSync(filePath)) {
      console.log(`Processing curated document: ${path.basename(filePath)}`);
      const chunks = await processDocument(filePath);
      allChunks.push(...chunks);
      console.log(`  → Generated ${chunks.length} chunks`);
    } else {
      console.log(`Skipping (not found): ${path.basename(filePath)}`);
    }
  }

  console.log(`\nTotal chunks from curated documents: ${allChunks.length}`);
  return allChunks;
}

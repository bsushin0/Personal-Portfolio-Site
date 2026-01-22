export interface EmbeddingChunk {
  id: string;
  text: string;
  embedding: number[];
  metadata: {
    source: string;
    chunkIndex: number;
    totalChunks: number;
  };
}

export interface SearchResult {
  chunk: EmbeddingChunk;
  similarity: number;
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Search for the most similar chunks to a query embedding
 */
export function searchSimilarChunks(
  queryEmbedding: number[],
  chunks: EmbeddingChunk[],
  topK: number = 3,
  minSimilarity: number = 0.5
): SearchResult[] {
  // Calculate similarity for each chunk
  const results: SearchResult[] = chunks.map(chunk => ({
    chunk,
    similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  // Filter by minimum similarity and sort by highest similarity
  return results
    .filter(result => result.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

/**
 * Format search results into context string for LLM
 */
export function formatContextForLLM(results: SearchResult[]): string {
  if (results.length === 0) {
    return 'No relevant information found in the knowledge base.';
  }

  const context = results
    .map((result, index) => {
      const { chunk, similarity } = result;
      return `[Document ${index + 1}: ${chunk.metadata.source}] (Relevance: ${(similarity * 100).toFixed(1)}%)\n${chunk.text}`;
    })
    .join('\n\n---\n\n');

  return context;
}

import { DocumentStats } from '../types/word';

export function calculateDocumentStats(html: string): DocumentStats {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const text = doc.body.textContent || '';

  // Extract clean words
  const wordsArray = text.trim().split(/\s+/).filter((w) => w.length > 0);
  const words = wordsArray.length;

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  // Paragraphs (p, h1, h2, h3, blockquote, li, tr)
  const paragraphElements = doc.querySelectorAll('p, h1, h2, h3, blockquote, li, tr');
  const paragraphs = Math.max(1, paragraphElements.length || text.split(/\n\s*\n/).filter(Boolean).length);

  // Approximate lines based on ~80 characters per line
  const lines = Math.max(1, Math.ceil(characters / 75));

  // Approximate pages (standard manuscript page is ~250-300 words)
  const pages = Math.max(1, Math.ceil(words / 280));

  // Average reading speed: 200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    words,
    characters,
    charactersNoSpaces,
    paragraphs,
    lines,
    pages,
    readingTimeMinutes,
  };
}

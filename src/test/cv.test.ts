import { describe, it, expect } from 'vitest';
import { buildCvDocument } from '../utils/generatePdfCv';
import { validateContentIntegrity } from '../data';

describe('CV Generation & Content Integrity Tests', () => {
  it('validates content data integrity according to strict rules', () => {
    const result = validateContentIntegrity();
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('builds a multi-page PDF document cleanly without errors', () => {
    const doc = buildCvDocument();
    expect(doc).toBeDefined();
    const pageCount = doc.getNumberOfPages();
    expect(pageCount).toBeGreaterThanOrEqual(1);
    expect(pageCount).toBeLessThanOrEqual(3);

    // Ensure output can be exported as arrayBuffer or string
    const output = doc.output();
    expect(typeof output).toBe('string');
    expect(output.startsWith('%PDF-')).toBe(true);
  });
});

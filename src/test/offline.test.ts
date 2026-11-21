import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Offline-First Architecture & Asset Verification', () => {
  const distDir = path.resolve(process.cwd(), 'dist');
  const indexHtmlPath = path.join(distDir, 'index.html');

  it('ensures dist/index.html was produced by the production build', () => {
    expect(fs.existsSync(indexHtmlPath)).toBe(true);
  });

  it('verifies zero remote CDN, script, font, or analytics URLs in dist/index.html', () => {
    const html = fs.readFileSync(indexHtmlPath, 'utf-8');

    // Check for common remote CDN domains or remote http(s) script/stylesheet tags
    const remoteLinkRegex = /<(?:link|script|img)[^>]*(?:href|src)=["']https?:\/\/[^"']+["'][^>]*>/gi;
    const matches = html.match(remoteLinkRegex) || [];

    // Filter out schema.org or xml namespaces
    const suspiciousRemoteTags = matches.filter(
      (tag: string) => !tag.includes('xmlns') && !tag.includes('og:')
    );

    expect(suspiciousRemoteTags).toEqual([]);

    // Check that asset paths in HTML are relative (./assets/...)
    expect(html).toContain('href="./');
    expect(html).toContain('src="./');
  });

  it('ensures offline service worker and manifest exist in dist/', () => {
    const swPath = path.join(distDir, 'sw.js');
    const manifestPath = path.join(distDir, 'manifest.json');
    const faviconPath = path.join(distDir, 'favicon.svg');

    expect(fs.existsSync(swPath)).toBe(true);
    expect(fs.existsSync(manifestPath)).toBe(true);
    expect(fs.existsSync(faviconPath)).toBe(true);
  });
});

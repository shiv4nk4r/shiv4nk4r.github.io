import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('chrome', () => {
  it('header includes a working mobile menu button', () => {
    const src = readFileSync('src/components/SiteHeader.astro', 'utf8');
    expect(src).toContain('aria-expanded');
    expect(src).toContain('LINKS.resume');
    expect(src).not.toContain('display: none');
  });

  it('contact leads with email, not phone', () => {
    const src = readFileSync('src/components/ContactBlock.astro', 'utf8');
    const emailAt = src.indexOf('EMAIL');
    const phoneAt = src.indexOf('PHONE');
    expect(emailAt).toBeGreaterThan(-1);
    expect(phoneAt).toBeGreaterThan(emailAt);
    expect(src.toLowerCase()).not.toMatch(/seeking|for hire/);
  });
});

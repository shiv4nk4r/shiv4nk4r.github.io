import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('cutover', () => {
  it('does not keep the prtfl redirect at repo root', () => {
    expect(existsSync('index.html')).toBe(false);
  });

  it('publishes the resume from public/', () => {
    expect(existsSync('public/ShivankarSharma.pdf')).toBe(true);
  });

  it('ships the custom domain', () => {
    expect(readFileSync('public/CNAME', 'utf8').trim()).toBe('shivankar.net');
  });

  it('does not publish SystemDesign.pdf in public/', () => {
    expect(existsSync('public/SystemDesign.pdf')).toBe(false);
  });
});

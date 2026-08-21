import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('page contracts', () => {
  it('home uses identity band, featured list, and archive columns', () => {
    const src = readFileSync('src/pages/index.astro', 'utf8');
    expect(src).toContain('IdentityBand');
    expect(src).toContain('featuredEntries');
    expect(src).toContain('ArchiveColumns');
    expect(src).not.toContain('prtfl.in');
  });

  it('work index wires filters to rows with data-category', () => {
    const list = readFileSync('src/components/WorkList.astro', 'utf8');
    const filters = readFileSync('src/components/WorkFilters.astro', 'utf8');
    expect(list).toContain('data-category');
    expect(filters).toContain('aria-pressed');
    expect(filters).toContain('data-filter');
    expect(filters).toContain('<script>');
  });

  it('case study layout renders the four section titles via content', () => {
    const src = readFileSync('src/components/CaseStudyLayout.astro', 'utf8');
    expect(src).toContain('render');
    expect(src).toContain('entry.data.org');
  });

  it('writing index lists posts from the writing collection', () => {
    const src = readFileSync('src/pages/writing/index.astro', 'utf8');
    expect(src).toContain("getCollection('writing')");
    expect(src).toContain('No posts yet.');
  });
});

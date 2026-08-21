import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FEATURED_SLUGS } from '../src/lib/work';
import { assertRequiredHeadings } from '../src/lib/headings';

const workDir = join(process.cwd(), 'src/content/work');

describe('work markdown', () => {
  it('includes every featured slug as a file', () => {
    const files = readdirSync(workDir);
    for (const slug of FEATURED_SLUGS) {
      expect(files).toContain(`${slug}.md`);
    }
  });

  it('has required headings on every work file', () => {
    for (const file of readdirSync(workDir).filter((f) => f.endsWith('.md'))) {
      const body = readFileSync(join(workDir, file), 'utf8').replace(/^---[\s\S]*?---/, '');
      expect(() => assertRequiredHeadings(body), file).not.toThrow();
    }
  });

  it('marks featured slugs featured: true', () => {
    for (const slug of FEATURED_SLUGS) {
      const raw = readFileSync(join(workDir, `${slug}.md`), 'utf8');
      expect(raw).toMatch(/featured:\s*true/);
    }
  });
});

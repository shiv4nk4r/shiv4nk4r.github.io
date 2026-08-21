// tests/headings.test.ts
import { describe, expect, it } from 'vitest';
import { REQUIRED_HEADINGS, assertRequiredHeadings } from '../src/lib/headings';

const complete = '## Problem\nA\n## Approach\nB\n## Outcome\nC\n## Tech\nD\n';

describe('assertRequiredHeadings', () => {
  it('lists the four spec headings', () => {
    expect([...REQUIRED_HEADINGS]).toEqual([
      '## Problem',
      '## Approach',
      '## Outcome',
      '## Tech',
    ]);
  });

  it('accepts a complete body', () => {
    expect(() => assertRequiredHeadings(complete)).not.toThrow();
  });

  it('throws on the first missing heading', () => {
    expect(() =>
      assertRequiredHeadings('## Problem\n## Approach\n## Tech\n'),
    ).toThrow('Missing ## Outcome');
  });
});

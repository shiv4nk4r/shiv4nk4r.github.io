import { describe, expect, it } from 'vitest';
import {
  FEATURED_SLUGS,
  WORK_FILTERS,
  WORK_TAGS,
  featuredEntries,
  matchesCategory,
  sortByDateDesc,
} from '../src/lib/work';

describe('work helpers', () => {
  it('locks featured order from the spec', () => {
    expect([...FEATURED_SLUGS]).toEqual([
      'pm-orchestrator',
      'operator-assignment',
      'multi-pallet-palletization',
      'quadtree-dashboard',
      'korao',
      'visit-health-pharmacy',
    ]);
  });

  it('tags featured selected-work rows', () => {
    expect(WORK_TAGS['pm-orchestrator']).toEqual(['AI workflows', 'MCP']);
    expect(WORK_TAGS['operator-assignment']).toEqual(['MILP']);
    expect(WORK_TAGS['multi-pallet-palletization']).toEqual(['ALNS', 'OR']);
  });

  it('lists filters starting with All', () => {
    expect(WORK_FILTERS.map((f) => f.id)).toEqual([
      'all',
      'industry',
      'research',
      'personal',
      'college',
    ]);
  });

  it('matches all vs a category', () => {
    expect(matchesCategory('industry', 'all')).toBe(true);
    expect(matchesCategory('industry', 'industry')).toBe(true);
    expect(matchesCategory('college', 'industry')).toBe(false);
  });

  it('sorts newest first', () => {
    const entries = [
      { data: { date: new Date('2022-01-01') } },
      { data: { date: new Date('2025-06-01') } },
    ];
    expect(sortByDateDesc(entries).map((e) => e.data.date.getUTCFullYear())).toEqual([
      2025, 2022,
    ]);
  });

  it('returns featured entries in FEATURED_SLUGS order', () => {
    const entries = [
      { id: 'claw-net', data: { featured: true, date: new Date('2018-01-01') } },
      { id: 'korao', data: { featured: true, date: new Date('2026-01-01') } },
      { id: 'ascii-camera', data: { featured: false, date: new Date('2022-01-01') } },
    ];
    expect(featuredEntries(entries).map((e) => e.id)).toEqual(['korao']);
  });
});

export type WorkCategory = 'industry' | 'research' | 'personal' | 'college';
export type WorkFilter = WorkCategory | 'all';

export const FEATURED_SLUGS = [
  'operator-assignment',
  'multi-pallet-palletization',
  'quadtree-dashboard',
  'korao',
  'visit-health-pharmacy',
  'claw-net',
] as const;

export const WORK_FILTERS: readonly { id: WorkFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'industry', label: 'Industry' },
  { id: 'research', label: 'Research' },
  { id: 'personal', label: 'Personal' },
  { id: 'college', label: 'College' },
];

export function matchesCategory(category: WorkCategory, filter: WorkFilter): boolean {
  return filter === 'all' || category === filter;
}

export function sortByDateDesc<T extends { data: { date: Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function featuredEntries<
  T extends { id: string; data: { featured: boolean; date: Date } },
>(entries: T[]): T[] {
  const byId = new Map(entries.filter((e) => e.data.featured).map((e) => [e.id, e]));
  return FEATURED_SLUGS.map((slug) => byId.get(slug)).filter(
    (entry): entry is T => entry !== undefined,
  );
}

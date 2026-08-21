export const REQUIRED_HEADINGS = [
  '## Problem',
  '## Approach',
  '## Outcome',
  '## Tech',
] as const;

export function assertRequiredHeadings(body: string): void {
  for (const heading of REQUIRED_HEADINGS) {
    if (!body.includes(heading)) {
      throw new Error(`Missing ${heading}`);
    }
  }
}

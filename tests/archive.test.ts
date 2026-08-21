import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const archive = JSON.parse(
  readFileSync(new URL('../src/content/archive.json', import.meta.url), 'utf8'),
);

describe('archive.json', () => {
  it('has the three home columns', () => {
    expect(Object.keys(archive)).toEqual(['experience', 'education', 'awards']);
  });

  it('leads experience with GreyOrange', () => {
    expect(archive.experience[0].title).toMatch(/GreyOrange/);
  });

  it('includes IIITD in education', () => {
    expect(archive.education.some((row: { detail: string }) => /IIITD/.test(row.detail))).toBe(
      true,
    );
  });

  it('includes Geek with Guts and ZooHackathon', () => {
    const text = archive.awards.map((row: { title: string }) => row.title).join(' ');
    expect(text).toMatch(/Geek with Guts/);
    expect(text).toMatch(/ZooHackathon/);
  });
});

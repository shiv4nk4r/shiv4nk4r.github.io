import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const archive = JSON.parse(
  readFileSync(new URL('../src/content/archive.json', import.meta.url), 'utf8'),
);

describe('archive.json', () => {
  it('anchors experience and education for header jump links', () => {
    const src = readFileSync(new URL('../src/components/ArchiveColumns.astro', import.meta.url), 'utf8');
    expect(src).toContain("id: 'experience'");
    expect(src).toContain("id: 'education'");
    expect(src).toContain('id={column.id}');
  });

  it('has the four home columns', () => {
    expect(Object.keys(archive)).toEqual([
      'experience',
      'volunteer',
      'education',
      'awards',
    ]);
  });

  it('keeps campus roles under volunteer', () => {
    const titles = archive.volunteer.map((row: { title: string }) => row.title).join(' ');
    expect(titles).toMatch(/INK/);
    expect(titles).toMatch(/Esya/);
    expect(titles).toMatch(/SYNC/);
    expect(archive.experience.some((row: { title: string }) => /MPN|Vikalp/.test(row.title))).toBe(
      false,
    );
  });

  it('clubs GreyOrange into one experience with role progression', () => {
    const go = archive.experience.filter((row: { title: string }) =>
      /GreyOrange/.test(row.title),
    );
    expect(go).toHaveLength(1);
    expect(go[0].period).toBe('Nov 2022–Aug 2026');
    expect(go[0].logo).toBe('/logos/greyorange.png');
    expect(go[0].roles.map((role: { title: string }) => role.title)).toEqual([
      'Artificial Intelligence Engineer II',
      'SDE 2',
      'Software Developer',
    ]);
  });

  it('leads education with the Newcastle MSc', () => {
    expect(archive.education[0].title).toMatch(/Advanced Computer Science/);
    expect(archive.education[0].detail).toMatch(/Newcastle University/);
    expect(archive.education[0].period).toBe('2026–2027');
    expect(archive.education[0].logo).toBe('/logos/newcastle.png');
  });

  it('includes IIITD in education', () => {
    const iiitd = archive.education.find((row: { detail: string }) =>
      /Indraprastha Institute of Information Technology/.test(row.detail),
    );
    expect(iiitd).toBeTruthy();
    expect(iiitd.logo).toBe('/logos/iiitd.svg');
  });

  it('uses Visit Health and GreyOrange marks on experience', () => {
    const visit = archive.experience.find((row: { title: string }) => row.title === 'Visit Health');
    const freelance = archive.experience.find((row: { title: string }) => row.title === 'Freelance');
    expect(visit.logo).toBe('/logos/visit-health.svg');
    expect(freelance.logo).toBe('/logos/freelance.svg');
  });

  it('uses the CBSE mark for school rows', () => {
    const school = archive.education.filter((row: { title: string }) => /Class/.test(row.title));
    expect(school).toHaveLength(2);
    expect(school.every((row: { logo?: string }) => row.logo === '/logos/cbse.png')).toBe(true);
  });

  it('includes Geek with Guts and ZooHackathon', () => {
    const text = archive.awards.map((row: { title: string }) => row.title).join(' ');
    expect(text).toMatch(/Geek with Guts/);
    expect(text).toMatch(/ZooHackathon/);
  });
});

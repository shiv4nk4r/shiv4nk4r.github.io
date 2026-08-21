import { describe, expect, it } from 'vitest';
import {
  EMAIL,
  HEADLINE,
  LINKS,
  NAV,
  PHONE,
  SITE_NAME,
  SITE_URL,
  SKILLS,
} from '../src/lib/site';

describe('site constants', () => {
  it('uses the canonical domain', () => {
    expect(SITE_URL).toBe('https://shivankar.net');
    expect(SITE_NAME).toBe('Shivankar Sharma');
  });

  it('keeps dual-use identity copy', () => {
    expect(HEADLINE).toBe('Engineer and researcher.');
    expect(HEADLINE.toLowerCase()).not.toMatch(/seeking|hire|open to work/);
  });

  it('exposes nav in spec order', () => {
    expect(NAV).toEqual([
      { href: '/work', label: 'Work' },
      { href: '/writing', label: 'Writing' },
      { href: '/contact', label: 'Contact' },
    ]);
  });

  it('lists home skills without numeric grades', () => {
    expect([...SKILLS]).toEqual([
      'Node.js',
      'Erlang',
      'Spring',
      'React',
      'Python',
      'SQL',
      'OR / VRP',
    ]);
  });

  it('exposes contact and resume links', () => {
    expect(EMAIL).toBe('shivankar1234@gmail.com');
    expect(PHONE).toBe('9891949387');
    expect(LINKS).toEqual({
      linkedin: 'https://www.linkedin.com/in/shiv4nk4r',
      github: 'https://github.com/shiv4nk4r',
      behance: 'https://www.behance.net/shivankar199',
      resume: '/ShivankarSharma.pdf',
    });
  });
});

import { describe, expect, it } from 'vitest';
import {
  canonicalUrl,
  EMAIL,
  HEADLINE,
  LINKS,
  NAV,
  PHONE,
  PHONE_TEL,
  SITE_NAME,
  SITE_URL,
  SKILLS,
} from '../src/lib/site';

describe('site constants', () => {
  it('uses the canonical domain', () => {
    expect(SITE_URL).toBe('https://shiv4nk4r.github.io');
    expect(SITE_NAME).toBe('Shivankar Sharma');
  });

  it('omits the trailing slash only for the homepage canonical URL', () => {
    expect(canonicalUrl('/')).toBe('https://shiv4nk4r.github.io');
    expect(canonicalUrl('/work')).toBe('https://shiv4nk4r.github.io/work');
  });

  it('keeps dual-use identity copy', () => {
    expect(HEADLINE).toBe('Engineer and researcher.');
    expect(HEADLINE.toLowerCase()).not.toMatch(/seeking|hire|open to work/);
  });

  it('exposes nav in spec order', () => {
    expect(NAV).toEqual([
      { href: '/work', label: 'Work' },
      { href: '/#experience', label: 'Experience' },
      { href: '/#education', label: 'Education' },
      { href: '/writing', label: 'Writing' },
      { href: '/#contact', label: 'Contact' },
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
    expect(EMAIL).toBe('devwithshiv@gmail.com');
    expect(PHONE).toBe('+44 7352 697394');
    expect(PHONE_TEL).toBe('+447352697394');
    expect(LINKS).toEqual({
      linkedin: 'https://www.linkedin.com/in/shiv4nk4r',
      github: 'https://github.com/shiv4nk4r',
      behance: 'https://www.behance.net/shivankar199',
      resume: '/ShivankarSharma.pdf',
    });
  });
});

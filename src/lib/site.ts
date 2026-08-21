export const SITE_URL = 'https://shivankar.net';
export const SITE_NAME = 'Shivankar Sharma';
export const HEADLINE = 'Engineer and researcher.';
export const INTRO =
  'Full-stack systems and operations research for warehouse robotics. CS + Design, IIITD.';

export const canonicalUrl = (path: string) =>
  path === '/' ? SITE_URL : new URL(path, SITE_URL).toString();

export const SKILLS = [
  'Node.js',
  'Erlang',
  'Spring',
  'React',
  'Python',
  'SQL',
  'OR / VRP',
] as const;

export const EMAIL = 'shivankar1234@gmail.com';
export const PHONE = '9891949387';

export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/shiv4nk4r',
  github: 'https://github.com/shiv4nk4r',
  behance: 'https://www.behance.net/shivankar199',
  resume: '/ShivankarSharma.pdf',
} as const;

export const NAV = [
  { href: '/work', label: 'Work' },
  { href: '/writing', label: 'Writing' },
  { href: '/contact', label: 'Contact' },
] as const;

export const SITE_URL = 'https://shiv4nk4r.github.io';
export const SITE_NAME = 'Shivankar Sharma';
export const HEADLINE = 'Engineer and researcher.';
export const INTRO =
  'Software and AI Engineer with 4+ years building high-performance systems in warehouse robotics. At GreyOrange I shipped full-stack product, then moved into R&D as an Operations Research Scientist designing production solvers for routing and 3D packing. I now build applied-AI workflows with MCP, agent toolchains, and LLM pipelines grounded in live codebases.';

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

export const EMAIL = 'devwithshiv@gmail.com';
export const PHONE = '+44 7352 697394';
export const PHONE_TEL = '+447352697394';

export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/shiv4nk4r',
  github: 'https://github.com/shiv4nk4r',
  resume: '/ShivankarSharma.pdf',
} as const;

export const NAV = [
  { href: '/#experience', label: 'Experience' },
  { href: '/#education', label: 'Education' },
  { href: '/work', label: 'Work' },
  { href: '/writing', label: 'Writing' },
  { href: '/#contact', label: 'Contact' },
] as const;

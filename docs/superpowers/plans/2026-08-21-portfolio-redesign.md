# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the student-era HTML site and `prtfl.in` redirect with a static Astro portfolio that skims on home, deep-dives per project, and hosts writing.

**Architecture:** Astro static site. Work and writing are Markdown content collections. Home archive columns come from `src/content/archive.json`. Pure helpers in `src/lib/` own filtering, featured order, and required case-study headings. One client island on `/work` toggles category filters in the DOM. GitHub Actions builds `dist/` and deploys to GitHub Pages.

**Tech Stack:** Astro 5, TypeScript, Vitest, vanilla CSS, GitHub Pages (`actions/upload-pages-artifact` + `actions/deploy-pages`). No React, no CMS, no Tailwind.

## Global Constraints

- Dual-use professional voice. Never write “currently seeking”, “for hire”, or “open to work”.
- Canonical URL and `og:url`: `https://shivankar.net`.
- Visual tokens: page `#f7f7f5`, ink `#111213`, hairline `#e4e4e0`, band `#111213`, mint on light `#0d9f6e`, mint on black `#5ee9b6`.
- Type: Syne (headlines), IBM Plex Sans (body/UI), IBM Plex Mono (dates, numbers, tech, labels).
- Nav: Shivankar Sharma `/`, Work `/work`, Writing `/writing`, Contact `/contact`, Resume `/ShivankarSharma.pdf` (new tab).
- Case studies require `## Problem`, `## Approach`, `## Outcome`, `## Tech` in that sense (all four present).
- Featured slugs in this order: `operator-assignment`, `multi-pallet-palletization`, `quadtree-dashboard`, `korao`, `visit-health-pharmacy`, `claw-net`.
- Contact: `shivankar1234@gmail.com`, LinkedIn `https://www.linkedin.com/in/shiv4nk4r`, GitHub `https://github.com/shiv4nk4r`, Behance `https://www.behance.net/shivankar199`, phone `9891949387` not as the lead line. No Facebook or Instagram.
- Do not link or ship `SystemDesign.pdf` in the public site. Do not meta-refresh to `prtfl.in`.
- No splash loader. Mobile nav must work (do not hide the menu under 1000px).
- Copy: professional English, no invented metrics. Use existing numbers only: ~85% of theoretical best (operator assignment), 5× dashboard load (QuadTree), 40% server response (GreyOrange SDE 2), 50% processing / 35% hardware efficiency / 20% fewer malfunctions (GreyOrange software developer), 50% engagement / 20% response (Visit Health).

---

## File structure

Create:

- `package.json` — scripts: `dev`, `build`, `preview`, `check`, `test`
- `astro.config.mjs` — `site: 'https://shivankar.net'`, static output
- `tsconfig.json` — Astro strict
- `vitest.config.ts`
- `.gitignore` — keep `.superpowers/`; add `node_modules/`, `dist/`, `.astro/`
- `.github/workflows/deploy.yml`
- `public/CNAME` — `shivankar.net`
- `public/ShivankarSharma.pdf` — moved from repo root
- `src/content.config.ts` — `work` and `writing` collections
- `src/content/work/*.md` — one file per case study
- `src/content/writing/quadtree-performance.md`
- `src/content/archive.json`
- `src/lib/site.ts` — URLs, nav, skills, headline
- `src/lib/work.ts` — featured slugs, sort, `matchesCategory`
- `src/lib/headings.ts` — required heading check
- `src/styles/global.css` — tokens, reset, layout, motion
- `src/layouts/BaseLayout.astro`
- `src/components/SiteHeader.astro`
- `src/components/SiteFooter.astro`
- `src/components/IdentityBand.astro`
- `src/components/WorkList.astro`
- `src/components/WorkFilters.astro` — category buttons plus a `<script>` that shows/hides `data-category` rows
- `src/components/ArchiveColumns.astro`
- `src/components/CaseStudyLayout.astro`
- `src/components/ArticleLayout.astro`
- `src/components/ContactBlock.astro`
- `src/pages/index.astro`
- `src/pages/work/index.astro`
- `src/pages/work/[slug].astro`
- `src/pages/writing/index.astro`
- `src/pages/writing/[slug].astro`
- `src/pages/contact.astro`
- `src/pages/404.astro`
- `tests/site.test.ts`
- `tests/work.test.ts`
- `tests/headings.test.ts`
- `tests/archive.test.ts`
- `tests/content-files.test.ts`

Delete when the new site builds:

- `index.html` (contains the `prtfl.in` redirect)
- `style/` (old SCSS/CSS)
- `docs/index.html` (CDN stub)

Keep: `docs/superpowers/`, `SystemDesign.pdf` at repo root (not copied to `public/`).

---

### Task 1: Site constants, tokens, and Astro scaffold

**Files:**
- Create: `tests/site.test.ts`
- Create: `src/lib/site.ts`
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `src/env.d.ts`
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/pages/index.astro`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: nothing
- Produces: `SITE_URL`, `SITE_NAME`, `HEADLINE`, `INTRO`, `SKILLS`, `EMAIL`, `PHONE`, `LINKS`, `NAV` from `src/lib/site.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/site.test.ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/site.test.ts`

Expected: FAIL (cannot find `src/lib/site` or vitest not installed).

- [ ] **Step 3: Write minimal implementation**

`package.json`:

```json
{
  "name": "shivankar-net",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run"
  }
}
```

Install: `npm install astro @astrojs/check typescript` and `npm install -D vitest`.

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://shivankar.net',
  output: 'static',
});
```

`tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "types": ["vitest/globals"],
    "resolveJsonModule": true
  },
  "include": [".astro/types.d.ts", "src/**/*", "tests/**/*"]
}
```

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  },
});
```

`src/env.d.ts`:

```ts
/// <reference path="../.astro/types.d.ts" />
```

`src/lib/site.ts`:

```ts
export const SITE_URL = 'https://shivankar.net';
export const SITE_NAME = 'Shivankar Sharma';
export const HEADLINE = 'Engineer and researcher.';
export const INTRO =
  'Full-stack systems and operations research for warehouse robotics. CS + Design, IIITD.';

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
```

Append to `.gitignore` (keep `.superpowers/`):

```
node_modules/
dist/
.astro/
```

`src/styles/global.css`:

```css
:root {
  --page: #f7f7f5;
  --ink: #111213;
  --muted: color-mix(in srgb, var(--ink) 45%, transparent);
  --hairline: #e4e4e0;
  --band: #111213;
  --mint: #0d9f6e;
  --mint-on-black: #5ee9b6;
  --max: 72rem;
  --font-display: 'Syne', sans-serif;
  --font-body: 'IBM Plex Sans', sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--page);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 18px;
  line-height: 1.5;
}

a {
  color: inherit;
  text-decoration-color: var(--mint);
  text-underline-offset: 0.15em;
}

a:hover {
  color: var(--mint);
}

a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--mint);
  outline-offset: 3px;
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: -3rem;
  background: var(--band);
  color: var(--mint-on-black);
  padding: 0.5rem 0.75rem;
  z-index: 20;
}

.skip-link:focus {
  top: 1rem;
}

.wrap {
  width: min(var(--max), calc(100% - 3rem));
  margin-inline: auto;
}

h1,
h2,
.display {
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
}

.mono,
.year,
.tech,
.label {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.rise {
  animation: rise 0.5s ease both;
}
```

`src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/global.css';
import { SITE_NAME, SITE_URL } from '../lib/site';

interface Props {
  title: string;
  description: string;
  path?: string;
}

const { title, description, path = '/' } = Astro.props;
const canonical = new URL(path, SITE_URL).toString();
const pageTitle = title === SITE_NAME ? SITE_NAME : `${title} · ${SITE_NAME}`;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{pageTitle}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:type" content="website" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Syne:wght@500;700;800&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <a class="skip-link" href="#content">Skip to content</a>
    <slot name="header" />
    <main id="content">
      <slot />
    </main>
    <slot name="footer" />
  </body>
</html>
```

`src/pages/index.astro` (stub until Task 6):

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { HEADLINE, INTRO, SITE_NAME } from '../lib/site';
---

<BaseLayout title={SITE_NAME} description={INTRO}>
  <h1 class="display wrap">{HEADLINE}</h1>
</BaseLayout>
```

- [ ] **Step 4: Run the tests and a build**

Run: `npm test && npx astro build`

Expected: Vitest PASS. Build succeeds. `dist/index.html` exists and does not contain `prtfl.in` yet (old `index.html` is still at repo root; do not delete until Task 8).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts .gitignore src/env.d.ts src/lib/site.ts src/styles/global.css src/layouts/BaseLayout.astro src/pages/index.astro tests/site.test.ts
git commit -m "$(cat <<'EOF'
Add Astro scaffold and site constants for the redesign.

EOF
)"
```

---

### Task 2: Work helpers (featured order and category filter)

**Files:**
- Create: `tests/work.test.ts`
- Create: `src/lib/work.ts`

**Interfaces:**
- Consumes: nothing from Task 1 besides test runner
- Produces:
  - `export type WorkCategory = 'industry' | 'research' | 'personal' | 'college'`
  - `export type WorkFilter = WorkCategory | 'all'`
  - `export const FEATURED_SLUGS: readonly string[]`
  - `export const WORK_FILTERS: readonly { id: WorkFilter; label: string }[]`
  - `export function matchesCategory(category: WorkCategory, filter: WorkFilter): boolean`
  - `export function sortByDateDesc<T extends { data: { date: Date } }>(entries: T[]): T[]`
  - `export function featuredEntries<T extends { id: string; data: { featured: boolean; date: Date } }>(entries: T[]): T[]`

- [ ] **Step 1: Write the failing test**

```ts
// tests/work.test.ts
import { describe, expect, it } from 'vitest';
import {
  FEATURED_SLUGS,
  WORK_FILTERS,
  featuredEntries,
  matchesCategory,
  sortByDateDesc,
} from '../src/lib/work';

describe('work helpers', () => {
  it('locks featured order from the spec', () => {
    expect([...FEATURED_SLUGS]).toEqual([
      'operator-assignment',
      'multi-pallet-palletization',
      'quadtree-dashboard',
      'korao',
      'visit-health-pharmacy',
      'claw-net',
    ]);
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
    expect(featuredEntries(entries).map((e) => e.id)).toEqual(['korao', 'claw-net']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/work.test.ts`

Expected: FAIL — `src/lib/work` is not defined.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/work.ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/work.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/work.ts tests/work.test.ts
git commit -m "$(cat <<'EOF'
Add work sorting, filters, and featured slug order.

EOF
)"
```

---

### Task 3: Required case-study headings

**Files:**
- Create: `tests/headings.test.ts`
- Create: `src/lib/headings.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `export const REQUIRED_HEADINGS = ['## Problem', '## Approach', '## Outcome', '## Tech'] as const`
  - `export function assertRequiredHeadings(body: string): void` — throws `Error('Missing <heading>')` for the first missing heading

- [ ] **Step 1: Write the failing test**

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/headings.test.ts`

Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/headings.ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/headings.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/headings.ts tests/headings.test.ts
git commit -m "$(cat <<'EOF'
Require Problem, Approach, Outcome, and Tech headings on case studies.

EOF
)"
```

---

### Task 4: Content collections, archive data, and all Markdown

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/archive.json`
- Create: `src/content/work/*.md` (every file listed below)
- Create: `src/content/writing/quadtree-performance.md`
- Create: `tests/content-files.test.ts`
- Create: `tests/archive.test.ts`

**Interfaces:**
- Consumes: `assertRequiredHeadings`, `FEATURED_SLUGS`, `WorkCategory`
- Produces: Astro collections `work` and `writing`; `archive.json` shape `{ experience, education, awards }` where each item is `{ title, detail, period?, href? }`

Work Zod schema (in `content.config.ts`):

```ts
title: z.string()
date: z.coerce.date()
org: z.string()
category: z.enum(['industry', 'research', 'personal', 'college'])
featured: z.boolean().default(false)
summary: z.string()
tech: z.array(z.string())
links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([])
```

Writing schema:

```ts
title: z.string()
date: z.coerce.date()
summary: z.string()
```

- [ ] **Step 1: Write the failing tests**

```ts
// tests/archive.test.ts
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
```

```ts
// tests/content-files.test.ts
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FEATURED_SLUGS } from '../src/lib/work';
import { assertRequiredHeadings } from '../src/lib/headings';

const workDir = join(process.cwd(), 'src/content/work');

describe('work markdown', () => {
  it('includes every featured slug as a file', () => {
    const files = readdirSync(workDir);
    for (const slug of FEATURED_SLUGS) {
      expect(files).toContain(`${slug}.md`);
    }
  });

  it('has required headings on every work file', () => {
    for (const file of readdirSync(workDir).filter((f) => f.endsWith('.md'))) {
      const body = readFileSync(join(workDir, file), 'utf8').replace(/^---[\s\S]*?---/, '');
      expect(() => assertRequiredHeadings(body), file).not.toThrow();
    }
  });

  it('marks featured slugs featured: true', () => {
    for (const slug of FEATURED_SLUGS) {
      const raw = readFileSync(join(workDir, `${slug}.md`), 'utf8');
      expect(raw).toMatch(/featured:\s*true/);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/archive.test.ts tests/content-files.test.ts`

Expected: FAIL — missing `src/content/archive.json` and `src/content/work`.

- [ ] **Step 3: Write collections, archive, and Markdown**

`src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    org: z.string(),
    category: z.enum(['industry', 'research', 'personal', 'college']),
    featured: z.boolean().default(false),
    summary: z.string(),
    tech: z.array(z.string()),
    links: z
      .array(z.object({ label: z.string(), href: z.string().url() }))
      .default([]),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
  }),
});

export const collections = { work, writing };
```

`src/content/archive.json` — use this exact JSON:

```json
{
  "experience": [
    {
      "title": "GreyOrange · Operations Research Scientist",
      "period": "2025–2026",
      "detail": "R&D for warehouse robotics: operator assignment (VRP) and multi-pallet palletization.",
      "href": "/work/operator-assignment"
    },
    {
      "title": "GreyOrange · SDE 2",
      "period": "2024–2026",
      "detail": "Manager dashboard and backend systems in Node.js, Erlang, and Spring Boot.",
      "href": "/work/quadtree-dashboard"
    },
    {
      "title": "GreyOrange · Software Developer",
      "period": "2022–2024",
      "detail": "Scalable backends and a hardware integration service for fulfillment systems."
    },
    {
      "title": "Visit Health · Full-stack Developer",
      "period": "2022",
      "detail": "Pharmacy e-commerce in Node.js, SQL, and React.",
      "href": "/work/visit-health-pharmacy"
    },
    {
      "title": "Freelance · Full-stack Developer",
      "period": "2020–2022",
      "detail": "Product work including a sports pick’em league and commerce PWAs.",
      "href": "/work/pickem-tournament"
    },
    {
      "title": "MPN Technologies · Full-stack Developer",
      "period": "2018",
      "detail": "Website and server for a short product engagement."
    },
    {
      "title": "Vikalp · Game Developer Lead",
      "period": "2018",
      "detail": "Led an educational Android game and in-house animation tooling."
    },
    {
      "title": "INK, IIIT Delhi · Member",
      "period": "2018–2021",
      "detail": "Student technical community at IIITD."
    },
    {
      "title": "Esya · Event organiser / volunteer",
      "period": "2017–2018",
      "detail": "Design hackathon at IIIT Delhi."
    },
    {
      "title": "SYNC, New Era Public School · Design Head / Computer Prefect",
      "period": "2015–2017",
      "detail": "Student council; graphic, web, and motion work for the school tech team."
    }
  ],
  "education": [
    {
      "title": "B.Tech, Computer Science and Design",
      "period": "2017–2021",
      "detail": "Indraprastha Institute of Information Technology, Delhi (IIITD). Double major."
    },
    {
      "title": "Class XII, Computer Science",
      "period": "2016–2017",
      "detail": "New Era Public School, Mayapuri. CBSE."
    },
    {
      "title": "Class X",
      "period": "2014–2015",
      "detail": "New Era Public School, Mayapuri. CBSE."
    }
  ],
  "awards": [
    {
      "title": "Geek with Guts",
      "period": "2024",
      "detail": "GreyOrange. Technical architecture, mentoring, and product impact."
    },
    {
      "title": "ZooHackathon 2018",
      "period": "2018",
      "detail": "1st Asia-Pacific, 2nd world. WWF, TRAFFIC, and the U.S. government.",
      "href": "/work/claw-net"
    },
    {
      "title": "ZooHackathon 2017",
      "period": "2017",
      "detail": "Runner-up, Asia-Pacific. Poacher detection with on-site cameras.",
      "href": "/work/poacher-detection"
    },
    {
      "title": "Design Hackathon, Amity University",
      "period": "2019",
      "detail": "First place. Safety-focused app concept."
    },
    {
      "title": "Dean’s List",
      "period": "2019",
      "detail": "IIIT Delhi."
    },
    {
      "title": "Code the Web, Exun",
      "period": "2016",
      "detail": "First prize, web design, Delhi Public School tech fest."
    },
    {
      "title": "Best video editor, TAFS Technogeeks",
      "period": "2016",
      "detail": "The Air Force School tech fest."
    },
    {
      "title": "Excellence in computers / four-year scholar",
      "period": "2016",
      "detail": "New Era Public School."
    }
  ]
}
```

Write these Markdown files verbatim.

`src/content/work/operator-assignment.md`:

```markdown
---
title: Operator assignment
date: 2025-06-01
org: GreyOrange
category: research
featured: true
summary: Synchronizing human operators with robotic tasks by modeling assignment as a vehicle routing problem.
tech: [Python, OR-Tools, Node.js]
links: []
---

## Problem

Warehouse operators and robots were assigned independently. Idle time stacked up, and service levels slipped when a human was not where a robot needed them.

## Approach

I scoped the work as a vehicle routing problem, then compared heuristics, constraint solvers, and a custom search against production-scale logs. The solver had to respect skills, travel, and live warehouse constraints—not a textbook VRP.

## Outcome

The assignment solver reached ~85% of the theoretical best of the existing algorithm and was used in production assignment.

## Tech

Python, OR-Tools, and Node.js services that exposed assignments to the warehouse stack.
```

`src/content/work/multi-pallet-palletization.md`:

```markdown
---
title: Multi-pallet palletization
date: 2025-09-01
org: GreyOrange
category: research
featured: true
summary: A two-phase heuristic plus Adaptive Large Neighborhood Search for 3D multi-pallet bin packing at warehouse scale.
tech: [Python, heuristics, ALNS]
links:
  - label: GitHub
    href: https://github.com/shiv4nk4r/multi-pallet-palletizer
---

## Problem

Multi-pallet 3D packing is a bin-packing problem that standard constraint solvers did not finish on large, real fulfillment datasets.

## Approach

I designed a two-phase strategy: a fast constructive heuristic for a feasible packing, then Adaptive Large Neighborhood Search to refine it. The work included benchmarking heuristics, constraint solvers, and metaheuristics on internal data.

## Outcome

The pipeline produced usable packings on dataset sizes where a straight constraint model stalled. Research and code live in the public palletizer repo.

## Tech

Python, custom heuristics, and ALNS. See the GitHub repository for the solver layout.
```

`src/content/work/quadtree-dashboard.md`:

```markdown
---
title: Manager dashboard · QuadTree
date: 2024-09-01
org: GreyOrange
category: industry
featured: true
summary: A QuadTree kept a warehouse manager dashboard interactive while plotting thousands of points.
tech: [React, JavaScript, QuadTree]
links:
  - label: Live demo
    href: https://shiv4nk4r.github.io/react-quad-tree-map-visualizer/
  - label: GitHub
    href: https://github.com/shiv4nk4r/react-quad-tree-map-visualizer
---

## Problem

The in-house manager dashboard slowed to a crawl when it rendered thousands of data points in React.

## Approach

I partitioned points with a QuadTree so the UI only mounted markers that mattered for the current viewport, then shipped a public visualizer of the same idea without internal data.

## Outcome

Load time and interaction cost on the dashboard improved by 5×. The manager dashboard work sat alongside a 30% improvement in warehouse oversight and a 10% increase in revenue from the broader feature set, and backend work on the same product line cut server response time by 40%.

## Tech

React, JavaScript, and a QuadTree spatial index.
```

`src/content/work/korao.md`:

```markdown
---
title: Korao
date: 2026-02-01
org: Personal
category: personal
featured: true
summary: A native desktop task companion built with Tauri, Rust, and TypeScript as a full-cycle product exercise.
tech: [Tauri, Rust, React, TypeScript]
links: []
---

## Problem

Web task tools never quite felt like a local companion: slow startup, weak OS integration, and a product surface that ignored how I actually plan work.

## Approach

I built Korao as a native app with Tauri, using a React/TypeScript UI and a Rust core, and treated releases, bugs, and feedback as part of the work—not a side quest.

## Outcome

A native task companion with a minimal UI, public bug reports, and a working install path. No download or revenue claims beyond that.

## Tech

Tauri, Rust, React, and TypeScript.
```

`src/content/work/visit-health-pharmacy.md`:

```markdown
---
title: Visit Health pharmacy
date: 2022-08-01
org: Visit Health
category: industry
featured: true
summary: Full-stack pharmacy e-commerce on Node.js, SQL, and React.
tech: [Node.js, SQL, React]
links: []
---

## Problem

The pharmacy store needed to scale as a real e-commerce surface inside Visit Health—catalog, checkout, and operations—not a brochure.

## Approach

I built and extended the store across Node.js, SQL, and React, including backend work that tightened server response.

## Outcome

Features that shipped with this work contributed to a 50% boost in user engagement. Backend optimizations cut server response time by 20%.

## Tech

Node.js, SQL, and React.
```

`src/content/work/claw-net.md`:

```markdown
---
title: ClawNet
date: 2018-11-01
org: ZooHackathon / WWF
category: college
featured: true
summary: A crawler and map that traced coded wildlife-trade language across the web.
tech: [Node.js, Angular, MongoDB, Python]
links:
  - label: U.S. Embassy
    href: https://in.usembassy.gov/congratulations-to-new-delhi-zoohackathons-team-zoocchini-for-winning-second-place-in-the-global-zoohackathon-2018/
---

## Problem

Illegal wildlife trade hides behind coded search language. Enforcement needed a way to find those listings and see how buyers and sellers connected.

## Approach

We built ClawNet: a crawler for trade “code words,” plus a map of routes for investigators. ZooHackathon 2018 was organized with WWF, TRAFFIC, and the U.S. government.

## Outcome

First in the Asia-Pacific region and second in the world. The U.S. Embassy in New Delhi published a note on the result.

## Tech

Node.js, Angular, MongoDB, and Python.
```

`src/content/work/poacher-detection.md`:

```markdown
---
title: Poacher detection
date: 2017-11-01
org: ZooHackathon / WWF
category: college
featured: false
summary: Camera-based detection that alerted forest rangers to people in protected parks.
tech: [Django, OpenCV]
links: []
---

## Problem

Rangers cannot watch every camera in a national park. Poachers needed to be flagged from existing feeds.

## Approach

A Django service ran OpenCV models on park cameras and raised alerts. Built for ZooHackathon 2017 (U.S. government and WWF).

## Outcome

Runner-up in the India / Asia-Pacific region and a top-ten world finish. The team was invited to the U.S. Embassy.

## Tech

Django and OpenCV.
```

`src/content/work/mobot.md`:

```markdown
---
title: MOBOT
date: 2018-02-01
org: IIIT Delhi
category: college
featured: false
summary: A robot lamp that behaves like a shy pet, built with Arduino under Prof. Aman Parnami.
tech: [Arduino]
links: []
---

## Problem

The studio brief was a lamp with social behavior—not a static object on a desk.

## Approach

I built an Arduino-driven lamp that retreats into its box when someone comes close and reappears at a safer distance.

## Outcome

A working physical prototype for the course under Prof. Aman Parnami.

## Tech

Arduino.
```

`src/content/work/sleep-safe.md`:

```markdown
---
title: Sleep Safe
date: 2018-03-01
org: IIIT Delhi
category: college
featured: false
summary: A wearable that tracked sleep and health and could drive room temperature from body temperature.
tech: [Arduino, React Native]
links: []
---

## Problem

Sleep and overnight health data sat in one place; the room climate sat in another.

## Approach

A band on Arduino plus a React Native app regulated a sleep schedule, watched basic health signals, and could set AC temperature from body temperature. Course work under Prof. Aman Parnami.

## Outcome

A functioning hardware-plus-app prototype for the studio.

## Tech

Arduino and React Native.
```

`src/content/work/railways-db.md`:

```markdown
---
title: Railways database management
date: 2018-07-01
org: IIIT Delhi
category: college
featured: false
summary: An ERP-style portal for railway operations, built as a database course project.
tech: [MySQL, Python, Django]
links: []
---

## Problem

The course needed a realistic multi-table domain with bookings, inventory, and staff—not a toy schema.

## Approach

I modeled railway operations in MySQL and shipped a Django portal on top.

## Outcome

A working ERP-style student system for the database management course.

## Tech

MySQL, Python, and Django.
```

`src/content/work/hcd-website.md`:

```markdown
---
title: HCD website for TCS and IIITD
date: 2017-06-01
org: IIIT Delhi / TCS
category: college
featured: false
summary: Department site for Human-Centered Design at IIIT Delhi, in collaboration with TCS.
tech: [HTML, CSS, JavaScript]
links:
  - label: Website
    href: https://shiv4nk4r.github.io/CDNM_website/desktop.html
---

## Problem

The HCD department needed a public site that could carry the TCS collaboration without a heavy CMS.

## Approach

I built the front-end in HTML, CSS, and JavaScript and shipped it as a static department site.

## Outcome

A live department website still reachable from the archived URL.

## Tech

HTML, CSS, and JavaScript.
```

`src/content/work/ascii-camera.md`:

```markdown
---
title: ASCII video feed
date: 2022-06-01
org: Personal
category: personal
featured: false
summary: A lightweight real-time ASCII capture of a camera feed.
tech: [JavaScript]
links:
  - label: Live
    href: https://shivankar.net/ASCII-Camera/
---

## Problem

I wanted a camera toy that was small enough to run in the browser and strange enough to be worth opening.

## Approach

A client-side capture pipeline maps video frames to ASCII in real time.

## Outcome

A public web app at `/ASCII-Camera/`.

## Tech

JavaScript.
```

`src/content/work/pickem-tournament.md`:

```markdown
---
title: Pick’em tournament
date: 2021-06-01
org: Personal
category: personal
featured: false
summary: A full-stack league app so sports fans can run pick’em competitions without spreadsheets.
tech: [React, Firebase]
links:
  - label: Live
    href: https://pickems-tournament-app.web.app/
---

## Problem

Friends were running prediction leagues in spreadsheets. That falls apart as soon as the group grows.

## Approach

A React client with Firebase auth, realtime data, and hosting. Built as freelance/personal product work.

## Outcome

A live app at the Firebase URL above.

## Tech

React and Firebase.
```

`src/content/work/eagle-eye.md`:

```markdown
---
title: Eagle Eye
date: 2017-10-01
org: Personal / IIITD
category: college
featured: false
summary: A student prototype for image analysis aimed at people who are hard to see in a frame.
tech: [Python, OpenCV]
links: []
---

## Problem

The brief was to flag people who were partially hidden in camera stills—not a production surveillance product.

## Approach

A Python OpenCV pipeline for image analysis. The project was a student prototype and was never finished as a shipped service.

## Outcome

A partial prototype. It belongs in the archive as early computer-vision work, not as a deployed system.

## Tech

Python and OpenCV.
```

`src/content/work/architectural-mr.md`:

```markdown
---
title: Architectural visualisation in MR
date: 2020-01-01
org: IIIT Delhi
category: college
featured: false
summary: A mixed-reality setup so interior designers could place and judge objects in a space.
tech: [C#, Unity]
links: []
---

## Problem

Interior designers were judging layouts from flat renders instead of the room they would actually occupy.

## Approach

A Unity MR scene let people place objects in a captured or virtual interior and walk the result.

## Outcome

A course/studio prototype in C# and Unity. Not a commercial product.

## Tech

C# and Unity.
```

`src/content/writing/quadtree-performance.md`:

```markdown
---
title: Keeping a dashboard fast with a QuadTree
date: 2025-09-19
summary: How a QuadTree let a warehouse dashboard render thousands of points without freezing the UI.
---

A warehouse dashboard that plots thousands of points will freeze if React paints every marker on every frame. I used a QuadTree to keep only the points that matter for the current viewport in the React tree.

The public visualizer is the same idea, stripped of internal data: [live demo](https://shiv4nk4r.github.io/react-quad-tree-map-visualizer/) and [source](https://github.com/shiv4nk4r/react-quad-tree-map-visualizer).

On the internal dashboard this cut load time and interaction cost by 5×. The case study is under Work: [Manager dashboard / QuadTree](/work/quadtree-dashboard).
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/archive.test.ts tests/content-files.test.ts tests/headings.test.ts tests/work.test.ts`

Expected: PASS. Then `npx astro sync` so collection types generate.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/archive.json src/content/work src/content/writing tests/archive.test.ts tests/content-files.test.ts
git commit -m "$(cat <<'EOF'
Add work and writing content collections plus the home archive.

EOF
)"
```

---

### Task 5: Site chrome — header, footer, contact, 404

**Files:**
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Create: `src/components/ContactBlock.astro`
- Create: `src/pages/contact.astro`
- Create: `src/pages/404.astro`
- Modify: `src/layouts/BaseLayout.astro` — render header/footer by default
- Modify: `src/styles/global.css` — header, footer, mobile menu rules below

**Interfaces:**
- Consumes: `NAV`, `SITE_NAME`, `LINKS`, `EMAIL`, `PHONE`, `INTRO` from `src/lib/site.ts`
- Produces: header with logo → `/`, nav links, Resume `target="_blank"` `rel="noreferrer"`; mobile button `aria-expanded`; footer socials; contact page with email as lead, phone last

- [ ] **Step 1: Write a failing chrome test**

```ts
// tests/chrome.test.ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('chrome', () => {
  it('header includes a working mobile menu button', () => {
    const src = readFileSync('src/components/SiteHeader.astro', 'utf8');
    expect(src).toContain('aria-expanded');
    expect(src).toContain('LINKS.resume');
    expect(src).not.toContain('display: none');
  });

  it('contact leads with email, not phone', () => {
    const src = readFileSync('src/components/ContactBlock.astro', 'utf8');
    const emailAt = src.indexOf('EMAIL');
    const phoneAt = src.indexOf('PHONE');
    expect(emailAt).toBeGreaterThan(-1);
    expect(phoneAt).toBeGreaterThan(emailAt);
    expect(src.toLowerCase()).not.toMatch(/seeking|for hire/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/chrome.test.ts`

Expected: FAIL — `SiteHeader.astro` / `ContactBlock.astro` missing.

- [ ] **Step 3: Implement chrome**

`SiteHeader.astro`:

```astro
---
import { LINKS, NAV, SITE_NAME } from '../lib/site';
---

<header class="site-header">
  <div class="wrap header-inner">
    <a class="logo" href="/">{SITE_NAME}</a>
    <button
      class="menu-toggle"
      type="button"
      aria-expanded="false"
      aria-controls="site-nav"
      data-menu-toggle
    >
      Menu
    </button>
    <nav id="site-nav" class="site-nav" data-nav>
      {
        NAV.map((item) => (
          <a href={item.href}>{item.label}</a>
        ))
      }
      <a class="resume" href={LINKS.resume} target="_blank" rel="noreferrer">Resume</a>
    </nav>
  </div>
</header>

<script>
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav?.classList.toggle('is-open', !open);
  });
</script>
```

Header CSS (append to `global.css`):

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: color-mix(in srgb, var(--page) 92%, transparent);
  backdrop-filter: blur(8px);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 4rem;
  gap: 1rem;
}

.logo {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: -0.03em;
  text-decoration: none;
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.site-nav a {
  text-decoration: none;
  font-size: 0.95rem;
}

.site-nav .resume {
  color: var(--mint);
}

.menu-toggle {
  display: none;
  background: none;
  border: 1px solid var(--ink);
  font: inherit;
  padding: 0.35rem 0.7rem;
}

@media (max-width: 800px) {
  .menu-toggle {
    display: inline-flex;
  }
  .site-nav {
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 4rem;
    background: var(--page);
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 1.5rem 1.5rem;
    border-bottom: 1px solid var(--hairline);
  }
  .site-nav.is-open {
    display: flex;
  }
}
```

`SiteFooter.astro`:

```astro
---
import { LINKS } from '../lib/site';
---

<footer class="site-footer">
  <div class="wrap footer-inner">
    <a href="/contact">Contact</a>
    <div class="socials">
      <a href={LINKS.linkedin} rel="noreferrer" target="_blank">LinkedIn</a>
      <a href={LINKS.github} rel="noreferrer" target="_blank">GitHub</a>
      <a href={LINKS.behance} rel="noreferrer" target="_blank">Behance</a>
    </div>
  </div>
</footer>
```

```css
.site-footer {
  border-top: 1px solid var(--hairline);
  margin-top: 4rem;
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 0 2.5rem;
  font-size: 0.9rem;
}

.socials {
  display: flex;
  gap: 1rem;
}
```

`ContactBlock.astro`:

```astro
---
import { EMAIL, LINKS, PHONE } from '../lib/site';
---

<div class="contact-block">
  <p>Email is the most reliable way to reach me.</p>
  <p><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
  <p>
    <a href={LINKS.linkedin} rel="noreferrer" target="_blank">LinkedIn</a>
    ·
    <a href={LINKS.github} rel="noreferrer" target="_blank">GitHub</a>
    ·
    <a href={LINKS.behance} rel="noreferrer" target="_blank">Behance</a>
    ·
    <a href={LINKS.resume} target="_blank" rel="noreferrer">Resume</a>
  </p>
  <p class="phone"><a href={`tel:${PHONE}`}>{PHONE}</a></p>
</div>
```

`src/pages/contact.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ContactBlock from '../components/ContactBlock.astro';
---

<BaseLayout title="Contact" description="Email, LinkedIn, GitHub, and resume." path="/contact">
  <div class="wrap">
    <h1 class="display">Contact</h1>
    <ContactBlock />
  </div>
</BaseLayout>
```

`src/pages/404.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Not found" description="This page is not on the site." path="/404">
  <div class="wrap">
    <h1 class="display">This page is not on the site.</h1>
    <p>
      <a href="/">Home</a> · <a href="/work">Work</a> · <a href="/writing">Writing</a> ·
      <a href="/contact">Contact</a>
    </p>
  </div>
</BaseLayout>
```

Update `BaseLayout.astro` to import and render `SiteHeader` in `slot="header"` usage — simpler: BaseLayout includes header and footer directly so pages do not forget them:

```astro
---
import SiteHeader from '../components/SiteHeader.astro';
import SiteFooter from '../components/SiteFooter.astro';
---
...
<body>
  <a class="skip-link" href="#content">Skip to content</a>
  <SiteHeader />
  <main id="content"><slot /></main>
  <SiteFooter />
</body>
```

Remove the named header/footer slots.

- [ ] **Step 4: Run tests**

Run: `npx vitest run tests/chrome.test.ts tests/site.test.ts && npx astro build`

Expected: PASS. `dist/contact/index.html` and `dist/404.html` exist.

- [ ] **Step 5: Commit**

```bash
git add src/components/SiteHeader.astro src/components/SiteFooter.astro src/components/ContactBlock.astro src/pages/contact.astro src/pages/404.astro src/layouts/BaseLayout.astro src/styles/global.css tests/chrome.test.ts
git commit -m "$(cat <<'EOF'
Add site header, footer, contact, and 404 chrome.

EOF
)"
```

---

### Task 6: Work list, filters, case studies, and home

**Files:**
- Create: `src/components/WorkList.astro`
- Create: `src/components/WorkFilters.astro`
- Create: `src/components/IdentityBand.astro`
- Create: `src/components/ArchiveColumns.astro`
- Create: `src/components/CaseStudyLayout.astro`
- Create: `src/pages/work/index.astro`
- Create: `src/pages/work/[slug].astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `getCollection('work')`, `featuredEntries`, `sortByDateDesc`, `WORK_FILTERS`, `matchesCategory`, `HEADLINE`, `INTRO`, `SKILLS`, `LINKS`, `archive.json`
- Produces:
  - `WorkList` props: `{ entries: CollectionEntry<'work'>[]; numbered?: boolean }`
  - Each row: `data-category={entry.data.category}`, title → `/work/${entry.id}`, right column year (`getUTCFullYear()`) or mint index `01` when `numbered`
  - `WorkFilters` buttons `type="button"` `data-filter` `aria-pressed`
  - Home uses `IdentityBand` then numbered `WorkList` of featured entries then `ArchiveColumns`

- [ ] **Step 1: Write a failing render-contract test**

```ts
// tests/pages-contract.test.ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('page contracts', () => {
  it('home uses identity band, featured list, and archive columns', () => {
    const src = readFileSync('src/pages/index.astro', 'utf8');
    expect(src).toContain('IdentityBand');
    expect(src).toContain('featuredEntries');
    expect(src).toContain('ArchiveColumns');
    expect(src).not.toContain('prtfl.in');
  });

  it('work index wires filters to rows with data-category', () => {
    const list = readFileSync('src/components/WorkList.astro', 'utf8');
    const filters = readFileSync('src/components/WorkFilters.astro', 'utf8');
    expect(list).toContain('data-category');
    expect(filters).toContain('aria-pressed');
    expect(filters).toContain('data-filter');
    expect(filters).toContain('<script>');
  });

  it('case study layout renders the four section titles via content', () => {
    const src = readFileSync('src/components/CaseStudyLayout.astro', 'utf8');
    expect(src).toContain('render');
    expect(src).toContain('entry.data.org');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/pages-contract.test.ts`

Expected: FAIL — components/pages missing.

- [ ] **Step 3: Implement pages and components**

`WorkList.astro`:

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  entries: CollectionEntry<'work'>[];
  numbered?: boolean;
}

const { entries, numbered = false } = Astro.props;
---

<ol class="work-list" class:list={['work-list', numbered && 'is-numbered']} data-work-list>
  {
    entries.map((entry, index) => {
      const year = entry.data.date.getUTCFullYear();
      const n = String(index + 1).padStart(2, '0');
      return (
        <li data-category={entry.data.category}>
          <a href={`/work/${entry.id}`}>
            <span class="work-title">{entry.data.title}</span>
            <span class:list={['year', numbered && index === 0 && 'year-mint']}>
              {numbered ? n : year}
            </span>
          </a>
        </li>
      );
    })
  }
</ol>
```

List CSS: first item `border-top: 2px solid var(--ink)`; later `1px solid var(--hairline)`; row is flex space-between; hover mint on `.year`. `.year-mint { color: var(--mint); }` for numbered first row; for numbered lists all indices can be mint (`color: var(--mint)` on `.year` when parent has `.is-numbered`). Put `class="work-list is-numbered"` when `numbered`.

`WorkFilters.astro` (plain Astro with a `<script>`; not a React island):

```astro
---
import { WORK_FILTERS } from '../lib/work';
---

<div class="filters" data-filters>
  {
    WORK_FILTERS.map((filter, i) => (
      <button
        type="button"
        data-filter={filter.id}
        aria-pressed={i === 0 ? 'true' : 'false'}
      >
        {filter.label}
      </button>
    ))
  }
</div>

<p class="filter-empty" data-empty hidden>No work in this category. <button type="button" data-reset>All</button></p>

<script>
  function apply(filter: string) {
    const buttons = document.querySelectorAll('[data-filter]');
    buttons.forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-filter') === filter));
    });
    const rows = document.querySelectorAll('[data-work-list] li');
    let visible = 0;
    rows.forEach((row) => {
      const category = row.getAttribute('data-category');
      const show = filter === 'all' || category === filter;
      (row as HTMLElement).hidden = !show;
      if (show) visible += 1;
    });
    const empty = document.querySelector('[data-empty]');
    if (empty) (empty as HTMLElement).hidden = visible !== 0;
  }

  document.querySelector('[data-filters]')?.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const filter = target.getAttribute('data-filter');
    if (filter) apply(filter);
  });
  document.querySelector('[data-reset]')?.addEventListener('click', () => apply('all'));
</script>
```

List CSS (append to `global.css`):

```css
.work-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.work-list li a {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 0;
  text-decoration: none;
  border-top: 1px solid var(--hairline);
}

.work-list li:first-child a {
  border-top: 2px solid var(--ink);
}

.work-list.is-numbered .year,
.work-list li:first-child .year-mint {
  color: var(--mint);
}

.work-list a:hover .year {
  color: var(--mint);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0 1.5rem;
}

.filters button {
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  color: var(--muted);
  cursor: pointer;
}

.filters button[aria-pressed='true'] {
  color: var(--mint);
  box-shadow: 0 1px 0 var(--mint);
}

.prose {
  padding: 2.5rem 0 4rem;
  max-width: 42rem;
}

.prose h2 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  margin-top: 2rem;
}
```

On `/work/index.astro` render `<WorkFilters />` above `<WorkList entries={sortByDateDesc(entries)} />`. Pass `class="work-list is-numbered"` from WorkList when `numbered` is true (add that class on the `<ol>`).

`IdentityBand.astro`:

```astro
---
import { HEADLINE, INTRO, LINKS, SKILLS } from '../lib/site';
---

<header class="identity-band">
  <div class="wrap rise">
    <h1 class="display">{HEADLINE}</h1>
    <p>{INTRO}</p>
    <p class="skills mono">{SKILLS.join(' · ')}</p>
    <p>
      <a class="resume" href={LINKS.resume} target="_blank" rel="noreferrer">Resume</a>
    </p>
  </div>
</header>
```

`ArchiveColumns.astro`:

```astro
---
import archive from '../content/archive.json';

interface Item {
  title: string;
  detail: string;
  period?: string;
  href?: string;
}

const columns: { heading: string; items: Item[] }[] = [
  { heading: 'Experience', items: archive.experience },
  { heading: 'Education', items: archive.education },
  { heading: 'Awards', items: archive.awards },
];
---

<section class="archive wrap">
  {
    columns.map((col) => (
      <div>
        <h2>{col.heading}</h2>
        <ul>
          {col.items.map((item) => (
            <li>
              <p>
                {item.href ? <a href={item.href}>{item.title}</a> : <strong>{item.title}</strong>}
                {item.period && <span class="year"> {item.period}</span>}
              </p>
              <p>{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    ))
  }
</section>
```

```css
.archive {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding: 3rem 0 4rem;
  font-size: 0.92rem;
}

.archive ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.archive li + li {
  margin-top: 1rem;
}

@media (max-width: 800px) {
  .archive {
    grid-template-columns: 1fr;
  }
}
```

`CaseStudyLayout.astro`:

```astro
---
import { render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'work'>;
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const year = entry.data.date.getUTCFullYear();
---

<article>
  <header class="identity-band">
    <div class="wrap">
      <p class="label">{entry.data.category} · {entry.data.org} · {year}</p>
      <h1 class="display">{entry.data.title}</h1>
      <p>{entry.data.summary}</p>
    </div>
  </header>
  <div class="wrap prose">
    <Content />
    {
      entry.data.links.length > 0 && (
        <p class="links">
          {entry.data.links.map((link) => (
            <a href={link.href} rel="noreferrer" target="_blank">{link.label}</a>
          ))}
        </p>
      )
    }
  </div>
</article>
```

`src/pages/work/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import WorkFilters from '../../components/WorkFilters.astro';
import WorkList from '../../components/WorkList.astro';
import { sortByDateDesc } from '../../lib/work';

const entries = sortByDateDesc(await getCollection('work'));
---

<BaseLayout title="Work" description="Selected and archived work." path="/work">
  <div class="wrap">
    <h1 class="display">Work</h1>
    <WorkFilters />
    <WorkList entries={entries} />
  </div>
</BaseLayout>
```

`src/pages/work/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import CaseStudyLayout from '../../components/CaseStudyLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('work');
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
---

<BaseLayout title={entry.data.title} description={entry.data.summary} path={`/work/${entry.id}`}>
  <CaseStudyLayout entry={entry} />
</BaseLayout>
```

`src/pages/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import IdentityBand from '../components/IdentityBand.astro';
import WorkList from '../components/WorkList.astro';
import ArchiveColumns from '../components/ArchiveColumns.astro';
import { INTRO, SITE_NAME } from '../lib/site';
import { featuredEntries } from '../lib/work';

const featured = featuredEntries(await getCollection('work'));
---

<BaseLayout title={SITE_NAME} description={INTRO} path="/">
  <IdentityBand />
  <div class="wrap rise" style="animation-delay: 0.08s">
    <h2 class="label">Selected work</h2>
    <WorkList entries={featured} numbered />
  </div>
  <ArchiveColumns />
</BaseLayout>
```

Prose CSS: `h2 { font-family: var(--font-display); font-size: 1.25rem; }` with spacing.

Identity band CSS:

```css
.identity-band {
  background: var(--band);
  color: var(--page);
  padding: 3.5rem 0 3rem;
}

.identity-band .label,
.identity-band .skills {
  color: var(--mint-on-black);
  font-family: var(--font-mono);
}

.identity-band a.resume {
  color: var(--mint-on-black);
}
```

Home `.rise` on band and list with `animation-delay` 0.05s steps.

- [ ] **Step 4: Run tests and build**

Run: `npx vitest run && npx astro build`

Expected: all tests PASS. `dist/work/claw-net/index.html` contains `Problem`. Home HTML contains `Engineer and researcher.` and does not contain `prtfl.in`.

- [ ] **Step 5: Commit**

```bash
git add src/components/WorkList.astro src/components/WorkFilters.astro src/components/IdentityBand.astro src/components/ArchiveColumns.astro src/components/CaseStudyLayout.astro src/pages/index.astro src/pages/work src/styles/global.css tests/pages-contract.test.ts
git commit -m "$(cat <<'EOF'
Add home, work index, filters, and case study pages.

EOF
)"
```

---

### Task 7: Writing pages

**Files:**
- Create: `src/components/ArticleLayout.astro`
- Create: `src/pages/writing/index.astro`
- Create: `src/pages/writing/[slug].astro`

**Interfaces:**
- Consumes: `getCollection('writing')`
- Produces: writing index as the same row list pattern as work (title left, date right `YYYY-MM-DD` or year); article uses black band with title + summary then `.prose` body. Empty collection: one sentence “No posts yet.” — not a fake card. Launch includes `quadtree-performance.md` so the empty state is unused but still coded.

- [ ] **Step 1: Write the failing test**

Add to `tests/pages-contract.test.ts`:

```ts
it('writing index lists posts from the writing collection', () => {
  const src = readFileSync('src/pages/writing/index.astro', 'utf8');
  expect(src).toContain("getCollection('writing')");
  expect(src).toContain('No posts yet.');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/pages-contract.test.ts`

Expected: FAIL — writing index missing.

- [ ] **Step 3: Implement writing pages**

`src/pages/writing/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

const posts = [...(await getCollection('writing'))].sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime(),
);
---

<BaseLayout title="Writing" description="Notes on systems, research, and building." path="/writing">
  <div class="wrap">
    <h1 class="display">Writing</h1>
    {
      posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ol class="work-list">
          {posts.map((post) => (
            <li>
              <a href={`/writing/${post.id}`}>
                <span class="work-title">{post.data.title}</span>
                <span class="year">{post.data.date.getUTCFullYear()}</span>
              </a>
            </li>
          ))}
        </ol>
      )
    }
  </div>
</BaseLayout>
```

`src/components/ArticleLayout.astro`:

```astro
---
import { render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'writing'>;
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<article>
  <header class="identity-band">
    <div class="wrap">
      <p class="label">{entry.data.date.toISOString().slice(0, 10)}</p>
      <h1 class="display">{entry.data.title}</h1>
      <p>{entry.data.summary}</p>
    </div>
  </header>
  <div class="wrap prose">
    <Content />
  </div>
</article>
```

`src/pages/writing/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ArticleLayout from '../../components/ArticleLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('writing');
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
---

<BaseLayout title={entry.data.title} description={entry.data.summary} path={`/writing/${entry.id}`}>
  <ArticleLayout entry={entry} />
</BaseLayout>
```

- [ ] **Step 4: Run tests and build**

Run: `npx vitest run && npx astro build`

Expected: PASS. `dist/writing/quadtree-performance/index.html` exists.

- [ ] **Step 5: Commit**

```bash
git add src/components/ArticleLayout.astro src/pages/writing tests/pages-contract.test.ts
git commit -m "$(cat <<'EOF'
Add writing index and article pages.

EOF
)"
```

---

### Task 8: Cutover, resume PDF, Pages deploy

**Files:**
- Create: `public/CNAME` with contents `shivankar.net`
- Create: `.github/workflows/deploy.yml`
- Modify: move `ShivankarSharma.pdf` → `public/ShivankarSharma.pdf`
- Delete: `index.html`, `style/` (entire directory), `docs/index.html`
- Keep: `SystemDesign.pdf` at repo root (not in `public/`)
- Modify: `package.json` `check` script remains `astro check`

**Interfaces:**
- Consumes: `npm test` and `npm run build` from earlier tasks
- Produces: GitHub Actions workflow that runs tests, `astro build`, uploads `dist`, deploys Pages

- [ ] **Step 1: Write a failing cutover test**

```ts
// tests/cutover.test.ts
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('cutover', () => {
  it('does not keep the prtfl redirect at repo root', () => {
    expect(existsSync('index.html')).toBe(false);
  });

  it('publishes the resume from public/', () => {
    expect(existsSync('public/ShivankarSharma.pdf')).toBe(true);
  });

  it('ships the custom domain', () => {
    expect(readFileSync('public/CNAME', 'utf8').trim()).toBe('shivankar.net');
  });

  it('does not publish SystemDesign.pdf in public/', () => {
    expect(existsSync('public/SystemDesign.pdf')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/cutover.test.ts`

Expected: FAIL — root `index.html` still exists, PDF still at root, no CNAME.

- [ ] **Step 3: Cut over files and add CI**

Move PDF: `git mv ShivankarSharma.pdf public/ShivankarSharma.pdf`

Write `public/CNAME`:

```
shivankar.net
```

Delete `index.html`, `style/_contact.scss`, `style/_footer.scss`, `style/_landing.scss`, `style/_loader.scss`, `style/_maincontainer.scss`, `style/_nav.scss`, `style/_scrollbar.scss`, `style/_skills.scss`, `style/_timeline.scss`, `style/main.css`, `style/main.css.map`, `style/main.scss`, `docs/index.html`.

`.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [master]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

After merge, set the GitHub repo: Settings → Pages → Source = GitHub Actions (manual, once).

- [ ] **Step 4: Run tests and production build**

Run: `npx vitest run && npx astro check && npx astro build`

Expected: all tests PASS, check PASS, `dist/CNAME` exists (Astro copies `public/`), `dist/ShivankarSharma.pdf` exists, no `prtfl.in` in `dist/index.html`, no `SystemDesign.pdf` under `dist/`.

Manual: `npx astro preview` — mobile menu, work filters (All / College shows ClawNet), keyboard focus on nav, identity-band mint on black.

- [ ] **Step 5: Commit**

```bash
git add public/CNAME public/ShivankarSharma.pdf .github/workflows/deploy.yml tests/cutover.test.ts
git add -u index.html style docs/index.html ShivankarSharma.pdf
git commit -m "$(cat <<'EOF'
Cut over to Astro on GitHub Pages and drop the prtfl.in redirect.

EOF
)"
```

---

## Self-review (plan vs spec)

| Spec requirement | Task |
| --- | --- |
| Dual-use, no seeking copy | Global constraints; site constants; contact chrome |
| Drop `prtfl.in`, this repo is the site | Task 8 |
| Nav: Home, Work, Writing, Contact, Resume | Tasks 1, 5 |
| Stacked + editorial home, featured six, archive columns | Tasks 2, 4, 6 |
| Light studio + mint tokens, Syne / Plex | Task 1 CSS + BaseLayout fonts |
| Work filters + full archive list | Tasks 2, 4, 6 |
| Structured Problem / Approach / Outcome / Tech | Tasks 3, 4, 6 |
| Writing section + first real post | Tasks 4, 7 |
| Contact details, no FB/IG | Tasks 1, 5 |
| Astro + Markdown + GitHub Actions Pages | Tasks 1, 4, 8 |
| CNAME `shivankar.net`, no SystemDesign in IA | Task 8 |
| Mobile menu works | Task 5 |
| 404, empty writing, missing links omitted | Tasks 5, 6, 7 |
| Tests: check, headings, smoke | Tasks 3, 4, 8 |
| Resume PDF linked, update is follow-up | Task 8 moves existing PDF |
| Full historical archive | Task 4 markdown + archive.json |

No CMS, no dark-mode toggle, no QuadTree/Korao embeds — not planned.

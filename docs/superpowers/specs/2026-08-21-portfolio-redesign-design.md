# Portfolio redesign — design spec

Date: 2026-08-21  
Repo: `shiv4nk4r.github.io` (this repository is the live site)

## Goal

A single professional site that works for Master’s applications and for hiring without feeling like two products. No “currently seeking” copy. Visitors decide what they are here for.

Success: a recruiter or faculty member can, in one home-page skim, know who Shivankar Sharma is, what he is good at, and what he has done — then open a full case study or a post if they want depth.

## Audience and voice

Dual-use. Voice is confident and specific: engineer + researcher (full-stack systems, operations research, warehouse robotics). CS + Design, IIITD. Do not frame the site as a student portfolio, a job board, or a personal diary.

Contact and resume are always one click away.

## What we are replacing

The current site is a student-era HTML/SCSS page (`index.html` + `style/`) that meta-refreshes to `https://prtfl.in/shiv4nk4r`. Content stops around graduation; the resume PDF still lists Visit Health as current. Mobile nav is hidden below 1000px. A 3-second loader blocks the page.

All of that goes away. The `prtfl.in` redirect is removed. This repo ships the new site.

Keep and migrate every project, job, education row, and award from the old site, then add GreyOrange, Visit Health, Korao, the QuadTree dashboard, and other post-2021 work on top (full archive).

Do not promote `SystemDesign.pdf` (very large) in the nav or home. Leave it out of the public IA.

## Site map

Always-visible nav:

| Item | Destination |
| --- | --- |
| Shivankar Sharma | `/` |
| Work | `/work` |
| Writing | `/writing` |
| Contact | `/contact` |
| Resume | `/ShivankarSharma.pdf` (new tab) |

No separate About page. Identity lives on home.

Per-item routes (not extra nav items):

- `/work/<slug>` — structured case study
- `/writing/<slug>` — article
- `404` — same visual language

Footer repeats Contact plus LinkedIn (`https://www.linkedin.com/in/shiv4nk4r`), GitHub (`https://github.com/shiv4nk4r`), and Behance (`https://www.behance.net/shivankar199`). Do not put Facebook or Instagram in the primary contact row.

## Homepage — stacked + editorial list

Vertical scan, not a card grid:

1. **Identity band (black)** — headline “Engineer and researcher.” plus one sentence (full-stack systems and operations research for warehouse robotics; CS + Design, IIITD). Skill names in mint on the black band. Resume control on the band (mint text or inverted button).
2. **Selected work** — 4–6 `featured` projects as a typographic index (title left, org/signal right, first row a 2px black rule, later rows hairline). Each row links to its case study. Numbered `01`… in mint/tabular figures.
3. **Archive band** — three columns: Experience, Education, Awards. Dense, complete, scannable. Names that have a write-up are links; the rest are text.

Featured set at launch (in this order):

1. Operator assignment (GreyOrange, OR)
2. Multi-pallet palletization (GreyOrange, research)
3. Manager dashboard / QuadTree (GreyOrange, 5× load)
4. Korao (personal, Tauri + Rust)
5. Visit Health pharmacy (industry)
6. ClawNet (ZooHackathon)

Everything else remains on `/work` and in the archive columns.

Skills on home are a short set of names, not 10/10 bars: Node.js, Erlang, Spring, React, Python, SQL, operations research / VRP. The full skill picture lives in case studies’ Tech sections.

## Inner pages

**Work index (`/work`)**  
Title “Work”. Filters: All, Industry, Research, Personal, College. Default All. Same editorial list as home, newest first, full archive. Year on the right. Filters are text, active state mint underline.

**Case study (`/work/<slug>`)**  
Black title band: category · org · year (mint label), title, one-line summary. Body sections in this order, all required:

1. Problem
2. Approach
3. Outcome
4. Tech

Then optional narrative, figures, and outbound links (GitHub, live demo, embassy/press). Same template for college projects and GreyOrange work; length may differ, structure does not.

**Writing index (`/writing`)**  
Same list UI, date on the right. Posts are normal articles (title, date, summary in frontmatter) — not the case-study template.

**Contact (`/contact`)**  
Email `shivankar1234@gmail.com`, LinkedIn, GitHub, Behance, resume. Phone `9891949387` as a `tel:` link, not the lead line. One sentence of how to reach you; no hiring CTA.

## Visual system — light studio + mint

Studio contrast is the structure; Graphite lab is the signal.

| Token | Value |
| --- | --- |
| Page | `#f7f7f5` |
| Ink | `#111213` |
| Muted | ink at ~45% |
| Hairline | `#e4e4e0` |
| Band | `#111213` |
| Mint (on light) | `#0d9f6e` |
| Mint (on black) | `#5ee9b6` |

Type:

- Headlines: **Syne** (geometric, design-school, not a default UI sans)
- Body / UI: **IBM Plex Sans**
- Dates, numbers, tech, labels: **IBM Plex Mono**, tabular lining figures

Motion: short, restrained. Home identity and first list rows may stagger in on load. List rows underline or mint the year on hover. No splash loader. No decorative grain, no purple gradients, no neumorphism from the old site.

Layout: max content width ~72rem, generous left/right padding, identity band full-bleed. Mobile: stacked sections; archive columns become a single stacked list; header becomes a compact bar with a menu that actually works (the old site hid nav entirely under 1000px).

Accessibility: skip link, visible focus, mint/black and mint/light combinations checked for contrast, semantic headings, filters as buttons with `aria-pressed`.

## Content model

Markdown in the repo. No CMS.

### `src/content/work/*.md`

Frontmatter:

- `title` (string)
- `slug` (from filename)
- `date` (year-month; used for sort)
- `org` (string)
- `category`: `industry` \| `research` \| `personal` \| `college`
- `featured` (boolean)
- `summary` (one sentence)
- `tech` (list of strings)
- `links` (list of `{ label, href }`, optional)

Body: `## Problem` / `## Approach` / `## Outcome` / `## Tech`, then optional extra headings. Awards that are not a project (Dean’s List, Geek with Guts, school prizes) do **not** get work pages; they appear only in the awards column and can be mentioned inside a related case study.

### `src/content/writing/*.md`

Frontmatter: `title`, `date`, `summary`. Body is freeform Markdown.

Launch: include one real post so `/writing` is not an empty shell — adapt the public QuadTree / dashboard performance write-up. Further posts are new files.

### `src/content/archive.json`

Structured lists for home columns:

- Experience: GreyOrange (OR Scientist; SDE 2; Software Developer), Visit Health, freelance full-stack, Vikalp, INK, school Design Head / Computer Prefect, Esya organiser/volunteer — full archive, densest at the top.
- Education: B.Tech CS + Design, IIITD (2017–2021); Class XII; Class X.
- Awards: Geek with Guts; ZooHackathon 2018 (1st APAC, 2nd world); ZooHackathon 2017; Amity Design Hackathon; Dean’s List; school and fest awards from the old site.

Copy is rewritten to current professional English (fix typos from the old HTML) without inventing metrics. Where LinkedIn/resume numbers exist (40% latency, 5× dashboard, ~85% of theoretical best, etc.), use them in the matching case study Outcome.

Resume PDF is replaced when a current file is provided; until then keep `ShivankarSharma.pdf` linked and treat updating the PDF as a follow-up, not a blocker for the site.

## Architecture

- **Astro** (static). Content collections for work and writing. TypeScript where it helps (collection schemas).
- **GitHub Pages** via GitHub Actions on push to `master`: `astro build`, then `actions/upload-pages-artifact` + `actions/deploy-pages` (source: GitHub Actions, not `/docs`). Delete the stub `docs/index.html` (“Shivankar CDN”). Do not use the old root `index.html` or a meta-refresh. Do not publish the 39MB `SystemDesign.pdf` as a nav item.
- **Domain:** ship `public/CNAME` with `shivankar.net`. Canonical and `og:url` are `https://shivankar.net`.
- **No runtime backend.** `/work` filters are one small Astro client island; content itself is static.
- **Assets:** optional figures in `public/work/<slug>/`. Layout must not break if a figure is missing.
- **Ignore** `.superpowers/` (visual-companion session files) in git.

Data flow: Markdown and `archive.json` → Astro build → static HTML/CSS/JS. No client fetch for content.

## Components (one job each)

| Component | Does | Depends on |
| --- | --- | --- |
| `SiteHeader` | Logo, nav, mobile menu, resume | routes |
| `SiteFooter` | Contact line, socials | same links as Contact |
| `IdentityBand` | Home headline, sentence, skills, resume | archive/skills props |
| `WorkList` | Editorial index; optional year; optional filter | work collection |
| `ArchiveColumns` | Experience / Education / Awards | `archive.json` |
| `CaseStudyLayout` | Band + required sections + extra body | one work entry |
| `ArticleLayout` | Post title band + body | one writing entry |
| `ContactBlock` | Email, socials, resume, phone | static links |

Pages compose these; they do not duplicate list markup.

## Error handling

- Unknown `/work/<slug>` or `/writing/<slug>` → 404 page (home, work, writing, contact links).
- Empty writing collection after the first post is deleted → index still renders with a single factual line that there are no posts yet (not a fake card).
- Missing optional `links` or images → omit the control; do not show “TBD”.
- Client filter with zero matches → “No work in this category.” plus a control back to All.

## Testing

- `astro check` and production build must succeed in CI.
- Collection schema rejects a work entry missing Problem/Approach/Outcome/Tech headings (remark or a small content test).
- Smoke: `/`, `/work`, `/writing`, `/contact`, one case study, one post, 404, resume URL.
- Manual: mobile menu, work filters, keyboard focus on nav and list rows, identity-band contrast.

## Out of scope

- CMS, comments, analytics dashboards, a blog editor UI.
- Hosting the old `prtfl.in` site.
- Rewriting the resume PDF in this spec (link it; replace the file when ready).
- Interactive QuadTree/Korao embeds (link out to existing demos/repos).
- Dark-mode toggle (the site is light studio; mint-on-black is only the identity band).

## Decisions log

- Dual-use, no seeking language.
- Layered IA: skim home, full work archive, deep case studies, writing.
- Full historical archive kept; featured six on home.
- Markdown + Astro + GitHub Pages; no CMS.
- Drop `prtfl.in` redirect.
- Home: stacked professional + editorial list.
- Visual: light studio + mint highlights (not full dark graphite).
- Case studies: structured Problem / Approach / Outcome / Tech.

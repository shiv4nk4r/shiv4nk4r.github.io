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
    expect(src).toContain('href={`tel:${PHONE_TEL}`}');
    expect(src).toContain('>{PHONE}</span>');
    expect(src).toContain('contact-form');
    expect(src).toContain('mailto:');
    expect(src).not.toContain('behance');
  });

  it('embeds the Steam widgets for Cricket Manager 27 and PlatAttack in Hobbies', () => {
    const src = readFileSync('src/components/HobbiesBand.astro', 'utf8');
    expect(src).toContain('store.steampowered.com/widget/5072330');
    expect(src).toContain('store.steampowered.com/widget/5103330');
    expect(src).toContain('Cricket Manager 27');
    expect(src).toContain('PlatAttack');
    expect(src).toContain('Shushi Studios');
  });

  it('resets the GreyOrange role grid on small screens', () => {
    const css = readFileSync('src/styles/global.css', 'utf8');
    const mobile = css.slice(css.indexOf('@media (max-width: 720px)'));
    expect(mobile).toContain('.archive .org:has(.org-logo) .roles .entry');
    expect(mobile).toContain('grid-template-columns: minmax(0, 1fr) auto');
    expect(mobile).not.toMatch(
      /\.roles \.entry \{[^}]*grid-template-columns: 2\.6rem minmax\(0, 1fr\) 14\.5rem/,
    );
  });

  it('uses an AA mint token on the light page', () => {
    const css = readFileSync('src/styles/global.css', 'utf8');
    expect(css).toContain('--mint: #0a7f58;');
    expect(css).toContain('--mint-on-black: #5ee9b6;');
  });
});

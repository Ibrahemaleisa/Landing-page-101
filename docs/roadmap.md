# Roadmap

Ordered by value to teams adopting the kit. Each item names what "done" means.

## Next (0.2)

1. **Publish `@landing/kit`** to a registry (npm or GitHub Packages) with semver and a changelog, so sites can live in
   their own repositories. Done when `create-landing` can scaffold outside the monorepo against a published version.
2. **Cross-browser e2e**: add Firefox and WebKit projects to Playwright in CI. Done when the suite is green in all three
   engines (scroll-driven animations and `:has()` degrade by design; tests must still pass).
3. **CI pipeline** (GitHub Actions): `pnpm verify` on every PR, Lighthouse CI budgets per site, preview deployments.
4. **Field performance**: a `web-vitals` RUM snippet (opt-in, privacy-preserving) reporting LCP/CLS/INP per page, since
   lab numbers don't include INP.
5. **Per-page OG images** generated at build time from the brand (title on the brand ground), replacing manual images.

## Soon

6. **Content collections for repeatable content**: case studies (Opera's `/work/<slug>`), changelogs, blog posts, with
   Zod schemas and locale parity checks.
7. **Section variants the reference builds showed a need for**: a pricing calculator island, a video hero with
   poster and captions, a team/people grid, a "logo wall" that respects a `prefers-reduced-motion` marquee.
8. **Design-token export** to DTCG JSON so brands round-trip with Figma variables.
9. **Starter locales beyond en/ar** (fr, ur, tr) with tested font stacks, and a `--blank` starter.
10. **Edge locale negotiation**: optional `Accept-Language` redirect at `/` for hosts that support it, never replacing the
    locale URLs.

## Later

11. **CMS adapter**: a `renderSections(config)` that maps a validated JSON page description (from a headless CMS) onto
    the typed section props, for teams where non-developers compose pages.
12. **Web Components build** of the interactive pieces (tabs, dialog, form validation) for use outside Astro.
13. **Visual regression**: screenshot baselines per site/locale/viewport in CI.
14. **Dark-mode tones**: `prefers-color-scheme` mapping from a light tone to a dark one, for brands that want it.
15. **Astro and Node upgrades** on a schedule; the kit tracks the latest Astro minor within two weeks.

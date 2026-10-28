# Landing Kit

A static-first system for building **distinct, accessible, fast** landing pages for many brands from one foundation.
It is built on Astro 7, has no runtime framework, is bilingual (Arabic/English, RTL/LTR) by construction, and enforces
WCAG contrast in its test suite.

The system makes the quality repeatable without making the sites look alike:

|                   | **Opera**                                 | **Qitah**                         | **Kitebase**                   |
| ----------------- | ----------------------------------------- | --------------------------------- | ------------------------------ |
| What              | Premium event-operations company          | Saudi auto-parts marketplace      | Fictional feature-flag SaaS    |
| Default locale    | Arabic (`/`), English `/en/`              | Arabic (`/`), English `/en/`      | English (`/`), Arabic `/ar/`   |
| Identity          | Dark editorial, photographic, calm        | Bright, utility-first, search-led | Paper, ink and lime; brutalist |
| Hero              | Full-height display + field photo + orbit | Split with a working part finder  | Centred over a product console |
| Signature section | Five-principle ring                       | Offer comparison and fitment      | Live-looking flag console      |

## Style Studio (private)

`sites/studio` is a private playground: **14 ready-made styles**, picture cards for every element (colours,
typography, type scale, buttons, corners and borders, shadows, spacing, motion, hero template, page template), sliders
and a colour picker for fine-tuning, and a plain-language hint on every choice. The preview updates live in Arabic or
English at phone, tablet or desktop size, and any mix exports as a `brand.ts`.
Run it with `pnpm --dir sites/studio dev` → http://localhost:4324/. Guide: [docs/guides/studio.md](docs/guides/studio.md).

## Quick start

```sh
nvm use                 # Node 22.23.4+
pnpm install
pnpm --dir sites/opera dev        # http://localhost:4321/
pnpm --dir sites/qitah dev        # http://localhost:4322/
pnpm --dir sites/kitebase dev     # http://localhost:4323/
pnpm --dir sites/studio dev       # http://localhost:4324/  (style studio)

pnpm new-site acme --title "Acme" --locales en,ar --default en   # your own site
```

## Verify

```sh
pnpm verify    # lint → astro check → unit tests (incl. contrast gates) → build → Playwright + axe e2e
pnpm perf      # Lighthouse (lab)
```

## Results (measured, see docs/reports)

|                                         | Opera before (Next.js) | Opera on Landing Kit | Qitah     | Kitebase  |
| --------------------------------------- | ---------------------- | -------------------- | --------- | --------- |
| Lighthouse performance, mobile          | 79                     | 100                  | 100       | 100       |
| LCP, mobile (simulated 4G)              | 5,442 ms               | 910 ms               | 1,042 ms  | 753 ms    |
| JavaScript shipped                      | 260 KB                 | 0.9 KB gz (inline)   | 0.3 KB gz | 0.6 KB gz |
| axe WCAG 2.2 AA violations              | 5 instances, 2 rules   | 0                    | 0         | 0         |
| Separate URLs per language + `hreflang` | No                     | Yes                  | Yes       | Yes       |

## Documentation

|                                                                                                                                                                                    |                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [Architecture](docs/architecture.md)                                                                                                                                               | How the pieces fit                                                          |
| [Architecture Decision Records](docs/adr/README.md)                                                                                                                                | Why: framework, styling, tones, interactivity, i18n, testing, fonts, motion |
| [Opera audit](docs/research/opera-audit.md)                                                                                                                                        | Phase 1 research: what was kept, generalised, left behind, and fixed        |
| [Design principles and tokens](docs/design/principles-and-tokens.md)                                                                                                               | The token reference                                                         |
| [Components and sections](docs/components.md)                                                                                                                                      | Every component and section, with props and behaviour                       |
| [Style Studio](docs/guides/studio.md)                                                                                                                                              | Mix styles element by element, fine-tune, preview live, export              |
| [Brand customization](docs/guides/brand-customization.md)                                                                                                                          | Making a brand feel like itself                                             |
| [New project](docs/guides/new-project.md)                                                                                                                                          | Scaffold, customise, verify, deploy                                         |
| [Testing and quality](docs/quality.md)                                                                                                                                             | Gates and definition of done                                                |
| [Performance report](docs/reports/performance.md) · [Accessibility report](docs/reports/accessibility.md) · [Dependencies and security](docs/reports/dependencies-and-security.md) | Evidence                                                                    |
| [Known limitations](docs/known-limitations.md) · [Roadmap](docs/roadmap.md)                                                                                                        | What's not done, and what's next                                            |

## Repository

```
packages/kit             @landing/kit — brand compiler, i18n, components, sections
packages/create-landing  `pnpm new-site` scaffolder
templates/starter        what new sites start from
sites/{opera,qitah,kitebase}   reference implementations
sites/studio             private style studio (14 styles, fine-tuning, live preview)
tests/{unit,e2e}         contrast gates, Playwright + axe
scripts/                 Lighthouse and screenshot tooling
docs/                    ADRs, guides, reports
```

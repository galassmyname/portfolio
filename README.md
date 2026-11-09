# Serigne Fallou Mbaye — Portfolio

Personal portfolio: Software Engineer · AI & Machine Learning.

Built with React 18, TypeScript and Vite. Plain CSS, no UI or animation libraries.

## Run

Requires Node.js 18+.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build → dist/
npm run preview   # serve the production build
npm run lint
```

`npm run build` type-checks, builds the client, then **prerenders every page to static HTML** (`scripts/prerender.mjs`). `dist/` is fully static and can be deployed to Netlify, Vercel, Cloudflare Pages, GitHub Pages or any static host.

## SEO & URLs

| URL | Page |
|---|---|
| `/` | Redirects to `/en/` or `/fr/` (saved choice, else browser language) |
| `/en/`, `/fr/` | Home page in each language |
| `/en/projects/<slug>/`, `/fr/projects/<slug>/` | Case studies (projects with `context` in `projects.ts`) |
| `404.html` | Not-found page (`noindex`), served by the host for unknown URLs |

Each prerendered page has its own `<title>`, meta description, `robots`, canonical URL, `hreflang` links (en, fr, x-default → en), Open Graph and Twitter tags, and JSON-LD (`ProfilePage` + `Person` on the home pages, `SoftwareSourceCode` on case studies). The same metadata is kept in sync in the browser after client-side navigation. All of it is generated from `src/seo.ts` and the data files — nothing is duplicated by hand.

The build also writes `robots.txt` and, **once `VITE_SITE_URL` is set**, `sitemap.xml`.

### Configuration (`.env` or the host's environment variables)

| Variable | Purpose |
|---|---|
| `VITE_SITE_URL` | Your real domain, e.g. `https://www.your-domain.com` (no trailing slash). Required for absolute canonical/hreflang/og:url/og:image URLs, JSON-LD URLs and the sitemap. Until it is set, the build prints a warning and leaves those out rather than using a fake URL. |
| `VITE_BASE_PATH` | Only if the site lives in a sub-folder (e.g. `/portfolio/` on a GitHub Pages project site). |
| `VITE_GOOGLE_SITE_VERIFICATION` | Optional: the `content` value of Google Search Console's HTML-tag verification. |
| `VITE_WEB3FORMS_ACCESS_KEY` | Contact form (see below). |

After changing any of them, rebuild (`npm run build`) or redeploy.

### Deploying

Build command `npm run build`, output directory `dist` — both are set in `netlify.toml`, together with `VITE_SITE_URL` for the Netlify address. Set `VITE_WEB3FORMS_ACCESS_KEY` in the Netlify UI. Unknown URLs are served `404.html` automatically by Netlify, Vercel, Cloudflare Pages and GitHub Pages.

## Editing content

All content lives in `src/data/`. Components never hard-code it.

| File | Contents |
|---|---|
| `profile.ts` | Name, contact details, links, tagline, "Currently" items, education with dates from the CV (English and French). |
| `projects.ts` | Every project. `featured: true` puts it in Featured Projects (aim for 4–6); every other project appears in All Projects. Display order comes from the `ORDER` list. Projects with `context` get a case-study page at `/en/projects/<slug>/` and `/fr/projects/<slug>/`. Categories: Artificial Intelligence, Machine Learning, Software Engineering, Full Stack, Backend & Big Data — a filter only appears when at least one project uses it. `learning: true` shows a compact card (workshops); `repoOwner` + `role` describe team projects hosted by a teammate; `draft: true` keeps a project off the site until its repository is public. |
| `skills.ts` | Skill groups. Each skill states its evidence (`match` technologies or `projects` slugs) and/or `training: true`. Skills used in public projects show a count; skills covered only in training are labelled "In training"; anything else is not shown. |
| `projects.fr.ts` | French text for each project, keyed by slug (same facts, French wording). |
| `src/i18n/ui.ts` | Interface strings in English and French. TypeScript flags any missing French key. |

## Photo

The hero shows the official portrait from the Orange Digital Center photo session, full frame (2:3, never cropped or filtered):

- `public/images/serigne-fallou-mbaye-odc-{480,720,1080}.webp` (served through `srcset`)
- `public/images/serigne-fallou-mbaye-odc.jpg` (720 × 1080 fallback)

`public/og-image.png` (1200 × 630, social previews) uses the same photo. To change the portrait, regenerate these files from the original and keep the 2:3 ratio.

## Contact form

The form in the Contact section sends messages through [Web3Forms](https://web3forms.com) straight from the browser, so no backend is needed. Messages arrive at the inbox the access key was created for.

1. Go to https://web3forms.com, enter `serignefalloumbaye2002@gmail.com` and create an access key (it arrives by email).
2. Copy `.env.example` to `.env` and set `VITE_WEB3FORMS_ACCESS_KEY=<your key>`.
3. Restart `npm run dev` (Vite reads `.env` at startup).
4. When deploying (Vercel, Netlify…), add the same variable in the host's environment settings, then redeploy.

The access key is a public identifier, not a secret: it can only deliver to that one inbox. `.env` is still git-ignored to keep it out of the repository. Without a key, the form shows an honest "not available" message with a direct email link.

## Languages

English (`/en/`, default) and French (`/fr/`), each with its own URLs. The EN | FR control links to the same page in the other language; the choice is remembered for the site root redirect.

Project entries were written from the public repositories at github.com/galassmyname. Each featured project lists its `sources`. Keep new entries to facts the repository supports.

## Fonts

Inter, Space Grotesk and JetBrains Mono are self-hosted from `public/fonts/` (latin subset, SIL Open Font License), declared in `src/styles/fonts.css`. No request goes to Google Fonts.

## Structure

```
src/
├── components/   Navbar, Hero, HeroPortrait, About, Currently, Projects,
│                 FeaturedProjects, ProjectIndex, ProjectFilters, ProjectCard,
│                 Skills, Education, Contact, Footer, ArchitectureDiagram
├── pages/        HomePage, ProjectPage (case studies)
├── hooks/        useReveal
├── data/         profile, projects, projects.fr, skills, training
├── i18n/         ui strings (en/fr), LanguageContext
├── router.tsx    path-based routes (/en/, /fr/, case studies)
├── seo.ts        titles, descriptions, canonical, hreflang, Open Graph, JSON-LD
├── site.ts       domain / base-path configuration
├── entry-server.tsx  prerender entry (build only)
└── styles/       fonts.css, base.css (tokens, typography, shared utilities)
```


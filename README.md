# Abdulrahman Al Bastaki — Uncle Tim

Luxury multilingual digital museum (Arabic, English, French) celebrating Bahraini equestrian heritage and endurance riding.

## Stack

- Next.js 16 (App Router)
- React 19
- next-intl (`ar` default, `en`, `fr`)
- Tailwind CSS 4
- Cloudinary images via `next/image`

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — visitors are redirected to `/ar` by default.

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production | Public site origin, e.g. `https://your-domain.com` |
| `GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console verification token |

On Vercel, if `NEXT_PUBLIC_SITE_URL` is unset, the app falls back to `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL`.

## Scripts

```bash
npm run dev    # local development
npm run lint   # ESLint
npm run build  # production build
npm run start  # serve production build
```

## Deploy on Vercel

1. Import the GitHub repository into Vercel (Framework Preset: **Next.js**).
2. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
3. Optionally set `GOOGLE_SITE_VERIFICATION`.
4. Deploy — Build Command `next build`, Install Command `npm install`, leave Output Directory empty.

SEO routes available after deploy:

- `/sitemap.xml`
- `/robots.txt`
- Locale pages: `/ar`, `/en`, `/fr`

# Abdulrahman Al Bastaki — Uncle Tim

Luxury multilingual digital museum (Arabic, English, French) celebrating Bahraini equestrian heritage and endurance riding.

**Live site:** [https://uncletim.horse](https://uncletim.horse)

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

Local development serves on your machine; SEO metadata, sitemap, robots, and structured data always use **https://uncletim.horse**.

## Environment variables

| Variable | Required | Value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production | `https://uncletim.horse` |
| `GOOGLE_SITE_VERIFICATION` | Optional | Search Console HTML tag token |

## Scripts

```bash
npm run dev    # local development
npm run lint   # ESLint
npm run build  # production build
npm run start  # serve production build
```

## Deploy on Vercel

1. Import the GitHub repository into Vercel (Framework Preset: **Next.js**).
2. Set `NEXT_PUBLIC_SITE_URL` = `https://uncletim.horse`.
3. Attach the custom domain `uncletim.horse`.
4. Optionally set `GOOGLE_SITE_VERIFICATION`.
5. Deploy — Build Command `next build`, Install Command `npm install`, leave Output Directory empty.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full checklist.

SEO routes after deploy:

- https://uncletim.horse/sitemap.xml
- https://uncletim.horse/robots.txt
- Locale pages: `/ar`, `/en`, `/fr`

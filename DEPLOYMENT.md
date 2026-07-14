# Vercel deployment

**Production domain:** https://uncletim.horse

## Framework

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| Root Directory | `.` (repository root) |
| Build Command | `next build` |
| Install Command | `npm install` |
| Output Directory | _(leave empty)_ |
| Node.js Version | 20.x (or ≥ 20.9) |
| Production Domain | `https://uncletim.horse` |

## Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (Production + Preview):

| Name | Required | Value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Yes** | `https://uncletim.horse` |
| `GOOGLE_SITE_VERIFICATION` | Optional | Search Console HTML tag token |

SEO helpers also hardcode `https://uncletim.horse` as a safety fallback so sitemap/canonicals never emit localhost or `*.vercel.app`.

Do **not** commit real `.env` files. Use `.env.example` as the template.

## Domains in Vercel

1. Project → **Settings → Domains**
2. Add `uncletim.horse` (and `www.uncletim.horse` if used; redirect www → apex)
3. Confirm SSL is active

## Post-deploy checklist

1. Open https://uncletim.horse/ar (default), `/en`, `/fr`
2. Verify https://uncletim.horse/sitemap.xml and https://uncletim.horse/robots.txt
3. Confirm Cloudinary images load
4. Google Search Console → property `https://uncletim.horse` → submit sitemap
5. Optionally scan https://securityheaders.com/?q=https://uncletim.horse

## Repository

- App Router under `src/app`
- Locales: Arabic (default), English, French
- Remote images: `res.cloudinary.com/dvybb2xnc/**` only

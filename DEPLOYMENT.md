# Vercel deployment

## Framework

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| Root Directory | `.` (repository root) |
| Build Command | `next build` |
| Install Command | `npm install` |
| Output Directory | _(leave empty)_ |
| Node.js Version | 20.x (or ≥ 20.9) |

## Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (Production):

| Name | Required | Example |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Yes** | `https://your-domain.com` |
| `GOOGLE_SITE_VERIFICATION` | Optional | Search Console HTML tag token |

Do **not** commit real `.env` files. Use `.env.example` as the template.

## Post-deploy checklist

1. Open `/ar`, `/en`, `/fr` and confirm locale + RTL for Arabic.
2. Verify `/sitemap.xml` and `/robots.txt`.
3. Confirm Cloudinary images load.
4. Add the property in Google Search Console and submit the sitemap.
5. Optionally scan security headers at https://securityheaders.com

## Repository

- App Router under `src/app`
- Locales: Arabic (default), English, French
- Remote images: `res.cloudinary.com/dvybb2xnc/**` only

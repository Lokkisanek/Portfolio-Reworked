# Portfolio-Reworked

A modern, futuristic portfolio built with Next.js, featuring dark parallax backgrounds, Spotify integration, inline CMS, and floating dock navigation.

## Features

- 🎨 **Dark Parallax Background** - Multi-layered silhouette mountains with mouse and scroll effects
- 🎵 **Spotify Widget** - Real-time "Now Playing" integration
- ✏️ **Inline CMS** - Password-protected live content editing
- 🚀 **Floating Dock Navigation** - macOS-style animated navigation
- ⚡ **Modern Tech Stack** - Next.js 14, TypeScript, Tailwind CSS, Framer Motion

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values before running the production build:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used in metadata / OG tags. |
| `RESEND_API_KEY` | API key for [Resend](https://resend.com) email delivery. Optional but required for live contact emails. |
| `CONTACT_TO_EMAIL` | Destination email address for contact form submissions (defaults to `odehnalm.08@spst.eu`). |
| `CONTACT_FROM_EMAIL` | Verified sender (e.g. `"Portfolio Contact <hello@yourdomain.com>"`). |

If `RESEND_API_KEY` or `CONTACT_TO_EMAIL` are missing, messages are saved locally to `data/contact-messages.json` (only available in non-serverless environments) and the API will respond with guidance to configure email delivery.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


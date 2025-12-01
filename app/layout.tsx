import ClientProviders from '@/components/ClientProviders';
import { LocaleProvider } from '@/context/LocaleContext';
import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio.matyas.dev';
const ensureAbsoluteUrl = (value: string) =>
  value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`;
const resolvedSiteUrl = ensureAbsoluteUrl(SITE_URL);
const metadataBase = (() => {
  try {
    return new URL(resolvedSiteUrl);
  } catch {
    return undefined;
  }
})();
const SITE_TITLE = 'Maty\u00e1\u0161 Odehnal | Web Developer T\u0159eb\u00ed\u010d';
const SITE_DESCRIPTION = "Maty\u00e1\u0161 Odehnal is a web developer from T\u0159eb\u00ed\u010d who builds modern, affordable websites, UI/UX, and custom web apps.";

export const metadata: Metadata = {
  metadataBase,
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    'Matyas Odehnal',
    'Maty\u00e1\u0161 Odehnal',
    'web developer Trebic',
    'web developer T\u0159eb\u00ed\u010d',
    'affordable websites',
    'frontend developer',
    'UI UX design',
    'React developer',
  ],
  authors: [{ name: 'Maty\u00e1\u0161 Odehnal' }],
  creator: 'Maty\u00e1\u0161 Odehnal',
  publisher: 'Maty\u00e1\u0161 Odehnal',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: resolvedSiteUrl,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: 'Matyas Odehnal Portfolio',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Matyas Odehnal portfolio preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: '@matyasodehnal',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/favicon.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LocaleProvider>
          <ClientProviders>{children}</ClientProviders>
        </LocaleProvider>
      </body>
    </html>
  );
}

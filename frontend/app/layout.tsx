import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/sonner';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chandhannilayam.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Chandhan Nilayam Investments | Premium Sandalwood Plantation',
    template: '%s | Chandhan Nilayam Investments',
  },
  description:
    'Premium sandalwood land investment and plantation management platform. Grow your wealth with high-yield, nature-backed assets near Dornala.',
  keywords: [
    'Sandalwood Investment',
    'Red Sandalwood',
    'Plantation Investment',
    'Agricultural Land Investment',
    'High Yield Investment',
    'Dornala',
    'Chandhan Nilayam',
    'Eco-friendly Investment',
    'Farmland Investment India',
  ],
  authors: [{ name: 'Chandhan Nilayam Investments' }],
  creator: 'Chandhan Nilayam Investments',
  publisher: 'Chandhan Nilayam Investments',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    title: 'Chandhan Nilayam Investments | Premium Sandalwood Plantation',
    description: 'Grow your wealth with high-yield, nature-backed sandalwood assets near Dornala.',
    siteName: 'Chandhan Nilayam Investments',
    images: [
      {
        url: `/sandalwood_hero_bg.png`, // Using an existing image as fallback
        width: 1200,
        height: 630,
        alt: 'Chandhan Nilayam Investments',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chandhan Nilayam Investments | Premium Sandalwood Plantation',
    description: 'Grow your wealth with high-yield, nature-backed sandalwood assets near Dornala.',
    images: [`/sandalwood_hero_bg.png`],
  },
  icons: {
    icon: '/branding/chandhan-tree-mark.png',
    shortcut: '/branding/chandhan-tree-mark.png',
    apple: '/branding/chandhan-tree-mark.png',
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}

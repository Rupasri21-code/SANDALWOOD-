import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Chandan Nilayam – Sandalwood Investments',
  description:
    'Premium sandalwood land investment and plantation management platform. Grow your wealth with nature-backed assets.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}

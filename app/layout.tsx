import './globals.css';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/app/components/theme-provider';
import { PageTransitionProvider } from '@/app/components/page-transition';
import { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { baseUrl } from './sitemap';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const calSans = localFont({
  src: '../public/fonts/CalSans-SemiBold.ttf',
  variable: '--font-calsans',
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Christian Firmi',
    template: '%s | Christian Firmi',
  },
  description: 'This is my portfolio.',
  openGraph: {
    title: 'My Portfolio',
    description: 'This is my portfolio.',
    url: baseUrl,
    siteName: 'My Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const cx = (...classes) => classes.filter(Boolean).join(' ');
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={
        (cx('text-black bg-white dark:text-white dark:bg-black'),
          [inter.variable, calSans.variable].join(' '))
      }
    >
      <body
        className={`bg-white dark:bg-black ${process.env.NODE_ENV === 'development' ? 'debug-screens' : undefined
          } selection:bg-orange-500 selection:text-white`}
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <PageTransitionProvider>
            <main>{children}</main>
          </PageTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

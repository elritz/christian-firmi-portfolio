import './globals.css';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/app/components/theme-provider';
import { ModeToggle } from '@/app/components/mode-toggle';
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
    default: 'Next.js Portfolio Starter',
    template: '%s | Next.js Portfolio Starter',
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
      className={
        (cx('text-black bg-white dark:text-white dark:bg-black'),
        [inter.variable, calSans.variable].join(' '))
      }
    >
      <body
        className={`bg-white ${
          process.env.NODE_ENV === 'development' ? 'debug-screens' : undefined
        } selection:bg-orange-500 selection:text-white`}
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}

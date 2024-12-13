import './globals.css';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/app/components/theme-provider';
import { Analytics } from '@/app/components/analytics';
import { ModeToggle } from '@/app/components/mode-toggle';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'elritz',
    template: '%s | christianfirmi',
  },
  description: 'Software engineer ',
  openGraph: {
    title: 'christianfirmi.com',
    description: 'Software engineer',
    url: 'https://christianfirmi.com',
    siteName: 'christianfirmi.com',
    images: [
      {
        url: 'https://christianfirmi.com/og.png',
        width: 1920,
        height: 1080,
      },
    ],
    locale: 'en-US',
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
  twitter: {
    title: 'christianfirmi',
    card: 'summary_large_image',
  },
  icons: {
    shortcut: '/favicon.png',
  },
};

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

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en' className={[inter.variable, calSans.variable].join(' ')}>
      <body
        className={`bg-white ${
          process.env.NODE_ENV === 'development' ? 'debug-screens' : undefined
        } selection:bg-orange-500 selection:text-white`}
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <main>{children}</main>
          {/* </div> */}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Navigation } from '@/app/components/nav';
import { TransitionLink } from '@/app/components/page-transition';
import { baseUrl } from '@/app/sitemap';
import { Side, Sides, Step, Steps } from './components';

// Update this whenever the article changes.
const revised = '2026-09-25';

const lede =
  "I'm Christian Firmi, a software product engineer focused on mobile applications. I work in both, and I carry an idea from the first sketch to the shipped release, aware of every layer in between.";

export const metadata: Metadata = {
  title: 'Product Engineer',
  description: lede,
};

const links = [
  { label: 'My Work', href: '/blog' },
  {
    label: 'Resume',
    href: 'https://docs.google.com/document/d/1FG2dIAHsFhA-ndpTCtJct_Mh2Vj7sNhAHKLf_daCg20/edit?usp=sharing',
  },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/christianfirmi/' },
  { label: 'GitHub', href: 'https://github.com/elritz' },
  { label: 'Email', href: 'mailto:christianfirmi@gmail.com' },
];

function MdxLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const className =
    'underline underline-offset-4 decoration-zinc-400 hover:decoration-zinc-900 dark:decoration-zinc-500 dark:hover:decoration-zinc-100 duration-200';
  const href = props.href ?? '';
  if (href.startsWith('/')) {
    return <Link href={href} className={className} {...props} />;
  }
  return (
    <a target='_blank' rel='noopener noreferrer' className={className} {...props} />
  );
}

const components = {
  Steps,
  Step,
  Sides,
  Side,
  a: MdxLink,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className='mt-16 mb-4 font-display text-2xl text-zinc-900 sm:text-3xl dark:text-zinc-100'
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className='mt-5 leading-7 text-zinc-700 dark:text-zinc-300' {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className='mt-5 list-disc space-y-3 pl-5 leading-7 text-zinc-700 marker:text-zinc-400 dark:text-zinc-300 dark:marker:text-zinc-600'
      {...props}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className='font-medium text-zinc-900 dark:text-zinc-100' {...props} />
  ),
};

export default function AboutPage() {
  const source = fs.readFileSync(
    path.join(process.cwd(), 'app', 'about', 'content.mdx'),
    'utf-8'
  );

  return (
    <div className='relative min-h-screen bg-white pb-24 dark:bg-zinc-900'>
      <Navigation />
      <script
        type='application/ld+json'
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Christian Firmi',
            jobTitle: 'Product Engineer',
            url: `${baseUrl}/about`,
            sameAs: [
              'https://www.linkedin.com/in/christianfirmi/',
              'https://github.com/elritz',
            ],
          }),
        }}
      />
      <div className='mx-auto w-full max-w-[40rem] px-6 pt-32 md:pt-40'>
        <header>
          <h1 className='font-display text-4xl leading-[1.05] text-zinc-900 sm:text-5xl md:text-6xl dark:text-zinc-100'>
            <span className='block tracking-tight'>Engineering is strict.</span>
            <span className='block tracking-wide'>Design is open.</span>
          </h1>
          <p className='mt-8 text-lg leading-8 text-zinc-700 sm:text-xl sm:leading-9 dark:text-zinc-300'>
            {lede}
          </p>
          <p className='mt-4 text-sm text-zinc-500 dark:text-zinc-400'>
            A living article, last revised{' '}
            <time dateTime={revised}>
              {new Date(`${revised}T00:00:00`).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            .
          </p>
        </header>

        <article className='mt-6'>
          {/* @ts-expect-error Server Component */}
          <MDXRemote source={source} components={components} />
        </article>

        <footer className='mt-20 border-t border-zinc-200 pt-8 dark:border-zinc-800'>
          <p className='text-zinc-700 dark:text-zinc-300'>
            See the work, or get in touch.
          </p>
          <ul className='mt-4 flex flex-wrap gap-x-8 gap-y-3'>
            {links.map((link) => (
              <li key={link.label}>
                <TransitionLink
                  href={link.href}
                  target={link.href.startsWith('/') ? undefined : '_blank'}
                  className='font-display text-lg text-zinc-900 underline underline-offset-4 decoration-zinc-300 duration-200 hover:decoration-orange-500 dark:text-zinc-100 dark:decoration-zinc-700 dark:hover:decoration-orange-500'
                >
                  {link.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </div>
  );
}

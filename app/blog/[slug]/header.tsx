'use client';
import { ArrowLeft, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { Metadata } from '../utils';
import { useRouter } from 'next/navigation';
import { ModeToggle } from '@/app/components/mode-toggle';
import { tagLabel } from '@/app/blog/tags';
import { workHash } from '@/app/components/work-tabs-config';

type Props = {
  post: {
    metadata: Metadata;
    slug: string;
    content: string;
  };
};
export const Header: React.FC<Props> = ({ post }) => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(true);
  const router = useRouter();
  const { brand, brandEnd, heroImage, tags = [] } = post.metadata;
  // A post can carry its product's brand colour. The header then paints the
  // band the product's own site uses instead of the neutral gradient.
  const branded = Boolean(brand);
  const showHero = branded && Boolean(heroImage);

  const links: { label: string; href: string }[] = [];
  if (post.metadata.repo) {
    links.push({
      label: 'GitHub',
      href: `https://github.com/${post.metadata.repo}`,
    });
  }
  if (post.metadata.url) {
    links.push({
      label: 'Website',
      href: post.metadata.url,
    });
  }
  if (post.metadata.appStore) {
    links.push({ label: 'App Store', href: post.metadata.appStore });
  }
  if (post.metadata.playStore) {
    links.push({ label: 'Google Play', href: post.metadata.playStore });
  }
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Nav controls sit on the header while it is in view, then over the page.
  const iconClass = isIntersecting
    ? branded
      ? 'text-white/80 hover:text-white'
      : 'text-zinc-400 hover:text-zinc-100'
    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white';
  const toggleClass = isIntersecting
    ? branded
      ? 'text-white'
      : ''
    : 'text-zinc-700 dark:text-zinc-200';

  return (
    <header
      ref={ref}
      style={
        branded
          ? {
              background: `linear-gradient(to right, ${brand}, ${brandEnd ?? brand} 75%)`,
            }
          : undefined
      }
      className={`relative isolate overflow-hidden ${
        branded
          ? 'text-white'
          : 'bg-gradient-to-tl from-white via-zinc-200 to-white dark:from-black dark:bg-black'
      }`}
    >
      <div
        className={`fixed inset-x-0 top-0 z-50 backdrop-blur lg:backdrop-blur-none duration-200 border-b lg:bg-transparent ${
          isIntersecting
            ? 'bg-zinc-900/0 border-transparent'
            : 'bg-white/10 border-zinc-200 dark:border-zinc-800 lg:border-transparent'
        }`}
      >
        <div className='container flex flex-row-reverse items-center justify-between p-6 mx-auto'>
          <div className='flex justify-between gap-8'>
            <Link target='_blank' href='https://github.com/elritz'>
              <Github
                className={`w-6 h-6 duration-200 hover:font-medium ${iconClass}`}
              />
            </Link>
          </div>
          <span className={toggleClass}>
            <ModeToggle />
          </span>
          <a
            onClick={() => router.back()}
            className={`duration-200 hover:font-medium ${iconClass}`}
          >
            <ArrowLeft className='w-6 h-6 ' />
          </a>
        </div>
      </div>
      <div
        className={`container mx-auto relative isolate overflow-hidden ${
          branded ? 'pt-28 pb-16 sm:pt-36 sm:pb-24' : 'sm:py-32 mt-20'
        }`}
      >
        <div
          className={`mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center text-center ${
            showHero
              ? 'gap-12 md:flex-row md:justify-center md:gap-16 md:text-left lg:gap-24'
              : ''
          }`}
        >
          <div className='mx-auto max-w-2xl md:mx-0'>
            <h1
              className={`text-4xl font-bold tracking-tight sm:text-6xl font-display ${
                branded ? 'text-white' : 'text-zinc-900 dark:text-white'
              }`}
            >
              {post.metadata.title}
            </h1>
            <p
              className={`mt-6 text-lg leading-8 ${
                branded ? 'text-white/90' : 'text-zinc-900 dark:text-zinc-300'
              }`}
            >
              {post.metadata.description}
            </p>
            {tags.length > 0 && (
              <ul
                aria-label='Tags'
                className={`mt-6 flex flex-wrap justify-center gap-2 ${
                  showHero ? 'md:justify-start' : ''
                }`}
              >
                {tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/blog${workHash(post.metadata.type, tag)}`}
                      className={`inline-block rounded-full border px-3 py-1 text-xs font-medium leading-5 duration-200 ${
                        branded
                          ? 'border-white/40 bg-white/10 text-white hover:bg-white/25'
                          : 'border-zinc-300 bg-white/60 text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:border-white dark:hover:text-white'
                      }`}
                    >
                      {tagLabel(tag)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div
              className={`mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4 text-base font-semibold leading-7 ${
                showHero ? 'md:justify-start' : ''
              } ${branded ? 'text-white' : 'text-zinc-900 dark:text-white'}`}
            >
              {links.map((link) => (
                <Link target='_blank' key={link.label} href={link.href}>
                  {link.label} <span aria-hidden='true'>&rarr;</span>
                </Link>
              ))}
            </div>
          </div>
          {showHero && (
            <Image
              src={heroImage!}
              alt=''
              width={352}
              height={714}
              priority
              className='h-auto w-40 shrink-0 sm:w-48 md:w-56 lg:w-64 drop-shadow-[0_28px_48px_rgba(0,0,0,0.4)]'
            />
          )}
        </div>
      </div>
    </header>
  );
};

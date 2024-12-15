'use client';
import { ArrowLeft, Github } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { Metadata } from '../utils';
import { useRouter } from 'next/navigation';

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
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={ref}
      className='relative isolate overflow-hidden bg-gradient-to-tl from-white via-zinc-200 to-white dark:from-black dark:bg-black dark:bg-black'
    >
      <div
        className={`fixed inset-x-0 top-0 z-50 backdrop-blur lg:backdrop-blur-none duration-200 border-b lg:bg-transparent ${
          isIntersecting
            ? 'bg-zinc-900/0 border-transparent'
            : 'bg-white/10  border-zinc-200 lg:border-transparent'
        }`}
      >
        <div className='container flex flex-row-reverse items-center justify-between p-6 mx-auto'>
          <div className='flex justify-between gap-8'>
            <Link target='_blank' href='https://github.com/elritz'>
              <Github
                className={`w-6 h-6 duration-200 hover:font-medium ${
                  isIntersecting
                    ? ' text-zinc-400 hover:text-zinc-100'
                    : 'text-zinc-600 hover:text-zinc-900'
                } `}
              />
            </Link>
          </div>

          <a
            onClick={() => router.back()}
            className={`duration-200 hover:font-medium ${
              isIntersecting
                ? ' text-zinc-400 hover:text-zinc-100'
                : 'text-zinc-600 hover:text-zinc-900'
            } `}
          >
            <ArrowLeft className='w-6 h-6 ' />
          </a>
        </div>
      </div>
      <div className='container mx-auto relative isolate overflow-hidden sm:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center'>
          <div className='mx-auto max-w-2xl lg:mx-0'>
            <h1 className='text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl font-display'>
              {post.metadata.title}
            </h1>
            <p className='mt-6 text-lg leading-8 text-zinc-900 dark:text-zinc-300'>
              {post.metadata.description}
            </p>
          </div>

          <div className='mx-auto mt-5 max-w-2xl lg:mx-0 lg:max-w-none'>
            <div className='grid grid-cols-1 gap-y-6 gap-x-8 text-base font-semibold leading-7 text-zinc-900 dark:text-white sm:grid-cols-2 md:flex lg:gap-x-10'>
              {links.map((link) => (
                <Link target='_blank' key={link.label} href={link.href}>
                  {link.label} <span aria-hidden='true'>&rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

'use client';
import { Github, Mail } from 'lucide-react';
import Link from 'next/link';
import { Navigation } from '@/app/components/nav';
import { Card } from '@/app/components/card';

const socials = [
  // {
  //   icon: <Twitter size={20} />,
  //   href: "https://twitter.com/barfriendsinc",
  //   label: "Twitter",
  //   handle: "@barfriendsinc",
  // },
  {
    icon: <Mail size={20} />,
    href: 'mailto:christianfirmi@gmail.com',
    label: 'Email',
    handle: 'christianfirmi@gmail.com',
  },
  {
    icon: <Github size={20} />,
    href: 'https://github.com/elritz',
    label: 'Github',
    handle: 'elritz',
  },
];

export default function Example() {
  return (
    <div className=' bg-gradient-to-tl from-zinc-900/0 dark:from-zinc-700 via-zinc-200 to-zinc-900/0'>
      <Navigation />
      <div className='container flex items-center justify-center min-h-screen px-4 mx-auto'>
        <div className='grid w-3/4 grid-cols-1 gap-8 mx-auto mt-32 sm:mt-0 sm:grid-cols-2 lg:gap-16'>
          {socials.map((s) => (
            <Card key={s.href}>
              <Link
                href={s.href}
                target='_blank'
                className='p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24  lg:pb-48  md:p-16'
              >
                <span
                  className='absolute w-px h-2/3 bg-gradient-to-b from-zinc-900 via-zinc-800/90 to-transparent'
                  aria-hidden='true'
                />
                <span className='relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-100 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-700 drop-shadow-orange'>
                  {s.icon}
                </span>{' '}
                <div className='z-10 flex flex-col items-center'>
                  <span className='text-xl font-medium duration-150 dark:text-zinc-200 lg:text-3xl text-zinc-900 group-hover:text-white font-display'>
                    {s.handle}
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

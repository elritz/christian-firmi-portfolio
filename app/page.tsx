import Link from 'next/link';
import { TransitionLink } from '@/app/components/page-transition';
import { ModeToggle } from '@/app/components/mode-toggle';
import TrunkBackground from '@/app/components/trunk-background';
const navigation = [
  { name: 'My Work', href: '/blog' },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/christianfirmi/',
    target: 'blank',
  },
  {
    name: 'Resume',
    href: 'https://docs.google.com/document/d/1FG2dIAHsFhA-ndpTCtJct_Mh2Vj7sNhAHKLf_daCg20/edit?usp=sharing',
    target: 'blank',
  },
];

export default function Home() {
  return (
    <div className='dark:prose-invert'>
      <div className='relative isolate flex flex-col items-center justify-center overflow-x-hidden bg-[#f5f6f2] dark:bg-[#040705]'>
        <TrunkBackground className='absolute inset-0' />
        <div className='relative h-screen flex items-center justify-center w-screen px-4 sm:px-8'>
          <div
            aria-hidden='true'
            className='pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[min(110vw,64rem)] -translate-x-1/2 -translate-y-1/2 bg-white/25 backdrop-blur-md [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_72%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_72%)] dark:bg-black/25'
          />
          <div className='relative w-full max-w-4xl py-11'>
            <nav className='flex justify-center animate-fade-in relative z-50'>
              <ul className='flex align-center justify-center gap-4 z-50'>
                {navigation.map((item, index) => (
                  <TransitionLink
                    key={index}
                    target={item.target}
                    href={item.href}
                    className='text-md dark:text-zinc-200 duration-200 text-zinc-500 hover:text-zinc-900 xs:text-md sm:text-md lg md:text-xl lg:text-xl flex flex-row justify-center items-center'
                  >
                    <p>{item.name}</p>
                  </TransitionLink>
                ))}
                <span className='ml-2 flex items-center text-zinc-500 dark:text-zinc-200'>
                  <ModeToggle />
                </span>
              </ul>
            </nav>
            <div className='hidden w-full h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0' />
            <h1 className='mt-4 text-5xl sm:text-7xl md:text-8xl dark:text-zinc-200 decoration-orange-500 text-transparent duration-1000 bg-black cursor-default text-edge-outline animate-title font-display  whitespace-nowrap bg-clip-text text-center'>
              Christian Firmi
            </h1>
            <div className='hidden w-full h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0' />
            <div className='mt-10 md:mt-16 text-center animate-fade-in'>
              <h2 className='text-md text-zinc-500 dark:text-zinc-200  mx-auto leading-2 md:text-xl md:w-[80%]'>
                I&apos;m a{' '}
                <TransitionLink
                  href='/about'
                  className='font-medium text-zinc-900 underline decoration-orange-500 decoration-2 underline-offset-4 duration-300 hover:text-orange-600 dark:text-white dark:hover:text-orange-400'
                >
                  software product engineer
                </TransitionLink>{' '}
                focused on mobile applications, principled in engineering, and
                creative in design. Currently at{' '}
                <Link
                  target='_blank'
                  href='https://store.goiguide.com/'
                  className='underline duration-500 hover:text-zinc-300'
                >
                  iGuide Planitar
                </Link>
                , coding as{' '}
                <Link
                  target='_blank'
                  href='https://github.com/elritz'
                  className='underline duration-500 hover:text-zinc-300'
                >
                  @elritz
                </Link>
                .
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

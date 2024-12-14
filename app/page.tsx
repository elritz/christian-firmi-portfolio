import Link from 'next/link';
import Particles from '@/app/components/particles';
const navigation = [
  { name: 'Projects', href: '/blog' },
  { name: 'Contact', href: '/contact' },
  // { name: "Q&A", href: "/q&a" },
  {
    name: 'Github',
    href: 'https://github.com/elritz',
    target: 'blank',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/cfirmi/',
    target: 'blank',
  },
  {
    name: 'Resume',
    href: 'https://docs.google.com/document/d/1Bjt-_Rbh_Ffq987QkP6dcH3B9hsCBhRDG1O0Fv_0ew4/edit?usp=sharing',
    target: 'blank',
  },
];
export default function Home() {
  return (
    <div className='dark:prose-invert'>
      <div className='flex flex-col items-center justify-center overflow-x-hidden bg-gradient-to-tl from-white via-zinc-600/20 to-slate-200'>
        <Particles
          className='absolute inset-0 -z-10 animate-fade-in'
          quantity={100}
        />
        <div className='h-screen flex  items-center justify-center w-screen'>
          <div className='flex-1 py-11 flex-col'>
            <nav className='flex justify-center animate-fade-in relative z-50'>
              <ul className='flex align-center justify-center gap-4 z-50'>
                {navigation.map((item, index) => (
                  <Link
                    target={item.target}
                    href={item.href}
                    className='text-md duration-200 text-zinc-500 hover:text-zinc-900 xs:text-md sm:text-md lg md:text-xl lg:text-xl flex flex-row justify-center items-center'
                  >
                    <p key={index}>{item.name}</p>
                  </Link>
                ))}
              </ul>
            </nav>
            <div className='hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0' />
            <h1 className='-z-10 mt-4 text-8xl  decoration-orange-500 text-transparent duration-1000 bg-black cursor-default text-edge-outline animate-title font-display  whitespace-nowrap bg-clip-text text-center'>
              elritz
            </h1>
            <div className='hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0' />
            <div className='my-16 text-center animate-fade-in'>
              <h2 className='text-md text-zinc-500 '>
                Hi, my name is Christian, I&apos;m a software engineer. I work
                with TypeScript and am currently working towards better
                understanding Data structures and GOLANG <br />
                and working at night on{' '}
                <Link
                  target='_blank'
                  href='https://barfriends.com/'
                  className='underline duration-500 hover:text-zinc-300'
                >
                  Barfriends
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

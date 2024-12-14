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
  return <div className='dark:prose-invert'></div>;
}

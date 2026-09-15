import React from 'react';
import { Navigation } from '@/app/components/nav';
import { WorkTabs } from '@/app/components/work-tabs';
import { getBlogPosts } from '@/app/blog/utils';

export const revalidate = 60;
export default async function WorkPage() {
  const posts = getBlogPosts().map(({ slug, metadata }) => ({ slug, metadata }));
  return (
    <div className='relative overflow-x-hidden pb-16'>
      <div aria-hidden='true' className='pointer-events-none absolute inset-x-0 top-0 h-[70vh] overflow-hidden'>
        <div className='trunk-beam trunk-beam-static' />
      </div>
      <Navigation />
      <div className='relative px-6 pt-16 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32 w-full lg:w-[75%]'>
        <div className='max-w-2xl mx-auto lg:mx-0'>
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            My Work
          </h2>
          <p className='mt-4'>
            Products I&apos;ve produced, the roles I&apos;ve held, and the things I do for fun. For each, I detail my goals, the challenges I faced, and the lessons I learned along the way.
          </p>
        </div>
        <WorkTabs posts={posts} />
      </div>
    </div>
  );
}

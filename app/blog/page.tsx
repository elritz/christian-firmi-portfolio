import React from 'react';
import { Navigation } from '@/app/components/nav';
import { BlogPosts } from '@/app/components/posts';

export const revalidate = 60;
export default async function ProjectsPage() {
  return (
    <div className='relative pb-16'>
      <Navigation />
      <div className='px-6 pt-16 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32 w-[75%]'>
        <div className='max-w-2xl mx-auto lg:mx-0'>
          <h2 className='text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl'>
            Projects & Jobs
          </h2>
          <p className='mt-4 text-zinc-800'>
            Some of the projects are from work and some are on my own time. I
            explain what i am trying to achieve with each project and what i
            have learned.
          </p>
        </div>
        <BlogPosts />
      </div>
    </div>
  );
}

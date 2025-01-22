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
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            Projects & Professional Jobs
          </h2>
          <p className='mt-4'>
            Some of these projects were completed as part of my professional work, while others were personal endeavors. For each, I detail my goals, the challenges I faced, and the lessons I learned along the way.
          </p>
        </div>
        <BlogPosts />
      </div>
    </div>
  );
}

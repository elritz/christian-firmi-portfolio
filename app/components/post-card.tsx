import Link from 'next/link';
import { Card } from './card';
import type { Metadata } from '@/app/blog/utils';

export type PostSummary = { slug: string; metadata: Metadata };

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link className='flex flex-col space-y-1 mb-4' href={`/blog/${post.slug}`}>
      <Card>
        <article className='relative w-full h-full'>
          <div className='w-full h-40 overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center'>
            {post.metadata.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.metadata.image}
                alt={post.metadata.title}
                className='w-full h-full object-cover'
                style={{ objectPosition: post.metadata.imagePosition ?? 'center' }}
              />
            ) : (
              <div className='w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900' />
            )}
          </div>
          <div className='p-4 md:p-8'>
            <div className='flex justify-between gap-2 items-center'>
              <span className='text-xs group-hover:text-black dark:group-hover:text-white drop-shadow-orange'>
                {post.metadata.date ? (
                  <time dateTime={new Date(post.metadata.date).toISOString()}>
                    {Intl.DateTimeFormat(undefined, {
                      dateStyle: 'medium',
                    }).format(new Date(post.metadata.date))}
                  </time>
                ) : (
                  <span>SOON</span>
                )}
              </span>
              <div className='flex flex-row gap-3'>
                <div>{post.metadata.current ? 'Current' : ''}</div>
                {post.metadata.star ? '⭐️' : ''}
              </div>
            </div>
            <h2 className='z-20 mt-2 text-xl font-medium lg:text-3xl group-hover:text-black dark:group-hover:text-white font-display'>
              {post.metadata.title}
            </h2>
            <p className='z-20 mt-4 text-sm dark:group-hover:text-white group-hover:text-zinc-800'>
              {post.metadata.description}
            </p>
          </div>
        </article>
      </Card>
    </Link>
  );
}

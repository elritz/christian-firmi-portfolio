import Link from 'next/link';
import { Card } from './card';
import type { Metadata } from '@/app/blog/utils';
import { tagLabel } from '@/app/blog/tags';

export type PostSummary = { slug: string; metadata: Metadata };

// Date-only strings ("2025-01-01") parse as UTC midnight, which renders as the
// previous day in western time zones. Pin them to local midnight instead.
function parseLocalDate(date: string) {
  return new Date(date.includes('T') ? date : `${date}T00:00:00`);
}

const MAX_TAGS = 4;

export function PostCard({ post }: { post: PostSummary }) {
  const tags = post.metadata.tags ?? [];
  const shown = tags.slice(0, MAX_TAGS);
  const more = tags.length - shown.length;
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
                  <time dateTime={post.metadata.date}>
                    {Intl.DateTimeFormat(undefined, {
                      dateStyle: 'medium',
                    }).format(parseLocalDate(post.metadata.date))}
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
            {shown.length > 0 && (
              <ul aria-label='Tags' className='z-20 mt-4 flex flex-wrap gap-1.5'>
                {shown.map((tag) => (
                  <li
                    key={tag}
                    className='rounded-full border border-zinc-300/70 px-2 py-0.5 text-[11px] leading-4 text-zinc-500 group-hover:border-zinc-400 group-hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:group-hover:border-zinc-500 dark:group-hover:text-zinc-200'
                  >
                    {tagLabel(tag)}
                  </li>
                ))}
                {more > 0 && (
                  <li className='px-1 py-0.5 text-[11px] leading-4 text-zinc-400 dark:text-zinc-500'>
                    +{more}
                  </li>
                )}
              </ul>
            )}
          </div>
        </article>
      </Card>
    </Link>
  );
}

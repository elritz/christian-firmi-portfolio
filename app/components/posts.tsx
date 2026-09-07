import Link from 'next/link';
import { getBlogPosts } from '@/app/blog/utils';
import { Card } from './card';

const TYPE_ORDER = ['professional', 'projects', 'travel', 'hobbies & interests'];

export function BlogPosts() {
  let allBlogs = getBlogPosts();

  const blogsByType: { [key: string]: typeof allBlogs } = allBlogs.reduce(
    (acc, post) => {
      const { type } = post.metadata;
      if (type) {
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(post);
      }
      return acc;
    },
    {} as { [key: string]: typeof allBlogs }
  );

  const orderedTypes = TYPE_ORDER.filter((t) => blogsByType[t]);
  const remaining = Object.keys(blogsByType).filter((t) => !TYPE_ORDER.includes(t));
  const allTypes = [...orderedTypes, ...remaining];

  return (
    <div className='space-y-14'>
      {allTypes.map((type) => {
        const isProfessional = type === 'professional';
        return (
          <div key={type}>
            <div className={`flex items-center gap-3 mb-6 ${isProfessional ? 'border-b border-zinc-500 pb-3' : ''}`}>
              {isProfessional && (
                <span className='px-2 py-0.5 text-xs font-semibold uppercase tracking-widest bg-zinc-700 text-zinc-200 rounded'>
                  Work
                </span>
              )}
              <h2
                className={`capitalize font-bold ${
                  isProfessional ? 'text-4xl text-white' : 'text-3xl text-zinc-400'
                }`}
              >
                {type}
              </h2>
            </div>
            <div className='grid grid-flow-row-dense gap-8 mx-auto grid-cols-1 sm:grid-cols-2'>
              {blogsByType[type]
                .sort((a, b) => {
                  if (new Date(a.metadata.date) > new Date(b.metadata.date)) {
                    return -1;
                  }
                  return 1;
                })
                .map((post) => (
                  <Link
                    key={post.slug}
                    className='flex flex-col space-y-1 mb-4'
                    href={`/blog/${post.slug}`}
                  >
                    <Card>
                      <article className='relative w-full h-full'>
                        <div className='w-full h-40 overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center'>
                          {post.metadata.image ? (
                            <img
                              src={post.metadata.image}
                              alt={post.metadata.title}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900' />
                          )}
                        </div>
                        <div className='p-4 md:p-8'>
                          <div className='flex justify-between gap-2 items-center'>
                            <span className='text-xs group-hover:text-black dark:group-hover:text-white drop-shadow-orange'>
                              {post.metadata.date ? (
                                <time
                                  dateTime={new Date(post.metadata.date).toISOString()}
                                >
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
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

import Link from 'next/link';
import { getBlogPosts } from '@/app/blog/utils';
import { Card } from './card';

export function BlogPosts() {
  let allBlogs = getBlogPosts();

  allBlogs = allBlogs.map((post) => {
    post.metadata.title = post.metadata.title;
    return post;
  });

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
    {}
  );

  return (
    <div>
      {Object.keys(blogsByType)
        .map((type) => (
          <div key={type}>
            <h2 className='text-3xl capitalize font-bold mb-4'>{type}</h2>
            <div className='grid grid-flow-row-dense gap-8 mx-auto grid-cols-2'>
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
                      <div className='flex items-center justify-between gap-2'>
                        <article className='relative w-full h-full p-4 md:p-8'>
                          <div className='flex justify-between gap-2 items-center'>
                            <span className='text-xs group-hover:text-black dark:group-hover:text-white group-hover:border-zinc-800 drop-shadow-orange'>
                              {post.metadata.date ? (
                                <time
                                  dateTime={new Date(
                                    post.metadata.date
                                  ).toISOString()}
                                >
                                  {Intl.DateTimeFormat(undefined, {
                                    dateStyle: 'medium',
                                  }).format(new Date(post.metadata.date))}
                                </time>
                              ) : (
                                <span>SOON</span>
                              )}
                            </span>
                            <div className='flex flex-col space-y-1'>
                              <div>
                                {post.metadata.current ? 'Current' : ''}
                              </div>
                            </div>
                          </div>
                          <h2 className='z-20 text-xl font-medium lg:text-3xl group-hover:text-black dark:group-hover:text-white font-display'>
                            {post.metadata.title}
                            <p className='text-base group-hover:text-zinc-800 dark:group-hover:text-white'>
                              {post.metadata.type}
                            </p>
                          </h2>
                          <p className='z-20 mt-4 text-sm dark:group-hover:text-white group-hover:text-zinc-800'>
                            {post.metadata.description}
                          </p>
                        </article>
                      </div>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        ))
        .reverse()}
    </div>
  );
}

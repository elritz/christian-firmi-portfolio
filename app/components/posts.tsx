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
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(post);
      return acc;
    },
    {}
  );

  return <div></div>;
}

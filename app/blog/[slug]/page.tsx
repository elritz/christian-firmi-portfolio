import { notFound } from 'next/navigation';

import { Header } from './header';
import { ReportView } from './view';

import { CustomMDX } from '@/app/components/mdx';
import { formatDate, getBlogPosts } from '@/app/blog/utils';
import { baseUrl } from '@/app/sitemap';

export async function generateStaticParams() {
  let posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  let { title, date, description, repo, published } = post.metadata;
  // let ogImage = image
  //   ? image
  //   : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    repo,
    published,
  };
}

export default function Blog({ params }) {
  console.log('🚀 ~ file: page.tsx:67 ~ Blog ~ params:', params);

  let post = getBlogPosts().find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <section>
      <script
        type='application/ld+json'
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.date,
            dateModified: post.metadata.date,
            description: post.metadata.description,
            url: `${baseUrl}/blog/${post.slug}`,
          }),
        }}
      />
      <Header post={post} />
      <article className='px-4 py-12 mx-auto prose prose-zinc prose-quoteless'>
        <CustomMDX source={post.content} />
      </article>
    </section>
  );
}

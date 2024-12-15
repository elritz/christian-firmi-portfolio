import { notFound } from 'next/navigation';
import { CustomMDX } from '@/app/components/mdx';
import { getBlogPosts } from '@/app/blog/utils';
import { baseUrl } from '@/app/sitemap';
import MdxLayout from '@/app/components/mdx-layout';

export async function generateStaticParams() {
  let posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  let { title, date, description, repo, published } = post.metadata;
  return {
    title,
    description,
    repo,
    published,
  };
}

export default async function Blog({ params }: { params: { slug: string } }) {
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
      <MdxLayout post={post}>
        <div className=''>
          <article className='px-4 py-12 mx-auto prose prose-zinc prose-quoteless'>
            <CustomMDX source={post.content} />
          </article>
        </div>
      </MdxLayout>
    </section>
  );
}

import { Header } from '../blog/[slug]/header';

export default function MdxLayout({
  children,
  post,
}: {
  children: React.ReactNode;
  post: any;
}) {
  // Create any shared layout or styles here
  return (
    <div className=''>
      <Header post={post} />
      {children}
    </div>
  );
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative min-h-screen bg-gradient-to-tl light:from-zinc-300 light:via-zinc-400/10 light:to-zinc-300 dark:bg-zinc-900'>
      {children}
    </div>
  );
}

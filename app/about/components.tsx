import React from 'react';

type StepProps = {
  title: string;
  n?: number;
  children: React.ReactNode;
};

export function Steps({ children }: { children: React.ReactNode }) {
  const items = React.Children.toArray(children).filter(
    React.isValidElement
  ) as React.ReactElement<StepProps>[];
  return (
    <ol className='mt-8 mb-12 ml-3 list-none border-l border-zinc-300 p-0 dark:border-zinc-700'>
      {items.map((child, i) =>
        React.cloneElement(child, { n: i + 1, key: i })
      )}
    </ol>
  );
}

export function Step({ n, title, children }: StepProps) {
  return (
    <li className='relative pl-8 pb-10 last:pb-0'>
      <span
        aria-hidden
        className='absolute -left-[0.8125rem] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 bg-white font-display text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
      >
        {n}
      </span>
      <h3 className='font-display text-xl leading-6 text-zinc-900 dark:text-zinc-100'>
        {title}
      </h3>
      <div className='mt-2 [&>p]:mt-3 [&>p:first-child]:mt-0'>{children}</div>
    </li>
  );
}

export function Sides({ children }: { children: React.ReactNode }) {
  return (
    <div className='my-10 grid gap-10 lg:-mx-24 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-orange-500'>
      {children}
    </div>
  );
}

export function Side({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className='lg:px-10 lg:first:pl-0 lg:last:pr-0'>
      <h3 className='font-display text-xl text-zinc-900 dark:text-zinc-100'>
        {title}
      </h3>
      <div className='mt-3 [&>p]:mt-3 [&>p:first-child]:mt-0'>{children}</div>
    </section>
  );
}

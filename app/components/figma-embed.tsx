'use client';

import { useState } from 'react';

type Props = {
  title: string;
  /** Figma embed URL (embed.figma.com/... or figma.com/embed?...). */
  src: string;
  /** Link to open the file in Figma itself. */
  href?: string;
  /** Height of the loaded embed in pixels. */
  height?: number;
};

// A Figma embed boots the whole Figma editor, so a page with several of them
// crawls. Nothing loads until the reader asks for it; until then this is a
// light placeholder that reads correctly in both themes.
export function FigmaEmbed({ title, src, href, height = 520 }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <figure className='not-prose my-8'>
      <div
        className='overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60'
        style={{ height: open ? height : 240 }}
      >
        {open ? (
          <iframe
            title={title}
            src={src}
            loading='lazy'
            allowFullScreen
            className='h-full w-full bg-white'
          />
        ) : (
          <button
            type='button'
            onClick={() => setOpen(true)}
            className='group flex h-full w-full flex-col items-center justify-center gap-3 text-zinc-600 dark:text-zinc-300'
          >
            <FigmaMark />
            <span className='font-display text-lg text-zinc-900 dark:text-zinc-100'>
              {title}
            </span>
            <span className='rounded-full bg-zinc-900 px-4 py-1.5 text-sm text-white duration-200 group-hover:bg-orange-500 dark:bg-white dark:text-zinc-900 dark:group-hover:bg-orange-500 dark:group-hover:text-white'>
              Load design
            </span>
          </button>
        )}
      </div>
      {href && (
        <figcaption className='mt-2 text-sm text-zinc-500 dark:text-zinc-400'>
          <a
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className='underline underline-offset-4 decoration-zinc-300 duration-200 hover:decoration-orange-500 dark:decoration-zinc-700'
          >
            Open {title} in Figma &rarr;
          </a>
        </figcaption>
      )}
    </figure>
  );
}

function FigmaMark() {
  return (
    <svg
      aria-hidden
      viewBox='0 0 38 57'
      className='h-9 w-6 opacity-80 duration-200 group-hover:opacity-100'
    >
      <path d='M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z' fill='#1ABCFE' />
      <path d='M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z' fill='#0ACF83' />
      <path d='M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z' fill='#FF7262' />
      <path d='M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z' fill='#F24E1E' />
      <path d='M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z' fill='#A259FF' />
    </svg>
  );
}

import Image from 'next/image';

// Building blocks for project posts, used from MDX.

/** A row of phone screenshots with captions. */
export function Screens({ children }: { children: React.ReactNode }) {
  return (
    <div className='not-prose my-10 grid grid-cols-2 gap-4 sm:grid-cols-4'>
      {children}
    </div>
  );
}

export function Screen({ src, caption }: { src: string; caption: string }) {
  return (
    <figure className='m-0'>
      <Image
        src={src}
        alt={caption}
        width={690}
        height={1400}
        className='h-auto w-full rounded-2xl border border-zinc-200 dark:border-zinc-800'
      />
      <figcaption className='mt-2 text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400'>
        {caption}
      </figcaption>
    </figure>
  );
}

/** Tech stack laid out as labelled groups of chips. */
export function Stack({ children }: { children: React.ReactNode }) {
  return <div className='not-prose my-6 grid gap-6 sm:grid-cols-3'>{children}</div>;
}

export function StackGroup({ title, items }: { title: string; items: string }) {
  const list = items
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return (
    <div>
      <h3 className='font-display text-base text-zinc-900 dark:text-zinc-100'>{title}</h3>
      <ul className='mt-3 flex flex-wrap gap-2'>
        {list.map((item) => (
          <li
            key={item}
            className='rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Headline features, shown as cards near the top of a post. */
export function Highlights({ children }: { children: React.ReactNode }) {
  return <div className='not-prose my-10 grid gap-6 md:grid-cols-2'>{children}</div>;
}

export function Highlight({
  title,
  eyebrow,
  visual,
  children,
}: {
  title: string;
  eyebrow?: string;
  visual?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className='flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'>
      {visual}
      <div className='p-6'>
        {eyebrow && (
          <p className='text-xs font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400'>
            {eyebrow}
          </p>
        )}
        <h3 className='mt-2 font-display text-2xl text-zinc-900 dark:text-zinc-100'>{title}</h3>
        <div className='mt-3 space-y-3 text-[15px] leading-7 text-zinc-700 dark:text-zinc-300'>
          {children}
        </div>
      </div>
    </section>
  );
}

// Illustrative moods. The app's real set is seeded data, so these only show the mechanic.
const MOODS = [
  { emoji: '🥳', colors: ['#ff7000', '#ff2d55'] },
  { emoji: '😎', colors: ['#00c6ff', '#0072ff'] },
  { emoji: '💃', colors: ['#f953c6', '#b91d73'] },
  { emoji: '🍻', colors: ['#f7b733', '#fc4a1a'] },
  { emoji: '🌙', colors: ['#7f5af0', '#2cb67d'] },
];
const PICKED = 2;

/** The emoji mood picker: one mood per night, and it tints your screen. */
export function EmojiMoods() {
  const [from, to] = MOODS[PICKED].colors;
  return (
    <div
      aria-hidden
      className='relative flex h-44 items-center justify-center gap-3 px-4 sm:gap-4'
      style={{
        background: `linear-gradient(160deg, ${from}cc, ${to}99 55%, #0b0b0b)`,
      }}
    >
      {MOODS.map((mood, i) => (
        <span
          key={mood.emoji}
          className={`flex items-center justify-center rounded-full text-2xl shadow-lg ${
            i === PICKED ? 'h-16 w-16 ring-2 ring-white ring-offset-2 ring-offset-black/40' : 'h-12 w-12 opacity-80'
          }`}
          style={{ background: `linear-gradient(135deg, ${mood.colors[0]}, ${mood.colors[1]})` }}
        >
          {mood.emoji}
        </span>
      ))}
      <span className='absolute bottom-3 left-4 text-[11px] font-semibold uppercase tracking-widest text-white/80'>
        Tonight&apos;s mood
      </span>
    </div>
  );
}

/** The venue counters from the app's home screen: counted is anonymous, joined is opt-in. */
export function JoinCounts() {
  const tile =
    'flex h-16 w-16 flex-col items-center justify-center rounded-2xl text-white sm:h-[4.5rem] sm:w-[4.5rem]';
  return (
    <div aria-hidden className='relative flex h-44 items-center justify-center gap-2.5 bg-[#0b0b0b] px-4 sm:gap-3'>
      <span className={`${tile} bg-zinc-800`}>
        <b className='text-xl leading-none'>150</b>
        <small className='mt-1 text-[9px] font-bold tracking-wider'>TOTAL</small>
      </span>
      <span className={`${tile} bg-zinc-800`}>
        <b className='text-xl leading-none'>20</b>
        <small className='mt-1 text-[9px] font-bold tracking-wider'>JOINED</small>
      </span>
      <span className={`${tile} bg-[#ff7000]`}>
        <b className='text-xl leading-none'>6</b>
        <small className='mt-1 text-[9px] font-bold tracking-wider'>FRIENDS</small>
      </span>
      <span className={`${tile} bg-[#00e5c4] text-black`}>
        <b className='text-sm font-black tracking-wide'>JOIN</b>
      </span>
      <span className='absolute bottom-3 left-4 text-[11px] font-semibold uppercase tracking-widest text-white/60'>
        You decide when you&apos;re seen
      </span>
    </div>
  );
}

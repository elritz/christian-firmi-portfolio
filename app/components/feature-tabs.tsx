'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';

export type Feature = {
  title: string;
  blurb: string;
  /** A looping screen recording (MP4). Takes precedence over `image`. */
  video?: string;
  /** Optional WebM copy, for browsers without H.264. */
  webm?: string;
  poster?: string;
  image?: string;
  alt?: string;
};

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900';

/**
 * App features behind a tab bar, styled like the My Work tabs: each tab shows
 * a title, a short blurb, and a phone-sized recording or screenshot.
 */
export function FeatureTabs({ features }: { features: Feature[] }) {
  const [active, setActive] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next =
      (index + (e.key === 'ArrowRight' ? 1 : -1) + features.length) % features.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const feature = features[active];

  return (
    <div className='not-prose my-12'>
      <div className='flex justify-center'>
        <div
          role='tablist'
          aria-label='App features'
          className='flex max-w-full gap-1 overflow-x-auto rounded-full border border-zinc-200/80 bg-white/70 p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_-10px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50 dark:shadow-none'
        >
          {features.map((f, i) => {
            const selected = i === active;
            return (
              <button
                key={f.title}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role='tab'
                id={`${id}-tab-${i}`}
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-2 font-display text-sm sm:px-5 sm:text-base duration-200 ${focusRing} ${
                  selected
                    ? 'bg-orange-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(124,45,18,0.3)]'
                    : 'text-zinc-600 hover:bg-white/50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                {f.title}
              </button>
            );
          })}
        </div>
      </div>

      <div
        role='tabpanel'
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        className='mt-8'
      >
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='grid items-center gap-8 sm:grid-cols-2'
          >
            <div className='text-center sm:text-left'>
              <h3 className='font-display text-2xl text-zinc-900 dark:text-zinc-100'>
                {feature.title}
              </h3>
              <p className='mt-3 leading-7 text-zinc-600 dark:text-zinc-400'>
                {feature.blurb}
              </p>
            </div>
            <div className='mx-auto w-full max-w-[260px] overflow-hidden rounded-[22px] bg-zinc-900 shadow-[0_12px_24px_rgba(0,0,0,0.18)]'>
              {feature.video ? (
                <video
                  key={feature.video}
                  poster={feature.poster}
                  aria-label={feature.alt ?? feature.title}
                  className='block h-auto w-full'
                  muted
                  loop
                  playsInline
                  autoPlay={!reduceMotion}
                  controls={reduceMotion}
                  preload='metadata'
                >
                  <source src={feature.video} type='video/mp4' />
                  {feature.webm && <source src={feature.webm} type='video/webm' />}
                </video>
              ) : feature.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={feature.image}
                  alt={feature.alt ?? feature.title}
                  className='block h-auto w-full'
                />
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

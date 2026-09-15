'use client';

import { useEffect, useRef, useState } from 'react';
import { PostCard, type PostSummary } from './post-card';

type Section = { type: string; title?: string };
type Tab = { id: string; label: string; short?: string; sections: Section[] };

const TABS: Tab[] = [
  {
    id: 'professional',
    label: 'Professional',
    sections: [{ type: 'professional' }, { type: 'blog', title: 'Philosophy' }],
  },
  {
    id: 'products',
    label: 'My Products',
    sections: [{ type: 'projects' }],
  },
  {
    id: 'hobbies',
    label: 'Hobbies and Interests',
    short: 'Hobbies',
    sections: [{ type: 'hobbies & interests' }, { type: 'travel', title: 'Travel' }],
  },
];
const DEFAULT_TAB = 'products';

function byDateDesc(a: PostSummary, b: PostSummary) {
  return new Date(a.metadata.date) > new Date(b.metadata.date) ? -1 : 1;
}

export function WorkTabs({ posts }: { posts: PostSummary[] }) {
  const [active, setActive] = useState(DEFAULT_TAB);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Restore the tab from the URL hash so "back" from a post lands where you left.
  useEffect(() => {
    const fromHash = window.location.hash.replace('#', '');
    if (TABS.some((t) => t.id === fromHash)) setActive(fromHash);
  }, []);

  const select = (id: string) => {
    setActive(id);
    window.history.replaceState(null, '', id === DEFAULT_TAB ? ' ' : `#${id}`);
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next =
      (index + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
    select(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  const byType = posts.reduce<Record<string, PostSummary[]>>((acc, post) => {
    const type = post.metadata.type ?? 'projects';
    (acc[type] ||= []).push(post);
    return acc;
  }, {});
  const known = new Set(TABS.flatMap((t) => t.sections.map((s) => s.type)));
  const extra: Section[] = Object.keys(byType)
    .filter((t) => !known.has(t))
    .map((t) => ({ type: t, title: t }));

  return (
    <div>
      <div className='flex justify-center'>
        <div
          role='tablist'
          aria-label='My work'
          className='flex w-full flex-nowrap justify-center gap-1 rounded-full border sm:w-auto border-white/60 bg-white/40 p-1.5 shadow-[0_12px_40px_-16px_rgba(6,30,20,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40 dark:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.8)]'
        >
          {TABS.map((tab, i) => {
            const selected = tab.id === active;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role='tab'
                id={`tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(tab.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`flex-1 whitespace-nowrap rounded-full px-3 py-2 font-display text-sm sm:flex-none sm:px-5 sm:text-base duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 ${
                  selected
                    ? 'bg-orange-500 text-white shadow-[0_6px_20px_-6px_rgba(249,115,22,0.8)]'
                    : 'text-zinc-600 hover:bg-white/50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                {tab.short ? (
                  <>
                    <span className='sm:hidden'>{tab.short}</span>
                    <span className='hidden sm:inline'>{tab.label}</span>
                  </>
                ) : (
                  tab.label
                )}
              </button>
            );
          })}
        </div>
      </div>

      {TABS.map((tab) => {
        const sections = tab.id === DEFAULT_TAB ? [...tab.sections, ...extra] : tab.sections;
        const visible = sections.filter((s) => byType[s.type]?.length);
        return (
          <div
            key={tab.id}
            role='tabpanel'
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={tab.id !== active}
            className='pt-10 space-y-14'
          >
            {visible.length === 0 && (
              <p className='text-zinc-500 dark:text-zinc-400'>Nothing here yet.</p>
            )}
            {visible.map((section) => (
              <section key={section.type}>
                {section.title && visible.length > 1 && (
                  <h2 className='mb-6 font-display text-2xl text-zinc-700 dark:text-zinc-300'>
                    {section.title}
                  </h2>
                )}
                <div className='grid grid-flow-row-dense gap-8 mx-auto grid-cols-1 sm:grid-cols-2'>
                  {[...byType[section.type]].sort(byDateDesc).map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        );
      })}
    </div>
  );
}

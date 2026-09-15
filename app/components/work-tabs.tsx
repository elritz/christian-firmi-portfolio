'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  TAG_GROUPS,
  hasTag,
  isTagGroupId,
  tagGroup,
  tagLabel,
  type TagGroupId,
} from '@/app/blog/tags';
import { DEFAULT_TAB, TABS, type Tab } from './work-tabs-config';
import { PostCard, type PostSummary } from './post-card';

/** A tag filter: a top-level group, optionally narrowed to one of its sub-tags. */
type Filter = { group: TagGroupId | null; tag: string | null };
const NO_FILTER: Filter = { group: null, tag: null };

function filterFromSlug(slug: string | undefined): Filter {
  if (!slug) return NO_FILTER;
  if (isTagGroupId(slug)) return { group: slug, tag: null };
  const group = tagGroup(slug);
  return group ? { group, tag: slug } : NO_FILTER;
}

function byDateDesc(a: PostSummary, b: PostSummary) {
  return new Date(a.metadata.date) > new Date(b.metadata.date) ? -1 : 1;
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900';
const pillOn =
  'border-zinc-900 bg-zinc-900 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_1px_2px_rgba(0,0,0,0.2)] dark:border-white dark:bg-white dark:text-zinc-900';
const pillOff =
  'border-zinc-300/80 bg-white/40 text-zinc-600 hover:border-zinc-500 hover:text-zinc-900 dark:border-white/15 dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:border-white/50 dark:hover:text-white';

export function WorkTabs({ posts }: { posts: PostSummary[] }) {
  const [active, setActive] = useState(DEFAULT_TAB);
  const [filter, setFilter] = useState<Filter>(NO_FILTER);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Restore tab and tag filter from the URL hash ("#tab/tag") so "back" from a
  // post lands where you left, and post pages can deep-link to a filtered view.
  useEffect(() => {
    const apply = () => {
      const [tab, slug] = window.location.hash.replace('#', '').split('/');
      if (TABS.some((t) => t.id === tab)) setActive(tab);
      setFilter(filterFromSlug(slug));
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  const commit = (tab: string, next: Filter) => {
    setActive(tab);
    setFilter(next);
    const slug = next.tag ?? next.group;
    const hash = slug ? `${tab}/${slug}` : tab === DEFAULT_TAB ? '' : tab;
    window.history.replaceState(null, '', hash ? `#${hash}` : ' ');
  };

  const byType = posts.reduce<Record<string, PostSummary[]>>((acc, post) => {
    const type = post.metadata.type ?? 'projects';
    (acc[type] ||= []).push(post);
    return acc;
  }, {});
  const known = new Set(TABS.flatMap((t) => t.sections.map((s) => s.type)));
  const extra = Object.keys(byType)
    .filter((t) => !known.has(t))
    .map((t) => ({ type: t, title: t }));
  const sectionsFor = (tab: Tab) =>
    tab.id === DEFAULT_TAB ? [...tab.sections, ...extra] : tab.sections;
  const postsIn = (tab: Tab) => sectionsFor(tab).flatMap((s) => byType[s.type] ?? []);

  const select = (id: string) => {
    const tab = TABS.find((t) => t.id === id)!;
    // Keep the group across tabs; keep the sub-tag only where it still matches something.
    const keepTag =
      filter.tag !== null && postsIn(tab).some((p) => hasTag(p.metadata.tags, filter.tag!));
    commit(id, keepTag ? filter : { group: filter.group, tag: null });
  };
  const toggleGroup = (group: TagGroupId) =>
    commit(active, filter.group === group ? NO_FILTER : { group, tag: null });
  const toggleTag = (tag: string) =>
    commit(active, { group: filter.group, tag: filter.tag === tag ? null : tag });

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next =
      (index + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
    select(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  const activeTab = TABS.find((t) => t.id === active) ?? TABS[0];
  const activeGroup = TAG_GROUPS.find((g) => g.id === filter.group);
  // Only offer sub-tags that hit at least one post in the open tab, so no filter is dead.
  const present = new Set(postsIn(activeTab).flatMap((p) => p.metadata.tags ?? []));
  const subTags = activeGroup
    ? Object.keys(activeGroup.tags).filter((t) => present.has(t))
    : [];
  const activeSlug = filter.tag ?? filter.group;
  const matches = (p: PostSummary) => !activeSlug || hasTag(p.metadata.tags, activeSlug);

  return (
    <div>
      <div className='flex justify-center'>
        <div
          role='tablist'
          aria-label='My work'
          className='flex w-full flex-nowrap justify-center gap-1 rounded-full border sm:w-auto border-zinc-200/80 bg-white/70 p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_-10px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50 dark:shadow-none'
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
                className={`flex-1 whitespace-nowrap rounded-full px-3 py-2 font-display text-sm sm:flex-none sm:px-5 sm:text-base duration-200 ${focusRing} ${
                  selected
                    ? 'bg-orange-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(124,45,18,0.3)]'
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

      <div className='mt-6 flex flex-col items-center'>
        <div role='group' aria-label='Filter by tag' className='flex flex-wrap justify-center gap-2'>
          {TAG_GROUPS.map((group) => {
            const on = filter.group === group.id;
            return (
              <button
                key={group.id}
                type='button'
                aria-pressed={on}
                onClick={() => toggleGroup(group.id)}
                className={`rounded-full border px-4 py-1.5 font-display text-sm duration-200 ${focusRing} ${
                  on ? pillOn : pillOff
                }`}
              >
                {group.label}
              </button>
            );
          })}
        </div>
        <AnimatePresence initial={false}>
          {activeGroup && (
            <motion.div
              key='subtags'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className='w-full overflow-hidden'
            >
              <div
                role='group'
                aria-label={`${activeGroup.label} tags`}
                className='flex flex-wrap justify-center gap-2 pt-3'
              >
                {subTags.map((tag) => {
                  const on = filter.tag === tag;
                  return (
                    <button
                      key={tag}
                      type='button'
                      aria-pressed={on}
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full border px-3 py-1 text-xs duration-200 ${focusRing} ${
                        on ? pillOn : pillOff
                      }`}
                    >
                      {tagLabel(tag)}
                    </button>
                  );
                })}
                {subTags.length === 0 && (
                  <span className='text-sm text-zinc-500 dark:text-zinc-400'>
                    Nothing {activeGroup.label.toLowerCase()} in this tab.
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {TABS.map((tab) => {
        const visible = sectionsFor(tab)
          .map((s) => ({
            ...s,
            posts: (byType[s.type] ?? []).filter(matches).sort(byDateDesc),
          }))
          .filter((s) => s.posts.length);
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
              <p className='text-zinc-500 dark:text-zinc-400'>
                {activeSlug ? `Nothing tagged ${tagLabel(activeSlug)} here.` : 'Nothing here yet.'}
              </p>
            )}
            {visible.map((section) => (
              <section key={section.type}>
                {section.title && visible.length > 1 && (
                  <h2 className='mb-6 font-display text-2xl text-zinc-700 dark:text-zinc-300'>
                    {section.title}
                  </h2>
                )}
                <div className='grid grid-flow-row-dense gap-8 mx-auto grid-cols-1 sm:grid-cols-2'>
                  {section.posts.map((post) => (
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

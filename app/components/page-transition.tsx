'use client';

import Link, { type LinkProps } from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/** How long the exit plays before the route changes. */
export const EXIT_MS = 520;

type Phase = 'idle' | 'exiting';
type Transition = { phase: Phase; navigate: (href: string) => void };

const TransitionContext = createContext<Transition>({
  phase: 'idle',
  navigate: () => {},
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

/**
 * Plays an exit (page fades to the theme's base colour, the homepage rings
 * collapse) before an internal navigation, then reveals the next page.
 */
export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('idle');
  const timer = useRef<number>();

  // The new page has mounted: lift the veil.
  useEffect(() => {
    setPhase('idle');
  }, [pathname]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const navigate = useCallback(
    (href: string) => {
      if (phase === 'exiting') return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        router.push(href);
        return;
      }
      setPhase('exiting');
      router.prefetch(href);
      timer.current = window.setTimeout(() => router.push(href), EXIT_MS);
    },
    [phase, router]
  );

  const value = useMemo(() => ({ phase, navigate }), [phase, navigate]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div
        aria-hidden='true'
        className={`pointer-events-none fixed inset-0 z-[60] bg-white transition-opacity duration-500 ease-out dark:bg-black ${
          phase === 'exiting' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: React.ReactNode;
  };

/** A next/link that plays the exit transition for plain internal clicks. */
export function TransitionLink({ href, onClick, target, ...props }: TransitionLinkProps) {
  const { navigate } = usePageTransition();
  const path = typeof href === 'string' ? href : href.pathname ?? '';

  return (
    <Link
      href={href}
      target={target}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        const modified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
        const newTab = target && target !== '_self';
        if (e.button !== 0 || modified || newTab || !path.startsWith('/')) return;
        e.preventDefault();
        navigate(path);
      }}
    />
  );
}

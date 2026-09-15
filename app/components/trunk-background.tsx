'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { EXIT_MS, usePageTransition } from './page-transition';

// Improved Perlin noise (3D), seeded so the rings look the same on every load.
const PERM = new Uint8Array(512);
(() => {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = p[i];
    p[i] = p[j];
    p[j] = t;
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
})();

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + t * (b - a);
function grad(h: number, x: number, y: number, z: number) {
  const g = h & 15;
  const u = g < 8 ? x : y;
  const v = g < 4 ? y : g === 12 || g === 14 ? x : z;
  return ((g & 1) === 0 ? u : -u) + ((g & 2) === 0 ? v : -v);
}
/** Returns noise in [0, 1]. */
function noise3(x: number, y: number, z: number) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);
  const u = fade(x);
  const v = fade(y);
  const w = fade(z);
  const A = PERM[X] + Y;
  const AA = PERM[A] + Z;
  const AB = PERM[A + 1] + Z;
  const B = PERM[X + 1] + Y;
  const BA = PERM[B] + Z;
  const BB = PERM[B + 1] + Z;
  const n = lerp(
    lerp(
      lerp(grad(PERM[AA], x, y, z), grad(PERM[BA], x - 1, y, z), u),
      lerp(grad(PERM[AB], x, y - 1, z), grad(PERM[BB], x - 1, y - 1, z), u),
      v
    ),
    lerp(
      lerp(grad(PERM[AA + 1], x, y, z - 1), grad(PERM[BA + 1], x - 1, y, z - 1), u),
      lerp(grad(PERM[AB + 1], x, y - 1, z - 1), grad(PERM[BB + 1], x - 1, y - 1, z - 1), u),
      v
    ),
    w
  );
  return n * 0.5 + 0.5;
}

// Tree-ring settings, after the Vanta "trunk" sketch by Kjetil Golid.
const CHAOS_INIT = 0.2;
const CHAOS_DELTA = 0.08;
const CHAOS_MAG = 22;
const DIM_INIT = 36;
// Rings sit tight near the heart and the spacing keeps widening toward the bark.
const RING_GAP_MIN = 7;
const RING_GAP_MAX = 34;
// Line thickness only ever thins outward, in random-sized steps.
const WIDTH_NEAR = 2.4;
const WIDTH_FAR = 0.5;
const STEPS = 360;
const TWO_PI = Math.PI * 2;
// Entrance: rings draw on and splash outward from the heart over this long.
const INTRO_MS = 1300;
const INTRO_STAGGER = 0.55; // share of the intro spent staggering ring starts
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t: number) => t * t * t;
const easeOutBack = (t: number) => {
  const c = 0.9;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};
// Pointer ripple: rings are pushed away from the pointer and relax back.
const RIPPLE_AMP = 18;
const RIPPLE_ANGLE = 0.45;
const RIPPLE_DEPTH = 120;

// Ring colour comes from the --ring-rgb CSS variable; these are the alphas.
const PALETTE = {
  dark: { inner: 0.42, outer: 0.07, band: 0.04, rim: 0.2, rimW: 1.6 },
  light: { inner: 0.36, outer: 0.06, band: 0.04, rim: 0.6, rimW: 1.8 },
};
// Where the trunk's heart sits, as a fraction of the viewport: just past the top-right corner.
const ORIGIN = { x: 1.08, y: -0.12 };
// Light comes from the top-left; the glass rim catches it there.
const LIGHT_ANGLE = -Math.PI * 0.75;

/** Growth rings: uneven spacing that widens outward, thickness that only ever thins. */
function ringLayout(reach: number, nearest: number) {
  const radii: number[] = [];
  let radius = DIM_INIT;
  for (let i = 0; radius < reach && i < 160; i++) {
    const out = Math.min(1, radius / reach);
    radii.push(radius);
    radius +=
      (RING_GAP_MIN + (RING_GAP_MAX - RING_GAP_MIN) * out) *
      (0.6 + 0.9 * noise3(i * 0.37, 9.2, 0.5));
  }
  // Random positive steps, normalised so the outermost ring lands on WIDTH_FAR.
  const steps = radii.map((_, i) => 0.35 + 1.3 * noise3(i * 0.61, 41.7, 0.5));
  const total = steps.reduce((a, b) => a + b, 0);
  const bases: number[] = [];
  const widths: number[] = [];
  let grown = 0;
  for (let i = 0; i < radii.length; i++) {
    grown += steps[i];
    // Rings that never reach the viewport are skipped.
    if (radii[i] + CHAOS_MAG + RIPPLE_AMP >= nearest) {
      bases.push(radii[i]);
      widths.push(WIDTH_NEAR - (WIDTH_NEAR - WIDTH_FAR) * (grown / total));
    }
  }
  return { bases, widths };
}

type Props = { className?: string };

export default function TrunkBackground({ className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const { phase } = usePageTransition();
  const isDark = useRef(false);
  const tintRef = useRef('28 92 66');
  const exitAt = useRef<number | null>(null);
  const redraw = useRef<() => void>(() => {});

  // Leaving the page: the rings pull back into the heart.
  useEffect(() => {
    exitAt.current = phase === 'exiting' ? performance.now() : null;
  }, [phase]);

  useEffect(() => {
    isDark.current = resolvedTheme === 'dark';
    if (containerRef.current) {
      const v = getComputedStyle(containerRef.current).getPropertyValue('--ring-rgb').trim();
      if (v) tintRef.current = v.replace(/,/g, ' ').replace(/\s+/g, ' ');
    }
    redraw.current();
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let bases: number[] = [];
    let widths: number[] = [];
    const ox = 4200;
    let oy = 1700;
    let oz = 0;
    const centre = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0, angle: 0, dist: 0, energy: 0 };
    const introStart = performance.now();
    let introDone = reduceMotion;
    let drawFrom = 0; // vertex index facing the viewport; rings sweep in from here
    const prev = new Float32Array(STEPS * 2);
    const cur = new Float32Array(STEPS * 2);
    const cos = new Float32Array(STEPS);
    const sin = new Float32Array(STEPS);
    for (let a = 0; a < STEPS; a++) {
      cos[a] = Math.cos((a / STEPS) * TWO_PI);
      sin[a] = Math.sin((a / STEPS) * TWO_PI);
    }

    const resize = () => {
      w = container.offsetWidth;
      h = container.offsetHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const hx = w * ORIGIN.x;
      const hy = h * ORIGIN.y;
      const reach = Math.hypot(Math.max(hx, w - hx), Math.max(hy, h - hy)) + CHAOS_MAG;
      const nearest = Math.hypot(Math.max(0, -hx, hx - w), Math.max(0, -hy, hy - h));
      ({ bases, widths } = ringLayout(reach, nearest));
      const toward = Math.atan2(h / 2 - hy, w / 2 - hx);
      drawFrom = ((Math.round((toward / TWO_PI) * STEPS) % STEPS) + STEPS) % STEPS;
    };

    // Traces the ring; with frac < 1 only the part around drawFrom, sweeping both ways.
    const traceRing = (pts: Float32Array, frac = 1) => {
      ctx.beginPath();
      if (frac >= 1) {
        ctx.moveTo(pts[0], pts[1]);
        for (let a = 1; a < STEPS; a++) ctx.lineTo(pts[a * 2], pts[a * 2 + 1]);
        ctx.closePath();
        return;
      }
      const half = Math.floor((STEPS * frac) / 2);
      const start = (drawFrom - half + STEPS) % STEPS;
      ctx.moveTo(pts[start * 2], pts[start * 2 + 1]);
      for (let k = 1; k <= half * 2; k++) {
        const a = (start + k) % STEPS;
        ctx.lineTo(pts[a * 2], pts[a * 2 + 1]);
      }
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.translate(w * ORIGIN.x + centre.x, h * ORIGIN.y + centre.y);
      ctx.lineJoin = 'round';
      const p = isDark.current ? PALETTE.dark : PALETTE.light;
      const tint = tintRef.current;
      // Rim light: bright on the lit side, fading to nothing on the far side.
      let rim: CanvasGradient | string = `rgba(255, 255, 255, ${p.rim * 0.5})`;
      if (typeof ctx.createConicGradient === 'function') {
        const g = ctx.createConicGradient(LIGHT_ANGLE, 0, 0);
        g.addColorStop(0, `rgba(255, 255, 255, ${p.rim})`);
        g.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        g.addColorStop(1, `rgba(255, 255, 255, ${p.rim})`);
        rim = g;
      }
      const rings = bases.length;
      const ripple = RIPPLE_AMP * pointer.energy;
      const now = performance.now();
      const intro = introDone ? 1 : Math.min(1, (now - introStart) / INTRO_MS);
      if (intro >= 1) introDone = true;
      const leave =
        exitAt.current === null
          ? 0
          : easeInCubic(Math.min(1, (now - exitAt.current) / EXIT_MS));
      let prevFull = false;
      for (let i = 0; i < rings; i++) {
        const dim = CHAOS_DELTA * i + CHAOS_INIT;
        const base = bases[i];
        const t = i / (rings - 1);
        // Gaussian falloff so the rings dissolve toward the edges.
        const falloff = Math.exp(-(t * 1.7) * (t * 1.7));
        const alpha = p.outer + (p.inner - p.outer) * falloff;
        // Entrance: each ring starts a little after the one inside it,
        // sweeps in from the screen side and splashes out to its radius.
        let sweep = 1;
        let scale = 1;
        if (!introDone) {
          const local = Math.min(1, Math.max(0, (intro - INTRO_STAGGER * t) / (1 - INTRO_STAGGER)));
          if (local <= 0) break;
          sweep = easeOutCubic(local);
          scale = 0.55 + 0.45 * easeOutBack(local);
        }
        if (leave > 0) {
          // Outer rings let go first; the intro played in reverse.
          const local = Math.min(1, Math.max(0, (leave - 0.35 * (1 - t)) / 0.65));
          sweep *= 1 - local;
          scale *= 1 - 0.45 * local;
          if (sweep <= 0.01) continue;
        }
        for (let a = 0; a < STEPS; a++) {
          const n = noise3(ox + cos[a] * dim, oy + sin[a] * dim, oz);
          let r = (base + CHAOS_MAG * n) * scale;
          if (ripple > 0.01) {
            let dA = (a / STEPS) * TWO_PI - pointer.angle;
            dA = Math.atan2(Math.sin(dA), Math.cos(dA));
            const dR = r - pointer.dist;
            r +=
              ripple *
              Math.exp(-(dA * dA) / (2 * RIPPLE_ANGLE * RIPPLE_ANGLE)) *
              Math.exp(-(dR * dR) / (2 * RIPPLE_DEPTH * RIPPLE_DEPTH)) *
              (dR < 0 ? -1 : 1);
          }
          cur[a * 2] = r * cos[a];
          cur[a * 2 + 1] = r * sin[a];
        }
        // Glass panes between rings: alternating translucent fills.
        if (i > 0 && sweep >= 1 && prevFull) {
          traceRing(cur);
          ctx.moveTo(prev[0], prev[1]);
          for (let a = STEPS - 1; a > 0; a--) ctx.lineTo(prev[a * 2], prev[a * 2 + 1]);
          ctx.closePath();
          const pane = p.band * falloff * (i % 2 ? 1 : 0.35);
          ctx.fillStyle = `rgb(${tint} / ${pane.toFixed(3)})`;
          ctx.fill('evenodd');
        }
        // The ring edge: a soft lit rim under a thin tinted line.
        traceRing(cur, sweep);
        ctx.globalAlpha = (0.25 + 0.75 * falloff) * sweep;
        ctx.lineWidth = widths[i] + p.rimW;
        ctx.strokeStyle = rim;
        ctx.stroke();
        ctx.globalAlpha = sweep;
        ctx.lineWidth = widths[i];
        ctx.strokeStyle = `rgb(${tint} / ${alpha.toFixed(3)})`;
        ctx.stroke();
        ctx.globalAlpha = 1;
        prev.set(cur);
        prevFull = sweep >= 1;
      }
    };
    redraw.current = draw;

    let frame = 0;
    let raf = 0;
    const tick = () => {
      raf = window.requestAnimationFrame(tick);
      frame++;
      if (introDone && exitAt.current === null && frame % 2) return; // 30fps for the drift
      oy -= 0.012;
      oz += 0.0012;
      centre.x += (target.x - centre.x) * 0.04;
      centre.y += (target.y - centre.y) * 0.04;
      pointer.energy *= 0.94;
      draw();
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - w * ORIGIN.x;
      const y = e.clientY - rect.top - h * ORIGIN.y;
      const speed = Math.hypot(x - pointer.x, y - pointer.y);
      pointer.x = x;
      pointer.y = y;
      pointer.angle = Math.atan2(y - centre.y, x - centre.x);
      pointer.dist = Math.hypot(x - centre.x, y - centre.y);
      pointer.energy = Math.min(1, pointer.energy + speed / 260);
      target.x = x * 0.03;
      target.y = y * 0.03;
    };
    const onVisibility = () => {
      if (reduceMotion) return;
      if (document.hidden) window.cancelAnimationFrame(raf);
      else raf = window.requestAnimationFrame(tick);
    };

    resize();
    draw();
    if (!reduceMotion) {
      raf = window.requestAnimationFrame(tick);
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('visibilitychange', onVisibility);
    }
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(container);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
      ro.disconnect();
      redraw.current = () => {};
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${className} [--ring-rgb:28_92_66] dark:[--ring-rgb:30_104_70] dark:[--beam-a:rgba(6,32,20,0.5)] dark:[--beam-b:rgba(12,58,38,0.65)]`}
      aria-hidden='true'
    >
      <div className='absolute inset-0 overflow-hidden'>
        <div className='trunk-beam trunk-beam-a' />
        <div className='trunk-beam trunk-beam-b' />
      </div>
      <canvas ref={canvasRef} className='absolute inset-0 [filter:blur(0.5px)]' />
    </div>
  );
}

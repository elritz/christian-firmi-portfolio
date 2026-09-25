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
        className='h-auto w-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]'
      />
      <figcaption className='mt-2 text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400'>
        {caption}
      </figcaption>
    </figure>
  );
}

/**
 * A two-up grid of photos, wider than the text column on large screens.
 * `crop` trims every photo to the same 4:3 tile; without it each keeps its
 * own shape. Every photo opens full size in a new tab.
 */
export function Photos({
  crop = false,
  children,
}: {
  crop?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      data-crop={crop || undefined}
      className='group/photos not-prose my-10 grid grid-cols-1 items-start gap-x-4 gap-y-6 sm:grid-cols-2 lg:-mx-24'
    >
      {children}
    </div>
  );
}

export function Photo({ src, caption }: { src: string; caption: string }) {
  return (
    <figure className='m-0'>
      <a
        href={src}
        target='_blank'
        rel='noopener noreferrer'
        className='block overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800'
      >
        <Image
          src={src}
          alt={caption}
          width={1200}
          height={900}
          sizes='(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw'
          className='h-auto w-full duration-300 hover:scale-[1.02] group-data-[crop]/photos:aspect-[4/3] group-data-[crop]/photos:object-cover'
        />
      </a>
      <figcaption className='mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
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

/** One-line blurb under a section heading: bigger, lighter, sets up what follows. */
export function Lede({ children }: { children: React.ReactNode }) {
  return (
    <div className='not-prose -mt-1 mb-8 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400 sm:text-xl sm:leading-9 [&_a]:underline [&_a]:decoration-zinc-400 [&_a]:underline-offset-2'>
      {children}
    </div>
  );
}

/** A row of big numbers with labels, for the facts that should be read at a glance. */
export function Stats({ children }: { children: React.ReactNode }) {
  return (
    <dl className='not-prose my-10 grid grid-cols-2 gap-4 sm:grid-cols-3'>{children}</dl>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className='rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900'>
      <dd className='font-display text-3xl text-zinc-900 dark:text-zinc-100 sm:text-4xl'>{value}</dd>
      <dt className='mt-2 text-sm leading-5 text-zinc-600 dark:text-zinc-400'>{label}</dt>
    </div>
  );
}

/** A venue's ride card: pickup at you, drop-off already set to the venue. */
export function RideConnector() {
  return (
    <div aria-hidden className='relative h-44 overflow-hidden bg-[#0b0b0b]'>
      <svg viewBox='0 0 400 176' preserveAspectRatio='xMidYMid slice' className='absolute inset-0 h-full w-full'>
        <g stroke='#ffffff' strokeOpacity='0.08' strokeWidth='6' fill='none'>
          <path d='M0 40H400M0 112H400M0 160H400M70 0V176M190 0V176M300 0V176' />
          <path d='M0 150L400 10' strokeWidth='10' strokeOpacity='0.05' />
        </g>
        <path
          d='M86 132 C 120 132, 130 112, 190 112 S 262 84, 300 76'
          fill='none'
          stroke='#ff7000'
          strokeWidth='3'
          strokeDasharray='2 7'
          strokeLinecap='round'
        />
        <circle cx='86' cy='132' r='12' fill='#3b82f6' fillOpacity='0.25' />
        <circle cx='86' cy='132' r='5.5' fill='#3b82f6' stroke='#fff' strokeWidth='2' />
        <path d='M300 76c0-11-18-16-18-28a18 18 0 0 1 36 0c0 12-18 17-18 28z' fill='#ff7000' />
        <circle cx='300' cy='48' r='6' fill='#0b0b0b' />
      </svg>
      <span className='absolute bottom-3 left-4 text-[11px] font-semibold uppercase tracking-widest text-white/60'>
        Drop-off: the venue
      </span>
      <span className='absolute bottom-3 right-4 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-black'>
        Ride there
      </span>
    </div>
  );
}

/** A group chat with a threaded reply and a request riding along in it. */
export function MessageThread() {
  return (
    <div
      aria-hidden
      className='relative flex h-44 flex-col justify-center gap-2 px-5'
      style={{ background: 'linear-gradient(170deg, #d94f00, #b3260c 70%, #3a0d05)' }}
    >
      <span className='max-w-[70%] self-start rounded-2xl rounded-bl-md bg-[#3b82f6] px-3 py-1.5 text-xs text-white'>
        We just got here. Who else is in?
      </span>
      <span className='max-w-[70%] self-end rounded-2xl rounded-br-md bg-zinc-900/90 px-3 py-1.5 text-xs text-white'>
        Meet by the back bar
      </span>
      <span className='flex items-center gap-2 self-start rounded-full bg-black/35 py-1 pl-3 pr-1 text-xs text-white'>
        💃 Asked you to dance
        <b className='rounded-full bg-white px-2.5 py-0.5 text-[11px] text-black'>Accept</b>
      </span>
    </div>
  );
}

// ---- Scoreboard highlight visuals. Colours follow the app: brand teal and the referee call palette.

const SB_TEAL = '#0e5f59';

/** The Scoreboard mark: three slanted panels. */
function ScoreboardMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox='0 0 24 24' className={className} aria-hidden>
      <rect width='24' height='24' rx='5.5' fill={SB_TEAL} />
      <path d='M4.6 8h3.3l-1.6 8H3zM9.1 8h7.2l-1.6 8H7.5zM17.4 8h3.3l-1.6 8h-3.3z' fill='#fdfdf8' />
    </svg>
  );
}

const CALLS = [
  { label: 'Let', color: '#f59e0b' },
  { label: 'Stroke', color: '#a855f7' },
  { label: 'No Let', color: '#3b82f6' },
  { label: 'Fault', color: '#ef4444' },
  { label: 'Appeal', color: '#14b8a6' },
  { label: 'Out', color: '#f87171' },
];

/** The referee's one-tap calls, as they appear in the app. */
export function ScoreCalls() {
  return (
    <div aria-hidden className='relative flex h-44 flex-col justify-center gap-2 bg-[#140f12] px-5 pb-6'>
      <div className='grid grid-cols-3 gap-2'>
        {CALLS.map((c) => (
          <span
            key={c.label}
            className='rounded-lg border py-1.5 text-center text-xs font-semibold'
            style={{ borderColor: c.color, color: c.color, background: `${c.color}14` }}
          >
            {c.label}
          </span>
        ))}
      </div>
      <div className='grid grid-cols-2 gap-2'>
        <span className='rounded-lg border border-dashed border-white/40 py-1 text-center text-xs text-white'>↶ Undo</span>
        <span className='rounded-lg border border-dashed border-white/15 py-1 text-center text-xs text-white/50'>Redo ↷</span>
      </div>
    </div>
  );
}

/** A YouTube broadcast with the live score painted on it. */
export function LiveBroadcast() {
  return (
    <div
      aria-hidden
      className='relative h-44 overflow-hidden'
      style={{ background: 'radial-gradient(120% 90% at 50% 110%, #1f6f5f 0%, #10302b 45%, #0a0f0e 80%)' }}
    >
      <svg viewBox='0 0 400 176' preserveAspectRatio='xMidYMid slice' className='absolute inset-0 h-full w-full'>
        <g stroke='#ffffff' strokeOpacity='0.18' strokeWidth='2' fill='none'>
          <path d='M40 176L120 70H280L360 176' />
          <path d='M200 70V176M92 118H308' />
        </g>
      </svg>
      <span className='absolute left-4 top-3 flex items-center gap-1.5 rounded bg-[#ff0033] px-2 py-0.5 text-[11px] font-bold text-white'>
        <span className='h-1.5 w-1.5 rounded-full bg-white' /> LIVE
      </span>
      <span className='absolute bottom-3 left-4 flex items-center overflow-hidden rounded-md text-xs font-bold text-white shadow-lg'>
        <span className='flex items-center gap-1.5 bg-black/80 px-2.5 py-1'>
          <span className='h-2 w-2 rounded-full bg-[#3b82f6]' /> A <b className='ml-1 font-mono text-sm'>7</b>
        </span>
        <span className='flex items-center gap-1.5 bg-black/65 px-2.5 py-1'>
          <b className='font-mono text-sm'>13</b> B <span className='h-2 w-2 rounded-full bg-[#22c55e]' />
        </span>
        <span className='px-2.5 py-1' style={{ background: SB_TEAL }}>
          Game 4
        </span>
      </span>
    </div>
  );
}

/** Joining a match as a spectator: six characters, or scan the QR. */
export function JoinCode() {
  // A decorative QR-like grid, not a scannable code.
  const cells = '1110111100100110101111011010011101001110111111010'.split('');
  return (
    <div aria-hidden className='relative flex h-44 items-center justify-center px-4 pb-4' style={{ background: SB_TEAL }}>
      <div className='flex gap-1.5'>
        {'K7Q2XM'.split('').map((ch, i) => (
          <span
            key={i}
            className='flex h-10 w-7 items-center justify-center rounded-md bg-white/95 font-mono text-base font-bold text-[#0e3b37] shadow'
          >
            {ch}
          </span>
        ))}
      </div>
      <span className='absolute right-4 top-3 grid grid-cols-7 gap-px rounded-md bg-white p-1'>
        {cells.map((c, i) => (
          <span key={i} className={`h-1 w-1 ${c === '1' ? 'bg-[#0e3b37]' : 'bg-white'}`} />
        ))}
      </span>
      <span className='absolute bottom-3 left-4 text-[11px] font-semibold uppercase tracking-widest text-white/75'>
        No account, no download
      </span>
    </div>
  );
}

/** The push a club's members get when a match goes live. */
export function ClubAlert() {
  return (
    <div
      aria-hidden
      className='relative flex h-44 items-center justify-center px-5'
      style={{ background: 'linear-gradient(160deg, #1b2a28, #0b0f0e)' }}
    >
      <div className='w-full max-w-[18rem] rounded-2xl bg-white/90 p-3 shadow-xl backdrop-blur'>
        <div className='flex items-center gap-2 text-[11px] text-zinc-500'>
          <ScoreboardMark className='h-5 w-5' />
          <span className='font-semibold uppercase tracking-wide'>Scoreboard</span>
          <span className='ml-auto'>now</span>
        </div>
        <p className='mt-1.5 text-sm font-semibold text-zinc-900'>Your club is live</p>
        <p className='text-xs text-zinc-600'>Squash: A vs B just started. Tap to watch.</p>
      </div>
    </div>
  );
}

// ---- Wynshop highlight visuals. Generic banner colours; no retailer marks.

const BANNERS = ['#e11d48', '#16a34a', '#2563eb', '#ea580c', '#7c3aed'];

/** One app, many retailer banners: the same skeleton in each banner's colour. */
export function MultiBanner() {
  return (
    <div aria-hidden className='relative flex h-44 items-end justify-center gap-1.5 overflow-hidden bg-[#f4f1ec] px-4 dark:bg-[#1c1a17]'>
      {BANNERS.map((c, i) => (
        <div
          key={c}
          className='min-w-0 max-w-[4rem] flex-1 overflow-hidden rounded-t-xl border border-b-0 border-black/10 bg-white shadow-md dark:border-white/10 dark:bg-zinc-800'
          style={{ height: `${120 - Math.abs(i - 2) * 14}px` }}
        >
          <div className='h-5' style={{ background: c }} />
          <div className='space-y-1.5 p-1.5'>
            <div className='h-5 rounded bg-zinc-200 dark:bg-zinc-700' />
            <div className='grid grid-cols-2 gap-1'>
              <div className='h-5 rounded bg-zinc-100 dark:bg-zinc-700/60' />
              <div className='h-5 rounded bg-zinc-100 dark:bg-zinc-700/60' />
            </div>
            <div className='h-1.5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700' />
          </div>
        </div>
      ))}
      <span className='absolute left-4 top-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400'>
        One codebase, 20+ banners
      </span>
    </div>
  );
}

/** A product list rendering fast, with the libraries behind it. */
export function FastList() {
  return (
    <div aria-hidden className='relative flex h-44 items-center gap-4 overflow-hidden bg-[#101418] px-5'>
      <div className='flex-1 space-y-2'>
        {[0, 1, 2].map((i) => (
          <div key={i} className='flex items-center gap-2.5 rounded-lg bg-white/[0.06] p-1.5' style={{ opacity: 1 - i * 0.22 }}>
            <div className='h-7 w-7 rounded-md' style={{ background: BANNERS[i] }} />
            <div className='flex-1 space-y-1'>
              <div className='h-1.5 w-3/4 rounded bg-white/50' />
              <div className='h-1.5 w-1/3 rounded bg-white/25' />
            </div>
            <div className='h-4 w-8 rounded-full bg-white/15' />
          </div>
        ))}
      </div>
      <div className='flex flex-col gap-2'>
        <span className='rounded-full border border-emerald-400/60 px-2.5 py-1 text-[11px] font-semibold text-emerald-300'>FlashList</span>
        <span className='rounded-full border border-sky-400/60 px-2.5 py-1 text-[11px] font-semibold text-sky-300'>MMKV</span>
      </div>
    </div>
  );
}

/** Before and after for the runtime and libraries. */
export function Upgrades() {
  const rows: [string | null, string][] = [
    ['Bridge', 'Bridgeless'],
    ['React Query v3', 'v5'],
    [null, 'Redux'],
  ];
  return (
    <div aria-hidden className='relative flex h-44 flex-col justify-center gap-2.5 bg-[#0f1720] px-5'>
      {rows.map(([from, to]) => (
        <div key={to} className='flex items-center gap-2 text-xs'>
          {from ? (
            <>
              <span className='rounded-md bg-white/10 px-2 py-1 text-white/60'>{from}</span>
              <span className='text-white/40'>→</span>
            </>
          ) : (
            <span className='text-white/40'>+ added</span>
          )}
          <span className='rounded-md bg-[#61dafb]/15 px-2 py-1 font-semibold text-[#61dafb]'>{to}</span>
        </div>
      ))}
    </div>
  );
}

/** CI build time before and after the move to a Mac Mini. */
export function BuildTime() {
  return (
    <div aria-hidden className='relative flex h-44 flex-col justify-center gap-3 bg-[#111111] px-5'>
      {[
        { label: 'Before', mins: 45, color: 'bg-zinc-600' },
        { label: 'Mac Mini', mins: 15, color: 'bg-emerald-400' },
      ].map((b) => (
        <div key={b.label}>
          <div className='mb-1 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-white/60'>
            <span>{b.label}</span>
            <span className='font-mono text-white'>{b.mins} min</span>
          </div>
          <div className='h-3 rounded-full bg-white/10'>
            <div className={`h-3 rounded-full ${b.color}`} style={{ width: `${(b.mins / 45) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Planitar (iGUIDE) highlight visuals. Colours follow the survey map and the LiDAR art.

const IG_ORANGE = '#f5a524';
const IG_BLUE = '#2f80ed';

/** LiDAR points sweeping a room while the floor plan forms. */
export function LidarSweep() {
  // Deterministic scatter so server and client render the same points.
  const pts = Array.from({ length: 70 }, (_, i) => {
    const t = (i * 0.618034) % 1;
    const a = -0.62 + t * 0.5;
    const r = 45 + ((i * 37) % 140);
    return [72 + Math.cos(a) * r, 150 + Math.sin(a) * r];
  });
  return (
    <div aria-hidden className='relative h-44 overflow-hidden bg-[#0b1117]'>
      <svg viewBox='0 0 400 176' preserveAspectRatio='xMidYMid slice' className='absolute inset-0 h-full w-full'>
        <defs>
          <linearGradient id='beam' x1='0' y1='1' x2='1' y2='0'>
            <stop offset='0' stopColor='#38bdf8' stopOpacity='0.35' />
            <stop offset='1' stopColor='#38bdf8' stopOpacity='0' />
          </linearGradient>
        </defs>
        <path d='M72 150 L 240 34 L 240 124 Z' fill='url(#beam)' />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 1.6 : 1} fill='#7dd3fc' fillOpacity={0.4 + (i % 4) * 0.15} />
        ))}
        <rect x='58' y='130' width='28' height='44' rx='6' transform='rotate(-20 72 152)' fill='#111827' stroke='#475569' />
        <circle cx='78' cy='136' r='3' fill='#38bdf8' />
        <g fill='none' stroke={IG_ORANGE} strokeWidth='3' strokeLinejoin='round'>
          <path d='M252 38 H 330 V 122 H 298 V 100 H 252 Z' />
          <path d='M330 58 H 346 V 92 H 330' strokeDasharray='5 5' />
        </g>
      </svg>
      <span className='absolute bottom-3 right-4 text-[11px] font-semibold uppercase tracking-widest text-white/60'>
        Floor plan forming
      </span>
    </div>
  );
}

/** The survey map: numbered scan markers and the cone of perception on the active scan. */
export function ScanMap() {
  const marker = (x: number, y: number, n: number, active = false) => (
    <g key={n}>
      <circle cx={x} cy={y} r='11' fill={active ? IG_BLUE : '#d4d4d8'} stroke={active ? '#bfdbfe' : 'none'} strokeWidth='2' />
      <text x={x} y={y + 4} textAnchor='middle' fontSize='11' fontWeight='700' fill={active ? '#fff' : '#27272a'}>
        {n}
      </text>
    </g>
  );
  return (
    <div aria-hidden className='relative h-44 overflow-hidden bg-[#0a0a0a]'>
      <svg viewBox='0 0 400 176' preserveAspectRatio='xMidYMid slice' className='absolute inset-0 h-full w-full'>
        <g transform='rotate(-24 200 88)'>
          <path d='M92 40 H 300 V 150 H 92 Z M200 40 V 104' fill='#1c1c1f' stroke='#f4f4f5' strokeWidth='7' strokeLinejoin='round' />
          <path d='M92 40 H 300 V 150 H 92 Z' fill='none' stroke={IG_ORANGE} strokeWidth='2' strokeDasharray='16 22' transform='translate(-5 -5)' />
        </g>
        <path d='M150 120 L 118 176 L 196 176 Z' fill={IG_BLUE} fillOpacity='0.45' />
        {marker(230, 70, 1)}
        {marker(250, 128, 2)}
        {marker(150, 120, 3, true)}
        <g transform='translate(300 58)'>
          <circle r='11' fill={IG_BLUE} stroke='#fff' strokeWidth='2' />
          <path d='M-4 -4 L 3 -4 L 5 -1 L -1 5 L -5 1 Z' fill='#fff' />
        </g>
      </svg>
      <span className='absolute left-4 top-3 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-white/70'>
        Scan 3 of 3
      </span>
    </div>
  );
}

/** The cameras the app drives, and the one it runs on. */
export function CameraRig() {
  const cams = [
    { name: 'PLANIX R1', lenses: 1 },
    { name: 'PLANIX Pro', lenses: 2 },
    { name: 'THETA plugin', lenses: 2 },
  ];
  return (
    <div aria-hidden className='relative flex h-44 items-center justify-center gap-5 bg-gradient-to-b from-[#1a2230] to-[#0b1117] px-4'>
      {cams.map((c) => (
        <div key={c.name} className='flex flex-col items-center gap-2'>
          <div className='flex h-20 w-11 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-[#111827] shadow-lg'>
            {Array.from({ length: c.lenses }).map((_, i) => (
              <span key={i} className='h-5 w-5 rounded-full border-2 border-[#38bdf8]/70 bg-[radial-gradient(circle,#0ea5e9_0%,#020617_70%)]' />
            ))}
          </div>
          <span className='whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-white/70'>{c.name}</span>
        </div>
      ))}
    </div>
  );
}

/** Templating scripts: every new screen starts from the same parts. */
export function Scaffold() {
  const rows = ['navigation', 'component', 'icon'];
  return (
    <div aria-hidden className='relative flex h-44 flex-col justify-center gap-2 bg-[#0d1117] px-5 font-mono text-xs'>
      {rows.map((r) => (
        <div key={r} className='flex items-center gap-2'>
          <span className='text-[#f5a524]'>›</span>
          <span className='text-white/50'>scaffold</span>
          <span className='text-white'>{r}</span>
          <span className='ml-auto text-emerald-400'>✓ created</span>
        </div>
      ))}
      <span className='absolute bottom-3 left-5 font-sans text-[11px] font-semibold uppercase tracking-widest text-white/50'>
        Consistent by construction
      </span>
    </div>
  );
}

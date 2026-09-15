// Working sheet for the Ivy app icon. Deliberately schematic: outlines,
// construction lines, and open TODOs, because the mark is not decided yet.
// Strokes use currentColor so the sheet follows the page theme.

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "Didot, 'Bodoni 72', 'Bodoni MT', 'Times New Roman', Georgia, serif";
const GREEN = '#1B4A2B'; // placeholder brand green, not final

const TILE = 96;

/** Didone-style V: thick left stroke, hairline right, flat serifs. */
const SERIF_V =
  'M14 22H46V26H42L55 62L76 26H70V22H92V26H86L50 82L22 26H14Z';
/** Single-stroke script V, weight still open. */
const SCRIPT_V =
  'M24 40C22 30 34 26 38 36C42 46 36 62 32 72C30 78 36 80 42 74C54 62 64 48 72 36C76 30 72 26 68 30C66 32 68 36 72 34';

function Tile({
  x,
  y,
  ghost = false,
  children,
}: {
  x: number;
  y: number;
  ghost?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        width={TILE}
        height={TILE}
        fill='none'
        stroke='currentColor'
        strokeWidth={ghost ? 0.75 : 1.25}
        strokeDasharray={ghost ? '3 3' : undefined}
        opacity={ghost ? 0.45 : 0.9}
      />
      {/* centre cross, the way a template would show it */}
      <g stroke='currentColor' strokeWidth={0.5} opacity={0.25}>
        <line x1={TILE / 2} y1={0} x2={TILE / 2} y2={TILE} />
        <line x1={0} y1={TILE / 2} x2={TILE} y2={TILE / 2} />
      </g>
      <g transform={`scale(${TILE / 100})`} opacity={ghost ? 0.45 : 1}>
        {children}
      </g>
    </g>
  );
}

function Note({
  x,
  y,
  children,
  size = 9,
  anchor = 'start',
  opacity = 0.7,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  anchor?: 'start' | 'middle' | 'end';
  opacity?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fontFamily={MONO}
      fontSize={size}
      fill='currentColor'
      textAnchor={anchor}
      opacity={opacity}
    >
      {children}
    </text>
  );
}

function Leader({ from, to }: { from: [number, number]; to: [number, number] }) {
  return (
    <g stroke='currentColor' strokeWidth={0.6} opacity={0.5} fill='none'>
      <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} />
      <circle cx={to[0]} cy={to[1]} r={1.6} fill='currentColor' stroke='none' />
    </g>
  );
}

function Dimension({
  x1,
  x2,
  y,
  label,
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
}) {
  return (
    <g stroke='currentColor' strokeWidth={0.6} opacity={0.6}>
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} />
      <text
        x={(x1 + x2) / 2}
        y={y - 3}
        fontFamily={MONO}
        fontSize={8}
        fill='currentColor'
        stroke='none'
        textAnchor='middle'
      >
        {label}
      </text>
    </g>
  );
}

export function IvyWireframe() {
  return (
    <figure className='not-prose my-8 text-zinc-800 dark:text-zinc-200'>
      <svg
        viewBox='0 0 800 540'
        role='img'
        aria-labelledby='ivy-wireframe-title'
        className='h-auto w-full rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950'
      >
        <title id='ivy-wireframe-title'>
          Working sheet for the Ivy app icon: two icon directions and the wordmark, drawn as outlines with open notes.
        </title>
        <defs>
          <pattern id='ivy-grid' width={16} height={16} patternUnits='userSpaceOnUse'>
            <path d='M16 0H0V16' fill='none' stroke='currentColor' strokeWidth={0.5} />
          </pattern>
        </defs>

        {/* sheet */}
        <rect x={0} y={0} width={800} height={540} fill='url(#ivy-grid)' opacity={0.12} />
        <rect
          x={20}
          y={20}
          width={760}
          height={500}
          fill='none'
          stroke='currentColor'
          strokeWidth={1}
          opacity={0.5}
        />

        {/* ---------- row A: serif V ---------- */}
        <Note x={44} y={58} size={10} opacity={0.9}>
          A · serif V, inline stroke
        </Note>
        <text
          x={64}
          y={116}
          fontFamily={SERIF}
          fontSize={22}
          fill='none'
          stroke='currentColor'
          strokeWidth={0.8}
          opacity={0.8}
        >
          Ivy
        </text>
        <Tile x={140} y={70}>
          <path d={SERIF_V} fill='none' stroke='currentColor' strokeWidth={1.4} strokeLinejoin='miter' />
          {/* the inline, drawn as construction for now */}
          <line x1={32} y1={29} x2={47} y2={60} stroke='currentColor' strokeWidth={0.8} strokeDasharray='2 2' opacity={0.7} />
        </Tile>
        <Tile x={252} y={70} ghost>
          <path d={SERIF_V} fill='none' stroke='currentColor' strokeWidth={1.2} strokeLinejoin='miter' />
        </Tile>
        <Dimension x1={140} x2={236} y={180} label='1024' />
        <Leader from={[400, 92]} to={[286, 92]} />
        <Note x={404} y={95}>
          dup, same glyph — delete?
        </Note>
        <Leader from={[400, 126]} to={[182, 116]} />
        <Note x={404} y={129}>
          inline: hairline or knockout? TBD
        </Note>
        <Note x={404} y={145} opacity={0.5}>
          reads at 1024, untested at 60
        </Note>

        {/* ---------- row B: script V ---------- */}
        <Note x={44} y={222} size={10} opacity={0.9}>
          B · script V, single stroke
        </Note>
        <Tile x={44} y={234} ghost>
          <text
            x={50}
            y={62}
            fontFamily={MONO}
            fontSize={28}
            fill='currentColor'
            textAnchor='middle'
            opacity={0.6}
          >
            ?
          </text>
        </Tile>
        <Tile x={156} y={234}>
          <path
            d={SCRIPT_V}
            fill='none'
            stroke='currentColor'
            strokeWidth={1.6}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </Tile>
        <Tile x={268} y={234} ghost>
          <path
            d={SCRIPT_V}
            fill='none'
            stroke='currentColor'
            strokeWidth={1.4}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </Tile>
        <Leader from={[400, 262]} to={[196, 266]} />
        <Note x={404} y={265}>
          monoline for now, weight TBD
        </Note>
        <Leader from={[400, 300]} to={[92, 282]} />
        <Note x={404} y={303}>
          third option? slot left open
        </Note>
        <Note x={404} y={319} opacity={0.5}>
          warmer than A, maybe too casual
        </Note>

        {/* ---------- row C: wordmark ---------- */}
        <Note x={44} y={392} size={10} opacity={0.9}>
          C · wordmark
        </Note>
        <g stroke='currentColor' strokeWidth={0.5} strokeDasharray='4 3' opacity={0.4}>
          <line x1={44} y1={412} x2={360} y2={412} />
          <line x1={44} y1={444} x2={360} y2={444} />
          <line x1={44} y1={472} x2={360} y2={472} />
        </g>
        <Note x={364} y={415} size={8} opacity={0.5}>
          cap
        </Note>
        <Note x={364} y={447} size={8} opacity={0.5}>
          x
        </Note>
        <Note x={364} y={475} size={8} opacity={0.5}>
          base
        </Note>
        <text
          x={56}
          y={472}
          fontFamily={SERIF}
          fontSize={80}
          fill='none'
          stroke='currentColor'
          strokeWidth={1}
          opacity={0.85}
        >
          Ivy
        </text>
        <Note x={404} y={404}>
          serif from A, or B&apos;s hand?
        </Note>
        <Note x={404} y={420} opacity={0.5}>
          has to work at nav size
        </Note>

        {/* ---------- notes column ---------- */}
        <g transform='translate(612 60)'>
          <Note x={0} y={0} size={10} opacity={0.9}>
            TODO
          </Note>
          {[
            'pick A or B',
            'colour: placeholder',
            'test at 60 / 29 px',
            'dark-mode variant',
            'wordmark lockup',
          ].map((item, i) => (
            <g key={item} transform={`translate(0 ${18 + i * 18})`}>
              <rect x={0} y={-8} width={8} height={8} fill='none' stroke='currentColor' strokeWidth={0.8} opacity={0.6} />
              <Note x={14} y={0}>
                {item}
              </Note>
            </g>
          ))}
          {/* colour swatch */}
          <rect x={0} y={118} width={20} height={20} fill={GREEN} opacity={0.9} />
          <Note x={28} y={126} size={8}>
            {GREEN}
          </Note>
          <Note x={28} y={137} size={8} opacity={0.5}>
            placeholder, not chosen
          </Note>
        </g>

        {/* ---------- WIP stamp ---------- */}
        <g transform='translate(640 250) rotate(-8)' opacity={0.9}>
          <rect
            x={-62}
            y={-24}
            width={124}
            height={48}
            rx={4}
            fill='none'
            stroke={GREEN}
            strokeWidth={2}
            strokeDasharray='6 3'
          />
          <text
            x={0}
            y={-2}
            fontFamily={MONO}
            fontSize={20}
            fontWeight={700}
            fill={GREEN}
            textAnchor='middle'
          >
            WIP
          </text>
          <text x={0} y={14} fontFamily={MONO} fontSize={8} fill={GREEN} textAnchor='middle'>
            rev 0.3 · not final
          </text>
        </g>

        {/* ---------- title block ---------- */}
        <g transform='translate(560 440)'>
          <rect width={200} height={60} fill='none' stroke='currentColor' strokeWidth={1} opacity={0.6} />
          <line x1={0} y1={20} x2={200} y2={20} stroke='currentColor' strokeWidth={0.6} opacity={0.4} />
          <line x1={0} y1={40} x2={200} y2={40} stroke='currentColor' strokeWidth={0.6} opacity={0.4} />
          <line x1={120} y1={20} x2={120} y2={60} stroke='currentColor' strokeWidth={0.6} opacity={0.4} />
          <Note x={8} y={14} size={9} opacity={0.9}>
            IVY · APP ICON
          </Note>
          <Note x={8} y={34} size={8}>
            status: in progress
          </Note>
          <Note x={128} y={34} size={8}>
            rev 0.3
          </Note>
          <Note x={8} y={54} size={8}>
            scale 1 : 10.7
          </Note>
          <Note x={128} y={54} size={8}>
            sheet 01 / ?
          </Note>
        </g>
      </svg>
      <figcaption className='mt-2 text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400'>
        Icon working sheet, rev 0.3. Nothing on it is final.
      </figcaption>
    </figure>
  );
}

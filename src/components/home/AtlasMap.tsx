/**
 * AtlasMap — original hand-drawn "explorer's atlas" illustration of Bulgaria.
 * Fully custom vector artwork: silhouette, contour terrain, ridges, forests,
 * river, coast, a dotted expedition route, marked discoveries and a compass rose.
 * No third-party or copyrighted source artwork is used.
 */

// Stylized, non-literal silhouette of Bulgaria (editorial cartography).
const LAND =
  "M52 118C78 100 104 112 132 104C160 96 182 108 212 100C244 92 268 106 300 98C334 90 362 100 396 94C420 90 442 96 462 88C470 106 466 124 474 142C480 158 474 176 480 194C470 214 452 216 440 232C424 252 404 246 386 256C362 268 344 260 320 270C296 280 276 272 252 280C228 288 208 280 186 288C164 296 146 288 126 292C112 272 118 250 106 230C94 210 100 190 88 172C76 154 70 132 52 118Z";

const CONTOURS = [
  "M96 176C126 160 150 178 182 168C214 158 238 174 272 164C306 154 330 168 364 158C392 150 414 158 434 150",
  "M110 200C140 186 164 202 196 192C228 182 252 198 286 188C318 179 342 192 374 184",
  "M128 226C156 214 178 228 208 219C238 210 262 224 294 215C320 208 342 218 364 212",
  "M146 250C170 240 190 252 216 244C242 236 264 248 292 240",
];

type Point = { x: number; y: number; label: string; icon: "cliff" | "village" | "cave" | "ruin" };

const STOPS: ReadonlyArray<Point> = [
  { x: 96, y: 146, label: "NW", icon: "ruin" },
  { x: 232, y: 196, label: "C", icon: "cave" },
  { x: 300, y: 258, label: "S", icon: "village" },
  { x: 448, y: 176, label: "E", icon: "cliff" },
];

const ROUTE =
  "M96 146C132 158 150 176 186 182C206 185 216 190 232 196C254 205 262 232 288 250C296 256 300 258 300 258C340 250 358 226 388 208C408 196 428 186 448 176";

function Ridge({ x, y, s = 1, o = 0.75 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <path d="M-13 6L-4 -7L2 0L9 -10L18 6" stroke="var(--forest)" strokeWidth="1.2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M-6 6L-4 -3M6 6L9 -4" stroke="var(--forest)" strokeWidth="0.7" opacity="0.5" />
    </g>
  );
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity="0.55">
      <path d="M0 4L-3.4 -1L-1.6 -1L-4 -6L0 -10L4 -6L1.6 -1L3.4 -1Z" fill="var(--forest)" opacity="0.65" />
      <path d="M0 4v3" stroke="var(--forest)" strokeWidth="0.8" />
    </g>
  );
}

function StopIcon({ kind }: { kind: Point["icon"] }) {
  const s = { stroke: "var(--forest)", strokeWidth: 1.1, fill: "none" as const, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  switch (kind) {
    case "cliff":
      return <path d="M-7 6L-1 -4L3 1L7 -6L9 6Z" {...s} />;
    case "village":
      return <path d="M-7 6V-1L-1 -6L5 -1V6Z M-1 6V1H2v5" {...s} />;
    case "cave":
      return <path d="M-7 6a7 8 0 0 1 14 0Z M-2 6a2.6 3 0 0 1 5 0" {...s} />;
    default:
      return <path d="M-7 6V-5h3v3h3v-4h3v10Z" {...s} />;
  }
}

export function AtlasMap() {
  return (
    <svg
      viewBox="0 0 540 400"
      className="atlas-map h-auto w-full max-w-[540px]"
      fill="none"
      role="img"
      aria-label="Illustrated explorer's map of Bulgaria with a dotted journey route across four discovery points"
    >
      <defs>
        <linearGradient id="atlas-parchment" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="color-mix(in oklab, var(--stone) 24%, transparent)" />
          <stop offset="55%" stopColor="color-mix(in oklab, var(--stone) 10%, transparent)" />
          <stop offset="100%" stopColor="color-mix(in oklab, var(--accent) 8%, transparent)" />
        </linearGradient>
        <clipPath id="atlas-land">
          <path d={LAND} />
        </clipPath>
      </defs>

      {/* Parchment field + hand-drawn double frame */}
      <rect x="10" y="10" width="520" height="380" rx="3" fill="url(#atlas-parchment)" />
      <path
        d="M12 14C180 10 356 13 528 11M529 16C531 150 528 268 527 386M525 388C350 391 176 388 14 390M12 386C9 262 11 140 12 14"
        stroke="var(--forest)"
        strokeWidth="1.1"
        opacity="0.5"
        fill="none"
      />
      <path
        d="M22 24C190 20 356 23 518 21M519 26C521 152 518 260 517 376M515 378C350 381 186 378 24 380M22 376C19 258 21 146 22 24"
        stroke="var(--forest)"
        strokeWidth="0.6"
        opacity="0.3"
        fill="none"
      />

      {/* Latitude hairlines across the parchment */}
      <g stroke="var(--stone)" strokeWidth="0.6" opacity="0.5">
        {[60, 120, 180, 240, 300, 350].map((y) => (
          <path key={y} d={`M26 ${y}C160 ${y - 3} 360 ${y + 3} 514 ${y - 1}`} />
        ))}
      </g>

      {/* Landmass */}
      <path d={LAND} fill="color-mix(in oklab, var(--forest) 7%, transparent)" />
      <g clipPath="url(#atlas-land)">
        {/* terrain contours */}
        <g stroke="var(--forest)" strokeWidth="0.8" opacity="0.35" fill="none">
          {CONTOURS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        {/* river */}
        <path
          d="M40 116C90 126 130 112 176 122C222 132 258 118 304 126C350 134 392 120 470 128"
          stroke="var(--forest)"
          strokeWidth="1.5"
          opacity="0.4"
          fill="none"
        />
        {/* mountain ridges */}
        <Ridge x={150} y={182} s={1.15} />
        <Ridge x={196} y={172} s={0.9} o={0.6} />
        <Ridge x={244} y={186} s={1.05} />
        <Ridge x={300} y={178} s={0.85} o={0.6} />
        <Ridge x={206} y={252} s={1.1} />
        <Ridge x={258} y={262} s={0.9} o={0.65} />
        <Ridge x={352} y={236} s={1} />
        {/* forests */}
        {([
          [124, 210], [136, 222], [150, 214], [326, 208], [338, 218], [350, 206],
          [402, 240], [414, 250], [268, 232], [280, 224],
        ] as ReadonlyArray<readonly [number, number]>).map(([x, y], i) => (
          <Tree key={i} x={x} y={y} s={i % 3 === 0 ? 1.15 : 0.95} />
        ))}
      </g>

      {/* Coastline hatching (east) */}
      <g stroke="var(--forest)" strokeWidth="0.7" opacity="0.35">
        {[100, 118, 136, 154, 172, 190, 208].map((y, i) => (
          <path key={y} d={`M${478 + (i % 2) * 3} ${y}l9 4`} />
        ))}
      </g>

      {/* Land outline last for crispness */}
      <path d={LAND} stroke="var(--forest)" strokeWidth="1.5" strokeLinejoin="round" fill="none" />

      {/* Expedition route */}
      <path d={ROUTE} stroke="color-mix(in oklab, var(--accent) 25%, transparent)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path
        className="atlas-route"
        d={ROUTE}
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeDasharray="1.5 7"
        strokeLinecap="round"
        fill="none"
      />

      {/* Discovery markers */}
      {STOPS.map((p, i) => (
        <g key={p.label} transform={`translate(${p.x} ${p.y})`}>
          <circle className="atlas-pulse" style={{ animationDelay: `${i * 0.9}s` }} r="13" stroke="var(--accent)" strokeWidth="0.9" fill="none" />
          <circle r="7.5" fill="var(--background)" stroke="var(--accent)" strokeWidth="1.3" />
          <circle r="2.6" fill="var(--accent)" />
        </g>
      ))}

      {/* Elegant experience icons beside stops */}
      <g opacity="0.75">
        <g transform="translate(96 118)"><StopIcon kind="ruin" /></g>
        <g transform="translate(232 166)"><StopIcon kind="cave" /></g>
        <g transform="translate(300 290)"><StopIcon kind="village" /></g>
        <g transform="translate(448 146)"><StopIcon kind="cliff" /></g>
      </g>

      {/* Compass rose */}
      <g transform="translate(74 326)">
        <circle r="30" stroke="var(--forest)" strokeWidth="0.8" opacity="0.35" fill="none" />
        <circle r="23" stroke="var(--forest)" strokeWidth="0.6" opacity="0.25" fill="none" strokeDasharray="1.5 4" />
        <g stroke="var(--forest)" strokeWidth="0.7" opacity="0.45">
          <path d="M0 -30v5M0 25v5M-30 0h5M25 0h5" />
        </g>
        <g className="atlas-needle">
          <path d="M0 -22L5 0L0 22L-5 0Z" fill="color-mix(in oklab, var(--forest) 55%, transparent)" />
          <path d="M0 -22L5 0L0 4Z" fill="var(--accent)" />
        </g>
        <path d="M-22 0L0 4L22 0L0 -4Z" fill="var(--forest)" opacity="0.28" />
        <circle r="2" fill="var(--accent)" />
        <text x="0" y="-34" textAnchor="middle" fontSize="8" letterSpacing="1.4" fill="var(--forest)" opacity="0.7">
          N
        </text>
      </g>

      {/* Sun / star mark */}
      <g transform="translate(466 330)" opacity="0.55">
        <circle r="9" stroke="var(--accent)" strokeWidth="0.9" fill="none" />
        <g stroke="var(--accent)" strokeWidth="0.8" strokeLinecap="round">
          <path d="M0 -15v-4M0 15v4M-15 0h-4M15 0h4M-11 -11l-3-3M11 11l3 3M11 -11l3-3M-11 11l-3 3" />
        </g>
      </g>

      {/* Scale bar / trail marker */}
      <g transform="translate(180 348)" opacity="0.6">
        <path d="M0 0h96" stroke="var(--forest)" strokeWidth="1" />
        <path d="M0 -4v8M32 -3v6M64 -3v6M96 -4v8" stroke="var(--forest)" strokeWidth="1" />
        <text x="0" y="18" fontSize="7.5" letterSpacing="2" fill="var(--forest)" opacity="0.75">
          UNCHARTED · ROUTES
        </text>
      </g>

      {/* Coordinate cross */}
      <g stroke="var(--forest)" strokeWidth="0.8" opacity="0.3">
        <path d="M396 330v16M388 338h16" />
      </g>
    </svg>
  );
}

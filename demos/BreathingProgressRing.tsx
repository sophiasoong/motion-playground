import { useEffect, useRef, useState } from "react";

/**
 * BreathingProgressRing
 * A circular progress indicator whose fill is a sine wave riding the ring path.
 * Ported 1:1 from progress-ring-breathing.html so Figma Make can preview it live.
 *
 * Design tokens (tokens.json) used by the defaults below:
 *   size/spaceComponentGapLg   → gap (16)          edge-to-edge gap between fill head and track
 *   motion/durationSlow        → holdMs (300)      pause on the closed ring before the loop restarts
 *   motion/durationNormal      → button hover (200)
 *   size/radiusFull            → button radius
 *   color/mms/textHeadingPrimary                     → glyph color (#1e1e1e)
 *   color/mms/interactiveButtonSurfacePrimaryGhostHover → button hover surface (#f7f6ff)
 *
 * FLAGGED — no matching token in tokens.json, values come from the brief / reference video:
 *   trackColor #BAC3FF, fillColor #394379, size 500, strokeWidth 40, trackStrokeWidth 36,
 *   amplitude 14, cycleMs 8000, control glyph 120.
 */

export interface BreathingProgressRingProps {
  /** Outer box size in px. Default 500 (brief). */
  size?: number;
  /** 0–1. When provided, the ring is controlled and does not animate on its own. */
  progress?: number;
  /** Autoplay the breath loop when `progress` is not provided. Default true. */
  autoplay?: boolean;
  /** One full cycle 0 → 100%, in ms. Default 8000. */
  cycleMs?: number;
  /** Hold on the closed ring before restarting, in ms. Default 300 (motion/durationSlow). */
  holdMs?: number;
  /** Track color. Default #BAC3FF (brief). */
  trackColor?: string;
  /** Fill color. Default #394379 (brief). */
  fillColor?: string;
  /** Fill stroke width in px. Default 8% of size (40 at 500). */
  strokeWidth?: number;
  /** Track stroke width in px. Default 7.2% of size (36 at 500). */
  trackStrokeWidth?: number;
  /** Wave amplitude in px. Default 2.8% of size (14 at 500). */
  amplitude?: number;
  /** Wave cycles per full turn. Integer keeps the loop seamless. Default 12. */
  waves?: number;
  /** Edge-to-edge gap between fill head and track caps, px. Default 16 (size/spaceComponentGapLg). */
  gap?: number;
  /** Show the center pause/play control. Default true. */
  showControl?: boolean;
  /** Called on every frame with the current progress (0–1). */
  onProgress?: (progress: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

const START = -Math.PI / 2;      // 12 o'clock
const SAMPLE_DEG = 0.75;         // polyline resolution

const deg = (d: number) => (d * Math.PI) / 180;

function buildPaths(opts: {
  size: number; progress: number; strokeWidth: number; trackStrokeWidth: number;
  amplitude: number; waves: number; gap: number;
}) {
  const { size, progress, strokeWidth, trackStrokeWidth, amplitude, waves, gap } = opts;
  const cx = size / 2, cy = size / 2;
  // Base radius keeps crest + half stroke inside the box.
  const R = size / 2 - strokeWidth / 2 - amplitude;
  const gapRad = (gap + strokeWidth / 2 + trackStrokeWidth / 2) / R;
  const pt = (a: number, r: number): [number, number] => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const f = (n: number) => n.toFixed(2);

  const sweep = Math.min(Math.max(progress, 0), 1) * 2 * Math.PI;
  const full = sweep >= 2 * Math.PI - 1e-6;

  // --- fill: r(θ) = R + A·sin(k·θ) ---
  // No fade-in envelope: with an integer wave count the curve is exactly periodic
  // over one turn, so at 100% the head meets the start with the same tangent.
  let fill = "";
  if (sweep < 1e-4) {
    const [x, y] = pt(START, R);
    fill = `M ${f(x)} ${f(y)} L ${f(x + 0.01)} ${f(y)}`; // zero-length → round-capped dot
  } else {
    const steps = Math.max(2, Math.ceil(sweep / deg(SAMPLE_DEG)));
    for (let i = 0; i <= steps; i++) {
      const t = (sweep * i) / steps;
      let [x, y] = pt(START + t, R + amplitude * Math.sin(waves * t));
      if (full && i === steps) [x, y] = pt(START, R); // head lands exactly on the start
      fill += (i ? " L " : "M ") + f(x) + " " + f(y);
    }
    if (full) fill += " Z";
  }

  // --- track: plain arc from just ahead of the head to just behind the start ---
  const a0 = START + sweep + gapRad;
  const a1 = START + 2 * Math.PI - gapRad;
  let track = "";
  if (a1 - a0 > 1e-4) {
    const [x0, y0] = pt(a0, R), [x1, y1] = pt(a1, R);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    track = `M ${f(x0)} ${f(y0)} A ${R} ${R} 0 ${large} 1 ${f(x1)} ${f(y1)}`;
  }
  return { fill, track };
}

export default function BreathingProgressRing({
  size = 500,
  progress,
  autoplay = true,
  cycleMs = 8000,
  holdMs = 300,
  trackColor = "#BAC3FF",
  fillColor = "#394379",
  strokeWidth = size * 0.08,        // 40 at 500px
  trackStrokeWidth = size * 0.072,  // 36 at 500px
  amplitude = size * 0.028,         // 14 at 500px
  waves = 12,
  gap = 16,
  showControl = true,
  onProgress,
  className,
  style,
}: BreathingProgressRingProps) {
  const controlled = typeof progress === "number";
  const [internal, setInternal] = useState(0);
  const [playing, setPlaying] = useState(autoplay);
  const stateRef = useRef({ progress: 0, hold: 0, last: 0 });

  useEffect(() => {
    if (controlled || !playing) return;
    let raf = 0;
    stateRef.current.last = performance.now();
    const tick = (now: number) => {
      const s = stateRef.current;
      const dt = now - s.last;
      s.last = now;
      if (s.hold > 0) {
        s.hold -= dt;
        if (s.hold <= 0) s.progress = 0;
      } else {
        s.progress = Math.min(1, s.progress + dt / cycleMs);
        if (s.progress >= 1) s.hold = holdMs;
      }
      setInternal(s.progress);
      onProgress?.(s.progress);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [controlled, playing, cycleMs, holdMs, onProgress]);

  const p = controlled ? (progress as number) : internal;
  const { fill, track } = buildPaths({ size, progress: p, strokeWidth, trackStrokeWidth, amplitude, waves, gap });

  const glyph = size * 0.24;   // pause glyph ≈ 24% of ring diameter (reference video)
  const hit = size * 0.32;     // control hit area

  return (
    <div
      className={className}
      style={{ position: "relative", width: size, height: size, ...style }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(p * 100)}
    >
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ display: "block", overflow: "visible" }} aria-hidden="true">
        <path d={track} fill="none" stroke={trackColor} strokeWidth={trackStrokeWidth} strokeLinecap="round" />
        <path d={fill} fill="none" stroke={fillColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {showControl && !controlled && (
        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? "Pause" : "Play"}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: hit,
            height: hit,
            display: "grid",
            placeItems: "center",
            border: 0,
            borderRadius: 9999,                 // size/radiusFull
            background: "transparent",
            color: "#1e1e1e",                   // color/mms/textHeadingPrimary
            cursor: "pointer",
            transition: "background-color 200ms ease", // motion/durationNormal
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f7f6ff")} // ghost hover
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {/* Material Symbols Rounded "pause" / "play_arrow", inlined so no font dependency */}
          <svg width={glyph} height={glyph} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {playing ? (
              <>
                <rect x="6" y="5" width="4" height="14" rx="2" />
                <rect x="14" y="5" width="4" height="14" rx="2" />
              </>
            ) : (
              <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82z" />
            )}
          </svg>
        </button>
      )}
    </div>
  );
}

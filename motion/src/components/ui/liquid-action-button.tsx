'use client';

import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { LiquiGlass } from '@liqui-design/glass';

import { GLASS_MATERIAL, PRIMARY_MATERIAL } from './glass-optics';

import './liquid-action-button.css';

/**
 * LiquidActionButton — a glass icon button (plus) that liquid-splits into a
 * horizontal tray of options, after the liquid-glass reference motion.
 *
 * Anatomy
 *   goo layers  — two SVG-filtered silhouettes of both surfaces: a tinted fill
 *                 and a thin bright rim. The blur → alpha-threshold filter
 *                 fuses them into one blob while the tray travels, which is the
 *                 "liquid" part of the motion. The rim has its own opacity so
 *                 the merge stays legible even when the fill is nearly clear.
 *                 Three droplets ride in the same layers on the same clock,
 *                 stretching the neck while the pill still clings, then
 *                 snapping away with it.
 *   trigger     — a translucent LiquiGlass circle (backdrop blur + refraction
 *                 + rim) with its tint turned off, since the goo layer paints it.
 *   ripple      — a brand-tinted ring that expands from the trigger's centre
 *                 on every open/close.
 *   tray        — a LiquiGlass pill holding the options, same treatment. It
 *                 scales out of the trigger's centre on open and melts back in
 *                 on close. Only `transform` animates, so the refraction map is
 *                 never rebuilt mid-motion.
 *
 * Geometry (tokens): trigger and tray are size/componentHeightXl tall, spaced
 * by size/spaceComponentGapMd. Everything liquid (pill, goo, droplets, glyph)
 * shares one motion/durationSlow clock on a sticky ease-in curve: near-still
 * while the neck stretches, then a fast finish. Option icons pop in during the
 * last motion/durationFast of that clock; the ripple runs motion/durationSlow.
 */

export interface LiquidActionOption {
  id: string;
  /** Accessible name (and tooltip). Options render icon-only. */
  label: string;
  /** Material Symbols Rounded ligature name, e.g. "task_alt". */
  icon: string;
}

export interface LiquidActionButtonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  options: LiquidActionOption[];
  onSelect?: (id: string) => void;
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Accessible name for the trigger. */
  label?: string;
  /** Material Symbols Rounded ligature for the trigger glyph. Default "add". */
  icon?: string;
  /**
   * "primary" — brand-tinted trigger with a white glyph (default).
   * "glass"   — translucent white surfaces (opacity/20), white glyphs throughout.
   */
  tone?: 'primary' | 'glass';
}

/* Blur → threshold gives the metaball merge; erode → out lifts a rim off the
   fused outline so the neck between the surfaces reads as glass, not paint. */
const GOO_BLUR = 7;
const GOO_ALPHA_GAIN = 18;
const GOO_ALPHA_OFFSET = -8;
const GOO_RIM_WIDTH = 1.25;

/**
 * LiquiGlass optics per tone: shared material (see glass-optics.ts) plus this
 * surface's own radius (size/componentHeightXl / 2 → a full-round 48px circle).
 * Light angle for the glass tone is handled in CSS (.lab__trigger specular).
 */
const GLASS_OPTICS = {
  primary: { radius: 24, ...PRIMARY_MATERIAL },
  glass: { radius: 24, ...GLASS_MATERIAL },
} as const;

/* The silhouette shapes, rendered once per goo layer (fill + rim). Droplets
   sit under the tray shape so they vanish once swallowed. */
function GooShapes() {
  return (
    <>
      <div className="lab__goo-shape lab__goo-shape--trigger" />
      <div className="lab__droplet lab__droplet--1" />
      <div className="lab__droplet lab__droplet--2" />
      <div className="lab__droplet lab__droplet--3" />
      <div className="lab__goo-shape lab__goo-shape--tray" />
    </>
  );
}

export function LiquidActionButton({
  options,
  onSelect,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  label = 'Create',
  icon = 'add',
  tone = 'primary',
  className,
  ...rest
}: LiquidActionButtonProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const rootRef = React.useRef<HTMLDivElement>(null);
  const trayRef = React.useRef<HTMLDivElement>(null);

  // Ripple: remount the ring on every open/close so its animation restarts.
  // Compares against the previous value (not a mount flag) so StrictMode's
  // double effect run doesn't fire a ripple on mount.
  const [rippleKey, setRippleKey] = React.useState(0);
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === open) return;
    prevOpen.current = open;
    setRippleKey((k) => k + 1);
  }, [open]);
  const filterId = React.useId().replace(/:/g, '');
  const trayId = `${filterId}-tray`;

  // Mirror the tray's laid-out width onto the goo silhouette. contentRect, not
  // getBoundingClientRect: the tray is measured while scaled.
  React.useLayoutEffect(() => {
    const tray = trayRef.current;
    const root = rootRef.current;
    if (!tray || !root) return;
    const apply = (w: number) => root.style.setProperty('--lab-tray-w', `${w}px`);
    apply(tray.offsetWidth);
    const ro = new ResizeObserver(([entry]) => apply(entry.contentRect.width));
    ro.observe(tray);
    return () => ro.disconnect();
  }, []);

  // Dismiss on outside pointer or Escape.
  React.useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, setOpen]);

  return (
    <div
      {...rest}
      ref={rootRef}
      className={['lab', className].filter(Boolean).join(' ')}
      data-open={open ? 'true' : 'false'}
      data-tone={tone}
    >
      <svg className="lab__defs" aria-hidden="true" focusable="false">
        {/* Fill: the fused silhouette (tint). */}
        <filter
          id={`${filterId}-fill`}
          x="-25%"
          y="-50%"
          width="150%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation={GOO_BLUR} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${GOO_ALPHA_GAIN} ${GOO_ALPHA_OFFSET}`}
          />
        </filter>
        {/* Rim: a thin bright outline of the same fused silhouette. Kept in its
            own layer so its opacity is independent of the fill's translucency —
            this is what makes the merge legible on a near-transparent glass. */}
        <filter
          id={`${filterId}-rim`}
          x="-25%"
          y="-50%"
          width="150%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation={GOO_BLUR} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${GOO_ALPHA_GAIN} ${GOO_ALPHA_OFFSET}`}
            result="goo"
          />
          <feMorphology in="goo" operator="erode" radius={GOO_RIM_WIDTH} result="eroded" />
          <feComposite in="goo" in2="eroded" operator="out" result="rim" />
          <feFlood floodColor="#ffffff" result="rimColor" />
          <feComposite in="rimColor" in2="rim" operator="in" />
        </filter>
      </svg>

      <div
        className="lab__goo lab__goo--fill"
        aria-hidden="true"
        style={{ filter: `url(#${filterId}-fill)` }}
      >
        <GooShapes />
      </div>
      <div
        className="lab__goo lab__goo--rim"
        aria-hidden="true"
        style={{ filter: `url(#${filterId}-rim)` }}
      >
        <GooShapes />
      </div>

      {rippleKey > 0 && <span key={rippleKey} className="lab__ripple" aria-hidden="true" />}

      <BaseButton
        nativeButton={false}
        className="lab__trigger"
        aria-label={label}
        aria-expanded={open}
        aria-controls={trayId}
        onClick={() => setOpen(!open)}
        render={
          <LiquiGlass {...GLASS_OPTICS[tone]} contentClassName="lab__trigger-content" />
        }
      >
        <span className="lab__glyph lab__glyph--trigger" aria-hidden="true">
          {icon}
        </span>
      </BaseButton>

      <LiquiGlass
        ref={trayRef}
        id={trayId}
        role="group"
        aria-label={`${label} options`}
        className="lab__tray"
        {...GLASS_OPTICS[tone]}
        contentClassName="lab__tray-content"
        inert={!open}
      >
        {options.map((o, i) => (
          <BaseButton
            key={o.id}
            className="lab__option"
            aria-label={o.label}
            title={o.label}
            style={{ '--lab-i': i } as React.CSSProperties}
            onClick={() => {
              onSelect?.(o.id);
              setOpen(false);
            }}
          >
            <span className="lab__glyph lab__glyph--option" aria-hidden="true">
              {o.icon}
            </span>
          </BaseButton>
        ))}
      </LiquiGlass>
    </div>
  );
}

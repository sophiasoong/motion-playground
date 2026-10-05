'use client';

import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { LiquiGlass } from '@liqui-design/glass';

import { GLASS_MATERIAL } from './glass-optics';
import './floating-action-bar.css';

/**
 * FloatingActionBar — a bottom-docked liquid-glass pill of navigation items
 * with a glass lens that slides under the selected item, plus an optional
 * detached action slot (built for the LiquidActionButton) to its right.
 *
 * Anatomy
 *   dock   — fixed to the bottom centre of the viewport, offset by
 *            size/spaceLayoutSectionGapMd. Lays out bar + action in a row
 *            spaced by size/spaceComponentGapMd.
 *   bar    — a LiquiGlass pill (shared glass material, radius = half of
 *            size/componentHeight2xl) padded by size/spaceComponentPaddingXs.
 *            Its tint is white at opacity/20, matching the liquid button.
 *   lens   — a second, smaller LiquiGlass surface sized to the selected item.
 *            It is the selection indicator: it refracts the item beneath it and
 *            slides between items on a spring (motion/durationNormal). Position
 *            animates on transform; width tweens only when selection changes.
 *   items  — icon-over-label tabs (Material Symbols Rounded, size/componentIconMd;
 *            label size/typographyXxs). All items share the width of the
 *            widest one (equal 1fr grid columns), padded by
 *            size/spaceComponentPaddingLg on each side, never narrower than
 *            size/componentHeight2xl. The selected item switches the icon
 *            to FILL 1 and its ink to full white; the others sit at opacity/60.
 *   action — free slot rendered outside the pill so it can carry its own
 *            glass optics and morph (the LiquidActionButton's tray).
 */

export interface FloatingActionBarItem {
  id: string;
  label: string;
  /** Material Symbols Rounded ligature name, e.g. "home". */
  icon: string;
}

export interface FloatingActionBarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  items: FloatingActionBarItem[];
  /** Controlled selected item id. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  /** Detached action rendered to the right of the bar. */
  action?: React.ReactNode;
  /** Accessible name for the bar. */
  label?: string;
}

/** size/componentHeight2xl (56px) / 2 → a full-round pill for the bar. */
const BAR_RADIUS = 28;
/** size/componentHeightXl (48px) / 2 → a full-round pill for the lens. */
const LENS_RADIUS = 24;

export function FloatingActionBar({
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  action,
  label = 'Primary',
  className,
  ...rest
}: FloatingActionBarProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? items[0]?.id);
  const value = valueProp ?? uncontrolled;
  const select = (id: string) => {
    if (valueProp === undefined) setUncontrolled(id);
    onValueChange?.(id);
  };

  const index = Math.max(0, items.findIndex((it) => it.id === value));

  // Item width depends on the widest label, so the lens tracks the selected
  // item's measured box (relative to the bar content, its offsetParent). Re-measured on
  // selection, item changes, and any bar resize (e.g. font load).
  const navRef = React.useRef<HTMLElement>(null);
  const [lens, setLens] = React.useState<{ x: number; w: number } | null>(null);
  React.useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => {
      const el = nav.querySelectorAll<HTMLElement>('.fab__item')[index];
      if (el) setLens({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    const content = nav.querySelector('.fab__bar-content');
    if (!content || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(content);
    return () => ro.disconnect();
  }, [index, items]);

  return (
    <nav
      ref={navRef}
      className={['fab', className ?? ''].join(' ').trim()}
      aria-label={label}
      {...rest}
    >
      <LiquiGlass
        className="fab__bar"
        radius={BAR_RADIUS}
        {...GLASS_MATERIAL}
        contentClassName="fab__bar-content"
        role="tablist"
        aria-orientation="horizontal"
      >
        <LiquiGlass
          className="fab__lens"
          radius={LENS_RADIUS}
          {...GLASS_MATERIAL}
          aria-hidden="true"
          style={
            (lens
              ? { '--fab-lens-x': `${lens.x}px`, '--fab-lens-w': `${lens.w}px` }
              : undefined) as React.CSSProperties | undefined
          }
        />
        {items.map((it) => {
          const selected = it.id === value;
          return (
            <BaseButton
              key={it.id}
              className="fab__item"
              role="tab"
              aria-selected={selected}
              data-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(it.id)}
              onKeyDown={(e) => {
                if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
                e.preventDefault();
                const dir = e.key === 'ArrowRight' ? 1 : -1;
                const next = items[(index + dir + items.length) % items.length];
                select(next.id);
                const el = e.currentTarget.parentElement?.querySelectorAll<HTMLElement>('.fab__item')[
                  (index + dir + items.length) % items.length
                ];
                el?.focus();
              }}
            >
              <span className="fab__icon" aria-hidden="true">
                {it.icon}
              </span>
              <span className="fab__label">{it.label}</span>
            </BaseButton>
          );
        })}
      </LiquiGlass>
      {action && <div className="fab__action">{action}</div>}
    </nav>
  );
}

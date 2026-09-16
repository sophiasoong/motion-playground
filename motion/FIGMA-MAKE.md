# Breathing Progress Ring → Figma Make

## Files
- `BreathingProgressRing.tsx` — self-contained React component (no dependencies beyond React).
- `progress-ring-breathing.html` — the original standalone reference.
- `progress-ring-breathing.mp4` — rendered video, 1200×1200 @ 60fps, if you need a flat asset.

## Steps
1. Open Figma Make → **New project**.
2. Attach `BreathingProgressRing.tsx` to the first prompt (drag it in or use the attach button).
3. Paste the prompt below. Make will add the component and render it in the live preview.
4. Tweak in chat: "make the ring 320px", "use my MMS primary as the fill", "slow the cycle to 12s", etc.

## Prompt
```
Add the attached BreathingProgressRing.tsx to the project unchanged and render it on a
centered stage with background #E5E1F6. Use the defaults (500px, track #BAC3FF, fill
#394379). Do not restyle the component or alter its geometry, timing, or path math —
only wire it up. Then add a small panel with controls for size, progress (0–100, which
puts the ring in controlled mode), track color, fill color and cycle duration.
```

## Updating an existing Make project
When the component changes (latest: seamless close at 100%, no fade-in envelope), attach
the new `BreathingProgressRing.tsx` to the same project and paste:
```
Replace the project's BreathingProgressRing.tsx with the attached file, unchanged. Keep
the stage, controls and wiring as they are.
```

## Props
| Prop | Default | Notes |
|---|---|---|
| `size` | 500 | outer box, px |
| `progress` | — | 0–1; when set, the ring is controlled and stops animating |
| `autoplay` | true | |
| `cycleMs` | 8000 | 0 → 100% |
| `holdMs` | 300 | pause on the closed ring (motion/durationSlow) |
| `trackColor` | #BAC3FF | |
| `fillColor` | #394379 | |
| `strokeWidth` | 8% of size (40) | fill |
| `trackStrokeWidth` | 7.2% of size (36) | |
| `amplitude` | 2.8% of size (14) | wave amplitude, px |
| `waves` | 12 | lobes per turn; integer → the head meets the start with the same tangent at 100% |
| `gap` | 16 | fill→track gap, edge to edge (size/spaceComponentGapLg) |
| `showControl` | true | center pause/play |
| `onProgress` | — | `(p: number) => void`, every frame |

## Token notes
Colors and sizes from the brief have no match in `tokens.json` and are flagged in the
component header. Everything else (gap, hold duration, hover motion, glyph color, hover
surface, full radius) maps to existing tokens.

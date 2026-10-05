// "Back to Menu" link pinned to the top-left of every motion detail page.
// Rendered in a shadow root so each demo's own resets (button styles, fonts, overflow) can't reach it.
// Tokens mirror the gallery (index.html) so the link reads as part of the menu, not the demo.

const css = `
  :host {
    /* ---- tokens.json (same values as index.html) ---- */
    --color-mms-text-heading-primary: #1e1e1e;      /* color/mms/textHeadingPrimary — label */
    --color-mms-brand-primary: #5244ee;             /* color/mms/brandPrimary — hover border, focus ring */
    --color-mms-surface-card-surface: #ffffff;      /* color/mms/surfaceCardSurface — pill fill */
    --color-mms-surface-card-shadow: #d9d9d9;       /* color/mms/surfaceCardShadow — pill border */
    --size-space-component-padding-lg: 16px;        /* size/spaceComponentPaddingLg — offset from viewport corner */
    --size-space-component-padding-md: 12px;        /* size/spaceComponentPaddingMd — pill side padding */
    --size-space-component-gap-xs: 4px;             /* size/spaceComponentGapXs — arrow → label */
    --size-component-height-md: 36px;               /* size/componentHeightMd — pill height */
    --size-component-icon-sm: 16px;                 /* size/componentIconSm — arrow */
    --size-radius-full: 9999px;                     /* size/radiusFull — pill */
    --size-border-sm: 1px;                          /* size/borderSm — pill border */
    --size-border-md: 2px;                          /* size/borderMd — focus ring */
    --size-typography-sm-font-size: 14px;           /* size/typographySmFontSize */
    --size-typography-sm-line-height: 20px;         /* size/typographySmLineHeight */
    --font-weight-medium: 500;                      /* font/english/typographyFontWeightMedium */
    --motion-duration-fast: 100ms;                  /* motion/durationFast — arrow nudge */
    --motion-duration-normal: 200ms;                /* motion/durationNormal — hover */

    position: fixed;
    top: var(--size-space-component-padding-lg);
    left: var(--size-space-component-padding-lg);
    z-index: 2147483647;
  }
  a {
    display: inline-flex;
    align-items: center;
    gap: var(--size-space-component-gap-xs);
    height: var(--size-component-height-md);
    padding: 0 var(--size-space-component-padding-md) 0 calc(var(--size-space-component-padding-md) - 2px);
    box-sizing: border-box;
    border: var(--size-border-sm) solid var(--color-mms-surface-card-shadow);
    border-radius: var(--size-radius-full);
    background: color-mix(in srgb, var(--color-mms-surface-card-surface) 88%, transparent);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    color: var(--color-mms-text-heading-primary);
    font: var(--font-weight-medium) var(--size-typography-sm-font-size) / var(--size-typography-sm-line-height) "Roboto", system-ui, -apple-system, sans-serif;
    text-decoration: none;
    -webkit-font-smoothing: antialiased;
    transition: border-color var(--motion-duration-normal) ease-out, background-color var(--motion-duration-normal) ease-out;
  }
  a:hover { border-color: var(--color-mms-brand-primary); background: var(--color-mms-surface-card-surface); }
  a:focus-visible { outline: var(--size-border-md) solid var(--color-mms-brand-primary); outline-offset: var(--size-border-md); }
  svg {
    width: var(--size-component-icon-sm);
    height: var(--size-component-icon-sm);
    fill: currentColor;
    transition: transform var(--motion-duration-fast) ease-out;
  }
  a:hover svg { transform: translateX(-2px); }
  @media (prefers-reduced-motion: reduce) {
    a, svg { transition-duration: 0ms; }
  }
`;

class BackToMenu extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = `
      <style>${css}</style>
      <a href="./" part="link">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7.825 13 5.6 5.6L12 20l-8-8 8-8 1.425 1.4-5.6 5.6H20v2H7.825Z"/></svg>
        Back to Menu
      </a>`;
  }
}

if (!customElements.get("back-to-menu")) customElements.define("back-to-menu", BackToMenu);
// `?thumb` is used when capturing the gallery card previews — keep the link out of the shot.
if (!new URLSearchParams(location.search).has("thumb")) document.body.prepend(document.createElement("back-to-menu"));

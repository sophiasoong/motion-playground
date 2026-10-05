/**
 * Shared LiquiGlass optics for the glass-tone surfaces in this project.
 *
 * These are lens parameters (px / ratios) fed to a canvas displacement map, so
 * they live in JS rather than CSS. `radius` is per surface and set by each
 * component; everything else is the material and is shared so the liquid
 * action button, the floating action bar and any future glass surface refract
 * the same way.
 *
 *   refraction 80, depth 10 (→ bezel, the rim width that reads as glass
 *   thickness), dispersion 50 (→ 0.5, library scale is 0–1), light band 40%
 *   (→ specular; FLAGGED: no opacity/40 token, tokens.json has opacity/0|20|60),
 *   frost 4 (→ 4px backdrop blur). "Splay" has no LiquiGlass equivalent.
 */
export const GLASS_MATERIAL = {
  blur: 4,
  refraction: 80,
  bezel: 10,
  dispersion: 0.5,
  specular: 0.4,
} as const;

/** liqui's stock button optics, used by the brand-tinted (primary) tone. */
export const PRIMARY_MATERIAL = {
  blur: 1,
  refraction: 45,
  bezel: 11,
} as const;

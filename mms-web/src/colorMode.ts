export type ColorMode = 'mms' | 'mma';

const STORAGE_KEY = 'mms-color-mode';

export function getStoredColorMode(): ColorMode {
  return localStorage.getItem(STORAGE_KEY) === 'mma' ? 'mma' : 'mms';
}

export function applyColorMode(mode: ColorMode) {
  document.documentElement.setAttribute('data-color-mode', mode);
  localStorage.setItem(STORAGE_KEY, mode);
}

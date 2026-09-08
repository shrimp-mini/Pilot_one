import { themeColors, type ThemeId } from "../data/themes";
import {
  clearInlineTheme,
  isMotionOn,
  prefersReducedMotion,
} from "./reduced-motion";

const THEME_IDS = new Set(Object.keys(themeColors) as ThemeId[]);

function isThemeId(value: string): value is ThemeId {
  return THEME_IDS.has(value as ThemeId);
}

function hexToRgb(hex: string): [number, number, number] {
  const raw = hex.replace("#", "");
  const n = Number.parseInt(raw, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (c: number) => Math.round(c).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function mixHex(from: string, to: string, t: number): string {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  return rgbToHex(lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t));
}

function applyColors(from: ThemeId, to: ThemeId, t: number): void {
  const start = themeColors[from];
  const end = themeColors[to];
  const jumpingUp = luminance(end.bg) - luminance(start.bg) > 0.12;
  const shaped = jumpingUp ? t ** 1.45 : t;
  const root = document.documentElement;
  root.style.setProperty("--bg", mixHex(start.bg, end.bg, shaped));
  root.style.setProperty("--fg", mixHex(start.fg, end.fg, shaped));
  root.style.setProperty("--muted", mixHex(start.muted, end.muted, shaped));
  root.style.setProperty("--surface", mixHex(start.surface, end.surface, shaped));

  const bg = hexToRgb(mixHex(start.bg, end.bg, shaped));
  const lum = (0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2]) / 255;
  root.style.colorScheme = lum > 0.45 ? "light" : "dark";
}

function sections(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>("[data-theme-section]")];
}

function themeOf(el: HTMLElement, fallback: ThemeId): ThemeId {
  const value = el.dataset.toTheme;
  return value && isThemeId(value) ? value : fallback;
}

function update(): void {
  const root = document.documentElement;
  if (prefersReducedMotion() || !isMotionOn()) {
    clearInlineTheme(root);
    return;
  }

  const items = sections();
  if (items.length === 0) {
    return;
  }

  const probe = window.innerHeight * 0.35;
  let currentIndex = 0;

  for (let i = 0; i < items.length; i += 1) {
    const rect = items[i].getBoundingClientRect();
    if (rect.top <= probe) {
      currentIndex = i;
    }
  }

  const current = items[currentIndex];
  const to = themeOf(current, "paper");
  const from =
    currentIndex === 0
      ? to
      : themeOf(items[currentIndex - 1], to);

  const rect = current.getBoundingClientRect();
  const local = (probe - rect.top) / Math.max(rect.height, 1);
  const t = easeInOut(Math.min(1, Math.max(0, local / 0.75)));

  applyColors(from, to, t);
}

let ticking = false;

function onScroll(): void {
  if (ticking) {
    return;
  }
  ticking = true;
  requestAnimationFrame(() => {
    update();
    ticking = false;
  });
}

update();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
window
  .matchMedia("(prefers-reduced-motion: reduce)")
  .addEventListener("change", onScroll);
document.addEventListener("astro:page-load", update);

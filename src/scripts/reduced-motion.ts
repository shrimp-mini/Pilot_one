const MOTION_ATTR = "motion";

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isMotionOn(): boolean {
  return document.documentElement.dataset[MOTION_ATTR] === "on";
}

function applyMotionFlag(): void {
  const root = document.documentElement;
  const reduce = prefersReducedMotion();
  root.dataset[MOTION_ATTR] = reduce ? "off" : "on";

  if (reduce) {
    delete root.dataset.identityActive;
  }

  if (reduce && root.dataset.page === "home") {
    root.dataset.theme = "paper";
    clearInlineTheme(root);
    return;
  }

  if (root.dataset.themeInitial) {
    root.dataset.theme = root.dataset.themeInitial;
  }
}

export function clearInlineTheme(root: HTMLElement): void {
  for (const key of ["--bg", "--fg", "--muted", "--surface"] as const) {
    root.style.removeProperty(key);
  }
}

applyMotionFlag();

window
  .matchMedia("(prefers-reduced-motion: reduce)")
  .addEventListener("change", applyMotionFlag);

document.addEventListener("astro:before-swap", (event) => {
  const next = (event as Event & { newDocument: Document }).newDocument
    .documentElement;
  const root = document.documentElement;
  root.dataset.page = next.dataset.page;
  root.dataset.theme = next.dataset.theme;
  root.dataset.themeInitial = next.dataset.themeInitial;
  delete root.dataset.identityActive;
});

document.addEventListener("astro:page-load", applyMotionFlag);

import { prefersReducedMotion } from "./reduced-motion";

const nav = document.querySelector<HTMLElement>("[data-scroll-ticks]");
let bound = false;
let ticking = false;

function tickControls(): HTMLElement[] {
  if (!nav) {
    return [];
  }
  return [...nav.querySelectorAll<HTMLElement>("[data-tick-target]")];
}

function headingTicks(): { id: string; label: string }[] {
  const headings = [...document.querySelectorAll<HTMLHeadingElement>("#main h2")];
  return headings.map((heading, index) => {
    if (!heading.id) {
      heading.id = `tick-h2-${index + 1}`;
    }
    const label = heading.textContent?.trim() || `区間 ${index + 1}`;
    return { id: heading.id, label };
  });
}

function renderSubpage(): void {
  if (!nav) {
    return;
  }
  const list = nav.querySelector<HTMLOListElement>("[data-scroll-ticks-list]");
  if (!list) {
    return;
  }

  const ticks = headingTicks();
  if (ticks.length < 3) {
    nav.hidden = true;
    list.replaceChildren();
    return;
  }

  nav.hidden = false;
  list.replaceChildren(
    ...ticks.map((tick) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${tick.id}`;
      link.dataset.tickTarget = tick.id;
      link.innerHTML =
        `<span class="scroll-tick-mark" aria-hidden="true"></span><span class="scroll-tick-label"></span>`;
      const label = link.querySelector(".scroll-tick-label");
      if (label) {
        label.textContent = tick.label;
      }
      item.append(link);
      return item;
    }),
  );
}

function currentIndex(targets: HTMLElement[]): number {
  const probe = window.innerHeight * 0.38;
  let index = 0;
  for (let i = 0; i < targets.length; i += 1) {
    if (targets[i].getBoundingClientRect().top <= probe) {
      index = i;
    }
  }
  return index;
}

function updateCurrent(): void {
  if (!nav) {
    return;
  }
  const controls = tickControls();
  const targets = controls
    .map((control) => document.getElementById(control.dataset.tickTarget ?? ""))
    .filter((el): el is HTMLElement => Boolean(el));

  if (targets.length === 0) {
    return;
  }

  const active = currentIndex(targets);
  for (const [index, control] of controls.entries()) {
    if (index === active) {
      control.setAttribute("aria-current", "true");
    } else {
      control.removeAttribute("aria-current");
    }
  }
}

function onScroll(): void {
  if (ticking) {
    return;
  }
  ticking = true;
  requestAnimationFrame(() => {
    updateCurrent();
    ticking = false;
  });
}

function setup(): void {
  if (!nav) {
    return;
  }

  if (document.documentElement.dataset.page === "home") {
    nav.hidden = false;
  } else {
    renderSubpage();
  }

  updateCurrent();

  if (bound) {
    return;
  }
  bound = true;
  nav.addEventListener("click", (event) => {
    const control = (event.target as HTMLElement | null)?.closest<HTMLElement>(
      "[data-tick-target]",
    );
    if (!control) {
      return;
    }
    const target = document.getElementById(control.dataset.tickTarget ?? "");
    if (!target) {
      return;
    }
    event.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "instant" : "smooth",
      block: "start",
    });
  });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

document.addEventListener("astro:page-load", setup);
setup();

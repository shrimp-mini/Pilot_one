import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isMotionOn, prefersReducedMotion } from "./reduced-motion";

gsap.registerPlugin(ScrollTrigger);

function setup(): void {
  const root = document.documentElement;
  delete root.dataset.identityActive;

  ScrollTrigger.getAll().forEach((trigger) => {
    if (String(trigger.vars.id ?? "").startsWith("identity-")) {
      trigger.kill();
    }
  });

  const name = document.querySelector<HTMLElement>("[data-identity-pin]");
  const logo = document.querySelector<HTMLElement>("[data-identity-logo]");
  const cover = document.querySelector<HTMLElement>("#cover");

  if (logo && root.dataset.page !== "home") {
    logo.classList.add("is-received");
    logo.setAttribute("aria-hidden", "false");
  }

  if (
    !name ||
    !logo ||
    !cover ||
    root.dataset.page !== "home" ||
    !isMotionOn() ||
    prefersReducedMotion()
  ) {
    if (logo) {
      logo.classList.add("is-received");
      logo.setAttribute("aria-hidden", "false");
    }
    return;
  }

  root.dataset.identityActive = "true";

  const nameEl = name;
  const logoEl = logo;
  const coverEl = cover;
  let start = { x: 0, y: 0, w: 1 };
  let end = { x: 0, y: 0, w: 1 };
  let magnet = { x: 0, y: 0 };
  let progress = 0;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");

  function measure(): void {
    gsap.set(nameEl, { x: 0, y: 0, scale: 1, opacity: 1 });
    const nameRect = nameEl.getBoundingClientRect();
    const logoRect = logoEl.getBoundingClientRect();
    start = {
      x: nameRect.left + nameRect.width / 2,
      y: nameRect.top + nameRect.height / 2,
      w: nameRect.width,
    };
    end = {
      x: logoRect.left + logoRect.width / 2,
      y: logoRect.top + logoRect.height / 2,
      w: Math.max(logoRect.width, 1),
    };
  }

  function apply(): void {
    const p = progress;
    const scale = 1 + (end.w / start.w - 1) * p;
    const mag = p < 0.2 && fine.matches ? 1 - p / 0.2 : 0;
    gsap.set(nameEl, {
      x: (end.x - start.x) * p + magnet.x * mag,
      y: (end.y - start.y) * p + magnet.y * mag,
      scale,
      transformOrigin: "center center",
      opacity: p > 0.88 ? 1 - (p - 0.88) / 0.12 : 1,
    });

    const received = p >= 0.88;
    logoEl.classList.toggle("is-received", received);
    logoEl.setAttribute("aria-hidden", received ? "false" : "true");
    nameEl.setAttribute("aria-hidden", received ? "true" : "false");
    nameEl.style.pointerEvents = received ? "none" : "";
  }

  measure();
  apply();

  const mobile = window.matchMedia("(max-width: 767px)");
  ScrollTrigger.create({
    id: "identity-pin",
    trigger: coverEl,
    start: "top top",
    end: () =>
      `+=${String(Math.round(window.innerHeight * (mobile.matches ? 0.4 : 0.7)))}`,
    scrub: true,
    onRefreshInit: () => {
      gsap.set(nameEl, { x: 0, y: 0, scale: 1, opacity: 1 });
    },
    onRefresh: () => {
      measure();
      apply();
    },
    onUpdate: (self) => {
      progress = self.progress;
      apply();
    },
  });

  nameEl.addEventListener("pointermove", (event) => {
    if (progress > 0.2 || !fine.matches) {
      magnet = { x: 0, y: 0 };
      return;
    }
    const rect = nameEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    magnet = {
      x: Math.max(-6, Math.min(6, (event.clientX - cx) * 0.08)),
      y: Math.max(-6, Math.min(6, (event.clientY - cy) * 0.08)),
    };
    apply();
  });

  nameEl.addEventListener("pointerleave", () => {
    magnet = { x: 0, y: 0 };
    apply();
  });
}

document.addEventListener("astro:page-load", setup);
document.addEventListener("astro:before-swap", () => {
  delete document.documentElement.dataset.identityActive;
  ScrollTrigger.getAll().forEach((trigger) => {
    if (String(trigger.vars.id ?? "").startsWith("identity-")) {
      trigger.kill();
    }
  });
});
setup();

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isMotionOn, prefersReducedMotion } from "./reduced-motion";

gsap.registerPlugin(ScrollTrigger);

function killStacks(): void {
  ScrollTrigger.getAll().forEach((trigger) => {
    if (String(trigger.vars.id ?? "").startsWith("stack-")) {
      trigger.kill();
    }
  });

  document.querySelectorAll<HTMLElement>("[data-stack-card]").forEach((card) => {
    card.classList.remove("is-front");
    card.style.willChange = "auto";
    gsap.set(card, { clearProps: "transform,opacity" });
    const title = card.querySelector<HTMLElement>(".card-title");
    if (title) {
      title.style.fontSize = "";
    }
  });
}

function stack(container: HTMLElement, variant: string, index: number): void {
  const boards = [...container.querySelectorAll<HTMLElement>(".sticky-expand")];
  if (boards.length < 2) {
    return;
  }

  for (const [boardIndex, board] of boards.entries()) {
    const card = board.querySelector<HTMLElement>("[data-stack-card]");
    if (!card) {
      continue;
    }

    ScrollTrigger.create({
      id: `stack-${index}-${boardIndex}`,
      trigger: board,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const t = Math.min(1, self.progress / 0.7);
        const isFront = t < 0.15;
        card.classList.toggle("is-front", isFront);
        card.style.willChange = t > 0 && t < 1 ? "transform" : "auto";
        gsap.set(card, {
          scale: 1 - 0.08 * t,
          yPercent: -8 * t,
          opacity: 1 - 0.6 * t,
          transformOrigin: "center top",
        });
        if (variant === "hub" || variant === "work") {
          const title = card.querySelector<HTMLElement>(".card-title");
          if (title) {
            title.style.fontSize = t > 0.35 ? "var(--step-1)" : "";
          }
        }
      },
      onLeave: () => {
        card.style.willChange = "auto";
      },
    });
  }
}

function setup(): void {
  killStacks();
  if (!isMotionOn() || prefersReducedMotion()) {
    return;
  }
  for (const [index, root] of document
    .querySelectorAll<HTMLElement>("[data-stacked]")
    .entries()) {
    stack(root, root.dataset.stacked ?? "hub", index);
  }
}

document.addEventListener("astro:page-load", setup);
document.addEventListener("astro:before-swap", killStacks);
setup();

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initSpotlight() {
  if (prefersReducedMotion) return;
  document.addEventListener(
    "mousemove",
    (e) => {
      document.querySelectorAll(".spotlight-card").forEach((card) => {
        const r = card.getBoundingClientRect();
        const mx = ((e.clientX - r.left) / r.width) * 100;
        const my = ((e.clientY - r.top) / r.height) * 100;
        if (mx >= -8 && mx <= 108 && my >= -8 && my <= 108) {
          card.style.setProperty("--mx", `${mx}%`);
          card.style.setProperty("--my", `${my}%`);
        }
      });
    },
    { passive: true }
  );
}

initSpotlight();

const revealEls = document.querySelectorAll(".reveal");

if (!prefersReducedMotion) {
  revealEls.forEach((el, index) => {
    // Keep explicit delays from inline styles, otherwise apply a light stagger.
    if (!el.style.getPropertyValue("--reveal-delay")) {
      el.style.setProperty("--reveal-delay", `${Math.min(index * 35, 220)}ms`);
    }
  });
}

if (prefersReducedMotion) {
  revealEls.forEach((el) => {
    el.style.setProperty("--reveal-delay", "0ms");
    el.classList.add("is-visible");
  });
} else if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const href = anchor.getAttribute("href");
    if (!href || href.length <= 1) return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
});

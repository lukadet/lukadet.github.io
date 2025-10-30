/* ============================================================
   Blue Rose – JavaScript
   ============================================================ */

// Header shadow on scroll
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (window.scrollY > 50) header.classList.add("header-scrolled");
  else header.classList.remove("header-scrolled");
}, { passive: true });

// Mobile menu
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");
if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener("click", () => navLinks.classList.toggle("active"));
  document.querySelectorAll(".nav-links a").forEach(a =>
    a.addEventListener("click", () => navLinks.classList.remove("active"))
  );
}

// Reveal on scroll
const revealOnScroll = new IntersectionObserver((entries, obs) => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add("animate"); obs.unobserve(e.target); }
  }
}, { threshold: 0.2 });
document.querySelectorAll(".service-card, .team-member").forEach(el => revealOnScroll.observe(el));

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (id && id.length > 1) {
      e.preventDefault();
      const t = document.querySelector(id);
      if (t) window.scrollTo({ top: t.offsetTop - 70, behavior: "smooth" });
    }
  });
});

// CTA button scroll
const contactButton = document.querySelector(".submit-btn");
if (contactButton) {
  contactButton.addEventListener("click", () => {
    const c = document.getElementById("contact");
    if (c) window.scrollTo({ top: c.offsetTop - 70, behavior: "smooth" });
  });
}

/* ============================================================
   Reel – CSS marquee + desktop drag, mobile-safe
   ============================================================ */
(function () {
  function initReel() {
    const viewport = document.querySelector(".reel-viewport");
    const track = document.getElementById("reelTrack");
    if (!viewport || !track || track.dataset.inited === "1") return;

    // Build two identical groups for seamless loop
    let group1 = track.querySelector(".reel-group");
    let group2;
    if (!group1) {
      const items = Array.from(track.children);
      group1 = document.createElement("div");
      group1.className = "reel-group";
      items.forEach(el => group1.appendChild(el));
      track.appendChild(group1);
    }
    group2 = group1.nextElementSibling?.classList.contains("reel-group")
      ? group1.nextElementSibling
      : track.appendChild(group1.cloneNode(true));

    [track, group1, group2].forEach(el => { el.style.display = "inline-flex"; el.style.gap = "var(--gap)"; });

    // Speed vars (seconds + hover factor)
    const dur = parseFloat(viewport.dataset.duration || "28");
    const hoverFactor = parseFloat(viewport.dataset.hoverSpeed || "0.5");
    track.style.setProperty("--duration", isFinite(dur) ? dur : 28);
    track.style.setProperty("--hover-factor", isFinite(hoverFactor) ? hoverFactor : 0.5);

    const pauseAnim  = () => (track.style.animationPlayState = "paused");
    const resumeAnim = () => (track.style.animationPlayState = "running");

    const isFinePointer = window.matchMedia?.("(pointer: fine)")?.matches;
    const isCoarse      = window.matchMedia?.("(pointer: coarse)")?.matches;

    // Desktop drag (fine pointer only)
    if (isFinePointer) {
      let isDown = false, startX = 0, startOffset = 0, dragged = false;
      const getMatrixX = () => {
        const m = getComputedStyle(track).transform;
        if (m === "none") return 0;
        const val = parseFloat(m.split(",")[4]);
        return isNaN(val) ? 0 : val;
      };
      viewport.addEventListener("pointerdown", e => {
        isDown = true; dragged = false;
        startX = e.clientX; startOffset = getMatrixX();
        pauseAnim(); viewport.setPointerCapture?.(e.pointerId);
      });
      viewport.addEventListener("pointermove", e => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 2) dragged = true;
        track.style.transform = `translate3d(${startOffset + dx}px,0,0)`;
      });
      function release() {
        if (!isDown) return;
        isDown = false;
        track.style.removeProperty("transform");
        void track.offsetHeight; // reflow
        resumeAnim();
      }
      viewport.addEventListener("pointerup", release);
      viewport.addEventListener("pointercancel", release);
      viewport.addEventListener("pointerleave", () => { if (isDown) release(); });
      viewport.addEventListener("click", e => {
        if (dragged) { e.preventDefault(); e.stopPropagation(); }
        track.style.removeProperty("transform");
        void track.offsetHeight; resumeAnim();
      });
    }

    // Mobile/touch safety – keep running on any touch
    if (isCoarse) {
      const keepRunning = () => {
        track.style.removeProperty("transform"); // ensure no inline override
        track.style.animationPlayState = "running";
      };
      viewport.addEventListener("touchstart", keepRunning, { passive: true });
      viewport.addEventListener("touchmove",  keepRunning, { passive: true });
      viewport.addEventListener("touchend",   keepRunning, { passive: true });
      viewport.addEventListener("touchcancel",keepRunning, { passive: true });
    }

    // Battery save: pause when tab hidden
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pauseAnim(); else resumeAnim();
    });

    // Respect reduced motion
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.style.animation = "none";
    }

    track.dataset.inited = "1";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initReel);
  else initReel();
})();
/* ============================================================
   Blue Rose – JavaScript
   ============================================================ */

// Header shadow on scroll
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  header.classList.toggle("header-scrolled", window.scrollY > 50);
}, { passive: true });

// Mobile menu toggle
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
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("animate");
      obs.unobserve(e.target);
    }
  });
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

// CTA scroll
const contactButton = document.querySelector(".submit-btn");
if (contactButton) {
  contactButton.addEventListener("click", () => {
    const c = document.getElementById("contact");
    if (c) window.scrollTo({ top: c.offsetTop - 70, behavior: "smooth" });
  });
}

// Smooth Reel Gallery (no hover/drag, no jump)
(function () {
  async function decodeImg(img) {
    try { if (img.decode) await img.decode(); }
    catch { }
    if (img.complete) return;
    await new Promise(res => img.addEventListener("load", res, { once: true }));
  }

  async function initReel() {
    const viewport = document.querySelector(".reel-viewport");
    const track = document.getElementById("reelTrack");
    if (!viewport || !track || track.dataset.inited === "1") return;

    const H = parseFloat(getComputedStyle(viewport).getPropertyValue("--reel-height")) || 460;
    const imgs = Array.from(track.querySelectorAll("img"));
    await Promise.all(imgs.map(decodeImg));

    Array.from(track.children).forEach(frame => {
      const img = frame.querySelector("img");
      if (img?.naturalWidth && img?.naturalHeight) {
        const w = H * (img.naturalWidth / img.naturalHeight);
        frame.style.width = `${w}px`;
        frame.style.height = `${H}px`;
      }
    });

    const items = Array.from(track.children);
    const group1 = document.createElement("div");
    group1.className = "reel-group";
    items.forEach(el => group1.appendChild(el));
    track.appendChild(group1);

    const group2 = group1.cloneNode(true);
    track.appendChild(group2);
    [track, group1, group2].forEach(el => {
      el.style.display = "inline-flex";
      el.style.gap = "var(--gap)";
    });

    track.style.animation = "reel-marquee var(--duration) linear infinite";
    track.style.animationPlayState = "running";

    document.addEventListener("visibilitychange", () => {
      track.style.animationPlayState = document.hidden ? "paused" : "running";
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.style.animation = "none";
    }

    track.dataset.inited = "1";
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", initReel)
    : initReel();
})();
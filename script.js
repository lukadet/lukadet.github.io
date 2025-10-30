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

// ===== 6. Smooth Reel Gallery (no hover, no drag) =====
(function () {
  function initReel() {
    const viewport = document.querySelector(".reel-viewport");
    const track = document.getElementById("reelTrack");
    if (!viewport || !track) return;

    // Build double content for seamless loop
    const items = Array.from(track.children);
    const group1 = document.createElement("div");
    group1.className = "reel-group";
    items.forEach((el) => group1.appendChild(el));
    track.appendChild(group1);

    const group2 = group1.cloneNode(true);
    track.appendChild(group2);

    [track, group1, group2].forEach((el) => {
      el.style.display = "inline-flex";
      el.style.gap = "var(--gap)";
    });

    // Ensure animation always runs
    track.style.animationPlayState = "running";

    // Resume animation if tab is refocused
    document.addEventListener("visibilitychange", () => {
      track.style.animationPlayState = document.hidden ? "paused" : "running";
    });

    // Disable motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.style.animation = "none";
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", initReel);
  else initReel();
})();
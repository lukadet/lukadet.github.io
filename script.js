/* ============================================================
   Blue Rose – JavaScript (IDs/classes aligned with index.html)
   ============================================================ */

// Header shadow on scroll
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  header.classList.toggle("header-scrolled", window.scrollY > 50);
}, { passive: true });

// Mobile menu
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");
if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener("click", () => navLinks.classList.toggle("active"));
  document.querySelectorAll(".nav-links a").forEach(link =>
    link.addEventListener("click", () => navLinks.classList.remove("active"))
  );
}

// Reveal on scroll
const reveal = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("animate");
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll(".service-card, .team-member").forEach(el => reveal.observe(el));

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

// CTA button scroll to contact
document.querySelectorAll(".submit-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const c = document.getElementById("contact");
    if (c) window.scrollTo({ top: c.offsetTop - 70, behavior: "smooth" });
  });
});

// ===== Smooth Reel Gallery (no hover/drag; no server jump) =====
(function () {
  async function decodeImg(img) {
    try { if (img.decode) await img.decode(); } catch {}
    if (img.complete) return;
    await new Promise(res => img.addEventListener("load", res, { once: true }));
  }

  async function initReel() {
    const viewport = document.querySelector(".reel-viewport");
    const track = document.getElementById("reelTrack");
    if (!viewport || !track || track.dataset.inited === "1") return;

    const H = parseFloat(getComputedStyle(viewport).getPropertyValue("--reel-height")) || 460;

    // Wait images to avoid CLS jump on server
    const imgs = [...track.querySelectorAll("img")];
    await Promise.all(imgs.map(decodeImg));

    // Fix widths by natural aspect ratio
    [...track.children].forEach(frame => {
      const img = frame.querySelector("img");
      if (img?.naturalWidth && img?.naturalHeight) {
        frame.style.width = `${H * (img.naturalWidth / img.naturalHeight)}px`;
        frame.style.height = `${H}px`;
        frame.style.flex = "0 0 auto";
      }
    });

    // Duplicate content for seamless loop
    const group1 = document.createElement("div");
    group1.className = "reel-group";
    [...track.children].forEach(el => group1.appendChild(el));
    const group2 = group1.cloneNode(true);

    track.innerHTML = "";
    track.append(group1, group2);
    [group1, group2, track].forEach(el => {
      el.style.display = "inline-flex";
      el.style.gap = "var(--gap)";
    });

    // Start animation (no hover behavior anywhere)
    track.style.animation = "reel-marquee var(--duration) linear infinite";
    track.style.animationPlayState = "running";

    // Pause when tab hidden (battery)
    document.addEventListener("visibilitychange", () => {
      track.style.animationPlayState = document.hidden ? "paused" : "running";
    });

    track.dataset.inited = "1";
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", initReel);
  else
    initReel();
})();
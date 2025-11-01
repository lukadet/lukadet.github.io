/* ============================================================
   Blue Rose – JavaScript (no pre-wait for gallery)
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
  const icon = mobileMenuBtn.querySelector("i");

  function closeMenu() {
    navLinks.classList.remove("active");
    document.body.classList.remove("menu-open");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    if (icon) { icon.classList.remove("fa-times", "fa-xmark"); icon.classList.add("fa-bars"); }
  }

  mobileMenuBtn.addEventListener("click", () => {
    const opening = !navLinks.classList.contains("active");
    navLinks.classList.toggle("active", opening);
    document.body.classList.toggle("menu-open", opening);
    mobileMenuBtn.setAttribute("aria-expanded", opening ? "true" : "false");

    if (icon) {
      icon.classList.remove("fa-bars", "fa-times", "fa-xmark");
      icon.classList.add(opening ? "fa-times" : "fa-bars"); // use fa-xmark if your FA supports it
    }
  });

  document.querySelectorAll(".nav-links a").forEach(a =>
    a.addEventListener("click", closeMenu)
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
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

// ===== Reel Gallery: start immediately; progressively enhance =====
(function () {
  function restartAnimation(el) {
    el.style.animation = "none";
    void el.offsetWidth; // reflow
    el.style.animation = "reel-marquee var(--duration) linear infinite";
  }

  let restartTimer = null;
  function scheduleRestart(el) {
    clearTimeout(restartTimer);
    restartTimer = setTimeout(() => restartAnimation(el), 80);
  }

  function setFrameSize(frame, H) {
    const img = frame.querySelector("img");
    // Fallback width so something is visible immediately
    let w = Math.round(H * 1.5);

    if (img && img.naturalWidth && img.naturalHeight) {
      w = Math.max(160, Math.round(H * (img.naturalWidth / img.naturalHeight)));
    }

    frame.style.width  = w + "px";
    frame.style.height = H + "px";
    frame.style.flex   = "0 0 auto";
  }

  function initReel() {
    const viewport = document.querySelector(".reel-viewport");
    const track = document.getElementById("reelTrack");
    if (!viewport || !track || track.dataset.inited === "1") return;

    const H = parseFloat(getComputedStyle(viewport).getPropertyValue("--reel-height")) || 460;

    // Immediately size frames with a sensible fallback so the gallery is visible
    [...track.children].forEach(frame => setFrameSize(frame, H));

    // Duplicate content for seamless loop (no waiting)
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

    // Start animation right away
    track.style.animation = "reel-marquee var(--duration) linear infinite";
    track.style.animationPlayState = "running";

    // As images load, refine sizes and gently restart animation
    track.querySelectorAll("img").forEach(img => {
      img.addEventListener("load", () => {
        const frame = img.closest(".reel-frame");
        if (frame) setFrameSize(frame, H);
        scheduleRestart(track);
      }, { once: true });
    });

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
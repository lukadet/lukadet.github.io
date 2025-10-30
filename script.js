/* ============================================================
   Blue Rose – JavaScript
   ============================================================ */

// ===== 1) Dinamičen header (shadow po scrollu) =====
window.addEventListener("scroll", function () {
  const header = document.getElementById("header");
  if (window.scrollY > 50) header.classList.add("header-scrolled");
  else header.classList.remove("header-scrolled");
});

// ===== 2) Mobilni meni toggle =====
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");

if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });
}

// ===== 3) Animacija elementov ob prikazu (scroll reveal) =====
const observerOptions = { threshold: 0.2 };
const revealOnScroll = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
      obs.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".service-card, .team-member").forEach(el => {
  revealOnScroll.observe(el);
});

// ===== 4) Smooth scroll za sidrne povezave =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId.length > 1) {
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: "smooth",
        });
      }
    }
  });
});

// ===== 5) Kontaktni gumb – skrol do kontakt sekcije =====
const contactButton = document.querySelector('.submit-btn');
if (contactButton) {
  contactButton.addEventListener('click', () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      window.scrollTo({
        top: contactSection.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  });
}

/* ============================================================
   6) Galerija – Hybrid CSS-marquee + Drag (brez skokov na hover)
   ============================================================ */
(function () {
  function initReelHybrid() {
    const viewport = document.querySelector('.reel-viewport');
    const track = document.getElementById('reelTrack');
    if (!viewport || !track) return;

    // ---- Zgradi 2 identični skupini za brezšiven loop ----
    const items = Array.from(track.children);
    const group1 = document.createElement('div');
    group1.className = 'reel-group';
    items.forEach(el => group1.appendChild(el));
    track.appendChild(group1);
    const group2 = group1.cloneNode(true);
    track.appendChild(group2);

    // ---- Inline-flex layout + razmiki ----
    [track, group1, group2].forEach(el => {
      el.style.display = 'inline-flex';
      el.style.gap = 'var(--gap)';
    });

    // ---- Hitrost iz data-* (duration v sekundah, hover-speed kot faktor) ----
    const dur = parseFloat(viewport.dataset.duration || '28');          // npr. 28
    const hoverFactor = parseFloat(viewport.dataset.hoverSpeed || '0.5'); // 0.5 = 2× hitreje
    track.style.setProperty('--duration', dur);
    track.style.setProperty('--hover-factor', hoverFactor);

    // ---- Hover ne resetira faze (to ureja CSS z var-ji) ----
    // (nič posebnega v JS – samo poskrbimo za play/pause spodaj)

    // ---- Pause/Resume helperji za animacijo ----
    const pauseAnim  = () => (track.style.animationPlayState = 'paused');
    const resumeAnim = () => (track.style.animationPlayState = 'running');

    // ---- Drag podpora (klik/drag začasno ustavi CSS animacijo) ----
    let isDown = false, startX = 0, startOffset = 0;

    const getMatrixX = () => {
      const m = getComputedStyle(track).transform;
      if (m === 'none') return 0;
      const val = parseFloat(m.split(',')[4]);
      return isNaN(val) ? 0 : val;
    };

    viewport.addEventListener('pointerdown', (e) => {
      isDown = true;
      startX = e.clientX;
      startOffset = getMatrixX();
      pauseAnim();
      viewport.setPointerCapture?.(e.pointerId);
    });

    viewport.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      track.style.transform = `translate3d(${startOffset + dx}px,0,0)`;
    });

    // Robustno sproščanje: počisti inline transform in ponovno zaženi CSS animacijo
    function release() {
      if (!isDown) return;
      isDown = false;
      track.style.removeProperty('transform'); // da CSS animation spet prevzame
      void track.offsetHeight;                 // reflow: zanesljivo ponovno veže animacijo
      resumeAnim();
    }

    viewport.addEventListener('pointerup', release);
    viewport.addEventListener('pointercancel', release);

    // Extra: če hitro klikneš ali zapustiš z dragom
    viewport.addEventListener('click', () => {
      track.style.removeProperty('transform');
      void track.offsetHeight;
      resumeAnim();
    });
    viewport.addEventListener('pointerleave', () => {
      if (!isDown) return;
      isDown = false;
      track.style.removeProperty('transform');
      void track.offsetHeight;
      resumeAnim();
    });

    // ---- Varčevanje baterije: pavza, ko je tab skrit ----
    document.addEventListener('visibilitychange', () => {
      document.hidden ? pauseAnim() : resumeAnim();
    });

    // ---- Spoštuj "reduced motion" ----
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.style.animation = 'none';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReelHybrid);
  } else {
    initReelHybrid();
  }
})();
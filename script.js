/* ============================================================
   Blue Rose – JavaScript
   ============================================================ */

// ===== 1. Dinamičen header (shadow po scrollu) =====
window.addEventListener("scroll", function () {
  const header = document.getElementById("header");
  if (window.scrollY > 50) header.classList.add("header-scrolled");
  else header.classList.remove("header-scrolled");
});

// ===== 2. Mobilni meni toggle =====
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

// ===== 3. Animacija elementov ob prikazu (scroll reveal) =====
const observerOptions = {
  threshold: 0.2
};

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

// ===== 4. Smooth scroll (lep prehod pri klikih na meni) =====
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

// ===== 5. Kontaktni gumb – skrol do kontaktne sekcije =====
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

// ===== 6. GALERIJA (CSS Marquee – gladka in lahka) =====
(function () {
  function initCSSMarquee() {
    const viewport = document.querySelector('.reel-viewport');
    const track = document.getElementById('reelTrack');
    if (!viewport || !track) return;

    // --- 1) Vzemi vse obstoječe elemente ---
    const items = Array.from(track.children);
    const group1 = document.createElement('div');
    group1.className = 'reel-group';
    items.forEach(el => group1.appendChild(el));
    track.appendChild(group1);

    // --- 2) Kloniraj 1x za neprekinjen loop ---
    const group2 = group1.cloneNode(true);
    track.appendChild(group2);

    // --- 3) Poskrbi za inline-flex razporeditev ---
    Object.assign(track.style, { display: 'inline-flex' });
    Object.assign(group1.style, { display: 'inline-flex', gap: 'var(--gap)' });
    Object.assign(group2.style, { display: 'inline-flex', gap: 'var(--gap)' });

    // --- 4) Nastavi hitrosti iz data atributov ---
const dur  = parseFloat(viewport.dataset.duration || '28');
const hoverSpeed = parseFloat(viewport.dataset.hoverSpeed || '1.0'); // faktor
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const d = clamp(dur, 6, 120);
const hf = clamp(hoverSpeed, 0.1, 1); // faktor za hover, npr. 0.5 = 2× hitreje
track.style.setProperty('--duration', d);
track.style.setProperty('--hover-factor', hf);

    // --- 5) Upoštevaj vidnost zavihka ---
    document.addEventListener('visibilitychange', () => {
      track.style.animationPlayState = document.hidden ? 'paused' : 'running';
    });

    // --- 6) Če uporabnik ima “reduce motion”, izklopi animacijo ---
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.style.animation = 'none';
    }

    // --- 7) Tap/pause na dotik (uporabno na mobilnih) ---
    let touchPauseTimer = null;
    viewport.addEventListener('touchstart', () => {
      track.style.animationPlayState = 'paused';
      clearTimeout(touchPauseTimer);
      touchPauseTimer = setTimeout(() => {
        track.style.animationPlayState = 'running';
      }, 4000);
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      clearTimeout(touchPauseTimer);
      track.style.animationPlayState = 'running';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCSSMarquee);
  } else {
    initCSSMarquee();
  }
})();


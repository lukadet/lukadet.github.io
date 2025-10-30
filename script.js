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
   6) Galerija – Hybrid CSS-marquee + Drag (mobilni safe)
   ============================================================ */
(function () {
  function initReelHybrid() {
    const viewport = document.querySelector('.reel-viewport');
    const track = document.getElementById('reelTrack');
    if (!viewport || !track) return;

    // ---- Idempotent: če je že inicializirano, ne delaj nič ----
    if (track.dataset.inited === '1') return;

    // ---- Zgradi 2 identični skupini za brezšiven loop (1x klon) ----
    const existingGroup = track.querySelector('.reel-group');
    let group1, group2;

    if (existingGroup) {
      // že strukturirano: poskrbi, da obstajata točno dve skupini
      const groups = [...track.querySelectorAll('.reel-group')];
      if (groups.length === 1) {
        group1 = groups[0];
        group2 = group1.cloneNode(true);
        track.appendChild(group2);
      } else if (groups.length >= 2) {
        group1 = groups[0];
        group2 = groups[1];
        // odstrani morebitne presežke
        for (let i = 2; i < groups.length; i++) groups[i].remove();
      }
    } else {
      const items = Array.from(track.children);
      group1 = document.createElement('div');
      group1.className = 'reel-group';
      items.forEach(el => group1.appendChild(el));
      track.appendChild(group1);
      group2 = group1.cloneNode(true);
      track.appendChild(group2);
    }

    // ---- Inline-flex layout + razmiki ----
    [track, group1, group2].forEach(el => {
      el.style.display = 'inline-flex';
      el.style.gap = 'var(--gap)';
    });

    // ---- Hitrost iz data-* (duration v sekundah, hover-speed kot faktor) ----
    const dur = parseFloat(viewport.dataset.duration || '28');              // npr. 28
    const hoverFactor = parseFloat(viewport.dataset.hoverSpeed || '0.5');   // 0.5 = 2× hitreje
    track.style.setProperty('--duration', isFinite(dur) ? dur : 28);
    track.style.setProperty('--hover-factor', (isFinite(hoverFactor) ? hoverFactor : 0.5));

    // ---- Helperji za pause/resume animacije ----
    const pauseAnim  = () => (track.style.animationPlayState = 'paused');
    const resumeAnim = () => (track.style.animationPlayState = 'running');

    // ---- Device capability: drag samo za natančen kazalec (miška/trackpad) ----
    const isFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

    // ---- Drag podpora (samo desktop/fine pointer) ----
    if (isFinePointer) {
      let isDown = false, startX = 0, startOffset = 0, dragMoved = false;

      const getMatrixX = () => {
        const m = getComputedStyle(track).transform;
        if (m === 'none') return 0;
        const val = parseFloat(m.split(',')[4]);
        return isNaN(val) ? 0 : val;
        // matrix(a,b,c,d, tx, ty) -> tx is at index 4
      };

      viewport.addEventListener('pointerdown', (e) => {
        isDown = true;
        dragMoved = false;
        startX = e.clientX;
        startOffset = getMatrixX();
        pauseAnim();
        viewport.setPointerCapture?.(e.pointerId);
      });

      viewport.addEventListener('pointermove', (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 2) dragMoved = true;
        track.style.transform = `translate3d(${startOffset + dx}px,0,0)`;
      });

      function release() {
        if (!isDown) return;
        isDown = false;
        // Počisti inline transform, naj CSS animacija prevzame
        track.style.removeProperty('transform');
        void track.offsetHeight; // reflow
        resumeAnim();
      }

      viewport.addEventListener('pointerup', release);
      viewport.addEventListener('pointercancel', release);

      // Prepreči "click" po dragu (klasičen ghost click)
      viewport.addEventListener('click', (e) => {
        if (dragMoved) {
          e.preventDefault();
          e.stopPropagation();
        }
        // vedno očisti inline transform in nadaljuj animacijo
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
    } else {
      // TOUCH DEVICES: nikoli ne pavziraj na tap, vedno teci
      track.style.animationPlayState = 'running';
      // Odstrani morebitne inline transf., če so ostali od prejšnjih poskusov
      track.style.removeProperty('transform');
    }

    // ---- Varčevanje baterije: pavza, ko je tab skrit (vseh naprav) ----
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pauseAnim();
      else resumeAnim();
    });

    // ---- Spoštuj "reduced motion" ----
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.style.animation = 'none';
    }

    // Mark as inited
    track.dataset.inited = '1';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReelHybrid);
  } else {
    initReelHybrid();
  }
})();
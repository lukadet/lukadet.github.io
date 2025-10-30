// Mobilni meni
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Smooth scroll function
function smoothScroll(targetId) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Update URL without refreshing
        if (history.pushState) {
            history.pushState(null, null, targetId);
        } else {
            window.location.hash = targetId;
        }
    }
}

// Apply smooth scroll to all navigation links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        
        e.preventDefault();
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
        
        smoothScroll(targetId);
    });
});

// Apply smooth scroll to buttons with data-scroll attribute
document.querySelectorAll('[data-scroll]').forEach(button => {
    button.addEventListener('click', (e) => {
        const targetId = button.getAttribute('data-scroll');
        if (targetId === '#') return;
        
        e.preventDefault();
        smoothScroll(targetId);
    });
});

// Scroll efekti za header
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});

// Animacije ob scrollu
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .team-member');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.classList.add('animate');
        }
    });
};

// Pokličemo funkcijo takoj, da animiramo elemente, ki so že vidni
animateOnScroll();

// In še ob vsakem scrollu
window.addEventListener('scroll', animateOnScroll);

// Obdelava obrazca za kontakt
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Hvala za vaše sporočilo! Kmalu vas bomo kontaktirali.');
        contactForm.reset();
    });
}

// Obdelava obrazca za naročanje na novice
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Hvala za naročilo na naše novice!');
        newsletterForm.reset();
    });
}

// Animate stats counter
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const count = parseInt(stat.innerText);
        const increment = target / speed;
        
        if(count < target) {
            stat.innerText = Math.ceil(count + increment);
            setTimeout(animateStats, 1);
        } else {
            stat.innerText = target;
        }
    });
}

// Trigger animation when section is in view
const aboutUsSection = document.querySelector('.about-us');
if (aboutUsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, {threshold: 0.5});

    observer.observe(aboutUsSection);
}

// Handle initial hash in URL (if someone shares a deep link)
window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
        setTimeout(() => {
            smoothScroll(window.location.hash);
        }, 100);
    }
});

// ===== Reels galerija: robustna različica za strežnik =====
(function () {
  function init() {
    try {
      const viewport = document.querySelector('.reel-viewport');
      const track = document.getElementById('reelTrack');
      if (!viewport || !track) {
        console.warn('[Reels] Missing .reel-viewport or #reelTrack');
        return;
      }

      const BASE_SPEED  = parseFloat(viewport.dataset.speed || '0.35'); // px/frame
      const HOVER_SPEED = parseFloat(viewport.dataset.hoverSpeed || '0.85');
      const MULTIPLIER  = 2.4;   // širina traku >= 2.4x viewport
      const MAX_CLONES  = 120;   // kapica proti runaway kloniranju

      let speed = BASE_SPEED;
      let raf = null;
      let running = false;
      let x = 0;

      const baseChildren = [...track.children].map(n => n.cloneNode(true));
      if (baseChildren.length === 0) {
        console.warn('[Reels] No children inside #reelTrack');
      }

      function getGapPx() {
        const cs = getComputedStyle(track);
        const g = cs.gap || cs.columnGap || '0px';
        const v = parseFloat(g);
        return Number.isFinite(v) ? v : 0;
      }

      function firstRowWidth() {
        const kids = [...track.children].slice(0, baseChildren.length);
        const gap = getGapPx();
        let sum = 0;
        kids.forEach((li, i) => {
          sum += li.clientWidth;
          if (i < kids.length - 1) sum += gap;
        });
        // fallback, če širine še niso izmerjene
        return sum || track.scrollWidth || viewport.clientWidth || 1;
      }

      function resetToBase() {
        track.innerHTML = '';
        baseChildren.forEach(n => track.appendChild(n.cloneNode(true)));
        x = 0;
        track.style.transform = 'translate3d(0,0,0)';
      }

      function fillLoop() {
        resetToBase();
        const vpW = viewport.clientWidth || 1;
        let clones = 0;
        while (track.scrollWidth < vpW * MULTIPLIER && clones < MAX_CLONES) {
          for (const n of baseChildren) {
            if (clones >= MAX_CLONES) break;
            track.appendChild(n.cloneNode(true));
            clones++;
          }
        }
      }

      function normalizeX(val, rowW) {
        if (!rowW) return val;
        while (val > 0) val -= rowW;
        while (-val >= rowW) val += rowW;
        return val;
      }

      function tick() {
        const rowW = firstRowWidth();
        x -= speed;
        x = normalizeX(x, rowW);
        track.style.transform = `translate3d(${x}px,0,0)`;
        raf = requestAnimationFrame(tick);
      }

      function play() { if (running) return; running = true; raf = requestAnimationFrame(tick); }
      function pause() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

      // Hover pospešek
      viewport.addEventListener('mouseenter', () => { speed = HOVER_SPEED; });
      viewport.addEventListener('mouseleave', () => { speed = BASE_SPEED; });

      // Drag + inercija
      let isDown = false, startX = 0, startPos = 0, lastDX = 0;

      const onPointerDown = (e) => {
        isDown = true;
        viewport.setPointerCapture?.(e.pointerId || 1);
        pause();
        startX = e.clientX;
        startPos = x;
        lastDX = 0;
      };

      const onPointerMove = (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        const rowW = firstRowWidth();
        x = normalizeX(startPos + dx, rowW);
        lastDX = dx;
        track.style.transform = `translate3d(${x}px,0,0)`;
      };

      const onPointerUp = () => {
        if (!isDown) return;
        isDown = false;
        let vx = lastDX / 8, decay = 0.92;
        (function glide(){
          if (Math.abs(vx) < 0.2) { play(); return; }
          const rowW = firstRowWidth();
          x = normalizeX(x + vx, rowW);
          vx *= decay;
          track.style.transform = `translate3d(${x}px,0,0)`;
          requestAnimationFrame(glide);
        })();
      };

      viewport.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);

      // Zaženi samo, ko je viden; če IO ni na voljo, zaženi takoj
      let io = null;
      function startOrObserve() {
        if ('IntersectionObserver' in window) {
          io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) play(); else pause();
            });
          }, { root: null, threshold: 0.1 });
          io.observe(viewport);
        } else {
          // starejši brskalniki: zaženi takoj
          play();
        }
      }

      // Debounce resize
      let rto;
      window.addEventListener('resize', () => {
        clearTimeout(rto);
        rto = setTimeout(() => { fillLoop(); }, 150);
      });

      function whenImagesReady() {
        const imgs = track.querySelectorAll('img');
        let done = 0, total = imgs.length;
        if (total === 0) return Promise.resolve();
        return new Promise(res => {
          imgs.forEach(img => {
            if (img.complete) { done++; if (done === total) res(); }
            else {
              img.addEventListener('load',  () => { done++; if (done === total) res(); }, { once: true });
              img.addEventListener('error', () => { done++; if (done === total) res(); }, { once: true });
            }
          });
        });
      }

      (async function start() {
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
          // spoštuj uporabnikovo nastavitev; vseeno napolnimo DOM, a ne animiramo
          speed = 0; pause();
        }
        await whenImagesReady();
        fillLoop();
        startOrObserve();
      })();

      console.debug('[Reels] initialized');
    } catch (err) {
      console.error('[Reels] init error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
// Mobilni meni
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Skrivanje menija po kliku na povezavo (za mobilne naprave)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
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
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Hvala za vaše sporočilo! Kmalu vas bomo kontaktirali.');
    contactForm.reset();
});

// Obdelava obrazca za naročanje na novice
const newsletterForm = document.getElementById('newsletterForm');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Hvala za naročilo na naše novice!');
    newsletterForm.reset();
});
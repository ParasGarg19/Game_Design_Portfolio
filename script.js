/* ============================
   PARAS GARG PORTFOLIO · JS
   ============================ */

// ── Custom Cursor ────────────────────────
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth trail
function updateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(updateTrail);
}
updateTrail();

// Scale cursor on hover
document.querySelectorAll('a, button, .project-card, .contact-card, .skill-category').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cursorTrail.style.transform = 'translate(-50%,-50%) scale(1.4)';
    cursorTrail.style.borderColor = 'rgba(124,58,237,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorTrail.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorTrail.style.borderColor = 'rgba(124,58,237,0.5)';
  });
});

// ── Navbar Scroll ────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger Menu ───────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Typewriter ───────────────────────────
const phrases = [
  'Game Designer',
  'Level Designer',
  'Playtesting & QA',
  'Game Systems Thinker'
];
let phraseIndex = 0, charIndex = 0, deleting = false;
const typewriter = document.getElementById('typewriter');

function type() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    typewriter.textContent = current.substring(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
    setTimeout(type, 80);
  } else {
    typewriter.textContent = current.substring(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }
    setTimeout(type, 40);
  }
}
type();

// ── Particles ────────────────────────────
const particlesContainer = document.getElementById('particles');
const PARTICLE_COUNT = 40;

function createParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 3 + 1;
  p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${Math.random() * 100}%;
    animation-duration: ${6 + Math.random() * 10}s;
    animation-delay: ${Math.random() * 8}s;
    background: ${Math.random() > 0.5 ? '#7c3aed' : '#06b6d4'};
  `;
  particlesContainer.appendChild(p);
}
for (let i = 0; i < PARTICLE_COUNT; i++) createParticle();

// ── Animated Counters ────────────────────
function animateCounter(el, target, duration = 1800) {
  const isDecimal = target % 1 !== 0;
  const start     = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const val      = ease * target;
    el.textContent  = isDecimal ? val.toFixed(2) : Math.floor(val);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isDecimal ? target.toFixed(2) : target;
  }
  requestAnimationFrame(step);
}

// ── Intersection Observer ─────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;

    // Reveal cards
    if (el.classList.contains('reveal')) {
      el.classList.add('visible');
    }

    // Stat counters (hero section)
    if (el.classList.contains('hero-stats')) {
      el.querySelectorAll('.stat-number').forEach(stat => {
        const target = parseFloat(stat.dataset.target);
        animateCounter(stat, target);
      });
    }

    // Skill bars
    if (el.classList.contains('skill-category')) {
      el.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }

    io.unobserve(el);
  });
}, { threshold: 0.18 });

// Observe reveal elements
document.querySelectorAll('.reveal, .hero-stats, .skill-category').forEach(el => io.observe(el));

// ── Active Nav Link on Scroll ─────────────
const sections  = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-item');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-item[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

// ── Tilt effect on project cards ──────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = (e.clientX - rect.left) / rect.width  - 0.5;
    const y      = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-5px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 250ms cubic-bezier(.4,0,.2,1)';
  });
});

// ── Smooth nav click ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Glitch hover effect on hero name ─────
document.querySelectorAll('.name-line').forEach(el => {
  el.addEventListener('mouseenter', function() {
    this.style.animation = 'none';
    void this.offsetWidth;
    this.style.animation = 'glitch 0.4s steps(2) forwards';
  });
});

// Inject glitch keyframes
const glitchStyles = document.createElement('style');
glitchStyles.textContent = `
  @keyframes glitch {
    0%  { text-shadow: 2px 0 #7c3aed, -2px 0 #06b6d4; }
    25% { text-shadow: -2px 0 #7c3aed, 2px 0 #06b6d4; }
    50% { text-shadow: 2px 2px #7c3aed, -2px -2px #06b6d4; }
    75% { text-shadow: 0 0 0 transparent; }
    100%{ text-shadow: none; }
  }
  .nav-item.active { color: #fff; }
  .nav-item.active::after { transform: scaleX(1); }
`;
document.head.appendChild(glitchStyles);

console.log('%cParas Garg Portfolio', 'color:#7c3aed;font-size:2em;font-weight:bold;');
console.log('%cGame Designer · Level Designer · 2025', 'color:#06b6d4;font-size:1em;');

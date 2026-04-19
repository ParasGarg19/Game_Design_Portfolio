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

// ── Project Tabs ──────────────────────────
document.querySelectorAll('.proj-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    // Update active tab button
    document.querySelectorAll('.proj-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Update active panel
    document.querySelectorAll('.proj-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(`panel-${target}`);
    if (panel) {
      panel.classList.add('active');

      // Re-observe reveal elements that just became visible
      panel.querySelectorAll('.reveal:not(.visible)').forEach(el => io.observe(el));
    }
  });
});




// ══════════════════════════════════════════════
//  SPACE CANVAS  — deep background animation
// ══════════════════════════════════════════════
(function () {
  const cvs = document.getElementById('spaceCanvas');
  const cx  = cvs.getContext('2d');
  let CW = 0, CH = 0;

  function resize() {
    CW = cvs.width  = window.innerWidth;
    CH = cvs.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Star palettes ────────────────────────────
  const PALETTES = [
    [255, 255, 255],   // white
    [196, 181, 253],   // lavender
    [147, 197, 253],   // sky-blue
    [167, 139, 250],   // violet
    [110, 231, 183],   // mint (rare)
  ];

  const starField = Array.from({ length: 420 }, () => {
    const pal = PALETTES[Math.floor(Math.pow(Math.random(), 2.2) * PALETTES.length)];
    const sz  = Math.pow(Math.random(), 3) * 2.4 + 0.15;
    return {
      rx: Math.random(),
      ry: Math.random(),
      sz,
      glow: sz > 1.4,
      baseOp: Math.random() * 0.6 + 0.3,
      twSpeed: Math.random() * 0.55 + 0.1,
      twPhase: Math.random() * Math.PI * 2,
      r: pal[0], g: pal[1], b: pal[2],
    };
  });

  // ── Nebulae ─────────────────────────────────
  const nebulae = [
    { rx: 0.10, ry: 0.15, rad: 300, r: 124, g:  58, b: 237, a: 0.055 },
    { rx: 0.80, ry: 0.50, rad: 360, r:   6, g: 182, b: 212, a: 0.045 },
    { rx: 0.48, ry: 0.80, rad: 260, r: 124, g:  58, b: 237, a: 0.038 },
    { rx: 0.90, ry: 0.10, rad: 200, r:  16, g: 185, b: 129, a: 0.030 },
    { rx: 0.30, ry: 0.55, rad: 220, r:   6, g: 182, b: 212, a: 0.022 },
  ];

  // ── Shooting stars ───────────────────────────
  const shooters = [];
  let nextShoot = 3500 + Math.random() * 4000;
  let lastShoot = 0;

  function spawnShooter() {
    const angle = 0.18 + Math.random() * 0.22;
    const speed = 7 + Math.random() * 7;
    shooters.push({
      x:    Math.random() * CW * 0.8,
      y:    Math.random() * CH * 0.38,
      vx:   Math.cos(angle) * speed,
      vy:   Math.sin(angle) * speed,
      len:  90 + Math.random() * 110,
      op:   1,
      fade: 0.016 + Math.random() * 0.012,
    });
  }

  // ── Mouse parallax ───────────────────────────
  let mx = 0, my = 0;
  document.addEventListener('mousemove', function(e) {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Main draw loop ───────────────────────────
  function drawSpace(now) {
    requestAnimationFrame(drawSpace);
    var t = now * 0.001;

    cx.clearRect(0, 0, CW, CH);

    // Deep space radial gradient
    var bgGrad = cx.createRadialGradient(
      CW * 0.5, CH * 0.25, 0,
      CW * 0.5, CH * 0.55, CW * 0.90
    );
    bgGrad.addColorStop(0.00, '#0f0626');
    bgGrad.addColorStop(0.35, '#070710');
    bgGrad.addColorStop(0.75, '#040408');
    bgGrad.addColorStop(1.00, '#020205');
    cx.fillStyle = bgGrad;
    cx.fillRect(0, 0, CW, CH);

    // Nebulae glow patches
    for (var ni = 0; ni < nebulae.length; ni++) {
      var n  = nebulae[ni];
      var nx = n.rx * CW, ny = n.ry * CH;
      var ng = cx.createRadialGradient(nx, ny, 0, nx, ny, n.rad);
      ng.addColorStop(0.0, 'rgba(' + n.r + ',' + n.g + ',' + n.b + ',' + n.a + ')');
      ng.addColorStop(0.5, 'rgba(' + n.r + ',' + n.g + ',' + n.b + ',' + (n.a * 0.35) + ')');
      ng.addColorStop(1.0, 'rgba(0,0,0,0)');
      cx.fillStyle = ng;
      cx.fillRect(0, 0, CW, CH);
    }

    // Stars (depth-based mouse parallax + twinkling)
    for (var si = 0; si < starField.length; si++) {
      var s     = starField[si];
      var depth = s.sz / 2.6;
      var px    = s.rx * CW + mx * depth * 14;
      var py    = s.ry * CH + my * depth * 9;
      var tw    = 0.5 + 0.5 * Math.sin(t * s.twSpeed * Math.PI * 2 + s.twPhase);
      var op    = s.baseOp * (0.38 + 0.62 * tw);

      if (s.glow) {
        cx.shadowBlur  = 8;
        cx.shadowColor = 'rgba(' + s.r + ',' + s.g + ',' + s.b + ',0.95)';
      }
      cx.globalAlpha = op;
      cx.fillStyle   = 'rgb(' + s.r + ',' + s.g + ',' + s.b + ')';
      cx.beginPath();
      cx.arc(px, py, s.sz, 0, Math.PI * 2);
      cx.fill();
      if (s.glow) { cx.shadowBlur = 0; }
    }
    cx.globalAlpha = 1;

    // Shooting stars
    if (now - lastShoot > nextShoot) {
      spawnShooter();
      lastShoot = now;
      nextShoot = 4500 + Math.random() * 5500;
    }

    for (var i = shooters.length - 1; i >= 0; i--) {
      var sh = shooters[i];
      var hl = Math.hypot(sh.vx, sh.vy);
      var tx = sh.x - sh.vx * (sh.len / hl);
      var ty = sh.y - sh.vy * (sh.len / hl);

      // Gradient tail
      var tGrad = cx.createLinearGradient(tx, ty, sh.x, sh.y);
      tGrad.addColorStop(0.0, 'rgba(0,0,0,0)');
      tGrad.addColorStop(0.6, 'rgba(200,185,255,' + (sh.op * 0.45) + ')');
      tGrad.addColorStop(1.0, 'rgba(255,255,255,' + sh.op + ')');
      cx.strokeStyle = tGrad;
      cx.lineWidth   = 1.8;
      cx.beginPath();
      cx.moveTo(tx, ty);
      cx.lineTo(sh.x, sh.y);
      cx.stroke();

      // Glowing head
      var hGrad = cx.createRadialGradient(sh.x, sh.y, 0, sh.x, sh.y, 5);
      hGrad.addColorStop(0, 'rgba(255,255,255,' + sh.op + ')');
      hGrad.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = hGrad;
      cx.beginPath();
      cx.arc(sh.x, sh.y, 5, 0, Math.PI * 2);
      cx.fill();

      sh.x  += sh.vx;
      sh.y  += sh.vy;
      sh.op -= sh.fade;
      if (sh.op <= 0 || sh.x > CW + 160) { shooters.splice(i, 1); }
    }
  }

  requestAnimationFrame(drawSpace);
})();

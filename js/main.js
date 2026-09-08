/* ============================================================
   main.js — Portfolio Interactivity
   ============================================================ */

/* ─── Preloader ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const fill = document.querySelector('.loader-bar-fill');
  // Animate bar to 100%
  setTimeout(() => { fill.style.width = '100%'; }, 100);
  setTimeout(() => { preloader.classList.add('done'); }, 1800);
});

/* ─── Custom Cursor ─────────────────────────────────────────── */
const dot     = document.getElementById('cursor-dot');
const outline = document.getElementById('cursor-outline');

let dotX = 0, dotY = 0;
let outX = 0, outY = 0;

document.addEventListener('mousemove', (e) => {
  dotX = e.clientX; dotY = e.clientY;
  dot.style.left = dotX + 'px';
  dot.style.top  = dotY + 'px';
});

// Smoothly follow for outline
function animateCursor() {
  outX += (dotX - outX) * 0.12;
  outY += (dotY - outY) * 0.12;
  outline.style.left = outX + 'px';
  outline.style.top  = outY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect on interactive elements
document.querySelectorAll('a, button, .project-card, .filter-tab, .cta-social-btn').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ─── Navbar scroll effect ──────────────────────────────────── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Glassmorphism on scroll
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  // Back to top button
  document.getElementById('back-top').classList.toggle('visible', window.scrollY > 400);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

/* ─── Mobile menu ───────────────────────────────────────────── */
const menuToggle = document.getElementById('menu-toggle');
const mobileNav  = document.getElementById('mobile-nav');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

// Close on link click
document.querySelectorAll('#mobile-nav a').forEach(a => {
  a.addEventListener('click', () => {
    menuToggle.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});

/* ─── Theme Toggle ──────────────────────────────────────────── */
const themeBtn = document.getElementById('theme-toggle');
let isDark = true;

const saved = localStorage.getItem('theme');
if (saved === 'light') { document.body.classList.add('light-mode'); isDark = false; updateThemeIcon(); }

themeBtn.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('light-mode', !isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
});

function updateThemeIcon() {
  themeBtn.innerHTML = isDark ? '🌙' : '☀️';
}
updateThemeIcon();

/* ─── Typed Text Effect ─────────────────────────────────────── */
// Edit the 'roles' array to change your job titles
const roles = [
  'Full-Stack Developer',
  'UI/UX Enthusiast',
  'Problem Solver',
  'Open Source Contributor',
];

let rIdx = 0, cIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const current = roles[rIdx];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, cIdx - 1);
    cIdx--;
  } else {
    typedEl.textContent = current.substring(0, cIdx + 1);
    cIdx++;
  }
  if (!isDeleting && cIdx === current.length) {
    setTimeout(() => { isDeleting = true; type(); }, 1800);
    return;
  }
  if (isDeleting && cIdx === 0) {
    isDeleting = false;
    rIdx = (rIdx + 1) % roles.length;
  }
  setTimeout(type, isDeleting ? 60 : 100);
}
type();

/* ─── Scroll-triggered animations ──────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Animate skill bars when visible
      if (e.target.dataset.pct) {
        e.target.style.width = e.target.dataset.pct + '%';
      }
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up, .fade-left, .fade-right, .skill-bar').forEach(el => {
  observer.observe(el);
});

/* ─── Counter animation (About stats) ───────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const step = target / (duration / 16);
  let count = 0;
  const timer = setInterval(() => {
    count += step;
    if (count >= target) { count = target; clearInterval(timer); }
    el.textContent = Math.floor(count) + suffix;
  }, 16);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.animated) {
      e.target.dataset.animated = 'true';
      animateCounter(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.fun-fact-num').forEach(el => counterObs.observe(el));

/* ─── Project Filter ────────────────────────────────────────── */
const filterTabs = document.querySelectorAll('.filter-tab');
const projectCards = document.querySelectorAll('.project-card');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = '';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ─── Project Modal ─────────────────────────────────────────── */
const modalOverlay = document.getElementById('modal-overlay');
const modalClose   = document.querySelector('.modal-close');

// Open modal with card data
document.querySelectorAll('.project-card').forEach(card => {
  card.querySelector('.overlay-btn.view')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal(card.dataset);
  });
});

function openModal(data) {
  document.querySelector('.modal-img img').src = data.img || '';
  document.querySelector('.modal-category').textContent = data.category || '';
  document.querySelector('.modal-title').textContent = data.title || '';
  document.querySelector('.modal-desc').textContent = data.longDesc || data.desc || '';
  // Features
  const featuresList = document.querySelector('.modal-features ul');
  featuresList.innerHTML = '';
  if (data.features) {
    data.features.split('|').forEach(f => {
      const li = document.createElement('li');
      li.textContent = f.trim();
      featuresList.appendChild(li);
    });
  }
  // Stack tags
  const stackEl = document.querySelector('.modal-stack');
  stackEl.innerHTML = '';
  if (data.stack) {
    data.stack.split(',').forEach(s => {
      const span = document.createElement('span');
      span.className = 'stack-tag';
      span.textContent = s.trim();
      stackEl.appendChild(span);
    });
  }
  // Links
  const liveBtn  = document.getElementById('modal-live');
  const githubBtn = document.getElementById('modal-github');
  if (liveBtn)   { liveBtn.href   = data.live   || '#'; }
  if (githubBtn) { githubBtn.href = data.github || '#'; }

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose?.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ─── Back to Top ───────────────────────────────────────────── */
document.getElementById('back-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── Smooth scroll for nav links ───────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

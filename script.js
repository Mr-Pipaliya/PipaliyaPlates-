/* =====================================================
   PipaliyaPlates — Enhanced script.js
   Toast notifications, Cart badge, Mobile menu,
   Scroll reveal, Navbar scroll effect
   ===================================================== */

// ── TOAST NOTIFICATIONS ────────────────────────────────
function showToast(msg, type = 'success', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: '🍕', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || '✅'}</span>
    <span class="toast-msg">${msg}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

// ── CART FUNCTIONS ─────────────────────────────────────
function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  showToast(`${name} added to cart! 🛒`, 'info');
}

function updateCartBadge() {
  const cart  = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((a, i) => a + i.quantity, 0);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    badge.textContent = total;
    if (total > 0) badge.classList.add('show');
    else           badge.classList.remove('show');
  });
}

// ── NAVBAR SCROLL EFFECT ────────────────────────────────
function initNavbarScroll() {
  const header = document.querySelector('.main-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else                     header.classList.remove('scrolled');
  });
}

// ── MOBILE MENU ─────────────────────────────────────────
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── SCROLL REVEAL ────────────────────────────────────────
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

// ── CATEGORY PAGE NAVIGATION ─────────────────────────────
const categoryPages = [
  'gujarati.html', 'punjabi.html', 'chinese.html', 'italian.html',
  'korean.html',   'southindian.html', 'mexican.html', 'french.html'
];

function goBack() {
  const i = categoryPages.indexOf(window.location.pathname.split('/').pop());
  if (i > 0) window.location.href = categoryPages[i - 1];
  else showToast('This is the first category.', 'info');
}

function goForward() {
  const i = categoryPages.indexOf(window.location.pathname.split('/').pop());
  if (i < categoryPages.length - 1) window.location.href = categoryPages[i + 1];
  else showToast('This is the last category.', 'info');
}

// ── ANIMATED COUNTER ─────────────────────────────────────
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

// ── INIT ON DOM READY ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initNavbarScroll();
  initMobileMenu();
  initScrollReveal();
  initCounters();
});

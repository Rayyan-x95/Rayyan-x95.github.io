// animations.js - reveal, counters, blob parallax, icon hover
export function initReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  const revealSelectors = '[data-animate], .reveal-fade-up, .reveal-stagger';
  const targets = document.querySelectorAll(revealSelectors);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      if (entry.isIntersecting) {
        const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        el.style.transition = 'transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 600ms cubic-bezier(0.2, 0.8, 0.2, 1)';
        el.style.willChange = 'transform, opacity';
        setTimeout(() => el.classList.add('is-in'), delay);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach((t) => {
    t.classList.remove('is-in');
    t.style.opacity = '0.01';
    t.style.transform = 'translateY(12px)';
    io.observe(t);
  });
}

export function initCounters() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  const counters = document.querySelectorAll('[data-count]');
  const duration = 1200;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const startTime = new WeakMap();
  const stepCounter = (ts, el, target) => {
    if (!startTime.has(el)) startTime.set(el, ts);
    const elapsed = ts - startTime.get(el);
    const p = Math.min(1, elapsed / duration);
    const val = Math.floor(easeOut(p) * target);
    el.textContent = val.toLocaleString();
    if (p < 1) requestAnimationFrame((n) => stepCounter(n, el, target));
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count') || '0', 10);
      requestAnimationFrame((ts) => stepCounter(ts, el, target));
      io.unobserve(el);
    });
  }, { threshold: 0.3 });
  counters.forEach((c) => io.observe(c));
}

export function initBlobParallax() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  const blobs = document.querySelectorAll('.blob');
  if (!blobs.length) return;
  let ticking = false;
  const parallax = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    blobs.forEach((blob, i) => {
      const amt = (i + 1) * 0.03;
      blob.style.transform = `translate3d(0, ${y * amt}px, 0)`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(parallax);
    }
  }, { passive: true });
}

export function initIconEffects() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  const iconButtons = document.querySelectorAll('.btn-v9 .btn-icon, .project-btn .fa, .social-card .fab, .social-card .fas');
  iconButtons.forEach((icon) => {
    const parent = icon.closest('a, button');
    if (!parent) return;
    parent.addEventListener('mouseenter', () => {
      icon.style.transition = 'transform 300ms ease, filter 300ms ease';
      icon.style.transform = 'translateX(2px)';
      icon.style.filter = 'drop-shadow(0 2px 4px rgba(99,102,241,0.35))';
    });
    parent.addEventListener('mouseleave', () => {
      icon.style.transform = 'translateX(0)';
      icon.style.filter = 'none';
    });
    parent.addEventListener('focus', () => { icon.style.transform = 'translateX(2px)'; });
    parent.addEventListener('blur', () => { icon.style.transform = 'translateX(0)'; });
  });
}

// modal.js - accessible modal controls
export function initModal() {
  const modal = document.querySelector('#contact-modal');
  if (!modal) return;
  const openers = document.querySelectorAll('.modal-trigger[href="#contact-modal"], .modal-trigger[data-target="contact-modal"]');
  const closeButtons = modal.querySelectorAll('.modal-close');

  const focusable = () => Array.from(modal.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));

  const open = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    const els = focusable();
    if (els.length) els[0].focus();
    document.addEventListener('keydown', onKeyDown);
  };

  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKeyDown);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') {
      const els = focusable();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  openers.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  closeButtons.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); close(); }));
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
}

/* DODDY — shared script
   Progress bar, smooth anchor scroll, lazy image loading, external link tagging */

(function () {
  'use strict';

  // --- Reading progress bar ---
  const progress = document.querySelector('.progress');
  if (progress) {
    const update = () => {
      const doc = document.documentElement;
      const scrollTop = window.pageYOffset || doc.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      progress.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  // --- Smooth scroll for on-page anchors ---
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // --- Lazy-load images (native + IntersectionObserver fallback) ---
  const imgs = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window && imgs.length) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
        observer.unobserve(img);
      });
    }, { rootMargin: '200px 0px' });
    imgs.forEach((img) => io.observe(img));
  } else {
    imgs.forEach((img) => {
      if (img.dataset.src) img.src = img.dataset.src;
    });
  }

  // --- Auto-tag external links with rel attrs (except smelloff.in which keeps its UTM intact) ---
  document.querySelectorAll('a[href^="http"]').forEach((a) => {
    const href = a.getAttribute('href');
    if (href.includes('doddy.in') || href.includes('smelloff.in')) return;
    if (!a.rel) a.rel = 'noopener noreferrer';
    if (!a.target) a.target = '_blank';
  });

  // --- CTA click tracking hook (for future GA4) ---
  document.querySelectorAll('[data-cta]').forEach((el) => {
    el.addEventListener('click', () => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'cta_click', {
          cta_id: el.dataset.cta,
          page_path: location.pathname,
        });
      }
    });
  });
})();

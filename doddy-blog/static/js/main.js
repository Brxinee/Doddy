(function () {
  'use strict';

  // ── Theme ──────────────────────────────────────────────────────────────────
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle && themeToggle.querySelector('.theme-icon');

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☾' : '☀';
  }

  const savedTheme = localStorage.getItem('doddy-theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('doddy-theme', next);
    });
  }

  // ── Reading Progress ───────────────────────────────────────────────────────
  const progressBar = document.getElementById('progress-bar');

  function updateProgress() {
    if (!progressBar) return;
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    progressBar.style.setProperty('--scroll-progress', pct.toFixed(1) + '%');
    progressBar.style.width = pct.toFixed(1) + '%';
  }

  // ── Back to Top ────────────────────────────────────────────────────────────
  const backToTop = document.getElementById('back-to-top');

  function handleScroll() {
    updateProgress();
    if (backToTop) {
      if (window.scrollY > 800) {
        backToTop.removeAttribute('hidden');
      } else {
        backToTop.setAttribute('hidden', '');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Copy Link ──────────────────────────────────────────────────────────────
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = 'Link copied!';
    document.body.appendChild(toast);
  }

  function showToast() {
    toast.classList.add('visible');
    setTimeout(function () { toast.classList.remove('visible'); }, 2000);
  }

  document.querySelectorAll('.share-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(window.location.href).then(showToast).catch(function () {
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast();
      });
    });
  });

  // ── Sticky TOC ─────────────────────────────────────────────────────────────
  const tocLinks = document.querySelectorAll('.toc-link');
  const postHeadings = document.querySelectorAll('.post-body h2[id]');

  if (tocLinks.length && postHeadings.length && 'IntersectionObserver' in window) {
    let activeId = null;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          activeId = entry.target.id;
          tocLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
          });
        }
      });
    }, { rootMargin: '-20% 0% -70% 0%' });

    postHeadings.forEach(function (h) { observer.observe(h); });
  }

  // ── Search Overlay ─────────────────────────────────────────────────────────
  const searchTrigger = document.getElementById('search-trigger');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');
  const searchClose = document.getElementById('search-close');

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.removeAttribute('hidden');
    if (searchInput) searchInput.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.setAttribute('hidden', '');
    if (searchInput) searchInput.value = '';
    document.body.style.overflow = '';
    const results = document.getElementById('search-results');
    if (results) results.innerHTML = '';
  }

  if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);

  if (searchOverlay) {
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) closeSearch();
    });
  }

  // ── Keyboard Shortcuts ─────────────────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSearch();
      return;
    }
    const tag = document.activeElement && document.activeElement.tagName;
    if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
      e.preventDefault();
      openSearch();
    }
  });

  // ── Active Nav Link ────────────────────────────────────────────────────────
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname;
  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && currentPath === href) link.classList.add('active');
  });

})();

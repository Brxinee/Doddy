(function () {
  'use strict';

  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const icon = toggle && toggle.querySelector('.theme-icon');

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (icon) icon.textContent = theme === 'dark' ? '☀' : '◐';
  }

  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(localStorage.getItem('doddy-theme') || preferred);

  if (toggle) {
    toggle.addEventListener('click', function () {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('doddy-theme', next);
    });
  }

  const progressBar = document.getElementById('progress-bar');
  function updateProgress() {
    if (!progressBar) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    progressBar.style.width = pct.toFixed(2) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(function (link) {
    if (link.getAttribute('href') === currentPath) link.classList.add('active');
  });

  const postBody = document.querySelector('.post-body');
  document.querySelectorAll('.js-read-time').forEach(function (el) {
    const target = el.dataset.target ? document.querySelector(el.dataset.target) : postBody;
    if (!target) return;
    const words = target.textContent.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    el.textContent = minutes + ' min read';
  });

  document.querySelectorAll('img').forEach(function (img) {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
  });

  document.querySelectorAll('.share-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(window.location.href).then(function () {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = '⧉'; }, 1200);
      });
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in-view'); });
  }
})();

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', menu.classList.contains('open'));
    });
  }

  // Share buttons
  document.querySelectorAll('.share-btn[data-share]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.share;
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        whatsapp: `https://wa.me/?text=${title}%20${url}`,
        copy: null
      };
      if (type === 'copy') {
        navigator.clipboard.writeText(window.location.href).then(() => {
          const original = btn.textContent;
          btn.textContent = 'Copied ✓';
          setTimeout(() => btn.textContent = original, 1500);
        });
      } else if (shareUrls[type]) {
        window.open(shareUrls[type], '_blank', 'noopener,width=600,height=500');
      }
    });
  });

  // Newsletter (placeholder — wire to your backend or Formspree later)
  const newsletter = document.querySelector('.newsletter-widget form');
  if (newsletter) {
    newsletter.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletter.querySelector('input');
      const btn = newsletter.querySelector('button');
      if (!input.value || !input.value.includes('@')) {
        input.focus();
        return;
      }
      btn.textContent = 'Subscribed ✓';
      input.value = '';
      setTimeout(() => btn.textContent = 'Subscribe', 2000);
    });
  }
});

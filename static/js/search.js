(function () {
  'use strict';

  const searchInput = document.getElementById('blog-search');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.archive-card');
  const emptyState = document.getElementById('listing-empty');

  if (!searchInput || !cards.length) return;

  let activeFilter = 'all';

  function normalize(text) {
    return (text || '').toLowerCase().trim();
  }

  function applyFilters() {
    const query = normalize(searchInput.value);
    let visibleCount = 0;

    cards.forEach(function (card) {
      const category = normalize(card.dataset.category);
      const haystack = normalize(card.dataset.search);
      const matchCategory = activeFilter === 'all' || category === activeFilter;
      const matchQuery = !query || haystack.includes(query);
      const show = matchCategory && matchQuery;
      card.hidden = !show;
      if (show) visibleCount += 1;
    });

    if (emptyState) emptyState.hidden = visibleCount !== 0;
  }

  searchInput.addEventListener('input', applyFilters);

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeFilter = normalize(btn.dataset.filter || 'all');
      filterButtons.forEach(function (button) { button.classList.remove('active'); });
      btn.classList.add('active');
      applyFilters();
    });
  });

  applyFilters();
})();

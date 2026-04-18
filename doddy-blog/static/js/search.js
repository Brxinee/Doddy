(function () {
  'use strict';

  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  if (!searchInput || !searchResults) return;

  let fuse = null;
  let allPosts = [];
  let selectedIndex = -1;

  function loadIndex() {
    if (fuse) return Promise.resolve();
    return fetch('/search-index.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        allPosts = data;
        fuse = new Fuse(data, {
          keys: [
            { name: 'title', weight: 0.5 },
            { name: 'dek', weight: 0.3 },
            { name: 'excerpt', weight: 0.15 },
            { name: 'tags', weight: 0.05 },
          ],
          threshold: 0.35,
          includeScore: true,
          minMatchCharLength: 2,
        });
      })
      .catch(function (err) { console.warn('Search index failed to load', err); });
  }

  function highlight(text, query) {
    if (!query || !text) return text || '';
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp('(' + escaped + ')', 'gi'), '<mark>$1</mark>');
  }

  function renderResults(results, query) {
    selectedIndex = -1;
    if (!results.length) {
      searchResults.innerHTML = '<p class="search-empty">No posts found.</p>';
      return;
    }
    searchResults.innerHTML = results.map(function (r, i) {
      const post = r.item || r;
      return '<a href="' + post.url + '" class="search-result" data-index="' + i + '">' +
        '<div class="search-result-meta">' + post.topic + '</div>' +
        '<div class="search-result-title">' + highlight(post.title, query) + '</div>' +
        '<div class="search-result-excerpt">' + highlight(post.dek || post.excerpt || '', query) + '</div>' +
        '</a>';
    }).join('');
  }

  function doSearch(query) {
    if (!fuse) return;
    query = query.trim();
    if (!query) {
      searchResults.innerHTML = '';
      return;
    }
    const results = fuse.search(query).slice(0, 8);
    renderResults(results, query);
  }

  function updateSelection(dir) {
    const items = searchResults.querySelectorAll('.search-result');
    if (!items.length) return;
    if (selectedIndex >= 0) items[selectedIndex].classList.remove('selected');
    selectedIndex = (selectedIndex + dir + items.length) % items.length;
    items[selectedIndex].classList.add('selected');
    items[selectedIndex].scrollIntoView({ block: 'nearest' });
  }

  searchInput.addEventListener('input', function () {
    loadIndex().then(function () { doSearch(searchInput.value); });
  });

  searchInput.addEventListener('focus', function () {
    loadIndex();
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); updateSelection(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); updateSelection(-1); }
    else if (e.key === 'Enter') {
      const selected = searchResults.querySelector('.search-result.selected');
      if (selected) { window.location.href = selected.getAttribute('href'); }
    }
  });

})();

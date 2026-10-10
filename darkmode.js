// Shared theme, navigation, and a small passport for curious visitors.
(() => {
  'use strict';
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* The site also works without storage. */ } }
  };
  function init() {
    const path = location.pathname;
    const home = path.endsWith('/') || path.endsWith('/index.html');
    if (!home) document.body.classList.add('inner-page');
    if (storage.get('darkMode') === 'true') document.documentElement.classList.add('dark-mode');
    const toggle = document.getElementById('dark-mode-toggle');
    const updateTheme = () => {
      if (!toggle) return;
      const dark = document.documentElement.classList.contains('dark-mode');
      toggle.textContent = dark ? '☀' : '☾';
      toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      toggle.setAttribute('aria-pressed', String(dark));
    };
    updateTheme();
    toggle?.addEventListener('click', () => {
      const dark = document.documentElement.classList.toggle('dark-mode');
      storage.set('darkMode', String(dark));
      updateTheme();
    });
    const room = path.includes('/blogs/') ? 'journal' : path.includes('/night_stall_food/') ? 'market' : path.includes('/food_gallery/') ? 'gallery' : /\/projects(?:\/|\.html)/.test(path) ? 'projects' : null;
    const roomNames = { journal: 'Journal', market: 'Night market', gallery: 'Food diary', projects: 'Idea lab' };
    let visits;
    try { visits = JSON.parse(storage.get('tina-explorer-passport') || '[]'); } catch { visits = []; }
    if (!Array.isArray(visits)) visits = [];
    visits = visits.filter(value => Object.hasOwn(roomNames, value));
    if (room && !visits.includes(room)) {
      visits.push(room);
      storage.set('tina-explorer-passport', JSON.stringify(visits));
      const toast = document.createElement('div');
      toast.className = 'visit-toast';
      toast.setAttribute('role', 'status');
      toast.textContent = `✳ ${roomNames[room]} stamp collected · ${visits.length} / 4 corners explored`;
      document.body.append(toast);
      setTimeout(() => toast.remove(), 4200);
    }
    const showPassport = () => {
      document.querySelectorAll('[data-stamp]').forEach(stamp => {
        const collected = visits.includes(stamp.dataset.stamp);
        stamp.classList.toggle('collected', collected);
        stamp.setAttribute('aria-label', `${roomNames[stamp.dataset.stamp]}: ${collected ? 'explored' : 'unexplored'}`);
      });
      const status = document.getElementById('passport-status');
      if (status) status.textContent = visits.length === 4 ? 'All four corners explored. Make yourself at home.' : `${visits.length} of 4 corners explored`;
    };
    showPassport();
    document.getElementById('reset-passport')?.addEventListener('click', () => {
      visits = []; storage.set('tina-explorer-passport', '[]'); showPassport();
    });
    document.getElementById('surprise-me')?.addEventListener('click', () => {
      const links = [...document.querySelectorAll('[data-room]')];
      const unseen = links.filter(link => !visits.includes(link.dataset.room));
      const choices = unseen.length ? unseen : links;
      if (choices.length) location.href = choices[Math.floor(Math.random() * choices.length)].href;
    });
    document.querySelector('header nav')?.setAttribute('aria-label', 'Main navigation');
    document.querySelectorAll('header nav a').forEach(link => {
      const url = new URL(link.href);
      const linkRoom = url.pathname.includes('/blogs/') ? 'journal' : url.pathname.includes('/night_stall_food/') ? 'market' : url.pathname.includes('/food_gallery/') ? 'gallery' : /\/projects(?:\/|\.html)/.test(url.pathname) ? 'projects' : null;
      const names = {journal: 'Journal', market: 'Night market', gallery: 'Food diary', projects: 'Projects'};
      link.textContent = linkRoom ? names[linkRoom] : 'Home';
      if ((home && /index\.html$/.test(url.pathname)) || (room && linkRoom === room)) link.setAttribute('aria-current', 'page');
    });
    document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
    if (!document.querySelector('.skip-link')) {
      const main = document.querySelector('main');
      if (main) {
        main.id ||= 'main';
        const skip = document.createElement('a'); skip.className = 'skip-link'; skip.href = `#${main.id}`; skip.textContent = 'Skip to content'; document.body.prepend(skip);
      }
    }
    let up = document.getElementById('scroll-to-top');
    if (!up) {
      up = document.createElement('button'); up.id = 'scroll-to-top'; up.textContent = '↑'; up.setAttribute('aria-label', 'Back to top'); document.body.append(up);
    }
    const scrollState = () => up.classList.toggle('visible', scrollY > 350);
    window.addEventListener('scroll', scrollState, { passive: true }); scrollState();
    up.addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
    document.body.classList.add('transitions-ready');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

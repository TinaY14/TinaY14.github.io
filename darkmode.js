// One button cycles through soft themes while keeping the original page layout.
(function () {
    'use strict';
    const themes = [
        { id: 'mint', name: 'Mint' },
        { id: 'sky', name: 'Sky' },
        { id: 'peach', name: 'Peach' },
        { id: 'lavender', name: 'Lavender' },
        { id: 'cream', name: 'Cream' }
    ];
    let saved;
    try { saved = localStorage.getItem('tinaTheme'); } catch (_) {}
    const path = location.pathname.toLowerCase();
    const pageTheme = /(?:^|\/)blogs(?:\/|$)/.test(path) ? 'cream'
        : /(?:^|\/)night_stall_food(?:\/|$)/.test(path) ? 'peach'
        : /(?:^|\/)food_gallery(?:\/|$)/.test(path) ? 'sky'
        : /(?:^|\/)projects(?:\/|\.html|$)/.test(path) ? 'lavender'
        : 'mint';
    let themeIndex = themes.findIndex(theme => theme.id === pageTheme);
    const previousTheme = themes.some(theme => theme.id === saved) ? saved : 'mint';
    // Paint the previous page's palette first, then ease into this page's palette.
    document.documentElement.classList.remove('dark-mode');
    document.documentElement.dataset.theme = previousTheme;
    function applyTheme() {
        document.documentElement.classList.remove('dark-mode');
        document.documentElement.dataset.theme = themes[themeIndex].id;
        try { localStorage.setItem('tinaTheme', themes[themeIndex].id); } catch (_) {}
    }
    let firstFrame = 0, secondFrame = 0;
    function cancelPageTransition() {
        cancelAnimationFrame(firstFrame);
        cancelAnimationFrame(secondFrame);
    }
    function transitionToPageTheme() {
        cancelPageTransition();
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
            applyTheme();
        } else {
            firstFrame = requestAnimationFrame(() => {
                secondFrame = requestAnimationFrame(applyTheme);
            });
        }
    }
    // Start the page palette without waiting for unrelated content to finish loading.
    transitionToPageTheme();
    function initialize() {
        const filename = location.pathname.split('/').pop();
        if (filename && filename !== 'index.html') document.body.classList.add('inner-page');
        const button = document.getElementById('dark-mode-toggle');
        let announcement;
        function updateButton() {
            if (!button) return;
            const current = themes[themeIndex], next = themes[(themeIndex + 1) % themes.length];
            button.textContent = current.name;
            button.setAttribute('aria-label', `Current theme: ${current.name}. Switch to ${next.name}`);
            button.title = `Theme: ${current.name} · Click for ${next.name}`;
        }
        updateButton();
        window.addEventListener('pageshow', event => {
            if (!event.persisted) return;
            let previous;
            try { previous = localStorage.getItem('tinaTheme'); } catch (_) {}
            if (themes.some(theme => theme.id === previous)) document.documentElement.dataset.theme = previous;
            themeIndex = themes.findIndex(theme => theme.id === pageTheme);
            updateButton();
            transitionToPageTheme();
        });
        if (button) {
            announcement = document.createElement('span');
            announcement.className = 'theme-announcement';
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            document.body.appendChild(announcement);
            button.addEventListener('click', () => {
                cancelPageTransition();
                themeIndex = (themeIndex + 1) % themes.length;
                applyTheme();
                updateButton();
                announcement.textContent = `${themes[themeIndex].name} theme selected`;
            });
        }
        let scrollButton = document.getElementById('scroll-to-top');
        if (!scrollButton) {
            scrollButton = document.createElement('button');
            scrollButton.id = 'scroll-to-top';
            scrollButton.textContent = '↑';
            scrollButton.setAttribute('aria-label', 'Scroll to top');
            document.body.appendChild(scrollButton);
        }
        const updateScrollButton = () => scrollButton.classList.toggle('visible', window.scrollY > 300);
        window.addEventListener('scroll', updateScrollButton, { passive: true });
        scrollButton.addEventListener('click', () => window.scrollTo({
            top: 0,
            behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        }));
        updateScrollButton();
        const enableTransitions = () => document.body.classList.add('transitions-ready');
        if (document.readyState === 'complete') enableTransitions();
        else window.addEventListener('load', enableTransitions, { once: true });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
    else initialize();
})();

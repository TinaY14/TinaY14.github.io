(function () {
    'use strict';
    const selector = '.timeline-photo img, .article-photos img, .collection-article img, .project-gallery img, .content-entry img';
    const dialog = document.createElement('dialog');
    dialog.className = 'photo-notebook';
    dialog.setAttribute('aria-label', 'Photo notebook');
    dialog.innerHTML = `
        <div class="notebook-toolbar">
            <span class="notebook-position"></span>
            <button class="notebook-close" type="button" autofocus>Close notebook</button>
        </div>
        <div class="notebook-spread">
            <aside class="notebook-paper"><h2>Notes from this day</h2><p class="notebook-date"></p><div class="notebook-notes"></div></aside>
            <figure><img class="notebook-image" alt=""><figcaption></figcaption></figure>
        </div>
        <div class="notebook-paging"><button type="button" class="notebook-previous">Previous photo</button><button type="button" class="notebook-next">Next photo</button></div>`;
    document.body.appendChild(dialog);
    const image = dialog.querySelector('.notebook-image');
    const notes = dialog.querySelector('.notebook-notes');
    const previous = dialog.querySelector('.notebook-previous');
    const next = dialog.querySelector('.notebook-next');
    let photos = [];
    let position = 0;
    let opener;
    let previousOverflow = '';

    function showPhoto() {
        const photo = photos[position];
        image.src = photo.currentSrc || photo.src;
        image.alt = photo.alt;
        const entry = photo.closest('.timeline-entry');
        const article = photo.closest('main')?.querySelector('.collection-article');
        const summary = entry?.querySelector('.timeline-summary');
        if (summary) {
            const reflection = summary.cloneNode(true);
            reflection.querySelector('.timeline-summary-label')?.remove();
            notes.textContent = reflection.textContent.trim();
        } else {
            notes.textContent = article?.textContent.trim() || '';
        }
        dialog.querySelector('.notebook-date').textContent = entry?.querySelector('.timeline-date')?.innerText || '';
        dialog.querySelector('figcaption').textContent = photo.alt || '';
        dialog.querySelector('.notebook-position').textContent = (position + 1) + ' / ' + photos.length;
        previous.disabled = position === 0;
        next.disabled = position === photos.length - 1;
    }

    function openNotebook(photo) {
        photos = [...document.querySelectorAll(selector)].filter(item => item.getClientRects().length);
        position = photos.indexOf(photo);
        if (position < 0) return;
        opener = photo;
        showPhoto();
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialog.showModal();
    }

    document.addEventListener('click', event => {
        if (!event.target.matches(selector)) return;
        event.preventDefault();
        openNotebook(event.target);
    });
    document.addEventListener('keydown', event => {
        if (event.target.matches(selector) && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            openNotebook(event.target);
        }
    });
    function makePhotosFocusable() {
        document.querySelectorAll(selector).forEach(photo => {
            photo.tabIndex = 0;
            photo.setAttribute('role', 'button');
            photo.setAttribute('aria-label', 'Open photo notebook' + (photo.alt ? ': ' + photo.alt : ''));
        });
    }
    makePhotosFocusable();
    new MutationObserver(makePhotosFocusable).observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
    previous.addEventListener('click', () => { position--; showPhoto(); });
    next.addEventListener('click', () => { position++; showPhoto(); });
    dialog.querySelector('.notebook-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft' && position > 0) { position--; showPhoto(); }
        if (event.key === 'ArrowRight' && position < photos.length - 1) { position++; showPhoto(); }
    });
    dialog.addEventListener('close', () => {
        document.body.style.overflow = previousOverflow;
        opener?.focus({ preventScroll: true });
    });
})();

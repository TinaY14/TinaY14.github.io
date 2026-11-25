const status = document.getElementById('film-status');
const yearSelect = document.getElementById('film-year');
const monthSelect = document.getElementById('film-month');
const playButton = document.getElementById('film-play');
const speedInput = document.getElementById('film-speed');
const info = document.getElementById('film-info');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const rows = ['film-upper', 'film-lower'].map((id, index) => ({
    element: document.getElementById(id),
    direction: index === 0 ? -1 : 1,
    offset: 0,
    width: 0,
    drag: null
}));
let allPhotos = [];
let photos = [];
let selected = 0;
let playing = !reducedMotion.matches;
let speed = 1;
let lastTime = 0;
let loadRevision = 0;
let visible = true;

function wrap(value, width) {
    return width ? ((value % width) + width) % width : 0;
}

function updateSelection(index) {
    if (!photos.length) return;
    selected = (index + photos.length) % photos.length;
    const photo = photos[selected];
    info.textContent = photo.date + (photo.alt ? ' · ' + photo.alt : '') + ' · ' + (selected + 1) + ' / ' + photos.length;
}

function openPhoto(index, opener) {
    if (!photos.length) return;
    updateSelection(index);
    document.dispatchEvent(new CustomEvent('photo-notebook:open', {
        detail: { photos, index: selected, opener: opener || rows[0].element }
    }));
}

function selectPhoto(direction) {
    updateSelection(selected + direction);
    const row = rows[0];
    const frame = row.group?.querySelector('[data-photo="' + selected + '"]');
    if (frame) {
        row.offset = wrap(frame.offsetLeft - row.element.clientWidth / 2 + frame.clientWidth / 2, row.width);
    }
}

function syncPlayback() {
    playButton.textContent = playing ? 'Pause' : 'Play';
    playButton.setAttribute('aria-pressed', String(playing));
}

function measureRow(row) {
    const width = row.group.getBoundingClientRect().width;
    row.offset = row.width ? row.offset / row.width * width : 0;
    row.width = width;
    if (!width) return;
    const copies = Math.max(2, Math.ceil(row.element.clientWidth / width) + 2);
    while (row.track.children.length < copies) {
        const copy = row.group.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        copy.querySelectorAll('button').forEach(button => { button.tabIndex = -1; });
        row.track.appendChild(copy);
    }
    while (row.track.children.length > copies) row.track.lastElementChild.remove();
}

function loadImage(photo) {
    return new Promise(resolve => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = photo.src;
    });
}

async function updateFilm() {
    const revision = ++loadRevision;
    const year = yearSelect.value;
    const month = monthSelect.value;
    const nextPhotos = allPhotos.filter(photo => (!year || photo.date.startsWith(year + '-')) && (!month || photo.date.slice(5, 7) === month));
    status.textContent = 'Loading your photos…';
    document.querySelectorAll('.film-photo-controls button').forEach(button => { button.disabled = true; });
    const images = await Promise.all(nextPhotos.map(loadImage));
    if (revision !== loadRevision) return;
    photos = nextPhotos;
    updateSelection(0);
    rows.forEach((row, rowIndex) => {
        row.observer?.disconnect();
        row.element.replaceChildren();
        const track = document.createElement('div');
        track.className = 'film-track';
        const group = document.createElement('div');
        group.className = 'film-group';
        photos.forEach((_, position) => {
            const index = (position + Math.floor(rowIndex * photos.length / 2)) % photos.length;
            const photo = photos[index];
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'film-frame';
            button.dataset.photo = String(index);
            button.setAttribute('aria-label', 'Open photo from ' + photo.date + (photo.alt ? ': ' + photo.alt : ''));
            const image = document.createElement('img');
            image.src = photo.src;
            image.alt = photo.alt || photo.date;
            image.draggable = false;
            if (images[index]) {
                image.width = images[index].naturalWidth;
                image.height = images[index].naturalHeight;
            }
            button.appendChild(image);
            group.appendChild(button);
        });
        track.appendChild(group);
        row.element.appendChild(track);
        row.track = track;
        row.group = group;
        row.offset = 0;
        row.width = 0;
        row.observer = new ResizeObserver(() => measureRow(row));
        row.observer.observe(group);
        row.observer.observe(row.element);
        measureRow(row);
        row.element.dataset.ready = 'true';
    });
    const missing = images.filter(image => !image).length;
    status.textContent = missing ? missing + ' photo(s) could not be loaded.' : '';
    document.querySelectorAll('.film-photo-controls button').forEach(button => { button.disabled = !photos.length; });
}

function animate(time) {
    requestAnimationFrame(animate);
    const delta = Math.min((time - lastTime) / 1000 || 0, .05);
    lastTime = time;
    if (!visible || document.hidden) return;
    const notebookOpen = document.querySelector('.photo-notebook[open]');
    rows.forEach(row => {
        if (!row.track || !row.width) return;
        if (playing && !row.drag && !notebookOpen) row.offset = wrap(row.offset + delta * 45 * speed, row.width);
        const translation = row.direction < 0 ? -row.offset : -row.width + row.offset;
        row.track.style.transform = 'translate3d(' + translation + 'px,0,0)';
    });
}

rows.forEach(row => {
    row.element.addEventListener('pointerdown', event => {
        row.drag = { start: event.clientX, previous: event.clientX, distance: 0 };
        row.element.setPointerCapture(event.pointerId);
    });
    row.element.addEventListener('pointermove', event => {
        if (!row.drag) return;
        const delta = event.clientX - row.drag.previous;
        row.offset = wrap(row.offset + delta * row.direction, row.width);
        row.drag.distance += Math.abs(delta);
        row.drag.previous = event.clientX;
        row.element.classList.toggle('dragging', row.drag.distance > 6);
    });
    row.element.addEventListener('pointerup', event => {
        const moved = row.drag && row.drag.distance > 6;
        row.drag = null;
        row.element.classList.remove('dragging');
        if (!moved) {
            const frame = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-photo]');
            if (frame && row.element.contains(frame)) openPhoto(Number(frame.dataset.photo), row.element);
        }
    });
    row.element.addEventListener('pointercancel', () => {
        row.drag = null;
        row.element.classList.remove('dragging');
    });
    row.element.addEventListener('click', event => {
        // Keyboard activation produces a click with detail 0. Pointer clicks open on pointerup.
        if (event.detail !== 0) return;
        const frame = event.target.closest('[data-photo]');
        if (frame) openPhoto(Number(frame.dataset.photo), row.element);
    });
    row.element.addEventListener('focusin', event => {
        if (row.drag) return;
        const frame = event.target.closest('[data-photo]');
        if (frame) {
            playing = false;
            syncPlayback();
            updateSelection(Number(frame.dataset.photo));
            const original = row.group.querySelector('[data-photo="' + selected + '"]');
            const aligned = original.offsetLeft - row.element.clientWidth / 2 + original.clientWidth / 2;
            row.offset = wrap(row.direction < 0 ? aligned : -aligned, row.width);
        }
    });
    row.element.addEventListener('keydown', event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            selectPhoto(event.key === 'ArrowRight' ? 1 : -1);
        }
    });
    row.element.addEventListener('wheel', event => {
        if (!row.width) return;
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) event.preventDefault();
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        row.offset = wrap(row.offset + delta, row.width);
    }, { passive: false });
});
playButton.addEventListener('click', () => { playing = !playing; syncPlayback(); });
speedInput.addEventListener('input', () => {
    speed = Number(speedInput.value);
    document.getElementById('film-speed-value').textContent = speed.toFixed(1) + '×';
});
document.getElementById('film-previous').addEventListener('click', () => selectPhoto(-1));
document.getElementById('film-next').addEventListener('click', () => selectPhoto(1));
document.getElementById('film-open').addEventListener('click', () => openPhoto(selected));
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) { playing = false; syncPlayback(); } });
new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }).observe(document.querySelector('.film-space'));
syncPlayback();
requestAnimationFrame(animate);

function applyFilters() {
    if (!allPhotos.length) return;
    const params = new URLSearchParams(location.hash.slice(1));
    const years = [...new Set(allPhotos.map(photo => photo.date.slice(0, 4)))].sort().reverse();
    const year = years.includes(params.get('year')) ? params.get('year') : '';
    const months = [...new Set(allPhotos.filter(photo => photo.date.startsWith(year + '-')).map(photo => photo.date.slice(5, 7)))].sort();
    const month = months.includes(params.get('month')) ? params.get('month') : '';
    yearSelect.replaceChildren(new Option('All years', ''), ...years.map(value => new Option(value, value)));
    yearSelect.value = year;
    monthSelect.replaceChildren(new Option('All months', ''), ...months.map(value => new Option(new Date(2000, Number(value) - 1).toLocaleDateString('en-US', { month: 'long' }), value)));
    monthSelect.value = month;
    monthSelect.disabled = !year;
    updateFilm().catch(showLoadError);
}
function selectFilters(clearMonth) {
    const params = new URLSearchParams();
    if (yearSelect.value) params.set('year', yearSelect.value);
    if (!clearMonth && monthSelect.value) params.set('month', monthSelect.value);
    const hash = params.toString();
    if (location.hash.slice(1) === hash) applyFilters();
    else location.hash = hash;
}
function showLoadError(error) {
    status.textContent = 'Could not load the photos. Please refresh to try again.';
    console.error(error);
}
yearSelect.addEventListener('change', () => selectFilters(true));
monthSelect.addEventListener('change', () => selectFilters(false));
window.addEventListener('hashchange', applyFilters);

fetch('../food_gallery/data.json').then(response => {
    if (!response.ok) throw new Error('Photo data could not be loaded.');
    return response.json();
}).then(entries => {
    allPhotos = entries.flatMap(entry => entry.photos
        .filter(photo => (photo.collection || 'diary') === document.body.dataset.collection)
        .map(photo => ({
            src: '../food_gallery/' + photo.image,
            alt: photo.caption || '',
            notes: entry.summary || '',
            date: photo.image.split('/').pop().slice(0, 10),
            location: entry.location || ''
        }))).sort((a, b) => b.date.localeCompare(a.date));
    if (!allPhotos.length) {
        status.textContent = 'No photos in this collection yet.';
        document.querySelectorAll('.film-controls button, .film-controls input').forEach(control => { control.disabled = true; });
        return;
    }
    applyFilters();
}).catch(showLoadError);

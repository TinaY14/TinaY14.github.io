(function () {
    'use strict';
    const container = document.getElementById('blog-path-container');
    const svg = document.getElementById('blog-path-svg');
    const path = document.getElementById('garden-path');
    const pig = document.getElementById('pig-companion');
    const home = document.getElementById('pig-home');
    const stopsLayer = document.getElementById('journey-stops');
    const meter = document.getElementById('journey-meter');
    const count = document.getElementById('journey-count');
    const energy = document.getElementById('journey-energy');
    const status = document.getElementById('journey-status');
    const thought = document.getElementById('pig-thought');
    const treat = document.getElementById('pig-treat');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    if (!container || !path || !pig) return;
    container.appendChild(pig);

    const foodArt = {
        banana: '<path d="M11 15Q13 36 34 30Q31 40 19 37Q4 31 7 15Z" fill="#e4be66" stroke="#b99b59" stroke-width="1.5"/><path d="M11 15L10 10M34 30L37 28" stroke="#927451" stroke-width="3" stroke-linecap="round"/><path d="M12 23Q17 34 29 32" fill="none" stroke="#f7db91" stroke-width="2"/>',
        pancake: '<ellipse cx="22" cy="31" rx="17" ry="5" fill="#ded3bb"/><ellipse cx="22" cy="26" rx="14" ry="5" fill="#bc8b58"/><ellipse cx="22" cy="22" rx="14" ry="5" fill="#d7ac6c"/><ellipse cx="22" cy="18" rx="14" ry="5" fill="#edc68a"/><path d="M12 18Q18 15 25 18L29 22L24 25L21 20Z" fill="#b48758"/><rect x="19" y="14" width="8" height="5" rx="1" fill="#f7dfa1"/>',
        smoothie: '<path d="M11 14H33L29 37H15Z" fill="#dab7bd" stroke="#b98d98" stroke-width="1.5"/><path d="M13 21H31L29 35H15Z" fill="#cb91a0"/><ellipse cx="22" cy="14" rx="11" ry="3" fill="#f1d4cf"/><path d="M25 25L29 7H35" fill="none" stroke="#8c9e7e" stroke-width="2.5" stroke-linecap="round"/><path d="M18 14Q9 10 13 5Q20 3 23 11" fill="#a0b38d"/>',
        avocado: '<path d="M22 5Q31 6 36 25Q39 38 22 39Q5 38 8 25Q13 6 22 5Z" fill="#90a27b" stroke="#768867" stroke-width="1.5"/><path d="M22 10Q28 11 32 25Q34 34 22 35Q10 34 12 25Q16 11 22 10Z" fill="#d4d6a2"/><circle cx="22" cy="26" r="7" fill="#b18161"/><circle cx="20" cy="24" r="2" fill="#c79d79"/>',
        apple: '<path d="M22 13Q8 7 7 23Q8 39 19 37L22 35L25 37Q37 39 37 23Q36 7 22 13Z" fill="#d49a90" stroke="#b77d74" stroke-width="1.5"/><path d="M22 15L23 7" stroke="#907353" stroke-width="2.5" stroke-linecap="round"/><path d="M23 10Q27 1 35 7Q31 14 23 10" fill="#9aab82"/><path d="M12 21Q11 28 15 31" fill="none" stroke="#edbeb0" stroke-width="3" stroke-linecap="round"/>',
        bread: '<path d="M9 22Q1 10 14 8Q22 3 30 8Q43 11 35 22V35H9Z" fill="#c99764" stroke="#ad7f55" stroke-width="1.5"/><path d="M12 22Q6 13 16 12Q22 8 28 12Q38 14 32 22V32H12Z" fill="#ecd2a5"/><circle cx="17" cy="22" r="1.5" fill="#c6a77c"/><circle cx="26" cy="26" r="1.5" fill="#c6a77c"/>',
        tea: '<path d="M10 17H31V29Q30 36 21 36Q11 36 10 29Z" fill="#e8decb" stroke="#b2a38b" stroke-width="1.5"/><path d="M31 19Q42 18 37 29Q34 32 31 29" fill="none" stroke="#b2a38b" stroke-width="2.5"/><ellipse cx="20.5" cy="17" rx="10.5" ry="3" fill="#b3bb90"/><path d="M17 11Q12 7 17 3M25 11Q20 7 25 3" fill="none" stroke="#c9bba5" stroke-width="2" stroke-linecap="round"/><ellipse cx="22" cy="38" rx="17" ry="2" fill="#d4c7b0"/>',
        cookie: '<circle cx="22" cy="23" r="15" fill="#dfbd88" stroke="#ba996b" stroke-width="1.5"/><path d="M11 15L15 12M12 29L16 33" stroke="#f1d6aa" stroke-width="2" stroke-linecap="round"/><g fill="#987252"><circle cx="19" cy="14" r="2.5"/><circle cx="29" cy="19" r="2"/><circle cx="17" cy="24" r="2"/><circle cx="25" cy="30" r="2.5"/><circle cx="11" cy="22" r="1.5"/></g>'
    };
    const foodNames = { banana: 'Banana bite', pancake: 'Pancake bite', smoothie: 'Berry smoothie', avocado: 'Avocado bite', apple: 'Apple slice', bread: 'Little toast', tea: 'Warm tea', cookie: 'Tiny cookie' };
    const foodSvg = id => `<svg viewBox="0 0 44 44" aria-hidden="true">${foodArt[id]}</svg>`;
    function snackFor(title, index) {
        if (/banana/i.test(title)) return 'banana';
        if (/pancake/i.test(title)) return 'pancake';
        if (/smoothie/i.test(title)) return 'smoothie';
        if (/guacamole/i.test(title)) return 'avocado';
        if (/ferment/i.test(title)) return 'bread';
        if (/lingzhi|ganoderma/i.test(title)) return 'tea';
        return index % 2 ? 'cookie' : 'apple';
    }

    let stops = [];
    const collected = new Set();
    let length = 0;
    let startY = 95;
    let endY = 95;
    let currentY = null;
    let frame = 0;
    let lastTime = 0;
    let pauseUntil = 0;
    let eatingTimer;
    let arrived = false;

    function updateEnergy() {
        count.textContent = arrived ? 'Home, happily fueled' : `${collected.size} / ${stops.length} little treats`;
        energy.style.width = `${stops.length ? collected.size / stops.length * 100 : 0}%`;
    }

    function addPlants(width) {
        container.querySelectorAll('.path-flower').forEach(el => el.remove());
        const mobile = width <= 1000;
        const count = stops.length * 2;
        for (let i = 0; i < count; i++) {
            const t = (i + .7) / (count + 1);
            const pt = path.getPointAtLength(t * length);
            const before = path.getPointAtLength(Math.max(0, t * length - 3));
            const after = path.getPointAtLength(Math.min(length, t * length + 3));
            const dx = after.x - before.x, dy = after.y - before.y;
            const magnitude = Math.hypot(dx, dy) || 1;
            const side = i % 2 ? 1 : -1;
            const offset = mobile ? 31 : 57;
            const x = pt.x + side * dy / magnitude * offset;
            const y = pt.y - side * dx / magnitude * offset;
            // Plants stay out of the article cards and the narrow mobile reading column.
            if (x < 8 || x > width - 30 || (mobile && x > 74)) continue;
            const blocked = [...container.querySelectorAll('.blog-entry')].some(entry => {
                const card = entry.querySelector('.blog-signpost-card');
                const left = entry.offsetLeft + card.offsetLeft;
                const top = entry.offsetTop + entry.offsetParent.offsetTop;
                return x > left - 22 && x < left + card.offsetWidth + 22 && y > top - 20 && y < top + entry.offsetHeight + 20;
            });
            if (blocked) continue;
            const plant = document.createElement('span');
            plant.className = 'path-flower';
            plant.setAttribute('aria-hidden', 'true');
            plant.style.left = `${x - (mobile ? 14 : 23)}px`;
            plant.style.top = `${y - (mobile ? 20 : 31)}px`;
            plant.innerHTML = `<svg viewBox="0 0 46 62"><path d="M23 56Q20 37 24 17M23 43Q7 42 9 30Q20 29 23 43M23 48Q39 45 39 35Q27 33 23 48" fill="#9cac87" stroke="#829672" stroke-width="1.5" stroke-linecap="round"/>${i % 3 === 0 ? '<g fill="#d8a4a0"><ellipse cx="24" cy="14" rx="5" ry="9"/><ellipse cx="24" cy="14" rx="5" ry="9" transform="rotate(60 24 14)"/><ellipse cx="24" cy="14" rx="5" ry="9" transform="rotate(120 24 14)"/></g><circle cx="24" cy="14" r="3.5" fill="#e9cb95"/>' : '<path d="M23 32Q13 21 17 14Q29 18 23 32M23 25Q34 17 33 9Q22 11 23 25" fill="#a9b797"/>'}</svg>`;
            container.appendChild(plant);
        }
    }

    function refresh() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        const mobile = matchMedia('(max-width: 1000px)').matches;
        const entries = [...container.querySelectorAll('.blog-entry')];
        startY = 95;
        endY = Math.max(startY + 160, height - 150);
        const points = [{ x: mobile ? 45 : width * .5, y: startY }];
        stops = entries.map((entry, index) => {
            const stop = {
                index, y: entry.offsetParent.offsetTop + entry.offsetTop + entry.offsetHeight / 2,
                x: mobile ? (index % 2 ? 35 : 54) : width * (index % 2 ? .32 : .68),
                food: snackFor(entry.querySelector('.billboard-title').textContent, index)
            };
            points.push(stop);
            return stop;
        });
        points.push({ x: width * .5, y: endY });
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const a = points[i - 1], b = points[i];
            const bend = (b.y - a.y) * .5;
            d += ` C ${a.x} ${a.y + bend}, ${b.x} ${b.y - bend}, ${b.x} ${b.y}`;
        }
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.querySelectorAll('path').forEach(el => el.setAttribute('d', d));
        length = path.getTotalLength();
        home.style.left = `${width * .5}px`;
        home.style.top = `${endY - 155}px`;
        stopsLayer.replaceChildren();
        stops.forEach(stop => {
            const node = document.createElement('div');
            node.className = 'snack-stop' + (collected.has(stop.index) ? ' collected' : '');
            node.style.left = `${stop.x}px`;
            node.style.top = `${stop.y}px`;
            node.dataset.index = stop.index;
            node.innerHTML = foodSvg(stop.food) + `<span class="snack-stop-label">LITTLE TREAT ${String(stop.index + 1).padStart(2, '0')}</span>`;
            stopsLayer.appendChild(node);
            stop.node = node;
        });
        addPlants(width);
        meter.hidden = !stops.length;
        updateEnergy();
        currentY = null;
        requestUpdate();
    }

    // The path is monotonic in Y. Invert its length so the pig remains aligned with the reading viewport.
    function pointAtY(y) {
        let low = 0, high = length;
        for (let i = 0; i < 15; i++) {
            const mid = (low + high) / 2;
            if (path.getPointAtLength(mid).y < y) low = mid;
            else high = mid;
        }
        return path.getPointAtLength((low + high) / 2);
    }

    function collect(stop, celebrate) {
        collected.add(stop.index);
        stop.node.classList.add('collected');
        updateEnergy();
        if (!celebrate) return;
        clearTimeout(eatingTimer);
        pig.classList.remove('eating');
        treat.innerHTML = foodSvg(stop.food);
        thought.textContent = 'Yum! +1 energy';
        void pig.offsetWidth;
        pig.classList.add('eating');
        status.textContent = `${foodNames[stop.food]} enjoyed! ${collected.size} of ${stops.length} treats collected.`;
        eatingTimer = setTimeout(() => pig.classList.remove('eating'), 850);
    }

    function requestUpdate() {
        if (!frame) frame = requestAnimationFrame(animate);
    }

    function animate(time) {
        frame = 0;
        if (!length) return;
        const top = container.getBoundingClientRect().top + window.scrollY;
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
        const scrollStart = Math.max(0, top + startY - innerHeight * .55);
        const atBottom = window.scrollY >= maxScroll - 2;
        const progress = atBottom ? 1 : Math.max(0, Math.min(1, (window.scrollY - scrollStart) / Math.max(1, maxScroll - scrollStart)));
        const targetY = startY + (endY - startY) * progress;
        const previousY = currentY;
        const dt = Math.min(64, time - (lastTime || time - 16));
        lastTime = time;
        if (currentY === null || motion.matches || atBottom) currentY = targetY;
        else if (time >= pauseUntil || targetY - currentY > innerHeight * .6) {
            currentY += (targetY - currentY) * (1 - Math.exp(-dt / 75));
        }
        if (Math.abs(targetY - currentY) < .5) currentY = targetY;
        const crossed = stops.filter(stop => !collected.has(stop.index) && currentY >= stop.y - 2);
        crossed.forEach((stop, index) => {
            const celebrate = !atBottom && index === crossed.length - 1;
            collect(stop, celebrate);
            if (celebrate && !motion.matches && targetY - stop.y < innerHeight * .6) {
                currentY = stop.y;
                pauseUntil = time + 650;
            }
        });
        const pt = pointAtY(currentY);
        pig.style.left = `${pt.x}px`;
        pig.style.top = `${pt.y}px`;
        pig.style.opacity = '1';
        pig.dataset.progress = ((currentY - startY) / (endY - startY)).toFixed(4);
        const moving = previousY !== null && Math.abs(currentY - previousY) > .25 && time >= pauseUntil;
        pig.classList.toggle('walking', moving && !atBottom && !motion.matches);
        const isHome = Math.abs(currentY - endY) < 1;
        home.classList.toggle('pig-near', currentY > endY - 140);
        home.classList.toggle('pig-arrived', isHome);
        pig.classList.toggle('arrived', isHome);
        if (isHome && !arrived) {
            clearTimeout(eatingTimer);
            pig.classList.remove('eating', 'walking');
            thought.textContent = 'Home ♡';
            document.getElementById('home-message').textContent = 'Healthy & happy. Thanks for coming along!';
            status.textContent = 'Home, sweet home! The pig has arrived happy and full of energy.';
        } else if (!isHome && arrived) {
            document.getElementById('home-message').textContent = 'A warm welcome is waiting.';
        }
        arrived = isHome;
        updateEnergy();
        if (Math.abs(currentY - targetY) > .4) requestUpdate();
        else pig.classList.remove('walking');
    }

    let refreshFrame = 0;
    function queueRefresh() {
        if (refreshFrame) return;
        refreshFrame = requestAnimationFrame(() => { refreshFrame = 0; refresh(); });
    }
    window.addEventListener('blogs-rendered', queueRefresh);
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', queueRefresh);
    window.addEventListener('pageshow', queueRefresh);
    window.addEventListener('load', queueRefresh, { once: true });
    motion.addEventListener('change', requestUpdate);
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(queueRefresh).observe(container);
    if (document.fonts) document.fonts.ready.then(queueRefresh);
    queueRefresh();
})();

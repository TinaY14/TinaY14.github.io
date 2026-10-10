// A scroll-driven companion on the journal's quiet garden trail.
(() => {
  const container = document.getElementById('blog-path-container');
  const svg = document.getElementById('blog-path-svg');
  const path = document.getElementById('garden-path');
  const border = document.getElementById('garden-path-border');
  const pig = document.getElementById('pig-companion');
  const home = document.getElementById('pig-home');
  const door = document.getElementById('pig-door');
  const start = document.getElementById('healthy-pig-destination');
  const label = document.getElementById('trail-progress');
  if (!container || !path || !pig) return;
  container.append(pig);
  pig.style.position = 'absolute';
  pig.setAttribute('aria-hidden', 'true');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let length = 0, target = 0, current = 0, frame = 0, lastTime = 0;
  let startY = 65, endY = 0, lastChapter = -1, ready = false;
  let samples = [];
  const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
  function draw() {
    if (!length) return;
    const point = path.getPointAtLength(current);
    pig.style.transform = `translate3d(${point.x - 30}px, ${point.y - 37.5}px, 0)`;
    const progress = current / length;
    const arrived = length - current < 12;
    const near = length - current < 90;
    home.classList.toggle('pig-near', near);
    door.classList.toggle('open', near && !arrived);
    pig.classList.toggle('celebrating', arrived);
    pig.style.opacity = arrived ? '0' : '1';
    const chapter = arrived ? 4 : Math.min(3, Math.floor(progress * 4));
    if (chapter !== lastChapter) {
      const messages = ['The journey begins here.', 'A few stories, a little wonder.', 'Halfway home. Keep wandering.', 'Almost home. One more little discovery.', 'Home sweet home. Thanks for wandering with me.'];
      if (label) label.textContent = messages[chapter];
      lastChapter = chapter;
    }
  }
  function tick(time) {
    const dt = lastTime ? Math.min(time - lastTime, 48) : 16;
    lastTime = time;
    current += (target - current) * (1 - Math.exp(-dt / 90));
    const moving = Math.abs(target - current) > .5;
    pig.classList.toggle('walking', moving && !reduced.matches);
    draw();
    if (moving) frame = requestAnimationFrame(tick);
    else { current = target; draw(); frame = 0; lastTime = 0; pig.classList.remove('walking'); }
  }
  function update() {
    if (!ready) return;
    const rect = container.getBoundingClientRect();
    const top = rect.top + scrollY;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const from = Math.max(0, top + startY - innerHeight * .48);
    const to = Math.min(maxScroll, top + endY - innerHeight * .48);
    const progress = clamp((scrollY - from) / Math.max(1, to - from), 0, 1);
    const y = startY + progress * (endY - startY);
    // Match vertical position rather than arc length, so bends never change scroll speed.
    let low = 0, high = samples.length - 1;
    while (high - low > 1) {
      const mid = (low + high) >> 1;
      if (samples[mid].y < y) low = mid; else high = mid;
    }
    const a = samples[low], b = samples[high];
    target = a.distance + (b.distance - a.distance) * clamp((y - a.y) / Math.max(.001, b.y - a.y), 0, 1);
    if (reduced.matches) { current = target; draw(); return; }
    if (!frame) frame = requestAnimationFrame(tick);
  }
  function rebuild() {
    const width = container.clientWidth, height = container.offsetHeight;
    const mobile = width < 680;
    const center = mobile ? 31 : width / 2;
    const amplitude = mobile ? 5 : Math.min(15, width * .018);
    endY = height - 95;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.width = `${width}px`; svg.style.height = `${height}px`;
    const entriesTop = document.getElementById('blog-entries').offsetTop;
    const stops = [{x: center, y: startY}];
    container.querySelectorAll('.blog-entry').forEach((entry, i) => {
      stops.push({x: center + (i % 2 ? amplitude : -amplitude), y: entriesTop + entry.offsetTop + entry.offsetHeight / 2});
    });
    stops.push({x: center, y: endY});
    let d = `M ${center} ${startY}`;
    for (let i = 1; i < stops.length; i++) {
      const a = stops[i-1], b = stops[i], mid = (a.y+b.y)/2;
      d += ` C ${a.x} ${mid} ${b.x} ${mid} ${b.x} ${b.y}`;
    }
    path.setAttribute('d', d); border.setAttribute('d', d);
    length = path.getTotalLength();
    samples = Array.from({length: 257}, (_, i) => {
      const distance = length * i / 256;
      return {distance, y: path.getPointAtLength(distance).y};
    });
    home.style.left = `${center}px`; home.style.top = `${endY}px`;
    start.style.left = `${center}px`; start.style.top = `${startY}px`; start.style.bottom = 'auto';
    ready = true; update(); current = target; draw();
  }
  window.addEventListener('journal-rendered', rebuild);
  window.addEventListener('scroll', update, {passive: true});
  let resizeFrame;
  const observer = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(rebuild);
  });
  observer.observe(container);
  reduced.addEventListener('change', update);
})();

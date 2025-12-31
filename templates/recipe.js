module.exports = function(data, content) {
  // Process content to wrap H1 sections in content-entry divs
  // and convert H1 to H3
  const processedContent = content
    .replace(/<h1>/g, '</div><div class="content-entry"><h3>')
    .replace(/<\/h1>/g, '</h3>')
    .replace(/^<\/div>/, ''); // Remove leading closing div from first section

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title} - Tina's Food Gallery</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

    <link rel="stylesheet" href="../styles.css">
    <script src="../darkmode.js"></script>

    <!-- Prevent dark mode icon flash -->
    <script>
        (function() {
            const savedMode = localStorage.getItem('darkMode');
            if (savedMode === 'true') {
                document.documentElement.classList.add('dark-mode');
            }
        })();
    </script>
</head>
<body class="inner-page">
    <header>
        <div class="logo">Tina's Little World</div>
        <nav>
            <a href="../index.html">Home</a>
            <a href="../night_stall_food/night_stall_food.html">Night Stall Food</a>
            <a href="food_gallery.html">Food Gallery</a>
            <a href="../projects.html">Projects</a>
            <button id="dark-mode-toggle" aria-label="Toggle dark mode">🌙</button>
            <script>
                // Set initial button state immediately to prevent flash
                (function() {
                    const btn = document.getElementById('dark-mode-toggle');
                    const isDark = document.documentElement.classList.contains('dark-mode');
                    if (btn) {
                        btn.textContent = isDark ? '☀️' : '🌙';
                        btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
                    }
                })();
            </script>
        </nav>
    </header>

    <main class="hero inner-page">
        <div class="page-content">
            <h2 class="page-title">${data.emoji ? data.emoji + ' ' : ''}${data.title}</h2>
            ${data.subtitle ? `<p><em>${data.subtitle}</em></p>` : ''}

            ${processedContent}
            </div>
        </div>
    </main>

    <!-- image-fix: try alternate extensions / lowercase / space-replacements when an <img> fails -->
    <script>
        (function(){
            function buildCandidates(origSrc) {
                try {
                    const url = new URL(origSrc, location.href);
                    const dir = url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1);
                    const filename = url.pathname.substring(url.pathname.lastIndexOf('/') + 1);
                    const base = filename.replace(/\\.[^.]*$/, '');
                    const saneBase = base.toLowerCase().replace(/\\s+/g, '_');
                    const exts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
                    const candidates = [];
                    exts.forEach(ext => candidates.push(dir + saneBase + ext));
                    exts.forEach(ext => candidates.push(dir + base + ext));
                    candidates.push(dir + encodeURIComponent(filename));
                    return [...new Set(candidates)];
                } catch (e) {
                    return [];
                }
            }

            function tryReplace(img) {
                if (img.dataset._fixing) return;
                img.dataset._fixing = '1';
                const orig = img.dataset.origSrc || img.src;
                img.dataset.origSrc = orig;
                const candidates = buildCandidates(orig);
                let idx = 0;
                function next() {
                    if (idx >= candidates.length) return;
                    img.onerror = function() { idx++; next(); };
                    img.src = candidates[idx];
                }
                next();
            }

            document.querySelectorAll('img').forEach(img => {
                img.addEventListener('error', function onErr() {
                    img.removeEventListener('error', onErr);
                    tryReplace(img);
                });
                if (img.complete && img.naturalWidth === 0) {
                    tryReplace(img);
                }
            });
        })();
    </script>
</body>
</html>`;
};

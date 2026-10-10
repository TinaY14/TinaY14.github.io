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
    <title>${data.title} - Tina's Projects</title>

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
<link rel="stylesheet" href="../world.css">
</head>
<body class="inner-page">
    <header>
        <a href="../index.html" class="logo">Tina's Little World</a>
        <nav>
            <a href="../index.html">Home</a>
            <a href="../night_stall_food/night_stall_food.html">Night Stall Food</a>
            <a href="../food_gallery/food_gallery.html">Food Gallery</a>
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
            <h2 class="page-title">${data.title}</h2>

            ${processedContent}
            </div>
        </div>
    </main>
</body>
</html>`;
};

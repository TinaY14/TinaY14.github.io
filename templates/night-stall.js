module.exports = function(data, content) {
  // Process content to wrap H1 sections in content-entry divs
  // and convert H1 to H3
  const processedContent = content
    .replace(/<h1>/g, '</div><div class="content-entry"><h3>')
    .replace(/<\/h1>/g, '</h3>')
    .replace(/^<\/div>/, ''); // Remove leading closing div from first section

  // Build title with Chinese and English names
  const titleText = data.chineseName
    ? `${data.title} (${data.chineseName}, ${data.englishName || ''})`
    : data.title;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titleText} - Tina's Night Stall Food</title>

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
<body>
    <header>
        <div class="logo">Tina's Little World</div>
        <nav>
            <a href="../index.html">Home</a>
            <a href="../about.html">About Me</a>
            <a href="../night_stall_food.html">Night Stall Food</a>
            <a href="../food_gallery/food_gallery.html">Food Gallery</a>
            <a href="../projects.html">Projects</a>
            <a href="../contact.html">Contact</a>
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
            <h2 class="page-title">${titleText}</h2>

            ${processedContent}
            </div>
        </div>
    </main>
</body>
</html>`;
};

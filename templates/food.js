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

    <link rel="stylesheet" href="../styles.css?v=page-themes-3">
    <script src="../darkmode.js?v=page-themes-3"></script>

    <!-- Restore the saved color theme before first paint -->
    <script>
        (function() {
            let theme = 'mint';
            try { theme = localStorage.getItem('tinaTheme') || theme; } catch (_) {}
            if (!['mint', 'sky', 'peach', 'lavender', 'cream'].includes(theme)) theme = 'mint';
            document.documentElement.dataset.theme = theme;
        })();
    </script>
</head>
<body class="inner-page">
    <header>
        <a href="../index.html" class="logo">Tina's Little World</a>
        <nav>
            <a href="../index.html">Home</a>
            <a href="night_stall_food.html">Night Stall Food</a>
            <a href="../food_gallery/food_gallery.html">Food Gallery</a>
            <a href="../projects.html">Projects</a>
            <button id="dark-mode-toggle" aria-label="Change color theme">Mint</button>
            <script>
                // Set the initial theme label
                (function() {
                    const btn = document.getElementById('dark-mode-toggle');
                    const labels = { mint: 'Mint', sky: 'Sky', peach: 'Peach', lavender: 'Lavender', cream: 'Cream' };
                    const theme = document.documentElement.dataset.theme || 'mint';
                    if (btn) btn.textContent = labels[theme];
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

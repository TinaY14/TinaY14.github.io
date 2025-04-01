<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Personal Website</title>
    <!-- Add the darkmode.js script before the CSS -->
    <script src="darkmode.js"></script>
    <link rel="stylesheet" href="styles.css">
</head>
    
    // Execute this script immediately to prevent flash
(function() {
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('dark-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply the correct theme immediately
    if (savedTheme === 'true' || (savedTheme === null && prefersDark)) {
        document.documentElement.classList.add('dark-mode');
    }
})();

// Setup event handlers after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the current year for the footer copyright
    const year = new Date().getFullYear();
    document.querySelector('footer p').innerHTML = `&copy; ${year} Your Name. All rights reserved.`;
    
    // Add a simple welcome message in the console
    console.log('Welcome to my website!');
    
    // Dark mode toggle functionality
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Toggle dark mode function
    function toggleDarkMode() {
        const isDarkMode = document.documentElement.classList.toggle('dark-mode');
        localStorage.setItem('dark-mode', isDarkMode);
    }
    
    // Toggle when button is clicked
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Listen for changes in device preferences
    prefersDarkScheme.addEventListener('change', (e) => {
        if (localStorage.getItem('dark-mode') === null) {
            document.documentElement.classList.toggle('dark-mode', e.matches);
        }
    });
});

// Execute this script immediately to prevent flash
(function() {
    // Function to determine if it's night time (6 PM to 6 AM)
    function isNightTime() {
        const now = new Date();
        const hours = now.getHours();
        return hours >= 18 || hours < 6;
    }
    
    // Check for saved theme preference or use time-based preference
    const savedTheme = localStorage.getItem('dark-mode-override');
    const shouldBeDark = savedTheme !== null ? savedTheme === 'true' : isNightTime();
    
    // Apply the correct theme immediately
    if (shouldBeDark) {
        document.documentElement.classList.add('dark-mode');
    }
    
    // Add inner-page class to body if not on homepage
    const isHomepage = window.location.pathname.endsWith('index.html') || 
                      window.location.pathname === '/' || 
                      window.location.pathname.endsWith('/');
    
    if (!isHomepage) {
        document.body.classList.add('inner-page');
    }
})();

// Setup event handlers after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Dark mode toggle functionality
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (!darkModeToggle) return; // Exit if toggle button not found
    
    // Function to update toggle button icon
    function updateToggleIcon() {
        const isDarkMode = document.documentElement.classList.contains('dark-mode');
        // Show sun when in dark mode (click to go to light), moon when in light mode (click to go to dark)
        darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
        darkModeToggle.setAttribute('title', isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
    }
    
    // Function to determine if it's night time
    function isNightTime() {
        const now = new Date();
        const hours = now.getHours();
        return hours >= 18 || hours < 6;
    }
    
    // Initialize the toggle icon
    updateToggleIcon();
    
    // Toggle dark mode function
    function toggleDarkMode() {
        const isDarkMode = document.documentElement.classList.toggle('dark-mode');
        localStorage.setItem('dark-mode-override', isDarkMode.toString());
        updateToggleIcon();
        console.log('Dark mode toggled:', isDarkMode ? 'ON' : 'OFF'); // Debug log
    }
    
    // Toggle when button is clicked
    darkModeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleDarkMode();
    });
    
    // Auto-switch every hour if no manual override
    setInterval(() => {
        const hasOverride = localStorage.getItem('dark-mode-override') !== null;
        if (!hasOverride) {
            const shouldBeDark = isNightTime();
            const isDarkMode = document.documentElement.classList.contains('dark-mode');
            
            if (shouldBeDark !== isDarkMode) {
                document.documentElement.classList.toggle('dark-mode', shouldBeDark);
                updateToggleIcon();
            }
        }
    }, 3600000); // Check every hour
});

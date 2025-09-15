// Execute this script immediately to prevent flash
(function() {
    // Function to determine if it should be dark mode based on time
    function shouldBeDarkMode() {
        const hour = new Date().getHours();
        // Dark mode from 6 PM (18) to 6 AM (6)
        return hour >= 18 || hour < 6;
    }

    // Check for manual override or use time-based determination
    const manualOverride = localStorage.getItem('dark-mode-override');
    let isDarkMode;
    
    if (manualOverride !== null) {
        isDarkMode = manualOverride === 'true';
    } else {
        isDarkMode = shouldBeDarkMode();
    }
    
    // Apply the correct theme immediately
    if (isDarkMode) {
        document.documentElement.classList.add('dark-mode');
    }

    // Add non-homepage class to body if not on index page
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
        document.body.classList.add('non-homepage');
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
    
    if (!darkModeToggle) return; // Exit if toggle button doesn't exist
    
    // Function to update toggle button icon
    function updateToggleIcon() {
        const isDark = document.documentElement.classList.contains('dark-mode');
        darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    }
    
    // Function to determine if it should be dark mode based on time
    function shouldBeDarkMode() {
        const hour = new Date().getHours();
        return hour >= 18 || hour < 6;
    }
    
    // Toggle dark mode function
    function toggleDarkMode() {
        const isDarkMode = document.documentElement.classList.toggle('dark-mode');
        localStorage.setItem('dark-mode-override', isDarkMode);
        updateToggleIcon();
    }
    
    // Auto update based on time (check every minute)
    function autoUpdateDarkMode() {
        const manualOverride = localStorage.getItem('dark-mode-override');
        if (manualOverride === null) { // Only auto-update if no manual override
            const shouldBeDark = shouldBeDarkMode();
            const isDark = document.documentElement.classList.contains('dark-mode');
            
            if (shouldBeDark !== isDark) {
                document.documentElement.classList.toggle('dark-mode', shouldBeDark);
                updateToggleIcon();
            }
        }
    }
    
    // Initial icon update
    updateToggleIcon();
    
    // Toggle when button is clicked
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Check time every minute for automatic switching
    setInterval(autoUpdateDarkMode, 60000);
    
    // Reset manual override at midnight to allow natural cycling
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;
    setTimeout(() => {
        localStorage.removeItem('dark-mode-override');
        autoUpdateDarkMode();
        // Set daily reset
        setInterval(() => {
            localStorage.removeItem('dark-mode-override');
            autoUpdateDarkMode();
        }, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
});

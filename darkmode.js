// Dark Mode Toggle Script with Time-Based Auto-Switching
(function() {
    'use strict';
    
    // Function to determine if it's night time (6 PM to 6 AM)
    function isNightTime() {
        const now = new Date();
        const hours = now.getHours();
        return hours >= 18 || hours < 6;
    }
    
    // Check if current page is inner page (not homepage)
    function isInnerPage() {
        const path = window.location.pathname;
        const isHomepage = path === '/' || 
                          path.endsWith('/index.html') ||
                          path === '/index.html' ||
                          (path.endsWith('/') && !path.includes('food_gallery') && !path.includes('night_stall_food'));
        return !isHomepage;
    }
    
    // Initialize dark mode on page load
    function initDarkMode() {
        // Add inner-page class if needed
        if (isInnerPage()) {
            document.body.classList.add('inner-page');
            console.log('Inner page detected, added inner-page class');
        }
        
        // Check if user has manually overridden (clicked button before)
        const manualOverride = localStorage.getItem('darkModeManualOverride');
        const savedMode = localStorage.getItem('darkMode');
        
        let shouldBeDark;
        
        if (manualOverride === 'true') {
            // User has manually chosen, use their preference
            shouldBeDark = savedMode === 'true';
            console.log('Using manual preference:', shouldBeDark ? 'DARK' : 'LIGHT');
        } else {
            // No manual override, use time-based + system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const timeBasedDark = isNightTime();
            shouldBeDark = timeBasedDark || prefersDark;
            console.log('Using auto-detection - Time-based:', timeBasedDark, 'System-based:', prefersDark);
        }
        
        // Apply dark mode class
        if (shouldBeDark) {
            document.documentElement.classList.add('dark-mode');
        }
    }
    
    // Update button icon based on current mode
    function updateIcon(button) {
        if (!button) return;
        
        const isDark = document.documentElement.classList.contains('dark-mode');
        button.textContent = isDark ? '☀️' : '🌙';
        button.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        
        // Show if mode is manual or automatic
        const isManual = localStorage.getItem('darkModeManualOverride') === 'true';
        console.log('Current mode:', isDark ? 'DARK' : 'LIGHT', '| Control:', isManual ? 'MANUAL' : 'AUTO');
    }
    
    // Toggle dark mode manually
    function toggleDarkMode() {
        const html = document.documentElement;
        const isDarkNow = html.classList.toggle('dark-mode');
        
        // Save user preference and mark as manual override
        localStorage.setItem('darkMode', isDarkNow.toString());
        localStorage.setItem('darkModeManualOverride', 'true');
        
        // Update all toggle buttons on the page
        const buttons = document.querySelectorAll('#dark-mode-toggle');
        buttons.forEach(updateIcon);
        
        console.log('Manual toggle - Dark mode:', isDarkNow ? 'ON' : 'OFF');
        console.log('Auto-switching disabled until page refresh');
    }
    
    // Auto-switch based on time (only if no manual override)
    function checkAutoSwitch() {
        const manualOverride = localStorage.getItem('darkModeManualOverride');
        
        if (manualOverride !== 'true') {
            const shouldBeDark = isNightTime();
            const isDark = document.documentElement.classList.contains('dark-mode');
            
            if (shouldBeDark !== isDark) {
                document.documentElement.classList.toggle('dark-mode', shouldBeDark);
                
                // Update button icon
                const buttons = document.querySelectorAll('#dark-mode-toggle');
                buttons.forEach(updateIcon);
                
                console.log('Auto-switched to:', shouldBeDark ? 'DARK' : 'LIGHT', 'mode at', new Date().toLocaleTimeString());
            }
        }
    }
    
    // Initialize immediately (before DOM loads)
    initDarkMode();
    
    // Setup when DOM is ready
    function setupDarkModeToggle() {
        const toggleButton = document.getElementById('dark-mode-toggle');
        
        if (toggleButton) {
            // Set initial icon
            updateIcon(toggleButton);
            
            // Remove any existing event listeners to prevent duplicates
            toggleButton.removeEventListener('click', toggleDarkMode);
            toggleButton.removeEventListener('dblclick', resetToAutoMode);
            
            // Add click event for manual toggle
            toggleButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleDarkMode();
            });
            
            // Double-click to reset to automatic mode
            toggleButton.addEventListener('dblclick', function(e) {
                e.preventDefault();
                resetToAutoMode();
            });
            
            console.log('Dark mode toggle initialized for button:', toggleButton);
            console.log('💡 Tip: Double-click the button to reset to automatic time-based switching');
        } else {
            console.warn('Dark mode toggle button (#dark-mode-toggle) not found on this page');
        }
    }
    
    function resetToAutoMode() {
        localStorage.removeItem('darkModeManualOverride');
        localStorage.removeItem('darkMode');
        console.log('Reset to automatic mode - page will refresh');
        location.reload();
    }
    
    // Run setup when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupDarkModeToggle);
    } else {
        // DOM is already ready
        setupDarkModeToggle();
    }
    
    // Start auto-switching check (every 30 minutes)
    setInterval(checkAutoSwitch, 1800000); // 30 minutes = 1800000ms
    
    // Also check on the hour (more precise timing)
    const now = new Date();
    const msUntilNextHour = (60 - now.getMinutes()) * 60000 - (now.getSeconds() * 1000);
    setTimeout(() => {
        checkAutoSwitch();
        setInterval(checkAutoSwitch, 3600000); // Then every hour
    }, msUntilNextHour);
    
    console.log('Dark mode script loaded successfully');
})();

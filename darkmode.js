// Dark Mode Toggle Script
(function() {
    'use strict';
    
    // Initialize dark mode on page load
    function initDarkMode() {
        // Check if user has a saved preference
        const savedMode = localStorage.getItem('darkMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Determine if we should start in dark mode
        const shouldBeDark = savedMode ? savedMode === 'true' : prefersDark;
        
        // Apply dark mode class
        if (shouldBeDark) {
            document.documentElement.classList.add('dark-mode');
        }
        
        // Add inner-page class for non-homepage
        const isHomepage = window.location.pathname === '/' || 
                          window.location.pathname.endsWith('/index.html') ||
                          window.location.pathname.endsWith('/');
        if (!isHomepage) {
            document.body.classList.add('inner-page');
        }
    }
    
    // Update button icon based on current mode
    function updateIcon(button) {
        const isDark = document.documentElement.classList.contains('dark-mode');
        button.textContent = isDark ? '☀️' : '🌙';
        button.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }
    
    // Toggle dark mode
    function toggleDarkMode() {
        const html = document.documentElement;
        const isDarkNow = html.classList.toggle('dark-mode');
        
        // Save user preference
        localStorage.setItem('darkMode', isDarkNow.toString());
        
        // Update all toggle buttons on the page
        const buttons = document.querySelectorAll('#dark-mode-toggle');
        buttons.forEach(updateIcon);
        
        console.log('Dark mode toggled:', isDarkNow ? 'ON' : 'OFF');
    }
    
    // Initialize immediately
    initDarkMode();
    
    // Setup when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        const toggleButton = document.getElementById('dark-mode-toggle');
        
        if (toggleButton) {
            // Set initial icon
            updateIcon(toggleButton);
            
            // Add click event
            toggleButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleDarkMode();
            });
            
            console.log('Dark mode toggle initialized');
        } else {
            console.warn('Dark mode toggle button not found');
        }
    });
})();

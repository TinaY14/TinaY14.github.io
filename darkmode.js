// Dark Mode Toggle Script - Simplified and Fixed
(function() {
    'use strict';
    
    console.log('Dark mode script starting...');
    
    // Function to determine if current page is an inner page
    function isInnerPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        // Homepage patterns
        const isHomepage = filename === 'index.html' || 
                          filename === '' || 
                          path === '/' ||
                          path.endsWith('/') ||
                          path.endsWith('TinaY14.github.io') ||
                          path.endsWith('TinaY14.github.io/');
        
        console.log('Page check - Path:', path, 'Filename:', filename, 'Is Homepage:', isHomepage);
        return !isHomepage;
    }
    
    // Initialize dark mode state
    function initDarkMode() {
        console.log('Initializing dark mode...');
        
        // Add inner-page class if needed
        if (isInnerPage()) {
            document.body.classList.add('inner-page');
            console.log('Added inner-page class to body');
        }
        
        // Check saved preference
        const savedMode = localStorage.getItem('darkMode');
        console.log('Saved dark mode preference:', savedMode);
        
        if (savedMode === 'true') {
            document.documentElement.classList.add('dark-mode');
            console.log('Applied dark mode from saved preference');
        }
    }
    
    // Update button appearance
    function updateButton(button) {
        if (!button) {
            console.warn('Button not found for update');
            return;
        }
        
        const isDark = document.documentElement.classList.contains('dark-mode');
        button.textContent = isDark ? '☀️' : '🌙';
        button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        button.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        console.log('Button updated - Dark mode:', isDark, 'Button text:', button.textContent);
    }
    
    // Toggle dark mode
    function toggleDarkMode() {
        console.log('Toggle dark mode called');
        
        const html = document.documentElement;
        const isDarkNow = html.classList.toggle('dark-mode');
        
        // Save preference
        localStorage.setItem('darkMode', isDarkNow.toString());
        
        // Update button
        const button = document.getElementById('dark-mode-toggle');
        updateButton(button);
        
        console.log('Dark mode toggled to:', isDarkNow ? 'ON' : 'OFF');
    }
    
    // Setup the toggle button - SIMPLIFIED
    function setupToggleButton() {
        console.log('Setting up toggle button...');
        
        const button = document.getElementById('dark-mode-toggle');
        
        if (button) {
            console.log('Dark mode button found:', button);
            
            // Clear any existing listeners
            button.onclick = null;
            
            // Add simple click listener
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Button clicked!');
                toggleDarkMode();
            });
            
            // Update initial appearance
            updateButton(button);
            
            console.log('Dark mode toggle setup completed');
        } else {
            console.error('Dark mode toggle button (#dark-mode-toggle) not found!');
        }
    }
    
    // Initialize everything
    function initialize() {
        console.log('Initializing dark mode system...');
        initDarkMode();
        
        // Setup button after a short delay to ensure DOM is ready
        setTimeout(setupToggleButton, 100);
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    console.log('Dark mode script loaded');
})();

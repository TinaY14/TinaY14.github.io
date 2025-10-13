// Dark Mode Toggle Script - Enhanced for all pages
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
        
        // Update all buttons on page
        const buttons = document.querySelectorAll('#dark-mode-toggle');
        console.log('Found', buttons.length, 'toggle buttons');
        buttons.forEach(updateButton);
        
        console.log('Dark mode toggled to:', isDarkNow ? 'ON' : 'OFF');
        
        // Force a small delay to ensure CSS updates
        setTimeout(() => {
            console.log('Dark mode state after toggle:', document.documentElement.classList.contains('dark-mode'));
        }, 100);
    }
    
    // Setup the toggle button
    function setupToggleButton() {
        console.log('Setting up toggle button...');
        
        // Wait a bit more for button to be available
        setTimeout(() => {
            const button = document.getElementById('dark-mode-toggle');
            
            if (button) {
                console.log('Dark mode button found:', button);
                
                // Remove existing listeners to prevent duplicates
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // Add click listener to the new button
                newButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Button clicked!');
                    toggleDarkMode();
                });
                
                // Update initial appearance
                updateButton(newButton);
                
                console.log('Dark mode toggle setup completed');
            } else {
                console.error('Dark mode toggle button (#dark-mode-toggle) not found!');
                console.log('Available elements with IDs:', 
                    Array.from(document.querySelectorAll('[id]')).map(el => el.id));
            }
        }, 500);
    }
    
    // Initialize everything
    function initialize() {
        console.log('Initializing dark mode system...');
        initDarkMode();
        setupToggleButton();
    }
    
    // Multiple initialization strategies to ensure it works
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Also try after window load as backup
    window.addEventListener('load', function() {
        console.log('Window loaded, checking dark mode setup...');
        const button = document.getElementById('dark-mode-toggle');
        if (button && !button.onclick && !button.hasAttribute('data-setup')) {
            console.log('Button found but not set up, initializing...');
            button.setAttribute('data-setup', 'true');
            setupToggleButton();
        }
    });
    
    console.log('Dark mode script loaded');
})();

document.addEventListener('DOMContentLoaded', function() {
    // Get the current year for the footer copyright
    const year = new Date().getFullYear();
    document.querySelector('footer p').innerHTML = `&copy; ${year} Your Name. All rights reserved.`;
    
    // Add a simple welcome message in the console
    console.log('Welcome to my website!');
});


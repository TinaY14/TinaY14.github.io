// Cute Pig Companion - walks along curved path as the user scrolls
(function() {
    const pig = document.getElementById('pig-companion');
    const pathContainer = document.getElementById('pig-path-container');
    const pathSvg = document.getElementById('pig-path-svg');
    const gardenPath = document.getElementById('garden-path');
    const gardenPathBorder = document.getElementById('garden-path-border');
    
    if (!pig || !pathContainer || !pathSvg || !gardenPath) return;

    let lastScrollY = window.scrollY;
    let isWalking = false;
    let walkingTimeout;
    
    const PATH_START_Y = 150;
    const CURVE_LENGTH = 300;
    const CURVE_AMPLITUDE = 30; // How far left/right the curve goes

    // Generate curved path based on page height
    function generatePath() {
        const pageHeight = document.documentElement.scrollHeight;
        const pathWidth = 80;
        
        // Set container and SVG height to match page
        pathContainer.style.height = pageHeight + 'px';
        pathSvg.setAttribute('viewBox', `0 0 ${pathWidth} ${pageHeight}`);
        pathSvg.style.height = pageHeight + 'px';
        
        // Generate a wavy path
        const numCurves = Math.ceil((pageHeight - PATH_START_Y) / CURVE_LENGTH);
        let pathD = `M 40,${PATH_START_Y}`;
        
        for (let i = 0; i < numCurves; i++) {
            const curveStartY = PATH_START_Y + i * CURVE_LENGTH;
            const midY = curveStartY + CURVE_LENGTH / 2;
            const endY = curveStartY + CURVE_LENGTH;
            
            // Alternate curve direction
            const curveX = i % 2 === 0 ? 40 + CURVE_AMPLITUDE : 40 - CURVE_AMPLITUDE;
            
            pathD += ` Q ${curveX},${midY} 40,${endY}`;
        }
        
        gardenPath.setAttribute('d', pathD);
        gardenPathBorder.setAttribute('d', pathD);
        
        // Add flowers along the path
        addFlowers(pageHeight);
    }
    
    // Add flowers along the path
    function addFlowers(pageHeight) {
        const flowers = ['🌸', '🌷', '🌼', '🌺', '🌻', '🏵️', '💐', '🌹'];
        const existingFlowers = pathContainer.querySelectorAll('.flower');
        existingFlowers.forEach(f => f.remove());
        
        const numFlowers = Math.ceil((pageHeight - PATH_START_Y) / 120);
        
        for (let i = 0; i < numFlowers; i++) {
            const flower = document.createElement('span');
            flower.className = 'flower';
            flower.textContent = flowers[i % flowers.length];
            flower.style.top = (PATH_START_Y + i * 120 + 30) + 'px';
            flower.style.left = (i % 2 === 0 ? '-5px' : '65px');
            pathContainer.appendChild(flower);
        }
    }
    
    // Get X position on the curved path for a given Y position
    function getPathXForY(pageY) {
        // Adjust for path start
        const adjustedY = pageY - PATH_START_Y;
        if (adjustedY < 0) return 40; // Before path starts, center position
        
        // Which curve segment are we in?
        const curveIndex = Math.floor(adjustedY / CURVE_LENGTH);
        // Progress within this curve (0 to 1)
        const t = (adjustedY % CURVE_LENGTH) / CURVE_LENGTH;
        
        // Quadratic bezier: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
        // P0 = 40 (start), P1 = curveX (control point), P2 = 40 (end)
        const curveX = curveIndex % 2 === 0 ? 40 + CURVE_AMPLITUDE : 40 - CURVE_AMPLITUDE;
        
        const x = (1-t)*(1-t)*40 + 2*(1-t)*t*curveX + t*t*40;
        
        return x;
    }

    function updatePig() {
        const scrollY = window.scrollY;
        const scrollDelta = scrollY - lastScrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        
        // Calculate scroll progress (0 to 1)
        const scrollProgress = documentHeight > 0 ? scrollY / documentHeight : 0;
        
        // Pig's Y position on the page (not viewport)
        const pageHeight = document.documentElement.scrollHeight;
        const pigPageY = PATH_START_Y + scrollProgress * (pageHeight - PATH_START_Y - 100);
        
        // Get X position from curved path
        const pathX = getPathXForY(pigPageY);
        
        // Convert page Y to viewport position for fixed element
        const pigViewportY = pigPageY - scrollY;
        
        // Position the pig
        pig.style.top = pigViewportY + 'px';
        pig.style.transform = 'translateY(-50%)';
        
        // Position pig on the path (pathX is 0-80, we need to convert to right position)
        // Path container is 80px wide, positioned at right: 20px
        // So pig's right = 20 + (80 - pathX) - pigWidth/2
        const pigWidth = 60;
        const pathContainerRight = 20;
        const pigRight = pathContainerRight + (80 - pathX) - pigWidth/2;
        pig.style.right = pigRight + 'px';

        // Start walking animation when scrolling
        if (Math.abs(scrollDelta) > 0) {
            if (!isWalking) {
                pig.classList.add('walking');
                isWalking = true;
            }
            
            clearTimeout(walkingTimeout);
            
            walkingTimeout = setTimeout(() => {
                pig.classList.remove('walking');
                isWalking = false;
            }, 150);
        }

        lastScrollY = scrollY;
    }

    // Initialize
    generatePath();
    updatePig();
    
    // Listen to scroll events
    window.addEventListener('scroll', updatePig, { passive: true });
    
    // Regenerate path on resize
    window.addEventListener('resize', () => {
        generatePath();
        updatePig();
    });
})();

// Interactive Floating Vegetables
(function() {
    // Only run on homepage
    if (document.body.classList.contains('inner-page')) return;

    const vegetables = ['🥕', '🥦', '🥬', '🌽', '🍅', '🥒', '🌶️', '🧄', '🧅', '🥔', '🍆', '🫑', '🥗', '🥑'];
    const container = document.getElementById('veggie-container');
    const basket = document.getElementById('veggie-basket');
    const basketCount = basket?.querySelector('.basket-count');

    if (!container || !basket) return;

    let pickedCount = 0;
    let veggieElements = [];
    const NUM_VEGGIES = 12;

    // Create hint element
    const hint = document.createElement('div');
    hint.className = 'veggie-hint';
    hint.textContent = 'Grab and drag vegetables, or click to pick them!';
    document.body.appendChild(hint);

    // Show hint briefly
    setTimeout(() => hint.classList.add('show'), 1000);
    setTimeout(() => hint.classList.remove('show'), 5000);

    // Create vegetables
    function createVeggie() {
        const veggie = document.createElement('div');
        veggie.className = 'veggie floating';
        veggie.textContent = vegetables[Math.floor(Math.random() * vegetables.length)];

        // Random position
        const x = Math.random() * (window.innerWidth - 60);
        const y = Math.random() * (window.innerHeight - 60);
        veggie.style.left = x + 'px';
        veggie.style.top = y + 'px';

        // Random animation delay for varied floating
        veggie.style.animationDelay = (Math.random() * 4) + 's';
        veggie.style.animationDuration = (3 + Math.random() * 2) + 's';

        // Store velocity for physics
        veggie.vx = (Math.random() - 0.5) * 2;
        veggie.vy = (Math.random() - 0.5) * 2;

        container.appendChild(veggie);
        veggieElements.push(veggie);

        // Add event listeners
        addVeggieInteraction(veggie);

        return veggie;
    }

    // Add drag and click interaction
    function addVeggieInteraction(veggie) {
        let isDragging = false;
        let startX, startY, initialX, initialY;
        let hasMoved = false;

        // Mouse events
        veggie.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);

        // Touch events
        veggie.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', endDrag);

        function startDrag(e) {
            if (veggie.classList.contains('picked')) return;

            isDragging = true;
            hasMoved = false;
            veggie.classList.add('dragging');
            veggie.classList.remove('floating');

            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            startX = clientX;
            startY = clientY;
            initialX = veggie.offsetLeft;
            initialY = veggie.offsetTop;

            if (e.type.includes('touch')) {
                e.preventDefault();
            }
        }

        function drag(e) {
            if (!isDragging) return;

            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            const dx = clientX - startX;
            const dy = clientY - startY;

            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                hasMoved = true;
            }

            let newX = initialX + dx;
            let newY = initialY + dy;

            // Keep within bounds
            newX = Math.max(0, Math.min(window.innerWidth - 50, newX));
            newY = Math.max(0, Math.min(window.innerHeight - 50, newY));

            veggie.style.left = newX + 'px';
            veggie.style.top = newY + 'px';

            // Update velocity based on movement
            veggie.vx = dx * 0.1;
            veggie.vy = dy * 0.1;

            if (e.type.includes('touch')) {
                e.preventDefault();
            }
        }

        function endDrag(e) {
            if (!isDragging) return;

            isDragging = false;
            veggie.classList.remove('dragging');

            // If didn't move much, treat as click (pick)
            if (!hasMoved) {
                pickVeggie(veggie);
            } else {
                // Resume floating animation after a delay
                setTimeout(() => {
                    if (!veggie.classList.contains('picked')) {
                        veggie.classList.add('floating');
                    }
                }, 500);
            }
        }
    }

    // Pick a vegetable (click interaction)
    function pickVeggie(veggie) {
        if (veggie.classList.contains('picked')) return;

        veggie.classList.add('picked');
        veggie.classList.remove('floating', 'dragging');

        // Update count
        pickedCount++;
        if (basketCount) {
            basketCount.textContent = pickedCount;
        }

        // Bounce basket animation
        basket.classList.remove('bounce');
        void basket.offsetWidth; // Trigger reflow
        basket.classList.add('bounce');

        // Remove veggie after animation and spawn new one
        setTimeout(() => {
            const index = veggieElements.indexOf(veggie);
            if (index > -1) {
                veggieElements.splice(index, 1);
            }
            veggie.remove();

            // Spawn a new veggie after picking
            setTimeout(() => {
                createVeggie();
            }, 1000);
        }, 500);
    }

    // Gentle drift animation
    function animateVeggies() {
        veggieElements.forEach(veggie => {
            if (veggie.classList.contains('dragging') || veggie.classList.contains('picked')) return;

            let x = parseFloat(veggie.style.left) || 0;
            let y = parseFloat(veggie.style.top) || 0;

            // Apply gentle velocity
            x += veggie.vx * 0.5;
            y += veggie.vy * 0.5;

            // Bounce off edges
            if (x <= 0 || x >= window.innerWidth - 50) {
                veggie.vx *= -0.8;
                x = Math.max(0, Math.min(window.innerWidth - 50, x));
            }
            if (y <= 0 || y >= window.innerHeight - 50) {
                veggie.vy *= -0.8;
                y = Math.max(0, Math.min(window.innerHeight - 50, y));
            }

            // Gradually slow down
            veggie.vx *= 0.99;
            veggie.vy *= 0.99;

            // Add slight random movement
            if (Math.random() < 0.02) {
                veggie.vx += (Math.random() - 0.5) * 0.5;
                veggie.vy += (Math.random() - 0.5) * 0.5;
            }

            veggie.style.left = x + 'px';
            veggie.style.top = y + 'px';
        });

        requestAnimationFrame(animateVeggies);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        veggieElements.forEach(veggie => {
            let x = parseFloat(veggie.style.left) || 0;
            let y = parseFloat(veggie.style.top) || 0;

            x = Math.min(x, window.innerWidth - 50);
            y = Math.min(y, window.innerHeight - 50);

            veggie.style.left = x + 'px';
            veggie.style.top = y + 'px';
        });
    });

    // Initialize
    for (let i = 0; i < NUM_VEGGIES; i++) {
        setTimeout(() => createVeggie(), i * 100);
    }

    // Start animation loop
    animateVeggies();
})();

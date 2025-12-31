// Food Nutrition Sorting Game
(function() {
    // Only run on homepage
    if (document.body.classList.contains('inner-page')) return;

    const container = document.getElementById('veggie-container');
    if (!container) return;

    // Food items with their categories
    const foodItems = [
        // Grains
        { emoji: '🍞', name: 'Bread', category: 'grains' },
        { emoji: '🍚', name: 'Rice', category: 'grains' },
        { emoji: '🍜', name: 'Noodles', category: 'grains' },
        { emoji: '🥐', name: 'Croissant', category: 'grains' },
        { emoji: '🥯', name: 'Bagel', category: 'grains' },
        // Protein
        { emoji: '🥩', name: 'Steak', category: 'protein' },
        { emoji: '🍗', name: 'Chicken', category: 'protein' },
        { emoji: '🥚', name: 'Egg', category: 'protein' },
        { emoji: '🐟', name: 'Fish', category: 'protein' },
        { emoji: '🥜', name: 'Nuts', category: 'protein' },
        // Dairy
        { emoji: '🥛', name: 'Milk', category: 'dairy' },
        { emoji: '🧀', name: 'Cheese', category: 'dairy' },
        { emoji: '🧈', name: 'Butter', category: 'dairy' },
        { emoji: '🍦', name: 'Ice Cream', category: 'dairy' },
        { emoji: '🥧', name: 'Cream Pie', category: 'dairy' },
        // Fruits
        { emoji: '🍎', name: 'Apple', category: 'fruits' },
        { emoji: '🍌', name: 'Banana', category: 'fruits' },
        { emoji: '🍊', name: 'Orange', category: 'fruits' },
        { emoji: '🍇', name: 'Grapes', category: 'fruits' },
        { emoji: '🍓', name: 'Strawberry', category: 'fruits' },
        // Vegetables
        { emoji: '🥕', name: 'Carrot', category: 'vegetables' },
        { emoji: '🥦', name: 'Broccoli', category: 'vegetables' },
        { emoji: '🥬', name: 'Lettuce', category: 'vegetables' },
        { emoji: '🌽', name: 'Corn', category: 'vegetables' },
        { emoji: '🥒', name: 'Cucumber', category: 'vegetables' },
    ];

    const categories = [
        { id: 'grains', name: 'Grains', icon: '🌾' },
        { id: 'protein', name: 'Protein', icon: '🥩' },
        { id: 'dairy', name: 'Dairy', icon: '🥛' },
        { id: 'fruits', name: 'Fruits', icon: '🍎' },
        { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
    ];

    let score = 0;
    let totalFoods = 0;
    let sortedFoods = 0;
    let foodElements = [];
    let baskets = {};
    let gameStarted = false;

    // Create game UI
    function createGameUI() {
        // Create baskets container
        const basketsContainer = document.createElement('div');
        basketsContainer.className = 'food-baskets';
        basketsContainer.id = 'food-baskets';

        categories.forEach(cat => {
            const basket = document.createElement('div');
            basket.className = 'food-basket';
            basket.dataset.category = cat.id;
            basket.innerHTML = `
                <div class="basket-icon">${cat.icon}</div>
                <div class="basket-label">${cat.name}</div>
            `;
            basketsContainer.appendChild(basket);
            baskets[cat.id] = basket;
        });

        document.body.appendChild(basketsContainer);

        // Create score display
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'game-score';
        scoreDisplay.id = 'game-score';
        scoreDisplay.innerHTML = `
            <div class="score-label">Score</div>
            <div class="score-value" id="score-value">0</div>
            <div class="score-progress" id="score-progress">0 / 0</div>
        `;
        document.body.appendChild(scoreDisplay);

        // Create hint
        const hint = document.createElement('div');
        hint.className = 'game-hint';
        hint.id = 'game-hint';
        hint.textContent = 'Drag food to the correct food group basket!';
        document.body.appendChild(hint);

        // Show hint briefly
        setTimeout(() => hint.classList.add('show'), 500);
        setTimeout(() => hint.classList.remove('show'), 4000);

        // Create feedback display
        const feedback = document.createElement('div');
        feedback.className = 'game-feedback';
        feedback.id = 'game-feedback';
        document.body.appendChild(feedback);

        // Create win screen
        const winScreen = document.createElement('div');
        winScreen.className = 'win-screen';
        winScreen.id = 'win-screen';
        winScreen.innerHTML = `
            <div class="win-content">
                <div class="win-title">Great Job!</div>
                <div class="win-score">You scored <span id="final-score">0</span> points!</div>
                <div class="win-message">You sorted all the foods correctly!</div>
                <button class="play-again-btn" id="play-again">Play Again</button>
            </div>
        `;
        document.body.appendChild(winScreen);

        document.getElementById('play-again').addEventListener('click', resetGame);
    }

    // Create a food item
    function createFood(foodData) {
        const food = document.createElement('div');
        food.className = 'food-item floating';
        food.textContent = foodData.emoji;
        food.dataset.category = foodData.category;
        food.dataset.name = foodData.name;

        // Random position in upper area (not overlapping baskets)
        const maxY = window.innerHeight * 0.55; // Keep above baskets
        const x = 50 + Math.random() * (window.innerWidth - 100);
        const y = 50 + Math.random() * (maxY - 100);
        food.style.left = x + 'px';
        food.style.top = y + 'px';

        // Random animation timing
        food.style.animationDelay = (Math.random() * 3) + 's';
        food.style.animationDuration = (3 + Math.random() * 2) + 's';

        // Physics properties
        food.vx = (Math.random() - 0.5) * 1.5;
        food.vy = (Math.random() - 0.5) * 1.5;

        container.appendChild(food);
        foodElements.push(food);

        addFoodInteraction(food);
        return food;
    }

    // Add drag interaction to food
    function addFoodInteraction(food) {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        food.addEventListener('mousedown', startDrag);
        food.addEventListener('touchstart', startDrag, { passive: false });

        function startDrag(e) {
            if (food.classList.contains('sorted') || food.classList.contains('returning')) return;

            isDragging = true;
            food.classList.add('dragging');
            food.classList.remove('floating');

            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            startX = clientX;
            startY = clientY;
            initialX = food.offsetLeft;
            initialY = food.offsetTop;

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('touchend', endDrag);

            if (e.type.includes('touch')) e.preventDefault();
        }

        function drag(e) {
            if (!isDragging) return;

            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            let newX = initialX + (clientX - startX);
            let newY = initialY + (clientY - startY);

            // Keep within bounds
            newX = Math.max(0, Math.min(window.innerWidth - 50, newX));
            newY = Math.max(0, Math.min(window.innerHeight - 50, newY));

            food.style.left = newX + 'px';
            food.style.top = newY + 'px';

            // Highlight basket on hover
            highlightBasketUnderFood(newX + 25, newY + 25);

            if (e.type.includes('touch')) e.preventDefault();
        }

        function endDrag(e) {
            if (!isDragging) return;

            isDragging = false;
            food.classList.remove('dragging');

            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('touchend', endDrag);

            clearBasketHighlights();

            // Check if dropped on a basket
            const foodRect = food.getBoundingClientRect();
            const foodCenterX = foodRect.left + foodRect.width / 2;
            const foodCenterY = foodRect.top + foodRect.height / 2;

            let droppedOnBasket = null;
            for (const [catId, basket] of Object.entries(baskets)) {
                const basketRect = basket.getBoundingClientRect();
                if (foodCenterX >= basketRect.left && foodCenterX <= basketRect.right &&
                    foodCenterY >= basketRect.top && foodCenterY <= basketRect.bottom) {
                    droppedOnBasket = catId;
                    break;
                }
            }

            if (droppedOnBasket) {
                checkAnswer(food, droppedOnBasket);
            } else {
                // Not dropped on basket, resume floating
                food.classList.add('floating');
            }
        }
    }

    // Highlight basket when food hovers over it
    function highlightBasketUnderFood(x, y) {
        clearBasketHighlights();
        for (const basket of Object.values(baskets)) {
            const rect = basket.getBoundingClientRect();
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                basket.classList.add('highlight');
                break;
            }
        }
    }

    function clearBasketHighlights() {
        Object.values(baskets).forEach(b => b.classList.remove('highlight'));
    }

    // Check if answer is correct
    function checkAnswer(food, basketCategory) {
        const correctCategory = food.dataset.category;
        const feedback = document.getElementById('game-feedback');

        if (basketCategory === correctCategory) {
            // Correct!
            score++;
            sortedFoods++;
            updateScore();

            food.classList.add('sorted', 'correct');
            showFeedback('Correct! +1', 'correct');
            baskets[basketCategory].classList.add('correct-drop');
            setTimeout(() => baskets[basketCategory].classList.remove('correct-drop'), 500);

            // Remove food after animation
            setTimeout(() => {
                const index = foodElements.indexOf(food);
                if (index > -1) foodElements.splice(index, 1);
                food.remove();

                // Check if game is won
                if (sortedFoods >= totalFoods) {
                    showWinScreen();
                }
            }, 400);

        } else {
            // Wrong!
            showFeedback('Wrong! Try again', 'wrong');
            baskets[basketCategory].classList.add('wrong-drop');
            setTimeout(() => baskets[basketCategory].classList.remove('wrong-drop'), 500);

            // Food bounces back
            food.classList.add('returning');
            const returnX = 50 + Math.random() * (window.innerWidth - 100);
            const returnY = 50 + Math.random() * (window.innerHeight * 0.4);

            food.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            food.style.left = returnX + 'px';
            food.style.top = returnY + 'px';

            setTimeout(() => {
                food.classList.remove('returning');
                food.style.transition = '';
                food.classList.add('floating');
                // Give it new random velocity
                food.vx = (Math.random() - 0.5) * 1.5;
                food.vy = (Math.random() - 0.5) * 1.5;
            }, 600);
        }
    }

    // Show feedback message
    function showFeedback(message, type) {
        const feedback = document.getElementById('game-feedback');
        feedback.textContent = message;
        feedback.className = 'game-feedback show ' + type;
        setTimeout(() => feedback.classList.remove('show'), 1500);
    }

    // Update score display
    function updateScore() {
        document.getElementById('score-value').textContent = score;
        document.getElementById('score-progress').textContent = `${sortedFoods} / ${totalFoods}`;
    }

    // Show win screen
    function showWinScreen() {
        document.getElementById('final-score').textContent = score;
        document.getElementById('win-screen').classList.add('show');
    }

    // Reset game
    function resetGame() {
        // Clear existing foods
        foodElements.forEach(f => f.remove());
        foodElements = [];
        score = 0;
        sortedFoods = 0;

        document.getElementById('win-screen').classList.remove('show');

        // Create new foods
        initFoods();
        updateScore();
    }

    // Initialize foods
    function initFoods() {
        // Shuffle and pick foods (3 from each category = 15 total)
        const selectedFoods = [];
        categories.forEach(cat => {
            const catFoods = foodItems.filter(f => f.category === cat.id);
            const shuffled = catFoods.sort(() => Math.random() - 0.5);
            selectedFoods.push(...shuffled.slice(0, 3));
        });

        totalFoods = selectedFoods.length;

        // Create food elements with staggered timing
        selectedFoods.forEach((foodData, i) => {
            setTimeout(() => createFood(foodData), i * 80);
        });

        updateScore();
    }

    // Animate floating foods
    function animateFoods() {
        const maxY = window.innerHeight * 0.55;

        foodElements.forEach(food => {
            if (food.classList.contains('dragging') ||
                food.classList.contains('sorted') ||
                food.classList.contains('returning')) return;

            let x = parseFloat(food.style.left) || 0;
            let y = parseFloat(food.style.top) || 0;

            // Apply velocity
            x += food.vx;
            y += food.vy;

            // Bounce off edges
            if (x <= 0 || x >= window.innerWidth - 50) {
                food.vx *= -0.9;
                x = Math.max(0, Math.min(window.innerWidth - 50, x));
            }
            if (y <= 0 || y >= maxY) {
                food.vy *= -0.9;
                y = Math.max(0, Math.min(maxY, y));
            }

            // Slow down gradually
            food.vx *= 0.995;
            food.vy *= 0.995;

            // Add slight random movement
            if (Math.random() < 0.02) {
                food.vx += (Math.random() - 0.5) * 0.3;
                food.vy += (Math.random() - 0.5) * 0.3;
            }

            // Maintain minimum speed
            const speed = Math.sqrt(food.vx * food.vx + food.vy * food.vy);
            if (speed < 0.3) {
                food.vx += (Math.random() - 0.5) * 0.5;
                food.vy += (Math.random() - 0.5) * 0.5;
            }

            food.style.left = x + 'px';
            food.style.top = y + 'px';
        });

        requestAnimationFrame(animateFoods);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        const maxY = window.innerHeight * 0.55;
        foodElements.forEach(food => {
            let x = parseFloat(food.style.left) || 0;
            let y = parseFloat(food.style.top) || 0;
            x = Math.min(x, window.innerWidth - 50);
            y = Math.min(y, maxY);
            food.style.left = x + 'px';
            food.style.top = y + 'px';
        });
    });

    // Hide game when scrolling down to content
    let gameHidden = false;
    const hideThreshold = window.innerHeight * 0.3;
    const gameElements = ['veggie-container', 'food-baskets', 'game-score', 'game-hint'];

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY || window.pageYOffset;

        if (scrollY > hideThreshold && !gameHidden) {
            gameHidden = true;
            gameElements.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.opacity = '0';
                    el.style.pointerEvents = 'none';
                }
            });
        } else if (scrollY <= hideThreshold && gameHidden) {
            gameHidden = false;
            gameElements.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.opacity = '1';
                    el.style.pointerEvents = 'auto';
                }
            });
        }
    });

    // Initialize game
    createGameUI();
    initFoods();
    animateFoods();

    // Add transitions after a brief delay
    setTimeout(() => {
        gameElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.transition = 'opacity 0.3s ease';
        });
    }, 100);

})();

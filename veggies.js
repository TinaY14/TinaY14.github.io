// Food Nutrition Sorting Game - Contained Version
(function() {
    // Only run on homepage
    if (document.body.classList.contains('inner-page')) return;

    const gameBox = document.getElementById('game-box');
    const gameArea = document.getElementById('game-area');
    const foodContainer = document.getElementById('food-container');
    const basketsContainer = document.getElementById('baskets-container');
    const startScreen = document.getElementById('game-start-screen');
    const winScreen = document.getElementById('game-win-screen');
    const startBtn = document.getElementById('start-game-btn');
    const playAgainBtn = document.getElementById('play-again-btn');

    if (!gameBox || !foodContainer) return;

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
    let animationId = null;
    let gameRunning = false;

    // Create baskets
    function createBaskets() {
        basketsContainer.innerHTML = '';
        categories.forEach(cat => {
            const basket = document.createElement('div');
            basket.className = 'game-basket';
            basket.dataset.category = cat.id;
            basket.innerHTML = `
                <div class="basket-icon">${cat.icon}</div>
                <div class="basket-label">${cat.name}</div>
            `;
            basketsContainer.appendChild(basket);
            baskets[cat.id] = basket;
        });
    }

    // Create a food item
    function createFood(foodData) {
        const containerRect = foodContainer.getBoundingClientRect();
        const food = document.createElement('div');
        food.className = 'game-food floating';
        food.textContent = foodData.emoji;
        food.dataset.category = foodData.category;
        food.dataset.name = foodData.name;

        // Random position within container
        const maxX = containerRect.width - 50;
        const maxY = containerRect.height - 50;
        const x = 20 + Math.random() * (maxX - 40);
        const y = 20 + Math.random() * (maxY - 40);
        food.style.left = x + 'px';
        food.style.top = y + 'px';

        // Physics properties
        food.vx = (Math.random() - 0.5) * 2.5;
        food.vy = (Math.random() - 0.5) * 2.5;

        foodContainer.appendChild(food);
        foodElements.push(food);

        addFoodInteraction(food);
        return food;
    }

    // Add drag interaction to food
    function addFoodInteraction(food) {
        let isDragging = false;
        let offsetX, offsetY;

        food.addEventListener('mousedown', startDrag);
        food.addEventListener('touchstart', startDrag, { passive: false });

        function startDrag(e) {
            if (food.classList.contains('sorted') || food.classList.contains('returning')) return;

            isDragging = true;
            food.classList.add('dragging');
            food.classList.remove('floating');

            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            const foodRect = food.getBoundingClientRect();

            offsetX = clientX - foodRect.left;
            offsetY = clientY - foodRect.top;

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

            const containerRect = foodContainer.getBoundingClientRect();
            let newX = clientX - containerRect.left - offsetX;
            let newY = clientY - containerRect.top - offsetY;

            // Allow dragging slightly outside container for basket drop
            newX = Math.max(-20, Math.min(containerRect.width - 30, newX));
            newY = Math.max(-20, Math.min(containerRect.height + 80, newY));

            food.style.left = newX + 'px';
            food.style.top = newY + 'px';

            // Highlight basket on hover
            highlightBasketUnderFood(clientX, clientY);

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
                // Return to container bounds and resume floating
                const containerRect = foodContainer.getBoundingClientRect();
                let x = parseFloat(food.style.left);
                let y = parseFloat(food.style.top);
                x = Math.max(10, Math.min(containerRect.width - 60, x));
                y = Math.max(10, Math.min(containerRect.height - 60, y));
                food.style.left = x + 'px';
                food.style.top = y + 'px';
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

        if (basketCategory === correctCategory) {
            // Correct!
            score++;
            sortedFoods++;
            updateScore();

            food.classList.add('sorted', 'correct');
            showFeedback('Correct! +1', 'correct', food);
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
            showFeedback('Wrong!', 'wrong', food);
            baskets[basketCategory].classList.add('wrong-drop');
            setTimeout(() => baskets[basketCategory].classList.remove('wrong-drop'), 500);

            // Food bounces back
            food.classList.add('returning');
            const containerRect = foodContainer.getBoundingClientRect();
            const returnX = 20 + Math.random() * (containerRect.width - 80);
            const returnY = 20 + Math.random() * (containerRect.height - 80);

            food.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            food.style.left = returnX + 'px';
            food.style.top = returnY + 'px';

            setTimeout(() => {
                food.classList.remove('returning');
                food.style.transition = '';
                food.classList.add('floating');
                food.vx = (Math.random() - 0.5) * 2.5;
                food.vy = (Math.random() - 0.5) * 2.5;
            }, 500);
        }
    }

    // Show feedback message near food
    function showFeedback(message, type, food) {
        const feedback = document.createElement('div');
        feedback.className = 'food-feedback ' + type;
        feedback.textContent = message;
        feedback.style.left = food.style.left;
        feedback.style.top = food.style.top;
        foodContainer.appendChild(feedback);

        setTimeout(() => feedback.remove(), 1000);
    }

    // Update score display
    function updateScore() {
        document.getElementById('score-value-inline').textContent = score;
        document.getElementById('sorted-count').textContent = sortedFoods;
    }

    // Show win screen
    function showWinScreen() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        document.getElementById('final-score-box').textContent = score;
        gameArea.style.display = 'none';
        winScreen.style.display = 'flex';
    }

    // Initialize foods
    function initFoods() {
        foodContainer.innerHTML = '';
        foodElements = [];

        // Shuffle and pick foods (3 from each category = 15 total)
        const selectedFoods = [];
        categories.forEach(cat => {
            const catFoods = foodItems.filter(f => f.category === cat.id);
            const shuffled = catFoods.sort(() => Math.random() - 0.5);
            selectedFoods.push(...shuffled.slice(0, 3));
        });

        totalFoods = selectedFoods.length;
        document.getElementById('total-count').textContent = totalFoods;

        // Create food elements with staggered timing
        selectedFoods.forEach((foodData, i) => {
            setTimeout(() => createFood(foodData), i * 100);
        });

        updateScore();
    }

    // Animate floating foods
    function animateFoods() {
        if (!gameRunning) return;

        const containerRect = foodContainer.getBoundingClientRect();
        const maxX = containerRect.width - 50;
        const maxY = containerRect.height - 50;

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
            if (x <= 5 || x >= maxX) {
                food.vx *= -0.9;
                x = Math.max(5, Math.min(maxX, x));
            }
            if (y <= 5 || y >= maxY) {
                food.vy *= -0.9;
                y = Math.max(5, Math.min(maxY, y));
            }

            // Slow down gradually
            food.vx *= 0.995;
            food.vy *= 0.995;

            // Add slight random movement
            if (Math.random() < 0.02) {
                food.vx += (Math.random() - 0.5) * 0.4;
                food.vy += (Math.random() - 0.5) * 0.4;
            }

            // Maintain minimum speed
            const speed = Math.sqrt(food.vx * food.vx + food.vy * food.vy);
            if (speed < 0.5) {
                food.vx += (Math.random() - 0.5) * 0.8;
                food.vy += (Math.random() - 0.5) * 0.8;
            }

            food.style.left = x + 'px';
            food.style.top = y + 'px';
        });

        animationId = requestAnimationFrame(animateFoods);
    }

    // Start game
    function startGame() {
        score = 0;
        sortedFoods = 0;
        gameRunning = true;

        startScreen.style.display = 'none';
        winScreen.style.display = 'none';
        gameArea.style.display = 'block';

        createBaskets();
        initFoods();

        // Start animation after foods are created
        setTimeout(() => {
            animateFoods();
        }, 200);
    }

    // Reset game
    function resetGame() {
        winScreen.style.display = 'none';
        startGame();
    }

    // Event listeners
    startBtn.addEventListener('click', startGame);
    playAgainBtn.addEventListener('click', resetGame);

})();

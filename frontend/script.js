// State management
let ingredients = [];
let weeklyPlan = {
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null
};

// DOM Elements
const ingredientInput = document.getElementById('ingredient');
const addIngredientBtn = document.getElementById('add-ingredient');
const ingredientsList = document.getElementById('ingredients-list');
const generateBtn = document.getElementById('generate');
const recipeDisplay = document.getElementById('recipe-display');
const dietarySelect = document.getElementById('dietary');
const cuisineSelect = document.getElementById('cuisine');
const saveRecipeBtn = document.getElementById('save-recipe');
const generateShoppingListBtn = document.getElementById('generate-shopping-list');
const shoppingList = document.getElementById('shopping-list');
const shoppingItems = document.getElementById('shopping-items');
const navBtns = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

// API endpoints
const API_URL = 'http://localhost:3000/api';

// Tab switching
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        navBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// Add ingredient
addIngredientBtn.addEventListener('click', () => {
    const ingredient = ingredientInput.value.trim();
    if (ingredient && !ingredients.includes(ingredient)) {
        ingredients.push(ingredient);
        displayIngredients();
        ingredientInput.value = '';
    }
});

// Display ingredients as tags
function displayIngredients() {
    ingredientsList.innerHTML = ingredients.map(ing => `
        <div class="tag">
            ${ing}
            <button onclick="removeIngredient('${ing}')">&times;</button>
        </div>
    `).join('');
}

// Remove ingredient
function removeIngredient(ingredient) {
    ingredients = ingredients.filter(ing => ing !== ingredient);
    displayIngredients();
}

// Generate random recipe
generateBtn.addEventListener('click', async () => {
    try {
        const dietary = dietarySelect.value;
        const cuisine = cuisineSelect.value;
        
        let endpoint = `${API_URL}/recipes/random`;
        if (ingredients.length > 0) {
            const response = await fetch(`${API_URL}/recipes/match`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ingredients })
            });
            const recipes = await response.json();
            if (recipes.length > 0) {
                displayRecipe(recipes[Math.floor(Math.random() * recipes.length)]);
            } else {
                alert('No recipes found with those ingredients. Showing random recipe instead.');
                const response = await fetch(endpoint);
                const recipe = await response.json();
                displayRecipe(recipe);
            }
        } else {
            const response = await fetch(endpoint);
            const recipe = await response.json();
            displayRecipe(recipe);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error generating recipe. Please try again.');
    }
});

// Display recipe
function displayRecipe(recipe) {
    document.getElementById('recipe-name').textContent = recipe.name;
    document.getElementById('cooking-time').textContent = `⏱️ ${recipe.cookingTime} mins`;
    document.getElementById('difficulty').textContent = `📊 ${recipe.difficulty}`;
    document.getElementById('servings').textContent = `👥 Serves ${recipe.servings}`;

    const ingredientsList = document.getElementById('recipe-ingredients');
    ingredientsList.innerHTML = recipe.ingredients
        .map(ing => `<li>${ing}</li>`)
        .join('');

    const instructionsList = document.getElementById('recipe-instructions');
    instructionsList.innerHTML = recipe.instructions
        .map(inst => `<li>${inst}</li>`)
        .join('');

    recipeDisplay.classList.remove('hidden');
    saveRecipeBtn.onclick = () => saveToMealPlan(recipe);
}

// Save recipe to meal plan
function saveToMealPlan(recipe) {
    const days = Object.keys(weeklyPlan);
    const emptyDay = days.find(day => !weeklyPlan[day]);
    
    if (emptyDay) {
        weeklyPlan[emptyDay] = recipe;
        updateMealPlanDisplay();
    } else {
        alert('Meal plan is full! Remove some meals to add new ones.');
    }
}

// Update meal plan display
function updateMealPlanDisplay() {
    const mealSlots = document.querySelectorAll('.meal-slot');
    mealSlots.forEach(slot => {
        const day = slot.dataset.day;
        const recipe = weeklyPlan[day];
        
        if (recipe) {
            slot.innerHTML = `
                <h4>${recipe.name}</h4>
                <p>🕒 ${recipe.cookingTime} mins</p>
                <button onclick="removeMeal('${day}')" class="secondary-btn">Remove</button>
            `;
            slot.classList.add('filled');
        } else {
            slot.innerHTML = 'Drop recipe here';
            slot.classList.remove('filled');
        }
    });
}

// Remove meal from plan
function removeMeal(day) {
    weeklyPlan[day] = null;
    updateMealPlanDisplay();
}

// Generate shopping list
generateShoppingListBtn.addEventListener('click', () => {
    const allIngredients = new Set();
    
    Object.values(weeklyPlan).forEach(recipe => {
        if (recipe) {
            recipe.ingredients.forEach(ing => allIngredients.add(ing));
        }
    });

    shoppingItems.innerHTML = Array.from(allIngredients)
        .map(ing => `<li>${ing}</li>`)
        .join('');
    
    shoppingList.classList.remove('hidden');
});

// Initialize
updateMealPlanDisplay();
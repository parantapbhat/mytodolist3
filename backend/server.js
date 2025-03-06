const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Load recipes from JSON file
const recipesPath = path.join(__dirname, '../data/recipes.json');
const recipesData = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));

// Get all recipes
app.get('/api/recipes', (req, res) => {
    res.json(recipesData.recipes);
});

// Get random recipe
app.get('/api/recipes/random', (req, res) => {
    const recipes = recipesData.recipes;
    const randomIndex = Math.floor(Math.random() * recipes.length);
    res.json(recipes[randomIndex]);
});

// Find recipes by ingredients
app.post('/api/recipes/match', (req, res) => {
    const { ingredients } = req.body;
    const matchingRecipes = recipesData.recipes.filter(recipe => {
        const matchedIngredients = ingredients.filter(ing => 
            recipe.ingredients.some(recipeIng => 
                recipeIng.toLowerCase().includes(ing.toLowerCase())
            )
        );
        return matchedIngredients.length > 0;
    });

    res.json(matchingRecipes);
});

// Filter recipes by dietary preferences
app.get('/api/recipes/filter', (req, res) => {
    const { dietary, cuisine } = req.query;
    let filtered = [...recipesData.recipes];

    if (dietary) {
        filtered = filtered.filter(recipe => 
            recipe.dietary.includes(dietary.toLowerCase())
        );
    }

    if (cuisine) {
        filtered = filtered.filter(recipe => 
            recipe.cuisine.toLowerCase() === cuisine.toLowerCase()
        );
    }

    res.json(filtered);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
import React from 'react';
import { RecipeCard } from './RecipeCard';
import type { Recipe } from '../data/recipes';

interface MyRecipesProps {
    recipes: Recipe[];
    savedRecipeIds: Set<string>;
    onRecipeSelect: (recipe: Recipe) => void;
    onToggleSave: (recipe: Recipe) => void;
}

export const MyRecipes: React.FC<MyRecipesProps> = ({ recipes, savedRecipeIds, onRecipeSelect, onToggleSave }) => {
    const savedRecipes = recipes.filter(recipe => savedRecipeIds.has(recipe.id));

    if (savedRecipes.length === 0) {
        return (
            <div className="grid place-items-center h-64 text-center p-8">
                <div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">No saved recipes yet</h3>
                    <p className="text-text-secondary">Start exploring and save your favorite recipes!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-heading text-text-primary">My Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map(recipe => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onClick={() => onRecipeSelect(recipe)}
                        isSaved={true}
                        onToggleSave={(e) => {
                            e.stopPropagation();
                            onToggleSave(recipe);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

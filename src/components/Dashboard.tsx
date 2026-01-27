import React, { useState, useMemo } from 'react';
import { TopBar } from './TopBar';
import { FilterBar } from './FilterBar';
import { FeaturedRecipeCard } from './FeaturedRecipeCard';
import { RecipeCard } from './RecipeCard';
import { recipes } from '../data/recipes';
import type { Recipe } from '../data/recipes';
import { Frown } from 'lucide-react';

interface DashboardProps {
    onRecipeSelect: (recipe: Recipe) => void;
    onMenuClick?: () => void;
    onProfileClick?: () => void;
    userDiets?: string[];
}

export const Dashboard: React.FC<DashboardProps> = ({ onRecipeSelect, onMenuClick, onProfileClick, userDiets = [] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    // Initialize filters with user's first diet preference if available
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>(() => {
        if (userDiets.length > 0 && userDiets[0]) {
            return { diet: userDiets[0] };
        }
        return {};
    });

    const handleFilterChange = (category: string, value: string) => {
        if (!value) {
            const newFilters = { ...activeFilters };
            delete newFilters[category];
            setActiveFilters(newFilters);
        } else {
            setActiveFilters({ ...activeFilters, [category]: value });
        }
    };

    const resetFilters = () => {
        setActiveFilters({});
        setSearchQuery('');
    };

    const filteredRecipes = useMemo(() => {
        return recipes.filter(recipe => {
            // Search Filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesTitle = recipe.title.toLowerCase().includes(query);
                const matchesIng = recipe.ingredients.some(i => i.toLowerCase().includes(query));
                if (!matchesTitle && !matchesIng) return false;
            }

            // Category Filters
            if (activeFilters.diet && !recipe.dietTypes.includes(activeFilters.diet)) return false;
            if (activeFilters.mealType && recipe.mealType !== activeFilters.mealType) return false;

            // Numeric logic
            if (activeFilters.calories) {
                if (activeFilters.calories === 'Under 400' && recipe.calories >= 400) return false;
                if (activeFilters.calories === '400-600' && (recipe.calories < 400 || recipe.calories > 600)) return false;
                if (activeFilters.calories === 'Over 600' && recipe.calories <= 600) return false;
            }

            if (activeFilters.time) {
                const totalTime = recipe.prepTime + recipe.cookTime;
                if (activeFilters.time === 'Under 15 mins' && totalTime >= 15) return false;
                if (activeFilters.time === 'Under 30 mins' && totalTime >= 30) return false;
                if (activeFilters.time === 'Under 60 mins' && totalTime >= 60) return false;
            }

            return true;
        });
    }, [searchQuery, activeFilters]);

    // Dynamic Featured: Pick the first from filtered, or default if empty
    const featuredRecipe = filteredRecipes.find(r => r.isFeatured) || filteredRecipes[0];
    const gridRecipes = filteredRecipes.filter(r => r.id !== featuredRecipe?.id);
    const recommendedRecipes = recipes.slice(5, 7); // Keep recommendations static for now or filter them too? Let's keep static as "You might also like" even if outside filter.

    return (
        <div className="flex-1 min-h-screen pb-10">
            <TopBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onMenuClick={onMenuClick}
                onProfileClick={onProfileClick}
            />


            <div className="px-6 md:px-8 max-w-7xl mx-auto">
                <FilterBar
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                    onReset={resetFilters}
                />

                {filteredRecipes.length > 0 ? (
                    <>
                        {featuredRecipe && (
                            <div className="mb-10">
                                <FeaturedRecipeCard recipe={featuredRecipe} onClick={() => onRecipeSelect(featuredRecipe)} />
                            </div>
                        )}

                        <div className="mb-12">
                            <h3 className="text-xl font-heading font-bold text-text-primary mb-6">Latest Recipes ({filteredRecipes.length})</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {gridRecipes.map(recipe => (
                                    <RecipeCard key={recipe.id} recipe={recipe} onClick={() => onRecipeSelect(recipe)} />
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
                        <Frown size={64} className="mb-4 text-border" />
                        <h3 className="text-xl font-bold text-text-primary mb-2">No recipes found</h3>
                        <p>Try adjusting your search or filters.</p>
                        <button
                            onClick={resetFilters}
                            className="mt-6 text-primary font-medium hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-heading font-bold text-text-primary">Recommended for You</h3>
                        <button className="text-sm text-primary font-medium hover:underline">View All</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recommendedRecipes.map(recipe => (
                            <div
                                key={recipe.id}
                                onClick={() => onRecipeSelect(recipe)}
                                className="bg-white p-4 rounded-xl border border-border flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                                <img src={recipe.image} alt={recipe.title} className="w-24 h-24 rounded-lg object-cover" />
                                <div>
                                    <h4 className="font-heading font-bold text-text-primary mb-1">{recipe.title}</h4>
                                    <p className="text-xs text-text-secondary line-clamp-2 mb-2">{recipe.description}</p>
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">98% Match</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

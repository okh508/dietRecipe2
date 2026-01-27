import React from 'react';
import type { Recipe } from '../data/recipes';
import { ArrowLeft, Clock, Flame, Users, ChefHat } from 'lucide-react';

interface RecipeDetailProps {
    recipe: Recipe;
    onBack: () => void;
    onAddToGrocery: (ingredients: string[]) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBack, onAddToGrocery }) => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-text-secondary hover:text-primary mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back to Feed</span>
            </button>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-border">
                <div className="h-64 md:h-96 w-full relative">
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-6 left-6 md:left-10 text-white">
                        <div className="flex gap-2 mb-3">
                            {recipe.dietTypes.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium border border-white/30">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 shadow-sm">{recipe.title}</h1>
                        <p className="text-white/90 text-lg max-w-2xl">{recipe.description}</p>
                    </div>
                </div>

                <div className="flex flex-wrap border-b border-border bg-gray-50/50 divide-x divide-gray-100">
                    <div className="flex-1 p-4 md:p-6 flex flex-col items-center text-center">
                        <Flame className="text-orange-500 mb-2" size={24} />
                        <span className="text-2xl font-bold text-text-primary">{recipe.calories}</span>
                        <span className="text-xs text-text-secondary uppercase tracking-wider font-medium">Calories</span>
                    </div>
                    <div className="flex-1 p-4 md:p-6 flex flex-col items-center text-center">
                        <Users className="text-blue-500 mb-2" size={24} />
                        <span className="text-2xl font-bold text-text-primary">{recipe.servings}</span>
                        <span className="text-xs text-text-secondary uppercase tracking-wider font-medium">Servings</span>
                    </div>
                    <div className="flex-1 p-4 md:p-6 flex flex-col items-center text-center">
                        <Clock className="text-green-500 mb-2" size={24} />
                        <span className="text-2xl font-bold text-text-primary">{recipe.prepTime}m</span>
                        <span className="text-xs text-text-secondary uppercase tracking-wider font-medium">Prep Time</span>
                    </div>
                    <div className="flex-1 p-4 md:p-6 flex flex-col items-center text-center">
                        <ChefHat className="text-purple-500 mb-2" size={24} />
                        <span className="text-2xl font-bold text-text-primary">{recipe.cookTime}m</span>
                        <span className="text-xs text-text-secondary uppercase tracking-wider font-medium">Cook Time</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 p-6 md:p-10">
                    <div className="md:col-span-1">
                        <h3 className="text-xl font-heading font-bold mb-6 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                Ingredients
                                <span className="text-sm font-normal text-text-secondary bg-gray-100 px-2 py-0.5 rounded-full">{recipe.ingredients.length} items</span>
                            </span>
                        </h3>
                        <button
                            onClick={() => onAddToGrocery(recipe.ingredients)}
                            className="w-full mb-6 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            + Add to Grocery List
                        </button>
                        <ul className="space-y-3">
                            {recipe.ingredients.map((ing, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-text-primary text-sm p-3 rounded-lg bg-page hover:bg-blue-50 transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                    {ing}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-xl font-heading font-bold mb-6">Instructions</h3>
                        <div className="space-y-6">
                            {recipe.instructions.map((step, idx) => (
                                <div key={idx} className="flex gap-4 group">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100 group-hover:bg-primary group-hover:text-white transition-colors">
                                        {idx + 1}
                                    </div>
                                    <p className="text-text-primary leading-relaxed pt-1">
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

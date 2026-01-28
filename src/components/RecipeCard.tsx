import React from 'react';
import type { Recipe } from '../data/recipes';
import { Clock, Flame, Heart } from 'lucide-react';

interface RecipeCardProps {
    recipe: Recipe;
    onClick: () => void;
    isSaved: boolean;
    onToggleSave: (e: React.MouseEvent) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, isSaved, onToggleSave }) => {
    return (
        <div onClick={onClick} className="bg-card rounded-xl shadow-card overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col h-full relative">
            <button
                onClick={onToggleSave}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm transition-colors text-red-500"
                title={isSaved ? "Remove from My Recipes" : "Save to My Recipes"}
            >
                <Heart size={20} className={isSaved ? "fill-current" : ""} />
            </button>
            <div className="h-48 overflow-hidden relative">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    {/* Optional overlay content */}
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h4 className="font-heading font-bold text-lg text-text-primary mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {recipe.title}
                </h4>

                <div className="flex items-center gap-4 text-xs text-text-secondary mb-4">
                    <div className="flex items-center gap-1 bg-page px-2 py-1 rounded">
                        <Flame size={14} className="text-orange-500" />
                        <span>{recipe.calories} kcal</span>
                    </div>
                    <div className="flex items-center gap-1 bg-page px-2 py-1 rounded">
                        <Clock size={14} className="text-blue-500" />
                        <span>{recipe.prepTime} mins</span>
                    </div>
                </div>

                <div className="mt-auto">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                        className="w-full py-2.5 border border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-colors">
                        View
                    </button>
                </div>
            </div>
        </div>
    );
};

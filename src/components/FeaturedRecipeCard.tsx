import React from 'react';
import type { Recipe } from '../data/recipes';
import { Clock, Flame, ArrowRight } from 'lucide-react';

interface FeaturedRecipeCardProps {
    recipe: Recipe;
    onClick: () => void;
}

export const FeaturedRecipeCard: React.FC<FeaturedRecipeCardProps> = ({ recipe, onClick }) => {
    return (
        <div onClick={onClick} className="bg-card rounded-xl shadow-card overflow-hidden flex flex-col md:flex-row h-auto md:h-[400px] mb-8 group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="w-full md:w-2/5 h-64 md:h-full relative overflow-hidden">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded backdrop-blur-sm">
                    FEATURED RECIPE
                </div>
            </div>
            <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
                <h3 className="text-3xl font-heading font-bold text-text-primary mb-4 leading-tight">
                    {recipe.title}
                </h3>
                <p className="text-text-secondary text-lg mb-6 line-clamp-2">
                    {recipe.description}
                </p>

                <div className="flex items-center gap-6 mb-8 text-sm text-text-secondary">
                    <div className="flex items-center gap-2 bg-page px-3 py-1.5 rounded-full">
                        <Flame size={18} className="text-orange-500" />
                        <span>{recipe.calories} kcal</span>
                    </div>
                    <div className="flex items-center gap-2 bg-page px-3 py-1.5 rounded-full">
                        <Clock size={18} className="text-blue-500" />
                        <span>{recipe.prepTime} mins</span>
                    </div>
                    <div className="flex gap-2">
                        {recipe.dietTypes.slice(0, 2).map(tag => (
                            <span key={tag} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full font-medium text-xs">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                        className="bg-primary hover:bg-sky-400 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:-translate-y-1 hover:shadow-md flex items-center gap-2">
                        View Recipe <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

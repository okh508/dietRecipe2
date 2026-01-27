import React, { useState } from 'react';
import { Leaf, ArrowRight, ChefHat } from 'lucide-react';

interface UserProfile {
    name: string;
    diets: string[];
}

interface OnboardingProps {
    onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [selectedDiets, setSelectedDiets] = useState<string[]>([]);

    const diets = [
        'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo', 'Dairy-Free', 'Low-Carb'
    ];

    const toggleDiet = (diet: string) => {
        setSelectedDiets(prev =>
            prev.includes(diet)
                ? prev.filter(d => d !== diet)
                : [...prev, diet]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onComplete({ name, diets: selectedDiets });
        }
    };

    return (
        <div className="min-h-screen bg-page flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

                <div className="relative z-10 text-center mb-10">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-lg shadow-primary/20">
                        <ChefHat className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Welcome to NutriChef</h1>
                    <p className="text-text-secondary">Your personalized recipe companion. Let's get to know you better!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-text-primary">What should we call you?</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-text-primary">Do you have any dietary preferences?</label>
                        <div className="flex flex-wrap gap-2">
                            {diets.map(diet => (
                                <button
                                    key={diet}
                                    type="button"
                                    onClick={() => toggleDiet(diet)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${selectedDiets.includes(diet)
                                            ? 'bg-green-50 border-green-200 text-green-700 shadow-sm'
                                            : 'bg-white border-border text-text-secondary hover:border-green-200'
                                        }`}
                                >
                                    {diet}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
                    >
                        Get Started
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    );
};

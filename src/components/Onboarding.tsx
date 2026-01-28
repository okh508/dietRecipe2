import React, { useState } from 'react';
import { ArrowRight, ChefHat, Mail, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserProfile {
    name: string;
    diets: string[];
}

interface OnboardingProps {
    onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !password.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name, // Metadata for triggers if needed
                    }
                }
            });

            if (error) throw error;

            if (data.session) {
                // Determine if we need to call onComplete or if App.tsx listener handles it
                // We call onComplete to ensure the profile is saved to DB immediately via the App handler
                onComplete({ name, diets: selectedDiets });
            } else if (data.user) {
                // Confirmation case
                onComplete({ name, diets: selectedDiets });
                alert('Account created! Please check your email.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
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
                    <p className="text-text-secondary">Create an account to personalize your recipes.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-primary">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-primary">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-primary">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-text-primary">Dietary Preferences</label>
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
                        disabled={loading || !name.trim() || !email.trim() || !password.trim()}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
                    >
                        {loading ? 'Creating Account...' : 'Get Started'}
                        {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </button>

                    <div className="text-center">
                        <p className="text-sm text-text-secondary">
                            Already have an account? <span className="text-primary font-bold cursor-pointer hover:underline" onClick={() => alert("Login not implemented yet in this demo!")}>Sign In</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

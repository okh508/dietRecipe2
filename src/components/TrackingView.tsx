import React from 'react';
import { PieChart, TrendingUp, Activity, Calendar } from 'lucide-react';

export const TrackingView: React.FC = () => {
    return (
        <div className="flex-1 min-h-screen px-6 md:px-8 py-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary">Nutrition Tracking</h2>
                <p className="text-text-secondary">Monitor your daily intake and progress.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Calories Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                            <Activity size={24} />
                        </div>
                        <span className="text-sm font-medium text-text-secondary">Daily Goal</span>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-text-primary mb-1">1,450</h3>
                        <p className="text-sm text-text-secondary">of 2,000 kcal</p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                </div>

                {/* Macros Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                            <PieChart size={24} />
                        </div>
                        <span className="text-sm font-medium text-text-secondary">Macros</span>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-text-secondary">Protein</span>
                                <span className="font-medium text-text-primary">85g / 120g</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-text-secondary">Carbs</span>
                                <span className="font-medium text-text-primary">140g / 200g</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-text-secondary">Fats</span>
                                <span className="font-medium text-text-primary">45g / 65g</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '69%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Streak Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-sm font-medium text-text-secondary">Streak</span>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-text-primary mb-1">5 Days</h3>
                        <p className="text-sm text-text-secondary">Keep it up!</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                            <div key={i} className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-medium ${i < 5 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                {day}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Weekly History Placeholder */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
                <div className="flex items-center gap-3 mb-6">
                    <Calendar size={20} className="text-text-secondary" />
                    <h3 className="text-lg font-bold text-text-primary">Weekly History</h3>
                </div>
                <div className="h-64 flex items-center justify-center text-text-secondary bg-gray-50 rounded-xl border border-dashed border-border">
                    <p>Detailed chart functionality coming soon...</p>
                </div>
            </div>
        </div>
    );
};

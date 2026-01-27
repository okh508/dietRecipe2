import React from 'react';
import { Search, Bell, User as UserIcon, Menu } from 'lucide-react';

interface TopBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onMenuClick?: () => void;
    onProfileClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ searchQuery, onSearchChange, onMenuClick, onProfileClick }) => {
    return (
        <div className="h-auto md:h-16 bg-card border-b border-border flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 md:py-0 mb-8 sticky top-0 z-10 w-full gap-4 md:gap-0">
            <div className="flex items-center justify-between w-full md:w-auto">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="p-2 md:hidden text-text-secondary hover:bg-page rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <h2 className="text-xl font-bold text-text-primary">Recipe Feed</h2>
                </div>

                {/* Mobile Profile Icons (visible on mobile right side) */}
                <div className="flex items-center gap-3 md:hidden">
                    <button className="p-2 text-text-secondary hover:bg-page rounded-lg transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <div
                        className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden cursor-pointer"
                        onClick={onProfileClick}
                    >
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="User" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search for recipes, ingredients..."
                        className="bg-page pl-10 pr-4 py-2 rounded-lg w-full md:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border-none transition-all"
                    />
                </div>

                {/* Desktop Profile Icons */}
                <div className="hidden md:flex items-center gap-3">
                    <button className="p-2 text-text-secondary hover:bg-page rounded-lg transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <button className="p-2 text-text-secondary hover:bg-page rounded-lg transition-colors">
                        <UserIcon size={20} />
                    </button>
                    <div
                        className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden cursor-pointer"
                        onClick={onProfileClick}
                    >
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="User" />
                    </div>
                </div>
            </div>
        </div>

    );
};

import React, { useState } from 'react';
import { Search, Bell, User as UserIcon, Menu, Settings, LogOut } from 'lucide-react';

interface TopBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onMenuClick?: () => void;
    onSettingsClick?: () => void;
    avatarUrl?: string;
    onLogout?: () => void;
    hasNotifications?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ searchQuery, onSearchChange, onMenuClick, onSettingsClick, avatarUrl, onLogout, hasNotifications = false }) => {
    const [showMenu, setShowMenu] = useState(false);

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
                    <div className="relative">
                        <button
                            className="p-2 text-text-secondary hover:bg-page rounded-lg transition-colors relative"
                            onClick={() => alert('No new notifications')}
                        >
                            <Bell size={20} />
                            {hasNotifications && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            )}
                        </button>
                    </div>
                    <div className="relative">
                        <div
                            className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden cursor-pointer"
                        >
                            <img
                                src={avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </div>
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
                    <button
                        className="p-2 text-text-secondary hover:bg-page rounded-lg transition-colors relative"
                        onClick={() => alert('No new notifications')}
                    >
                        <Bell size={20} />
                        {hasNotifications && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        )}
                    </button>

                    {/* Settings/Logout Menu Trigger (Second from right) */}
                    <div className="relative">
                        <button
                            className={`p-2 hover:bg-page rounded-lg transition-colors ${showMenu ? 'bg-page text-primary' : 'text-text-secondary'}`}
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <UserIcon size={20} />
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-border py-1 z-50 animate-in fade-in slide-in-from-top-2">
                                <button
                                    onClick={() => { setShowMenu(false); onSettingsClick?.(); }}
                                    className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-page hover:text-text-primary flex items-center gap-2"
                                >
                                    <Settings size={16} />
                                    Settings
                                </button>
                                <button
                                    onClick={() => { setShowMenu(false); onLogout?.(); }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                        {/* Backdrop to close menu */}
                        {showMenu && (
                            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
                        )}
                    </div>

                    {/* Avatar (Top Right) */}
                    <div
                        className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden cursor-pointer"
                        title="User Avatar"
                    >
                        <img
                            src={avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"}
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

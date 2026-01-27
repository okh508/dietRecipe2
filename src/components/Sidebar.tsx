import React from 'react';
import { Home, BookOpen, ShoppingCart, PieChart, Settings, HelpCircle, X } from 'lucide-react';

interface SidebarProps {
    activeView: string;
    onNavigate: (view: string) => void;
    groceryCount: number;
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, groceryCount, isOpen, onClose }) => {
    const menuItems = [
        { icon: Home, label: 'Dashboard', id: 'dashboard' },
        { icon: BookOpen, label: 'My Recipes', id: 'my-recipes' },
        { icon: ShoppingCart, label: 'Grocery List', id: 'grocery-list' },
        { icon: PieChart, label: 'Tracking', id: 'tracking' },
        { icon: Settings, label: 'Settings', id: 'settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed top-0 left-0 h-screen w-64 bg-sidebar border-r border-border z-50 flex flex-col transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:transform-none md:translate-x-0 md:static md:flex
            `}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">N</span>
                            </div>
                            <div>
                                <h1 className="font-heading font-bold text-xl text-text-primary">NutriChef</h1>
                                <p className="text-xs text-text-secondary">Personalized Diet</p>
                            </div>
                        </div>
                        {/* Mobile Close Button */}
                        <button
                            onClick={onClose}
                            className="p-1 md:hidden text-text-secondary hover:text-text-primary"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => onNavigate(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${activeView === item.id
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-text-secondary hover:bg-blue-50/50'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium text-sm">{item.label}</span>

                                {item.id === 'grocery-list' && groceryCount > 0 && (
                                    <span className={`absolute right-3 text-xs font-bold px-2 py-0.5 rounded-full ${activeView === item.id ? 'bg-white text-primary' : 'bg-primary text-white'
                                        }`}>
                                        {groceryCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-border">
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-blue-50/50 rounded-lg transition-colors">
                            <HelpCircle size={20} />
                            <span className="font-medium text-sm">Support</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

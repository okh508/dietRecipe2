import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
    activeView: string;
    onNavigate: (view: string) => void;
    groceryCount: number;
    isSidebarOpen: boolean;
    onSidebarClose: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, groceryCount, isSidebarOpen, onSidebarClose }) => {
    return (
        <div className="flex min-h-screen bg-page relative">
            <Sidebar
                activeView={activeView}
                onNavigate={onNavigate}
                groceryCount={groceryCount}
                isOpen={isSidebarOpen}
                onClose={onSidebarClose}
            />
            <main className="flex-1 md:ml-64 transition-all duration-300">
                {children}
            </main>
        </div>
    );
};

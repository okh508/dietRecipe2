import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface FilterBarProps {
    activeFilters: Record<string, string>;
    onFilterChange: (category: string, value: string) => void;
    onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ activeFilters, onFilterChange, onReset }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filters = [
        { label: 'Diet Type', key: 'diet', options: ['Vegan', 'Vegetarian', 'Pescatarian', 'Gluten Free', 'Keto', 'Paleo'] },
        { label: 'Calories', key: 'calories', options: ['Under 400', '400-600', 'Over 600'] },
        { label: 'Time', key: 'time', options: ['Under 15 mins', 'Under 30 mins', 'Under 60 mins'] },
        { label: 'Meal Type', key: 'mealType', options: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (label: string) => {
        setOpenDropdown(openDropdown === label ? null : label);
    };

    return (
        <div className="flex flex-wrap items-center gap-3 mb-8" ref={dropdownRef}>
            {filters.map((filter) => {
                const isActive = !!activeFilters[filter.key];
                return (
                    <div key={filter.key} className="relative">
                        <button
                            onClick={() => toggleDropdown(filter.label)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive
                                    ? 'bg-blue-100 text-primary border border-primary/20'
                                    : 'bg-white border border-border text-text-secondary hover:border-primary hover:text-primary'
                                }`}
                        >
                            {isActive ? activeFilters[filter.key] : filter.label}
                            {isActive ? (
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onFilterChange(filter.key, '');
                                    }}
                                    className="hover:bg-blue-200 rounded-full p-0.5"
                                >
                                    <X size={12} />
                                </span>
                            ) : (
                                <ChevronDown size={14} />
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdown === filter.label && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-border overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                                {filter.options.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            onFilterChange(filter.key, option);
                                            setOpenDropdown(null);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-page transition-colors ${activeFilters[filter.key] === option ? 'text-primary font-medium bg-blue-50' : 'text-text-primary'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            {(Object.keys(activeFilters).length > 0) && (
                <button
                    onClick={onReset}
                    className="ml-auto text-sm text-red-500 font-medium hover:underline flex items-center gap-1"
                >
                    <X size={14} /> Clear All
                </button>
            )}
        </div>
    );
};

import React from 'react';
import { Trash2, Copy, ShoppingCart } from 'lucide-react';

export interface GroceryItem {
    id: string;
    item: string;
    is_checked: boolean;
}

interface GroceryListProps {
    items: GroceryItem[];
    onRemoveItem: (id: string) => void;
    onClearList: () => void;
}

export const GroceryList: React.FC<GroceryListProps> = ({ items, onRemoveItem, onClearList }) => {
    const handleCopy = () => {
        const text = items.map(i => i.item).join('\n');
        navigator.clipboard.writeText(text);
        alert('Grocery list copied to clipboard!');
    };

    return (
        <div className="flex-1 min-h-screen px-6 md:px-8 py-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <ShoppingCart size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary">Grocery List</h2>
                        <p className="text-text-secondary text-sm">{items.length} items</p>
                    </div>
                </div>

                {items.length > 0 && (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-text-secondary hover:text-primary hover:border-primary rounded-lg transition-colors font-medium text-sm"
                        >
                            <Copy size={16} /> Copy
                        </button>
                        <button
                            onClick={onClearList}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm"
                        >
                            <Trash2 size={16} /> Clear All
                        </button>
                    </div>
                )}
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-border">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                        <ShoppingCart size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">Your list is empty</h3>
                    <p className="text-text-secondary text-center max-w-md">
                        Browse recipes and click "Add to Grocery List" to start building your shopping list.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                    <ul className="divide-y divide-border">
                        {items.map((item) => (
                            <li key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                                <span className="text-text-primary font-medium">{item.item}</span>
                                <button
                                    onClick={() => onRemoveItem(item.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    aria-label="Remove item"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

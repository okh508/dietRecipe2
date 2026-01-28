import React, { useState } from 'react';
import { User, Mail, Save, Bell, Shield, Moon, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SettingsProps {
    onSave: (preferences: { name: string; email: string; diets: string[]; avatar_url?: string }) => void;
    userProfile: { name: string; diets: string[]; avatar_url?: string };
    email?: string;
    onLogout: () => void;
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onSave, userProfile, email: initialEmail, onLogout, isDarkMode, onToggleTheme }) => {
    const [name, setName] = useState(userProfile?.name || '');
    const [email, setEmail] = useState(initialEmail || 'user@example.com');
    const [activeDiets, setActiveDiets] = useState<string[]>(userProfile?.diets || []);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(userProfile?.avatar_url);
    const [uploading, setUploading] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const diets = [
        'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo', 'Dairy-Free', 'Low-Carb'
    ];

    const toggleDiet = (diet: string) => {
        setActiveDiets(prev =>
            prev.includes(diet)
                ? prev.filter(d => d !== diet)
                : [...prev, diet]
        );
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                return;
            }
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Lazy import supabase to avoid circular dep or issues if not needed immediately
            const { supabase } = await import('../lib/supabase');

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setAvatarUrl(data.publicUrl);
        } catch (error: any) {
            console.error('Upload Error Details:', error);
            alert(`Error uploading avatar: ${error.message || 'Unknown error'} (Check console for details)`);
        } finally {
            setUploading(false);
        }
    };



    const handleSave = () => {
        onSave({ name, email, diets: activeDiets, avatar_url: avatarUrl });
        const btn = document.getElementById('save-btn');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Saved!';
            btn.classList.add('bg-green-600');
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('bg-green-600');
            }, 2000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-8">Settings</h1>

            <div className="grid gap-8">
                {/* Profile Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-8">
                    <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                        <User className="text-primary" size={24} />
                        Profile Information
                    </h2>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-indigo-100 border-2 border-indigo-200 overflow-hidden flex-shrink-0 relative">
                                <img
                                    src={avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"}
                                    alt="User"
                                    className="w-full h-full object-cover"
                                />
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full cursor-pointer shadow-lg hover:bg-primary-dark transition-colors" title="Change Photo">
                                <SettingsIcon size={14} className="w-4 h-4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </label>
                        </div>

                        <div className="flex-1 w-full space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-8">
                    <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                        <Shield className="text-green-500" size={24} />
                        Dietary Preferences
                    </h2>
                    <p className="text-text-secondary mb-6">Select diets to automatically filter your recipe feed.</p>

                    <div className="flex flex-wrap gap-3">
                        {diets.map(diet => (
                            <button
                                key={diet}
                                onClick={() => toggleDiet(diet)}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${activeDiets.includes(diet)
                                    ? 'bg-green-50 border-green-200 text-green-700 shadow-sm scale-105'
                                    : 'bg-white border-border text-text-secondary hover:border-green-200 hover:text-green-600'
                                    }`}
                            >
                                {diet}
                            </button>
                        ))}
                    </div>
                </div>

                {/* App Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-8">
                    <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                        <SettingsIcon className="text-gray-500" size={24} />
                        App Settings
                    </h2>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-text-primary">Push Notifications</p>
                                    <p className="text-sm text-text-secondary">Receive daily recipe recommendations</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-primary' : 'bg-gray-200'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notifications ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                    <Moon size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-text-primary">Dark Mode</p>
                                    <p className="text-sm text-text-secondary">Switch between light and dark themes</p>
                                </div>
                            </div>
                            <button
                                onClick={onToggleTheme}
                                className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-primary' : 'bg-gray-200'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isDarkMode ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        id="save-btn"
                        onClick={handleSave}
                        className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                    >
                        <Save size={20} />
                        Save Changes
                    </button>
                </div>

                <div className="border-t border-border pt-8 mt-4">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-6 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium border border-transparent hover:border-red-100"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

// Renamed locally to avoid conflict with lucide-react Settings icon import if needed, 
// but actually I used SettingsIcon in the JSX without importing it properly as an alias.
// Let me fix the import.


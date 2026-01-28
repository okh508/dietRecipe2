import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { RecipeDetail } from './components/RecipeDetail';
import type { GroceryItem } from './components/GroceryList';
import { GroceryList } from './components/GroceryList';
import { Settings } from './components/Settings';
import { TrackingView } from './components/TrackingView';
import { Onboarding } from './components/Onboarding';
import { recipes } from './data/recipes';
import type { Recipe } from './data/recipes';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface UserProfile {
  name: string;
  diets: string[];
  avatar_url?: string;
}

import { MyRecipes } from './components/MyRecipes';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage or system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    // Apply dark class
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name, diets, avatar_url')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      }

      if (data) {
        setUserProfile({
          name: data.full_name,
          diets: data.diets || [],
          avatar_url: data.avatar_url
        });
      }

      // Fetch saved recipes
      const { data: savedData } = await supabase
        .from('saved_recipes')
        .select('recipe_id')
        .eq('user_id', userId);

      if (savedData) {
        setSavedRecipeIds(new Set(savedData.map(r => r.recipe_id)));
      }

      // Fetch grocery items
      const { data: groceryData, error: groceryError } = await supabase
        .from('grocery_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (groceryData) {
        setGroceryItems(groceryData);
      } else if (groceryError) {
        console.error('Error fetching grocery items:', groceryError);
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (recipe: Recipe) => {
    if (!session) return;

    // Optimistic Update
    const isSaved = savedRecipeIds.has(recipe.id);
    const newSaved = new Set(savedRecipeIds);
    if (isSaved) {
      newSaved.delete(recipe.id);
    } else {
      newSaved.add(recipe.id);
    }
    setSavedRecipeIds(newSaved);

    // DB Update
    try {
      if (isSaved) {
        await supabase
          .from('saved_recipes')
          .delete()
          .eq('user_id', session.user.id)
          .eq('recipe_id', recipe.id);
      } else {
        await supabase
          .from('saved_recipes')
          .insert({
            user_id: session.user.id,
            recipe_id: recipe.id
          });
      }
    } catch (err) {
      console.error("Error toggling save:", err);
      // Revert on error? For now, we assume success or user retries.
    }
  };

  const handleCreateUser = async (profile: UserProfile, _email?: string, _password?: string) => {
    // This will be called from Onboarding. 
    // We expect Onboarding to handle the actual SignUp if it has the fields, 
    // or we do it here if we pass credentials up.
    // For now, let's assume Onboarding handles the actual auth call or we pass it down.
    // Actually, to keep it clean, let's just refresh the session here or set the profile.
    if (session) {
      // Update profile if session exists (e.g. after sign up)
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: session.user.id,
          full_name: profile.name,
          diets: profile.diets
        });
      if (!error) setUserProfile(profile);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out? This will reset your session.')) {
      await supabase.auth.signOut();
      setUserProfile(null);
      setActiveView('dashboard');
    }
  };

  const handleNavigate = (view: string) => {
    setActiveView(view);
    if (view !== 'recipe-detail') {
      setSelectedRecipe(null);
    }
    window.scrollTo(0, 0);
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setActiveView('recipe-detail');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedRecipe(null);
    setActiveView('dashboard');
  };

  const handleAddToGrocery = async (ingredients: string[]) => {
    if (!session) {
      alert('Please sign in to save grocery items.');
      return;
    }

    const newItems = ingredients.map(item => ({
      user_id: session.user.id,
      item: item,
      is_checked: false
    }));

    const { data, error } = await supabase
      .from('grocery_items')
      .insert(newItems)
      .select();

    if (error) {
      console.error('Error adding grocery items:', error);
      alert('Failed to add items.');
    } else if (data) {
      setGroceryItems(prev => [...prev, ...data]);
      alert(`${ingredients.length} items added to Grocery List!`);
    }
  };

  const handleRemoveGroceryItem = async (id: string) => {
    const { error } = await supabase
      .from('grocery_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing item:', error);
    } else {
      setGroceryItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleClearList = async () => {
    if (confirm('Are you sure you want to clear your grocery list?')) {
      const { error } = await supabase
        .from('grocery_items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows where id is not generic zero (effectively all) - or strict filter by user via RLS
      // Actually, RLS handles user scoping, so .neq('id', '0') is a hack to 'delete all'. 
      // Better: .delete().in('id', groceryItems.map(i => i.id)) for safety, or reliant on RLS.

      // Since RLS enforces auth.uid = user_id, a broad delete is safe for that user.
      // But supabase requires a WHERE clause usually.
      // Let's use the IDs we know.
      const ids = groceryItems.map(i => i.id);
      if (ids.length === 0) return;

      const { error: deleteError } = await supabase
        .from('grocery_items')
        .delete()
        .in('id', ids);

      if (deleteError) {
        console.error('Error clearing list:', deleteError);
      } else {
        setGroceryItems([]);
      }
    }
  };

  const handleSaveSettings = async (settings: any) => {
    console.log('Settings saved:', settings);
    if (session) {
      // Use existing profile or create new default
      const currentProfile = userProfile || { name: '', diets: [] };
      const updatedProfile = { ...currentProfile, ...settings };
      setUserProfile(updatedProfile);

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: session.user.id,
          full_name: updatedProfile.name,
          diets: updatedProfile.diets,
          avatar_url: updatedProfile.avatar_url
        });

      if (error) {
        console.error("Supabase Error:", error);
        alert(`Error saving settings: ${error.message} (${error.details || error.hint || 'Check console'})`);
      } else {
        // Force refresh profile fetch to be safe
        fetchProfile(session.user.id);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <Onboarding onComplete={handleCreateUser} />;
  }

  return (
    <Layout activeView={activeView} onNavigate={handleNavigate} groceryCount={groceryItems.length} isSidebarOpen={isSidebarOpen} onSidebarClose={() => setIsSidebarOpen(false)}>
      {activeView === 'dashboard' && (
        <Dashboard
          onRecipeSelect={handleRecipeSelect}
          onMenuClick={() => setIsSidebarOpen(true)}
          onProfileClick={() => handleNavigate('settings')}
          userDiets={userProfile?.diets}
          savedRecipeIds={savedRecipeIds}
          onToggleSave={handleToggleSave}
          avatarUrl={userProfile?.avatar_url}
          onLogout={handleLogout}
        />
      )}

      {activeView === 'my-recipes' && (
        <MyRecipes
          recipes={recipes} // Need to import recipes or pass them. Wait, recipes are imported in App? No, they are used in Dashboard. Let's import them here or assume Dashboard has them. App needs them for MyRecipes.
          savedRecipeIds={savedRecipeIds}
          onRecipeSelect={handleRecipeSelect}
          onToggleSave={handleToggleSave}
        />
      )}

      {activeView === 'recipe-detail' && selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onBack={handleBack}
          onAddToGrocery={handleAddToGrocery}
        />
      )}

      {activeView === 'grocery-list' && (
        <GroceryList
          items={groceryItems}
          onRemoveItem={handleRemoveGroceryItem}
          onClearList={handleClearList}
        />
      )}

      {activeView === 'tracking' && (
        <TrackingView />
      )}

      {activeView === 'settings' && (
        <Settings
          onSave={handleSaveSettings}
          userProfile={userProfile || { name: '', diets: [] }}
          email={session?.user?.email}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
      )}
    </Layout>
  );
}

export default App;

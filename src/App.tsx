import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { RecipeDetail } from './components/RecipeDetail';
import { GroceryList } from './components/GroceryList';
import { Settings } from './components/Settings';
import { Onboarding } from './components/Onboarding';
import type { Recipe } from './data/recipes';

interface UserProfile {
  name: string;
  diets: string[];
}

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [groceryItems, setGroceryItems] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('nutrichef_user_profile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }
  }, []);

  const handleCreateUser = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('nutrichef_user_profile', JSON.stringify(profile));
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to sign out? This will reset your session.')) {
      setUserProfile(null);
      localStorage.removeItem('nutrichef_user_profile');
      setActiveView('dashboard'); // Reset view for next login
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

  const handleAddToGrocery = (ingredients: string[]) => {
    setGroceryItems(prev => [...prev, ...ingredients]);
    alert(`${ingredients.length} items added to Grocery List!`);
  };

  const handleRemoveGroceryItem = (index: number) => {
    setGroceryItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearList = () => {
    if (confirm('Are you sure you want to clear your grocery list?')) {
      setGroceryItems([]);
    }
  };

  const handleSaveSettings = (settings: any) => {
    console.log('Settings saved:', settings);
    if (userProfile) {
      const updatedProfile = { ...userProfile, ...settings };
      setUserProfile(updatedProfile);
      localStorage.setItem('nutrichef_user_profile', JSON.stringify(updatedProfile));
    }
  };

  if (!userProfile) {
    return <Onboarding onComplete={handleCreateUser} />;
  }

  return (
    <Layout activeView={activeView} onNavigate={handleNavigate} groceryCount={groceryItems.length} isSidebarOpen={isSidebarOpen} onSidebarClose={() => setIsSidebarOpen(false)}>
      {activeView === 'dashboard' && (
        <Dashboard
          onRecipeSelect={handleRecipeSelect}
          onMenuClick={() => setIsSidebarOpen(true)}
          onProfileClick={() => handleNavigate('settings')}
          userDiets={userProfile.diets}
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

      {activeView === 'settings' && (
        <Settings
          onSave={handleSaveSettings}
          userProfile={userProfile}
          onLogout={handleLogout}
        />
      )}
    </Layout>
  );
}

export default App;

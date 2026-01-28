import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { RecipeDetail } from './components/RecipeDetail';
import { GroceryList } from './components/GroceryList';
import { Settings } from './components/Settings';
import { Onboarding } from './components/Onboarding';
import type { Recipe } from './data/recipes';
import { supabase } from './lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  name: string;
  diets: string[];
}

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [groceryItems, setGroceryItems] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
        .select('full_name, diets')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      }

      if (data) {
        setUserProfile({
          name: data.full_name,
          diets: data.diets || []
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (profile: UserProfile, email?: string, password?: string) => {
    // This will be called from Onboarding. 
    // We expect Onboarding to handle the actual SignUp if it has the fields, 
    // or we do it here if we pass credentials up.
    // For now, let's assume Onboarding handles the auth call or we pass it down.
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

  const handleSaveSettings = async (settings: any) => {
    console.log('Settings saved:', settings);
    if (session && userProfile) {
      const updatedProfile = { ...userProfile, ...settings };
      setUserProfile(updatedProfile);

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: session.user.id,
          full_name: updatedProfile.name,
          diets: updatedProfile.diets
        });

      if (error) alert('Error saving settings to database!');
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

      {activeView === 'settings' && userProfile && (
        <Settings
          onSave={handleSaveSettings}
          userProfile={userProfile}
          email={session.user.email}
          onLogout={handleLogout}
        />
      )}
    </Layout>
  );
}

export default App;

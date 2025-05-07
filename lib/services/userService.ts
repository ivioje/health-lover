import { UserProfile, UserPreference, Category } from '../types';

// Current user - to be used across components
let currentUser: string | null = null;

// Get the current user email - could be replaced with proper authentication
export const getCurrentUserEmail = (): string => {
  if (typeof window !== 'undefined') {
    if (!currentUser) {
      currentUser = localStorage.getItem('userEmail') || 'alex@example.com';
      localStorage.setItem('userEmail', currentUser);
    }
    return currentUser;
  }
  return 'alex@example.com'; // fallback for server-side
};

// Set current user email
export const setCurrentUserEmail = (email: string): void => {
  if (typeof window !== 'undefined') {
    currentUser = email;
    localStorage.setItem('userEmail', email);
  }
};

// Get user data from API
export const getUserData = async (): Promise<UserProfile> => {
  const email = getCurrentUserEmail();
  try {
    const response = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// Update user preferences
export const updateUserPreferences = async (preferences: UserPreference): Promise<UserProfile> => {
  const email = getCurrentUserEmail();
  try {
    const response = await fetch(`/api/user/preferences?email=${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update preferences');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};

// Save a diet
export const saveDiet = async (dietId: string): Promise<UserProfile> => {
  const email = getCurrentUserEmail();
  try {
    const response = await fetch(`/api/user/saved-diets?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dietId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save diet');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving diet:', error);
    throw error;
  }
};

// Remove a saved diet
export const removeSavedDiet = async (dietId: string): Promise<UserProfile> => {
  const email = getCurrentUserEmail();
  try {
    const response = await fetch(`/api/user/saved-diets?email=${encodeURIComponent(email)}&dietId=${encodeURIComponent(dietId)}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove saved diet');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error removing saved diet:', error);
    throw error;
  }
};

// Create a new category
export const createCategory = async (name: string): Promise<UserProfile> => {
  const email = getCurrentUserEmail();
  try {
    const response = await fetch(`/api/user/categories?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Update all categories
export const updateCategories = async (categories: Category[]): Promise<UserProfile> => {
  const email = getCurrentUserEmail();
  try {
    const response = await fetch(`/api/user/categories?email=${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categories }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update categories');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating categories:', error);
    throw error;
  }
};
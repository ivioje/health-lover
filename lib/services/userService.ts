import { UserProfile, UserPreference, Category } from '../types';
import { getSession } from 'next-auth/react';

// Get the current user email from the authenticated session
export const getCurrentUserEmail = async (): Promise<string> => {
  if (typeof window !== 'undefined') {
    const session = await getSession();
    
    if (session?.user?.email) {
      return session.user.email;
    }
    
    throw new Error('User not authenticated');
  }
  return ''; // Empty string for server-side
};

// Get user data from API
export const getUserData = async (): Promise<UserProfile> => {
  try {
    const session = await getSession();
    
    if (!session?.user?.email) {
      throw new Error('User not authenticated');
    }
    
    const email = session.user.email;
    
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
  try {
    const session = await getSession();
    
    if (!session?.user?.email) {
      throw new Error('User not authenticated');
    }
    
    const email = session.user.email;
    
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
  try {
    const session = await getSession();
    
    if (!session?.user?.email) {
      throw new Error('User not authenticated');
    }
    
    const email = session.user.email;
    
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
  try {
    const session = await getSession();
    
    if (!session?.user?.email) {
      throw new Error('User not authenticated');
    }
    
    const email = session.user.email;
    
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
  try {
    const session = await getSession();
    
    if (!session?.user?.email) {
      throw new Error('User not authenticated');
    }
    
    const email = session.user.email;
    
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
  try {
    const session = await getSession();
    
    if (!session?.user?.email) {
      throw new Error('User not authenticated');
    }
    
    const email = session.user.email;
    
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
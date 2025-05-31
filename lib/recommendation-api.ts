import { Diet, RecipeRecommendation } from './types';
import { mapKetoDietToAppDiet, generateDietTags, searchKetoDiets } from './api';
import axios from 'axios';
import { 
  getCachedSimilarDiets, 
  cacheSimilarDiets,
  getCachedPopularDiets,
  cachePopularDiets
} from './cache/recommendation-cache';

const API_BASE_URL = '/api/recommendations';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

/**
 * Get similar diets for a specific diet
 * @param dietId - The ID of the diet to find similar diets for
 * @param num_recommendations - Number of similar diets to return (default: 4)
 */
export async function getSimilarDiets(dietId: string, num_recommendations: number = 4): Promise<Diet[]> {
  try {
    const cachedResult = getCachedSimilarDiets(dietId, num_recommendations);
    if (cachedResult) {
      console.log('Using cached similar diets');
      return cachedResult;
    }
    
    try {
      console.log(`Fetching similar diets for ${dietId} through Next.js API proxy`);
      const response = await apiClient.get(`/similar/${dietId}?num_recommendations=${num_recommendations}`);
      
      if (response.data && response.data.similar_diets) {
        console.log('Successfully received similar diets from API proxy');
        console.log('similar_diets', response.data.similar_diets);
        cacheSimilarDiets(dietId, num_recommendations, response.data.similar_diets);
        return response.data.similar_diets;
      } else {
        console.log('API response did not contain similar_diets property', response.data);
      }
    } catch (error: any) {
      console.error('Similar diets API failed:', error.message || 'Unknown error');
      console.log('Falling back to local data strategy');
    }
    
    const allDiets = await searchKetoDiets();
    const currentDiet = allDiets.find((diet: any) => diet.id.toString() === dietId);
    
    if (!currentDiet) {
      return [];
    }
    
    interface DietWithScore {
      diet: any;
      matchScore: number;
    }
    
    const currentTags = generateDietTags(currentDiet);
    const similarDiets = allDiets
      .filter((diet: any) => diet.id.toString() !== dietId)
      .map((diet: any) => {
        const tags = generateDietTags(diet);
        const matchingTags = tags.filter((tag: string) => currentTags.includes(tag));
        return {
          diet,
          matchScore: matchingTags.length
        };
      })
      .sort((a: DietWithScore, b: DietWithScore) => b.matchScore - a.matchScore)
      .slice(0, num_recommendations)
      .map((item: DietWithScore) => mapKetoDietToAppDiet(item.diet));
      
    // Cache the results even if they are from the fallback
    cacheSimilarDiets(dietId, num_recommendations, similarDiets);
    return similarDiets;
  } catch (error) {
    console.error('Error getting similar diets:', error);
    return [];
  }
}

/**
 * Get popular/trending diets
 * @param num_recommendations - Number of popular diets to return (default: 8)
 */
export async function getPopularDiets(num_recommendations: number = 8): Promise<Diet[]> {
  try {
    const cachedResult = getCachedPopularDiets(num_recommendations);
    if (cachedResult) {
      console.log('Using cached popular diets');
      return cachedResult;
    }
    
    try {
      console.log(`Fetching popular diets through Next.js API proxy`);
      const response = await apiClient.get(`/popular?num_recommendations=${num_recommendations}`);
      
      if (response.data && response.data.popular_diets) {
        console.log('Successfully received popular diets from API proxy');
        console.log('popular', response.data.popular_diets);
        cachePopularDiets(num_recommendations, response.data.popular_diets);
        return response.data.popular_diets;
      } else {
        console.log('API response did not contain popular_diets property', response.data);
      }
    } catch (error: any) {
      console.error('Popular diets API failed:', error.message || 'Unknown error');
      console.log('Falling back to local data strategy');
    }
    
    const allDiets = await searchKetoDiets();
    const popularDiets = allDiets
      .sort((a: any, b: any) => (b.calories || 0) - (a.calories || 0))
      .slice(0, num_recommendations)
      .map((diet: any) => mapKetoDietToAppDiet(diet));
      
    // Cache the results even if they are from the fallback
    cachePopularDiets(num_recommendations, popularDiets);
    return popularDiets;
  } catch (error) {
    console.error('Error getting popular diets:', error);
    return [];
  }
}

/**
 * Track that a user viewed a specific diet - for recommendation engine learning
 */
export async function trackDietView(userId: string, dietId: string): Promise<void> {
  try {
    // Track view through our NextJS API proxy
    await apiClient.post('/track-view', { user_id: userId, diet_id: dietId });
    
    // Also track view in our MongoDB backend if user is authenticated
    if (userId !== 'default_user') {
      try {
        const session = await import('next-auth/react').then(mod => mod.getSession());
        if (session?.user?.email) {
          // This would ideally call a backend API to track the view
          console.log('User view tracked:', userId, dietId);
        }
      } catch (e) {
        console.log('Session not available for tracking');
      }
    }
  } catch (error) {
    console.log('Failed to track diet view:', error);
  }
}


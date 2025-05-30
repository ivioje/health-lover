import { Diet, KetoDiet, PersonalizedRequest, UserPreferences } from './types';
import { getPopularDiets } from './recommendation-api';
import { getPersonalizedRecommendations, mapFastAPIRecommendationToAppDiet } from './api'
import { getUserData } from './services/userService';
import { 
  getCachedPersonalizedRecommendations, 
  cachePersonalizedRecommendations 
} from './cache/recommendation-cache';
import { getKetoDietById } from './api';
/**
 * Get personalized recommendations for the current user
 * This function integrates user data from MongoDB with the FastAPI recommendation engine
 * Includes caching to improve performance and reduce API calls
 */
export async function getUserPersonalizedRecommendations(count: number = 8): Promise<Diet[]> {
  try {
    const userData = await getUserData();
    
    const apiPreferences: UserPreferences = {
      dietary_restrictions: userData.preferences?.dietaryRestrictions || [],
      health_goals: userData.preferences?.healthGoals || [],
      activity_level: userData.preferences?.activityLevel || 'moderate',
      preferred_cuisines: [],
      disliked_ingredients: []
    };
    
    const request: PersonalizedRequest = {
      user_id: userData.email,
      preferences: apiPreferences,
      liked_recipes: userData.savedDiets?.map(id => Number(id)) || [],
      num_recommendations: count
    };
    const cachedResponse = getCachedPersonalizedRecommendations(request);
    if (cachedResponse && cachedResponse.recommendations) {
      console.log('Using cached personalized recommendations');
      console.log('Cached recommendations count:', cachedResponse.recommendations.length);
      const mappedDiets = await Promise.all(
        cachedResponse.recommendations.map(async (rec) => {
          let ketoDiet = null;
          try {
            ketoDiet = await getKetoDietById(Number(rec.id));
          } catch (e) {}
          return mapFastAPIRecommendationToAppDiet(rec, ketoDiet ? [ketoDiet] : undefined);
        })
      );
      return mappedDiets;
    }
    
    try {
      console.log('Calling personalized recommendations API with request:', request);
      const response = await getPersonalizedRecommendations(request);
      console.log('Received response from personalized recommendations API:', response);
      
      if (response && response.recommendations) {
        cachePersonalizedRecommendations(request, response);
        console.log('Cached personalized recommendations response');
        const mappedDiets = await Promise.all(
          response.recommendations.map(async (rec) => {
            let ketoDiet = null;
            try {
              ketoDiet = await getKetoDietById(Number(rec.id));
            } catch (e) {}
            return mapFastAPIRecommendationToAppDiet(rec, ketoDiet ? [ketoDiet] : undefined);
          })
        );
        console.log('Successfully mapped recommendations to Diet objects:', mappedDiets);
        return mappedDiets;
      } else {
        console.log('No recommendations received from API');
      }
    } catch (error) {
      console.error('Failed to get personalized recommendations:', error);
    }
    
    // Fallback to popular diets if personalized recommendations fail
    return await getPopularDiets(count);
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    return await getPopularDiets(count);
  }
}

import axios from 'axios';
import { KetoDiet, PersonalizedRequest, RecipeRecommendation, RecommendationRequest, RecommendationResponse, SearchParams } from './types';

const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;


const ketoApi = axios.create({
  baseURL: `https://keto-diet.p.rapidapi.com`,
  headers: {
    'x-rapidapi-key': RAPID_API_KEY,
    'x-rapidapi-host': 'keto-diet.p.rapidapi.com',
  },
});

// FastAPI backend configuration
const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

// FastAPI client
const fastApiClient = axios.create({
  baseURL: FASTAPI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function searchDiets(params: SearchParams) {
  try {
    const response = await ketoApi.get('/recipes/complexSearch', { 
      params: {
        ...params,
        addRecipeNutrition: true
      } 
    });
    return response.data;
  } catch (error) {
    console.error('Error searching diets:', error);
    throw error;
  }
}

export async function getDietById(id: number) {
  try {
    const response = await ketoApi.get(`/recipes/${id}/information`, {
      params: {
        includeNutrition: true
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching diet ${id}:`, error);
    throw error;
  }
}

export async function searchKetoDiets(params: SearchParams = {}) {
  try {
    const response = await ketoApi.get('/', { params });
    console.log("Keto diets response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error searching keto diets:', error);
    throw error;
  }
}

export async function getKetoDietById(id: number) {
  try {
    const response = await ketoApi.get('/');
    const diet = response.data.find((diet: KetoDiet) => diet.id === id);
    
    if (!diet) {
      throw new Error(`Diet with ID ${id} not found`);
    }
    
    return diet;
  } catch (error) {
    console.error(`Error fetching keto diet ${id}:`, error);
    throw error;
  }
}

export function generateDietTags(diet: KetoDiet): string[] {
  const tags: string[] = ['keto'];
    if (diet.category?.category) {
    tags.push(diet.category.category.toLowerCase().replace(/\s+/g, '-'));
  }
  
  if (diet.protein_in_grams && diet.protein_in_grams > 20) tags.push('high-protein');
  if (diet.protein_in_grams && diet.protein_in_grams < 10) tags.push('low-protein');
  
  if (diet.fat_in_grams && diet.fat_in_grams > 30) tags.push('high-fat');
  
  if (diet.carbohydrates_in_grams && diet.carbohydrates_in_grams < 10) tags.push('very-low-carb');
  if (diet.carbohydrates_in_grams && diet.carbohydrates_in_grams < 20) tags.push('low-carb');
  
  if (diet.difficulty) {
    tags.push(diet.difficulty.toLowerCase());
  }
  
  if (diet.calories && diet.calories < 300) tags.push('low-calorie');
  if (diet.calories && diet.calories > 500) tags.push('high-calorie');
  
  return tags;
}

export function extractIngredients(diet: KetoDiet): string[] {
  const ingredients = [];
  
  for (let i = 1; i <= 10; i++) {
    const measurementKey = `measurement_${i}` as keyof KetoDiet;
    const ingredientKey = `ingredient_${i}` as keyof KetoDiet;
    
    const measurement = diet[measurementKey];
    const ingredient = diet[ingredientKey];
    
    if (ingredient && typeof ingredient === 'string') {
      if (measurement) {
        ingredients.push(`${measurement} ${ingredient}`);
      } else {
        ingredients.push(ingredient);
      }
    }
  }
  
  return ingredients;
}

export function extractDirections(diet: KetoDiet): string[] {
  const directions = [];
  
  for (let i = 1; i <= 10; i++) {
    const directionKey = `directions_step_${i}` as keyof KetoDiet;
    const direction = diet[directionKey];
    
    if (direction && typeof direction === 'string') {
      directions.push(direction);
    }
  }
  
  return directions;
}

export function mapKetoDietToAppDiet(ketoDiet: KetoDiet) {
  const tags = generateDietTags(ketoDiet);
  const ingredients = extractIngredients(ketoDiet);
  const directions = extractDirections(ketoDiet);
  
  const totalTime = (ketoDiet.prep_time_in_minutes || 0) + (ketoDiet.cook_time_in_minutes || 0);
  
  return {
    id: ketoDiet.id.toString(),
    name: ketoDiet.recipe,
    description: `${ketoDiet.difficulty || 'Easy'} keto recipe with ${ketoDiet.protein_in_grams || 0}g protein and only ${ketoDiet.carbohydrates_in_grams || 0}g carbs. Ready in ${totalTime} minutes.`,
    imageUrl: ketoDiet.image || ketoDiet.category?.thumbnail || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop",
    tags,
    nutritionalFacts: {
      calories: ketoDiet.calories || 0,
      protein: ketoDiet.protein_in_grams || 0,
      carbs: ketoDiet.carbohydrates_in_grams || 0,
      fat: ketoDiet.fat_in_grams || 0
    },
    benefits: [
      "Keto-friendly recipe",
      `${ketoDiet.calories || 0} calories per serving`,
      `Contains ${ketoDiet.protein_in_grams || 0}g of protein`,
      `Only ${ketoDiet.carbohydrates_in_grams || 0}g of carbohydrates`
    ],
    sampleMeals: [
      {
        name: ketoDiet.recipe,
        description: `Ingredients: ${ingredients.slice(0, 3).join(', ')}${ingredients.length > 3 ? '...' : ''}`
      }
    ],
    recipe: {
      ingredients,
      directions,
      servings: ketoDiet.serving || 1,
      prepTime: ketoDiet.prep_time_in_minutes || 0,
      cookTime: ketoDiet.cook_time_in_minutes || 0,
      difficulty: ketoDiet.difficulty || 'Easy'
    }
  };
}

// FastAPI recommendation functions
export async function getPersonalizedRecommendations(request: PersonalizedRequest): Promise<RecommendationResponse> {
  try {
    const response = await fastApiClient.post('/recommendations/personalized', request);
    return response.data;
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    throw error;
  }
}

export async function getContentBasedRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
  try {
    const response = await fastApiClient.post('/recommendations/content-based', request);
    return response.data;
  } catch (error) {
    console.error('Error getting content-based recommendations:', error);
    throw error;
  }
}

export async function getHybridRecommendations(request: RecommendationRequest & { content_weight?: number }): Promise<RecommendationResponse> {
  try {
    const response = await fastApiClient.post('/recommendations/hybrid', request);
    return response.data;
  } catch (error) {
    console.error('Error getting hybrid recommendations:', error);
    throw error;
  }
}

export async function getTrendingRecipes(num_recommendations: number = 10): Promise<{ trending_recipes: RecipeRecommendation[], total_count: number }> {
  try {
    const response = await fastApiClient.get(`/recommendations/trending?num_recommendations=${num_recommendations}`);
    return response.data;
  } catch (error) {
    console.error('Error getting trending recipes:', error);
    throw error;
  }
}

export async function getSimilarRecipes(recipe_id: number, num_recommendations: number = 5): Promise<{ recipe_id: number, similar_recipes: RecipeRecommendation[], total_count: number }> {
  try {
    const response = await fastApiClient.get(`/recommendations/similar/${recipe_id}?num_recommendations=${num_recommendations}`);
    return response.data;
  } catch (error) {
    console.error('Error getting similar recipes:', error);
    throw error;
  }
}

export async function getRecommendationCategories(): Promise<{ categories: string[], total_count: number }> {
  try {
    const response = await fastApiClient.get('/recommendations/categories');
    return response.data;
  } catch (error) {
    console.error('Error getting recommendation categories:', error);
    throw error;
  }
}

export async function getRecommendationSystemStats(): Promise<any> {
  try {
    const response = await fastApiClient.get('/recommendations/stats');
    return response.data;
  } catch (error) {
    console.error('Error getting recommendation system stats:', error);
    throw error;
  }
}

export async function checkRecommendationHealth(): Promise<any> {
  try {
    const response = await fastApiClient.get('/recommendations/health');
    return response.data;
  } catch (error) {
    console.error('Error checking recommendation service health:', error);
    throw error;
  }
}

// map FastAPI recommendations to app diet format
export function mapFastAPIRecommendationToAppDiet(recommendation: RecipeRecommendation) {
  const totalTime = (recommendation.prep_time_in_minutes || 0) + (recommendation.cook_time_in_minutes || 0);
  
  return {
    id: recommendation.id.toString(),
    name: recommendation.recipe,
    description: `${recommendation.difficulty || 'Easy'} recipe with ${recommendation.nutritional_info.protein_in_grams || 0}g protein and only ${recommendation.nutritional_info.carbohydrates_in_grams || 0}g carbs. Ready in ${totalTime} minutes. ${recommendation.reason}`,
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop",
    tags: [
      recommendation.category?.toLowerCase().replace(/\s+/g, '-') || 'recipe',
      recommendation.difficulty?.toLowerCase() || 'easy',
      recommendation.nutritional_info.calories && recommendation.nutritional_info.calories < 300 ? 'low-calorie' : 'moderate-calorie',
      recommendation.nutritional_info.protein_in_grams && recommendation.nutritional_info.protein_in_grams > 20 ? 'high-protein' : 'moderate-protein',
      recommendation.nutritional_info.carbohydrates_in_grams && recommendation.nutritional_info.carbohydrates_in_grams < 20 ? 'low-carb' : 'moderate-carb'
    ].filter(Boolean),
    nutritionalFacts: {
      calories: recommendation.nutritional_info.calories || 0,
      protein: recommendation.nutritional_info.protein_in_grams || 0,
      carbs: recommendation.nutritional_info.carbohydrates_in_grams || 0,
      fat: recommendation.nutritional_info.fat_in_grams || 0
    },
    benefits: [
      "AI-recommended recipe",
      `${recommendation.nutritional_info.calories || 0} calories per serving`,
      `Contains ${recommendation.nutritional_info.protein_in_grams || 0}g of protein`,
      `Only ${recommendation.nutritional_info.carbohydrates_in_grams || 0}g of carbohydrates`,
      recommendation.reason
    ],
    sampleMeals: [
      {
        name: recommendation.recipe,
        description: recommendation.reason
      }
    ],
    recipe: {
      ingredients: [],
      directions: [],
      servings: recommendation.serving || 1,
      prepTime: recommendation.prep_time_in_minutes || 0,
      cookTime: recommendation.cook_time_in_minutes || 0,
      difficulty: recommendation.difficulty || 'Easy'
    }
  };
}

import axios from 'axios';
import { 
  Diet,
  KetoDiet, 
  SearchParams, 
  UserPreferences, 
  RecommendationRequest, 
  RecommendationResponse, 
  RecipeRecommendation, 
  PersonalizedRequest, 
  ContentBasedRequest, 
  CollaborativeRequest, 
  HybridRequest, 
  UserViewRequest, 
  UserLikeRequest, 
  UserAddToFolderRequest 
} from './types';

const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
const ketoApi = axios.create({
  baseURL: `https://keto-diet.p.rapidapi.com`,
  headers: {
    'x-rapidapi-key': RAPID_API_KEY,
    'x-rapidapi-host': 'keto-diet.p.rapidapi.com',
  },
});

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
    if (config.url?.startsWith('/api/recommendations') || config.url?.startsWith('/api/user')) {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        data: config.data
      });
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
  (response) => {
    if (response.config.url?.startsWith('/api/recommendations') || response.config.url?.startsWith('/api/user')) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

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

export function mapKetoDietToAppDiet(ketoDiet: KetoDiet): Diet {
  const tags = generateDietTags(ketoDiet);
  const ingredients = extractIngredients(ketoDiet);
  const directions = extractDirections(ketoDiet);
  
  const totalTime = (ketoDiet.prep_time_in_minutes || 0) + (ketoDiet.cook_time_in_minutes || 0);
  
  // Ensure imageUrl is always a string
  console.log("Keto diet image:", ketoDiet.image, "Category thumbnail:", ketoDiet.category?.thumbnail);
  const imageUrl = ketoDiet.image || ketoDiet.category?.thumbnail || '';
  
  return {
    id: ketoDiet.id.toString(),
    name: ketoDiet.recipe,
    description: `${ketoDiet.difficulty || 'Easy'} keto recipe with ${ketoDiet.protein_in_grams || 0}g protein and only ${ketoDiet.carbohydrates_in_grams || 0}g carbs. Ready in ${totalTime} minutes.`,
    imageUrl,
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

// --- FastAPI Recommendation Integration ---
export async function 
getPersonalizedRecommendations(request: PersonalizedRequest): 
Promise<RecommendationResponse> {
  try {
    // Use Next.js API route as proxy to avoid CORS issues
    const response = await axios.post('/api/recommendations/personalized/recommendations', request);
    return response.data;
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    throw error;
  }
}

export async function 
getContentBasedRecommendations(request: ContentBasedRequest): 
Promise<RecommendationResponse> {
  try {
    // Use Next.js API route as proxy to avoid CORS issues
    const response = await axios.post('/api/recommendations/content-based', request);
    return response.data;
  } catch (error) {
    console.error('Error getting content-based recommendations:', error);
    throw error;
  }
}

export async function 
getCollaborativeRecommendations(request: CollaborativeRequest): 
Promise<RecommendationResponse> {
  try {
    // Use Next.js API route as proxy to avoid CORS issues
    const response = await axios.post('/api/recommendations/collaborative', request);
    return response.data;
  } catch (error) {
    console.error('Error getting collaborative recommendations:', error);
    throw error;
  }
}

export async function 
getHybridRecommendations(request: HybridRequest): 
Promise<RecommendationResponse> {
  try {
    // Use Next.js API route as proxy to avoid CORS issues
    const response = await axios.post('/api/recommendations/hybrid', request);
    return response.data;
  } catch (error) {
    console.error('Error getting hybrid recommendations:', error);
    throw error;
  }
}

export async function 
getTrendingRecipes(num_recommendations: number = 10): 
Promise<{ trending_recipes: RecipeRecommendation[], total_count: number }> {
  try {
    // Use Next.js API route as proxy to avoid CORS issues
    const response = await axios.get(`/api/recommendations/trending?num_recommendations=${num_recommendations}`);
    return response.data;
  } catch (error) {
    console.error('Error getting trending recipes:', error);
    throw error;
  }
}

export async function 
getSimilarRecipes(recipe_id: number, num_recommendations: number = 5): 
Promise<{ recipe_id: number, similar_recipes: RecipeRecommendation[], total_count: number }> {
  try {
    // Use Next.js API route as proxy to avoid CORS issues
    const response = await axios.get(`/api/recommendations/similar-recipes/${recipe_id}?num_recommendations=${num_recommendations}`);
    return response.data;
  } catch (error) {
    console.error('Error getting similar recipes:', error);
    throw error;
  }
}

export async function getRecommendationCategories(): Promise<{ categories: string[], total_count: number }> {
  try {
    // Use Next.js API route as proxy to avoid CORS issues
    const response = await axios.get('/api/recommendations/categories');
    return response.data;
  } catch (error) {
    console.error('Error getting recommendation categories:', error);
    throw error;
  }
}

export async function getRecommendationSystemStats(): Promise<any> {
  try {
    // Use Next.js API route as proxy to avoid CORS issues
    const response = await axios.get('/api/recommendations/stats');
    return response.data;
  } catch (error) {
    console.error('Error getting recommendation system stats:', error);
    throw error;
  }
}

export async function checkRecommendationHealth(): Promise<any> {
  try {
    // Use Next.js API route as proxy to avoid CORS issues
    const response = await axios.get('/api/recommendations/health');
    return response.data;
  } catch (error) {
    console.error('Error checking recommendation service health:', error);
    throw error;
  }
}

// User interaction tracking functions
export async function trackUserView(request: UserViewRequest): Promise<void> {
  try {
    // Use Next.js API route as proxy to avoid CORS issues
    await axios.post('/api/user/view', request);
  } catch (error) {
    console.error('Error tracking user view:', error);
    throw error;
  }
}

export async function trackUserLike(request: UserLikeRequest): Promise<void> {
  try {
    // Use Next.js API route as proxy to avoid CORS issues
    await axios.post('/api/user/like', request);
  } catch (error) {
    console.error('Error tracking user like:', error);
    throw error;
  }
}

export async function trackUserAddToFolder(request: UserAddToFolderRequest): Promise<void> {
  try {
    // Use Next.js API route as proxy to avoid CORS issues
    await axios.post('/api/user/add-to-folder', request);
  } catch (error) {
    console.error('Error tracking add to folder:', error);
    throw error;
  }
}

// Helper to map FastAPI recommendation to app diet format, using keto diet image if available
export function mapFastAPIRecommendationToAppDiet(
  rec: RecipeRecommendation,
  ketoDiets?: KetoDiet[]
): Diet {
  const tags: string[] = ['ai-recommended'];
  if (rec.category) {
    tags.push(rec.category.toLowerCase().replace(/\s+/g, '-'));
  }
  if (rec.difficulty) {
    tags.push(rec.difficulty.toLowerCase());
  }
  if (rec.nutritional_info.protein_in_grams && rec.nutritional_info.protein_in_grams > 20) {
    tags.push('high-protein');
  }
  if (rec.nutritional_info.calories && rec.nutritional_info.calories < 300) {
    tags.push('low-calorie');
  }

  // Try to find a matching keto diet by id for image
  let imageUrl = ''
  if (ketoDiets) {
    const matched = ketoDiets.find(diet => diet.id.toString() === rec.id.toString());
    if (matched?.image) {
      imageUrl = matched.image;
    } else if (matched?.category?.thumbnail) {
      imageUrl = matched.category.thumbnail;
    }
  }
  console.log("Mapped recommendation image:", imageUrl);

  return {
    id: rec.id.toString(),
    name: rec.recipe,
    description: rec.reason,
    imageUrl, // always a string, never undefined
    tags,
    nutritionalFacts: {
      calories: rec.nutritional_info.calories || 0,
      protein: rec.nutritional_info.protein_in_grams || 0,
      carbs: rec.nutritional_info.carbohydrates_in_grams || 0,
      fat: rec.nutritional_info.fat_in_grams || 0,
    },
    benefits: [rec.reason],
    sampleMeals: [
      {
        name: rec.recipe,
        description: `AI-recommended ${rec.category || 'recipe'} with ${rec.nutritional_info.calories || 0} calories`
      }
    ],
  };
}
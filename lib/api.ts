import axios from 'axios';

const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;


const ketoApi = axios.create({
  baseURL: `https://keto-diet.p.rapidapi.com`,
  headers: {
    'x-rapidapi-key': RAPID_API_KEY,
    'x-rapidapi-host': 'keto-diet.p.rapidapi.com',
  },
});

export interface KetoDiet {
  id: number;
  recipe: string;
  category?: {
    id: number;
    category: string;
    thumbnail: string;
  };
  prep_time_in_minutes?: number;
  cook_time_in_minutes?: number;
  difficulty?: string;
  serving?: number;
  measurement_1?: string | number;
  measurement_2?: string | number;
  measurement_3?: string | number;
  measurement_4?: string | number;
  measurement_5?: string | number;
  measurement_6?: string | number;
  measurement_7?: string | number;
  measurement_8?: string | number;
  measurement_9?: string | number;
  measurement_10?: string | number;
  ingredient_1?: string;
  ingredient_2?: string;
  ingredient_3?: string;
  ingredient_4?: string;
  ingredient_5?: string;
  ingredient_6?: string;
  ingredient_7?: string;
  ingredient_8?: string;
  ingredient_9?: string;
  ingredient_10?: string;
  directions_step_1?: string;
  directions_step_2?: string;
  directions_step_3?: string;
  directions_step_4?: string;
  directions_step_5?: string;
  directions_step_6?: string;
  directions_step_7?: string;
  directions_step_8?: string;
  directions_step_9?: string;
  directions_step_10?: string;
  image?: string;
  calories?: number;
  fat_in_grams?: number;
  carbohydrates_in_grams?: number;
  protein_in_grams?: number;
}

export interface SearchParams {
  query?: string;
  diet?: string;
  intolerances?: string;
  type?: string;
  number?: number;
  offset?: number;
  sort?: string;
  protein_in_grams__lt?: string;
  protein_in_grams__gt?: string;
  calories__lt?: string;
  calories__gt?: string;
  carbohydrates_in_grams__lt?: string;
  carbohydrates_in_grams__gt?: string;
  fat_in_grams__lt?: string;
  fat_in_grams__gt?: string;
  sugar_in_grams__lt?: string;
  sugar_in_grams__gt?: string;
  fiber_in_grams__lt?: string;
  fiber_in_grams__gt?: string;
}

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

// Helper function to generate tags based on nutritional values
export function generateDietTags(diet: KetoDiet): string[] {
  const tags: string[] = ['keto'];
  
  // Add category as tag if available
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

// Extract ingredients from a keto diet
export function extractIngredients(diet: KetoDiet): string[] {
  const ingredients = [];
  
  // Loop through the possible ingredients (1-10)
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

// Extract directions from a keto diet
export function extractDirections(diet: KetoDiet): string[] {
  const directions = [];
  
  // Loop through the possible directions (1-10)
  for (let i = 1; i <= 10; i++) {
    const directionKey = `directions_step_${i}` as keyof KetoDiet;
    const direction = diet[directionKey];
    
    if (direction && typeof direction === 'string') {
      directions.push(direction);
    }
  }
  
  return directions;
}

// Helper function to map KetoDiet to your application's Diet type
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

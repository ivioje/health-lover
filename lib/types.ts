export interface Diet {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tags: string[];
  nutritionalFacts: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  benefits: string[];
  sampleMeals: {
    name: string;
    description: string;
  }[];
  recipe?: {
    ingredients: string[];
    directions: string[];
    servings: number;
    prepTime: number;
    cookTime: number;
    difficulty: string;
  };
}

export interface Category {
  _id: string;
  name: string;
  dietIds: string[];
}

export interface UserPreference {
  dietaryRestrictions: string[];
  healthGoals: string[];
  activityLevel: string;
  age: number;
}

export interface HealthPrediction {
  condition: string;
  risk: 'low' | 'medium' | 'high';
  score: number;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences: UserPreference;
  categories: Category[];
  savedDiets: string[];
  healthPredictions: HealthPrediction[];
  emailVerified?: Date | null;
  image?: string | null;
  provider?: string | null;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: UserProfile;
}

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

export interface CreateCategoryProps {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    newCategoryName: string;
    setNewCategoryName: (name: string) => void;
    isLoading: boolean;
    handleCreateCategory: () => void;
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    categories: { id: string; name: string }[];
    tabTriggers: React.ReactNode;
    tabContents: React.ReactNode;
    searchQuery?: string;
    handleSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface DietCategory {
  id: string;
  name?: string;
  imageUrl?: string;
  nutritionalFacts?: {
    calories?: number;
  };
}

export interface CategoryTabsProps {
  category: { id: string; name: string };
  index: number;
  categoryDiets: DietCategory[];
  handleDeleteCategory: (categoryId: string) => void;
  isLoading: boolean;
  dietsLoading: boolean;
  dietIndex?: number;
  diet?: DietCategory;
  removeDietFromCategory: (categoryId: string, dietId: string) => void;
}

// Types for FastAPI integration
export interface UserPreferences {
  dietary_restrictions: string[];
  health_goals: string[];
  activity_level: string;
  preferred_cuisines: string[];
  disliked_ingredients: string[];
}

export interface RecommendationRequest {
  user_id: string;
  preferences?: UserPreferences;
  num_recommendations?: number;
  content_weight?: number;
}

export interface PersonalizedRequest extends RecommendationRequest {
  preferences: UserPreferences;
  liked_recipes?: number[];
}

export interface NutritionalInfo {
  calories: number | null;
  protein_in_grams: number | null;
  carbohydrates_in_grams: number | null;
  fat_in_grams: number | null;
}

export interface RecipeRecommendation {
  id: number;
  recipe: string;
  category?: string | null;
  difficulty?: string | null;
  prep_time_in_minutes?: number | null;
  cook_time_in_minutes?: number | null;
  serving?: number | null;
  nutritional_info: NutritionalInfo;
  confidence_score: number;
  reason: string;
}

export interface RecommendationResponse {
  recommendations: RecipeRecommendation[];
  total_count: number;
  algorithm_used: string;
  user_id: string;
}

// Additional FastAPI request types
export interface ContentBasedRequest {
  user_id: string;
  preferences: UserPreferences;
  num_recommendations?: number;
}

export interface CollaborativeRequest {
  user_id: string;
  num_recommendations?: number;
}

export interface HybridRequest {
  user_id: string;
  preferences: UserPreferences;
  num_recommendations?: number;
  content_weight?: number;
}

// User interaction tracking types
export interface UserViewRequest {
  user_id: string;
  diet_id: string;
}

export interface UserLikeRequest {
  user_id: string;
  diet_id: string;
}

export interface UserAddToFolderRequest {
  user_id: string;
  diet_id: string;
  folder_name: string;
}

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
  id: string;
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
  // Auth-related properties
  emailVerified?: Date | null;
  image?: string | null;
  provider?: string | null;
}

// Authentication Types
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
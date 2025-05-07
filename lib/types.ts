export interface Diet {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  nutritionalFacts: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
  benefits: string[];
  tags: string[];
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
}
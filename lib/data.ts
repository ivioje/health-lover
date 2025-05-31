import { BarChart2, Brain, ChefHat, Heart, Home, PieChart, Salad, User } from 'lucide-react';
import { Diet, Category, HealthPrediction } from './types';


export const routes = [
  { name: "Home", href: "/", icon: Home },
  { name: "Diet Gallery", href: "/diets", icon: Salad },
  { name: "Dashboard", href: "/dashboard", icon: BarChart2 },
  { name: "Preferences", href: "/preferences", icon: User },
  { name: "For You", href: "/recommendations", icon: ChefHat },
];

export const dietaryRestrictionOptions = [
  { id: "gluten-free", label: "Gluten Free" },
  { id: "dairy-free", label: "Dairy Free" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "nut-free", label: "Nut Free" },
  { id: "low-sodium", label: "Low Sodium" },
];

export const healthGoalOptions = [
  { id: "weight-loss", label: "Weight Loss" },
  { id: "muscle-gain", label: "Muscle Gain" },
  { id: "maintenance", label: "Maintenance" },
  { id: "increase-energy", label: "Increase Energy" },
  { id: "improve-digestion", label: "Improve Digestion" },
];

export const healthPredictions: HealthPrediction[] = [
  {
    condition: 'Heart Disease',
    risk: 'low',
    score: 12,
    description: 'Based on your diet and preferences, your risk for heart disease is low.',
  },
  {
    condition: 'Type 2 Diabetes',
    risk: 'medium',
    score: 45,
    description: 'Your current diet may increase your risk for type 2 diabetes. Consider reducing sugar intake.',
  },
  {
    condition: 'Obesity',
    risk: 'low',
    score: 15,
    description: 'Your diet is well-balanced for weight management.',
  },
  {
    condition: 'High Blood Pressure',
    risk: 'medium',
    score: 38,
    description: 'Consider reducing sodium intake to lower your risk of high blood pressure.',
  },
  {
    condition: 'Nutrient Deficiencies',
    risk: 'low',
    score: 20,
    description: 'Your diverse diet provides good nutrient coverage.',
  },
];

export const features = [
  {
    title: "AI Health Predictions",
    description:
      "Our advanced AI models analyze your diet and lifestyle to predict potential health risks with remarkable accuracy.",
    icon: Brain,
  },
  {
    title: "Personalized Diet Plans",
    description:
      "Receive custom dietary recommendations tailored to your unique body, preferences, and health goals.",
    icon: Heart,
  },
  {
    title: "Nutritional Analysis",
    description:
      "Get detailed breakdowns of macro and micronutrients to ensure a balanced and optimal diet.",
    icon: PieChart,
  },
  {
    title: "Curated Recipes",
    description:
      "Discover delicious recipes that match your dietary preferences and nutritional requirements.",
    icon: ChefHat,
  },
];

export const recommendedDiets = ['1', '2', '8'];
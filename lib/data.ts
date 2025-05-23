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

export const diets: Diet[] = [
  {
    id: '1',
    name: 'Mediterranean Diet',
    description: 'A diet based on the traditional foods that people used to eat in countries like Italy and Greece.',
    imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    nutritionalFacts: {
      calories: 2000,
      carbs: 50,
      protein: 20,
      fat: 30,
    },
    benefits: [
      'Reduces heart disease risk',
      'Helps maintain weight',
      'Prevents cognitive decline',
    ],
    tags: ['heart-healthy', 'balanced', 'anti-inflammatory'],
    sampleMeals: []
  },
  {
    id: '2',
    name: 'DASH Diet',
    description: 'Dietary Approaches to Stop Hypertension - a diet plan designed to help treat or prevent high blood pressure.',
    imageUrl: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    nutritionalFacts: {
      calories: 1800,
      carbs: 55,
      protein: 18,
      fat: 27,
    },
    benefits: [
      'Lowers blood pressure',
      'Promotes heart health',
      'Reduces risk of diabetes',
    ],
    tags: ['low-sodium', 'heart-healthy', 'balanced'],
    sampleMeals: []
  },
  {
    id: '3',
    name: 'Ketogenic Diet',
    description: 'A very low-carb, high-fat diet that puts your body into a metabolic state called ketosis.',
    imageUrl: 'https://images.pexels.com/photos/357737/pexels-photo-357737.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    nutritionalFacts: {
      calories: 2200,
      carbs: 5,
      protein: 20,
      fat: 75,
    },
    benefits: [
      'Rapid weight loss',
      'Reduced hunger',
      'Improved energy levels',
    ],
    tags: ['low-carb', 'high-fat', 'weight-loss'],
    sampleMeals: []
  },
  {
    id: '4',
    name: 'Plant-Based Diet',
    description: 'A diet focused on foods primarily from plants, including vegetables, fruits, nuts, seeds, oils, whole grains, legumes, and beans.',
    imageUrl: 'https://images.pexels.com/photos/1580466/pexels-photo-1580466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    nutritionalFacts: {
      calories: 1900,
      carbs: 60,
      protein: 15,
      fat: 25,
    },
    benefits: [
      'Reduces inflammation',
      'Lowers cholesterol levels',
      'Promotes healthy digestion',
    ],
    tags: ['plant-based', 'vegan', 'high-fiber'],
    sampleMeals: []
  },
  {
    id: '5',
    name: 'Paleo Diet',
    description: 'A diet based on foods similar to what might have been eaten during the Paleolithic era.',
    imageUrl: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    nutritionalFacts: {
      calories: 2100,
      carbs: 25,
      protein: 30,
      fat: 45,
    },
    benefits: [
      'Weight loss',
      'Improved blood lipids',
      'Reduced inflammation',
    ],
    tags: ['grain-free', 'high-protein', 'ancestral'],
    sampleMeals: []
  },
  {
    id: '6',
    name: 'Intermittent Fasting',
    description: 'An eating pattern that cycles between periods of fasting and eating.',
    imageUrl: 'https://images.pexels.com/photos/616330/pexels-photo-616330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    nutritionalFacts: {
      calories: 1800,
      carbs: 40,
      protein: 25,
      fat: 35,
    },
    benefits: [
      'Weight loss',
      'Improved metabolic health',
      'Enhanced cellular repair',
    ],
    tags: ['fasting', 'flexible', 'metabolic-health'],
    sampleMeals: []
  },
  {
    id: '7',
    name: 'Nordic Diet',
    description: 'Based on traditional foods available in Nordic countries, focusing on local, seasonal ingredients.',
    imageUrl: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    nutritionalFacts: {
      calories: 2000,
      carbs: 45,
      protein: 20,
      fat: 35,
    },
    benefits: [
      'Reduced inflammation',
      'Lower blood pressure',
      'Weight maintenance',
    ],
    tags: ['sustainable', 'balanced', 'heart-healthy'],
    sampleMeals: []
  },
  {
    id: '8',
    name: 'MIND Diet',
    description: 'A hybrid of the Mediterranean and DASH diets, designed to focus on brain health.',
    imageUrl: 'https://images.pexels.com/photos/5938/food-salad-healthy-lunch.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    nutritionalFacts: {
      calories: 1900,
      carbs: 45,
      protein: 18,
      fat: 37,
    },
    benefits: [
      'Supports brain health',
      'Reduces risk of Alzheimer\'s',
      'Promotes cognitive function',
    ],
    tags: ['brain-health', 'heart-healthy', 'anti-inflammatory'],
    sampleMeals: []
  },
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
// ================================
// Firestore Database Schema Types
// ================================

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  healthGoal: HealthGoal;
  dietaryRestrictions: DietaryRestriction[];
  allergies: string[];
  preferredLanguage: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  height: number; // cm
  weight: number; // kg
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: ActivityLevel;
  createdAt: string;
  updatedAt: string;
}

export type HealthGoal = 
  | 'weight_loss'
  | 'muscle_gain'
  | 'maintenance'
  | 'diabetes_management'
  | 'heart_health'
  | 'general_wellness';

export type DietaryRestriction = 
  | 'vegetarian'
  | 'vegan'
  | 'gluten_free'
  | 'dairy_free'
  | 'keto'
  | 'paleo'
  | 'halal'
  | 'kosher'
  | 'low_sodium'
  | 'low_sugar';

export type ActivityLevel = 
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active';

export interface MealLog {
  id: string;
  userId: string;
  imageUrl: string | null;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodItems: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  healthScore: number; // 1-100
  aiSuggestions: string[];
  visionLabels: string[];
  timestamp: string;
  date: string; // YYYY-MM-DD
}

export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  confidence: number; // 0-1 from Vision API
}

export interface MealPlan {
  id: string;
  userId: string;
  weekStart: string; // YYYY-MM-DD
  weekEnd: string;
  targetCalories: number;
  healthGoal: HealthGoal;
  days: DayPlan[];
  generatedAt: string;
}

export interface DayPlan {
  date: string;
  dayName: string;
  meals: PlannedMeal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface PlannedMeal {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: string[];
  recipe: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  imageUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface FitnessData {
  date: string;
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  workouts: Workout[];
  restingHeartRate: number;
  sleepHours: number;
}

export interface Workout {
  type: string;
  duration: number; // minutes
  caloriesBurned: number;
  intensity: 'low' | 'medium' | 'high';
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  avgCaloriesConsumed: number;
  avgCaloriesBurned: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  totalMealsLogged: number;
  avgHealthScore: number;
  topFoods: string[];
  recommendations: string[];
}

export interface NearbyRestaurant {
  placeId: string;
  name: string;
  address: string;
  rating: number;
  priceLevel: number;
  cuisineType: string;
  dietaryOptions: string[];
  healthScore: number;
  distance: number;
  lat: number;
  lng: number;
  photoUrl: string | null;
  isOpen: boolean;
}

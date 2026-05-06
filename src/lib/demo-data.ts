import { MealLog, MealPlan, FitnessData, NearbyRestaurant, WeeklyReport, UserProfile, ChatMessage } from './firestore-schema';

export const DEMO_USER: UserProfile = {
  uid: 'demo-user-001',
  email: 'demo@nutrisense.app',
  displayName: 'Alex Johnson',
  photoURL: null,
  healthGoal: 'weight_loss',
  dietaryRestrictions: ['gluten_free'],
  allergies: ['peanuts'],
  preferredLanguage: 'en',
  targetCalories: 2000,
  targetProtein: 150,
  targetCarbs: 200,
  targetFat: 67,
  height: 175,
  weight: 80,
  age: 28,
  gender: 'male',
  activityLevel: 'moderately_active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEMO_MEAL_LOGS: MealLog[] = [
  {
    id: 'meal-001', userId: 'demo-user-001', imageUrl: null,
    mealType: 'breakfast',
    foodItems: [
      { name: 'Greek Yogurt', quantity: '200g', calories: 130, protein: 20, carbs: 8, fat: 3, fiber: 0, confidence: 0.95 },
      { name: 'Mixed Berries', quantity: '100g', calories: 57, protein: 1, carbs: 14, fat: 0, fiber: 3, confidence: 0.92 },
      { name: 'Granola', quantity: '30g', calories: 140, protein: 3, carbs: 22, fat: 5, fiber: 2, confidence: 0.88 },
    ],
    totalCalories: 327, totalProtein: 24, totalCarbs: 44, totalFat: 8, totalFiber: 5,
    healthScore: 85,
    aiSuggestions: ['Great protein-rich breakfast!', 'Consider adding chia seeds for omega-3.'],
    visionLabels: ['yogurt', 'berries', 'granola', 'bowl', 'breakfast'],
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'meal-002', userId: 'demo-user-001', imageUrl: null,
    mealType: 'lunch',
    foodItems: [
      { name: 'Grilled Chicken Breast', quantity: '200g', calories: 330, protein: 62, carbs: 0, fat: 7, fiber: 0, confidence: 0.97 },
      { name: 'Quinoa', quantity: '150g', calories: 180, protein: 7, carbs: 32, fat: 3, fiber: 3, confidence: 0.90 },
      { name: 'Mixed Salad', quantity: '100g', calories: 25, protein: 2, carbs: 4, fat: 0, fiber: 2, confidence: 0.93 },
    ],
    totalCalories: 535, totalProtein: 71, totalCarbs: 36, totalFat: 10, totalFiber: 5,
    healthScore: 92,
    aiSuggestions: ['Excellent lean protein choice!', 'Add olive oil dressing for healthy fats.'],
    visionLabels: ['chicken', 'salad', 'quinoa', 'plate'],
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'meal-003', userId: 'demo-user-001', imageUrl: null,
    mealType: 'dinner',
    foodItems: [
      { name: 'Salmon Fillet', quantity: '180g', calories: 367, protein: 40, carbs: 0, fat: 22, fiber: 0, confidence: 0.96 },
      { name: 'Sweet Potato', quantity: '200g', calories: 180, protein: 4, carbs: 41, fat: 0, fiber: 6, confidence: 0.91 },
      { name: 'Steamed Broccoli', quantity: '100g', calories: 35, protein: 3, carbs: 7, fat: 0, fiber: 3, confidence: 0.94 },
    ],
    totalCalories: 582, totalProtein: 47, totalCarbs: 48, totalFat: 22, totalFiber: 9,
    healthScore: 90,
    aiSuggestions: ['Great omega-3 rich dinner!', 'Well-balanced macronutrient profile.'],
    visionLabels: ['salmon', 'fish', 'sweet potato', 'broccoli'],
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
  },
];

const today = new Date();
const weekStart = new Date(today);
weekStart.setDate(today.getDate() - today.getDay());

export const DEMO_MEAL_PLAN: MealPlan = {
  id: 'plan-001', userId: 'demo-user-001',
  weekStart: weekStart.toISOString().split('T')[0],
  weekEnd: new Date(weekStart.getTime() + 6 * 86400000).toISOString().split('T')[0],
  targetCalories: 2000, healthGoal: 'weight_loss',
  generatedAt: new Date().toISOString(),
  days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map((day, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().split('T')[0], dayName: day,
      totalCalories: 1900 + Math.floor(Math.random() * 200),
      totalProtein: 140 + Math.floor(Math.random() * 30),
      totalCarbs: 180 + Math.floor(Math.random() * 40),
      totalFat: 55 + Math.floor(Math.random() * 20),
      meals: [
        { mealType: 'breakfast' as const, name: ['Avocado Toast & Eggs','Protein Smoothie Bowl','Overnight Oats','Veggie Omelette','Banana Pancakes','Chia Pudding','Shakshuka'][i],
          description: 'Nutritious start to the day', calories: 350 + i * 10, protein: 25 + i, carbs: 35 + i * 2, fat: 15 + i, fiber: 5,
          ingredients: ['Fresh ingredients'], recipe: 'Prepare and enjoy', prepTime: 10, cookTime: 15 },
        { mealType: 'lunch' as const, name: ['Grilled Chicken Salad','Turkey Wrap','Buddha Bowl','Lentil Soup','Poke Bowl','Chicken Stir-fry','Caprese Sandwich'][i],
          description: 'Balanced and filling lunch', calories: 550 + i * 10, protein: 45 + i * 2, carbs: 45 + i * 3, fat: 18 + i, fiber: 7,
          ingredients: ['Fresh ingredients'], recipe: 'Prepare and enjoy', prepTime: 15, cookTime: 20 },
        { mealType: 'dinner' as const, name: ['Baked Salmon','Lean Beef Stir-fry','Stuffed Bell Peppers','Herb Roast Chicken','Shrimp Pasta','Tofu Curry','Grilled Fish Tacos'][i],
          description: 'Satisfying and nutritious dinner', calories: 600 + i * 10, protein: 50 + i * 2, carbs: 40 + i * 2, fat: 22 + i, fiber: 6,
          ingredients: ['Fresh ingredients'], recipe: 'Prepare and enjoy', prepTime: 15, cookTime: 30 },
        { mealType: 'snack' as const, name: ['Protein Bar','Apple & Almond Butter','Trail Mix','Greek Yogurt','Hummus & Veggies','Cottage Cheese','Dark Chocolate & Nuts'][i],
          description: 'Healthy snack option', calories: 200 + i * 5, protein: 12 + i, carbs: 20 + i, fat: 8, fiber: 3,
          ingredients: ['Healthy snack items'], recipe: 'Ready to eat', prepTime: 5, cookTime: 0 },
      ],
    };
  }),
};

export const DEMO_FITNESS_DATA: FitnessData[] = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return {
    date: d.toISOString().split('T')[0],
    steps: 6000 + Math.floor(Math.random() * 6000),
    caloriesBurned: 1800 + Math.floor(Math.random() * 600),
    activeMinutes: 30 + Math.floor(Math.random() * 60),
    workouts: i % 2 === 0 ? [{ type: ['Running', 'Cycling', 'Swimming', 'Weights'][i % 4], duration: 30 + Math.floor(Math.random() * 30), caloriesBurned: 200 + Math.floor(Math.random() * 200), intensity: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)] }] : [],
    restingHeartRate: 62 + Math.floor(Math.random() * 10),
    sleepHours: 6 + Math.random() * 2,
  };
});

export const DEMO_RESTAURANTS: NearbyRestaurant[] = [
  { placeId: 'r1', name: 'Green Leaf Kitchen', address: '123 Health St', rating: 4.6, priceLevel: 2, cuisineType: 'Healthy', dietaryOptions: ['vegan','gluten_free'], healthScore: 92, distance: 0.3, lat: 12.9716, lng: 77.5946, photoUrl: null, isOpen: true },
  { placeId: 'r2', name: 'Protein Paradise', address: '456 Fitness Ave', rating: 4.4, priceLevel: 2, cuisineType: 'Mediterranean', dietaryOptions: ['keto','halal'], healthScore: 88, distance: 0.5, lat: 12.9726, lng: 77.5956, photoUrl: null, isOpen: true },
  { placeId: 'r3', name: 'Bowl & Soul', address: '789 Organic Rd', rating: 4.8, priceLevel: 3, cuisineType: 'Asian Fusion', dietaryOptions: ['vegetarian','dairy_free'], healthScore: 95, distance: 0.8, lat: 12.9736, lng: 77.5966, photoUrl: null, isOpen: true },
  { placeId: 'r4', name: 'Fresh Harvest Cafe', address: '321 Garden Ln', rating: 4.3, priceLevel: 1, cuisineType: 'Salads', dietaryOptions: ['vegan','low_sodium'], healthScore: 90, distance: 1.2, lat: 12.9746, lng: 77.5976, photoUrl: null, isOpen: false },
  { placeId: 'r5', name: 'The Smoothie Spot', address: '654 Juice Way', rating: 4.5, priceLevel: 1, cuisineType: 'Beverages', dietaryOptions: ['vegan','gluten_free'], healthScore: 85, distance: 0.4, lat: 12.9706, lng: 77.5936, photoUrl: null, isOpen: true },
];

export const DEMO_WEEKLY_REPORT: WeeklyReport = {
  weekStart: weekStart.toISOString().split('T')[0],
  weekEnd: new Date(weekStart.getTime() + 6 * 86400000).toISOString().split('T')[0],
  avgCaloriesConsumed: 1920, avgCaloriesBurned: 2150,
  avgProtein: 142, avgCarbs: 195, avgFat: 64,
  totalMealsLogged: 18, avgHealthScore: 84,
  topFoods: ['Grilled Chicken', 'Salmon', 'Greek Yogurt', 'Quinoa', 'Sweet Potato'],
  recommendations: ['Increase fiber intake by adding more vegetables', 'Great protein consistency this week!', 'Consider adding more omega-3 rich foods'],
};

export const DEMO_CHAT_MESSAGES: ChatMessage[] = [
  { id: '1', role: 'assistant', content: "Hi! I'm your NutriSense AI health coach 🌿 I can help you with meal planning, nutritional advice, and achieving your health goals. What would you like to know?", timestamp: new Date().toISOString() },
];

export const DEMO_ANALYSIS_RESULT = {
  foodItems: [
    { name: 'Grilled Chicken Breast', quantity: '~200g', calories: 330, protein: 62, carbs: 0, fat: 7, fiber: 0, confidence: 0.96 },
    { name: 'Brown Rice', quantity: '~150g', calories: 170, protein: 4, carbs: 36, fat: 2, fiber: 2, confidence: 0.91 },
    { name: 'Steamed Vegetables', quantity: '~100g', calories: 45, protein: 3, carbs: 8, fat: 1, fiber: 4, confidence: 0.89 },
  ],
  totalCalories: 545, totalProtein: 69, totalCarbs: 44, totalFat: 10, totalFiber: 6,
  healthScore: 88,
  aiSuggestions: [
    'Excellent lean protein source with grilled chicken!',
    'Brown rice provides sustained energy with complex carbs.',
    'Consider adding a healthy fat source like avocado or olive oil.',
    'Great fiber from the steamed vegetables — aim for 25-30g daily.',
  ],
  visionLabels: ['chicken', 'rice', 'vegetables', 'plate', 'food', 'meal', 'healthy'],
};

export function generateDemoCalorieHistory(days: number = 30): { date: string; consumed: number; burned: number }[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      date: d.toISOString().split('T')[0],
      consumed: 1700 + Math.floor(Math.random() * 600),
      burned: 1900 + Math.floor(Math.random() * 500),
    };
  });
}

export interface GroceryItem {
  name: string;
  quantity: string;
  expiry_date: string;
  image_url?: string;
}

export interface Nutrition {
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Ingredient extends GroceryItem {
  nutrition: Nutrition;
}

export interface EstimatedSustainabilityIndex {
  score: number;
  method: string;
}

export interface Meal {
  recipe_name: string;
  meal_image_url?: string; // Optional URL for the meal image
  ingredients: Ingredient[];
  instructions: string;
  estimated_sustainability_index: EstimatedSustainabilityIndex;
}

export interface MealPlan {
  plan_name: string;
  meals: Meal[];
  overall_sustainability_score: number;
}

export interface AppError {
  item: string;
  issue: string;
}

export interface SmartShelfOutput {
  meal_plans: MealPlan[];
  errors: AppError[];
}

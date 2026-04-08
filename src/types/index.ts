export type Unit =
  | "g"
  | "kg"
  | "ml"
  | "l"
  | "tsp"
  | "tbsp"
  | "cup"
  | "oz"
  | "lb"
  | "piece"
  | "clove"
  | "can"
  | "bunch"
  | "slice"
  | "";

export type GroceryCategory =
  | "produce"
  | "meat"
  | "seafood"
  | "dairy"
  | "bakery"
  | "frozen"
  | "pantry"
  | "spices"
  | "beverages"
  | "other";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type SourceType = "manual" | "url" | "ai";

export interface IngredientInput {
  name: string;
  quantity: number;
  unit: Unit;
  category: GroceryCategory;
  notes?: string;
}

export interface RecipeInput {
  name: string;
  description?: string;
  servings: number;
  prepMins?: number;
  cookMins?: number;
  imageUrl?: string;
  sourceUrl?: string;
  sourceType?: SourceType;
  instructions: string[];
  tags: string[];
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  ingredients: IngredientInput[];
}

// The shape returned by Prisma (with parsed JSON fields)
export interface RecipeWithIngredients {
  id: string;
  name: string;
  description: string | null;
  servings: number;
  prepMins: number | null;
  cookMins: number | null;
  imageUrl: string | null;
  sourceUrl: string | null;
  sourceType: string;
  instructions: string[];
  tags: string[];
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  ingredients: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
    notes: string | null;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ShoppingItem {
  name: string;
  quantity: number;
  unit: Unit;
  category: GroceryCategory;
  notes?: string;
}

export type ShoppingList = Record<GroceryCategory, ShoppingItem[]>;

export const DAYS: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const MEAL_TYPES: MealType[] = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
];

export const GROCERY_CATEGORIES: GroceryCategory[] = [
  "produce",
  "meat",
  "seafood",
  "dairy",
  "bakery",
  "frozen",
  "pantry",
  "spices",
  "beverages",
  "other",
];

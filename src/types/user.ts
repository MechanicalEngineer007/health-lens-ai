import { AnalysisReport } from './report.ts';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'gu' | 'es';

export interface UserProfile {
  id: string;
  name: string;
  age: number | string;
  gender: 'Female' | 'Male' | 'Other';
  bloodGroup?: string;
  relationship?: 'Self' | 'Spouse' | 'Parent' | 'Child' | 'Sibling' | 'Patient' | 'Other';
  avatarColor: string;
  activeMedications?: string[];
  createdAt: string;
}

export interface UserStoreData {
  users: UserProfile[];
  activeUserId: string;
  userReports: Record<string, AnalysisReport[]>;
  appLanguage: LanguageCode;
}

export interface MealItem {
  meal: string; // Breakfast, Lunch, Snack, Dinner
  title: string;
  description: string;
  keyNutrients: string[];
}

export interface DayMealPlan {
  dayNumber: number;
  dayName: string;
  meals: MealItem[];
  dailyHealthTip: string;
}

export interface GroceryItem {
  id: string;
  category: string;
  name: string;
  quantity?: string;
  purpose: string;
  checked: boolean;
}

export interface MedicationDefinition {
  id: string;
  name: string;
  category: string;
  commonUses: string;
  supplementInteractions: {
    supplementName: string;
    severity: 'High Caution' | 'Moderate Precaution' | 'Timing Separation Required';
    interactionDetails: string;
    actionableAdvice: string;
  }[];
}

export interface CardioMetabolicMetrics {
  atherogenicIndex: number; // AIP = log10(TG / HDL)
  aipCategory: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  cholesterolHdlRatio: number;
  ratioCategory: 'Optimal' | 'Borderline' | 'Elevated';
  chronologicalAge: number;
  estimatedMetabolicAge: number;
  metabolicDifference: number; // +3 or -4 years
  summary: string;
}
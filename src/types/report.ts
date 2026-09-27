export type MarkerStatus = 'optimal' | 'normal' | 'borderline_low' | 'borderline_high' | 'low' | 'high' | 'critical';

export type MarkerCategory = 
  | 'Hematology & CBC' 
  | 'Lipid Profile' 
  | 'Liver Function (LFT)' 
  | 'Kidney Function (KFT)' 
  | 'Vitamins & Minerals' 
  | 'Diabetes & Glycemic' 
  | 'Thyroid & Endocrine' 
  | 'Inflammation & Markers'
  | 'Urine & Renal'
  | 'General';

export interface Biomarker {
  id: string;
  name: string;
  category: MarkerCategory;
  value: number | string;
  numericValue?: number;
  unit: string;
  refMin?: number;
  refMax?: number;
  refRangeString: string;
  status: MarkerStatus;
  interpretation?: string;
  clinicalSignificance?: string;
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface ConditionRisk {
  id: string;
  name: string;
  category: string;
  riskLevel: RiskLevel;
  confidence: number; // 0 - 100
  summary: string;
  detailedExplanation: string;
  associatedMarkers: string[];
  keyRiskFactors?: string[];
  potentialComplications?: string[];
}

export interface DietaryPlan {
  beneficialFoods: {
    category: string;
    items: string[];
    reason: string;
  }[];
  foodsToLimit: {
    category: string;
    items: string[];
    reason: string;
  }[];
  mealIdeas: {
    meal: string;
    suggestion: string;
  }[];
  hydrationTip: string;
}

export interface LifestylePlan {
  sunlightAndCircadian?: {
    recommendation: string;
    targetDuration: string;
  };
  exerciseGuidance: {
    type: string;
    frequency: string;
    intensity: string;
    notes: string;
  }[];
  sleepAndStress: {
    habit: string;
    benefit: string;
  }[];
  habitsToAvoid: string[];
}

export interface SupplementGuidance {
  name: string;
  standardDosageRange?: string;
  purpose: string;
  targetMarker: string;
  evidenceLevel: 'High' | 'Moderate' | 'Supportive';
  cautionNote: string;
}

export interface DoctorDiscussionPlan {
  urgency: 'Routine' | 'Within 1-2 Weeks' | 'Prompt (1-3 Days)' | 'Immediate';
  recommendedSpecialist: string;
  questionsToAsk: string[];
  suggestedFollowUpTests: string[];
  recommendedRetestInterval: string;
  redFlags: string[];
}

export interface AnalysisReport {
  id: string;
  patientInfo?: {
    name?: string;
    age?: string;
    gender?: string;
    collectionDate?: string;
    labName?: string;
  };
  overallHealthScore: number; // 0 to 100
  executiveSummary: string;
  criticalFindings: string[];
  biomarkers: Biomarker[];
  conditions: ConditionRisk[];
  remedies: {
    diet: DietaryPlan;
    lifestyle: LifestylePlan;
    supplements: SupplementGuidance[];
    doctorPlan: DoctorDiscussionPlan;
  };
  analyzedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedQuestions?: string[];
}

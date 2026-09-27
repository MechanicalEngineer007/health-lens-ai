export type SymptomCategory = 
  | 'Energy & General' 
  | 'Head, Eyes & Neuro' 
  | 'Joints & Muscles' 
  | 'Digestive & Abdominal' 
  | 'Skin, Mucosa & Capillaries' 
  | 'Cardio & Respiratory';

export type SymptomProbability = 'High Likelihood' | 'Moderate' | 'Possible';

export interface PredictedSymptom {
  id: string;
  name: string;
  category: SymptomCategory;
  probability: SymptomProbability;
  iconName: string;
  underlyingBiomarkerTrigger: string;
  physiologicMechanism: string;
  isRedFlag: boolean;
  commonReliefAdvice: string;
}

export interface SymptomCorrelationState {
  confirmedSymptomIds: string[];
  alignmentScore: number; // 0 - 100%
  matchingRedFlags: string[];
}

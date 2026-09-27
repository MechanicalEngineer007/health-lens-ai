import { Biomarker } from './report.ts';

export type InfectiousDiseaseType = 
  | 'dengue' 
  | 'malaria' 
  | 'typhoid' 
  | 'viral_fever' 
  | 'bacterial_sepsis' 
  | 'uti' 
  | 'infectious_hepatitis';

export type InfectionRiskLevel = 'Low / Unlikely' | 'Possible / Borderline' | 'Moderate Concern' | 'High Likelihood' | 'Critical Emergency';

export interface InfectiousRiskAssessment {
  id: InfectiousDiseaseType;
  name: string;
  pathogenType: string; // e.g. 'Viral (Flavivirus / DENV-1 to 4)', 'Protozoan Parasite (Plasmodium)', etc.
  transmissionMode: string;
  riskLevel: InfectionRiskLevel;
  matchScore: number; // 0 - 100%
  summary: string;
  clinicalRationale: string[];
  keyLabFindings: {
    markerName: string;
    observedValue: string | number;
    unit: string;
    diagnosticSignificance: string;
    isAlarming: boolean;
  }[];
  criticalWarnings: string[];
  contraindications: string[]; // e.g. 'Do NOT take Aspirin or Ibuprofen (increases hemorrhagic risk)'
  confirmatoryTests: {
    testName: string;
    turnaroundTime: string;
    purpose: string;
    idealTiming: string;
  }[];
  recommendedSpecialist: string;
  immediateActionProtocol: string[];
}

export interface PlateletMonitoringStatus {
  currentCount: number;
  unit: string;
  isThrombocytopenia: boolean;
  severity: 'Normal (>150,000)' | 'Mild (100,000 - 150,000)' | 'Moderate (50,000 - 100,000)' | 'Severe / Critical (<50,000)';
  hematocritObserved?: number;
  hemoconcentrationRisk: boolean;
  transfusionTriggerWarning: boolean;
}

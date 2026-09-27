import { MarkerStatus, Biomarker, ConditionRisk, DietaryPlan, LifestylePlan, SupplementGuidance, DoctorDiscussionPlan, AnalysisReport } from '../types/report.ts';

export interface MarkerStandard {
  canonicalName: string;
  category: Biomarker['category'];
  defaultUnit: string;
  refMin: number;
  refMax: number;
  criticalLow?: number;
  criticalHigh?: number;
  description: string;
}

export const BIOMARKER_STANDARDS: Record<string, MarkerStandard> = {
  // Vitamins
  'vit_d': {
    canonicalName: '25-Hydroxy Vitamin D (Vit D3)',
    category: 'Vitamins & Minerals',
    defaultUnit: 'ng/mL',
    refMin: 30,
    refMax: 100,
    criticalLow: 12,
    description: 'Vital fat-soluble secosteroid hormone required for bone mineralization, innate immunity, and muscle function.'
  },
  'vit_b12': {
    canonicalName: 'Vitamin B12 (Cyanocobalamin)',
    category: 'Vitamins & Minerals',
    defaultUnit: 'pg/mL',
    refMin: 200,
    refMax: 900,
    criticalLow: 150,
    description: 'Essential for DNA synthesis, neurological myelin preservation, and erythropoiesis.'
  },
  'serum_iron': {
    canonicalName: 'Serum Iron',
    category: 'Vitamins & Minerals',
    defaultUnit: 'mcg/dL',
    refMin: 35,
    refMax: 175,
    criticalLow: 25,
    description: 'Circulating non-heme and heme iron available to erythroid precursors.'
  },
  'ferritin': {
    canonicalName: 'Serum Ferritin',
    category: 'Vitamins & Minerals',
    defaultUnit: 'ng/mL',
    refMin: 20,
    refMax: 250,
    criticalLow: 15,
    description: 'Primary intracellular iron storage protein; most sensitive marker for iron depletion.'
  },

  // Lipids
  'total_cholesterol': {
    canonicalName: 'Total Cholesterol',
    category: 'Lipid Profile',
    defaultUnit: 'mg/dL',
    refMin: 120,
    refMax: 200,
    criticalHigh: 280,
    description: 'Aggregate measure of all circulating cholesterol fractions.'
  },
  'ldl_cholesterol': {
    canonicalName: 'LDL Cholesterol ("Bad" Cholesterol)',
    category: 'Lipid Profile',
    defaultUnit: 'mg/dL',
    refMin: 0,
    refMax: 100,
    criticalHigh: 190,
    description: 'Primary pro-atherogenic lipoprotein responsible for arterial plaque deposition.'
  },
  'hdl_cholesterol': {
    canonicalName: 'HDL Cholesterol ("Good" Cholesterol)',
    category: 'Lipid Profile',
    defaultUnit: 'mg/dL',
    refMin: 40,
    refMax: 80,
    criticalLow: 30,
    description: 'Anti-atherogenic lipoprotein promoting reverse cholesterol transport.'
  },
  'triglycerides': {
    canonicalName: 'Triglycerides',
    category: 'Lipid Profile',
    defaultUnit: 'mg/dL',
    refMin: 0,
    refMax: 150,
    criticalHigh: 400,
    description: 'Circulating fatty energy substrates; elevated in insulin resistance and metabolic dysfunction.'
  },
  'non_hdl_cholesterol': {
    canonicalName: 'Non-HDL Cholesterol',
    category: 'Lipid Profile',
    defaultUnit: 'mg/dL',
    refMin: 0,
    refMax: 130,
    description: 'Total cholesterol minus HDL; represents sum of all atherogenic particles.'
  },

  // Diabetes & Glycemic
  'fasting_blood_sugar': {
    canonicalName: 'Fasting Blood Glucose',
    category: 'Diabetes & Glycemic',
    defaultUnit: 'mg/dL',
    refMin: 70,
    refMax: 99,
    criticalLow: 54,
    criticalHigh: 180,
    description: 'Basal plasma glucose after an 8-12 hour overnight fast.'
  },
  'hba1c': {
    canonicalName: 'HbA1c (Glycated Hemoglobin)',
    category: 'Diabetes & Glycemic',
    defaultUnit: '%',
    refMin: 4.0,
    refMax: 5.6,
    criticalHigh: 9.0,
    description: 'Gold-standard marker of average blood glucose exposure over the preceding 90-120 days.'
  },

  // Hematology
  'hemoglobin': {
    canonicalName: 'Hemoglobin (Hb)',
    category: 'Hematology & CBC',
    defaultUnit: 'g/dL',
    refMin: 12.0,
    refMax: 16.5,
    criticalLow: 8.0,
    criticalHigh: 18.5,
    description: 'Oxygen-binding metalloprotein within erythrocytes.'
  },
  'platelets': {
    canonicalName: 'Platelet Count',
    category: 'Hematology & CBC',
    defaultUnit: 'x1000/µL',
    refMin: 150,
    refMax: 450,
    criticalLow: 50,
    criticalHigh: 600,
    description: 'Cellular fragments critical for primary hemostasis and clot formation.'
  },
  'wbc_count': {
    canonicalName: 'Total Leucocyte Count (WBC)',
    category: 'Hematology & CBC',
    defaultUnit: '/µL',
    refMin: 4000,
    refMax: 11000,
    criticalLow: 2500,
    criticalHigh: 20000,
    description: 'Total circulating immune defense cells.'
  },

  // Liver
  'sgot_ast': {
    canonicalName: 'SGOT / AST (Aspartate Aminotransferase)',
    category: 'Liver Function (LFT)',
    defaultUnit: 'U/L',
    refMin: 5,
    refMax: 40,
    criticalHigh: 150,
    description: 'Intracellular enzyme found in hepatocytes, cardiac cells, and skeletal muscle.'
  },
  'sgpt_alt': {
    canonicalName: 'SGPT / ALT (Alanine Aminotransferase)',
    category: 'Liver Function (LFT)',
    defaultUnit: 'U/L',
    refMin: 5,
    refMax: 40,
    criticalHigh: 150,
    description: 'Primary hepatocyte enzyme; sensitive indicator of acute or chronic liver parenchymal strain.'
  },
  'serum_bilirubin': {
    canonicalName: 'Total Bilirubin',
    category: 'Liver Function (LFT)',
    defaultUnit: 'mg/dL',
    refMin: 0.2,
    refMax: 1.2,
    criticalHigh: 3.0,
    description: 'Catabolic breakdown product of heme pigment metabolized by hepatic glucuronidation.'
  },

  // Kidney
  'serum_creatinine': {
    canonicalName: 'Serum Creatinine',
    category: 'Kidney Function (KFT)',
    defaultUnit: 'mg/dL',
    refMin: 0.6,
    refMax: 1.2,
    criticalHigh: 2.5,
    description: 'Constant muscle breakdown byproduct excreted via glomerular filtration.'
  },
  'serum_urea': {
    canonicalName: 'Serum Urea / BUN',
    category: 'Kidney Function (KFT)',
    defaultUnit: 'mg/dL',
    refMin: 15,
    refMax: 45,
    criticalHigh: 80,
    description: 'Nitrogenous end-product of dietary and endogenous protein catabolism.'
  },
  'serum_uric_acid': {
    canonicalName: 'Uric Acid',
    category: 'Kidney Function (KFT)',
    defaultUnit: 'mg/dL',
    refMin: 3.5,
    refMax: 7.2,
    criticalHigh: 9.0,
    description: 'Final oxidation byproduct of purine metabolism; elevated in gout and metabolic syndrome.'
  },

  // Thyroid
  'tsh': {
    canonicalName: 'Thyroid Stimulating Hormone (TSH)',
    category: 'Thyroid & Endocrine',
    defaultUnit: 'mIU/L',
    refMin: 0.4,
    refMax: 4.5,
    criticalLow: 0.05,
    criticalHigh: 12.0,
    description: 'Pituitary hormone driving thyroid follicular gland production of thyroxine (T4) and triiodothyronine (T3).'
  }
};

export function evaluateMarkerStatus(val: number, min?: number, max?: number, critLow?: number, critHigh?: number): MarkerStatus {
  if (min === undefined && max === undefined) return 'normal';
  
  if (critLow !== undefined && val <= critLow) return 'critical';
  if (critHigh !== undefined && val >= critHigh) return 'critical';
  
  if (min !== undefined && val < min) {
    if (val < min * 0.75) return 'low';
    return 'borderline_low';
  }
  
  if (max !== undefined && val > max) {
    if (val > max * 1.25) return 'high';
    return 'borderline_high';
  }
  
  return 'optimal';
}

export function generateHealthScore(markers: Biomarker[]): number {
  if (!markers.length) return 85;
  let score = 100;
  
  for (const m of markers) {
    if (m.status === 'critical') score -= 18;
    else if (m.status === 'high' || m.status === 'low') score -= 8;
    else if (m.status === 'borderline_high' || m.status === 'borderline_low') score -= 4;
  }
  
  return Math.max(35, Math.min(100, Math.round(score)));
}

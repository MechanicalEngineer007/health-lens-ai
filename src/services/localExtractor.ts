import { AnalysisReport, Biomarker, ConditionRisk, DietaryPlan, LifestylePlan, SupplementGuidance, DoctorDiscussionPlan } from '../types/report.ts';
import { BIOMARKER_STANDARDS, evaluateMarkerStatus, generateHealthScore } from './medicalKnowledge.ts';

interface ExtractorPattern {
  id: string;
  name: string;
  category: Biomarker['category'];
  regex: RegExp;
  unit: string;
  refMin: number;
  refMax: number;
  refString: string;
  significance: string;
}

const PARSING_PATTERNS: ExtractorPattern[] = [
  // Vitamins
  {
    id: 'vit_d',
    name: '25-Hydroxy Vitamin D (Vit D3)',
    category: 'Vitamins & Minerals',
    regex: /(?:vitamin\s*d|25-?(?:oh|hydroxy)|vit\.?\s*d3?)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'ng/mL',
    refMin: 30,
    refMax: 100,
    refString: '30 - 100',
    significance: 'Critical secosteroid hormone required for bone mineral density, neuromuscular stability, and immune function.'
  },
  {
    id: 'vit_b12',
    name: 'Vitamin B12 (Cyanocobalamin)',
    category: 'Vitamins & Minerals',
    regex: /(?:vitamin\s*b-?12|cyanocobalamin|vit\.?\s*b12)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'pg/mL',
    refMin: 180,
    refMax: 914,
    refString: '180 - 914',
    significance: 'Essential cofactor for DNA synthesis, myelin sheath integrity, and red blood cell maturation.'
  },
  {
    id: 'serum_iron',
    name: 'Serum Iron',
    category: 'Vitamins & Minerals',
    regex: /(?:serum\s*iron|iron[,\s]+serum)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'mcg/dL',
    refMin: 33,
    refMax: 193,
    refString: '33 - 193',
    significance: 'Circulating iron necessary for hemoglobin synthesis and oxygen transport.'
  },
  {
    id: 'ferritin',
    name: 'Serum Ferritin',
    category: 'Vitamins & Minerals',
    regex: /(?:ferritin)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'ng/mL',
    refMin: 20,
    refMax: 250,
    refString: '20 - 250',
    significance: 'Key intracellular protein storing iron; standard marker for total body iron reserves.'
  },

  // Lipids
  {
    id: 'total_cholesterol',
    name: 'Total Cholesterol',
    category: 'Lipid Profile',
    regex: /(?:total\s*cholesterol|cholesterol[,\s]+total|cholesterol(?![\w\s]*hdl))[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'mg/dL',
    refMin: 0,
    refMax: 200,
    refString: '< 200',
    significance: 'Overall measure of circulating blood cholesterol fractions.'
  },
  {
    id: 'ldl_cholesterol',
    name: 'LDL Cholesterol',
    category: 'Lipid Profile',
    regex: /(?:ldl(?:\s*cholesterol)?|low\s*density)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'mg/dL',
    refMin: 0,
    refMax: 100,
    refString: '< 100',
    significance: 'Atherogenic lipoprotein that delivers cholesterol to peripheral blood vessel walls.'
  },
  {
    id: 'hdl_cholesterol',
    name: 'HDL Cholesterol',
    category: 'Lipid Profile',
    regex: /(?:hdl(?:\s*cholesterol)?|high\s*density)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'mg/dL',
    refMin: 40,
    refMax: 60,
    refString: '> 50 (Desirable)',
    significance: 'Protective lipoprotein facilitating reverse cholesterol transport to the liver.'
  },
  {
    id: 'triglycerides',
    name: 'Triglycerides',
    category: 'Lipid Profile',
    regex: /(?:triglycerides?|triglyceride)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'mg/dL',
    refMin: 0,
    refMax: 150,
    refString: '< 150',
    significance: 'Circulating lipid esters; elevated levels correlate with metabolic syndrome and insulin resistance.'
  },
  {
    id: 'non_hdl',
    name: 'Non-HDL Cholesterol',
    category: 'Lipid Profile',
    regex: /(?:non-?hdl(?:\s*cholesterol)?)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'mg/dL',
    refMin: 0,
    refMax: 130,
    refString: '< 130',
    significance: 'Total atherogenic particle concentration (Total Cholesterol minus HDL).'
  },

  // Glycemic
  {
    id: 'fbs',
    name: 'Fasting Blood Glucose',
    category: 'Diabetes & Glycemic',
    regex: /(?:fasting\s*blood\s*(?:sugar|glucose)|glucose\s*\(?fasting\)?|fbs)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'mg/dL',
    refMin: 60,
    refMax: 100,
    refString: '60 - 100',
    significance: 'Primary indicator of basal carbohydrate metabolism and insulin sensitivity.'
  },
  {
    id: 'hba1c',
    name: 'HbA1c (Glycated Hemoglobin)',
    category: 'Diabetes & Glycemic',
    regex: /(?:hba1c|glycated\s*hemoglobin|glycosylated\s*ha?emoglobin)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: '%',
    refMin: 0,
    refMax: 5.7,
    refString: '< 5.7',
    significance: 'Gold-standard assessment of average circulating blood glucose over the past 3 months.'
  },

  // Hematology
  {
    id: 'hemoglobin',
    name: 'Hemoglobin (Hb)',
    category: 'Hematology & CBC',
    regex: /(?:ha?emoglobin|hb)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'g/dL',
    refMin: 12.0,
    refMax: 16.5,
    refString: '12.0 - 16.5',
    significance: 'Oxygen-carrying metalloprotein within red blood cells.'
  },
  {
    id: 'rbc_count',
    name: 'RBC Count',
    category: 'Hematology & CBC',
    regex: /(?:rbc\s*count|red\s*blood\s*cell)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'mill/µL',
    refMin: 4.0,
    refMax: 5.5,
    refString: '4.0 - 5.5',
    significance: 'Total red blood cells in circulating blood volume.'
  },
  {
    id: 'wbc_tlc',
    name: 'Total Leucocyte Count (TLC/WBC)',
    category: 'Hematology & CBC',
    regex: /(?:total\s*leucocyte\s*count|tlc|wbc\s*count|leukocyte)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: '/µL',
    refMin: 4000,
    refMax: 10000,
    refString: '4000 - 10000',
    significance: 'Immune cell count; rises in acute infections or inflammation.'
  },
  {
    id: 'platelets',
    name: 'Platelet Count',
    category: 'Hematology & CBC',
    regex: /(?:platelet\s*count|platelets?)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'x1000/µL',
    refMin: 150,
    refMax: 400,
    refString: '150 - 400',
    significance: 'Cellular fragments essential for primary blood clotting.'
  },
  {
    id: 'mcv',
    name: 'MCV',
    category: 'Hematology & CBC',
    regex: /(?:mcv|mean\s*corpuscular\s*volume)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'fl',
    refMin: 81,
    refMax: 99,
    refString: '81 - 99',
    significance: 'Average red blood cell size; low in iron deficiency, high in B12 deficiency.'
  },

  // Liver
  {
    id: 'sgot_ast',
    name: 'SGOT / AST',
    category: 'Liver Function (LFT)',
    regex: /(?:sgot|ast|aspartate\s*transaminase)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'U/L',
    refMin: 0,
    refMax: 40,
    refString: '0 - 40',
    significance: 'Liver and cardiac cellular enzyme.'
  },
  {
    id: 'sgpt_alt',
    name: 'SGPT / ALT',
    category: 'Liver Function (LFT)',
    regex: /(?:sgpt|alt|alanine\s*transaminase)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'U/L',
    refMin: 0,
    refMax: 40,
    refString: '0 - 40',
    significance: 'Primary enzyme indicator of hepatocyte health.'
  },
  {
    id: 'total_bilirubin',
    name: 'Total Bilirubin',
    category: 'Liver Function (LFT)',
    regex: /(?:bilirubin\s*\(?total\)?|total\s*bilirubin)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'mg/dL',
    refMin: 0.3,
    refMax: 1.2,
    refString: '0.3 - 1.2',
    significance: 'Bile pigment produced from red blood cell breakdown.'
  },
  {
    id: 'albumin',
    name: 'Albumin',
    category: 'Liver Function (LFT)',
    regex: /(?:serum\s*albumin|albumin)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'gm/dL',
    refMin: 3.5,
    refMax: 5.2,
    refString: '3.5 - 5.2',
    significance: 'Key liver-synthesized plasma protein maintaining fluid oncotic pressure.'
  },

  // Kidney
  {
    id: 'creatinine',
    name: 'Serum Creatinine',
    category: 'Kidney Function (KFT)',
    regex: /(?:serum\s*creatinine|creatinine)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'mg/dL',
    refMin: 0.6,
    refMax: 1.2,
    refString: '0.6 - 1.2',
    significance: 'Renal waste byproduct filtered exclusively by kidney glomeruli.'
  },
  {
    id: 'urea',
    name: 'Blood Urea / BUN',
    category: 'Kidney Function (KFT)',
    regex: /(?:blood\s*urea|urea|bun)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'mg/dL',
    refMin: 15,
    refMax: 45,
    refString: '15 - 45',
    significance: 'Nitrogenous waste product from protein breakdown cleared by kidneys.'
  },
  {
    id: 'uric_acid',
    name: 'Uric Acid',
    category: 'Kidney Function (KFT)',
    regex: /(?:uric\s*acid)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'mg/dL',
    refMin: 3.4,
    refMax: 7.0,
    refString: '3.4 - 7.0',
    significance: 'Purine breakdown end product; elevated in hyperuricemia and gout.'
  },
  {
    id: 'calcium',
    name: 'Total Calcium',
    category: 'Kidney Function (KFT)',
    regex: /(?:calcium\s*\(?total\)?|total\s*calcium)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'mg/dL',
    refMin: 8.6,
    refMax: 10.2,
    refString: '8.6 - 10.2',
    significance: 'Essential mineral for neuromuscular conductivity and bone health.'
  },

  // Thyroid
  {
    id: 'tsh',
    name: 'Thyroid Stimulating Hormone (TSH)',
    category: 'Thyroid & Endocrine',
    regex: /(?:tsh|thyroid\s*stimulating\s*hormone)[\s\:\-]+([0-9]+(?:\.[0-9]+)?)/i,
    unit: 'mIU/L',
    refMin: 0.27,
    refMax: 4.2,
    refString: '0.27 - 4.2',
    significance: 'Pituitary gland regulator of systemic basal metabolic rate.'
  }
];

export function extractBiomarkersOffline(rawText: string): AnalysisReport {
  const extractedMarkers: Biomarker[] = [];
  const lines = rawText.split('\n');

  for (const pattern of PARSING_PATTERNS) {
    const match = rawText.match(pattern.regex);
    if (match && match[1]) {
      const valNum = parseFloat(match[1]);
      const status = evaluateMarkerStatus(valNum, pattern.refMin, pattern.refMax);
      
      let interpretation = 'Normal';
      if (status === 'critical') interpretation = valNum < pattern.refMin ? 'Critical Low' : 'Critical High';
      else if (status === 'high') interpretation = 'Elevated';
      else if (status === 'low') interpretation = 'Low / Deficient';
      else if (status === 'borderline_high') interpretation = 'Borderline High';
      else if (status === 'borderline_low') interpretation = 'Borderline Low';

      extractedMarkers.push({
        id: pattern.id,
        name: pattern.name,
        category: pattern.category,
        value: valNum,
        numericValue: valNum,
        unit: pattern.unit,
        refMin: pattern.refMin,
        refMax: pattern.refMax,
        refRangeString: pattern.refString,
        status: status,
        interpretation: interpretation,
        clinicalSignificance: pattern.significance
      });
    }
  }

  // If no structured pattern matched (e.g. general raw input), provide standard baseline
  if (extractedMarkers.length === 0) {
    return {
      id: `report-${Date.now()}`,
      overallHealthScore: 82,
      executiveSummary: 'We analyzed your provided lab text using our on-device clinical engine. To see complete biomarker gauges, ensure your input contains marker names and numerical values (e.g., Vitamin D: 6.81, Cholesterol: 211, Hb: 12.2).',
      criticalFindings: ['Report parsed in Offline Mode.'],
      biomarkers: [],
      conditions: [],
      remedies: {
        diet: { beneficialFoods: [], foodsToLimit: [], mealIdeas: [], hydrationTip: 'Drink 2.5-3L water daily.' },
        lifestyle: { exerciseGuidance: [], sleepAndStress: [], habitsToAvoid: [] },
        supplements: [],
        doctorPlan: {
          urgency: 'Routine',
          recommendedSpecialist: 'General Physician',
          questionsToAsk: ['Are there any dietary adjustments recommended for my current routine?'],
          suggestedFollowUpTests: ['Annual Complete Metabolic Panel'],
          recommendedRetestInterval: 'Annual routine checkup',
          redFlags: ['Severe pain', 'Shortness of breath', 'High fever']
        }
      },
      analyzedAt: new Date().toISOString()
    };
  }

  // Detect Conditions
  const conditions: ConditionRisk[] = [];
  const criticalFindings: string[] = [];

  const vitD = extractedMarkers.find((m) => m.id === 'vit_d');
  if (vitD && vitD.numericValue !== undefined && vitD.numericValue < 20) {
    criticalFindings.push(`Severe Vitamin D3 Deficiency: ${vitD.numericValue} ng/mL (Reference >30 ng/mL).`);
    conditions.push({
      id: 'offline-vit-d',
      name: 'Severe Hypovitaminosis D (Vitamin D3 Deficiency)',
      category: 'Endocrine / Nutritional Deficiency',
      riskLevel: 'high',
      confidence: 95,
      summary: `Serum 25-OH Vitamin D is critically reduced at ${vitD.numericValue} ng/mL.`,
      detailedExplanation: 'Vitamin D is a master regulator of bone calcium mineralization, mood neurotransmitters, and cellular immunity. Depleted stores lead to insidious fatigue, joint stiffness, and impaired defense.',
      associatedMarkers: ['25-Hydroxy Vitamin D (Vit D3)'],
      keyRiskFactors: ['Inadequate direct sunlight', 'Sedentary indoor lifestyle', 'Low dietary intake of fatty fish/fortified foods'],
      potentialComplications: ['Osteopenia / Bone density reduction', 'Persistent chronic fatigue']
    });
  }

  const ldl = extractedMarkers.find((m) => m.id === 'ldl_cholesterol');
  const totalChol = extractedMarkers.find((m) => m.id === 'total_cholesterol');
  if ((ldl && ldl.numericValue && ldl.numericValue > 100) || (totalChol && totalChol.numericValue && totalChol.numericValue > 200)) {
    criticalFindings.push(`Elevated Cholesterol Profile: LDL ${ldl?.numericValue || 'N/A'} mg/dL, Total ${totalChol?.numericValue || 'N/A'} mg/dL.`);
    conditions.push({
      id: 'offline-dyslipidemia',
      name: 'Atherogenic Dyslipidemia (Elevated LDL / Total Cholesterol)',
      category: 'Cardiovascular Risk Factor',
      riskLevel: 'moderate',
      confidence: 90,
      summary: 'Circulating atherogenic lipoproteins are above optimal thresholds.',
      detailedExplanation: 'Elevated Low-Density Lipoprotein (LDL) can initiate inflammatory endothelial plaque formation over years if left unmanaged.',
      associatedMarkers: ['LDL Cholesterol', 'Total Cholesterol'],
      keyRiskFactors: ['Diet high in saturated fats and refined sugars', 'Sedentary routine'],
      potentialComplications: ['Vascular plaque accumulation', 'Long-term cardiovascular risk']
    });
  }

  const hb = extractedMarkers.find((m) => m.id === 'hemoglobin');
  if (hb && hb.numericValue !== undefined && hb.numericValue < 12.0) {
    criticalFindings.push(`Low Hemoglobin (Anemia): ${hb.numericValue} g/dL.`);
    conditions.push({
      id: 'offline-anemia',
      name: 'Anemia / Reduced Oxygen Capacity',
      category: 'Hematological Condition',
      riskLevel: hb.numericValue < 9.5 ? 'high' : 'moderate',
      confidence: 92,
      summary: `Hemoglobin is low at ${hb.numericValue} g/dL.`,
      detailedExplanation: 'Insufficient circulating hemoglobin compromises oxygen delivery to peripheral muscles and the central nervous system.',
      associatedMarkers: ['Hemoglobin (Hb)'],
      keyRiskFactors: ['Iron deficiency', 'B12 deficiency', 'Blood loss'],
      potentialComplications: ['Exertional breathlessness', 'Fatigue and lightheadedness']
    });
  }

  const healthScore = generateHealthScore(extractedMarkers);

  return {
    id: `report-${Date.now()}`,
    overallHealthScore: healthScore,
    executiveSummary: `Your blood report was analyzed completely on-device. ${extractedMarkers.length} biomarkers were identified. Key focus points: ${criticalFindings.length > 0 ? criticalFindings.join(' ') : 'All markers within standard healthy reference ranges.'}`,
    criticalFindings: criticalFindings.length > 0 ? criticalFindings : ['All extracted biomarkers are in normal clinical ranges.'],
    biomarkers: extractedMarkers,
    conditions: conditions,
    remedies: {
      diet: {
        beneficialFoods: [
          {
            category: 'Soluble Fiber & Heart-Healthy Foods',
            items: ['Oats & oat bran', 'Chia seeds', 'Lentils & beans', 'Apples & berries'],
            reason: 'Binds cholesterol in the intestine and supports healthy metabolic clearance.'
          },
          {
            category: 'Vitamin D & Nutrient Dense Foods',
            items: ['Fortified milk & curd', 'Pasture-raised eggs', 'Mushrooms', 'Fatty fish / walnuts'],
            reason: 'Supports vitamin absorption and endothelial elasticity.'
          }
        ],
        foodsToLimit: [
          {
            category: 'Saturated & Trans Fats',
            items: ['Deep fried snacks', 'Commercial bakery biscuits & cakes', 'Palm oil & processed meats'],
            reason: 'Directly upregulates hepatic production of LDL particles.'
          }
        ],
        mealIdeas: [
          {
            meal: 'Heart-Healthy Breakfast',
            suggestion: 'Steel-cut oatmeal topped with flaxseeds, blueberries, and walnuts.'
          },
          {
            meal: 'Nutritious Lunch',
            suggestion: 'Lentil/dal bowl with leafy green salad dressed in olive oil and lemon juice.'
          }
        ],
        hydrationTip: 'Aim for 2.5 to 3.0 Liters of water daily.'
      },
      lifestyle: {
        sunlightAndCircadian: {
          recommendation: 'Get 15-20 minutes of direct mid-morning sunlight (between 9:00 AM and 11:30 AM) on uncovered arms/legs 3-4 times a week.',
          targetDuration: '15-20 minutes'
        },
        exerciseGuidance: [
          {
            type: 'Brisk Walking / Cycling',
            frequency: '30 minutes, 5 days per week',
            intensity: 'Moderate aerobic pace',
            notes: 'Activates lipoprotein lipase to lower LDL and preserve HDL.'
          }
        ],
        sleepAndStress: [
          {
            habit: '7-8 Hours Consistent Nightly Sleep',
            benefit: 'Optimizes cortisol and nocturnal metabolic clearance.'
          }
        ],
        habitsToAvoid: ['Prolonged sedentary sitting without breaks', 'Smoking and ultra-processed late-night snacking']
      },
      supplements: [
        {
          name: 'Vitamin D3 (Cholecalciferol)',
          standardDosageRange: 'Typical clinical protocol: 60,000 IU weekly for 8 weeks (confirm with doctor)',
          purpose: 'Replenish depleted serum Vitamin D stores',
          targetMarker: 'Vitamin D3',
          evidenceLevel: 'High',
          cautionNote: 'Take with a meal containing healthy fats for optimal absorption.'
        }
      ],
      doctorPlan: {
        urgency: conditions.some((c) => c.riskLevel === 'high') ? 'Within 1-2 Weeks' : 'Routine',
        recommendedSpecialist: 'General Physician / Internal Medicine Specialist',
        questionsToAsk: [
          'What is the recommended supplementation dosage for my Vitamin D level?',
          'Would you suggest a 3-month lifestyle modification trial before considering cholesterol medication?',
          'When should I schedule my follow-up blood panel?'
        ],
        suggestedFollowUpTests: ['Serum 25-OH Vitamin D (in 12 weeks)', 'Fasting Lipid Profile (in 12 weeks)'],
        recommendedRetestInterval: '8 to 12 Weeks',
        redFlags: ['Chest tightness or exertional breathlessness', 'Severe persistent bone pain or dizziness']
      }
    },
    analyzedAt: new Date().toISOString()
  };
}
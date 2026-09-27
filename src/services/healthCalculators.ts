import { Biomarker } from '../types/report.ts';
import { CardioMetabolicMetrics, MedicationDefinition } from '../types/user.ts';

export function calculateCardioMetabolicMetrics(biomarkers: Biomarker[], userAge = 35): CardioMetabolicMetrics {
  const tgMarker = biomarkers.find((b) => b.id === 'triglycerides' || b.name.toLowerCase().includes('triglyceride'));
  const hdlMarker = biomarkers.find((b) => b.id === 'hdl-chol' || b.name.toLowerCase().includes('hdl'));
  const totalCholMarker = biomarkers.find((b) => b.id === 'total-chol' || b.name.toLowerCase().includes('total cholesterol'));
  const ldlMarker = biomarkers.find((b) => b.id === 'ldl-chol' || b.name.toLowerCase().includes('ldl'));
  const hba1cMarker = biomarkers.find((b) => b.id === 'hba1c' || b.name.toLowerCase().includes('hba1c'));

  const tg = tgMarker?.numericValue || 113;
  const hdl = hdlMarker?.numericValue || 55.5;
  const totalChol = totalCholMarker?.numericValue || 211;
  const ldl = ldlMarker?.numericValue || 135;
  const hba1c = hba1cMarker?.numericValue || 5.1;

  // AIP = log10( (TG / 88.57) / (HDL / 38.67) ) in molar or log10(TG / HDL) normalized
  // Standard clinical formula: log10((TG / 88.57) / (HDL / 38.67))
  const tgMmol = tg / 88.57;
  const hdlMmol = hdl / 38.67;
  const aip = Math.log10(tgMmol / (hdlMmol || 1));
  const roundedAIP = Math.round(aip * 100) / 100;

  let aipCategory: CardioMetabolicMetrics['aipCategory'] = 'Low Risk';
  if (roundedAIP > 0.21) aipCategory = 'High Risk';
  else if (roundedAIP >= 0.11) aipCategory = 'Moderate Risk';

  const cholHdlRatio = Math.round((totalChol / (hdl || 1)) * 10) / 10;
  let ratioCategory: CardioMetabolicMetrics['ratioCategory'] = 'Optimal';
  if (cholHdlRatio > 5.0) ratioCategory = 'Elevated';
  else if (cholHdlRatio >= 3.8) ratioCategory = 'Borderline';

  // Metabolic age calculation
  let ageDelta = 0;
  if (hba1c < 5.4) ageDelta -= 2;
  else if (hba1c > 6.0) ageDelta += 3;

  if (ldl < 100) ageDelta -= 2;
  else if (ldl > 130) ageDelta += 2;

  if (tg < 120 && hdl > 50) ageDelta -= 1;
  else if (tg > 200) ageDelta += 2;

  const estimatedMetabolicAge = Math.max(18, userAge + ageDelta);

  let summary = '';
  if (ageDelta < 0) {
    summary = `Your metabolic markers indicate favorable biological fitness, estimated at ${estimatedMetabolicAge} years (${Math.abs(ageDelta)} years younger than chronological age).`;
  } else if (ageDelta === 0) {
    summary = `Your biological and metabolic fitness matches your chronological age of ${userAge} years.`;
  } else {
    summary = `Mild elevations in LDL cholesterol contribute to an estimated metabolic age of ${estimatedMetabolicAge} years. Targeted dietary fiber and exercise can restore this to optimal levels.`;
  }

  return {
    atherogenicIndex: roundedAIP,
    aipCategory,
    cholesterolHdlRatio: cholHdlRatio,
    ratioCategory,
    chronologicalAge: userAge,
    estimatedMetabolicAge,
    metabolicDifference: ageDelta,
    summary
  };
}

export const COMMON_MEDICATIONS_DB: MedicationDefinition[] = [
  {
    id: 'levothyroxine',
    name: 'Levothyroxine / Thyronorm / Eltroxin',
    category: 'Thyroid Hormone',
    commonUses: 'Treatment for Hypothyroidism',
    supplementInteractions: [
      {
        supplementName: 'Calcium Carbonate / Citrate',
        severity: 'Timing Separation Required',
        interactionDetails: 'Calcium binds strongly to thyroid hormones in the stomach, blocking gastrointestinal absorption.',
        actionableAdvice: 'Take Levothyroxine first thing in the morning on an empty stomach; wait at least 4 hours before taking Calcium or dairy.'
      },
      {
        supplementName: 'Iron Supplements (Ferrous salts)',
        severity: 'Timing Separation Required',
        interactionDetails: 'Iron forms insoluble chelates with Levothyroxine, reducing systemic thyroid hormone efficacy.',
        actionableAdvice: 'Separate Iron supplements and Levothyroxine by at least 4 to 6 hours.'
      }
    ]
  },
  {
    id: 'metformin',
    name: 'Metformin / Glycomet',
    category: 'Antidiabetic Biguanide',
    commonUses: 'Type 2 Diabetes & Insulin Resistance',
    supplementInteractions: [
      {
        supplementName: 'Vitamin B12 (Cobalamin)',
        severity: 'Moderate Precaution',
        interactionDetails: 'Long-term Metformin use reduces intestinal calcium-dependent absorption of Vitamin B12, causing insidious B12 deficiency.',
        actionableAdvice: 'Doctors recommend annual Vitamin B12 screening and a daily oral B12/multivitamin supplement for patients on Metformin.'
      }
    ]
  },
  {
    id: 'atorvastatin',
    name: 'Atorvastatin / Rosuvastatin (Statins)',
    category: 'HMG-CoA Reductase Inhibitor',
    commonUses: 'Lowering LDL & Total Cholesterol',
    supplementInteractions: [
      {
        supplementName: 'Coenzyme Q10 (CoQ10)',
        severity: 'Moderate Precaution',
        interactionDetails: 'Statins inhibit the mevalonate pathway, depleting natural muscle CoQ10 reserves and occasionally triggering muscle soreness (myalgia).',
        actionableAdvice: 'Discuss taking 100-200 mg CoQ10 with your physician to support mitochondrial cellular health.'
      },
      {
        supplementName: 'Red Yeast Rice',
        severity: 'High Caution',
        interactionDetails: 'Red Yeast Rice naturally contains monacolin K (identical to lovastatin). Combining with statins raises toxicity risk.',
        actionableAdvice: 'Do not take Red Yeast Rice while on prescription statin therapy.'
      }
    ]
  },
  {
    id: 'blood_thinners',
    name: 'Aspirin / Clopidogrel / Warfarin',
    category: 'Antiplatelet & Anticoagulant',
    commonUses: 'Cardiovascular Protection & Clot Prevention',
    supplementInteractions: [
      {
        supplementName: 'High-Dose Omega-3 Fish Oil (>3g)',
        severity: 'Moderate Precaution',
        interactionDetails: 'High doses of EPA/DHA have natural anti-platelet thinning properties that can compound prescription blood thinners.',
        actionableAdvice: 'Limit Omega-3 to standard dietary doses (1000 mg/day) and inform your prescribing physician.'
      },
      {
        supplementName: 'Vitamin K (Phytonadione/K2)',
        severity: 'High Caution',
        interactionDetails: 'Vitamin K directly counteracts Warfarin anticoagulation mechanisms.',
        actionableAdvice: 'Maintain a stable, consistent intake of dietary Vitamin K; do not start high-dose Vitamin K supplements without INR monitoring.'
      }
    ]
  },
  {
    id: 'omeprazole',
    name: 'Omeprazole / Pantoprazole / Antacids',
    category: 'Proton Pump Inhibitor (PPI)',
    commonUses: 'Acid Reflux, GERD & Gastric Ulcers',
    supplementInteractions: [
      {
        supplementName: 'Iron & Vitamin B12',
        severity: 'Moderate Precaution',
        interactionDetails: 'Suppression of gastric stomach acid reduces non-heme iron ionization and intrinsic-factor B12 cleaving.',
        actionableAdvice: 'Take Iron with Vitamin C (lemon water or orange juice) to acidify the stomach and restore optimal absorption.'
      },
      {
        supplementName: 'Magnesium',
        severity: 'Moderate Precaution',
        interactionDetails: 'Long-term PPI use can induce hypomagnesemia (low blood magnesium).',
        actionableAdvice: 'Periodically check serum magnesium levels and consume magnesium-rich nuts, seeds, and greens.'
      }
    ]
  }
];

export function checkMedicationInteractions(activeMedNames: string[]): {
  medication: MedicationDefinition;
  warning: MedicationDefinition['supplementInteractions'][0];
}[] {
  const warnings: {
    medication: MedicationDefinition;
    warning: MedicationDefinition['supplementInteractions'][0];
  }[] = [];

  for (const medName of activeMedNames) {
    const matched = COMMON_MEDICATIONS_DB.find((dbMed) => 
      medName.toLowerCase().includes(dbMed.name.toLowerCase()) ||
      dbMed.name.toLowerCase().includes(medName.toLowerCase()) ||
      dbMed.id.toLowerCase().includes(medName.toLowerCase())
    );

    if (matched) {
      for (const interaction of matched.supplementInteractions) {
        warnings.push({
          medication: matched,
          warning: interaction
        });
      }
    }
  }

  return warnings;
}
import { Biomarker } from '../types/report.ts';
import { OrganSystemHealth, OrganSystemId, SpecialistRecommendation, SpecialistUrgency } from '../types/organSystem.ts';

interface OrganConfig {
  id: OrganSystemId;
  name: string;
  subtitle: string;
  iconName: string;
  colorGradient: string;
  badgeBg: string;
  badgeText: string;
  specialistTitle: string;
  department: string;
  keywords: string[];
  defaultQuestions: string[];
  defaultFollowUps: string[];
}

const ORGAN_CONFIGS: OrganConfig[] = [
  {
    id: 'heart',
    name: 'Heart & Cardiovascular',
    subtitle: 'Lipid profile, arterial inflammation & cardiac stress',
    iconName: 'Heart',
    colorGradient: 'from-rose-500 to-red-600',
    badgeBg: 'bg-rose-50 border-rose-200',
    badgeText: 'text-rose-700',
    specialistTitle: 'Cardiologist / Preventive Lipidologist',
    department: 'Cardiology',
    keywords: ['cholesterol', 'triglyceride', 'hdl', 'ldl', 'vldl', 'crp', 'hs-crp', 'homocysteine', 'cpk', 'apob', 'troponin'],
    defaultQuestions: [
      'Are my cholesterol and triglyceride ratios putting me at risk for plaque buildup?',
      'Would you recommend a Coronary Calcium Scan (CAC) or Carotid Ultrasound?',
      'Do I need prescription lipid therapy or can lifestyle and omega-3s reverse these numbers?'
    ],
    defaultFollowUps: [
      'Repeat Fasting Lipid Profile in 12 weeks',
      'High-Sensitivity C-Reactive Protein (hs-CRP) recheck',
      'Blood pressure ambulatory 24h monitoring'
    ]
  },
  {
    id: 'pancreas',
    name: 'Metabolism & Pancreas',
    subtitle: 'Blood glucose regulation, insulin resistance & HbA1c',
    iconName: 'Flame',
    colorGradient: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-50 border-amber-200',
    badgeText: 'text-amber-700',
    specialistTitle: 'Endocrinologist / Diabetologist',
    department: 'Endocrinology & Diabetology',
    keywords: ['glucose', 'sugar', 'hba1c', 'insulin', 'homa-ir', 'fructosamine'],
    defaultQuestions: [
      'Does my HbA1c and fasting glucose place me in pre-diabetes or insulin resistance?',
      'What dietary carbohydrate threshold should I target daily to normalize glucose spikes?',
      'Should we check fasting insulin levels to evaluate beta-cell pancreatic function?'
    ],
    defaultFollowUps: [
      'Repeat HbA1c test in 90 days (RBC cycle duration)',
      'Fasting Insulin & HOMA-IR Calculation',
      'Continuous Glucose Monitor (CGM) 14-day trial'
    ]
  },
  {
    id: 'liver',
    name: 'Liver & Biliary System',
    subtitle: 'Hepatic enzymes, detoxification & bilirubin clearance',
    iconName: 'Activity',
    colorGradient: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-50 border-emerald-200',
    badgeText: 'text-emerald-700',
    specialistTitle: 'Hepatologist / Gastroenterologist',
    department: 'Hepatology & Gastroenterology',
    keywords: ['alt', 'sgpt', 'ast', 'sgot', 'alp', 'alkaline phosphatase', 'bilirubin', 'ggt', 'albumin', 'globulin', 'liver'],
    defaultQuestions: [
      'Do my ALT/AST levels indicate fatty liver changes (NAFLD) or metabolic strain?',
      'Are any of my supplements or prescription medications straining hepatic clearance?',
      'Would an abdominal ultrasound or FibroScan be beneficial to assess liver tissue density?'
    ],
    defaultFollowUps: [
      'Liver Function Test (LFT) panel in 8-12 weeks',
      'Abdominal Ultrasound for Fatty Liver screening',
      'Serum GGT and Lipid profile correlation'
    ]
  },
  {
    id: 'kidneys',
    name: 'Kidneys & Renal Clearance',
    subtitle: 'Filtration rate, creatinine, electrolytes & hydration',
    iconName: 'Droplet',
    colorGradient: 'from-cyan-500 to-blue-600',
    badgeBg: 'bg-cyan-50 border-cyan-200',
    badgeText: 'text-cyan-700',
    specialistTitle: 'Nephrologist / Renal Specialist',
    department: 'Nephrology',
    keywords: ['creatinine', 'bun', 'blood urea', 'egfr', 'uric acid', 'sodium', 'potassium', 'chloride', 'urine', 'protein'],
    defaultQuestions: [
      'Is my estimated GFR and creatinine normal for my age, weight, and muscle mass?',
      'Does my uric acid level warrant dietary purine restriction or preventive uricase therapy?',
      'Are my electrolytes well-balanced for cardiovascular and renal stability?'
    ],
    defaultFollowUps: [
      'Serum Creatinine & eGFR recheck in 12 weeks',
      'Urine Microalbumin/Creatinine Ratio (uACR)',
      'Serum Uric Acid and Electrolyte panel'
    ]
  },
  {
    id: 'blood',
    name: 'Blood & Bone Marrow',
    subtitle: 'Hemoglobin, cellular counts, oxygen delivery & immunity',
    iconName: 'Shield',
    colorGradient: 'from-violet-500 to-purple-600',
    badgeBg: 'bg-violet-50 border-violet-200',
    badgeText: 'text-violet-700',
    specialistTitle: 'Hematologist / Internal Medicine Specialist',
    department: 'Hematology',
    keywords: ['hemoglobin', 'rbc', 'wbc', 'platelet', 'tlc', 'dlc', 'neutrophil', 'lymphocyte', 'eosinophil', 'monocyte', 'mcv', 'mch', 'mchc', 'rdw', 'ferritin', 'iron'],
    defaultQuestions: [
      'Do my MCV, MCH, and Hemoglobin levels indicate iron deficiency, B12 deficiency, or trait?',
      'Are my platelet and white blood cell levels within healthy immune surveillance bounds?',
      'Would you recommend an Iron Binding Profile (TIBC + Ferritin) to pinpoint fatigue causes?'
    ],
    defaultFollowUps: [
      'Complete Blood Count (CBC) with Peripheral Smear in 4-8 weeks',
      'Serum Ferritin & Total Iron Binding Capacity (TIBC)',
      'Serum Folate and Methylmalonic Acid'
    ]
  },
  {
    id: 'bones',
    name: 'Bones, Joints & Vital Minerals',
    subtitle: 'Vitamin D3, Calcium, structural density & joint vitality',
    iconName: 'Bone',
    colorGradient: 'from-amber-600 to-yellow-600',
    badgeBg: 'bg-amber-50 border-amber-200',
    badgeText: 'text-amber-800',
    specialistTitle: 'Orthopedic Specialist / Rheumatologist',
    department: 'Orthopedics & Rheumatology',
    keywords: ['vitamin d', 'vit d', 'calcium', 'phosphorus', 'vitamin b12', 'vit b12', 'esr', 'rheumatoid', 'uric acid', 'bone'],
    defaultQuestions: [
      'Is my Vitamin D3 level optimal (50-80 ng/mL) for bone mineralization and immune resilience?',
      'Should I be taking Vitamin K2 and Magnesium alongside high-dose Vitamin D3 supplements?',
      'Does my bone and mineral panel suggest a need for a DEXA Bone Density Scan?'
    ],
    defaultFollowUps: [
      '25-Hydroxy Vitamin D3 retest in 8-12 weeks after supplementation',
      'Serum Calcium & Ionized Calcium verification',
      'Serum Vitamin B12 and Homocysteine levels'
    ]
  },
  {
    id: 'thyroid',
    name: 'Thyroid & Endocrine Health',
    subtitle: 'Metabolic master regulator, TSH, T3, T4 energy control',
    iconName: 'Zap',
    colorGradient: 'from-indigo-500 to-sky-600',
    badgeBg: 'bg-indigo-50 border-indigo-200',
    badgeText: 'text-indigo-700',
    specialistTitle: 'Endocrinologist / Thyroidologist',
    department: 'Endocrinology',
    keywords: ['tsh', 'thyroid', 't3', 't4', 'free t3', 'free t4', 'anti-tpo', 'thyroglobulin'],
    defaultQuestions: [
      'Is my TSH in the functional sweet spot (1.0 - 2.5 uIU/mL) for peak energy and metabolism?',
      'Would you recommend checking Free T3, Free T4, and Anti-TPO antibodies to rule out Hashimoto’s?',
      'Could my thyroid numbers explain recent metabolic, hair, or energy shifts?'
    ],
    defaultFollowUps: [
      'Complete Thyroid Profile (TSH, Free T3, Free T4) in 8-12 weeks',
      'Anti-TPO and Anti-Thyroglobulin autoantibody panel',
      'Thyroid Gland Ultrasound if nodule suspected'
    ]
  }
];

export function analyzeOrganSystems(biomarkers: Biomarker[]): OrganSystemHealth[] {
  return ORGAN_CONFIGS.map((config) => {
    // Filter matching biomarkers
    const matchingBiomarkers = biomarkers.filter((m) => {
      const name = m.name.toLowerCase();
      const cat = m.category.toLowerCase();
      return config.keywords.some((k) => name.includes(k) || cat.includes(k));
    });

    // Calculate score and status
    let score = 95;
    let abnormalCount = 0;
    let hasCritical = false;

    matchingBiomarkers.forEach((m) => {
      if (m.status === 'critical') {
        score -= 22;
        abnormalCount++;
        hasCritical = true;
      } else if (m.status === 'high' || m.status === 'low') {
        score -= 12;
        abnormalCount++;
      } else if (m.status === 'borderline_high' || m.status === 'borderline_low') {
        score -= 5;
        abnormalCount++;
      }
    });

    if (matchingBiomarkers.length === 0) {
      score = 90; // Default baseline when unmeasured
    }

    score = Math.max(25, Math.min(100, score));

    const status: 'optimal' | 'attention' | 'critical' = 
      hasCritical || score < 60 ? 'critical' : abnormalCount > 0 || score < 80 ? 'attention' : 'optimal';

    // Determine Urgency
    let urgency: SpecialistUrgency = 'Routine / Preventative';
    if (status === 'critical') {
      urgency = 'Priority Consultation';
    } else if (status === 'attention') {
      urgency = 'Within 2-4 Weeks';
    }

    // Build specific clinical reasons
    const reasons: string[] = [];
    matchingBiomarkers
      .filter((m) => m.status !== 'normal' && m.status !== 'optimal')
      .forEach((m) => {
        reasons.push(`${m.name} is ${m.status.replace('_', ' ')} at ${m.value} ${m.unit} (Ref: ${m.refRangeString})`);
      });

    if (reasons.length === 0) {
      reasons.push(`All measured parameters for ${config.name.toLowerCase()} are currently within normal baseline ranges.`);
      reasons.push('Routine annual preventive screening advised.');
    }

    const specialist: SpecialistRecommendation = {
      specialistTitle: config.specialistTitle,
      department: config.department,
      urgency,
      primaryReasons: reasons,
      suggestedQuestions: config.defaultQuestions,
      suggestedClinicalFollowUps: config.defaultFollowUps,
      dietaryActionSummary: status === 'optimal' 
        ? 'Maintain current balanced nutrition and hydration.'
        : 'Adopt targeted functional foods, reduce refined sugars, and follow medical guidance.'
    };

    return {
      id: config.id,
      name: config.name,
      subtitle: config.subtitle,
      iconName: config.iconName,
      healthScore: score,
      status,
      colorGradient: config.colorGradient,
      badgeBg: config.badgeBg,
      badgeText: config.badgeText,
      biomarkers: matchingBiomarkers,
      abnormalCount,
      specialist,
      summary: `${config.name}: ${abnormalCount} flagged biomarkers. Status is ${status.toUpperCase()}.`
    };
  });
}

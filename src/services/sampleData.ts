import { AnalysisReport } from '../types/report.ts';

export const sampleReports: Record<string, AnalysisReport> = {
  'priya-jadhav-maxlab': {
    id: 'report-maxlab-priya',
    patientInfo: {
      name: 'Priya Sameer Jadhav',
      age: '35 Years 9 Months',
      gender: 'Female',
      collectionDate: '24-Sep-2026 07:01 AM',
      labName: 'MAX Lab - Laboratory Medicine Mumbai'
    },
    overallHealthScore: 78,
    executiveSummary: 'The panel shows predominantly healthy metabolic, glycemic, liver, and kidney markers. The primary area requiring immediate therapeutic intervention is a Severe Vitamin D3 Deficiency (6.81 ng/mL). Additionally, a mild elevation in Total Cholesterol (211 mg/dL) and LDL "Bad" Cholesterol (135 mg/dL) was identified, which can be managed with targeted dietary adjustments and cardiovascular exercise.',
    criticalFindings: [
      'Severe Vitamin D3 Deficiency: 6.81 ng/mL (Normal is >30 ng/mL; <20 ng/mL indicates clinical deficiency).',
      'Borderline High LDL Cholesterol: 135 mg/dL (Optimal is <100 mg/dL).',
      'Mild Total Cholesterol Elevation: 211 mg/dL (Desirable is <200 mg/dL).',
      'Normal Glycemic / Diabetes Panel: Fasting Glucose (84.5 mg/dL) and HbA1c (5.10%) are optimal.',
      'Normal Kidney & Liver Function: eGFR > 120 mL/min, optimal bilirubin, albumin, and renal electrolytes.'
    ],
    biomarkers: [
      {
        id: 'vit-d3',
        name: '25-Hydroxy Vitamin D (Vit D3)',
        category: 'Vitamins & Minerals',
        value: 6.81,
        numericValue: 6.81,
        unit: 'ng/mL',
        refMin: 30,
        refMax: 100,
        refRangeString: '30 - 100',
        status: 'critical',
        interpretation: 'Severe Deficiency',
        clinicalSignificance: 'Crucial for calcium absorption, bone mineral density, immune competence, mood regulation, and muscle performance.'
      },
      {
        id: 'vit-b12',
        name: 'Vitamin B12 (Cyanocobalamin)',
        category: 'Vitamins & Minerals',
        value: 318,
        numericValue: 318,
        unit: 'pg/mL',
        refMin: 180,
        refMax: 914,
        refRangeString: '180 - 914',
        status: 'normal',
        interpretation: 'Normal / Adequate',
        clinicalSignificance: 'Essential for nerve tissue health, brain function, and red blood cell production.'
      },
      {
        id: 'serum-iron',
        name: 'Serum Iron (Ferrozine)',
        category: 'Vitamins & Minerals',
        value: 71.3,
        numericValue: 71.3,
        unit: 'mcg/dL',
        refMin: 33,
        refMax: 193,
        refRangeString: '33 - 193',
        status: 'optimal',
        interpretation: 'Normal',
        clinicalSignificance: 'Circulating iron available for hemoglobin synthesis and cellular oxygen transport.'
      },
      {
        id: 'total-chol',
        name: 'Total Cholesterol',
        category: 'Lipid Profile',
        value: 211,
        numericValue: 211,
        unit: 'mg/dL',
        refMin: 0,
        refMax: 200,
        refRangeString: '< 200',
        status: 'borderline_high',
        interpretation: 'Mildly Elevated / Borderline',
        clinicalSignificance: 'Overall measure of blood cholesterol; baseline marker for cardiovascular plaque assessment.'
      },
      {
        id: 'ldl-chol',
        name: 'LDL Cholesterol (Calculated)',
        category: 'Lipid Profile',
        value: 135,
        numericValue: 135,
        unit: 'mg/dL',
        refMin: 0,
        refMax: 100,
        refRangeString: '< 100',
        status: 'borderline_high',
        interpretation: 'Borderline High',
        clinicalSignificance: 'Primary atherogenic particle that can accumulate inside arterial walls over time.'
      },
      {
        id: 'hdl-chol',
        name: 'HDL Cholesterol (Direct)',
        category: 'Lipid Profile',
        value: 48.2,
        numericValue: 48.2,
        unit: 'mg/dL',
        refMin: 40,
        refMax: 60,
        refRangeString: '40 - 60',
        status: 'optimal',
        interpretation: 'Desirable / Normal',
        clinicalSignificance: 'Cardioprotective "good" cholesterol responsible for reverse cholesterol transport back to the liver.'
      },
      {
        id: 'triglycerides',
        name: 'Triglycerides',
        category: 'Lipid Profile',
        value: 139,
        numericValue: 139,
        unit: 'mg/dL',
        refMin: 0,
        refMax: 150,
        refRangeString: '< 150',
        status: 'normal',
        interpretation: 'Normal / Desirable',
        clinicalSignificance: 'Blood fats used for energy; closely linked with dietary carbohydrate and refined sugar intake.'
      },
      {
        id: 'fasting-glucose',
        name: 'Fasting Blood Glucose',
        category: 'Diabetes & Glycemic',
        value: 84.5,
        numericValue: 84.5,
        unit: 'mg/dL',
        refMin: 70,
        refMax: 100,
        refRangeString: '70 - 100',
        status: 'optimal',
        interpretation: 'Optimal Baseline',
        clinicalSignificance: 'Circulating plasma glucose after overnight fasting; primary screener for insulin resistance and diabetes.'
      },
      {
        id: 'hba1c',
        name: 'HbA1c (Glycated Hemoglobin)',
        category: 'Diabetes & Glycemic',
        value: 5.10,
        numericValue: 5.10,
        unit: '%',
        refMin: 4.0,
        refMax: 5.6,
        refRangeString: '< 5.7',
        status: 'optimal',
        interpretation: 'Non-Diabetic / Excellent Control',
        clinicalSignificance: 'Reflects 3-month average blood sugar regulation with zero red blood cell glycation stress.'
      },
      {
        id: 'sgpt-alt',
        name: 'ALT (SGPT) - Alanine Aminotransferase',
        category: 'Liver Function (LFT)',
        value: 37.7,
        numericValue: 37.7,
        unit: 'U/L',
        refMin: 0,
        refMax: 45,
        refRangeString: '< 45',
        status: 'normal',
        interpretation: 'Normal Hepatic Enzyme',
        clinicalSignificance: 'Specific enzyme found inside hepatocytes; elevated during liver inflammation, fatty liver, or drug strain.'
      },
      {
        id: 'sgot-ast',
        name: 'AST (SGOT) - Aspartate Aminotransferase',
        category: 'Liver Function (LFT)',
        value: 39.4,
        numericValue: 39.4,
        unit: 'U/L',
        refMin: 0,
        refMax: 40,
        refRangeString: '< 40',
        status: 'normal',
        interpretation: 'Normal',
        clinicalSignificance: 'Cellular enzyme present in liver and muscle tissue.'
      },
      {
        id: 'total-bilirubin',
        name: 'Total Bilirubin (Diazo)',
        category: 'Liver Function (LFT)',
        value: 0.44,
        numericValue: 0.44,
        unit: 'mg/dL',
        refMin: 0.2,
        refMax: 1.2,
        refRangeString: '0.2 - 1.2',
        status: 'optimal',
        interpretation: 'Optimal Clearance',
        clinicalSignificance: 'Breakdown byproduct of red blood cells processed and cleared by the liver and biliary tract.'
      },
      {
        id: 'serum-creatinine',
        name: 'Serum Creatinine (Enzymatic)',
        category: 'Kidney Function (KFT)',
        value: 0.58,
        numericValue: 0.58,
        unit: 'mg/dL',
        refMin: 0.5,
        refMax: 1.1,
        refRangeString: '0.5 - 1.1',
        status: 'optimal',
        interpretation: 'Optimal Clearance',
        clinicalSignificance: 'Metabolic waste product filtered exclusively by renal glomeruli; benchmark for kidney health.'
      },
      {
        id: 'blood-urea',
        name: 'Blood Urea Nitrogen (BUN)',
        category: 'Kidney Function (KFT)',
        value: 12.3,
        numericValue: 12.3,
        unit: 'mg/dL',
        refMin: 6,
        refMax: 20,
        refRangeString: '6 - 20',
        status: 'optimal',
        interpretation: 'Normal',
        clinicalSignificance: 'Waste product from dietary protein breakdown excreted by healthy kidneys.'
      },
      {
        id: 'serum-calcium',
        name: 'Serum Calcium (Arsenazo III)',
        category: 'Vitamins & Minerals',
        value: 9.38,
        numericValue: 9.38,
        unit: 'mg/dL',
        refMin: 8.8,
        refMax: 10.6,
        refRangeString: '8.8 - 10.6',
        status: 'optimal',
        interpretation: 'Optimal / Stable',
        clinicalSignificance: 'Vital cation governing cardiac rhythm, nerve transmission, and skeletal bone density.'
      },
      {
        id: 'tsh-thyroid',
        name: 'TSH (Ultrasensitive Thyroid Stimulating Hormone)',
        category: 'Thyroid & Endocrine',
        value: 2.14,
        numericValue: 2.14,
        unit: 'µIU/mL',
        refMin: 0.35,
        refMax: 4.94,
        refRangeString: '0.35 - 4.94',
        status: 'optimal',
        interpretation: 'Euthyroid / Optimal',
        clinicalSignificance: 'Pituitary master regulator of thyroid metabolism, energy expenditure, and basal body temperature.'
      },
      {
        id: 'cbc-platelets',
        name: 'Platelet Count',
        category: 'Hematology & CBC',
        value: 245000,
        numericValue: 245000,
        unit: '/µL',
        refMin: 150000,
        refMax: 450000,
        refRangeString: '150,000 - 450,000',
        status: 'optimal',
        interpretation: 'Healthy Platelet Pool',
        clinicalSignificance: 'Essential for blood clotting and vascular endothelium maintenance.'
      },
      {
        id: 'cbc-tlc',
        name: 'Total Leukocyte Count (TLC / WBC)',
        category: 'Hematology & CBC',
        value: 6800,
        numericValue: 6800,
        unit: '/µL',
        refMin: 4000,
        refMax: 11000,
        refRangeString: '4,000 - 11,000',
        status: 'optimal',
        interpretation: 'Balanced Immune Defense',
        clinicalSignificance: 'Total circulating white blood cells actively surveying for viral and bacterial pathogens.'
      },
      {
        id: 'cbc-hb',
        name: 'Hemoglobin (Hb)',
        category: 'Hematology & CBC',
        value: 12.8,
        numericValue: 12.8,
        unit: 'g/dL',
        refMin: 12.0,
        refMax: 15.5,
        refRangeString: '12.0 - 15.5',
        status: 'optimal',
        interpretation: 'Optimal Oxygen Delivery',
        clinicalSignificance: 'Iron-containing protein in red blood cells that transports oxygen to muscles and brain.'
      }
    ],
    conditions: [
      {
        id: 'severe-hypovitaminosis-d',
        name: 'Severe Hypovitaminosis D (Vitamin D Deficiency)',
        category: 'Nutritional / Endocrine',
        riskLevel: 'high',
        confidence: 98,
        summary: 'Vitamin D level of 6.81 ng/mL is severely depleted and warrants prompt clinical therapeutic loading.',
        detailedExplanation: 'Vitamin D3 operates as a pro-hormone receptor ligand in almost every bodily tissue. A reading below 10 ng/mL increases vulnerability to bone mineral loss, muscle fatigue, subclinical inflammation, and weakened T-cell mediated immunity.',
        associatedMarkers: ['25-Hydroxy Vitamin D (Vit D3)', 'Serum Calcium'],
        keyRiskFactors: ['Low dietary intake of fatty fish/fortified dairy', 'Minimal direct ultraviolet B sunlight exposure', 'Indoor desk lifestyle'],
        potentialComplications: ['Accelerated osteopenia / bone density loss', 'Recurrent musculoskeletal aches', 'Seasonal mood fluctuations']
      },
      {
        id: 'mild-dyslipidemia',
        name: 'Mild Atherogenic Dyslipidemia (Borderline LDL)',
        category: 'Cardiovascular Risk',
        riskLevel: 'moderate',
        confidence: 84,
        summary: 'Total cholesterol (211 mg/dL) and LDL (135 mg/dL) are mildly elevated while triglycerides (139 mg/dL) and HDL (48.2 mg/dL) remain stable.',
        detailedExplanation: 'A moderately elevated LDL count indicates a mild surplus of circulating low-density lipoproteins. Addressing this early through soluble fiber, plant sterols, and zone 2 aerobic cardio prevents arterial intimal accumulation.',
        associatedMarkers: ['Total Cholesterol', 'LDL Cholesterol (Calculated)', 'HDL Cholesterol (Direct)', 'Triglycerides'],
        keyRiskFactors: ['Dietary saturated fat intake', 'Sedentary work habits'],
        potentialComplications: ['Early endothelial fatty streaking if uncorrected over years']
      }
    ],
    remedies: {
      diet: {
        beneficialFoods: [
          { category: 'Vitamin D & Healthy Fats', items: ['Pasture-raised egg yolks', 'Fortified almond/cow milk', 'Wild salmon / Mackerel', 'Mushrooms exposed to UV'], reason: 'Improves dietary pro-vitamin absorption.' },
          { category: 'Soluble Fiber for LDL Lowering', items: ['Steel-cut oats', 'Chia & Flax seeds', 'Lentils & Chickpeas', 'Apples & Pears'], reason: 'Binds intestinal bile acids to clear circulating LDL.' }
        ],
        foodsToLimit: [
          { category: 'Saturated & Trans Fats', items: ['Deep fried street foods', 'Hydrogenated vegetable oils (vanaspati)', 'Commercial baked pastries'], reason: 'Suppresses hepatic LDL receptor clearance.' },
          { category: 'Refined Sugars', items: ['Sugary sodas', 'Packaged fruit concentrates', 'Candy'], reason: 'Triggers hepatic triglyceride synthesis.' }
        ],
        mealIdeas: [
          { meal: 'Breakfast', suggestion: 'Rolled oatmeal with chia seeds, crushed walnuts, cinnamon, and a glass of fortified almond milk.' },
          { meal: 'Lunch', suggestion: 'Grilled salmon or tofu salad with mixed leafy greens, extra virgin olive oil, and brown rice.' },
          { meal: 'Dinner', suggestion: 'Warm lentil dal (khichdi) with steamed spinach and grilled zucchini.' }
        ],
        hydrationTip: 'Consume 2.5–3.0 Liters of filtered water daily to maintain renal clearance.'
      },
      lifestyle: {
        sunlightAndCircadian: {
          recommendation: 'Get 15–20 minutes of mid-morning sunlight (9:00 AM – 11:30 AM) on uncovered arms and legs without sunscreen.',
          targetDuration: '15-20 Minutes daily'
        },
        exerciseGuidance: [
          { type: 'Zone 2 Aerobic Walking / Cycling', frequency: '4-5 times / week', intensity: 'Moderate (Conversational pace)', notes: 'Enhances endothelial nitric oxide and raises HDL cholesterol.' },
          { type: 'Resistance Training', frequency: '2-3 times / week', intensity: 'Moderate', notes: 'Stimulates osteoblast activity and bone mineralization.' }
        ],
        sleepAndStress: [
          { habit: 'Consistent Sleep Window', benefit: 'Allows cortisol to reset and optimizes nocturnal growth hormone.' },
          { habit: 'Evening Blue-Light Cutoff', benefit: 'Preserves natural melatonin synthesis.' }
        ],
        habitsToAvoid: ['Prolonged uninterrupted sitting (>2 hours)', 'Late-night heavy snacking']
      },
      supplements: [
        {
          name: 'Cholecalciferol (Vitamin D3) 60,000 IU',
          standardDosageRange: '60,000 IU once weekly for 8 consecutive weeks, followed by 1,000–2,000 IU daily maintenance',
          purpose: 'Rapidly restore depleted circulating 25-OH Vitamin D stores.',
          targetMarker: '25-Hydroxy Vitamin D (Vit D3)',
          evidenceLevel: 'High',
          cautionNote: 'Take immediately after a meal containing dietary fats (e.g., breakfast with eggs, avocado, or nuts) for optimal micellar absorption.'
        },
        {
          name: 'Omega-3 Fish Oil (EPA 500mg / DHA 250mg)',
          standardDosageRange: '1000 mg softgel daily with lunch',
          purpose: 'Cardioprotective lipid stabilization and cellular membrane fluidity.',
          targetMarker: 'LDL Cholesterol, Triglycerides',
          evidenceLevel: 'High',
          cautionNote: 'Consult physician if taking anti-platelet or blood-thinning medications.'
        }
      ],
      doctorPlan: {
        urgency: 'Within 1-2 Weeks',
        recommendedSpecialist: 'General Physician / Endocrinologist',
        questionsToAsk: [
          'What high-dose Vitamin D3 loading schedule is best for my body weight and lifestyle?',
          'Should I schedule a follow-up 25-OH Vitamin D test in 8 to 12 weeks to verify replenishment?',
          'Are my borderline LDL cholesterol numbers manageable with lifestyle adjustments alone?'
        ],
        suggestedFollowUpTests: ['Repeat 25-OH Vitamin D3 (in 8-12 weeks)', 'Fasting Lipid Panel (in 3 months)'],
        recommendedRetestInterval: '8 to 12 Weeks',
        redFlags: ['Persistent bone or joint pain', 'Severe muscle spasms or tetany', 'Unexplained extreme fatigue']
      }
    },
    analyzedAt: new Date().toISOString()
  },

  // ------------------------------------------------------------------------------------------------
  // 2. NEW ACUTE DENGUE & SEVERE THROMBOCYTOPENIA SAMPLE REPORT
  // ------------------------------------------------------------------------------------------------
  'aarav-dengue-platelet-drop': {
    id: 'report-dengue-aarav',
    patientInfo: {
      name: 'Aarav Mehta',
      age: '28 Years',
      gender: 'Male',
      collectionDate: '26-Sep-2026 09:30 AM',
      labName: 'Metropolis Healthcare & Tropical Diagnostics'
    },
    overallHealthScore: 42,
    executiveSummary: 'CRITICAL MEDICAL ALERT: The hematology panel reveals acute severe thrombocytopenia (Platelets: 38,000 /µL), significant leukopenia (TLC: 2,400 /µL), elevated Hematocrit / PCV (48.5%), and hepatic transaminitis (AST: 138 U/L, ALT: 94 U/L). This clinical pattern is highly characteristic of Day 3–5 active Dengue Fever with capillary plasma leakage and high bleeding risk.',
    criticalFindings: [
      'CRITICAL THROMBOCYTOPENIA: Platelet count has dropped to 38,000 /µL (Normal is 150,000 - 450,000 /µL; <50,000 represents high mucosal hemorrhage risk).',
      'SEVERE LEUKOPENIA: Total WBC (TLC) at 2,400 /µL (Normal: 4,000 - 11,000 /µL) reflecting profound bone marrow viral suppression.',
      'HEMOCONCENTRATION ALERT: Hematocrit (PCV) elevated to 48.5% (Normal: 38 - 46%) indicating intravascular fluid shifting / plasma leakage.',
      'HEPATIC STRAIN: AST (SGOT) 138 U/L and ALT (SGPT) 94 U/L elevated secondary to viral hepatitis.',
      'ELEVATED ESR: 48 mm/hr reflecting acute viral inflammatory response.'
    ],
    biomarkers: [
      {
        id: 'platelet-count',
        name: 'Platelet Count (Automated Impedance & Smear)',
        category: 'Hematology & CBC',
        value: 38000,
        numericValue: 38000,
        unit: '/µL',
        refMin: 150000,
        refMax: 450000,
        refRangeString: '150,000 - 450,000',
        status: 'critical',
        interpretation: 'Severe Thrombocytopenia (Critical Bleeding Risk)',
        clinicalSignificance: 'Crucial for primary hemostasis; levels below 50,000 require strict physical caution and close monitoring for mucosal bleeding.'
      },
      {
        id: 'total-wbc',
        name: 'Total Leukocyte Count (TLC / WBC)',
        category: 'Hematology & CBC',
        value: 2400,
        numericValue: 2400,
        unit: '/µL',
        refMin: 4000,
        refMax: 11000,
        refRangeString: '4,000 - 11,000',
        status: 'critical',
        interpretation: 'Severe Leukopenia / Viral Suppression',
        clinicalSignificance: 'Reflects bone marrow granulocytic suppression during acute arboviral replication.'
      },
      {
        id: 'hematocrit-pcv',
        name: 'Hematocrit (PCV / Packed Cell Volume)',
        category: 'Hematology & CBC',
        value: 48.5,
        numericValue: 48.5,
        unit: '%',
        refMin: 38.0,
        refMax: 46.0,
        refRangeString: '38.0 - 46.0',
        status: 'high',
        interpretation: 'Elevated (Hemoconcentration / Plasma Leakage)',
        clinicalSignificance: 'A rising hematocrit combined with falling platelets is the hallmark of plasma extravasation into third spaces in Dengue.'
      },
      {
        id: 'hemoglobin',
        name: 'Hemoglobin (Hb)',
        category: 'Hematology & CBC',
        value: 15.2,
        numericValue: 15.2,
        unit: 'g/dL',
        refMin: 13.0,
        refMax: 17.0,
        refRangeString: '13.0 - 17.0',
        status: 'normal',
        interpretation: 'Normal (Hemoconcentrated Baseline)',
        clinicalSignificance: 'Oxygen carrying protein in red blood cells.'
      },
      {
        id: 'neutrophils',
        name: 'Neutrophils (DLC)',
        category: 'Hematology & CBC',
        value: 48,
        numericValue: 48,
        unit: '%',
        refMin: 40,
        refMax: 70,
        refRangeString: '40 - 70',
        status: 'normal',
        interpretation: 'Normal Differential',
        clinicalSignificance: 'First responder phagocytic granulocytes.'
      },
      {
        id: 'lymphocytes',
        name: 'Lymphocytes (DLC)',
        category: 'Hematology & CBC',
        value: 44,
        numericValue: 44,
        unit: '%',
        refMin: 20,
        refMax: 40,
        refRangeString: '20 - 40',
        status: 'borderline_high',
        interpretation: 'Relative Reactive Lymphocytosis',
        clinicalSignificance: 'Atypical and reactive lymphocytes active in viral antibody generation.'
      },
      {
        id: 'ast-sgot',
        name: 'AST (SGOT) - Aspartate Aminotransferase',
        category: 'Liver Function (LFT)',
        value: 138,
        numericValue: 138,
        unit: 'U/L',
        refMin: 0,
        refMax: 40,
        refRangeString: '< 40',
        status: 'high',
        interpretation: 'Marked Elevation (Viral Hepatic Involvement)',
        clinicalSignificance: 'Liver enzyme released due to dengue-induced acute reactive hepatitis.'
      },
      {
        id: 'alt-sgpt',
        name: 'ALT (SGPT) - Alanine Aminotransferase',
        category: 'Liver Function (LFT)',
        value: 94,
        numericValue: 94,
        unit: 'U/L',
        refMin: 0,
        refMax: 45,
        refRangeString: '< 45',
        status: 'high',
        interpretation: 'Elevated Hepatic Transaminase',
        clinicalSignificance: 'Specific marker of acute hepatocellular stress.'
      },
      {
        id: 'esr-rate',
        name: 'Erythrocyte Sedimentation Rate (ESR)',
        category: 'Inflammation & Markers',
        value: 48,
        numericValue: 48,
        unit: 'mm/hr',
        refMin: 0,
        refMax: 15,
        refRangeString: '0 - 15',
        status: 'high',
        interpretation: 'Elevated Systemic Inflammation',
        clinicalSignificance: 'Non-specific marker reflecting acute phase protein surge.'
      },
      {
        id: 'serum-creatinine',
        name: 'Serum Creatinine',
        category: 'Kidney Function (KFT)',
        value: 0.88,
        numericValue: 0.88,
        unit: 'mg/dL',
        refMin: 0.6,
        refMax: 1.2,
        refRangeString: '0.6 - 1.2',
        status: 'optimal',
        interpretation: 'Normal Renal Function',
        clinicalSignificance: 'Renal filtration capacity is currently preserved.'
      }
    ],
    conditions: [
      {
        id: 'dengue-hemorrhagic-risk',
        name: 'Suspected Dengue Fever with Severe Thrombocytopenia',
        category: 'Viral Infection / Infectious Disease',
        riskLevel: 'critical',
        confidence: 96,
        summary: 'Severe platelet collapse (38,000 /µL), hemoconcentration (PCV 48.5%), and leukopenia strongly indicate acute Dengue critical phase.',
        detailedExplanation: 'In Dengue fever, viral non-structural protein NS1 and cross-reactive antibodies trigger endothelial activation, plasma leakage into pleural/peritoneal cavities, and immune-mediated platelet destruction. Immediate clinical monitoring and oral/IV fluid balance are critical to prevent Dengue Shock Syndrome.',
        associatedMarkers: ['Platelet Count', 'Total Leukocyte Count (TLC / WBC)', 'Hematocrit (PCV / Packed Cell Volume)', 'AST (SGOT)', 'ALT (SGPT)'],
        keyRiskFactors: ['Mosquito exposure in tropical/sub-tropical regions', 'Sudden onset high grade fever with chills and retro-orbital pain'],
        potentialComplications: ['Spontaneous mucosal bleeding (gum bleed, epistaxis, hematuria, melena)', 'Plasma leakage leading to hypovolemic shock', 'Acute severe hepatitis']
      }
    ],
    remedies: {
      diet: {
        beneficialFoods: [
          { category: 'Oral Rehydration & Electrolytes', items: ['WHO Oral Rehydration Salts (ORS)', 'Fresh tender coconut water', 'Clear vegetable broths', 'Pomegranate and apple juice'], reason: 'Counters capillary plasma leakage and maintains central intravascular volume.' },
          { category: 'Easy Digestible Energy', items: ['Rice porridge (Kanji)', 'Moong dal khichdi', 'Boiled potatoes', 'Ripe bananas'], reason: 'Provides gentle glycogen replenishment without overburdening strained liver.' }
        ],
        foodsToLimit: [
          { category: 'Hemorrhagic / Gastric Irritants', items: ['Spicy red chili curries', 'Fried oily foods', 'Hard crunchy snacks'], reason: 'Prevents gastric mucosal irritation and upper GI bleeding.' },
          { category: 'Dark Red / Black Foods', items: ['Artificial red jellies', 'Beetroot juice in excess'], reason: 'Avoids confusing stool coloration with internal bleeding (melena).' }
        ],
        mealIdeas: [
          { meal: 'Morning (Fluid Loading)', suggestion: '1 Glass of fresh coconut water followed by soft warm moong dal khichdi.' },
          { meal: 'Midday', suggestion: 'Electrolyte ORS water with steamed idli or soft boiled rice with curd.' },
          { meal: 'Evening', suggestion: 'Clear vegetable broth with papaya leaf extract / giloy juice under supervision.' }
        ],
        hydrationTip: 'CRITICAL HYDRATION: Drink 2.5–3.5 Liters of fluid daily in small frequent sips to prevent hemoconcentration.'
      },
      lifestyle: {
        sunlightAndCircadian: {
          recommendation: 'Strict complete bed rest. Avoid any physical exertion, heavy lifting, or sports.',
          targetDuration: 'Complete Bed Rest'
        },
        exerciseGuidance: [],
        sleepAndStress: [
          { habit: 'Horizontal Bed Rest', benefit: 'Minimizes orthostatic vascular pooling and cardiac workload.' },
          { habit: 'Vital Signs Self-Monitoring', benefit: 'Check pulse rate, blood pressure, and urine output every 4–6 hours.' }
        ],
        habitsToAvoid: ['STRICTLY AVOID taking Aspirin, Ibuprofen, Diclofenac or any NSAID painkillers (they trigger severe internal hemorrhage)', 'Avoid vigorous nose blowing or hard tooth brushing']
      },
      supplements: [
        {
          name: 'Carica Papaya Leaf Extract (Standardized)',
          standardDosageRange: '500 mg extract / syrup thrice daily (under doctor supervision)',
          purpose: 'Supports thrombopoiesis and stabilized platelet membrane counts.',
          targetMarker: 'Platelet Count',
          evidenceLevel: 'Moderate',
          cautionNote: 'Adjunctive support only; does NOT replace medical hospitalization or fluid therapy.'
        }
      ],
      doctorPlan: {
        urgency: 'Immediate',
        recommendedSpecialist: 'Infectious Disease Specialist / Hospital Emergency Room (ER)',
        questionsToAsk: [
          'Does my platelet count of 38,000 /µL warrant hospital admission for IV fluid therapy or platelet monitoring?',
          'Should we perform a Dengue NS1 Antigen ELISA and Dengue IgM/IgG antibody titer immediately?',
          'How frequently should my Complete Blood Count (CBC) and Hematocrit be retested (every 12 vs 24 hours)?'
        ],
        suggestedFollowUpTests: ['Dengue NS1 Antigen ELISA', 'Dengue IgM / IgG Antibody Panel', 'Serial CBC (every 12–24 hours)', 'Ultrasound Abdomen (for Gallbladder wall edema / Ascites)'],
        recommendedRetestInterval: 'Repeat CBC in 12 to 24 Hours',
        redFlags: [
          'Spontaneous bleeding from gums, nose, or blood in vomit/stool (black tarry stools)',
          'Severe persistent abdominal pain or intractable vomiting (>3 times in 2 hours)',
          'Sudden extreme restlessness, cold clammy extremities, or inability to pass urine for >6 hours'
        ]
      }
    },
    analyzedAt: new Date().toISOString()
  }
};

import { Biomarker } from '../types/report.ts';
import { PredictedSymptom, SymptomCategory } from '../types/symptomPrediction.ts';

export function predictPatientSymptoms(biomarkers: Biomarker[]): PredictedSymptom[] {
  const symptoms: PredictedSymptom[] = [];

  const getMarker = (keywords: string[]) => {
    return biomarkers.find((m) => {
      const name = m.name.toLowerCase();
      return keywords.some((k) => name.includes(k));
    });
  };

  const getVal = (m?: Biomarker): number | null => {
    if (!m) return null;
    if (typeof m.value === 'number') return m.value;
    const p = parseFloat(String(m.value).replace(/[^0-9.]/g, ''));
    return isNaN(p) ? null : p;
  };

  const plt = getMarker(['platelet', 'plt']);
  const pltVal = getVal(plt);

  const hb = getMarker(['hemoglobin', 'hb']);
  const hbVal = getVal(hb);

  const vitD = getMarker(['vit d', 'vitamin d']);
  const vitDVal = getVal(vitD);

  const vitB12 = getMarker(['vit b12', 'vitamin b12']);
  const vitB12Val = getVal(vitB12);

  const glucose = getMarker(['glucose', 'sugar', 'hba1c']);
  const glucoseVal = getVal(glucose);

  const chol = getMarker(['cholesterol', 'triglyceride', 'ldl']);
  const cholVal = getVal(chol);

  const tlc = getMarker(['total leukocyte', 'wbc', 'tlc']);
  const tlcVal = getVal(tlc);

  const bili = getMarker(['bilirubin']);
  const biliVal = getVal(bili);

  const tsh = getMarker(['tsh', 'thyroid']);
  const tshVal = getVal(tsh);

  const alt = getMarker(['alt', 'sgpt', 'ast', 'sgot']);
  const altVal = getVal(alt);

  // 1. THROMBOCYTOPENIA & VIRAL SYMPTOMS (DENGUE / VIRAL)
  if (pltVal !== null && pltVal < 100000) {
    symptoms.push({
      id: 'sym-retro-orbital',
      name: 'Retro-Orbital Headache (Deep pain behind the eyes)',
      category: 'Head, Eyes & Neuro',
      probability: 'High Likelihood',
      iconName: 'Eye',
      underlyingBiomarkerTrigger: `Platelets at ${pltVal.toLocaleString()} /µL & acute viral vascular dilation`,
      physiologicMechanism: 'Microvascular congestion and inflammatory mediator release in the orbital plexus.',
      isRedFlag: false,
      commonReliefAdvice: 'Rest in a dimly lit, quiet room; cold compress over closed eyelids; maintain hydration.'
    });

    symptoms.push({
      id: 'sym-breakbone-ache',
      name: 'Severe Bone & Joint Aches ("Breakbone Fever" sensation)',
      category: 'Joints & Muscles',
      probability: 'High Likelihood',
      iconName: 'Activity',
      underlyingBiomarkerTrigger: `Thrombocytopenia & Viral cytokine storm (TLC ${tlcVal || 'Low'})`,
      physiologicMechanism: 'Interleukin and TNF-alpha elevation stimulating sensory nerve endings in periosteum and skeletal muscles.',
      isRedFlag: false,
      commonReliefAdvice: 'Adequate rest; warm baths; paracetamol as prescribed by doctor (avoid ibuprofen).'
    });

    symptoms.push({
      id: 'sym-petechiae-bruising',
      name: 'Skin Petechiae / Tiny Red Spots & Easy Bruising',
      category: 'Skin, Mucosa & Capillaries',
      probability: pltVal < 50000 ? 'High Likelihood' : 'Moderate',
      iconName: 'AlertCircle',
      underlyingBiomarkerTrigger: `Critical Platelet Deficit: ${pltVal.toLocaleString()} /µL (Normal >150,000)`,
      physiologicMechanism: 'Capillary fragility causing spontaneous micro-hemorrhages under the dermis.',
      isRedFlag: true,
      commonReliefAdvice: 'Avoid vigorous brushing, tight clothing, or contact sports; seek immediate clinical supervision.'
    });
  }

  // 2. SEVERE ANEMIA (HEMOGLOBIN DROP)
  if (hbVal !== null && hbVal < 11.5) {
    symptoms.push({
      id: 'sym-fatigue-breathless',
      name: 'Exertional Breathlessness & Chronic Exhaustion',
      category: 'Energy & General',
      probability: 'High Likelihood',
      iconName: 'ZapOff',
      underlyingBiomarkerTrigger: `Hemoglobin is ${hbVal} g/dL (Ref: 12.0 - 16.0 g/dL)`,
      physiologicMechanism: 'Decreased red cell mass limits oxygen delivery to skeletal muscles, brain, and myocardium.',
      isRedFlag: hbVal < 8.0,
      commonReliefAdvice: 'Iron-rich nutrition (spinach, lentils, dates, beetroot) paired with Vitamin C; pace physical exertion.'
    });

    symptoms.push({
      id: 'sym-dizziness-postural',
      name: 'Postural Dizziness & Lightheadedness upon Standing',
      category: 'Head, Eyes & Neuro',
      probability: 'Moderate',
      iconName: 'Compass',
      underlyingBiomarkerTrigger: `Reduced oxygen carrying capacity (Hb ${hbVal} g/dL)`,
      physiologicMechanism: 'Transient cerebral hypoperfusion when shifting from sitting to standing posture.',
      isRedFlag: false,
      commonReliefAdvice: 'Rise slowly from bed or chairs; ensure adequate hydration and electrolyte intake.'
    });
  }

  // 3. VITAMIN D3 DEFICIENCY
  if (vitDVal !== null && vitDVal < 20) {
    symptoms.push({
      id: 'sym-bone-back-ache',
      name: 'Deep Lower Back & Shin Bone Aches',
      category: 'Joints & Muscles',
      probability: 'High Likelihood',
      iconName: 'Bone',
      underlyingBiomarkerTrigger: `Severe Vitamin D3 Deficiency: ${vitDVal} ng/mL (Normal >30 ng/mL)`,
      physiologicMechanism: 'Impaired intestinal calcium absorption leads to periosteal collagen matrix expansion and osteomalacic tenderness.',
      isRedFlag: false,
      commonReliefAdvice: 'Weekly high-dose Vitamin D3 (60,000 IU) supplementation with fatty meals; morning sun exposure.'
    });

    symptoms.push({
      id: 'sym-muscle-weakness',
      name: 'Proximal Muscle Weakness & Morning Lethargy',
      category: 'Energy & General',
      probability: 'Moderate',
      iconName: 'BatteryLow',
      underlyingBiomarkerTrigger: `Low active Vitamin D (Calcitriol) in muscle tissue receptors`,
      physiologicMechanism: 'Deficient Vitamin D receptor signaling in skeletal myocytes, impairing mitochondrial ATP synthesis.',
      isRedFlag: false,
      commonReliefAdvice: 'Resistance training exercises and consistent Vitamin D3 + Magnesium repletion.'
    });
  }

  // 4. VITAMIN B12 DEFICIENCY
  if (vitB12Val !== null && vitB12Val < 250) {
    symptoms.push({
      id: 'sym-tingling-neuropathy',
      name: 'Tingling, Numbness or "Pins & Needles" in Hands & Feet',
      category: 'Head, Eyes & Neuro',
      probability: 'High Likelihood',
      iconName: 'Sparkles',
      underlyingBiomarkerTrigger: `Low Vitamin B12: ${vitB12Val} pg/mL (Optimal >400 pg/mL)`,
      physiologicMechanism: 'Impaired myelin sheath synthesis leading to peripheral nerve fiber irritation.',
      isRedFlag: false,
      commonReliefAdvice: 'Methylcobalamin sublingual supplements, fortified nutritional yeast, eggs, dairy.'
    });

    symptoms.push({
      id: 'sym-brain-fog',
      name: 'Brain Fog, Memory Lapses & Mood Lows',
      category: 'Head, Eyes & Neuro',
      probability: 'Moderate',
      iconName: 'Brain',
      underlyingBiomarkerTrigger: `Vitamin B12 / Homocysteine imbalance`,
      physiologicMechanism: 'Reduced S-adenosylmethionine (SAMe) production affecting central neurotransmitter synthesis.',
      isRedFlag: false,
      commonReliefAdvice: 'Active B-complex support, adequate sleep, and B12 restoration.'
    });
  }

  // 5. HYPERGLYCEMIA (HIGH BLOOD SUGAR / HBA1C)
  if (glucoseVal !== null && glucoseVal > 125) {
    symptoms.push({
      id: 'sym-frequent-urination-thirst',
      name: 'Increased Thirst (Polydipsia) & Frequent Nighttime Urination',
      category: 'Digestive & Abdominal',
      probability: 'High Likelihood',
      iconName: 'Droplet',
      underlyingBiomarkerTrigger: `Elevated blood glucose (${glucoseVal} mg/dL)`,
      physiologicMechanism: 'Renal glucose threshold exceeded (>180 mg/dL), creating osmotic diuresis and fluid loss.',
      isRedFlag: glucoseVal > 250,
      commonReliefAdvice: 'Reduce refined carbohydrates; drink plenty of water; adhere to prescribed glycemic regimen.'
    });
  }

  // 6. LIVER / BILIRUBIN (HEPATIC STRAIN / JAUNDICE)
  if (biliVal !== null && biliVal > 1.5) {
    symptoms.push({
      id: 'sym-jaundice-dark-urine',
      name: 'Yellowish Tint in Eyes (Sclera) & Tea-Colored Urine',
      category: 'Digestive & Abdominal',
      probability: 'High Likelihood',
      iconName: 'Sun',
      underlyingBiomarkerTrigger: `Elevated Serum Bilirubin: ${biliVal} mg/dL (Ref: <1.2 mg/dL)`,
      physiologicMechanism: 'Excess circulating bilirubin depositing in elastin-rich tissues and filtered through kidneys.',
      isRedFlag: true,
      commonReliefAdvice: 'Avoid alcohol and fatty foods; drink coconut water and fresh sugarcane juice; consult hepatologist.'
    });
  }

  // 7. THYROID DYSFUNCTION (HIGH TSH - HYPOTHYROIDISM)
  if (tshVal !== null && tshVal > 4.5) {
    symptoms.push({
      id: 'sym-hypothyroid-cold',
      name: 'Cold Intolerance, Dry Skin & Sluggish Metabolism',
      category: 'Energy & General',
      probability: 'High Likelihood',
      iconName: 'ThermometerSnowflake',
      underlyingBiomarkerTrigger: `Elevated TSH (${tshVal} µIU/mL) indicating thyroid underactivity`,
      physiologicMechanism: 'Reduced basal metabolic rate and reduced cellular oxygen consumption.',
      isRedFlag: false,
      commonReliefAdvice: 'Thyroid hormone replacement (Levothyroxine) under endocrinologist guidance; selenium and zinc support.'
    });
  }

  // 8. CARDIOVASCULAR INFLAMMATION / LIPIDS
  if (cholVal !== null && cholVal > 220) {
    symptoms.push({
      id: 'sym-cardio-heaviness',
      name: 'Post-Meal Sluggishness & Heaviness in Chest after Exertion',
      category: 'Cardio & Respiratory',
      probability: 'Possible',
      iconName: 'HeartPulse',
      underlyingBiomarkerTrigger: `Elevated atherogenic lipid particles (${cholVal} mg/dL)`,
      physiologicMechanism: 'Early endothelial dysfunction and altered microvascular blood viscosity.',
      isRedFlag: false,
      commonReliefAdvice: 'Daily 30-min brisk aerobic walking; Mediterranean diet rich in extra virgin olive oil and walnuts.'
    });
  }

  // Fallback if report is 100% normal
  if (symptoms.length === 0) {
    symptoms.push({
      id: 'sym-vitality-optimal',
      name: 'High Daytime Energy & Restful Sleep',
      category: 'Energy & General',
      probability: 'High Likelihood',
      iconName: 'Sparkles',
      underlyingBiomarkerTrigger: 'All measured metabolic, blood, and vitamin markers within optimal range.',
      physiologicMechanism: 'Balanced cellular ATP production, optimal oxygen delivery, and undisturbed circadian hormones.',
      isRedFlag: false,
      commonReliefAdvice: 'Maintain active physical lifestyle, balanced whole-food diet, and adequate hydration.'
    });
  }

  return symptoms;
}

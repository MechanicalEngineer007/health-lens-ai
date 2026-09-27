import { Biomarker } from '../types/report.ts';
import { 
  InfectiousRiskAssessment, 
  InfectiousDiseaseType, 
  PlateletMonitoringStatus, 
  InfectionRiskLevel 
} from '../types/infectiousDisease.ts';

function findMarker(biomarkers: Biomarker[], keywords: string[]): Biomarker | undefined {
  return biomarkers.find((m) => {
    const name = m.name.toLowerCase();
    return keywords.some((k) => name.includes(k));
  });
}

function getNumericValue(marker?: Biomarker): number | null {
  if (!marker) return null;
  if (typeof marker.value === 'number') return marker.value;
  const parsed = parseFloat(String(marker.value).replace(/[^0-9.]/g, ''));
  return isNaN(parsed) ? null : parsed;
}

export function evaluatePlateletStatus(biomarkers: Biomarker[]): PlateletMonitoringStatus {
  const plateletMarker = findMarker(biomarkers, ['platelet', 'thrombocyte', 'plt']);
  const hctMarker = findMarker(biomarkers, ['hematocrit', 'pcv', 'packed cell volume']);

  const count = getNumericValue(plateletMarker) ?? 220000;
  const hct = getNumericValue(hctMarker);

  let severity: PlateletMonitoringStatus['severity'] = 'Normal (>150,000)';
  let isThrombocytopenia = false;
  let transfusionTriggerWarning = false;

  if (count < 50000) {
    severity = 'Severe / Critical (<50,000)';
    isThrombocytopenia = true;
    transfusionTriggerWarning = true;
  } else if (count < 100000) {
    severity = 'Moderate (50,000 - 100,000)';
    isThrombocytopenia = true;
  } else if (count < 150000) {
    severity = 'Mild (100,000 - 150,000)';
    isThrombocytopenia = true;
  }

  const hemoconcentrationRisk = (hct !== null && hct >= 46);

  return {
    currentCount: count,
    unit: plateletMarker?.unit || '/µL',
    isThrombocytopenia,
    severity,
    hematocritObserved: hct || undefined,
    hemoconcentrationRisk,
    transfusionTriggerWarning
  };
}

export function analyzeInfectiousDiseases(biomarkers: Biomarker[]): InfectiousRiskAssessment[] {
  const results: InfectiousRiskAssessment[] = [];

  // Extract markers
  const platelet = findMarker(biomarkers, ['platelet', 'plt']);
  const plateletVal = getNumericValue(platelet);

  const tlc = findMarker(biomarkers, ['total leukocyte', 'wbc', 'tlc', 'white blood cell']);
  const tlcVal = getNumericValue(tlc);

  const hct = findMarker(biomarkers, ['hematocrit', 'pcv']);
  const hctVal = getNumericValue(hct);

  const hb = findMarker(biomarkers, ['hemoglobin', 'hb']);
  const hbVal = getNumericValue(hb);

  const ast = findMarker(biomarkers, ['ast', 'sgot']);
  const astVal = getNumericValue(ast);

  const alt = findMarker(biomarkers, ['alt', 'sgpt']);
  const altVal = getNumericValue(alt);

  const bilirubin = findMarker(biomarkers, ['bilirubin total', 'total bilirubin']);
  const bilirubinVal = getNumericValue(bilirubin);

  const esr = findMarker(biomarkers, ['esr', 'erythrocyte sedimentation']);
  const esrVal = getNumericValue(esr);

  const crp = findMarker(biomarkers, ['crp', 'c-reactive protein', 'hs-crp']);
  const crpVal = getNumericValue(crp);

  const neutrophils = findMarker(biomarkers, ['neutrophil', 'polymorphs']);
  const neutrophilsVal = getNumericValue(neutrophils);

  const lymphocytes = findMarker(biomarkers, ['lymphocyte']);
  const lymphocytesVal = getNumericValue(lymphocytes);

  // -------------------------------------------------------------
  // 1. DENGUE FEVER & HEMORRHAGIC RISK
  // -------------------------------------------------------------
  let dengueScore = 10;
  const dengueReasons: string[] = [];
  const dengueFindings: InfectiousRiskAssessment['keyLabFindings'] = [];

  if (plateletVal !== null && plateletVal < 50000) {
    dengueScore += 55;
    dengueReasons.push(`Critical thrombocytopenia: Platelet count dropped to ${plateletVal.toLocaleString()} /µL.`);
    dengueFindings.push({
      markerName: 'Platelet Count',
      observedValue: plateletVal.toLocaleString(),
      unit: '/µL',
      diagnosticSignificance: 'Severe platelet nadir typical of active Dengue capillary leak phase.',
      isAlarming: true
    });
  } else if (plateletVal !== null && plateletVal < 100000) {
    dengueScore += 35;
    dengueReasons.push(`Moderate thrombocytopenia: Platelets at ${plateletVal.toLocaleString()} /µL.`);
    dengueFindings.push({
      markerName: 'Platelet Count',
      observedValue: plateletVal.toLocaleString(),
      unit: '/µL',
      diagnosticSignificance: 'Thrombocytopenia indicates viral bone marrow suppression or immune destruction.',
      isAlarming: true
    });
  } else if (plateletVal !== null && plateletVal < 150000) {
    dengueScore += 15;
    dengueReasons.push(`Mild platelet suppression: ${plateletVal.toLocaleString()} /µL.`);
  }

  if (tlcVal !== null && tlcVal < 4000) {
    dengueScore += 25;
    dengueReasons.push(`Leukopenia (Low WBC: ${tlcVal.toLocaleString()} /µL) indicates viral suppression.`);
    dengueFindings.push({
      markerName: 'Total WBC / TLC',
      observedValue: tlcVal.toLocaleString(),
      unit: '/µL',
      diagnosticSignificance: 'Early viral hallmark: bone marrow suppression of granulocytes.',
      isAlarming: false
    });
  }

  if (hctVal !== null && hctVal >= 46) {
    dengueScore += 20;
    dengueReasons.push(`Elevated Hematocrit (${hctVal}%) indicates plasma leakage & hemoconcentration.`);
    dengueFindings.push({
      markerName: 'Hematocrit (PCV)',
      observedValue: hctVal,
      unit: '%',
      diagnosticSignificance: 'Critical indicator of plasma extravasation; requires close fluid therapy.',
      isAlarming: true
    });
  }

  if (astVal !== null && astVal > 80) {
    dengueScore += 10;
    dengueReasons.push(`Hepatic transaminase elevation (AST/SGOT: ${astVal} U/L) common in arboviral infections.`);
  }

  dengueScore = Math.min(98, dengueScore);
  let dengueRisk: InfectionRiskLevel = 'Low / Unlikely';
  if (dengueScore >= 75) dengueRisk = 'High Likelihood';
  else if (dengueScore >= 50) dengueRisk = 'Moderate Concern';
  else if (dengueScore >= 30) dengueRisk = 'Possible / Borderline';

  results.push({
    id: 'dengue',
    name: 'Dengue Fever / Hemorrhagic Assessment',
    pathogenType: 'Viral (Flavivirus / DENV 1-4)',
    transmissionMode: 'Vector-borne (Aedes aegypti / albopictus mosquito)',
    riskLevel: dengueRisk,
    matchScore: dengueScore,
    summary: dengueRisk === 'High Likelihood' 
      ? 'Strong hematological fingerprint of active Dengue infection (Thrombocytopenia + Leukopenia + Hemoconcentration risk).'
      : 'Evaluates platelet kinetics, white cell suppression, and hemoconcentration patterns.',
    clinicalRationale: dengueReasons.length > 0 ? dengueReasons : ['Platelets and leukocyte counts are currently within normal baseline ranges.'],
    keyLabFindings: dengueFindings,
    criticalWarnings: [
      'Warning: Watch for plasma leakage signs — persistent vomiting, severe abdominal pain, sudden lethargy, or mucosal bleeding.',
      'Platelet Nadir Monitoring: Blood count (CBC) must be monitored every 12 to 24 hours during days 3–7 of illness.'
    ],
    contraindications: [
      'STRICTLY AVOID Aspirin, Ibuprofen, Diclofenac, or other NSAIDs (they irreversibly inhibit platelet aggregation and dramatically elevate internal bleeding risk).',
      'Use only Paracetamol / Acetaminophen (under medical dosage guidance) for fever control.'
    ],
    confirmatoryTests: [
      { testName: 'Dengue NS1 Antigen ELISA', turnaroundTime: '2 - 4 Hours', purpose: 'Gold-standard detection during Days 1 to 5 of acute fever.', idealTiming: 'Days 1–5' },
      { testName: 'Dengue IgM / IgG Antibody Panel', turnaroundTime: 'Same Day', purpose: 'Detects seroconversion and secondary infection status.', idealTiming: 'Day 5 onwards' },
      { testName: 'Repeat Complete Blood Count (CBC)', turnaroundTime: '1 - 2 Hours', purpose: 'Serial monitoring of Platelet and Hematocrit curve.', idealTiming: 'Every 12–24h during fever phase' }
    ],
    recommendedSpecialist: 'Infectious Disease Specialist / General Physician',
    immediateActionProtocol: [
      'Aggressive oral fluid hydration: 2.5 - 3 Liters daily (ORS electrolytes, coconut water, clear soups).',
      'Strict bed rest and avoiding intramuscular injections or trauma.',
      'Immediate hospital presentation if platelet count falls below 50,000 /µL or bleeding occurs.'
    ]
  });

  // -------------------------------------------------------------
  // 2. MALARIA (PLASMODIUM VIVAX / FALCIPARUM)
  // -------------------------------------------------------------
  let malariaScore = 10;
  const malariaReasons: string[] = [];
  const malariaFindings: InfectiousRiskAssessment['keyLabFindings'] = [];

  if (plateletVal !== null && plateletVal < 120000) {
    malariaScore += 25;
    malariaReasons.push(`Thrombocytopenia (${plateletVal.toLocaleString()} /µL) is a classic finding in both P. vivax and P. falciparum malaria.`);
  }

  if (bilirubinVal !== null && bilirubinVal > 1.4) {
    malariaScore += 25;
    malariaReasons.push(`Elevated Total Bilirubin (${bilirubinVal} mg/dL) points to intravascular red blood cell hemolysis.`);
    malariaFindings.push({
      markerName: 'Total Bilirubin',
      observedValue: bilirubinVal,
      unit: 'mg/dL',
      diagnosticSignificance: 'Hemolytic breakdown of parasitized erythrocytes releases free heme/bilirubin.',
      isAlarming: true
    });
  }

  if (hbVal !== null && hbVal < 11.0) {
    malariaScore += 20;
    malariaReasons.push(`Low Hemoglobin (${hbVal} g/dL) correlates with accelerated parasitic erythrocyte destruction.`);
  }

  if (esrVal !== null && esrVal > 30) {
    malariaScore += 15;
    malariaReasons.push(`Elevated ESR (${esrVal} mm/hr) reflects acute paroxysmal systemic inflammation.`);
  }

  malariaScore = Math.min(95, malariaScore);
  let malariaRisk: InfectionRiskLevel = 'Low / Unlikely';
  if (malariaScore >= 70) malariaRisk = 'High Likelihood';
  else if (malariaScore >= 45) malariaRisk = 'Moderate Concern';
  else if (malariaScore >= 25) malariaRisk = 'Possible / Borderline';

  results.push({
    id: 'malaria',
    name: 'Malaria (Plasmodium Vivax / Falciparum)',
    pathogenType: 'Protozoan Parasite (Plasmodium species)',
    transmissionMode: 'Vector-borne (Female Anopheles mosquito bite)',
    riskLevel: malariaRisk,
    matchScore: malariaScore,
    summary: malariaRisk === 'High Likelihood'
      ? 'Hemolytic pattern observed with coexisting thrombocytopenia and hyperbilirubinemia.'
      : 'Evaluates hemolytic anemia indicators, platelet drop, and inflammatory sedimentation.',
    clinicalRationale: malariaReasons.length > 0 ? malariaReasons : ['No overt signs of hemolytic anemia or malarial platelet destruction.'],
    keyLabFindings: malariaFindings,
    criticalWarnings: [
      'P. falciparum Risk: Can progress rapidly to cerebral malaria or acute renal failure if untreated.',
      'Check G6PD enzyme level prior to initiating Primaquine radical curative therapy to prevent drug-induced hemolysis.'
    ],
    contraindications: [
      'Do not delay antimalarial therapy once confirmed by microscopic smear or rapid antigen test.'
    ],
    confirmatoryTests: [
      { testName: 'Peripheral Blood Smear (Thick & Thin Smear for MP)', turnaroundTime: '1 - 2 Hours', purpose: 'Direct microscopic visualization of ring trophozoites and species quantification.', idealTiming: 'During febrile chill peak' },
      { testName: 'Malaria Rapid Diagnostic Test (RDT / Pf-Pv Antigen)', turnaroundTime: '20 Minutes', purpose: 'Detects Histidine-Rich Protein II (HRP-2) and pLDH enzymes.', idealTiming: 'Immediate' }
    ],
    recommendedSpecialist: 'Infectious Disease Specialist / Tropical Medicine Expert',
    immediateActionProtocol: [
      'Obtain blood smear during active fever chill spikes for highest parasite yield.',
      'Targeted Artemisinin-based Combination Therapy (ACT) under doctor supervision upon confirmation.'
    ]
  });

  // -------------------------------------------------------------
  // 3. TYPHOID (ENTERIC FEVER / SALMONELLA)
  // -------------------------------------------------------------
  let typhoidScore = 10;
  const typhoidReasons: string[] = [];

  if (tlcVal !== null && (tlcVal < 4500 || (tlcVal >= 4500 && tlcVal <= 6500))) {
    typhoidScore += 25;
    typhoidReasons.push('Relative leukopenia / normal WBC despite high systemic fever (Salmonella enteric hallmark).');
  }

  if (altVal !== null && altVal > 55) {
    typhoidScore += 20;
    typhoidReasons.push(`Transaminitis (ALT: ${altVal} U/L) indicates Typhoid hepatic/reticuloendothelial involvement.`);
  }

  if (crpVal !== null && crpVal > 15) {
    typhoidScore += 20;
    typhoidReasons.push(`Elevated inflammatory CRP (${crpVal} mg/L) indicates active bacteremic response.`);
  }

  typhoidScore = Math.min(90, typhoidScore);
  let typhoidRisk: InfectionRiskLevel = 'Low / Unlikely';
  if (typhoidScore >= 65) typhoidRisk = 'Moderate Concern';
  else if (typhoidScore >= 35) typhoidRisk = 'Possible / Borderline';

  results.push({
    id: 'typhoid',
    name: 'Typhoid & Enteric Fever',
    pathogenType: 'Bacterial (Salmonella enterica serovar Typhi / Paratyphi)',
    transmissionMode: 'Fecal-oral route (Contaminated food or water)',
    riskLevel: typhoidRisk,
    matchScore: typhoidScore,
    summary: 'Evaluates step-ladder fever patterns, relative leukopenia, transaminase elevation, and bacteremic inflammation.',
    clinicalRationale: typhoidReasons.length > 0 ? typhoidReasons : ['Leukocyte and hepatic enzymes show no enteric fever pattern.'],
    keyLabFindings: [],
    criticalWarnings: [
      'Untreated typhoid can lead to intestinal ulceration or perforation in the 3rd week of illness.'
    ],
    contraindications: [
      'Avoid unboiled water, street salads, raw juices, and unpasteurized dairy during recovery.'
    ],
    confirmatoryTests: [
      { testName: 'Blood Culture & Sensitivity (BACTEC)', turnaroundTime: '48 - 72 Hours', purpose: 'Gold-standard diagnostic test in Week 1 of illness.', idealTiming: 'Week 1 of fever' },
      { testName: 'Typhidot IgM / Widal Tube Agglutination Test', turnaroundTime: '4 - 8 Hours', purpose: 'Detects antibodies against Salmonella O and H antigens.', idealTiming: 'After Day 7 of fever' },
      { testName: 'Stool Culture', turnaroundTime: '48 Hours', purpose: 'Identifies gastrointestinal bacterial shedding in Week 2-3.', idealTiming: 'Week 2 onwards' }
    ],
    recommendedSpecialist: 'Gastroenterologist / Infectious Disease Physician',
    immediateActionProtocol: [
      'Drink strictly boiled or packaged mineral water.',
      'Soft, low-fiber, easily digestible bland diet (khichdi, curd rice, boiled potatoes).'
    ]
  });

  // -------------------------------------------------------------
  // 4. ACUTE BACTERIAL INFECTION & SEPSIS RISK
  // -------------------------------------------------------------
  let bacterialScore = 10;
  const bacterialReasons: string[] = [];

  if (tlcVal !== null && tlcVal > 12000) {
    bacterialScore += 40;
    bacterialReasons.push(`Leukocytosis (TLC: ${tlcVal.toLocaleString()} /µL) indicates active pyogenic/bacterial mobilization.`);
  }

  if (neutrophilsVal !== null && neutrophilsVal > 75) {
    bacterialScore += 25;
    bacterialReasons.push(`Neutrophilia (${neutrophilsVal}%) reflects acute bacterial phagocytosis response.`);
  }

  if (crpVal !== null && crpVal > 20) {
    bacterialScore += 25;
    bacterialReasons.push(`Marked CRP elevation (${crpVal} mg/L) signals significant systemic inflammation.`);
  }

  bacterialScore = Math.min(95, bacterialScore);
  let bacterialRisk: InfectionRiskLevel = 'Low / Unlikely';
  if (bacterialScore >= 75) bacterialRisk = 'High Likelihood';
  else if (bacterialScore >= 50) bacterialRisk = 'Moderate Concern';
  else if (bacterialScore >= 30) bacterialRisk = 'Possible / Borderline';

  results.push({
    id: 'bacterial_sepsis',
    name: 'Acute Bacterial Infection & Inflammatory Surge',
    pathogenType: 'Bacterial (Gram-positive / Gram-negative Pyogenic Bacteria)',
    transmissionMode: 'Respiratory, urinary, wound, or systemic entry',
    riskLevel: bacterialRisk,
    matchScore: bacterialScore,
    summary: 'Evaluates neutrophil-driven leukocytosis, acute-phase reactants, and septic inflammatory markers.',
    clinicalRationale: bacterialReasons.length > 0 ? bacterialReasons : ['White cell differential and inflammatory proteins are within resting baselines.'],
    keyLabFindings: [],
    criticalWarnings: [
      'High fever with altered mental status, rapid shallow breathing, or systolic BP < 90 mmHg requires emergency ER evaluation.'
    ],
    contraindications: [
      'Do not self-prescribe arbitrary antibiotic courses without targeted microbiological sensitivity.'
    ],
    confirmatoryTests: [
      { testName: 'Blood Culture & Antimicrobial Sensitivity', turnaroundTime: '48 Hours', purpose: 'Identifies specific bacterial strain and antibiotic susceptibility.', idealTiming: 'Prior to antibiotic start' },
      { testName: 'Serum Procalcitonin (PCT)', turnaroundTime: '2 - 4 Hours', purpose: 'Differentiates severe bacterial sepsis from viral etiologies.', idealTiming: 'Acute phase' },
      { testName: 'Urine Routine & Culture', turnaroundTime: '24 - 48 Hours', purpose: 'Screens for urinary source of bacteremia.', idealTiming: 'Immediate' }
    ],
    recommendedSpecialist: 'Internal Medicine / Critical Care Specialist',
    immediateActionProtocol: [
      'Clinical examination for localized infection focus (lungs, throat, urinary tract, skin).',
      'Targeted antibiotic therapy guided by culture sensitivity.'
    ]
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

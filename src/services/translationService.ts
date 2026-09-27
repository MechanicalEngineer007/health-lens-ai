import { LanguageCode } from '../types/user.ts';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  healthOverview: string;
  biomarkers: string;
  remedies: string;
  assistant: string;
  trends: string;
  cardioRisk: string;
  mealPlan: string;
  medChecker: string;
  switchUser: string;
  addUser: string;
  deleteUser: string;
  offlineEngine: string;
  onlineAi: string;
  cameraScan: string;
  criticalFlag: string;
  borderline: string;
  optimal: string;
  executiveTakeaway: string;
  keyFindings: string;
  dietPlan: string;
  lifestyle: string;
  supplements: string;
  doctorChecklist: string;
  foodsToAdd: string;
  foodsToLimit: string;
  sunlightTiming: string;
  exerciseTitle: string;
  questionsForDoctor: string;
  redFlags: string;
  shareWhatsApp: string;
  listenAudio: string;
  playingAudio: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: 'HealthLens AI',
    appSubtitle: 'Blood Report Analyzer & Evidence-Based Remedies',
    healthOverview: 'Health Overview & Risks',
    biomarkers: 'Biomarkers Matrix',
    remedies: 'Remedies & Doctor Plan',
    assistant: 'AI Health Assistant',
    trends: 'Historical Trends',
    cardioRisk: 'Cardio & Bio-Age',
    mealPlan: '7-Day Meal Plan',
    medChecker: 'Medication Safety',
    switchUser: 'Switch Profile',
    addUser: 'Add Family Member',
    deleteUser: 'Delete Profile Data',
    offlineEngine: 'Offline Engine',
    onlineAi: 'Online Cloud AI',
    cameraScan: 'Camera Scan',
    criticalFlag: 'Critical Attention',
    borderline: 'Borderline Watch',
    optimal: 'Optimal / Healthy',
    executiveTakeaway: 'Executive Clinical Takeaway',
    keyFindings: 'Key Clinical Observations',
    dietPlan: 'Dietary Modifications',
    lifestyle: 'Lifestyle & Habits',
    supplements: 'Supplement Guidelines',
    doctorChecklist: 'Doctor Checklist',
    foodsToAdd: 'Foods to Add & Enjoy',
    foodsToLimit: 'Foods to Limit / Avoid',
    sunlightTiming: 'Sunlight & Circadian Protocol',
    exerciseTitle: 'Targeted Physical Activity',
    questionsForDoctor: 'Questions to Ask Your Doctor',
    redFlags: 'Red Flags / Warning Signs',
    shareWhatsApp: 'Share on WhatsApp',
    listenAudio: 'Listen to Summary',
    playingAudio: 'Playing Voice Audio...'
  },
  hi: {
    appName: 'हेल्थलेन्स एआई (HealthLens AI)',
    appSubtitle: 'ब्लड टेस्ट रिपोर्ट विश्लेषक एवं साक्ष्य-आधारित उपचार',
    healthOverview: 'स्वास्थ्य समीक्षा एवं जोखिम',
    biomarkers: 'बायोमार्कर्स मैट्रिक्स',
    remedies: 'आहार, उपचार एवं डॉक्टर सलाह',
    assistant: 'एआई स्वास्थ्य सहायक',
    trends: 'ऐतिहासिक स्वास्थ्य प्रगति',
    cardioRisk: 'हृदय स्वास्थ्य एवं जैविक आयु',
    mealPlan: '7-दिवसीय भोजन योजना',
    medChecker: 'दवा सुरक्षा जाँच',
    switchUser: 'प्रोफाइल बदलें',
    addUser: 'नया सदस्य जोड़ें',
    deleteUser: 'प्रोफाइल डेटा हटाएं',
    offlineEngine: 'ऑफलाइन इंजन',
    onlineAi: 'क्लाउड एआई',
    cameraScan: 'कैमरा स्कैन',
    criticalFlag: 'गंभीर ध्यान आवश्यक',
    borderline: 'सीमा रेखा (सावधानी)',
    optimal: 'उत्तम / स्वस्थ',
    executiveTakeaway: 'मुख्य चिकित्सीय निष्कर्ष',
    keyFindings: 'प्रमुख नैदानिक अवलोकन',
    dietPlan: 'आहार में बदलाव',
    lifestyle: 'दिनचर्या एवं जीवनशैली',
    supplements: 'सुरक्षित सप्लीमेंट्स',
    doctorChecklist: 'डॉक्टर से पूछने योग्य प्रश्न',
    foodsToAdd: 'आहार में शामिल करने योग्य खाद्य पदार्थ',
    foodsToLimit: 'सीमित करने योग्य / परहेज वाले खाद्य पदार्थ',
    sunlightTiming: 'धूप का समय एवं प्राकृतिक नियम',
    exerciseTitle: 'अनुशंसित शारीरिक व्यायाम',
    questionsForDoctor: 'डॉक्टर से मिलने पर पूछने योग्य सवाल',
    redFlags: 'तत्काल डॉक्टर से मिलने के चेतावनी लक्षण',
    shareWhatsApp: 'व्हाट्सएप पर शेयर करें',
    listenAudio: 'आवाज में सुनें',
    playingAudio: 'रिपोर्ट सुनाई जा रही है...'
  },
  mr: {
    appName: 'हेल्थलेन्स एआय (HealthLens AI)',
    appSubtitle: 'रक्त तपासणी अहवाल विश्लेषक आणि उपचार मार्गदर्शक',
    healthOverview: 'आरोग्य आढावा आणि जोखीम',
    biomarkers: 'बायोमार्कर्स तक्ता',
    remedies: 'आहार, जीवनशैली आणि डॉक्टर योजना',
    assistant: 'एआय आरोग्य सहाय्यक',
    trends: 'मागील अहवाल प्रगती',
    cardioRisk: 'हृदय आरोग्य आणि जैविक वय',
    mealPlan: '७-दिवसीय आहार योजना',
    medChecker: 'औषध सुरक्षा तपासणी',
    switchUser: 'सदस्य बदला',
    addUser: 'नवीन कुटुंब सदस्य जोडा',
    deleteUser: 'माहिती हटवा',
    offlineEngine: 'ऑफलाइन मोड',
    onlineAi: 'क्लाउड एआय',
    cameraScan: 'कॅमेरा स्कॅन',
    criticalFlag: 'तातडीचे लक्ष आवश्यक',
    borderline: 'सावधगिरी पातळी',
    optimal: 'उत्तम / निरोगी',
    executiveTakeaway: 'मुख्य वैद्यकीय निष्कर्ष',
    keyFindings: 'महत्त्वाचे निरीक्षण',
    dietPlan: 'आहारातील बदल',
    lifestyle: 'जीवनशैली आणि सवयी',
    supplements: 'सप्लीमेंट मार्गदर्शक',
    doctorChecklist: 'डॉक्टरांसाठी प्रश्न',
    foodsToAdd: 'खाण्यायोग्य पौष्टिक पदार्थ',
    foodsToLimit: 'टाळायचे किंवा कमी करायचे पदार्थ',
    sunlightTiming: 'सूर्यप्रकाशाची वेळ आणि नियम',
    exerciseTitle: 'नियमित व्यायाम मार्गदर्शक',
    questionsForDoctor: 'डॉक्टरांना प्रत्यक्ष विचारण्याचे प्रश्न',
    redFlags: 'धोक्याची लक्षणे (तातडीने डॉक्टरकडे जा)',
    shareWhatsApp: 'व्हॉट्सॲपवर पाठवा',
    listenAudio: 'आवाजात ऐका',
    playingAudio: 'अहवाल वाचला जात आहे...'
  },
  gu: {
    appName: 'હેલ્થલેન્સ એઆઈ (HealthLens AI)',
    appSubtitle: 'બ્લડ રિપોર્ટ વિશ્લેષક અને ઘરેલુ ઉપચાર માર્ગદર્શિકા',
    healthOverview: 'આરોગ્ય વિહંગાવલોકન',
    biomarkers: 'બાયોમાર્કર્સ મેટ્રિક્સ',
    remedies: 'આહાર અને ડૉક્ટર યોજના',
    assistant: 'એઆઈ આરોગ્ય સહાયક',
    trends: 'રિપોર્ટ ટ્રેન્ડ્સ',
    cardioRisk: 'હૃદય જોખમ અને જૈવિક ઉંમર',
    mealPlan: '૭-દિવસીય ભોજન યોજના',
    medChecker: 'દવા સુરક્ષા તપાસ',
    switchUser: 'પ્રોફાઇલ બદલો',
    addUser: 'નવો સભ્ય ઉમેરો',
    deleteUser: 'ડેટા કાઢી નાખો',
    offlineEngine: 'ઑફલાઇન એન્જિન',
    onlineAi: 'ક્લાઉડ એઆઈ',
    cameraScan: 'કેમેરા સ્કેન',
    criticalFlag: 'ધ્યાન આપવાની જરૂર',
    borderline: 'મધ્યમ સ્તર',
    optimal: 'ઉત્તમ / સ્વસ્થ',
    executiveTakeaway: 'મુખ્ય તબીબી સારાંશ',
    keyFindings: 'મુખ્ય તારણો',
    dietPlan: 'આહાર માર્ગદર્શિકા',
    lifestyle: 'જીવનશૈલી અને આદતો',
    supplements: 'સપ્લીમેન્ટ માહિતી',
    doctorChecklist: 'ડૉક્ટર ચેકલિસ્ટ',
    foodsToAdd: 'ખાવા લાયક પૌષ્ટિક આહાર',
    foodsToLimit: 'મર્યાદિત કરવા લાયક ખોરાક',
    sunlightTiming: 'સૂર્યપ્રકાશનો સમય',
    exerciseTitle: 'શારીરિક કસરત',
    questionsForDoctor: 'ડૉક્ટરને પૂછવા માટેના પ્રશ્નો',
    redFlags: 'ચેતવણીરૂપ લક્ષણો',
    shareWhatsApp: 'વોટ્સએપ પર શેર કરો',
    listenAudio: 'અવાજમાં સાંભળો',
    playingAudio: 'ઓડિયો ચાલી રહ્યો છે...'
  },
  es: {
    appName: 'HealthLens AI',
    appSubtitle: 'Analizador de Análisis de Sangre y Guía de Salud',
    healthOverview: 'Resumen de Salud y Riesgos',
    biomarkers: 'Matriz de Biomarcadores',
    remedies: 'Plan de Remedios y Médico',
    assistant: 'Asistente de Salud IA',
    trends: 'Tendencias Históricas',
    cardioRisk: 'Salud Cardiovascular y Edad Biológica',
    mealPlan: 'Plan de Comidas de 7 Días',
    medChecker: 'Seguridad de Medicamentos',
    switchUser: 'Cambiar Perfil',
    addUser: 'Agregar Miembro Familiar',
    deleteUser: 'Eliminar Datos de Perfil',
    offlineEngine: 'Motor Sin Conexión (Offline)',
    onlineAi: 'IA en la Nube',
    cameraScan: 'Escanear con Cámara',
    criticalFlag: 'Atención Prioritaria',
    borderline: 'Vigilar Límite',
    optimal: 'Óptimo / Saludable',
    executiveTakeaway: 'Conclusión Clínica Ejecutiva',
    keyFindings: 'Observaciones Clínicas Clave',
    dietPlan: 'Modificaciones Dietéticas',
    lifestyle: 'Estilo de Vida y Hábitos',
    supplements: 'Pautas de Suplementación',
    doctorChecklist: 'Lista para su Médico',
    foodsToAdd: 'Alimentos Recomendados',
    foodsToLimit: 'Alimentos a Limitar',
    sunlightTiming: 'Protocolo de Luz Solar',
    exerciseTitle: 'Actividad Física Dirigida',
    questionsForDoctor: 'Preguntas para su Médico',
    redFlags: 'Señales de Alerta Roja',
    shareWhatsApp: 'Compartir en WhatsApp',
    listenAudio: 'Escuchar Resumen de Voz',
    playingAudio: 'Reproduciendo audio...'
  }
};

export function getTranslation(lang: LanguageCode): TranslationDictionary {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
import { UserProfile, UserStoreData, LanguageCode } from '../types/user.ts';
import { AnalysisReport } from '../types/report.ts';
import { sampleReports } from './sampleData.ts';

const USER_STORE_KEY = 'healthlens_multiuser_store_v2';

// Create realistic follow-up report for Priya to showcase historical trend comparison
const priyaFollowUpReport: AnalysisReport = {
  ...sampleReports['priya-jadhav-maxlab'],
  id: 'report-maxlab-priya-followup',
  patientInfo: {
    name: 'Priya Sameer Jadhav',
    age: '36 Years',
    gender: 'Female',
    collectionDate: '18-Dec-2026 07:15 AM',
    labName: 'MAX Lab - Follow-up Re-test'
  },
  overallHealthScore: 92,
  executiveSummary: 'Outstanding clinical progress! Following 12 weeks of prescribed Vitamin D3 therapy and heart-healthy soluble fiber nutrition, Vitamin D has normalized from 6.81 to 34.2 ng/mL (+402% improvement) and LDL Cholesterol has dropped from 135 to 108 mg/dL (-20% reduction). Glycemic, liver, and kidney markers remain optimal.',
  criticalFindings: [
    'Vitamin D3 Normalized: 34.2 ng/mL (Rose from 6.81 ng/mL; entered healthy >30 ng/mL sufficiency zone).',
    'Significant LDL Improvement: 108 mg/dL (Reduced from 135 mg/dL baseline).',
    'Total Cholesterol Normalized: 188 mg/dL (Reduced from 211 mg/dL baseline; now < 200 mg/dL).',
    'Optimal Glycemic & Renal Function: HbA1c 5.0%, Fasting Sugar 82 mg/dL, eGFR > 120 mL/min.'
  ],
  biomarkers: sampleReports['priya-jadhav-maxlab'].biomarkers.map((b) => {
    if (b.id === 'vit-d3') {
      return { ...b, value: 34.2, numericValue: 34.2, status: 'optimal' as const, interpretation: 'Sufficient / Healthy' };
    }
    if (b.id === 'total-chol') {
      return { ...b, value: 188, numericValue: 188, status: 'optimal' as const, interpretation: 'Desirable (< 200)' };
    }
    if (b.id === 'ldl-chol') {
      return { ...b, value: 108, numericValue: 108, status: 'borderline_high' as const, interpretation: 'Near Optimal' };
    }
    return b;
  }),
  conditions: [
    {
      id: 'cond-vit-d-resolved',
      name: 'Resolved Hypovitaminosis D (Maintenance Phase)',
      category: 'Nutritional / Endocrine Status',
      riskLevel: 'low' as const,
      confidence: 96,
      summary: 'Vitamin D has reached healthy sufficiency at 34.2 ng/mL.',
      detailedExplanation: 'Serum 25-OH Vitamin D has entered optimal reference boundaries (>30 ng/mL), supporting immune function and bone density. Shift to daily maintenance (1000-2000 IU) as advised by physician.',
      associatedMarkers: ['25-Hydroxy Vitamin D (Vit D3)'],
      keyRiskFactors: ['Transitioning from high-dose to maintenance dosing']
    }
  ],
  analyzedAt: '2026-12-18T07:15:00.000Z'
};

const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-priya',
    name: 'Priya Jadhav',
    age: 35,
    gender: 'Female',
    bloodGroup: 'B+',
    relationship: 'Self',
    avatarColor: 'from-teal-500 to-emerald-600',
    activeMedications: ['Vitamin D3 60k weekly', 'Omega-3 Fish Oil'],
    createdAt: '2026-09-01T00:00:00.000Z'
  },
  {
    id: 'user-rohan',
    name: 'Rohan Verma',
    age: 29,
    gender: 'Male',
    bloodGroup: 'O+',
    relationship: 'Spouse',
    avatarColor: 'from-blue-500 to-indigo-600',
    activeMedications: ['Ferrous Ascorbate', 'Vitamin B12'],
    createdAt: '2026-08-15T00:00:00.000Z'
  }
];

function getInitialStore(): UserStoreData {
  return {
    users: DEFAULT_USERS,
    activeUserId: 'user-priya',
    userReports: {
      'user-priya': [sampleReports['priya-jadhav-maxlab'], priyaFollowUpReport],
      'user-rohan': [sampleReports['anemia-b12-deficiency']]
    },
    appLanguage: 'en'
  };
}

export function loadUserStore(): UserStoreData {
  try {
    const raw = localStorage.getItem(USER_STORE_KEY);
    if (!raw) {
      const initial = getInitialStore();
      saveUserStore(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !Array.isArray(parsed.users) ||
      parsed.users.length === 0 ||
      !parsed.userReports ||
      typeof parsed.userReports !== 'object'
    ) {
      const initial = getInitialStore();
      saveUserStore(initial);
      return initial;
    }

    // Ensure activeUserId is valid
    if (!parsed.activeUserId || !parsed.users.some((u: any) => u && u.id === parsed.activeUserId)) {
      parsed.activeUserId = parsed.users[0]?.id || DEFAULT_USERS[0].id;
    }

    // Ensure userReports mapping has entries
    parsed.users.forEach((u: any) => {
      if (u && u.id && !Array.isArray(parsed.userReports[u.id])) {
        parsed.userReports[u.id] = [];
      }
    });

    return parsed;
  } catch (err) {
    console.error('Error loading user store, resetting to initial state:', err);
    const initial = getInitialStore();
    try {
      saveUserStore(initial);
    } catch (e) {
      // Ignore in strict environments
    }
    return initial;
  }
}

export function saveUserStore(store: UserStoreData): void {
  try {
    localStorage.setItem(USER_STORE_KEY, JSON.stringify(store));
  } catch (err) {
    console.error('Error saving user store:', err);
  }
}

export function getUsers(): UserProfile[] {
  const store = loadUserStore();
  return (store && Array.isArray(store.users) && store.users.length > 0) ? store.users : DEFAULT_USERS;
}

export function getActiveUser(): UserProfile {
  const store = loadUserStore();
  if (!store || !Array.isArray(store.users) || store.users.length === 0) {
    return DEFAULT_USERS[0];
  }
  const user = store.users.find((u) => u && u.id === store.activeUserId);
  return user || store.users[0] || DEFAULT_USERS[0];
}

export function switchActiveUser(userId: string): UserProfile {
  const store = loadUserStore();
  if (store && Array.isArray(store.users) && store.users.some((u) => u && u.id === userId)) {
    store.activeUserId = userId;
    saveUserStore(store);
  }
  return getActiveUser();
}

export function createUser(profile: Omit<UserProfile, 'id' | 'createdAt'>): UserProfile {
  const store = loadUserStore();
  const newUser: UserProfile = {
    ...profile,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  if (!Array.isArray(store.users)) {
    store.users = [...DEFAULT_USERS];
  }
  if (!store.userReports || typeof store.userReports !== 'object') {
    store.userReports = {};
  }
  store.users.push(newUser);
  store.activeUserId = newUser.id;
  store.userReports[newUser.id] = [];
  saveUserStore(store);
  return newUser;
}

export function updateUser(userId: string, updates: Partial<UserProfile>): UserProfile {
  const store = loadUserStore();
  if (store && Array.isArray(store.users)) {
    const idx = store.users.findIndex((u) => u && u.id === userId);
    if (idx !== -1) {
      store.users[idx] = { ...store.users[idx], ...updates };
      saveUserStore(store);
      return store.users[idx];
    }
  }
  return getActiveUser();
}

export function deleteUserAndData(userId: string): void {
  const store = loadUserStore();
  if (!store || !Array.isArray(store.users)) return;
  
  // Filter out user
  store.users = store.users.filter((u) => u && u.id !== userId);
  if (store.userReports) {
    delete store.userReports[userId];
  }
  
  // If no users left, recreate default
  if (store.users.length === 0) {
    const initial = getInitialStore();
    saveUserStore(initial);
    return;
  }

  // If deleted user was active, switch to first available
  if (store.activeUserId === userId) {
    store.activeUserId = store.users[0].id;
  }
  saveUserStore(store);
}

export function getUserReports(userId?: string): AnalysisReport[] {
  const store = loadUserStore();
  const targetId = userId || (store ? store.activeUserId : 'user-priya');
  if (store && store.userReports && Array.isArray(store.userReports[targetId]) && store.userReports[targetId].length > 0) {
    return store.userReports[targetId];
  }
  return [sampleReports['priya-jadhav-maxlab']];
}

export function saveReportForActiveUser(report: AnalysisReport): void {
  const store = loadUserStore();
  const userId = store.activeUserId || 'user-priya';
  if (!store.userReports) {
    store.userReports = {};
  }
  const existing = store.userReports[userId] || [];
  const filtered = existing.filter((r) => r && r.id !== report.id);
  store.userReports[userId] = [report, ...filtered].slice(0, 30);
  saveUserStore(store);
}

export function deleteReportForUser(userId: string, reportId: string): void {
  const store = loadUserStore();
  if (store && store.userReports && Array.isArray(store.userReports[userId])) {
    store.userReports[userId] = store.userReports[userId].filter((r) => r && r.id !== reportId);
    saveUserStore(store);
  }
}

export function clearAllAppData(): void {
  try {
    localStorage.removeItem(USER_STORE_KEY);
    localStorage.removeItem('healthlens_saved_reports_v1');
    localStorage.removeItem('healthlens_current_report_v1');
  } catch (e) {
    console.error(e);
  }
  const initial = getInitialStore();
  saveUserStore(initial);
}

export function getAppLanguage(): LanguageCode {
  const store = loadUserStore();
  return (store && store.appLanguage) ? store.appLanguage : 'en';
}

export function setAppLanguage(lang: LanguageCode): void {
  const store = loadUserStore();
  if (store) {
    store.appLanguage = lang;
    saveUserStore(store);
  }
}
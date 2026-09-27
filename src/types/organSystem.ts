import { Biomarker, MarkerStatus } from './report.ts';

export type OrganSystemId = 
  | 'heart' 
  | 'liver' 
  | 'kidneys' 
  | 'blood' 
  | 'thyroid' 
  | 'bones' 
  | 'pancreas';

export type SpecialistUrgency = 'Routine / Preventative' | 'Within 2-4 Weeks' | 'Priority Consultation';

export interface SpecialistRecommendation {
  specialistTitle: string;
  department: string;
  urgency: SpecialistUrgency;
  primaryReasons: string[];
  suggestedQuestions: string[];
  suggestedClinicalFollowUps: string[];
  dietaryActionSummary: string;
}

export interface OrganSystemHealth {
  id: OrganSystemId;
  name: string;
  subtitle: string;
  iconName: string;
  healthScore: number; // 0 - 100
  status: 'optimal' | 'attention' | 'critical';
  colorGradient: string;
  badgeBg: string;
  badgeText: string;
  biomarkers: Biomarker[];
  abnormalCount: number;
  specialist: SpecialistRecommendation;
  summary: string;
}

export interface PillReminderItem {
  id: string;
  name: string;
  dose: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  takenToday: boolean;
  notes: string;
}

export interface CalendarRetestEvent {
  id: string;
  title: string;
  description: string;
  daysFromNow: number;
  fastingHoursRequired?: number;
  preparationNotes: string[];
  targetDoctor?: string;
}

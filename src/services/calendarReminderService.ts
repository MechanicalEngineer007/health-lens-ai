import { AnalysisReport } from '../types/report.ts';
import { CalendarRetestEvent } from '../types/organSystem.ts';

export function getRecommendedRetestEvents(report: AnalysisReport): CalendarRetestEvent[] {
  const events: CalendarRetestEvent[] = [];
  const biomarkers = report.biomarkers || [];

  // Check Vitamin D
  const vitD = biomarkers.find(b => b.name.toLowerCase().includes('vit d') || b.name.toLowerCase().includes('vitamin d'));
  if (vitD && (vitD.status === 'low' || vitD.status === 'borderline_low' || vitD.status === 'critical')) {
    events.push({
      id: 'retest-vit-d',
      title: 'Lab Retest: 25-OH Vitamin D3 Follow-Up',
      description: 'Follow-up blood draw to verify Vitamin D3 replenishment after 8-12 weeks of supplementation.',
      daysFromNow: 60,
      fastingHoursRequired: 8,
      preparationNotes: [
        'Overnight fasting of 8 hours recommended.',
        'Take your regular Vitamin D supplement on the day before, but not immediately before the morning blood draw.',
        'Drink 1-2 glasses of water prior to venipuncture for easy hydration.'
      ],
      targetDoctor: 'Orthopedist / Primary Physician'
    });
  }

  // Check Lipids (Cholesterol / Triglycerides)
  const lipid = biomarkers.find(b => 
    b.name.toLowerCase().includes('cholesterol') || 
    b.name.toLowerCase().includes('triglyceride') || 
    b.name.toLowerCase().includes('ldl')
  );
  if (lipid && (lipid.status === 'high' || lipid.status === 'borderline_high' || lipid.status === 'critical')) {
    events.push({
      id: 'retest-lipid-panel',
      title: 'Lab Retest: Fasting Lipid & Cardio Profile',
      description: 'Comprehensive Lipid Profile check to evaluate dietary modifications and cardiovascular risk markers.',
      daysFromNow: 90,
      fastingHoursRequired: 12,
      preparationNotes: [
        'Strict 10-12 hours overnight fasting required (water only).',
        'Avoid heavy fatty meals and alcohol for 24-48 hours before testing.',
        'Avoid strenuous exercise the evening before.'
      ],
      targetDoctor: 'Cardiologist / Preventive Lipidologist'
    });
  }

  // Check Glucose / HbA1c
  const sugar = biomarkers.find(b => 
    b.name.toLowerCase().includes('glucose') || 
    b.name.toLowerCase().includes('hba1c')
  );
  if (sugar && (sugar.status === 'high' || sugar.status === 'borderline_high' || sugar.status === 'critical')) {
    events.push({
      id: 'retest-hba1c-glucose',
      title: 'Lab Retest: HbA1c & Fasting Insulin Check',
      description: '90-day glycemic assessment to measure 3-month average blood glucose control and insulin sensitivity.',
      daysFromNow: 90,
      fastingHoursRequired: 10,
      preparationNotes: [
        '10 hours overnight fasting for glucose measurement.',
        'HbA1c does not require fasting, but fasting is required for the companion glucose test.',
        'Do not skip prescribed morning insulin/metformin unless explicitly instructed by your physician.'
      ],
      targetDoctor: 'Diabetologist / Endocrinologist'
    });
  }

  // Check Liver / LFT
  const liver = biomarkers.find(b => 
    b.name.toLowerCase().includes('alt') || 
    b.name.toLowerCase().includes('ast') || 
    b.name.toLowerCase().includes('sgpt')
  );
  if (liver && (liver.status === 'high' || liver.status === 'borderline_high' || liver.status === 'critical')) {
    events.push({
      id: 'retest-liver-lft',
      title: 'Lab Retest: Liver Function Panel (LFT)',
      description: 'Follow-up liver enzyme panel (ALT, AST, Bilirubin) to monitor hepatic recovery.',
      daysFromNow: 60,
      fastingHoursRequired: 8,
      preparationNotes: [
        '8-10 hours fasting required.',
        'Refrain from alcohol and non-essential hepatotoxic medications prior to testing.'
      ],
      targetDoctor: 'Hepatologist / Gastroenterologist'
    });
  }

  // Fallback annual preventive checkup if no severe abnormalities
  if (events.length === 0) {
    events.push({
      id: 'retest-routine-annual',
      title: 'Annual Comprehensive Preventive Lab Panel',
      description: 'Annual wellness blood screen: CBC, Lipid Panel, HbA1c, LFT, KFT, and Vitamin D3.',
      daysFromNow: 180,
      fastingHoursRequired: 12,
      preparationNotes: [
        '12 hours overnight fasting.',
        'Hydrate with plain water before morning visit.'
      ],
      targetDoctor: 'Primary Care Physician / Internal Medicine'
    });
  }

  return events;
}

export function generateIcsContent(event: CalendarRetestEvent, patientName: string): string {
  const now = new Date();
  const targetDate = new Date(now.getTime() + event.daysFromNow * 24 * 60 * 60 * 1000);
  targetDate.setHours(8, 0, 0, 0); // 8:00 AM
  const endDate = new Date(targetDate.getTime() + 60 * 60 * 1000); // 9:00 AM

  const formatIcsDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const dtStart = formatIcsDate(targetDate);
  const dtEnd = formatIcsDate(endDate);
  const dtStamp = formatIcsDate(now);

  const cleanDescription = [
    `HealthLens AI Follow-Up Schedule for ${patientName}`,
    event.description,
    `Fasting Required: ${event.fastingHoursRequired || 10} Hours`,
    'Preparation Instructions:',
    ...event.preparationNotes.map(n => '- ' + n),
    `Recommended Doctor: ${event.targetDoctor || 'Primary Care'}`
  ].join('\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HealthLens AI//Medical Lab Retest Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:healthlens-${event.id}-${Date.now()}@healthlens.ai`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${cleanDescription.replace(/\n/g, '\\n')}`,
    'LOCATION:Certified Clinical Diagnostic Laboratory / Clinic',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: Lab Retest Tomorrow (${event.fastingHoursRequired || 10}h Fasting Prep)`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

export function downloadIcsFile(event: CalendarRetestEvent, patientName: string): void {
  const content = generateIcsContent(event, patientName);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `HealthLens-Retest-${event.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

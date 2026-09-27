import { AnalysisReport } from '../types/report.ts';

const STORAGE_KEY = 'healthlens_saved_reports_v1';
const CURRENT_REPORT_KEY = 'healthlens_current_report_v1';

export function saveReportToHistory(report: AnalysisReport): void {
  try {
    const existing = getSavedReports();
    const filtered = existing.filter((r) => r.id !== report.id);
    const updated = [report, ...filtered].slice(0, 30); // keep up to 30 reports
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(CURRENT_REPORT_KEY, JSON.stringify(report));
  } catch (err) {
    console.error('Failed to save report to local storage:', err);
  }
}

export function getSavedReports(): AnalysisReport[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to retrieve saved reports:', err);
    return [];
  }
}

export function deleteReportFromHistory(id: string): void {
  try {
    const existing = getSavedReports();
    const filtered = existing.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete report:', err);
  }
}

export function getCachedCurrentReport(): AnalysisReport | null {
  try {
    const data = localStorage.getItem(CURRENT_REPORT_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}
import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Minus, Calendar, CheckCircle2, AlertTriangle, Activity, Sparkles } from 'lucide-react';
import { AnalysisReport, Biomarker } from '../types/report.ts';
import { UserProfile } from '../types/user.ts';

interface HistoricalTrendViewProps {
  user: UserProfile;
  reports: AnalysisReport[];
}

export const HistoricalTrendView: React.FC<HistoricalTrendViewProps> = ({ user, reports }) => {
  if (reports.length < 2) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs text-center space-y-3">
        <Activity className="w-12 h-12 text-teal-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">Historical Trend Requires At Least 2 Reports</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          {user.name} currently has {reports.length} report saved. Upload or analyze a second follow-up blood test to see progress charts and delta percentage improvements.
        </p>
      </div>
    );
  }

  // Sort chronological
  const sortedReports = [...reports].sort((a, b) => new Date(a.analyzedAt).getTime() - new Date(b.analyzedAt).getTime());
  const initialReport = sortedReports[0];
  const latestReport = sortedReports[sortedReports.length - 1];

  // Common Key Markers
  const keyMarkerIds = ['vit-d3', 'ldl-chol', 'total-chol', 'fasting-glucose', 'hba1c', 'hemoglobin', 'sgpt-alt', 'serum-creatinine'];

  const getMarkerFromReport = (rep: AnalysisReport, id: string): Biomarker | undefined => {
    return rep.biomarkers.find((b) => b.id === id || b.id.includes(id) || b.name.toLowerCase().includes(id.replace('-', ' ')));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-['Outfit'] text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            Historical Health Progression for {user.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Comparing Initial Test ({new Date(initialReport.analyzedAt).toLocaleDateString()}) vs Latest Test ({new Date(latestReport.analyzedAt).toLocaleDateString()})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            {reports.length} Blood Tests on Record
          </span>
        </div>
      </div>

      {/* Health Score Timeline Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500 font-semibold">
            <span>Baseline Test ({new Date(initialReport.analyzedAt).toLocaleDateString()})</span>
            <span className="text-[10px] font-mono">{initialReport.patientInfo?.labName || 'Lab 1'}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-['Outfit'] text-slate-800">{initialReport.overallHealthScore}</span>
            <span className="text-slate-400 font-bold">/ 100</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-tight line-clamp-2">{initialReport.executiveSummary}</p>
        </div>

        <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 text-xs space-y-2">
          <div className="flex justify-between items-center text-emerald-800 font-semibold">
            <span>Latest Re-Test ({new Date(latestReport.analyzedAt).toLocaleDateString()})</span>
            <span className="text-[10px] font-mono text-emerald-700">{latestReport.patientInfo?.labName || 'Lab 2'}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-['Outfit'] text-emerald-900">{latestReport.overallHealthScore}</span>
            <span className="text-emerald-700 font-bold">/ 100</span>
            <span className="ml-auto px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 font-bold text-[11px] flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +{latestReport.overallHealthScore - initialReport.overallHealthScore} pts
            </span>
          </div>
          <p className="text-emerald-950 text-[11px] leading-tight line-clamp-2 font-medium">{latestReport.executiveSummary}</p>
        </div>
      </div>

      {/* Biomarker Delta Table */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-teal-600" /> Biomarker Delta & Recovery Metrics:
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Biomarker</th>
                <th className="py-2.5 px-3">Initial Value</th>
                <th className="py-2.5 px-3">Latest Value</th>
                <th className="py-2.5 px-3">Change (Delta)</th>
                <th className="py-2.5 px-3 text-right">Progress Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {keyMarkerIds.map((id) => {
                const initM = getMarkerFromReport(initialReport, id);
                const lateM = getMarkerFromReport(latestReport, id);

                if (!initM || !lateM) return null;

                const v1 = initM.numericValue ?? parseFloat(String(initM.value));
                const v2 = lateM.numericValue ?? parseFloat(String(lateM.value));

                if (isNaN(v1) || isNaN(v2)) return null;

                const diff = Math.round((v2 - v1) * 100) / 100;
                const pct = Math.round(((v2 - v1) / (v1 || 1)) * 100);

                const isVitD = id.includes('vit-d');
                const isLdlOrChol = id.includes('ldl') || id.includes('chol');

                let isPositive = false;
                if (isVitD && diff > 0) isPositive = true;
                else if (isLdlOrChol && diff < 0) isPositive = true;
                else if (diff === 0) isPositive = true;

                return (
                  <tr key={id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      <span>{lateM.name}</span>
                      <span className="block text-[10px] font-normal text-slate-400">{lateM.category}</span>
                    </td>

                    <td className="py-3 px-3 text-slate-600 font-mono">
                      {v1} {initM.unit}
                    </td>

                    <td className="py-3 px-3 font-bold text-slate-900 font-mono">
                      <span className={lateM.status === 'optimal' || lateM.status === 'normal' ? 'text-emerald-700' : 'text-slate-900'}>
                        {v2} {lateM.unit}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                        isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {diff > 0 ? `+${diff}` : `${diff}`} ({pct > 0 ? `+${pct}%` : `${pct}%`})
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      {lateM.status === 'optimal' || lateM.status === 'normal' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Normalized
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3.5 h-3.5" /> Progressing
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
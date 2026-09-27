import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle, Info, Calendar, User, Building, HeartPulse } from 'lucide-react';
import { AnalysisReport } from '../types/report.ts';

interface HealthScoreCardProps {
  report: AnalysisReport;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ report }) => {
  const { overallHealthScore, biomarkers, patientInfo, executiveSummary, criticalFindings } = report;

  const optimalCount = biomarkers.filter((b) => b.status === 'optimal' || b.status === 'normal').length;
  const borderlineCount = biomarkers.filter((b) => b.status === 'borderline_high' || b.status === 'borderline_low').length;
  const criticalCount = biomarkers.filter((b) => b.status === 'critical' || b.status === 'high' || b.status === 'low').length;

  const getScoreColor = (score: number) => {
    if (score >= 85) return { stroke: '#10b981', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Optimal / Healthy' };
    if (score >= 70) return { stroke: '#f59e0b', text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Moderate Attention' };
    return { stroke: '#ef4444', text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', label: 'Priority Attention' };
  };

  const scoreTheme = getScoreColor(overallHealthScore);
  const strokeDashoffset = 283 - (283 * overallHealthScore) / 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Patient Meta Strip */}
      {patientInfo && (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2 font-medium">
            <User className="w-4 h-4 text-teal-600" />
            <span className="text-slate-900 font-bold">{patientInfo.name || 'Anonymous Patient'}</span>
            {patientInfo.age && <span>• {patientInfo.age}</span>}
            {patientInfo.gender && <span>• {patientInfo.gender}</span>}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            {patientInfo.collectionDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> {patientInfo.collectionDate}
              </span>
            )}
            {patientInfo.labName && (
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" /> {patientInfo.labName}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Score & Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Radial Health Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="text-slate-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke={scoreTheme.stroke}
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold font-['Outfit'] text-slate-900 leading-none">
                {overallHealthScore}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 mt-0.5">/ 100</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Health Score</span>
            </div>
          </div>

          <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold border ${scoreTheme.bg} ${scoreTheme.text} ${scoreTheme.border}`}>
            {scoreTheme.label}
          </div>
        </div>

        {/* Breakdown Chips */}
        <div className="md:col-span-8 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-bold">Optimal</span>
              </div>
              <p className="text-xl font-extrabold text-emerald-900">{optimalCount}</p>
              <p className="text-[10px] text-emerald-700 font-medium">Markers Normal</p>
            </div>

            <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
                <Info className="w-4 h-4" />
                <span className="text-xs font-bold">Borderline</span>
              </div>
              <p className="text-xl font-extrabold text-amber-900">{borderlineCount}</p>
              <p className="text-[10px] text-amber-700 font-medium">Watch Closely</p>
            </div>

            <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-rose-600 mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold">Attention</span>
              </div>
              <p className="text-xl font-extrabold text-rose-900">{criticalCount}</p>
              <p className="text-[10px] text-rose-700 font-medium">Requires Action</p>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-slate-50/90 rounded-xl p-4 border border-slate-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-teal-600" /> Executive Clinical Takeaway
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {executiveSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Critical Findings Bullet Grid */}
      {criticalFindings.length > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" /> Key Clinical Observations:
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {criticalFindings.map((finding, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-700 bg-slate-50 hover:bg-slate-100/80 p-2.5 rounded-lg border border-slate-200/60 flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Activity, AlertTriangle, ShieldCheck, Tag, Info, AlertOctagon, Sparkles } from 'lucide-react';
import { ConditionRisk, RiskLevel } from '../types/report.ts';

interface DiseaseInsightsProps {
  conditions: ConditionRisk[];
}

export const DiseaseInsights: React.FC<DiseaseInsightsProps> = ({ conditions }) => {
  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'critical':
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" /> High Attention Required
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Moderate Risk / Monitor
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Low Risk / Optimal
          </span>
        );
    }
  };

  if (conditions.length === 0) {
    return (
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 text-center">
        <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
        <h3 className="text-base font-bold text-emerald-950">No High-Risk Disease Markers Detected</h3>
        <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
          All analyzed markers fall into optimal reference boundaries with no clinical indications of active systemic pathology.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-6">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold font-['Outfit'] text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            Potential Health Conditions & Risk Assessments
          </h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {conditions.length} Condition{conditions.length > 1 ? 's' : ''} Identified
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Multi-marker clinical correlation based on your laboratory parameters
        </p>
      </div>

      <div className="space-y-4">
        {conditions.map((cond) => (
          <div
            key={cond.id}
            className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 space-y-3.5 hover:border-slate-300 transition-all"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                  {cond.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {cond.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {getRiskBadge(cond.riskLevel)}
                <span className="text-[11px] text-slate-500 font-medium bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {cond.confidence}% Match
                </span>
              </div>
            </div>

            {/* Summary */}
            <p className="text-xs sm:text-sm text-slate-700 font-medium bg-white p-3 rounded-lg border border-slate-100 leading-relaxed">
              {cond.summary}
            </p>

            {/* Detailed Explanation */}
            <div className="text-xs text-slate-600 leading-relaxed space-y-1">
              <span className="font-semibold text-slate-800">Clinical Mechanism:</span>
              <p>{cond.detailedExplanation}</p>
            </div>

            {/* Associated Markers */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400" /> Correlated Markers:
              </span>
              {cond.associatedMarkers.map((marker, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60 text-[11px] font-medium"
                >
                  {marker}
                </span>
              ))}
            </div>

            {/* Risk Factors & Complications Grid */}
            {(cond.keyRiskFactors || cond.potentialComplications) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                {cond.keyRiskFactors && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200/60">
                    <span className="font-semibold text-slate-800 block mb-1">Common Contributing Factors:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                      {cond.keyRiskFactors.map((rf, i) => (
                        <li key={i}>{rf}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {cond.potentialComplications && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200/60">
                    <span className="font-semibold text-rose-800 block mb-1">Potential Long-Term Risks:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                      {cond.potentialComplications.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { Heart, Activity, ShieldCheck, Info, Sparkles } from 'lucide-react';
import { AnalysisReport } from '../types/report.ts';
import { UserProfile } from '../types/user.ts';
import { calculateCardioMetabolicMetrics } from '../services/healthCalculators.ts';

interface CardioMetabolicCardProps {
  report: AnalysisReport;
  user: UserProfile;
}

export const CardioMetabolicCard: React.FC<CardioMetabolicCardProps> = ({ report, user }) => {
  const metrics = calculateCardioMetabolicMetrics(report.biomarkers, typeof user.age === 'number' ? user.age : 35);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-['Outfit'] text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600" />
            Cardiovascular Health & Biological Metabolic Age
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Evaluates Atherogenic Index of Plasma (AIP), lipid balance, and biological cellular fitness
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metabolic Age Card */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-5 border border-teal-200/80 text-center space-y-1">
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">Estimated Metabolic Age</span>
          <div className="flex items-baseline justify-center gap-1.5 pt-1">
            <span className="text-4xl font-extrabold font-['Outfit'] text-teal-950">{metrics.estimatedMetabolicAge}</span>
            <span className="text-xs font-semibold text-teal-700">Years</span>
          </div>
          <span className="inline-block text-[11px] font-bold text-teal-800 bg-white/90 px-2.5 py-0.5 rounded-full border border-teal-200">
            Chronological Age: {metrics.chronologicalAge} yrs
          </span>
        </div>

        {/* AIP Score */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-center space-y-1">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Atherogenic Index (AIP)</span>
          <div className="flex items-baseline justify-center gap-1.5 pt-1">
            <span className="text-4xl font-extrabold font-['Outfit'] text-slate-900">{metrics.atherogenicIndex}</span>
          </div>
          <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
            metrics.aipCategory === 'Low Risk'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
              : 'bg-amber-100 text-amber-800 border-amber-200'
          }`}>
            {metrics.aipCategory}
          </span>
        </div>

        {/* Chol / HDL Ratio */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-center space-y-1">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Total / HDL Chol Ratio</span>
          <div className="flex items-baseline justify-center gap-1.5 pt-1">
            <span className="text-4xl font-extrabold font-['Outfit'] text-slate-900">{metrics.cholesterolHdlRatio}</span>
          </div>
          <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
            metrics.ratioCategory === 'Optimal'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
              : 'bg-amber-100 text-amber-800 border-amber-200'
          }`}>
            {metrics.ratioCategory} (&lt; 3.8 Optimal)
          </span>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{metrics.summary}</p>
      </div>
    </div>
  );
};
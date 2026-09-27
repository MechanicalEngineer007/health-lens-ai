import React from 'react';
import { Target } from 'lucide-react';
import { Biomarker } from '../types/report.ts';

interface FunctionalRangeBadgeProps {
  biomarker: Biomarker;
}

export const FunctionalRangeBadge: React.FC<FunctionalRangeBadgeProps> = ({ biomarker }) => {
  const functionalRanges: Record<string, { optLow: number; optHigh: number; note: string }> = {
    'vit d': { optLow: 50, optHigh: 80, note: 'Functional longevity target for immune and bone vitality' },
    'vitamin d': { optLow: 50, optHigh: 80, note: 'Functional longevity target for immune and bone vitality' },
    'hba1c': { optLow: 4.8, optHigh: 5.4, note: 'Strict longevity glycemic target' },
    'fasting glucose': { optLow: 72, optHigh: 88, note: 'Optimal insulin sensitivity window' },
    'triglycerides': { optLow: 50, optHigh: 100, note: 'Cardiovascular longevity threshold' },
    'hdl': { optLow: 55, optHigh: 85, note: 'Optimal cardioprotective level' },
    'ldl': { optLow: 50, optHigh: 90, note: 'Optimal atherogenic prevention' },
    'crp': { optLow: 0.1, optHigh: 0.8, note: 'Zero systemic vascular inflammation goal' },
    'hs-crp': { optLow: 0.1, optHigh: 0.8, note: 'Zero systemic vascular inflammation goal' },
    'tsh': { optLow: 1.0, optHigh: 2.5, note: 'Peak thyroid metabolic efficiency' },
    'alt': { optLow: 10, optHigh: 25, note: 'Optimal hepatic detox capacity' },
    'ast': { optLow: 10, optHigh: 25, note: 'Optimal cellular liver health' },
    'vitamin b12': { optLow: 500, optHigh: 900, note: 'Optimal cognitive and myelin preservation' }
  };

  const key = biomarker.name.toLowerCase().trim();
  const matchedKey = Object.keys(functionalRanges).find(k => key.includes(k));
  if (!matchedKey) return null;

  const target = functionalRanges[matchedKey];
  const numVal = typeof biomarker.value === 'number' ? biomarker.value : parseFloat(String(biomarker.value));
  if (isNaN(numVal)) return null;

  const isOptimal = numVal >= target.optLow && numVal <= target.optHigh;

  return (
    <div className="mt-2 p-2.5 rounded-xl bg-gradient-to-r from-emerald-50/90 to-teal-50/90 border border-teal-200/80 text-[11px] space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-teal-900">
          <Target className="w-3.5 h-3.5 text-teal-600" />
          <span>Functional Longevity Target</span>
        </div>
        <span className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] ${
          isOptimal ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {isOptimal ? 'Optimal Longevity' : 'Sub-Optimal'}
        </span>
      </div>

      <div className="flex items-center justify-between text-slate-600 font-mono text-[10px]">
        <span>Optimal Window: <strong>{target.optLow} - {target.optHigh} {biomarker.unit}</strong></span>
        <span>Standard Lab: {biomarker.refRangeString}</span>
      </div>
      <p className="text-[10px] text-slate-500 italic">{target.note}</p>
    </div>
  );
};

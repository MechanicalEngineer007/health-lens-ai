import React from 'react';
import { AlertOctagon, PhoneCall, Stethoscope, AlertTriangle } from 'lucide-react';
import { Biomarker } from '../types/report.ts';
import { evaluatePlateletStatus } from '../services/infectiousDiseaseService.ts';

interface RedFlagAlertBannerProps {
  biomarkers: Biomarker[];
}

export const RedFlagAlertBanner: React.FC<RedFlagAlertBannerProps> = ({ biomarkers }) => {
  const plateletStatus = evaluatePlateletStatus(biomarkers);
  const criticalBiomarkers = biomarkers.filter(b => b.status === 'critical');

  if (!plateletStatus.transfusionTriggerWarning && criticalBiomarkers.length === 0) {
    return null;
  }

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 text-white shadow-lg border border-rose-500 animate-pulse space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-200 block">Critical Medical Alert</span>
            <h3 className="text-sm sm:text-base font-extrabold">
              {plateletStatus.transfusionTriggerWarning 
                ? `Severe Thrombocytopenia Alert (Platelets: ${plateletStatus.currentCount.toLocaleString()} /µL)`
                : `Urgent Clinical Attention Required (${criticalBiomarkers.length} Critical Markers Flagged)`}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs bg-white text-rose-900 font-extrabold px-3 py-1.5 rounded-xl shadow-xs">
            Consult Physician Immediately
          </span>
        </div>
      </div>

      <p className="text-xs text-rose-100 leading-relaxed">
        {plateletStatus.transfusionTriggerWarning 
          ? 'Platelet counts below 50,000 /µL carry spontaneous mucosal bleeding and plasma leakage risks. Do NOT take Aspirin/Ibuprofen. Visit an emergency medical center for clinical monitoring.'
          : 'One or more laboratory values are significantly out of reference range. Please consult your primary care doctor or appropriate specialist for clinical evaluation.'}
      </p>
    </div>
  );
};

import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export const MedicalDisclaimer: React.FC = () => {
  return (
    <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3.5 sm:p-4 text-xs text-amber-900 flex items-start gap-3 shadow-2xs">
      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="font-semibold text-amber-950">Medical Information & Clinical Safety Disclaimer</p>
        <p className="text-amber-800 leading-relaxed">
          HealthLens AI provides automated analytical interpretations, educational biomarker insights, and general nutritional/lifestyle suggestions based on published clinical guidelines. 
          <strong className="font-medium text-amber-950"> This application is not a substitute for professional medical diagnosis, clinical evaluation, or treatment advice.</strong> Always consult a licensed healthcare physician before starting, stopping, or altering any medication, high-dose supplement, or dietary regimen.
        </p>
      </div>
    </div>
  );
};

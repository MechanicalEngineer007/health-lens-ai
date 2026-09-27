import React, { useState } from 'react';
import { X, ShieldAlert, Pill, CheckCircle, AlertTriangle, Clock, Info } from 'lucide-react';
import { COMMON_MEDICATIONS_DB, checkMedicationInteractions } from '../services/healthCalculators.ts';
import { UserProfile } from '../types/user.ts';

interface MedicationCheckerModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateMedications: (meds: string[]) => void;
}

export const MedicationCheckerModal: React.FC<MedicationCheckerModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateMedications
}) => {
  const [selectedMeds, setSelectedMeds] = useState<string[]>(user.activeMedications || []);

  if (!isOpen) return null;

  const toggleMed = (name: string) => {
    let updated = [...selectedMeds];
    if (updated.includes(name)) {
      updated = updated.filter((m) => m !== name);
    } else {
      updated.push(name);
    }
    setSelectedMeds(updated);
    onUpdateMedications(updated);
  };

  const warnings = checkMedicationInteractions(selectedMeds);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col space-y-4 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-['Outfit'] text-base">
            <Pill className="w-5 h-5 text-indigo-600" />
            Medication & Supplement Safety Checker ({user.name})
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Select any regular prescription medicines you take to check for timing precautions and supplement interactions:
        </p>

        {/* Medicine Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {COMMON_MEDICATIONS_DB.map((med) => {
            const isSelected = selectedMeds.includes(med.name);
            return (
              <button
                key={med.id}
                onClick={() => toggleMed(med.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isSelected ? '✓ ' : '+ '} {med.name}
              </button>
            );
          })}
        </div>

        {/* Warnings & Advice List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 pt-2">
          {warnings.length === 0 ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>No critical supplement interactions detected for your selected prescription medications.</span>
            </div>
          ) : (
            warnings.map((w, idx) => (
              <div key={idx} className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-amber-950 text-sm block">{w.medication.name} ⇄ {w.warning.supplementName}</span>
                    <span className="text-[10px] text-amber-800 uppercase tracking-wider font-bold">Category: {w.medication.category}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold shrink-0">
                    {w.warning.severity}
                  </span>
                </div>

                <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-amber-100">
                  {w.warning.interactionDetails}
                </p>

                <div className="flex items-start gap-1.5 text-amber-900 font-semibold text-[11px] pt-1">
                  <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>Actionable Guidance: {w.warning.actionableAdvice}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
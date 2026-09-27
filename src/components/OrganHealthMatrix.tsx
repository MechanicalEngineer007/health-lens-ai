import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  Activity, 
  Droplet, 
  Shield, 
  Flame, 
  Bone, 
  Zap, 
  Stethoscope, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  HelpCircle,
  Sparkles,
  Calendar
} from 'lucide-react';
import { Biomarker } from '../types/report.ts';
import { OrganSystemHealth, OrganSystemId } from '../types/organSystem.ts';
import { analyzeOrganSystems } from '../services/organHealthService.ts';

interface OrganHealthMatrixProps {
  biomarkers: Biomarker[];
  patientName: string;
  onOpenRetestModal?: () => void;
}

export const OrganHealthMatrix: React.FC<OrganHealthMatrixProps> = ({ 
  biomarkers, 
  patientName,
  onOpenRetestModal
}) => {
  const organSystems = useMemo(() => analyzeOrganSystems(biomarkers), [biomarkers]);
  const [selectedOrganId, setSelectedOrganId] = useState<OrganSystemId>('heart');

  const selectedOrgan = organSystems.find(o => o.id === selectedOrganId) || organSystems[0];

  const getIcon = (name: string) => {
    switch (name) {
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'Droplet': return <Droplet className="w-5 h-5" />;
      case 'Shield': return <Shield className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'Bone': return <Bone className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-['Outfit'] text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            Organ & System Health Map + Specialist Doctor Referrals
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Organ-by-organ clinical status and personalized medical specialist recommendations for <strong className="text-slate-800">{patientName}</strong>
          </p>
        </div>

        {onOpenRetestModal && (
          <button
            onClick={onOpenRetestModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold hover:bg-teal-100 transition-all shadow-2xs self-start sm:self-auto"
          >
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Schedule Follow-Up</span>
          </button>
        )}
      </div>

      {/* Organ Interactive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {organSystems.map((organ) => {
          const isSelected = organ.id === selectedOrganId;
          return (
            <button
              key={organ.id}
              onClick={() => setSelectedOrganId(organ.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-white border-teal-600 ring-2 ring-teal-500/20 shadow-md scale-[1.02]'
                  : 'bg-slate-50/80 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  organ.status === 'optimal'
                    ? 'bg-emerald-100 text-emerald-700'
                    : organ.status === 'attention'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  {getIcon(organ.iconName)}
                </div>

                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                  organ.status === 'optimal'
                    ? 'bg-emerald-100 text-emerald-800'
                    : organ.status === 'attention'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {organ.healthScore}%
                </span>
              </div>

              <p className="text-xs font-bold text-slate-900 truncate">{organ.name.split(' ')[0]}</p>
              <p className="text-[10px] text-slate-500 truncate">
                {organ.abnormalCount > 0 ? `${organ.abnormalCount} Flags` : 'Optimal'}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Organ Detailed Card */}
      <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${selectedOrgan.colorGradient} text-white flex items-center justify-center shadow-md`}>
              {getIcon(selectedOrgan.iconName)}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-['Outfit'] text-slate-900">
                {selectedOrgan.name}
              </h3>
              <p className="text-xs text-slate-500">{selectedOrgan.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${selectedOrgan.badgeBg} ${selectedOrgan.badgeText}`}>
              {selectedOrgan.status === 'optimal' ? 'Healthy & Optimal' : selectedOrgan.status === 'attention' ? 'Moderate Attention' : 'Priority Clinical Action'}
            </span>
          </div>
        </div>

        {/* 2-Column Split: Specialist Doctor on Left, Biomarkers & Follow-ups on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Medical Specialist Referral */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block font-medium">Recommended Specialist:</span>
                    <span className="text-base font-extrabold text-teal-900">{selectedOrgan.specialist.specialistTitle}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Consultation Urgency:</span>
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold inline-block ${
                    selectedOrgan.specialist.urgency === 'Priority Consultation'
                      ? 'bg-rose-100 text-rose-900 border border-rose-200'
                      : selectedOrgan.specialist.urgency === 'Within 2-4 Weeks'
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  }`}>
                    {selectedOrgan.specialist.urgency}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Clinical Reasons for Visiting {selectedOrgan.specialist.specialistTitle}:
                </span>
                <ul className="space-y-1.5">
                  {selectedOrgan.specialist.primaryReasons.map((r, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 mt-1.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                  <HelpCircle className="w-3.5 h-3.5 text-teal-600" /> Questions to Ask the Doctor:
                </span>
                <div className="space-y-2">
                  {selectedOrgan.specialist.suggestedQuestions.map((q, i) => (
                    <div key={i} className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-slate-800">
                      <div className="flex items-start gap-1.5">
                        <span className="font-bold text-teal-700 shrink-0">Q{i + 1}:</span>
                        <span className="font-medium">{q}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Lab Biomarkers & Follow-Up Tests */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Related Lab Biomarkers ({selectedOrgan.biomarkers.length}):
              </span>
              {selectedOrgan.biomarkers.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No direct biomarkers evaluated for this system in current report.</p>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {selectedOrgan.biomarkers.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{m.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Ref: {m.refRangeString} {m.unit}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold font-mono ${m.status === 'optimal' || m.status === 'normal' ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {m.value} {m.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-teal-50/90 p-4 rounded-2xl border border-teal-200 text-xs text-teal-900 space-y-2">
              <span className="font-bold block flex items-center gap-1.5 text-teal-900">
                <Sparkles className="w-4 h-4 text-teal-600" /> Recommended Clinical Follow-Ups:
              </span>
              <ul className="space-y-1.5">
                {selectedOrgan.specialist.suggestedClinicalFollowUps.map((fu, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-teal-800 font-medium">
                    <ChevronRight className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{fu}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

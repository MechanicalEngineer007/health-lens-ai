import React, { useState, useMemo } from 'react';
import { 
  HeartHandshake, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Sparkles, 
  Info, 
  Filter, 
  Activity, 
  HelpCircle,
  Stethoscope,
  TrendingUp,
  Brain,
  Eye,
  Bone,
  Droplet
} from 'lucide-react';
import { Biomarker } from '../types/report.ts';
import { predictPatientSymptoms } from '../services/symptomPredictionService.ts';
import { PredictedSymptom, SymptomCategory } from '../types/symptomPrediction.ts';

interface SymptomCorrelatorProps {
  biomarkers: Biomarker[];
  patientName: string;
}

export const SymptomCorrelator: React.FC<SymptomCorrelatorProps> = ({ biomarkers, patientName }) => {
  const predictedSymptoms = useMemo(() => predictPatientSymptoms(biomarkers), [biomarkers]);
  const [confirmedSymptomIds, setConfirmedSymptomIds] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'Energy & General', 'Head, Eyes & Neuro', 'Joints & Muscles', 'Digestive & Abdominal', 'Skin, Mucosa & Capillaries', 'Cardio & Respiratory'];

  const filteredSymptoms = useMemo(() => {
    if (activeCategory === 'all') return predictedSymptoms;
    return predictedSymptoms.filter(s => s.category === activeCategory);
  }, [predictedSymptoms, activeCategory]);

  const toggleSymptom = (id: string) => {
    setConfirmedSymptomIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Alignment Score: proportion of predicted symptoms confirmed by patient
  const alignmentScore = predictedSymptoms.length > 0 
    ? Math.round((confirmedSymptomIds.size / predictedSymptoms.length) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-['Outfit'] text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-indigo-600" />
            Report-to-Symptom Predictor & Correlator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Physical symptoms <strong className="text-slate-800">{patientName}</strong> is likely experiencing based on lab abnormalities. Check the ones you feel to calculate clinical alignment.
          </p>
        </div>

        {/* Dynamic Alignment Score */}
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200/80 px-3.5 py-2 rounded-xl self-start sm:self-auto">
          <div>
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Clinical Alignment</span>
            <span className="text-base font-black text-indigo-900">{alignmentScore}% Correlated</span>
          </div>
          <div className="text-xs font-semibold text-indigo-800">
            {confirmedSymptomIds.size} of {predictedSymptoms.length} Confirmed
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 pb-1 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat === 'all' ? 'All Body Regions' : cat}
          </button>
        ))}
      </div>

      {/* Symptoms Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredSymptoms.map((symptom) => {
          const isConfirmed = confirmedSymptomIds.has(symptom.id);
          return (
            <div
              key={symptom.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                isConfirmed
                  ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                      symptom.probability === 'High Likelihood'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {symptom.probability}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{symptom.category}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{symptom.name}</h4>
                </div>

                {/* Patient Confirmation Toggle Button */}
                <button
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isConfirmed
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Check if you are experiencing this symptom"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isConfirmed ? 'I Feel This' : 'Confirm'}</span>
                </button>
              </div>

              {/* Underlying Blood Trigger Attribution */}
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  <span>Triggered By: {symptom.underlyingBiomarkerTrigger}</span>
                </div>
                <p className="text-[11px] text-slate-500">{symptom.physiologicMechanism}</p>
              </div>

              {/* Relief Guidance */}
              <div className="text-[11px] text-indigo-900 bg-indigo-50/60 p-2 rounded-lg font-medium flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Relief Advice:</strong> {symptom.commonReliefAdvice}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

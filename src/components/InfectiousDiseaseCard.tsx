import React, { useState } from 'react';
import { 
  Bug, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Activity, 
  Droplet, 
  Stethoscope, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  AlertOctagon, 
  HelpCircle,
  FileCheck2,
  Ban
} from 'lucide-react';
import { Biomarker } from '../types/report.ts';
import { analyzeInfectiousDiseases, evaluatePlateletStatus } from '../services/infectiousDiseaseService.ts';
import { InfectiousRiskAssessment } from '../types/infectiousDisease.ts';

interface InfectiousDiseaseCardProps {
  biomarkers: Biomarker[];
  patientName: string;
}

export const InfectiousDiseaseCard: React.FC<InfectiousDiseaseCardProps> = ({ biomarkers, patientName }) => {
  const infections = analyzeInfectiousDiseases(biomarkers);
  const plateletStatus = evaluatePlateletStatus(biomarkers);
  const [selectedInfectionId, setSelectedInfectionId] = useState<string>(infections[0]?.id || 'dengue');
  const [expandedSection, setExpandedSection] = useState<'tests' | 'warnings' | 'actions'>('tests');

  const selectedInfection = infections.find(i => i.id === selectedInfectionId) || infections[0];

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'High Likelihood':
      case 'Critical Emergency':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'Moderate Concern':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Possible / Borderline':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      default:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-['Outfit'] text-slate-900 flex items-center gap-2">
            <Bug className="w-5 h-5 text-rose-600 animate-pulse" />
            Viral & Infectious Disease Screen (Dengue, Malaria, Typhoid)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automated screening of hematological and inflammatory markers for tropical & viral pathogens in <strong className="text-slate-800">{patientName}</strong>
          </p>
        </div>
      </div>

      {/* PLATELET MONITORING CRITICAL WIDGET */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        plateletStatus.transfusionTriggerWarning
          ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20 shadow-sm'
          : plateletStatus.isThrombocytopenia
          ? 'bg-amber-50 border-amber-300'
          : 'bg-emerald-50/70 border-emerald-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-xs ${
            plateletStatus.transfusionTriggerWarning
              ? 'bg-rose-600 text-white animate-bounce'
              : plateletStatus.isThrombocytopenia
              ? 'bg-amber-500 text-white'
              : 'bg-emerald-600 text-white'
          }`}>
            <Droplet className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Platelet Nadir Monitor:</span>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full border ${getRiskBadgeColor(
                plateletStatus.transfusionTriggerWarning ? 'Critical Emergency' : plateletStatus.isThrombocytopenia ? 'Moderate Concern' : 'Low / Unlikely'
              )}`}>
                {plateletStatus.severity}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black font-mono text-slate-900">
                {plateletStatus.currentCount.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-mono">{plateletStatus.unit}</span>
              {plateletStatus.hematocritObserved && (
                <span className="text-xs font-semibold text-slate-600 ml-2 border-l border-slate-300 pl-2">
                  Hematocrit (PCV): <strong>{plateletStatus.hematocritObserved}%</strong>
                  {plateletStatus.hemoconcentrationRisk && <span className="text-rose-600 font-bold ml-1">(Hemoconcentration Alert)</span>}
                </span>
              )}
            </div>
          </div>
        </div>

        {plateletStatus.transfusionTriggerWarning && (
          <div className="p-3 bg-rose-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 shrink-0" />
            <span>CRITICAL: High bleeding risk. Immediate doctor consultation / hospitalization recommended.</span>
          </div>
        )}
      </div>

      {/* Infection Disease Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {infections.map((inf) => {
          const isSelected = inf.id === selectedInfectionId;
          const isHighRisk = inf.riskLevel === 'High Likelihood' || inf.riskLevel === 'Critical Emergency';
          return (
            <button
              key={inf.id}
              onClick={() => setSelectedInfectionId(inf.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-white border-rose-600 ring-2 ring-rose-500/20 shadow-md scale-[1.02]'
                  : 'bg-slate-50/80 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getRiskBadgeColor(inf.riskLevel)}`}>
                  {inf.riskLevel}
                </span>
                <span className="text-xs font-extrabold font-mono text-slate-700">{inf.matchScore}% Match</span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{inf.name}</h4>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{inf.pathogenType}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Infection Deep-Dive Details */}
      {selectedInfection && (
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-['Outfit'] text-slate-900">
                  {selectedInfection.name}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${getRiskBadgeColor(selectedInfection.riskLevel)}`}>
                  {selectedInfection.riskLevel}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pathogen: <strong>{selectedInfection.pathogenType}</strong> • Transmission: {selectedInfection.transmissionMode}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">Recommended Specialist:</span>
              <span className="text-xs font-extrabold text-teal-800">{selectedInfection.recommendedSpecialist}</span>
            </div>
          </div>

          {/* Clinical Rationale & Findings */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Clinical Findings & Rationale */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Report Biomarker Evidence:
                </span>
                <ul className="space-y-1.5">
                  {selectedInfection.clinicalRationale.map((r, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>

                {/* Contraindicated Medications Warning */}
                {selectedInfection.contraindications.length > 0 && (
                  <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs">
                    <span className="font-extrabold text-rose-900 flex items-center gap-1.5">
                      <Ban className="w-4 h-4 text-rose-600" /> STRICT MEDICAL CONTRAINDICATION:
                    </span>
                    <ul className="space-y-1">
                      {selectedInfection.contraindications.map((c, idx) => (
                        <li key={idx} className="text-rose-800 font-medium">{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Confirmatory Tests & Action Protocol */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-teal-600" /> Gold-Standard Confirmatory Lab Tests:
                </span>

                <div className="space-y-2">
                  {selectedInfection.confirmatoryTests.map((test, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900">{test.testName}</span>
                        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                          {test.turnaroundTime}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{test.purpose}</p>
                      <span className="text-[10px] text-slate-400 block">Best Timing: {test.idealTiming}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Immediate Action Protocol Banner */}
          <div className="p-4 bg-teal-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div>
              <span className="text-xs font-bold text-teal-200 uppercase tracking-wider block">Immediate Care Protocol</span>
              <ul className="text-xs text-teal-100 space-y-1 mt-1">
                {selectedInfection.immediateActionProtocol.map((act, i) => (
                  <li key={i}>• {act}</li>
                ))}
              </ul>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-teal-300 block">Need Doctor Consultation?</span>
              <span className="text-xs font-extrabold text-white">Consult {selectedInfection.recommendedSpecialist.split('/')[0]}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

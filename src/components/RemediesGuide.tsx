import React, { useState } from 'react';
import { Apple, Dumbbell, Pill, Stethoscope, Sun, CheckCircle, XCircle, AlertCircle, HelpCircle, HeartPulse, Clock, Sparkles, Info } from 'lucide-react';
import { AnalysisReport } from '../types/report.ts';

interface RemediesGuideProps {
  remedies: AnalysisReport['remedies'];
}

export const RemediesGuide: React.FC<RemediesGuideProps> = ({ remedies }) => {
  const [activeTab, setActiveTab] = useState<'diet' | 'lifestyle' | 'supplements' | 'doctor'>('diet');
  const { diet, lifestyle, supplements, doctorPlan } = remedies;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold font-['Outfit'] text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          Evidence-Based Remedies & Action Plan
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Personalized nutrition, lifestyle habits, safe supplementation, and physician checklist
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
        <button
          onClick={() => setActiveTab('diet')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'diet'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Apple className="w-4 h-4" /> Dietary Guide
        </button>

        <button
          onClick={() => setActiveTab('lifestyle')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'lifestyle'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Dumbbell className="w-4 h-4" /> Lifestyle & Habits
        </button>

        <button
          onClick={() => setActiveTab('supplements')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'supplements'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Pill className="w-4 h-4" /> Supplement Guidelines
        </button>

        <button
          onClick={() => setActiveTab('doctor')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'doctor'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Stethoscope className="w-4 h-4" /> Doctor Checklist
        </button>
      </div>

      {/* TAB CONTENT: DIET */}
      {activeTab === 'diet' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Beneficial Foods */}
            <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Foods to Add & Enjoy:
              </h3>
              <div className="space-y-3">
                {diet.beneficialFoods.map((bf, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-emerald-100 text-xs">
                    <span className="font-bold text-slate-900 block">{bf.category}</span>
                    <p className="text-emerald-800 font-medium mt-0.5">{bf.items.join(', ')}</p>
                    <p className="text-slate-500 text-[11px] mt-1 italic">{bf.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Foods to Limit */}
            <div className="bg-rose-50/50 border border-rose-200/80 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" /> Foods to Limit / Avoid:
              </h3>
              <div className="space-y-3">
                {diet.foodsToLimit.map((fl, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-rose-100 text-xs">
                    <span className="font-bold text-slate-900 block">{fl.category}</span>
                    <p className="text-rose-800 font-medium mt-0.5">{fl.items.join(', ')}</p>
                    <p className="text-slate-500 text-[11px] mt-1 italic">{fl.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sample Meal Ideas */}
          {diet.mealIdeas.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Targeted Daily Meal Suggestions:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {diet.mealIdeas.map((m, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-teal-800 block text-[11px] uppercase tracking-wide">{m.meal}</span>
                    <p className="text-slate-700 leading-relaxed">{m.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hydration */}
          {diet.hydrationTip && (
            <div className="text-xs text-slate-700 bg-cyan-50/60 p-3 rounded-xl border border-cyan-200/70 flex items-center gap-2">
              <span className="font-bold text-cyan-900">Hydration Tip:</span>
              <span>{diet.hydrationTip}</span>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: LIFESTYLE */}
      {activeTab === 'lifestyle' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Sunlight */}
          {lifestyle.sunlightAndCircadian && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <Sun className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-amber-950 text-sm">Sunlight & Circadian Protocol:</span>
                <p className="text-amber-900 leading-relaxed">{lifestyle.sunlightAndCircadian.recommendation}</p>
                <p className="text-[11px] font-semibold text-amber-800">
                  Target Timing: {lifestyle.sunlightAndCircadian.targetDuration}
                </p>
              </div>
            </div>
          )}

          {/* Exercise Guidance */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-teal-600" /> Targeted Physical Activity:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lifestyle.exerciseGuidance.map((eg, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                  <span className="font-bold text-slate-900 text-sm block">{eg.type}</span>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-medium">
                      Freq: {eg.frequency}
                    </span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-medium">
                      Intensity: {eg.intensity}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] pt-1">{eg.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sleep & Habits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs space-y-2">
              <span className="font-bold text-slate-900 block">Sleep & Stress Management:</span>
              <ul className="space-y-1.5">
                {lifestyle.sleepAndStress.map((ss, i) => (
                  <li key={i} className="text-slate-700 flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 mt-1.5" />
                    <span><strong className="text-slate-900">{ss.habit}:</strong> {ss.benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs space-y-2">
              <span className="font-bold text-rose-900 block">Habits to Limit:</span>
              <ul className="space-y-1.5">
                {lifestyle.habitsToAvoid.map((ha, i) => (
                  <li key={i} className="text-slate-700 flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    <span>{ha}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SUPPLEMENTS */}
      {activeTab === 'supplements' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              <strong>Clinical Supplement Note:</strong> The following OTC and therapeutic compounds are identified based on your specific lab flags. <span className="underline">Always confirm exact dosage with your doctor before starting.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supplements.map((supp, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{supp.name}</h3>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    {supp.evidenceLevel} Evidence
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <p className="text-teal-800 font-semibold">{supp.purpose}</p>
                  {supp.standardDosageRange && (
                    <p className="text-slate-700 bg-slate-50 p-2 rounded-lg font-mono text-[11px] border border-slate-100">
                      Standard Clinical Reference: {supp.standardDosageRange}
                    </p>
                  )}
                  <p className="text-amber-800 text-[11px] italic pt-1">
                    Precaution: {supp.cautionNote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: DOCTOR CHECKLIST */}
      {activeTab === 'doctor' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Header Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-teal-50/70 border border-teal-200 rounded-xl p-4 text-xs">
            <div>
              <span className="text-teal-900 font-bold block text-sm">Recommended Consultation:</span>
              <span className="text-teal-800 font-medium">{doctorPlan.recommendedSpecialist}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-teal-700 text-white font-bold text-xs">
                Urgency: {doctorPlan.urgency}
              </span>
              <span className="text-slate-600 font-medium">
                Retest in: <strong className="text-slate-900">{doctorPlan.recommendedRetestInterval}</strong>
              </span>
            </div>
          </div>

          {/* Questions to Ask Doctor */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-teal-600" /> Specific Questions to Ask Your Physician:
            </h3>
            <div className="space-y-2">
              {doctorPlan.questionsToAsk.map((q, idx) => (
                <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="font-medium pt-0.5">{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Follow up tests */}
          {doctorPlan.suggestedFollowUpTests.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs space-y-2">
              <span className="font-bold text-slate-900 block">Suggested Follow-Up Lab Tests:</span>
              <div className="flex flex-wrap gap-2">
                {doctorPlan.suggestedFollowUpTests.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Red Flags Alert */}
          {doctorPlan.redFlags.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-rose-900 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Red Flags — Seek Immediate Medical Attention If You Experience:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-rose-800 pl-1">
                {doctorPlan.redFlags.map((rf, i) => (
                  <li key={i}>{rf}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

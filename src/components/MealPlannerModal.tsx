import React, { useState } from 'react';
import { X, Calendar, ShoppingCart, Check, Copy, Sparkles, Utensils, Info } from 'lucide-react';
import { Biomarker } from '../types/report.ts';
import { generate7DayMealPlan } from '../services/mealPlannerService.ts';
import { GroceryItem } from '../types/user.ts';

interface MealPlannerModalProps {
  biomarkers: Biomarker[];
  isOpen: boolean;
  onClose: () => void;
}

export const MealPlannerModal: React.FC<MealPlannerModalProps> = ({ biomarkers, isOpen, onClose }) => {
  const [activeDay, setActiveDay] = useState(1);
  const { weekSchedule, groceryList: initialGroceries } = React.useMemo(() => generate7DayMealPlan(biomarkers), [biomarkers]);
  const [groceries, setGroceries] = useState<GroceryItem[]>(initialGroceries);
  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'grocery'>('schedule');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentDayPlan = weekSchedule.find((d) => d.dayNumber === activeDay) || weekSchedule[0];

  const toggleGrocery = (id: string) => {
    setGroceries((prev) =>
      prev.map((g) => (g.id === id ? { ...g, checked: !g.checked } : g))
    );
  };

  const copyGroceryList = () => {
    const text = groceries
      .map((g) => `[${g.checked ? 'X' : ' '}] ${g.name} (${g.quantity || 'Standard'}) - ${g.purpose}`)
      .join('\n');
    navigator.clipboard.writeText(`HealthLens AI - Weekly Grocery Checklist:\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col space-y-4 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-['Outfit'] text-base">
            <Utensils className="w-5 h-5 text-emerald-600" />
            7-Day Personalized Meal & Grocery Planner
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'schedule' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> 7-Day Meal Schedule
          </button>
          <button
            onClick={() => setActiveSubTab('grocery')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'grocery' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Smart Grocery Checklist ({groceries.filter((g) => g.checked).length}/{groceries.length})
          </button>
        </div>

        {/* SUBTAB 1: 7-DAY SCHEDULE */}
        {activeSubTab === 'schedule' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {/* Day Selector Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {weekSchedule.map((d) => (
                <button
                  key={d.dayNumber}
                  onClick={() => setActiveDay(d.dayNumber)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                    activeDay === d.dayNumber
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Day {d.dayNumber}
                </button>
              ))}
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 font-medium">
              <span className="font-bold">{currentDayPlan.dayName}:</span> {currentDayPlan.dailyHealthTip}
            </div>

            <div className="space-y-3">
              {currentDayPlan.meals.map((m, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-800 uppercase tracking-wide text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-100">
                      {m.meal}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {m.keyNutrients.map((n, i) => (
                        <span key={i} className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-medium border border-emerald-200/60">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{m.title}</p>
                  <p className="text-slate-600 leading-relaxed text-xs">{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 2: GROCERY CHECKLIST */}
        {activeSubTab === 'grocery' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Categorized by aisle to save time shopping:</span>
              <button
                onClick={copyGroceryList}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {groceries.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleGrocery(item.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                    item.checked ? 'bg-slate-100/80 border-slate-200 text-slate-400 line-through' : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      item.checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {item.checked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className={`font-semibold ${item.checked ? 'text-slate-400' : 'text-slate-900'}`}>{item.name}</span>
                      {item.quantity && <span className="text-[11px] text-slate-500 ml-1.5">({item.quantity})</span>}
                      <span className="block text-[10px] text-slate-400">{item.purpose}</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
          >
            Close Planner
          </button>
        </div>
      </div>
    </div>
  );
};
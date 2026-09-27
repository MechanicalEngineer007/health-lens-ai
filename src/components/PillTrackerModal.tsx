import React, { useState, useEffect } from 'react';
import { X, Pill, CheckCircle2, Circle, Clock, Plus, Trash2, Sparkles, Award } from 'lucide-react';
import { PillReminderItem } from '../types/organSystem.ts';
import { UserProfile } from '../types/user.ts';

interface PillTrackerModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_SCHEDULE: PillReminderItem[] = [
  { id: '1', name: 'Vitamin D3 (60,000 IU)', dose: '1 Capsule', timeOfDay: 'morning', takenToday: false, notes: 'Take with healthy fat breakfast (eggs/avocado)' },
  { id: '2', name: 'Omega-3 Fish Oil', dose: '1000 mg', timeOfDay: 'morning', takenToday: false, notes: 'Supports lipid profile and heart health' },
  { id: '3', name: 'CoQ10 Ubiquinol', dose: '100 mg', timeOfDay: 'afternoon', takenToday: false, notes: 'Cellular energy and cardiac vitality' },
  { id: '4', name: 'Magnesium Glycinate', dose: '400 mg', timeOfDay: 'evening', takenToday: false, notes: 'Muscle recovery, nervous system & deep sleep' }
];

export const PillTrackerModal: React.FC<PillTrackerModalProps> = ({ user, isOpen, onClose }) => {
  const storageKey = `healthlens_pills_${user.id}`;
  const [pills, setPills] = useState<PillReminderItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : DEFAULT_SCHEDULE;
    } catch {
      return DEFAULT_SCHEDULE;
    }
  });

  const [newPillName, setNewPillName] = useState('');
  const [newPillDose, setNewPillDose] = useState('');
  const [newPillTime, setNewPillTime] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(pills));
    } catch (e) {
      console.warn('Could not save pills to local storage', e);
    }
  }, [pills, storageKey]);

  if (!isOpen) return null;

  const toggleTaken = (id: string) => {
    setPills(prev => prev.map(p => p.id === id ? { ...p, takenToday: !p.takenToday } : p));
  };

  const removePill = (id: string) => {
    setPills(prev => prev.filter(p => p.id !== id));
  };

  const handleAddPill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPillName.trim()) return;

    const newItem: PillReminderItem = {
      id: 'pill-' + Date.now(),
      name: newPillName.trim(),
      dose: newPillDose.trim() || '1 Dose',
      timeOfDay: newPillTime,
      takenToday: false,
      notes: 'Custom regimen'
    };

    setPills(prev => [...prev, newItem]);
    setNewPillName('');
    setNewPillDose('');
  };

  const completedCount = pills.filter(p => p.takenToday).length;
  const compliancePct = pills.length > 0 ? Math.round((completedCount / pills.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col space-y-4 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-['Outfit'] text-base">
            <Pill className="w-5 h-5 text-indigo-600" />
            Supplement & Medication Adherence
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 to-purple-800 text-white flex items-center justify-between shadow-md">
          <div>
            <span className="text-xs text-indigo-200 block font-medium">Today's Regimen for {user.name}</span>
            <h3 className="text-lg font-extrabold">{completedCount} of {pills.length} Doses Taken</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-indigo-100">{compliancePct}%</div>
            <span className="text-[10px] text-indigo-300 uppercase tracking-wider font-semibold">Adherence</span>
          </div>
        </div>

        {/* List of Pills */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {pills.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-6">No medications or supplements in schedule. Add one below!</p>
          ) : (
            pills.map((pill) => (
              <div
                key={pill.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  pill.takenToday ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTaken(pill.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      pill.takenToday
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-slate-300 text-transparent hover:border-indigo-500'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${pill.takenToday ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {pill.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-medium capitalize">
                        {pill.timeOfDay}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">{pill.dose} • {pill.notes}</span>
                  </div>
                </div>

                <button
                  onClick={() => removePill(pill.id)}
                  className="text-slate-300 hover:text-rose-500 p-1"
                  title="Remove from list"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add New Pill Form */}
        <form onSubmit={handleAddPill} className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Supplement / Medicine name..."
            value={newPillName}
            onChange={(e) => setNewPillName(e.target.value)}
            className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
          <input
            type="text"
            placeholder="Dose (e.g. 1 tab)"
            value={newPillDose}
            onChange={(e) => setNewPillDose(e.target.value)}
            className="w-full sm:w-28 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
          <select
            value={newPillTime}
            onChange={(e) => setNewPillTime(e.target.value as any)}
            className="px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          >
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>
    </div>
  );
};

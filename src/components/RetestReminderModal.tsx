import React, { useState } from 'react';
import { X, Calendar, Clock, Download, Sparkles, CheckCircle2, AlertCircle, Stethoscope } from 'lucide-react';
import { AnalysisReport } from '../types/report.ts';
import { CalendarRetestEvent } from '../types/organSystem.ts';
import { getRecommendedRetestEvents, downloadIcsFile } from '../services/calendarReminderService.ts';

interface RetestReminderModalProps {
  report: AnalysisReport;
  isOpen: boolean;
  onClose: () => void;
}

export const RetestReminderModal: React.FC<RetestReminderModalProps> = ({ report, isOpen, onClose }) => {
  const events = getRecommendedRetestEvents(report);
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const patientName = report.patientInfo?.name || 'Patient';
  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];

  const handleDownload = (event: CalendarRetestEvent) => {
    downloadIcsFile(event, patientName);
    setSuccessMsg('.ICS Calendar reminder downloaded! Tap or open it to add to Android, Google, or Apple Calendar.');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col space-y-4 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-['Outfit'] text-base">
            <Calendar className="w-5 h-5 text-teal-600" />
            Automated Lab Retest & Doctor Reminders
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Based on your biomarker flags, HealthLens AI created personalized follow-up test schedules with fasting prep instructions:
        </p>

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Event Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {events.map((e) => (
              <div
                key={e.id}
                onClick={() => setSelectedEventId(e.id)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  activeEvent?.id === e.id
                    ? 'bg-teal-50/90 border-teal-600 ring-2 ring-teal-500/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 truncate">{e.title}</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border text-[10px] font-bold text-teal-800 shrink-0">
                    in {e.daysFromNow} Days
                  </span>
                </div>
                <p className="text-slate-500 line-clamp-2 text-[11px]">{e.description}</p>
              </div>
            ))}
          </div>

          {/* Active Event Details */}
          {activeEvent && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Selected Event</span>
                  <h4 className="text-sm font-extrabold text-slate-900">{activeEvent.title}</h4>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-teal-800 font-bold bg-teal-100 px-2.5 py-1 rounded-md">
                    Fasting: {activeEvent.fastingHoursRequired || 10} Hours
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-1.5">
                <span className="font-bold text-slate-800 block">Preparation Instructions for Accurate Results:</span>
                <ul className="space-y-1">
                  {activeEvent.preparationNotes.map((n, i) => (
                    <li key={i} className="text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 mt-1.5" />
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200">
                <span className="text-[11px] text-slate-500">
                  Recommended Doctor: <strong className="text-slate-800">{activeEvent.targetDoctor || 'Primary Care'}</strong>
                </span>

                <button
                  onClick={() => handleDownload(activeEvent)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-teal-700/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .ICS Calendar Invite</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

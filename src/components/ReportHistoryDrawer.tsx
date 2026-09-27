import React from 'react';
import { X, History, Trash2, Calendar, User, HeartPulse, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { AnalysisReport } from '../types/report.ts';
import { getSavedReports, deleteReportFromHistory } from '../services/storageService.ts';

interface ReportHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReport: (report: AnalysisReport) => void;
  currentReportId: string;
}

export const ReportHistoryDrawer: React.FC<ReportHistoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectReport,
  currentReportId
}) => {
  const [reports, setReports] = React.useState<AnalysisReport[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setReports(getSavedReports());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteReportFromHistory(id);
    setReports(getSavedReports());
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slideLeft">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-['Outfit'] text-base">
            <History className="w-5 h-5 text-teal-600" />
            <span>Saved Blood Reports ({reports.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2 text-xs">
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-600">No Saved Reports Yet</p>
              <p>Uploaded or analyzed reports will be saved locally on your device.</p>
            </div>
          ) : (
            reports.map((rep) => {
              const isSelected = rep.id === currentReportId;
              const dateStr = new Date(rep.analyzedAt).toLocaleDateString();

              return (
                <div
                  key={rep.id}
                  onClick={() => {
                    onSelectReport(rep);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-teal-50/80 border-teal-300 ring-2 ring-teal-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 text-xs truncate max-w-[200px]">
                      {rep.patientInfo?.name || 'Blood Test Report'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Score: {rep.overallHealthScore}/100
                      </span>
                      <button
                        onClick={(e) => handleDelete(e, rep.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete Report"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {dateStr}
                    </span>
                    <span>{rep.biomarkers.length} Biomarkers</span>
                  </div>

                  {rep.criticalFindings && rep.criticalFindings.length > 0 && (
                    <p className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-lg border border-slate-100 line-clamp-2">
                      {rep.criticalFindings[0]}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Reports are stored locally in your device's private offline storage.</span>
        </div>
      </div>
    </div>
  );
};
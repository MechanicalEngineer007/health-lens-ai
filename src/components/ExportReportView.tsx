import React from 'react';
import { AnalysisReport } from '../types/report.ts';

interface ExportReportViewProps {
  report: AnalysisReport | null;
}

export const ExportReportView: React.FC<ExportReportViewProps> = ({ report }) => {
  if (!report) return null;

  return (
    <div className="hidden print:block p-8 bg-white text-slate-900 space-y-6 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="border-b-2 border-teal-700 pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-teal-900">HealthLens AI - Clinical Laboratory Summary</h1>
          <p className="text-xs text-slate-500">Comprehensive Biomarker Analysis & Evidence-Based Remedies</p>
        </div>
        <div className="text-right text-xs">
          <p className="font-bold">Health Score: {report.overallHealthScore}/100</p>
          <p className="text-slate-500">Date: {new Date(report.analyzedAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Patient Info */}
      {report.patientInfo && (
        <div className="bg-slate-50 p-3 rounded border text-xs grid grid-cols-2 gap-2">
          <p><strong>Patient Name:</strong> {report.patientInfo.name || 'N/A'}</p>
          <p><strong>Age/Gender:</strong> {report.patientInfo.age || ''} / {report.patientInfo.gender || ''}</p>
          <p><strong>Collection Date:</strong> {report.patientInfo.collectionDate || 'N/A'}</p>
          <p><strong>Laboratory:</strong> {report.patientInfo.labName || 'N/A'}</p>
        </div>
      )}

      {/* Executive Summary */}
      <div>
        <h2 className="text-sm font-bold uppercase text-teal-800 border-b pb-1 mb-2">Executive Summary</h2>
        <p className="text-xs text-slate-700 leading-relaxed">{report.executiveSummary}</p>
      </div>

      {/* Critical Findings */}
      <div>
        <h2 className="text-sm font-bold uppercase text-teal-800 border-b pb-1 mb-2">Key Clinical Findings</h2>
        <ul className="list-disc list-inside text-xs space-y-1 text-slate-800">
          {report.criticalFindings.map((cf, i) => (
            <li key={i}>{cf}</li>
          ))}
        </ul>
      </div>

      {/* Identified Conditions */}
      <div>
        <h2 className="text-sm font-bold uppercase text-teal-800 border-b pb-1 mb-2">Identified Conditions & Risks</h2>
        <div className="space-y-2">
          {report.conditions.map((c) => (
            <div key={c.id} className="text-xs border p-2 rounded">
              <div className="flex justify-between font-bold">
                <span>{c.name}</span>
                <span className="uppercase text-rose-700">[{c.riskLevel} Risk]</span>
              </div>
              <p className="text-slate-600 mt-0.5">{c.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

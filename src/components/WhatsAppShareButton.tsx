import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { AnalysisReport } from '../types/report.ts';

interface WhatsAppShareButtonProps {
  report: AnalysisReport | null;
}

export const WhatsAppShareButton: React.FC<WhatsAppShareButtonProps> = ({ report }) => {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const handleShare = () => {
    const patientName = report.patientInfo?.name || 'Patient';
    const message = `📋 *HealthLens AI - Clinical Laboratory Summary*
👤 *Patient:* ${patientName}
📊 *Health Score:* ${report.overallHealthScore}/100

🔍 *Key Findings:*
${report.criticalFindings.map((f) => `• ${f}`).join('\n')}

🩺 *Executive Summary:*
${report.executiveSummary}

❓ *Questions for Doctor Visit:*
${report.remedies.doctorPlan.questionsToAsk.slice(0, 2).map((q, i) => `${i + 1}. ${q}`).join('\n')}

_Generated via HealthLens AI Offline Health Platform_`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;

    const win = window.open(whatsappUrl, '_blank');
    if (!win) {
      navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-all"
      title="Share formatted clinical card on WhatsApp"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
      <span>{copied ? 'Card Copied!' : 'WhatsApp Share'}</span>
    </button>
  );
};

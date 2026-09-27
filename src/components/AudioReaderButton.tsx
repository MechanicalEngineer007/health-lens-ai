import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { AnalysisReport } from '../types/report.ts';
import { LanguageCode } from '../types/user.ts';

interface AudioReaderButtonProps {
  report: AnalysisReport | null;
  language: LanguageCode;
}

export const AudioReaderButton: React.FC<AudioReaderButtonProps> = ({ report, language }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!report) return null;

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech audio is not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const patientName = report.patientInfo?.name || 'Patient';
    const textToRead = `Clinical health report summary for ${patientName}. Overall health score is ${report.overallHealthScore} out of 100. ${report.executiveSummary}. Key observations: ${report.criticalFindings.join('. ')}.`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <button
      onClick={toggleSpeech}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-2xs ${
        isPlaying
          ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
          : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200/80'
      }`}
      title="Listen to audio voice summary"
    >
      {isPlaying ? <VolumeX className="w-3.5 h-3.5 text-rose-600" /> : <Volume2 className="w-3.5 h-3.5 text-teal-600" />}
      <span>{isPlaying ? 'Stop Voice' : 'Listen Voice'}</span>
    </button>
  );
};

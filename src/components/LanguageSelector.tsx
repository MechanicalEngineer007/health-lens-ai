import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LanguageCode } from '../types/user.ts';

interface LanguageSelectorProps {
  currentLang: LanguageCode;
  onLanguageChanged: (lang: LanguageCode) => void;
}

const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'es', label: 'Español (Spanish)', flag: '🇪🇸' }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onLanguageChanged }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all text-xs font-semibold text-slate-700 shadow-2xs"
        title="Switch Interface & Remedies Language"
      >
        <span>{activeObj.flag}</span>
        <span className="hidden sm:inline">{activeObj.label.split(' ')[0]}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-xl border border-slate-200 z-50 p-1.5 space-y-0.5 animate-scaleUp">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                onLanguageChanged(l.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all ${
                currentLang === l.code ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </span>
              {currentLang === l.code && <Check className="w-3.5 h-3.5 text-teal-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
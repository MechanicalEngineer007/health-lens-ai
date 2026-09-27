import React, { useState, useEffect } from 'react';
import { X, Key, Check, Shield, ExternalLink } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey, clearStoredApiKey } from '../services/geminiService.ts';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeyUpdated }) => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setStoredApiKey(apiKey.trim());
    } else {
      clearStoredApiKey();
    }
    setSaved(true);
    onKeyUpdated();
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleClear = () => {
    clearStoredApiKey();
    setApiKey('');
    setSaved(true);
    onKeyUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scaleUp">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-['Outfit'] text-base">
            <Key className="w-5 h-5 text-teal-600" />
            Gemini API Configuration
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Provide your Google Gemini API Key to enable live multimodal analysis of any uploaded blood test PDF or image report.
        </p>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Google Gemini API Key:
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Key is stored securely only inside your local browser storage.</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-600 hover:underline font-medium"
              >
                Clear Key
              </button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-xs flex items-center gap-1.5"
              >
                {saved ? <Check className="w-4 h-4 text-emerald-300" /> : null}
                {saved ? 'Saved!' : 'Save Key'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

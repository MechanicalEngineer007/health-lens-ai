import React from 'react';
import { 
  Activity, 
  Key, 
  Printer, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  History, 
  Utensils, 
  Pill, 
  Camera, 
  Calendar, 
  ShieldCheck,
  Bug,
  HeartHandshake
} from 'lucide-react';
import { UserProfileSelector } from './UserProfileSelector.tsx';
import { LanguageSelector } from './LanguageSelector.tsx';
import { AudioReaderButton } from './AudioReaderButton.tsx';
import { WhatsAppShareButton } from './WhatsAppShareButton.tsx';
import { UserProfile, LanguageCode } from '../types/user.ts';
import { AnalysisReport } from '../types/report.ts';
import { getTranslation } from '../services/translationService.ts';

interface NavbarProps {
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  onOpenHistory: () => void;
  onPrintReport: () => void;
  onOpenMealPlanner: () => void;
  onOpenMedChecker: () => void;
  onOpenCameraScanner: () => void;
  onOpenRetestReminders: () => void;
  onOpenPillTracker: () => void;
  onOpenVaultBackup: () => void;
  onSelectInfectionsTab: () => void;
  onSelectSymptomsTab: () => void;
  onUserChanged: (user: UserProfile) => void;
  onOpenDeleteModal: (user: UserProfile) => void;
  report: AnalysisReport | null;
  activeLanguage: LanguageCode;
  onLanguageChanged: (lang: LanguageCode) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenApiKeyModal,
  hasApiKey,
  isOfflineMode,
  onToggleOfflineMode,
  onOpenHistory,
  onPrintReport,
  onOpenMealPlanner,
  onOpenMedChecker,
  onOpenCameraScanner,
  onOpenRetestReminders,
  onOpenPillTracker,
  onOpenVaultBackup,
  onSelectInfectionsTab,
  onSelectSymptomsTab,
  onUserChanged,
  onOpenDeleteModal,
  report,
  activeLanguage,
  onLanguageChanged,
  savedCount
}) => {
  const t = getTranslation(activeLanguage);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo & User Switcher */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-['Outfit'] bg-gradient-to-r from-slate-900 via-teal-900 to-emerald-700 bg-clip-text text-transparent">
                HealthLens AI
              </span>
              <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
                <Sparkles className="w-3 h-3 text-teal-600" /> Multi-User Health
              </span>
            </div>
          </div>

          <div className="hidden sm:block border-l border-slate-200 pl-3">
            <UserProfileSelector
              onUserChanged={onUserChanged}
              onOpenDeleteModal={onOpenDeleteModal}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile User Profile */}
          <div className="sm:hidden">
            <UserProfileSelector
              onUserChanged={onUserChanged}
              onOpenDeleteModal={onOpenDeleteModal}
            />
          </div>

          {/* If report is analyzed, show quick navigation shortcuts */}
          {report && (
            <>
              <button
                onClick={onSelectInfectionsTab}
                className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100 transition-all shadow-2xs"
                title="Dengue, Malaria & Viral Infection Screening"
              >
                <Bug className="w-3.5 h-3.5 text-rose-600" />
                <span>Infections</span>
              </button>

              <button
                onClick={onSelectSymptomsTab}
                className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100 transition-all shadow-2xs"
                title="Report-to-Symptom Predictor"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
                <span>Symptoms</span>
              </button>
            </>
          )}

          {/* Quick Action: Camera Scan */}
          <button
            onClick={onOpenCameraScanner}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100 transition-all shadow-2xs"
            title="Scan Paper Lab Report with Camera"
          >
            <Camera className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">Scan</span>
          </button>

          {/* Quick Action: Pill Tracker */}
          <button
            onClick={onOpenPillTracker}
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 transition-all shadow-2xs"
            title="Supplement & Medication Adherence Checklist"
          >
            <Pill className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden lg:inline">Pills</span>
          </button>

          {/* Quick Action: Encrypted Vault */}
          <button
            onClick={onOpenVaultBackup}
            className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-700 border border-slate-300 hover:bg-slate-100 transition-all shadow-2xs"
            title="Encrypted Backup & Restore (.healthvault)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Vault</span>
          </button>

          {/* Language Switcher */}
          <LanguageSelector
            currentLang={activeLanguage}
            onLanguageChanged={onLanguageChanged}
          />

          {/* Audio Voice Reader (only when report is analyzed) */}
          <AudioReaderButton report={report} language={activeLanguage} />

          {/* WhatsApp Share (only when report is analyzed) */}
          <WhatsAppShareButton report={report} />

          {/* Offline / Online Mode Toggle */}
          <button
            onClick={onToggleOfflineMode}
            className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              isOfflineMode
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-cyan-50 text-cyan-800 border-cyan-300 hover:bg-cyan-100'
            }`}
            title="Toggle between 100% Offline and Online Cloud AI"
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.offlineEngine}</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
                <span>{t.onlineAi}</span>
              </>
            )}
          </button>

          {/* Saved History */}
          <button
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all shadow-2xs"
            title="View Saved Reports for Active User"
          >
            <History className="w-4 h-4 text-teal-600" />
            <span className="hidden xl:inline">Saved</span>
            {savedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-extrabold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Print PDF (when report analyzed) */}
          {report && (
            <button
              onClick={onPrintReport}
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all shadow-2xs"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>PDF</span>
            </button>
          )}

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-2xs ${
              hasApiKey
                ? 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                : 'bg-teal-700 text-white hover:bg-teal-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{hasApiKey ? 'Key Set' : 'API Key'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

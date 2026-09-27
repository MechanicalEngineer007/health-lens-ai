import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar.tsx';
import { MedicalDisclaimer } from './components/MedicalDisclaimer.tsx';
import { FileUploader } from './components/FileUploader.tsx';
import { HealthScoreCard } from './components/HealthScoreCard.tsx';
import { BiomarkerTable } from './components/BiomarkerTable.tsx';
import { DiseaseInsights } from './components/DiseaseInsights.tsx';
import { RemediesGuide } from './components/RemediesGuide.tsx';
import { ReportChatBot } from './components/ReportChatBot.tsx';
import { ApiKeyModal } from './components/ApiKeyModal.tsx';
import { ExportReportView } from './components/ExportReportView.tsx';
import { ReportHistoryDrawer } from './components/ReportHistoryDrawer.tsx';
import { HistoricalTrendView } from './components/HistoricalTrendView.tsx';
import { CardioMetabolicCard } from './components/CardioMetabolicCard.tsx';
import { MealPlannerModal } from './components/MealPlannerModal.tsx';
import { MedicationCheckerModal } from './components/MedicationCheckerModal.tsx';
import { DeleteAccountModal } from './components/DeleteAccountModal.tsx';
import { OrganHealthMatrix } from './components/OrganHealthMatrix.tsx';
import { CameraScannerModal } from './components/CameraScannerModal.tsx';
import { RetestReminderModal } from './components/RetestReminderModal.tsx';
import { PillTrackerModal } from './components/PillTrackerModal.tsx';
import { BackupRestoreModal } from './components/BackupRestoreModal.tsx';
import { InfectiousDiseaseCard } from './components/InfectiousDiseaseCard.tsx';
import { SymptomCorrelator } from './components/SymptomCorrelator.tsx';
import { RedFlagAlertBanner } from './components/RedFlagAlertBanner.tsx';
import { sampleReports } from './services/sampleData.ts';
import { analyzeReportWithGemini, getStoredApiKey } from './services/geminiService.ts';
import {
  getActiveUser,
  getUserReports,
  saveReportForActiveUser,
  deleteUserAndData,
  clearAllAppData,
  getAppLanguage,
  setAppLanguage,
  updateUser
} from './services/userService.ts';
import { AnalysisReport } from './types/report.ts';
import { UserProfile, LanguageCode } from './types/user.ts';
import { getTranslation } from './services/translationService.ts';
import { 
  Activity, 
  MessageSquare, 
  Layers, 
  TrendingUp, 
  Heart, 
  Sparkles, 
  Utensils, 
  Pill, 
  WifiOff, 
  Stethoscope, 
  Camera, 
  Calendar, 
  ShieldCheck,
  Bug,
  HeartHandshake,
  FileSearch,
  UploadCloud,
  CheckCircle2,
  RefreshCw,
  XCircle
} from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => getActiveUser());
  const [activeLanguage, setActiveLanguageState] = useState<LanguageCode>(() => getAppLanguage());
  const [userReports, setUserReports] = useState<AnalysisReport[]>(() => getUserReports());
  
  // Initialize currentReport: only set if user already has an existing saved report in memory
  const [currentReport, setCurrentReport] = useState<AnalysisReport | null>(() => {
    const existing = getUserReports();
    return (existing && existing.length > 0) ? existing[0] : null;
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isRetestModalOpen, setIsRetestModalOpen] = useState(false);
  const [isPillModalOpen, setIsPillModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [deleteModalUser, setDeleteModalUser] = useState<UserProfile | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'infections' | 'symptoms' | 'organ-map' | 'biomarkers' | 'trends' | 'cardio' | 'remedies' | 'chat'>('overview');

  const t = getTranslation(activeLanguage);

  useEffect(() => {
    setHasApiKey(Boolean(getStoredApiKey()));
    if (currentUser && currentUser.id) {
      refreshReportsForUser(currentUser.id);
    }
  }, []);

  const refreshReportsForUser = (userId: string) => {
    const reps = getUserReports(userId);
    setUserReports(reps);
    if (reps && reps.length > 0) {
      setCurrentReport(reps[0]);
    } else {
      setCurrentReport(null);
    }
  };

  const handleUserChanged = (newUser: UserProfile) => {
    setCurrentUser(newUser);
    refreshReportsForUser(newUser.id);
    setActiveTab('overview');
  };

  const handleLanguageChanged = (lang: LanguageCode) => {
    setActiveLanguageState(lang);
    setAppLanguage(lang);
  };

  const handleTriggerAnalysis = async (
    fileData?: { base64: string; mimeType: string; name: string },
    textContent?: string,
    sampleKey?: string
  ) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeReportWithGemini(fileData, textContent, sampleKey, isOfflineMode);
      if (result.patientInfo && currentUser) {
        result.patientInfo.name = currentUser.name;
      }
      setCurrentReport(result);
      saveReportForActiveUser(result);
      refreshReportsForUser(currentUser.id);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      setActiveTab('overview');
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearCurrentAnalysis = () => {
    setCurrentReport(null);
    setActiveTab('overview');
  };

  const handleConfirmDeleteUser = (userId: string) => {
    deleteUserAndData(userId);
    const newActive = getActiveUser();
    setCurrentUser(newActive);
    refreshReportsForUser(newActive.id);
  };

  const handleConfirmClearAll = () => {
    clearAllAppData();
    const newActive = getActiveUser();
    setCurrentUser(newActive);
    refreshReportsForUser(newActive.id);
  };

  const handleUpdateMedications = (meds: string[]) => {
    const updated = updateUser(currentUser.id, { activeMedications: meds });
    setCurrentUser(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-teal-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={hasApiKey}
        isOfflineMode={isOfflineMode}
        onToggleOfflineMode={() => setIsOfflineMode(!isOfflineMode)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onPrintReport={() => window.print()}
        onOpenMealPlanner={() => setIsMealModalOpen(true)}
        onOpenMedChecker={() => setIsMedModalOpen(true)}
        onOpenCameraScanner={() => setIsCameraModalOpen(true)}
        onOpenRetestReminders={() => setIsRetestModalOpen(true)}
        onOpenPillTracker={() => setIsPillModalOpen(true)}
        onOpenVaultBackup={() => setIsVaultModalOpen(true)}
        onSelectInfectionsTab={() => setActiveTab('infections')}
        onSelectSymptomsTab={() => setActiveTab('symptoms')}
        onUserChanged={handleUserChanged}
        onOpenDeleteModal={(u) => setDeleteModalUser(u)}
        report={currentReport}
        activeLanguage={activeLanguage}
        onLanguageChanged={handleLanguageChanged}
        savedCount={userReports.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* ========================================================================= */}
        {/* CASE 1: REPORT IS ANALYZED -> SHOW WARNINGS & FULL DIAGNOSTIC FEATURES   */}
        {/* ========================================================================= */}
        {currentReport ? (
          <>
            {/* Critical Red-Flag Warning Banner (Triggered only when critical markers exist) */}
            <RedFlagAlertBanner biomarkers={currentReport.biomarkers} />

            {/* Safety Disclaimer */}
            <MedicalDisclaimer />

            {/* Analyzed Report Status Header & Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Analyzed Lab Report:</span>
                    <span className="text-xs font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      {currentReport.biomarkers.length} Biomarkers Extracted
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Patient: {currentReport.patientInfo?.name || currentUser.name} • {currentReport.patientInfo?.labName || 'Clinical Record'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setIsCameraModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <Camera className="w-3.5 h-3.5 text-teal-600" />
                  <span>Scan Another</span>
                </button>
                <button
                  onClick={handleClearCurrentAnalysis}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Close current analysis view to upload a new document"
                >
                  <XCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span>New Upload</span>
                </button>
              </div>
            </div>

            {/* Quick Tools Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <button
                onClick={() => setActiveTab('infections')}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-700 to-red-800 text-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left group"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-200">Infections</span>
                  <Bug className="w-4 h-4 text-rose-200 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <span className="text-xs font-extrabold block">Dengue & Malaria</span>
                  <span className="text-[10px] text-rose-100">Platelet & viral screen</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('symptoms')}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-800 text-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left group"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">Predictor</span>
                  <HeartHandshake className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <span className="text-xs font-extrabold block">Symptom Checker</span>
                  <span className="text-[10px] text-indigo-100">Report-to-symptom match</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('organ-map')}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-700 to-cyan-800 text-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left group"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-teal-200">Organ Map</span>
                  <Stethoscope className="w-4 h-4 text-teal-200 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <span className="text-xs font-extrabold block">Specialist Doctor</span>
                  <span className="text-[10px] text-teal-100">7 Organ systems</span>
                </div>
              </button>

              <button
                onClick={() => setIsRetestModalOpen(true)}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left group"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">Reminders</span>
                  <Calendar className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <span className="text-xs font-extrabold block">Lab Retests</span>
                  <span className="text-[10px] text-blue-100">Calendar .ics alerts</span>
                </div>
              </button>

              <button
                onClick={() => setIsMealModalOpen(true)}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left group"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">Diet</span>
                  <Utensils className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <span className="text-xs font-extrabold block">{t.mealPlan}</span>
                  <span className="text-[10px] text-emerald-100">7-day recipes</span>
                </div>
              </button>

              <button
                onClick={() => setIsPillModalOpen(true)}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left group"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-200">Adherence</span>
                  <Pill className="w-4 h-4 text-purple-200 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <span className="text-xs font-extrabold block">Pill Tracker</span>
                  <span className="text-[10px] text-purple-100">Daily dose checklist</span>
                </div>
              </button>
            </div>

            {/* Report Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'overview'
                      ? 'bg-white text-teal-800 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span>{t.healthOverview}</span>
                </button>

                <button
                  onClick={() => setActiveTab('infections')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'infections'
                      ? 'bg-white text-rose-900 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Bug className="w-4 h-4 text-rose-600" />
                  <span>Viral & Infections</span>
                </button>

                <button
                  onClick={() => setActiveTab('symptoms')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'symptoms'
                      ? 'bg-white text-indigo-900 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4 text-indigo-600" />
                  <span>Symptom Checker</span>
                </button>

                <button
                  onClick={() => setActiveTab('organ-map')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'organ-map'
                      ? 'bg-white text-teal-800 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-teal-600" />
                  <span>Organ & Specialist Map</span>
                </button>

                <button
                  onClick={() => setActiveTab('biomarkers')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'biomarkers'
                      ? 'bg-white text-teal-800 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-4 h-4 text-teal-600" />
                  <span>{t.biomarkers} ({currentReport.biomarkers.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('trends')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'trends'
                      ? 'bg-white text-teal-800 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  <span>{t.trends}</span>
                </button>

                <button
                  onClick={() => setActiveTab('cardio')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'cardio'
                      ? 'bg-white text-teal-800 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>{t.cardioRisk}</span>
                </button>

                <button
                  onClick={() => setActiveTab('remedies')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'remedies'
                      ? 'bg-white text-teal-800 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{t.remedies}</span>
                </button>

                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'chat'
                      ? 'bg-white text-teal-800 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-cyan-600" />
                  <span>{t.assistant}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                {isOfflineMode && (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <WifiOff className="w-3 h-3" /> Offline Mode
                  </span>
                )}
                <span>Profile: <strong>{currentUser.name}</strong></span>
              </div>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                <HealthScoreCard report={currentReport} />
                
                {/* Infectious Disease Screen Quick Card */}
                <InfectiousDiseaseCard
                  biomarkers={currentReport.biomarkers}
                  patientName={currentUser.name}
                />

                {/* Symptom Predictor Quick Preview */}
                <SymptomCorrelator
                  biomarkers={currentReport.biomarkers}
                  patientName={currentUser.name}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7">
                    <DiseaseInsights conditions={currentReport.conditions} />
                  </div>
                  <div className="lg:col-span-5">
                    <ReportChatBot report={currentReport} isOfflineMode={isOfflineMode} />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: INFECTIONS & VIRUSES (DENGUE, MALARIA, TYPHOID) */}
            {activeTab === 'infections' && (
              <div className="space-y-6 animate-fadeIn">
                <InfectiousDiseaseCard
                  biomarkers={currentReport.biomarkers}
                  patientName={currentUser.name}
                />
              </div>
            )}

            {/* TAB 3: REPORT-TO-SYMPTOM PREDICTOR */}
            {activeTab === 'symptoms' && (
              <div className="space-y-6 animate-fadeIn">
                <SymptomCorrelator
                  biomarkers={currentReport.biomarkers}
                  patientName={currentUser.name}
                />
              </div>
            )}

            {/* TAB 4: ORGAN HEALTH & SPECIALIST DOCTOR MAP */}
            {activeTab === 'organ-map' && (
              <div className="space-y-6 animate-fadeIn">
                <OrganHealthMatrix
                  biomarkers={currentReport.biomarkers}
                  patientName={currentUser.name}
                  onOpenRetestModal={() => setIsRetestModalOpen(true)}
                />
              </div>
            )}

            {/* TAB 5: BIOMARKERS */}
            {activeTab === 'biomarkers' && (
              <div className="space-y-6 animate-fadeIn">
                <BiomarkerTable biomarkers={currentReport.biomarkers} />
              </div>
            )}

            {/* TAB 6: HISTORICAL TRENDS */}
            {activeTab === 'trends' && (
              <div className="space-y-6 animate-fadeIn">
                <HistoricalTrendView user={currentUser} reports={userReports} />
              </div>
            )}

            {/* TAB 7: CARDIO & BIO-AGE */}
            {activeTab === 'cardio' && (
              <div className="space-y-6 animate-fadeIn">
                <CardioMetabolicCard report={currentReport} user={currentUser} />
              </div>
            )}

            {/* TAB 8: REMEDIES */}
            {activeTab === 'remedies' && (
              <div className="space-y-6 animate-fadeIn">
                <RemediesGuide remedies={currentReport.remedies} />
              </div>
            )}

            {/* TAB 9: AI CHAT */}
            {activeTab === 'chat' && (
              <div className="max-w-3xl mx-auto animate-fadeIn">
                <ReportChatBot report={currentReport} isOfflineMode={isOfflineMode} />
              </div>
            )}
          </>
        ) : (
          /* ========================================================================= */
          /* CASE 2: NO REPORT ANALYZED YET -> CLEAN UPLOAD & ONBOARDING LANDING VIEW  */
          /* ========================================================================= */
          <div className="space-y-6 animate-fadeIn">
            {/* Safety Disclaimer */}
            <MedicalDisclaimer />

            {/* Upload and Ingestion Card (Prominently placed at the top) */}
            <FileUploader
              onAnalyzeFile={(fileData) => handleTriggerAnalysis(fileData)}
              onAnalyzeText={(text) => handleTriggerAnalysis(undefined, text)}
              onLoadSample={(key) => handleTriggerAnalysis(undefined, undefined, key)}
              isAnalyzing={isAnalyzing}
              isOfflineMode={isOfflineMode}
            />

            {/* Clean Feature Previews Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold font-['Outfit'] text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-600" />
                    What HealthLens AI Will Generate Once Your Report Is Analyzed
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload a PDF, take a photo scan, or choose a 1-click clinical demo above to generate full diagnostics:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <Bug className="w-4 h-4 text-rose-600" />
                    <span>Viral & Infection Screening</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Screens for Dengue (Platelets, Hematocrit, AST), Malaria (hemolysis triad), Typhoid, and Bacterial sepsis alerts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <HeartHandshake className="w-4 h-4 text-indigo-600" />
                    <span>Report-to-Symptom Predictor</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Predicts physical sensations (eye pain, joint aches, fatigue) from blood markers with interactive confirmation score.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    <span>7-Organ Map & Specialist Referrals</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Maps 7 organ systems to medical specialist doctors (Cardiologist, Hepatologist, Endocrinologist) with questions to ask.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <span>Functional Longevity Targets</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Compares standard lab reference intervals with optimal functional medicine longevity targets.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <Utensils className="w-4 h-4 text-emerald-600" />
                    <span>7-Day Meal & Grocery Plan</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Personalized breakfast, lunch, and dinner recipes tailored to fix deficiencies identified in your report.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Lab Retest Reminders (.ICS)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Downloadable calendar reminders with required fasting preparation rules for follow-up testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">HealthLens AI — Multi-User Family Clinical Platform for Web & Android</p>
        <p className="text-[11px]">100% On-Device Offline Storage • Privacy-First Health Analytics</p>
      </footer>

      {/* Modals & Drawers */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={() => setHasApiKey(Boolean(getStoredApiKey()))}
      />

      <ReportHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectReport={(r) => {
          setCurrentReport(r);
          setActiveTab('overview');
        }}
        currentReportId={currentReport?.id || ''}
      />

      <MealPlannerModal
        biomarkers={currentReport?.biomarkers || []}
        isOpen={isMealModalOpen}
        onClose={() => setIsMealModalOpen(false)}
      />

      <MedicationCheckerModal
        user={currentUser}
        isOpen={isMedModalOpen}
        onClose={() => setIsMedModalOpen(false)}
        onUpdateMedications={handleUpdateMedications}
      />

      <CameraScannerModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onAnalyzeCaptured={(data) => handleTriggerAnalysis(data)}
      />

      {currentReport && (
        <RetestReminderModal
          report={currentReport}
          isOpen={isRetestModalOpen}
          onClose={() => setIsRetestModalOpen(false)}
        />
      )}

      <PillTrackerModal
        user={currentUser}
        isOpen={isPillModalOpen}
        onClose={() => setIsPillModalOpen(false)}
      />

      <BackupRestoreModal
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        onRestoreSuccess={() => {
          const newActive = getActiveUser();
          setCurrentUser(newActive);
          refreshReportsForUser(newActive.id);
        }}
      />

      <DeleteAccountModal
        userToDelete={deleteModalUser}
        isOpen={Boolean(deleteModalUser)}
        onClose={() => setDeleteModalUser(null)}
        onConfirmDeleteUser={handleConfirmDeleteUser}
        onConfirmClearAll={handleConfirmClearAll}
      />

      <ExportReportView report={currentReport} />
    </div>
  );
}

export default App;

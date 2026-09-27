import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Sparkles, CheckCircle2, ArrowRight, RefreshCw, AlertCircle, FileCheck, Camera, WifiOff, ShieldCheck, Bug } from 'lucide-react';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';

interface FileUploaderProps {
  onAnalyzeFile: (fileData: { base64: string; mimeType: string; name: string }) => void;
  onAnalyzeText: (text: string) => void;
  onLoadSample: (sampleKey: string) => void;
  isAnalyzing: boolean;
  isOfflineMode: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onAnalyzeFile,
  onAnalyzeText,
  onLoadSample,
  isAnalyzing,
  isOfflineMode
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      onAnalyzeFile({
        base64,
        mimeType: file.type || 'application/pdf',
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      onAnalyzeText(textInput.trim());
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-['Outfit'] text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            Analyze Your Blood & Lab Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload printed PDF, snap a camera scan, or paste raw lab test values for instant on-device diagnosis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUploadMode('file')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              uploadMode === 'file'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            File / Camera Upload
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              uploadMode === 'text'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Paste Text Values
          </button>
        </div>
      </div>

      {/* Upload Box / Input Area */}
      <div className="mt-5">
        {uploadMode === 'file' ? (
          <div>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-teal-500 bg-teal-50/60 scale-[0.99]'
                  : 'border-slate-300 hover:border-teal-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-inner">
                  {isAnalyzing ? (
                    <RefreshCw className="w-7 h-7 animate-spin text-teal-600" />
                  ) : (
                    <UploadCloud className="w-7 h-7 text-teal-600" />
                  )}
                </div>

                {isAnalyzing ? (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-teal-900 animate-pulse">
                      Analyzing Report ({isOfflineMode ? 'On-Device Engine' : 'Cloud Gemini AI'})...
                    </p>
                    <p className="text-xs text-slate-500">
                      Extracting markers, screening viral infections, evaluating symptoms & organ maps
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-800">
                        <span className="text-teal-600 underline font-bold">Click to select</span> or drag & drop your blood report here
                      </p>
                      <p className="text-xs text-slate-500">
                        Supports Multi-page PDFs, Camera Photos, JPG, PNG & WebP
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                        <FileCheck className="w-3 h-3 text-emerald-500" /> PDF Reports
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                        <ImageIcon className="w-3 h-3 text-cyan-500" /> Camera Scans
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                        <ShieldCheck className="w-3 h-3 text-teal-500" /> Safe Local Storage
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleTextSubmit} className="space-y-3">
            <textarea
              rows={5}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste raw lab text (e.g. Platelets: 38,000 /µL, WBC: 2,400 /µL, Hematocrit: 48.5%, AST: 138 U/L, Vitamin D: 6.81 ng/mL, Fasting Sugar: 84.5 mg/dL)"
              className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all placeholder:text-slate-400 font-mono"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!textInput.trim() || isAnalyzing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Offline...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Extract & Analyze Biomarkers
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* 1-Click Demo Scenarios */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Instant 1-Click Clinical Demos:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onLoadSample('aarav-dengue-platelet-drop')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold border border-rose-300 transition-all shadow-2xs"
              >
                <Bug className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span>Aarav: Dengue & Platelets (38,000 /µL)</span>
                <ArrowRight className="w-3.5 h-3.5 text-rose-600" />
              </button>

              <button
                type="button"
                onClick={() => onLoadSample('priya-jadhav-maxlab')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200/80 transition-all"
              >
                <span>Priya: Vit D3 (6.81) & Lipids (211)</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

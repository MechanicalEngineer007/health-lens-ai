import React, { useState, useRef } from 'react';
import { X, Camera, Sparkles, RefreshCw, Shield, Filter, Check, UploadCloud } from 'lucide-react';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeCaptured: (data: { base64: string; mimeType: string; name: string }) => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  onAnalyzeCaptured
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64Raw, setBase64Raw] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'original' | 'contrast' | 'grayscale'>('contrast');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCapacitorCamera = async () => {
    try {
      const photo = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });

      if (photo.base64String) {
        const url = `data:image/${photo.format || 'jpeg'};base64,${photo.base64String}`;
        setPreviewUrl(url);
        setBase64Raw(photo.base64String);
      }
    } catch (err) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreviewUrl(result);
      const raw = result.split(',')[1] || result;
      setBase64Raw(raw);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessAnalysis = () => {
    if (!base64Raw) return;
    onAnalyzeCaptured({
      base64: base64Raw,
      mimeType: 'image/jpeg',
      name: `Camera-Scanned-Lab-Report-${Date.now()}.jpg`
    });
    onClose();
  };

  const getFilterClass = () => {
    switch (filterMode) {
      case 'contrast':
        return 'contrast-125 brightness-105 saturate-110';
      case 'grayscale':
        return 'grayscale contrast-150 brightness-105';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 flex flex-col space-y-4 max-h-[90vh] overflow-y-auto animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-['Outfit'] text-base">
            <Camera className="w-5 h-5 text-teal-600" />
            Live Paper Report Camera Scanner
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Viewport / Preview */}
        {!previewUrl ? (
          <div className="space-y-4">
            <div className="p-8 border-2 border-dashed border-teal-300 rounded-2xl bg-teal-50/50 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/30">
                <Camera className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Snap Photo of Printed Lab Report</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Position your blood test report on a flat surface with good lighting for highest OCR accuracy.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleCapacitorCamera}
                  className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-teal-700/20 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Open Camera</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs"
                >
                  <UploadCloud className="w-4 h-4 text-slate-500" />
                  <span>Choose Photo</span>
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-600 shrink-0" />
              <span>100% Private: Photos are processed on-device or via secure encrypted channels.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Captured Image Preview with Live Document Filter */}
            <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-black flex items-center justify-center max-h-72">
              <img
                src={previewUrl}
                alt="Captured Report"
                className={`max-h-72 w-auto object-contain transition-all ${getFilterClass()}`}
              />
              <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/70 text-white text-[10px] font-mono">
                Filter: {filterMode.toUpperCase()}
              </div>
            </div>

            {/* Document Filters */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-teal-600" />
                Document Clarity Enhancers:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setFilterMode('contrast')}
                  className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                    filterMode === 'contrast'
                      ? 'bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  High Contrast
                </button>
                <button
                  onClick={() => setFilterMode('grayscale')}
                  className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                    filterMode === 'grayscale'
                      ? 'bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  B&W Document
                </button>
                <button
                  onClick={() => setFilterMode('original')}
                  className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                    filterMode === 'original'
                      ? 'bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Original
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  setBase64Raw(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Photo</span>
              </button>

              <button
                onClick={handleProcessAnalysis}
                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-teal-700/20 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Analyze Lab Report</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

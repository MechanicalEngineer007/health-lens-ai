import React, { useState, useRef } from 'react';
import { X, Shield, Lock, Download, Upload, CheckCircle2, AlertTriangle, Key } from 'lucide-react';
import { exportEncryptedVault, restoreEncryptedVault } from '../services/cryptoVaultService.ts';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreSuccess: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({ isOpen, onClose, onRestoreSuccess }) => {
  const [password, setPassword] = useState('');
  const [restorePassword, setRestorePassword] = useState('');
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    if (!password || password.length < 4) {
      setStatusMsg({ type: 'error', text: 'Please enter a vault passphrase of at least 4 characters.' });
      return;
    }

    try {
      await exportEncryptedVault(password);
      setStatusMsg({ type: 'success', text: 'Encrypted backup (.healthvault) downloaded successfully!' });
      setPassword('');
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Export failed.' });
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRestoreFile(e.target.files[0]);
    }
  };

  const handleRestore = async () => {
    if (!restoreFile) {
      setStatusMsg({ type: 'error', text: 'Please select a .healthvault backup file.' });
      return;
    }
    if (!restorePassword) {
      setStatusMsg({ type: 'error', text: 'Please enter the decryption password for this backup.' });
      return;
    }

    try {
      await restoreEncryptedVault(restoreFile, restorePassword);
      setStatusMsg({ type: 'success', text: 'Data vault restored successfully! Reloading profiles...' });
      setTimeout(() => {
        onRestoreSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Decryption failed. Check your password.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col space-y-4 max-h-[90vh] overflow-y-auto animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-['Outfit'] text-base">
            <Shield className="w-5 h-5 text-teal-600" />
            Encrypted Data Vault (AES-256 Backup)
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Backup or restore all user profiles, lab reports, and medication schedules with military-grade 256-bit AES encryption.
        </p>

        {statusMsg && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* SECTION 1: EXPORT */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
            <Download className="w-4 h-4 text-teal-600" />
            <span>Export Encrypted Backup</span>
          </div>

          <div className="space-y-2">
            <input
              type="password"
              placeholder="Create a vault passphrase..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
            <button
              onClick={handleExport}
              className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Download Encrypted .healthvault</span>
            </button>
          </div>
        </div>

        {/* SECTION 2: RESTORE */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>Restore from Backup</span>
          </div>

          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".healthvault,.json"
              onChange={handleFileSelected}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold text-center truncate px-2"
            >
              {restoreFile ? restoreFile.name : 'Select .healthvault File'}
            </button>

            <input
              type="password"
              placeholder="Enter backup passphrase..."
              value={restorePassword}
              onChange={(e) => setRestorePassword(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />

            <button
              onClick={handleRestore}
              className="w-full py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Decrypt & Restore Vault</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

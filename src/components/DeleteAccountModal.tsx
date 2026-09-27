import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../types/user.ts';

interface DeleteAccountModalProps {
  userToDelete: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDeleteUser: (userId: string) => void;
  onConfirmClearAll: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  userToDelete,
  isOpen,
  onClose,
  onConfirmDeleteUser,
  onConfirmClearAll
}) => {
  const [deleteMode, setDeleteMode] = useState<'user' | 'all'>('user');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scaleUp">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-rose-700 font-bold font-['Outfit'] text-base">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            Delete Health Data & Profile
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setDeleteMode('user')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              deleteMode === 'user' ? 'bg-white text-rose-800 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Delete User: {userToDelete?.name || 'Selected'}
          </button>
          <button
            onClick={() => setDeleteMode('all')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              deleteMode === 'all' ? 'bg-white text-rose-800 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Clear Entire App Data
          </button>
        </div>

        {deleteMode === 'user' && userToDelete ? (
          <div className="space-y-3 text-xs text-slate-600">
            <p className="leading-relaxed">
              Are you sure you want to delete profile <strong className="text-slate-900 font-bold">{userToDelete.name}</strong>?
            </p>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-900 space-y-1">
              <p className="font-bold">This will permanently delete:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li>All blood test reports and historical graphs for {userToDelete.name}</li>
                <li>Saved remedies and personalized meal plans</li>
                <li>Medication lists</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs text-slate-600">
            <p className="leading-relaxed font-medium text-rose-900">
              ⚠️ Warning: This will perform a complete factory reset of HealthLens AI on this device.
            </p>
            <p className="text-slate-500">
              All stored family profiles, report histories, cached API keys, and settings will be permanently wiped from your browser storage.
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (deleteMode === 'user' && userToDelete) {
                onConfirmDeleteUser(userToDelete.id);
              } else {
                onConfirmClearAll();
              }
              onClose();
            }}
            className="px-5 py-2 font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleteMode === 'user' ? 'Delete Profile' : 'Wipe All Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
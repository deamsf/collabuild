import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel'
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background-light dark:bg-background-dark rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center gap-3 mb-4 text-accent-red">
          <AlertTriangle size={24} />
          <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">{title}</h2>
        </div>
        
        <p className="text-text-light-primary dark:text-text-dark-primary mb-2">{message}</p>
        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-6">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-accent-red text-white rounded-lg hover:bg-accent-red-dark"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
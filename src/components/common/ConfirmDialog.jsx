import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Confirm Action', message, confirmText = 'Confirm', confirmVariant = 'danger', isLoading = false }) => {
    const btnStyle = confirmVariant === 'danger'
        ? 'bg-rose-600 hover:bg-rose-700 text-white'
        : 'bg-brand-600 hover:bg-brand-700 text-white';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
            <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
                </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${btnStyle}`}
                >
                    {isLoading ? 'Processing...' : confirmText}
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;

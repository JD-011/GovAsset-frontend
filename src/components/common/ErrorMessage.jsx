import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
    if (!message) return null;
    return (
        <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm mb-6">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{message}</div>
            {onClose && (
                <button onClick={onClose} className="text-rose-500 hover:text-rose-700">
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;

import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600 mb-2" />
            {text && <span className="text-sm font-medium text-slate-600">{text}</span>}
        </div>
    );
};

export default LoadingSpinner;

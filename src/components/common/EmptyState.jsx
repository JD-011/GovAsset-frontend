import React from 'react';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({ title = 'No data found', description = 'There are no items to display at this time.', icon: Icon = FolderOpen, action }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 text-center my-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
            {action && <div>{action}</div>}
        </div>
    );
};

export default EmptyState;

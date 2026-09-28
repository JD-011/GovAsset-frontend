import React from 'react';
import { formatDateTime } from '../../utils/formatters';
import { Clock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const Timeline = ({ history = [] }) => {
    if (!history || history.length === 0) {
        return (
            <div className="p-6 text-center text-slate-500 text-sm bg-slate-50 rounded-xl border border-slate-200">
                No lifecycle history records found for this asset.
            </div>
        );
    }

    return (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {history.map((item, index) => (
                <div key={item._id || index} className="relative flex flex-col gap-1 text-sm">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-brand-600 border-2 border-white ring-2 ring-slate-100 flex items-center justify-center text-white">
                        <ShieldCheck className="w-3 h-3" />
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-semibold text-slate-800">{item.action.replace('_', ' ')}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.timestamp ? formatDateTime(item.timestamp) : 'N/A'}
                        </span>
                    </div>

                    {(item.fromStatus || item.toStatus) && (
                        <div className="flex items-center gap-2 my-1">
                            {item.fromStatus && <StatusBadge type="lifecycle" value={item.fromStatus} />}
                            {item.fromStatus && item.toStatus && <ArrowRight className="w-3.5 h-3.5 text-slate-400" />}
                            {item.toStatus && <StatusBadge type="lifecycle" value={item.toStatus} />}
                        </div>
                    )}

                    {item.details && <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">{item.details}</p>}

                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3" />
                        <span>Performed by: <strong className="text-slate-600">{item.performedBy?.name || 'System User'}</strong></span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Timeline;

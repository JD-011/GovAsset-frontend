import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'blue', subtext, onClick }) => {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        rose: 'bg-rose-50 text-rose-600 border-rose-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    }[color] || 'bg-slate-50 text-slate-600 border-slate-100';

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-xl p-5 border border-slate-200 shadow-sm transition duration-200 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300' : ''
                }`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-800">{value ?? 0}</h3>
                    {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-xl border ${colorStyles}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;

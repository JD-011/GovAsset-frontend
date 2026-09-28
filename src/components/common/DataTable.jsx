import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

const DataTable = ({ columns, data, isLoading, emptyTitle, emptyDescription, onRowClick }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-8">
                <LoadingSpinner />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return <EmptyState title={emptyTitle} description={emptyDescription} />;
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            {columns.map((col, index) => (
                                <th key={index} className={`px-5 py-3.5 ${col.className || ''}`}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {data.map((row, rowIndex) => (
                            <tr
                                key={row._id || rowIndex}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={`hover:bg-slate-50/80 transition-colors ${onRowClick ? 'cursor-pointer' : ''
                                    }`}
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className={`px-5 py-4 ${col.className || ''}`}>
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;

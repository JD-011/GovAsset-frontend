import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
                <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">404 - Page Not Found</h2>
            <p className="text-sm text-slate-500 max-w-md mb-6">
                The system page you are trying to access does not exist or you do not have permission to view it.
            </p>
            <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-md transition"
            >
                <ArrowLeft className="w-4 h-4" />
                Return to Portal Home
            </Link>
        </div>
    );
};

export default NotFoundPage;

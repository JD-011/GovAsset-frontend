import React, { useEffect, useState } from 'react';
import { dashboardAPI, complaintAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StatusBadge from '../../components/common/StatusBadge';
import {
    AlertCircle,
    Building2,
    MapPin,
    FilePlus,
    Clock,
    CheckCircle2,
    ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

const CitizenDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [myComplaints, setMyComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [sumRes, compRes] = await Promise.all([
                    dashboardAPI.getSummary(),
                    complaintAPI.getMyComplaints(),
                ]);

                if (sumRes.status === 'success') setSummary(sumRes.data);
                if (compRes.status === 'success') setMyComplaints(compRes.data);
            } catch (err) {
                setError(err.message || 'Failed to load citizen portal data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <LoadingSpinner text="Loading your portal summary..." />;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Citizen Services Portal</h2>
                <p className="text-sm text-slate-500 mt-1">Browse public facilities, track reported issues, and submit complaints</p>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            {/* Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    title="Total Complaints Filed"
                    value={summary?.totalComplaints}
                    icon={AlertCircle}
                    color="blue"
                />
                <StatCard
                    title="Active / Open Issues"
                    value={summary?.openComplaints}
                    icon={Clock}
                    color="amber"
                />
                <StatCard
                    title="Resolved Complaints"
                    value={summary?.resolvedComplaints}
                    icon={CheckCircle2}
                    color="emerald"
                />
            </div>

            {/* Quick Action Navigation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                    to="/citizen/assets"
                    className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition duration-200"
                >
                    <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-base mb-1">Browse Government Assets</h3>
                    <p className="text-xs text-slate-500">Explore public schools, hospitals, offices & locations.</p>
                </Link>

                <Link
                    to="/citizen/map"
                    className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition duration-200"
                >
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-base mb-1">Interactive Asset Map</h3>
                    <p className="text-xs text-slate-500">View public infrastructure on open geographical map.</p>
                </Link>

                <Link
                    to="/citizen/complaints/new"
                    className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-300 transition duration-200"
                >
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition">
                        <FilePlus className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-base mb-1">Raise a Complaint</h3>
                    <p className="text-xs text-slate-500">Report damage or maintenance needs with photo proof.</p>
                </Link>
            </div>

            {/* Recent My Complaints */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-rose-600" />
                        My Reported Complaints
                    </h3>
                    <Link to="/citizen/complaints" className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1">
                        View All <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {myComplaints.length === 0 ? (
                    <p className="text-sm text-slate-500 py-6 text-center">You haven't filed any complaints yet.</p>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {myComplaints.slice(0, 5).map((complaint) => (
                            <div key={complaint._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <StatusBadge type="priority" value={complaint.priority} />
                                        <h4 className="font-bold text-slate-800">{complaint.title}</h4>
                                    </div>
                                    <p className="text-xs text-slate-500">Asset: {complaint.assetId?.name || 'Asset'}</p>
                                    <p className="text-[11px] text-slate-400 mt-1">Filed on {formatDate(complaint.createdAt)}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <StatusBadge type="complaintStatus" value={complaint.status} />
                                    <Link
                                        to={`/citizen/complaints/${complaint._id}`}
                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition"
                                    >
                                        Track Progress
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CitizenDashboard;

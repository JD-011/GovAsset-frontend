import React, { useEffect, useState } from 'react';
import { dashboardAPI, assetAPI, complaintAPI, maintenanceAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StatusBadge from '../../components/common/StatusBadge';
import {
    Building2,
    AlertCircle,
    Wrench,
    CheckCircle2,
    Users,
    Building,
    ArrowRight,
    TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

const AdminDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [sumRes, compRes, taskRes] = await Promise.all([
                    dashboardAPI.getSummary(),
                    complaintAPI.getMyComplaints(),
                    maintenanceAPI.getMyTasks(),
                ]);

                if (sumRes.status === 'success') setSummary(sumRes.data);
                if (compRes.status === 'success') setRecentComplaints(compRes.data.slice(0, 5));
                if (taskRes.status === 'success') setRecentTasks(taskRes.data.slice(0, 5));
            } catch (err) {
                setError(err.message || 'Failed to load dashboard metrics');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <LoadingSpinner text="Fetching system statistics..." />;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">System Administration Overview</h2>
                <p className="text-sm text-slate-500 mt-1">Real-time statistics across government assets, complaints & maintenance</p>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Assets"
                    value={summary?.totalAssets}
                    icon={Building2}
                    color="blue"
                    subtext={`${summary?.activeAssets || 0} Active | ${summary?.maintenanceAssets || 0} Maintenance`}
                />
                <StatCard
                    title="Open Complaints"
                    value={summary?.openComplaints}
                    icon={AlertCircle}
                    color="rose"
                    subtext={`Out of ${summary?.totalComplaints || 0} total complaints`}
                />
                <StatCard
                    title="Maintenance Work"
                    value={summary?.totalMaintenanceTasks}
                    icon={Wrench}
                    color="amber"
                    subtext={`${summary?.completedMaintenanceTasks || 0} Tasks Completed`}
                />
                <StatCard
                    title="Retired Assets"
                    value={summary?.retiredAssets}
                    icon={CheckCircle2}
                    color="purple"
                    subtext="Decommissioned infrastructure"
                />
            </div>

            {/* Quick Action Navigation Bar */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold">Quick Administrative Actions</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage staff access, department structures, and full asset directory</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <Link
                        to="/admin/users"
                        className="flex-1 md:flex-initial px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition"
                    >
                        <Users className="w-4 h-4" />
                        <span>User Management</span>
                    </Link>
                    <Link
                        to="/admin/departments"
                        className="flex-1 md:flex-initial px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition border border-slate-700"
                    >
                        <Building className="w-4 h-4" />
                        <span>Departments</span>
                    </Link>
                    <Link
                        to="/admin/assets"
                        className="flex-1 md:flex-initial px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition border border-slate-700"
                    >
                        <Building2 className="w-4 h-4" />
                        <span>Asset Directory</span>
                    </Link>
                </div>
            </div>

            {/* Recent Activity Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Complaints */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-rose-600" />
                            Recent Citizen Complaints
                        </h3>
                        <Link to="/admin/complaints" className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1">
                            View All <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {recentComplaints.length === 0 ? (
                        <p className="text-xs text-slate-400 py-4 text-center">No recent complaints filed.</p>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {recentComplaints.map((c) => (
                                <div key={c._id} className="py-3 flex items-center justify-between text-sm">
                                    <div>
                                        <h4 className="font-semibold text-slate-800 line-clamp-1">{c.title}</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">Asset: {c.assetId?.name || 'N/A'}</p>
                                    </div>
                                    <div className="text-right">
                                        <StatusBadge type="complaintStatus" value={c.status} />
                                        <p className="text-[10px] text-slate-400 mt-1">{formatDate(c.createdAt)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Maintenance */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Wrench className="w-5 h-5 text-amber-600" />
                            Recent Maintenance Tasks
                        </h3>
                        <Link to="/admin/maintenance" className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1">
                            View All <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {recentTasks.length === 0 ? (
                        <p className="text-xs text-slate-400 py-4 text-center">No recent maintenance tasks.</p>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {recentTasks.map((t) => (
                                <div key={t._id} className="py-3 flex items-center justify-between text-sm">
                                    <div>
                                        <h4 className="font-semibold text-slate-800 line-clamp-1">{t.title}</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">Assigned to: {t.assignedTo?.name || 'Staff'}</p>
                                    </div>
                                    <div className="text-right">
                                        <StatusBadge type="maintenanceStatus" value={t.status} />
                                        <p className="text-[10px] text-slate-400 mt-1">{formatDate(t.createdAt)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

import React, { useEffect, useState } from 'react';
import { dashboardAPI, complaintAPI, maintenanceAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StatusBadge from '../../components/common/StatusBadge';
import { Building2, AlertCircle, Wrench, Plus, ArrowRight, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

const AssetManagerDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [assignedTasks, setAssignedTasks] = useState([]);
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
                if (taskRes.status === 'success') setAssignedTasks(taskRes.data.slice(0, 5));
            } catch (err) {
                setError(err.message || 'Failed to load manager summary.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <LoadingSpinner text="Loading managed assets data..." />;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Asset Manager Portal</h2>
                    <p className="text-sm text-slate-500 mt-1">Overview of assigned assets, threshold alerts & maintenance tasks</p>
                </div>
                <Link
                    to="/asset-manager/assets/new"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm rounded-xl shadow-md shadow-brand-600/20 transition"
                >
                    <Plus className="w-4 h-4" />
                    <span>Register New Asset</span>
                </Link>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="My Managed Assets"
                    value={summary?.totalAssets}
                    icon={Building2}
                    color="blue"
                    subtext="Assigned government properties"
                />
                <StatCard
                    title="Active Assets"
                    value={summary?.activeAssets}
                    icon={Building2}
                    color="emerald"
                    subtext="In regular operation"
                />
                <StatCard
                    title="Under Maintenance"
                    value={summary?.maintenanceAssets}
                    icon={Wrench}
                    color="amber"
                    subtext="Active repair work"
                />
                <StatCard
                    title="Open Complaints"
                    value={summary?.openComplaints}
                    icon={AlertCircle}
                    color="rose"
                    subtext={`Total ${summary?.totalComplaints || 0} reported`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-rose-600" />
                            Complaints on Managed Assets
                        </h3>
                        <Link to="/asset-manager/complaints" className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1">
                            View All <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {recentComplaints.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">No active complaints on your assets.</p>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {recentComplaints.map((c) => (
                                <div key={c._id} className="py-3 flex items-center justify-between text-sm">
                                    <div>
                                        <h4 className="font-semibold text-slate-800 line-clamp-1">{c.title}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Asset: {c.assetId?.name || 'Asset'}</p>
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

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Wrench className="w-5 h-5 text-brand-600" />
                            Assigned Maintenance Tasks
                        </h3>
                        <Link to="/asset-manager/maintenance" className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1">
                            View All <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {assignedTasks.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">No maintenance tasks assigned yet.</p>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {assignedTasks.map((t) => (
                                <div key={t._id} className="py-3 flex items-center justify-between text-sm">
                                    <div>
                                        <h4 className="font-semibold text-slate-800 line-clamp-1">{t.title}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Assigned to: {t.assignedTo?.name || 'Staff'}</p>
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

export default AssetManagerDashboard;

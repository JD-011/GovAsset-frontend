import React, { useEffect, useState } from 'react';
import { dashboardAPI, maintenanceAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StatusBadge from '../../components/common/StatusBadge';
import { Wrench, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

const StaffDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [sumRes, taskRes] = await Promise.all([
                    dashboardAPI.getSummary(),
                    maintenanceAPI.getMyTasks(),
                ]);

                if (sumRes.status === 'success') setSummary(sumRes.data);
                if (taskRes.status === 'success') setTasks(taskRes.data);
            } catch (err) {
                setError(err.message || 'Failed to load maintenance tasks.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <LoadingSpinner text="Fetching assigned maintenance work..." />;

    const highPriorityTasks = tasks.filter(
        (t) => (t.priority === 'HIGH' || t.priority === 'CRITICAL') && t.status !== 'COMPLETED'
    );

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Maintenance Staff Workstation</h2>
                <p className="text-sm text-slate-500 mt-1">Track assigned tasks, update work status, and log resolution notes</p>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Assigned Tasks"
                    value={summary?.assignedTasks}
                    icon={Clock}
                    color="blue"
                    subtext="Pending initial action"
                />
                <StatCard
                    title="In Progress"
                    value={summary?.inProgressTasks}
                    icon={Wrench}
                    color="amber"
                    subtext="Currently undergoing repair"
                />
                <StatCard
                    title="Completed Work"
                    value={summary?.completedTasks}
                    icon={CheckCircle2}
                    color="emerald"
                    subtext="Successfully resolved"
                />
                <StatCard
                    title="High Priority"
                    value={highPriorityTasks.length}
                    icon={AlertTriangle}
                    color="rose"
                    subtext="Urgent intervention required"
                />
            </div>

            {/* Task List Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-brand-600" />
                        My Active Assignments
                    </h3>
                    <Link to="/maintenance/tasks" className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1">
                        View All Work <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {tasks.length === 0 ? (
                    <p className="text-sm text-slate-500 py-8 text-center">No maintenance tasks assigned to you right now.</p>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {tasks.slice(0, 6).map((task) => (
                            <div key={task._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <StatusBadge type="priority" value={task.priority} />
                                        <h4 className="font-bold text-slate-800">{task.title}</h4>
                                    </div>
                                    <p className="text-xs text-slate-500">Asset: <strong className="text-slate-700">{task.assetId?.name}</strong> ({task.assetId?.assetCode})</p>
                                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{task.description}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <StatusBadge type="maintenanceStatus" value={task.status} />
                                    <Link
                                        to={`/maintenance/tasks/${task._id}`}
                                        className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs rounded-lg transition"
                                    >
                                        Open Task
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

export default StaffDashboard;

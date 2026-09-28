import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { maintenanceAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import {
    Wrench,
    Building,
    User,
    Clock,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    IndianRupee,
    FileText,
} from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';

const MaintenanceTaskDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        status: '',
        completionNotes: '',
        cost: '',
    });

    const fetchTaskDetails = async () => {
        try {
            setLoading(true);
            const res = await maintenanceAPI.getTask(id);
            if (res.status === 'success') {
                setTask(res.data);
                setForm({
                    status: res.data.status,
                    completionNotes: res.data.completionNotes || '',
                    cost: res.data.cost?.toString() || '',
                });
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch task details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTaskDetails();
    }, [id]);

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const res = await maintenanceAPI.updateTaskStatus(id, form);
            if (res.status === 'success') {
                setTask(res.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to update task status');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner text="Loading task details..." />;
    if (!task) return <ErrorMessage message={error || 'Task not found.'} />;

    const isAssignedStaff = user?._id === task.assignedTo?._id || ['ADMIN', 'ASSET_MANAGER'].includes(user?.role);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Tasks
                </button>

                <div className="flex items-center gap-2">
                    <StatusBadge type="priority" value={task.priority} />
                    <StatusBadge type="maintenanceStatus" value={task.status} />
                </div>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            {/* Main Task Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{task.title}</h2>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                            <span className="flex items-center gap-1">
                                <Building className="w-3.5 h-3.5 text-slate-400" />
                                Asset: <strong className="text-slate-800">{task.assetId?.name}</strong> ({task.assetId?.assetCode})
                            </span>
                            <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                Assigned Staff: <strong className="text-slate-800">{task.assignedTo?.name || 'Unassigned'}</strong>
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                Due: <strong>{formatDate(task.dueDate)}</strong>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">Work Scope & Instructions</h4>
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {task.description || 'No detailed instructions provided.'}
                    </p>
                </div>

                {task.complaintId && (
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                        <span className="text-amber-900 font-semibold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                            Generated from Citizen Complaint: "{task.complaintId.title || 'Complaint'}"
                        </span>
                        <Link
                            to={`/complaints/${task.complaintId._id || task.complaintId}`}
                            className="text-amber-800 font-bold hover:underline"
                        >
                            View Complaint
                        </Link>
                    </div>
                )}

                {task.completionNotes && (
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-1">
                        <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Logged Completion Summary
                        </h4>
                        <p className="text-xs text-emerald-900 leading-relaxed">{task.completionNotes}</p>
                        {task.cost > 0 && (
                            <p className="text-xs font-bold text-emerald-900 pt-1">
                                Total Repair Cost: {formatCurrency(task.cost)}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Staff Action Workstation */}
            {isAssignedStaff && task.status !== 'COMPLETED' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-brand-600" />
                        Update Maintenance Work Status
                    </h3>

                    <form onSubmit={handleUpdateStatus} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    Status *
                                </label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                >
                                    <option value="ASSIGNED">Assigned</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    Log Repair Cost (₹)
                                </label>
                                <input
                                    type="number"
                                    value={form.cost}
                                    onChange={(e) => setForm({ ...form, cost: e.target.value })}
                                    placeholder="e.g. 4500"
                                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Work Log / Resolution Summary
                            </label>
                            <textarea
                                rows={3}
                                value={form.completionNotes}
                                onChange={(e) => setForm({ ...form, completionNotes: e.target.value })}
                                placeholder="Describe actions taken, spare parts replaced, or completion status..."
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-brand-600/20 transition flex items-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{submitting ? 'Updating Task...' : 'Submit Work Log Update'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MaintenanceTaskDetailPage;

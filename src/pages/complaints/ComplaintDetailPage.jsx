import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { complaintAPI, maintenanceAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import ImageGallery from '../../components/common/ImageGallery';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import {
    AlertCircle,
    Building,
    User,
    Clock,
    ArrowLeft,
    Wrench,
    CheckCircle2,
    AlertTriangle,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const ComplaintDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [staffUsers, setStaffUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Status update state
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [statusForm, setStatusForm] = useState({ status: '', resolutionNotes: '' });

    // Create Task Modal state
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskForm, setTaskForm] = useState({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'MEDIUM',
        dueDate: '',
    });
    const [creatingTask, setCreatingTask] = useState(false);

    const canManage = ['ADMIN', 'ASSET_MANAGER'].includes(user?.role);

    const fetchComplaintDetails = async () => {
        try {
            setLoading(true);
            const res = await complaintAPI.getComplaint(id);
            if (res.status === 'success') {
                setComplaint(res.data);
                setStatusForm({
                    status: res.data.status,
                    resolutionNotes: res.data.resolutionNotes || '',
                });
                setTaskForm((prev) => ({
                    ...prev,
                    title: `Fix: ${res.data.title}`,
                    description: res.data.description,
                    priority: res.data.priority,
                }));
            }

            if (canManage) {
                const staffRes = await userAPI.getAllUsers({ role: 'MAINTENANCE_STAFF' });
                if (staffRes.status === 'success') {
                    setStaffUsers(staffRes.data);
                }
            }
        } catch (err) {
            setError(err.message || 'Failed to load complaint details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaintDetails();
    }, [id]);

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        try {
            setUpdatingStatus(true);
            const res = await complaintAPI.updateStatus(id, statusForm);
            if (res.status === 'success') {
                setComplaint(res.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to update complaint status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            setCreatingTask(true);
            const taskPayload = {
                ...taskForm,
                assetId: complaint.assetId._id,
                complaintId: complaint._id,
            };

            const res = await maintenanceAPI.createTask(taskPayload);
            if (res.status === 'success') {
                setIsTaskModalOpen(false);
                fetchComplaintDetails();
            }
        } catch (err) {
            setError(err.message || 'Failed to assign maintenance task');
        } finally {
            setCreatingTask(false);
        }
    };

    if (loading) return <LoadingSpinner text="Loading complaint details..." />;
    if (!complaint) return <ErrorMessage message={error || 'Complaint not found.'} />;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="flex items-center gap-2">
                    <StatusBadge type="priority" value={complaint.priority} />
                    <StatusBadge type="complaintStatus" value={complaint.status} />
                </div>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            {/* Main Complaint Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                            {complaint.category}
                        </span>
                        <h2 className="text-2xl font-bold text-slate-900 mt-2">{complaint.title}</h2>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                            <span className="flex items-center gap-1">
                                <Building className="w-3.5 h-3.5 text-slate-400" />
                                Asset: <strong className="text-slate-800">{complaint.assetId?.name}</strong>
                            </span>
                            <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                Filed by: <strong className="text-slate-800">{complaint.citizenId?.name || 'Citizen'}</strong>
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                Filed on {formatDate(complaint.createdAt)}
                            </span>
                        </div>
                    </div>

                    {canManage && complaint.status !== 'RESOLVED' && (
                        <button
                            onClick={() => setIsTaskModalOpen(true)}
                            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-2 flex-shrink-0"
                        >
                            <Wrench className="w-4 h-4" />
                            <span>Assign Maintenance Task</span>
                        </button>
                    )}
                </div>

                <div className="border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">Description</h4>
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {complaint.description}
                    </p>
                </div>

                {/* Photos */}
                {complaint.photos?.length > 0 && (
                    <div className="pt-2">
                        <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                            Submitted Photographs ({complaint.photos.length})
                        </h4>
                        <ImageGallery photos={complaint.photos} />
                    </div>
                )}

                {complaint.resolutionNotes && (
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                        <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Official Resolution Notes
                        </h4>
                        <p className="text-xs text-emerald-900 leading-relaxed">{complaint.resolutionNotes}</p>
                    </div>
                )}
            </div>

            {/* Status Management Box for Admin / Asset Manager */}
            {canManage && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">
                        Update Complaint Status & Notes
                    </h3>

                    <form onSubmit={handleUpdateStatus} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    Current Status
                                </label>
                                <select
                                    value={statusForm.status}
                                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                >
                                    <option value="SUBMITTED">Submitted</option>
                                    <option value="UNDER_REVIEW">Under Review</option>
                                    <option value="MAINTENANCE_ASSIGNED">Maintenance Assigned</option>
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Resolution / Review Remarks
                            </label>
                            <textarea
                                rows={2}
                                value={statusForm.resolutionNotes}
                                onChange={(e) => setStatusForm({ ...statusForm, resolutionNotes: e.target.value })}
                                placeholder="Log resolution remarks or reasons for status update..."
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={updatingStatus}
                                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
                            >
                                {updatingStatus ? 'Updating...' : 'Save Status Update'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Create Maintenance Task Modal */}
            <Modal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                title="Assign Maintenance Task to Staff"
            >
                <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={taskForm.title}
                            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Assignee (Maintenance Staff) *
                            </label>
                            <select
                                required
                                value={taskForm.assignedTo}
                                onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="">Select Staff Member</option>
                                {staffUsers.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.name} ({s.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Priority *
                            </label>
                            <select
                                value={taskForm.priority}
                                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Target Due Date
                        </label>
                        <input
                            type="date"
                            value={taskForm.dueDate}
                            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Task Work Scope / Instructions
                        </label>
                        <textarea
                            rows={3}
                            value={taskForm.description}
                            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsTaskModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={creatingTask}
                            className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition shadow-sm"
                        >
                            {creatingTask ? 'Dispatching Task...' : 'Dispatch Maintenance Task'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ComplaintDetailPage;

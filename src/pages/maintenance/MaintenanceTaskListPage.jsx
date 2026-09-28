import React, { useEffect, useState } from 'react';
import { maintenanceAPI } from '../../services/api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useAuth } from '../../context/AuthContext';
import { Wrench, Search, Filter, Eye, Building, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

const MaintenanceTaskListPage = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters state
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const params = {};
            if (status) params.status = status;
            if (priority) params.priority = priority;

            let res;
            if (user.role === 'MAINTENANCE_STAFF') {
                res = await maintenanceAPI.getMyTasks();
            } else {
                res = await maintenanceAPI.getAllTasks(params);
            }

            if (res.status === 'success') {
                setTasks(res.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch maintenance tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [status, priority]);

    const isStaff = user?.role === 'MAINTENANCE_STAFF';

    const columns = [
        {
            header: 'Task Title & Asset',
            accessor: 'title',
            render: (t) => (
                <div>
                    <div className="font-bold text-slate-800 hover:text-brand-600 transition">
                        <Link to={`/maintenance/tasks/${t._id}`}>{t.title}</Link>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>Asset: {t.assetId?.name || 'N/A'}</span>
                    </div>
                </div>
            ),
        },
        {
            header: 'Assigned To',
            accessor: 'assignedTo',
            render: (t) => (
                <span className="text-xs text-slate-700 font-medium">
                    {t.assignedTo?.name || 'Unassigned'}
                </span>
            ),
        },
        {
            header: 'Priority',
            accessor: 'priority',
            render: (t) => <StatusBadge type="priority" value={t.priority} />,
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (t) => <StatusBadge type="maintenanceStatus" value={t.status} />,
        },
        {
            header: 'Due Date',
            accessor: 'dueDate',
            render: (t) => (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(t.dueDate)}
                </span>
            ),
        },
        {
            header: 'Actions',
            accessor: '_id',
            render: (t) => (
                <Link
                    to={`/maintenance/tasks/${t._id}`}
                    className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition inline-block font-semibold text-xs"
                    title="Open Task Workstation"
                >
                    <Eye className="w-4 h-4" />
                </Link>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Wrench className="w-6 h-6 text-amber-600" />
                    {isStaff ? 'My Assigned Maintenance Work' : 'All Maintenance Tasks'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    {isStaff
                        ? 'Execute assigned repair work, log completion notes, and update statuses'
                        : 'Track overall maintenance operations and staff dispatching across government assets'}
                </p>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filters:</span>
                </div>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                    <option value="">All Statuses</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>

                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                    <option value="">All Priorities</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                </select>
            </div>

            <DataTable
                columns={columns}
                data={tasks}
                isLoading={loading}
                emptyTitle="No maintenance tasks found"
                emptyDescription="There are no active or completed work orders matching your query."
            />
        </div>
    );
};

export default MaintenanceTaskListPage;

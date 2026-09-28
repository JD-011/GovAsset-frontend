import React, { useEffect, useState } from 'react';
import { complaintAPI } from '../../services/api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Plus, Search, Filter, Eye, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

const ComplaintListPage = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter state
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState('');

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const params = {};
            if (search) params.search = search;
            if (status) params.status = status;
            if (category) params.category = category;
            if (priority) params.priority = priority;

            let res;
            if (user.role === 'CITIZEN') {
                res = await complaintAPI.getMyComplaints();
            } else {
                res = await complaintAPI.getAllComplaints(params);
            }

            if (res.status === 'success') {
                setComplaints(res.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchComplaints();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, status, category, priority]);

    const isCitizen = user?.role === 'CITIZEN';

    const columns = [
        {
            header: 'Complaint Title & Asset',
            accessor: 'title',
            render: (c) => (
                <div>
                    <div className="font-bold text-slate-800 hover:text-brand-600 transition">
                        <Link to={`/complaints/${c._id}`}>{c.title}</Link>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>Asset: {c.assetId?.name || 'N/A'}</span>
                    </div>
                </div>
            ),
        },
        {
            header: 'Category',
            accessor: 'category',
            render: (c) => (
                <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                    {c.category}
                </span>
            ),
        },
        {
            header: 'Priority',
            accessor: 'priority',
            render: (c) => <StatusBadge type="priority" value={c.priority} />,
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (c) => <StatusBadge type="complaintStatus" value={c.status} />,
        },
        {
            header: 'Filed On',
            accessor: 'createdAt',
            render: (c) => <span className="text-xs text-slate-400">{formatDate(c.createdAt)}</span>,
        },
        {
            header: 'Actions',
            accessor: '_id',
            render: (c) => (
                <Link
                    to={`/complaints/${c._id}`}
                    className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition inline-block"
                    title="View Details & Take Action"
                >
                    <Eye className="w-4 h-4" />
                </Link>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <AlertCircle className="w-6 h-6 text-rose-600" />
                        {isCitizen ? 'My Reported Complaints' : 'Citizen Complaints Directory'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {isCitizen
                            ? 'Track progress and responses for your reported issues'
                            : 'Review, update, and assign maintenance for reported physical asset issues'}
                    </p>
                </div>

                {isCitizen && (
                    <Link
                        to="/citizen/complaints/new"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-rose-600/20 transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Raise New Complaint</span>
                    </Link>
                )}
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                {!isCitizen && (
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search complaints by title or description..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
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
                        <option value="SUBMITTED">Submitted</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="MAINTENANCE_ASSIGNED">Maintenance Assigned</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="">All Categories</option>
                        <option value="STRUCTURAL">Structural</option>
                        <option value="ELECTRICAL">Electrical</option>
                        <option value="PLUMBING">Plumbing</option>
                        <option value="CLEANLINESS">Cleanliness</option>
                        <option value="SECURITY">Security</option>
                        <option value="OTHER">Other</option>
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
            </div>

            <DataTable
                columns={columns}
                data={complaints}
                isLoading={loading}
                emptyTitle="No complaints found"
                emptyDescription="There are no reported complaints matching the current filter criteria."
            />
        </div>
    );
};

export default ComplaintListPage;

import React, { useEffect, useState } from 'react';
import { assetAPI, departmentAPI } from '../../services/api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useAuth } from '../../context/AuthContext';
import {
    Building2,
    Plus,
    Search,
    Filter,
    Eye,
    Edit2,
    MapPin,
    Building,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AssetListPage = () => {
    const { user } = useAuth();
    const [assets, setAssets] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters state
    const [search, setSearch] = useState('');
    const [assetType, setAssetType] = useState('');
    const [lifecycleStatus, setLifecycleStatus] = useState('');
    const [condition, setCondition] = useState('');
    const [city, setCity] = useState('');
    const [departmentId, setDepartmentId] = useState('');

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const params = {};
            if (search) params.search = search;
            if (assetType) params.assetType = assetType;
            if (lifecycleStatus) params.lifecycleStatus = lifecycleStatus;
            if (condition) params.condition = condition;
            if (city) params.city = city;
            if (departmentId) params.departmentId = departmentId;

            const [aRes, dRes] = await Promise.all([
                assetAPI.getAssets(params),
                departmentAPI.getAllDepartments(),
            ]);

            if (aRes.status === 'success') setAssets(aRes.data);
            if (dRes.status === 'success') setDepartments(dRes.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch assets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAssets();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, assetType, lifecycleStatus, condition, city, departmentId]);

    const canManage = ['ADMIN', 'ASSET_MANAGER'].includes(user?.role);

    const columns = [
        {
            header: 'Asset Code & Name',
            accessor: 'name',
            render: (a) => (
                <div>
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                        <Building className="w-4 h-4 text-brand-600 flex-shrink-0" />
                        <Link
                            to={user?.role === 'CITIZEN' ? `/citizen/assets/${a._id}` : `/asset-manager/assets/${a._id}`}
                            className="hover:text-brand-600 transition"
                        >
                            {a.name}
                        </Link>
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">{a.assetCode}</div>
                </div>
            ),
        },
        {
            header: 'Type',
            accessor: 'assetType',
            render: (a) => (
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                    {a.assetType}
                </span>
            ),
        },
        {
            header: 'Department',
            accessor: 'departmentId',
            render: (a) => <span className="text-xs text-slate-600">{a.departmentId?.name || 'N/A'}</span>,
        },
        {
            header: 'Location',
            accessor: 'city',
            render: (a) => (
                <div className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{a.city}, {a.state}</span>
                </div>
            ),
        },
        {
            header: 'Condition',
            accessor: 'condition',
            render: (a) => <StatusBadge type="condition" value={a.condition} />,
        },
        {
            header: 'Status',
            accessor: 'lifecycleStatus',
            render: (a) => <StatusBadge type="lifecycle" value={a.lifecycleStatus} />,
        },
        {
            header: 'Actions',
            accessor: '_id',
            render: (a) => {
                const detailUrl =
                    user?.role === 'CITIZEN' ? `/citizen/assets/${a._id}` : `/asset-manager/assets/${a._id}`;
                return (
                    <div className="flex items-center gap-2">
                        <Link
                            to={detailUrl}
                            className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition"
                            title="View Asset Details"
                        >
                            <Eye className="w-4 h-4" />
                        </Link>

                        {canManage && (
                            <Link
                                to={`/asset-manager/assets/edit/${a._id}`}
                                className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition"
                                title="Edit Asset"
                            >
                                <Edit2 className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-brand-600" />
                        Physical Asset Inventory
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Directory of government offices, schools, hospitals, and infrastructure</p>
                </div>

                {canManage && (
                    <Link
                        to="/asset-manager/assets/new"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-brand-600/20 transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create New Asset</span>
                    </Link>
                )}
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search assets by name or asset code..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <Filter className="w-3.5 h-3.5" />
                        <span>Filters:</span>
                    </div>

                    <select
                        value={assetType}
                        onChange={(e) => setAssetType(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="">All Types</option>
                        <option value="OFFICE">Office</option>
                        <option value="SCHOOL">School</option>
                        <option value="HOSPITAL">Hospital</option>
                    </select>

                    <select
                        value={lifecycleStatus}
                        onChange={(e) => setLifecycleStatus(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="">All Lifecycle Statuses</option>
                        <option value="PLANNED">Planned</option>
                        <option value="ACQUIRED">Acquired</option>
                        <option value="ACTIVE">Active</option>
                        <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                        <option value="RETIRED">Retired</option>
                        <option value="DISPOSED">Disposed</option>
                    </select>

                    <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="">All Conditions</option>
                        <option value="GOOD">Good</option>
                        <option value="FAIR">Fair</option>
                        <option value="POOR">Poor</option>
                    </select>

                    <select
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="">All Departments</option>
                        {departments.map((d) => (
                            <option key={d._id} value={d._id}>
                                {d.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Filter by city..."
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={assets}
                isLoading={loading}
                emptyTitle="No government assets found"
                emptyDescription="Adjust your search criteria or register a new asset."
            />
        </div>
    );
};

export default AssetListPage;

import React, { useEffect, useState } from 'react';
import { userAPI, departmentAPI } from '../../services/api';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Users, UserPlus, Filter, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import { getRoleLabel } from '../../utils/formatters';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter state
    const [roleFilter, setRoleFilter] = useState('');
    const [activeFilter, setActiveFilter] = useState('');

    // Create User Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'ASSET_MANAGER',
        departmentId: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchUsersAndDepts = async () => {
        try {
            setLoading(true);
            const params = {};
            if (roleFilter) params.role = roleFilter;
            if (activeFilter !== '') params.isActive = activeFilter;

            const [uRes, dRes] = await Promise.all([
                userAPI.getAllUsers(params),
                departmentAPI.getAllDepartments(),
            ]);

            if (uRes.status === 'success') setUsers(uRes.data);
            if (dRes.status === 'success') setDepartments(dRes.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsersAndDepts();
    }, [roleFilter, activeFilter]);

    const handleToggleActive = async (user) => {
        try {
            await userAPI.updateUser(user._id, { isActive: !user.isActive });
            setUsers((prev) =>
                prev.map((u) => (u._id === user._id ? { ...u, isActive: !u.isActive } : u))
            );
        } catch (err) {
            setError(err.message || 'Failed to update user status');
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const res = await userAPI.createUser(formData);
            if (res.status === 'success') {
                setIsModalOpen(false);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    role: 'ASSET_MANAGER',
                    departmentId: '',
                });
                fetchUsersAndDepts();
            }
        } catch (err) {
            setError(err.message || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            header: 'User Name',
            accessor: 'name',
            render: (u) => (
                <div>
                    <div className="font-bold text-slate-800">{u.name}</div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                </div>
            ),
        },
        {
            header: 'Role',
            accessor: 'role',
            render: (u) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                    {getRoleLabel(u.role)}
                </span>
            ),
        },
        {
            header: 'Department',
            accessor: 'departmentId',
            render: (u) => (
                <span className="text-xs text-slate-600">
                    {u.departmentId?.name || 'N/A'}
                </span>
            ),
        },
        {
            header: 'Phone',
            accessor: 'phone',
            render: (u) => <span className="text-xs text-slate-500">{u.phone || 'N/A'}</span>,
        },
        {
            header: 'Status',
            accessor: 'isActive',
            render: (u) => (
                <button
                    onClick={() => handleToggleActive(u)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${u.isActive
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        }`}
                    title="Click to toggle status"
                >
                    {u.isActive ? (
                        <>
                            <ToggleRight className="w-4 h-4 text-emerald-600" />
                            <span>Active</span>
                        </>
                    ) : (
                        <>
                            <ToggleLeft className="w-4 h-4 text-rose-600" />
                            <span>Inactive</span>
                        </>
                    )}
                </button>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="w-6 h-6 text-brand-600" />
                        User Account Management
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Create staff accounts, assign roles, and toggle account activation</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-brand-600/20 transition"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Staff User</span>
                </button>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <Filter className="w-4 h-4" />
                    <span>Filters:</span>
                </div>

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                    <option value="">All Roles</option>
                    <option value="ASSET_MANAGER">Asset Manager</option>
                    <option value="MAINTENANCE_STAFF">Maintenance Staff</option>
                    <option value="CITIZEN">Citizen</option>
                </select>

                <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                    <option value="">All Statuses</option>
                    <option value="true">Active Only</option>
                    <option value="false">Inactive Only</option>
                </select>
            </div>

            {/* Users Data Table */}
            <DataTable
                columns={columns}
                data={users}
                isLoading={loading}
                emptyTitle="No users found"
                emptyDescription="No system users match the current filter criteria."
            />

            {/* Create User Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New User Account"
            >
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Ramesh Chandra"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="ramesh@govt.in"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Password *
                            </label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Phone
                            </label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+91 9876543210"
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Role *
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="ASSET_MANAGER">Asset Manager</option>
                                <option value="MAINTENANCE_STAFF">Maintenance Staff</option>
                                <option value="CITIZEN">Citizen</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Department
                            </label>
                            <select
                                value={formData.departmentId}
                                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="">No Department Assigned</option>
                                {departments.map((dept) => (
                                    <option key={dept._id} value={dept._id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition shadow-sm"
                        >
                            {submitting ? 'Creating...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UserManagementPage;

import React, { useEffect, useState } from 'react';
import { departmentAPI } from '../../services/api';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Building, Plus, Edit2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const DepartmentManagementPage = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const res = await departmentAPI.getAllDepartments();
            if (res.status === 'success') {
                setDepartments(res.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch departments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleOpenCreate = () => {
        setEditingDept(null);
        setFormData({ name: '', description: '' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (dept) => {
        setEditingDept(dept);
        setFormData({ name: dept.name, description: dept.description || '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (editingDept) {
                await departmentAPI.updateDepartment(editingDept._id, formData);
            } else {
                await departmentAPI.createDepartment(formData);
            }
            setIsModalOpen(false);
            fetchDepartments();
        } catch (err) {
            setError(err.message || 'Failed to save department');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            header: 'Department Name',
            accessor: 'name',
            render: (d) => (
                <div className="font-bold text-slate-800 flex items-center gap-2">
                    <Building className="w-4 h-4 text-brand-600" />
                    <span>{d.name}</span>
                </div>
            ),
        },
        {
            header: 'Description',
            accessor: 'description',
            render: (d) => <span className="text-xs text-slate-500 max-w-md line-clamp-2">{d.description || 'N/A'}</span>,
        },
        {
            header: 'Created On',
            accessor: 'createdAt',
            render: (d) => <span className="text-xs text-slate-400">{formatDate(d.createdAt)}</span>,
        },
        {
            header: 'Actions',
            accessor: '_id',
            render: (d) => (
                <button
                    onClick={() => handleOpenEdit(d)}
                    className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition"
                    title="Edit Department"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Building className="w-6 h-6 text-brand-600" />
                        Government Departments
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Define organizational departments responsible for asset management</p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-brand-600/20 transition"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Department</span>
                </button>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            <DataTable
                columns={columns}
                data={departments}
                isLoading={loading}
                emptyTitle="No departments added"
                emptyDescription="Create your first government department to categorize physical assets."
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDept ? 'Edit Department' : 'Create New Department'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Department Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Department of Public Works"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Responsibilities and oversight scope..."
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
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
                            {submitting ? 'Saving...' : editingDept ? 'Update Department' : 'Create Department'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DepartmentManagementPage;

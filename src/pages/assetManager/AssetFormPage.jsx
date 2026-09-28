import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assetAPI, departmentAPI, userAPI } from '../../services/api';
import ImageUploader from '../../components/common/ImageUploader';
import ImageGallery from '../../components/common/ImageGallery';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Building2, Save, ArrowLeft, MapPin } from 'lucide-react';

const AssetFormPage = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        assetCode: '',
        name: '',
        assetType: 'OFFICE',
        description: '',
        departmentId: '',
        assetManagerId: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '20.5937',
        longitude: '78.9629',
        acquisitionDate: '',
        acquisitionCost: '',
        condition: 'GOOD',
        lifecycleStatus: 'PLANNED',
    });

    const [existingPhotos, setExistingPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [dRes, mRes] = await Promise.all([
                    departmentAPI.getAllDepartments(),
                    userAPI.getAllUsers({ role: 'ASSET_MANAGER' }),
                ]);
                if (dRes.status === 'success') setDepartments(dRes.data);
                if (mRes.status === 'success') setManagers(mRes.data);

                if (isEdit) {
                    const aRes = await assetAPI.getAsset(id);
                    if (aRes.status === 'success') {
                        const a = aRes.data;
                        setFormData({
                            assetCode: a.assetCode || '',
                            name: a.name || '',
                            assetType: a.assetType || 'OFFICE',
                            description: a.description || '',
                            departmentId: a.departmentId?._id || a.departmentId || '',
                            assetManagerId: a.assetManagerId?._id || a.assetManagerId || '',
                            address: a.address || '',
                            city: a.city || '',
                            state: a.state || '',
                            pincode: a.pincode || '',
                            latitude: a.latitude?.toString() || '20.5937',
                            longitude: a.longitude?.toString() || '78.9629',
                            acquisitionDate: a.acquisitionDate ? a.acquisitionDate.split('T')[0] : '',
                            acquisitionCost: a.acquisitionCost?.toString() || '',
                            condition: a.condition || 'GOOD',
                            lifecycleStatus: a.lifecycleStatus || 'PLANNED',
                        });
                        setExistingPhotos(a.photos || []);
                    }
                }
            } catch (err) {
                setError(err.message || 'Failed to load form metadata');
            } finally {
                setLoading(false);
            }
        };
        fetchMetadata();
    }, [id, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDeleteExistingPhoto = async (publicId) => {
        try {
            const res = await assetAPI.deleteAssetPhoto(id, publicId);
            if (res.status === 'success') {
                setExistingPhotos(res.data.photos || []);
            }
        } catch (err) {
            setError(err.message || 'Failed to delete photo');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.assetCode || !formData.name || !formData.departmentId || !formData.assetManagerId) {
            setError('Please fill in asset code, name, department, and asset manager.');
            return;
        }

        try {
            setSubmitting(true);
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== '') {
                    data.append(key, formData[key]);
                }
            });

            newPhotos.forEach((file) => {
                data.append('photos', file);
            });

            let res;
            if (isEdit) {
                res = await assetAPI.updateAsset(id, data);
            } else {
                res = await assetAPI.createAsset(data);
            }

            if (res.status === 'success') {
                navigate(`/asset-manager/assets/${res.data._id}`);
            }
        } catch (err) {
            setError(err.message || 'Failed to save asset details.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner text="Loading asset information..." />;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Assets
                </button>
                <h2 className="text-xl font-bold text-slate-900">
                    {isEdit ? 'Edit Asset Record' : 'Register New Government Asset'}
                </h2>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand-600 border-b border-slate-100 pb-2">
                        1. General Asset Profile
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Asset Code *
                            </label>
                            <input
                                type="text"
                                name="assetCode"
                                required
                                disabled={isEdit}
                                value={formData.assetCode}
                                onChange={handleChange}
                                placeholder="e.g. OFF-DL-001"
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60 font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Asset Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Secretariat Block A"
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Asset Type *
                            </label>
                            <select
                                name="assetType"
                                value={formData.assetType}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="OFFICE">Office</option>
                                <option value="SCHOOL">School</option>
                                <option value="HOSPITAL">Hospital</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Department *
                            </label>
                            <select
                                name="departmentId"
                                required
                                value={formData.departmentId}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="">Select Department</option>
                                {departments.map((d) => (
                                    <option key={d._id} value={d._id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Assigned Asset Manager *
                            </label>
                            <select
                                name="assetManagerId"
                                required
                                value={formData.assetManagerId}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="">Select Manager</option>
                                {managers.map((m) => (
                                    <option key={m._id} value={m._id}>
                                        {m.name} ({m.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows={2}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Provide building specifications or usage details..."
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                </div>

                {/* Location & Map Coordinates */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand-600 border-b border-slate-100 pb-2">
                        2. Location & Map Coordinates
                    </h3>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Address *
                        </label>
                        <input
                            type="text"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="e.g. Civil Lines, Near Circuit House"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                City *
                            </label>
                            <input
                                type="text"
                                name="city"
                                required
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="New Delhi"
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                State *
                            </label>
                            <input
                                type="text"
                                name="state"
                                required
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="Delhi"
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Pincode
                            </label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="110054"
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Latitude *
                            </label>
                            <input
                                type="number"
                                step="any"
                                name="latitude"
                                required
                                value={formData.latitude}
                                onChange={handleChange}
                                placeholder="28.6139"
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Longitude *
                            </label>
                            <input
                                type="number"
                                step="any"
                                name="longitude"
                                required
                                value={formData.longitude}
                                onChange={handleChange}
                                placeholder="77.2090"
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Condition & Financials */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand-600 border-b border-slate-100 pb-2">
                        3. Lifecycle & Condition
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Condition *
                            </label>
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="GOOD">Good</option>
                                <option value="FAIR">Fair</option>
                                <option value="POOR">Poor</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Lifecycle Status *
                            </label>
                            <select
                                name="lifecycleStatus"
                                value={formData.lifecycleStatus}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="PLANNED">Planned</option>
                                <option value="ACQUIRED">Acquired</option>
                                <option value="ACTIVE">Active</option>
                                <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                                <option value="RETIRED">Retired</option>
                                <option value="DISPOSED">Disposed</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Acquisition Date
                            </label>
                            <input
                                type="date"
                                name="acquisitionDate"
                                value={formData.acquisitionDate}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Acquisition Cost (₹)
                            </label>
                            <input
                                type="number"
                                name="acquisitionCost"
                                value={formData.acquisitionCost}
                                onChange={handleChange}
                                placeholder="5000000"
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Photos */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand-600 border-b border-slate-100 pb-2">
                        4. Asset Photographs
                    </h3>

                    {isEdit && existingPhotos.length > 0 && (
                        <div>
                            <p className="text-xs text-slate-500 mb-2">Existing Asset Photos:</p>
                            <ImageGallery
                                photos={existingPhotos}
                                canDelete={true}
                                onDeletePhoto={handleDeleteExistingPhoto}
                            />
                        </div>
                    )}

                    <ImageUploader files={newPhotos} setFiles={setNewPhotos} maxFiles={5} label="Upload New Photos" />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition shadow-md shadow-brand-600/20 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        <span>{submitting ? 'Saving Record...' : isEdit ? 'Update Asset' : 'Register Asset'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AssetFormPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI, assetAPI } from '../../services/api';
import ImageUploader from '../../components/common/ImageUploader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { AlertCircle, Send, ArrowLeft, Building2 } from 'lucide-react';

const ComplaintFormPage = () => {
    const navigate = useNavigate();
    const [assets, setAssets] = useState([]);
    const [formData, setFormData] = useState({
        assetId: '',
        title: '',
        description: '',
        category: 'STRUCTURAL',
        priority: 'MEDIUM',
    });
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const res = await assetAPI.getAssets({});
                if (res.status === 'success') {
                    setAssets(res.data);
                }
            } catch (err) {
                setError(err.message || 'Failed to load public assets list');
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.assetId || !formData.title || !formData.description) {
            setError('Please select an asset and fill in title and description.');
            return;
        }

        try {
            setSubmitting(true);
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key]);
            });
            photos.forEach((file) => {
                data.append('photos', file);
            });

            const res = await complaintAPI.createComplaint(data);
            if (res.status === 'success') {
                navigate(`/complaints/${res.data._id}`);
            }
        } catch (err) {
            setError(err.message || 'Failed to submit complaint.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner text="Loading public infrastructure list..." />;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    Raise Citizen Complaint
                </h2>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-brand-600" />
                        Target Asset / Property *
                    </label>
                    <select
                        name="assetId"
                        required
                        value={formData.assetId}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="">-- Select Affected Government Asset --</option>
                        {assets.map((a) => (
                            <option key={a._id} value={a._id}>
                                {a.name} ({a.assetType}) - {a.city}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Complaint Subject / Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Broken window glass in main hall"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                            Category *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            <option value="STRUCTURAL">Structural</option>
                            <option value="ELECTRICAL">Electrical</option>
                            <option value="PLUMBING">Plumbing</option>
                            <option value="CLEANLINESS">Cleanliness</option>
                            <option value="SECURITY">Security</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                            Perceived Priority *
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Detailed Issue Description *
                    </label>
                    <textarea
                        name="description"
                        rows={4}
                        required
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the exact location inside the asset and nature of damage..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>

                <div>
                    <ImageUploader
                        files={photos}
                        setFiles={setPhotos}
                        maxFiles={5}
                        label="Upload Proof Photographs (Max 5)"
                    />
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
                        className="px-6 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-md shadow-rose-600/20 flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        <span>{submitting ? 'Submitting...' : 'Submit Complaint'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ComplaintFormPage;

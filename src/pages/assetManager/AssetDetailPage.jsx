import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { assetAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import ImageGallery from '../../components/common/ImageGallery';
import MapView from '../../components/common/MapView';
import Timeline from '../../components/common/Timeline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import {
    Building2,
    MapPin,
    Calendar,
    IndianRupee,
    User,
    Building,
    Edit2,
    ArrowLeft,
    Wrench,
    Clock,
    ShieldCheck,
} from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';

const AssetDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [asset, setAsset] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const canManage = ['ADMIN', 'ASSET_MANAGER'].includes(user?.role);

    const fetchAssetDetails = async () => {
        try {
            setLoading(true);
            const res = await assetAPI.getAsset(id);
            if (res.status === 'success') {
                setAsset(res.data);
            }

            if (canManage) {
                const histRes = await assetAPI.getAssetHistory(id);
                if (histRes.status === 'success') {
                    setHistory(histRes.data);
                }
            }
        } catch (err) {
            setError(err.message || 'Failed to load asset details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssetDetails();
    }, [id]);

    const handleDeletePhoto = async (publicId) => {
        try {
            const res = await assetAPI.deleteAssetPhoto(id, publicId);
            if (res.status === 'success') {
                setAsset(res.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to delete photo');
        }
    };

    if (loading) return <LoadingSpinner text="Fetching asset details & history..." />;
    if (!asset) return <ErrorMessage message={error || 'Asset not found.'} />;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-md border border-brand-200">
                            {asset.assetCode}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                            {asset.assetType}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{asset.name}</h2>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {asset.address}, {asset.city}, {asset.state} - {asset.pincode || 'N/A'}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    {canManage && (
                        <Link
                            to={`/asset-manager/assets/edit/${asset._id}`}
                            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit Asset Record
                        </Link>
                    )}
                </div>
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Info + Map) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Metadata Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-brand-600" />
                            Specification & Attributes
                        </h3>

                        {asset.description && (
                            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                                {asset.description}
                            </p>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                            <div>
                                <span className="text-slate-400 block font-medium">Department</span>
                                <span className="font-bold text-slate-800 mt-0.5 block">{asset.departmentId?.name || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block font-medium">Asset Manager</span>
                                <span className="font-bold text-slate-800 mt-0.5 block">{asset.assetManagerId?.name || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block font-medium">Condition</span>
                                <div className="mt-1"><StatusBadge type="condition" value={asset.condition} /></div>
                            </div>
                            <div>
                                <span className="text-slate-400 block font-medium">Lifecycle Status</span>
                                <div className="mt-1"><StatusBadge type="lifecycle" value={asset.lifecycleStatus} /></div>
                            </div>
                            <div>
                                <span className="text-slate-400 block font-medium">Acquisition Date</span>
                                <span className="font-semibold text-slate-700 mt-0.5 block">{formatDate(asset.acquisitionDate)}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block font-medium">Acquisition Cost</span>
                                <span className="font-semibold text-slate-700 mt-0.5 block">{formatCurrency(asset.acquisitionCost)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Photo Gallery */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3">
                            Photo Directory ({asset.photos?.length || 0})
                        </h3>
                        <ImageGallery
                            photos={asset.photos}
                            canDelete={canManage}
                            onDeletePhoto={handleDeletePhoto}
                        />
                    </div>

                    {/* Map Location */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-800 text-base flex items-center justify-between border-b border-slate-100 pb-3">
                            <span className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-rose-600" />
                                Geographical Map Location
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                                {asset.latitude}, {asset.longitude}
                            </span>
                        </h3>
                        <MapView assets={[asset]} height="350px" />
                    </div>
                </div>

                {/* Right Column (History Timeline) */}
                <div className="space-y-6">
                    {canManage ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                            <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                Lifecycle Audit Trail
                            </h3>
                            <Timeline history={history} />
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
                            <h3 className="font-bold text-slate-800 text-sm mb-2">Public Information</h3>
                            <p className="text-xs text-slate-500">You are viewing public government asset specifications.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssetDetailPage;

import React, { useEffect, useState } from 'react';
import { assetAPI } from '../../services/api';
import MapView from '../../components/common/MapView';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { MapPin, Filter, Building2 } from 'lucide-react';

const CitizenMapViewPage = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [assetType, setAssetType] = useState('');
    const [city, setCity] = useState('');

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const params = {};
            if (assetType) params.assetType = assetType;
            if (city) params.city = city;

            const res = await assetAPI.getAssets(params);
            if (res.status === 'success') {
                setAssets(res.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch asset map markers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, [assetType, city]);

    if (loading) return <LoadingSpinner text="Initializing interactive asset map..." />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-brand-600" />
                        Interactive Public Asset Map
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Geographical distribution of government schools, offices, and hospitals</p>
                </div>

                {/* Filter Bar */}
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider pl-2">
                        <Filter className="w-3.5 h-3.5" />
                        <span>Map Filters:</span>
                    </div>

                    <select
                        value={assetType}
                        onChange={(e) => setAssetType(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="">All Asset Types</option>
                        <option value="OFFICE">Office</option>
                        <option value="SCHOOL">School</option>
                        <option value="HOSPITAL">Hospital</option>
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

            <ErrorMessage message={error} onClose={() => setError('')} />

            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                <MapView assets={assets} height="600px" detailsPathPrefix="/citizen/assets" />
            </div>
        </div>
    );
};

export default CitizenMapViewPage;

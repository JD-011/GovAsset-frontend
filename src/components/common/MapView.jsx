import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Building, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

// Fix Leaflet default icon URL issues in Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icon creation helper
const createCustomIcon = (type) => {
    let color = '#2563eb'; // Default blue
    if (type === 'OFFICE') color = '#3b82f6';
    if (type === 'SCHOOL') color = '#10b981';
    if (type === 'HOSPITAL') color = '#ef4444';

    const svgHtml = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" stroke="#ffffff" stroke-width="1.5">
      <path d="M12 0C7.03 0 3 4.03 3 9c0 5.25 7 13 9 15 2-2 9-9.75 9-15 0-4.97-4.03-9-9-9zm0 12c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
    </svg>
  `;

    return L.divIcon({
        html: svgHtml,
        className: 'custom-map-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

const MapController = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center && center[0] && center[1]) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
};

const MapView = ({ assets = [], center = [20.5937, 78.9629], zoom = 5, height = '450px', detailsPathPrefix = '/citizen/assets' }) => {
    // If single asset center, use higher zoom
    const activeCenter = assets.length === 1 && assets[0].latitude && assets[0].longitude
        ? [assets[0].latitude, assets[0].longitude]
        : center;

    const activeZoom = assets.length === 1 ? 14 : zoom;

    return (
        <div className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100" style={{ height }}>
            <MapContainer
                center={activeCenter}
                zoom={activeZoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <MapController center={activeCenter} zoom={activeZoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {assets.map((asset) => {
                    if (!asset.latitude || !asset.longitude) return null;
                    return (
                        <Marker
                            key={asset._id}
                            position={[asset.latitude, asset.longitude]}
                            icon={createCustomIcon(asset.assetType)}
                        >
                            <Popup>
                                <div className="p-1 min-w-[200px] text-slate-800">
                                    <div className="flex items-center gap-1.5 text-xs text-brand-600 font-semibold mb-1">
                                        <Building className="w-3.5 h-3.5" />
                                        <span>{asset.assetType}</span>
                                    </div>
                                    <h4 className="font-bold text-sm text-slate-900 leading-tight mb-1">{asset.name}</h4>
                                    <p className="text-xs text-slate-500 mb-2">{asset.address}, {asset.city}</p>

                                    <div className="flex items-center justify-between mb-3">
                                        <StatusBadge type="lifecycle" value={asset.lifecycleStatus} />
                                        <StatusBadge type="condition" value={asset.condition} />
                                    </div>

                                    <Link
                                        to={`${detailsPathPrefix}/${asset._id}`}
                                        className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-md transition"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        View Asset Details
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapView;

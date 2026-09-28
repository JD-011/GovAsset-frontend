import React, { useState } from 'react';
import { Image as ImageIcon, Trash2, Maximize2, X } from 'lucide-react';

const ImageGallery = ({ photos = [], onDeletePhoto, canDelete = false, emptyText = 'No photos available.' }) => {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    if (!photos || photos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                <ImageIcon className="w-8 h-8 mb-2 stroke-[1.5]" />
                <span className="text-xs font-medium text-slate-500">{emptyText}</span>
            </div>
        );
    }

    const handleDelete = async (e, publicId) => {
        e.stopPropagation();
        if (!onDeletePhoto) return;
        setDeletingId(publicId);
        try {
            await onDeletePhoto(publicId);
            if (selectedPhoto?.publicId === publicId) {
                setSelectedPhoto(null);
            }
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photos.map((photo, index) => (
                    <div
                        key={photo.publicId || index}
                        onClick={() => setSelectedPhoto(photo)}
                        className="group relative aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 cursor-pointer shadow-sm hover:shadow transition"
                    >
                        <img
                            src={photo.url}
                            alt={`Asset photo ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <div className="p-1.5 bg-white/90 rounded-full text-slate-800">
                                <Maximize2 className="w-4 h-4" />
                            </div>
                            {canDelete && onDeletePhoto && (
                                <button
                                    type="button"
                                    onClick={(e) => handleDelete(e, photo.publicId)}
                                    disabled={deletingId === photo.publicId}
                                    className="p-1.5 bg-rose-600/90 text-white rounded-full hover:bg-rose-700 transition"
                                    title="Remove Photo"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute -top-12 right-0 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img
                            src={selectedPhoto.url}
                            alt="Preview full size"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;

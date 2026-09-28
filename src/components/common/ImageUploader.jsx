import React, { useState } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';

const ImageUploader = ({ files, setFiles, maxFiles = 5, label = 'Upload Photos' }) => {
    const [previews, setPreviews] = useState([]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (!selectedFiles.length) return;

        const availableSlots = maxFiles - files.length;
        const filesToAdd = selectedFiles.slice(0, availableSlots);

        const newFiles = [...files, ...filesToAdd];
        setFiles(newFiles);

        const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);

        URL.revokeObjectURL(previews[index]);
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setPreviews(updatedPreviews);
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">{label}</label>
            {files.length < maxFiles && (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-brand-500 bg-slate-50 hover:bg-brand-50/30 rounded-xl cursor-pointer transition">
                    <UploadCloud className="w-8 h-8 text-brand-600 mb-2" />
                    <span className="text-xs font-semibold text-slate-700">Click to upload photos</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">PNG, JPG, JPEG (Max {maxFiles} files)</span>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            )}

            {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 pt-2">
                    {previews.map((src, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group bg-slate-100">
                            <img src={src} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 hover:scale-110 transition"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;

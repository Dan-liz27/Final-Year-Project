import React, { useRef, useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import ImageEditor from './ImageEditor';
import ImageQualityIndicator from './ImageQualityIndicator';
import { mlAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function ImageUpload({ onPredict, loading }) {
    const { t } = useTranslation();
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [metadata, setMetadata] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    const [editedFile, setEditedFile] = useState(null);
    const [qualityData, setQualityData] = useState(null);
    const [checkingQuality, setCheckingQuality] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);
    const fileInputRef = useRef(null);

    // Clipboard paste support
    useEffect(() => {
        const handlePaste = (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    handleFile(blob);
                    e.preventDefault();
                    break;
                }
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, []);

    const handleFile = async (file) => {
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error(t('imageUpload.invalidType'));
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error(t('imageUpload.tooLarge'));
            return;
        }

        // Store current file
        setCurrentFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);

            // Get image metadata
            const img = new Image();
            img.onload = () => {
                setMetadata({
                    name: file.name,
                    size: (file.size / 1024).toFixed(2), // KB
                    type: file.type,
                    width: img.width,
                    height: img.height,
                    lastModified: new Date(file.lastModified).toLocaleDateString()
                });
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);

        // TEMPORARILY DISABLED - Quality checker has CORS issues
        /*
        // Check image quality
        setCheckingQuality(true);
        try {
            const quality = await mlAPI.validateImage(file);
            setQualityData(quality);

            if (quality.overall_score < 60) {
                toast.warning('Image quality is low. Consider retaking for better results.');
            } else if (quality.overall_score >= 80) {
                toast.success('Image quality is good!');
            }
        } catch (error) {
            console.error('Quality check failed:', error);
            toast.error('Could not check image quality');
        } finally {
            setCheckingQuality(false);
        }
        */
    };

    const handleChange = (e) => {
        const file = e.target.files?.[0];
        handleFile(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer?.files?.[0];
        handleFile(file);
    };

    const handleEdit = () => {
        setShowEditor(true);
    };

    const handleEditorSave = (file, previewUrl) => {
        setEditedFile(file);
        setPreview(previewUrl);
        setShowEditor(false);

        // Update metadata for edited image
        const img = new Image();
        img.onload = () => {
            setMetadata({
                ...metadata,
                name: file.name,
                size: (file.size / 1024).toFixed(2),
                width: img.width,
                height: img.height,
                type: file.type
            });
        };
        img.src = previewUrl;
    };

    const handleEditorCancel = () => {
        setShowEditor(false);
    };

    const handleSubmit = async () => {
        if (!preview || !metadata) return;

        // Use edited file if available, otherwise convert preview to file
        let file = editedFile;
        if (!file) {
            const response = await fetch(preview);
            const blob = await response.blob();
            file = new File([blob], metadata.name, { type: metadata.type.includes('/') ? metadata.type : `image/${metadata.type}` });
        }

        await onPredict(file);
    };

    const handleReset = () => {
        setPreview(null);
        setMetadata(null);
        setEditedFile(null);
        setQualityData(null);
        setCurrentFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-lg shadow-md p-6 border border-gray-200 dark:border-cyan-500/20">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">{t('imageUpload.title')}</h2>

            {!preview ? (
                <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${dragActive
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10'
                        : 'border-gray-300 dark:border-gray-600 hover:border-cyan-400 dark:hover:border-cyan-500'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <svg
                        className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                        {t('imageUpload.dragDrop')}
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {t('imageUpload.formats')}
                    </p>
                    <p className="mt-2 text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
                        {t('imageUpload.clipboardTip')}
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleChange}
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Image Preview with Zoom/Pan */}
                    <div className="relative bg-gray-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-300 dark:border-slate-700">
                        <TransformWrapper
                            initialScale={1}
                            minScale={0.5}
                            maxScale={4}
                            centerOnInit={true}
                        >
                            {({ zoomIn, zoomOut, resetTransform }) => (
                                <>
                                    {/* Zoom Controls */}
                                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                                        <button
                                            onClick={() => zoomIn()}
                                            className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border border-gray-300 dark:border-slate-600"
                                            title="Zoom In"
                                        >
                                            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => zoomOut()}
                                            className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border border-gray-300 dark:border-slate-600"
                                            title="Zoom Out"
                                        >
                                            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => resetTransform()}
                                            className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border border-gray-300 dark:border-slate-600"
                                            title="Reset View"
                                        >
                                            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Image */}
                                    <TransformComponent
                                        wrapperClass="!w-full !h-96"
                                        contentClass="!w-full !h-full flex items-center justify-center"
                                    >
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="max-w-full max-h-96 object-contain"
                                        />
                                    </TransformComponent>
                                </>
                            )}
                        </TransformWrapper>
                    </div>

                    {/* Image Metadata */}
                    {metadata && (
                        <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('imageUpload.imageDetails')}</h3>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-gray-600 dark:text-gray-400">{t('imageUpload.name')}</div>
                                <div className="text-gray-800 dark:text-gray-200 font-medium truncate">{metadata.name}</div>

                                <div className="text-gray-600 dark:text-gray-400">{t('imageUpload.size')}</div>
                                <div className="text-gray-800 dark:text-gray-200 font-medium">{metadata.size} KB</div>

                                <div className="text-gray-600 dark:text-gray-400">{t('imageUpload.dimensions')}</div>
                                <div className="text-gray-800 dark:text-gray-200 font-medium">{metadata.width} × {metadata.height}</div>

                                <div className="text-gray-600 dark:text-gray-400">{t('imageUpload.type')}</div>
                                <div className="text-gray-800 dark:text-gray-200 font-medium">{metadata.type}</div>

                                <div className="text-gray-600 dark:text-gray-400">{t('imageUpload.modified')}</div>
                                <div className="text-gray-800 dark:text-gray-200 font-medium">{metadata.lastModified}</div>
                            </div>
                        </div>
                    )}

                    {/* Image Quality Indicator */}
                    {checkingQuality && (
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                            <div className="flex items-center justify-center gap-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"></div>
                                <span className="text-gray-600 dark:text-gray-400">{t('imageUpload.checkingQuality')}</span>
                            </div>
                        </div>
                    )}
                    {qualityData && !checkingQuality && (
                        <ImageQualityIndicator qualityData={qualityData} />
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleEdit}
                            disabled={loading}
                            className="px-6 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-200 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors disabled:opacity-50 border border-yellow-300 dark:border-yellow-700/50"
                        >
                            {t('imageUpload.editImage')}
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-blue-600 hover:shadow-lg'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('imageUpload.analyzing')}
                                </span>
                            ) : (
                                t('imageUpload.analyzeImage')
                            )}
                        </button>

                        <button
                            onClick={handleReset}
                            disabled={loading}
                            className="px-6 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-slate-700/50 hover:bg-gray-300 dark:hover:bg-slate-600/50 transition-colors disabled:opacity-50"
                        >
                            {t('imageUpload.reset')}
                        </button>
                    </div>

                    {/* Helpful Tips */}
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-700/50 rounded-lg p-3">
                        <p className="text-xs text-cyan-800 dark:text-cyan-300">
                            {t('imageUpload.zoomTip')}
                        </p>
                    </div>
                </div>
            )}

            {/* Image Editor Modal */}
            {showEditor && preview && (
                <ImageEditor
                    imageSrc={preview}
                    onSave={handleEditorSave}
                    onCancel={handleEditorCancel}
                />
            )}
        </div>
    );
}

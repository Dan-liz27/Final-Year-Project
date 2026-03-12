import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function ImageEditor({ imageSrc, onSave, onCancel }) {
    const [crop, setCrop] = useState({
        unit: '%',
        width: 80,
        height: 80,
        x: 10,
        y: 10
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);
    const [aspectRatio, setAspectRatio] = useState(null);
    const imgRef = useRef(null);
    const canvasRef = useRef(null);

    const handleRotate = (degrees) => {
        setRotation((prev) => (prev + degrees) % 360);
    };

    const handleFlipH = () => {
        setFlipH(!flipH);
    };

    const handleFlipV = () => {
        setFlipV(!flipV);
    };

    const handleAspectRatio = (ratio) => {
        setAspectRatio(ratio);
        if (ratio) {
            setCrop({
                ...crop,
                aspect: ratio
            });
        } else {
            const { aspect, ...rest } = crop;
            setCrop(rest);
        }
    };

    const getCroppedImg = () => {
        const image = imgRef.current;
        const canvas = canvasRef.current;

        if (!image || !canvas) return null;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // Set canvas size based on rotation
        const isRotated = rotation === 90 || rotation === 270;
        const cropWidth = completedCrop ? completedCrop.width * scaleX : image.naturalWidth;
        const cropHeight = completedCrop ? completedCrop.height * scaleY : image.naturalHeight;

        canvas.width = isRotated ? cropHeight : cropWidth;
        canvas.height = isRotated ? cropWidth : cropHeight;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'high';

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply transformations
        ctx.save();

        // Move to center for rotation
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Apply rotation
        ctx.rotate((rotation * Math.PI) / 180);

        // Apply flips
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

        // Calculate source and destination
        const sx = completedCrop ? completedCrop.x * scaleX : 0;
        const sy = completedCrop ? completedCrop.y * scaleY : 0;
        const sWidth = cropWidth;
        const sHeight = cropHeight;

        const dx = isRotated ? -cropHeight / 2 : -cropWidth / 2;
        const dy = isRotated ? -cropWidth / 2 : -cropHeight / 2;
        const dWidth = isRotated ? cropHeight : cropWidth;
        const dHeight = isRotated ? cropWidth : cropHeight;

        // Draw image
        ctx.drawImage(
            image,
            sx, sy, sWidth, sHeight,
            dx, dy, dWidth, dHeight
        );

        ctx.restore();

        return canvas;
    };

    const handleSave = () => {
        const canvas = getCroppedImg();
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'edited-image.jpg', { type: 'image/jpeg' });
                onSave(file, canvas.toDataURL('image/jpeg'));
            }
        }, 'image/jpeg', 0.95);
    };

    const handleReset = () => {
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
        setAspectRatio(null);
        setCrop({
            unit: '%',
            width: 80,
            height: 80,
            x: 10,
            y: 10
        });
        setCompletedCrop(null);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Image</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Crop, rotate, or flip your image before analysis
                    </p>
                </div>

                {/* Toolbar */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                    <div className="flex flex-wrap gap-4">
                        {/* Aspect Ratio */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Aspect:</span>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleAspectRatio(null)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${aspectRatio === null
                                            ? 'bg-cyan-500 text-white'
                                            : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    Free
                                </button>
                                <button
                                    onClick={() => handleAspectRatio(1)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${aspectRatio === 1
                                            ? 'bg-cyan-500 text-white'
                                            : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    1:1
                                </button>
                                <button
                                    onClick={() => handleAspectRatio(4 / 3)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${aspectRatio === 4 / 3
                                            ? 'bg-cyan-500 text-white'
                                            : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    4:3
                                </button>
                                <button
                                    onClick={() => handleAspectRatio(16 / 9)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${aspectRatio === 16 / 9
                                            ? 'bg-cyan-500 text-white'
                                            : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    16:9
                                </button>
                            </div>
                        </div>

                        {/* Rotate */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Rotate:</span>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleRotate(-90)}
                                    className="p-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                                    title="Rotate Left"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleRotate(90)}
                                    className="p-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                                    title="Rotate Right"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Flip */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Flip:</span>
                            <div className="flex gap-1">
                                <button
                                    onClick={handleFlipH}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${flipH
                                            ? 'bg-cyan-500 text-white'
                                            : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    ↔ Horizontal
                                </button>
                                <button
                                    onClick={handleFlipV}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${flipV
                                            ? 'bg-cyan-500 text-white'
                                            : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    ↕ Vertical
                                </button>
                            </div>
                        </div>

                        {/* Reset */}
                        <button
                            onClick={handleReset}
                            className="ml-auto px-4 py-1.5 text-sm font-medium bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            Reset All
                        </button>
                    </div>
                </div>

                {/* Image Editor */}
                <div className="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-slate-900">
                    <div className="flex items-center justify-center min-h-full">
                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspectRatio}
                        >
                            <img
                                ref={imgRef}
                                src={imageSrc}
                                alt="Edit"
                                style={{
                                    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                                    maxHeight: '60vh',
                                    maxWidth: '100%'
                                }}
                                className="transition-transform duration-200"
                            />
                        </ReactCrop>
                    </div>
                </div>

                {/* Hidden canvas for processing */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onCancel}
                            className="px-6 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-slate-700 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:shadow-lg transition-all"
                        >
                            Apply & Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

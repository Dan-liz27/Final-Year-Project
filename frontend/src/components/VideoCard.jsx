import React from 'react';
import { motion } from 'framer-motion';

export default function VideoCard({ video }) {
    const handleWatchVideo = () => {
        // Open YouTube video in new tab
        window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank', 'noopener,noreferrer');
    };

    return (
        <motion.div
            className="group cursor-pointer relative overflow-hidden rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            onClick={handleWatchVideo}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-slate-800 overflow-hidden">
                <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                    }}
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </motion.div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-white text-xs font-semibold">
                    {video.duration}
                </div>

                {/* Watch on YouTube Badge */}
                <div className="absolute top-3 right-3 bg-red-600 px-2 py-1 rounded text-white text-xs font-semibold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                    YouTube
                </div>
            </div>

            {/* Video Info */}
            <div className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 border-t-0 rounded-b-xl">
                <h4 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {video.title}
                </h4>
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                    {video.description}
                </p>

                {/* Watch Button */}
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                    <span>Watch on YouTube</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </div>
            </div>

            {/* Hover Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity -z-10" />
        </motion.div>
    );
}

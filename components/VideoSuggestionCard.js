import React from 'react';
import { motion } from 'framer-motion';

const VideoSuggestionCard = ({ video }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-100 flex flex-col h-full"
        >
            <div className="relative h-40 bg-slate-200">
                <img
                    src={video.thumbnail || "https://img.youtube.com/vi/placeholder/mqdefault.jpg"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/320x180.png?text=Video+Unavailable"; }}
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <svg className="w-12 h-12 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm-2 14.5v-9l6 4.5-6 4.5z" />
                    </svg>
                </div>
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs font-bold text-white uppercase tracking-wider">
                    {video.difficulty}
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-slate-800 text-lg mb-1 line-clamp-2">{video.title}</h3>

                {video.topic && (
                    <span className="text-xs font-semibold text-indigo-600 mb-2 uppercase tracking-wide">
                        विषय: {video.topic}
                    </span>
                )}

                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {video.description}
                </p>

                {video.reason && (
                    <div className="mt-auto pt-3 border-t border-slate-100">
                        <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            शिफारस: {video.reason}
                        </p>
                    </div>
                )}

                <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg text-center transition-colors"
                >
                    आता पहा
                </a>
            </div>
        </motion.div>
    );
};

export default VideoSuggestionCard;
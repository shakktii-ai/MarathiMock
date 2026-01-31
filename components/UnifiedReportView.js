import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import VideoSuggestionCard from '../components/VideoSuggestionCard';
import { getVideoSuggestions } from "../data/videoRecommendations";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function UnifiedReportView() {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            if (!token || !user) {
                // In a component we might not want to redirect, but show login message
                // window.location.href = '/login'; 
                return;
            }

            // Fetch consolidated report
            const res = await fetch(`/api/assessment/unifiedReport?userId=${user._id || user.id}&email=${user.email}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await res.json();

            if (data.error) throw new Error(data.error);

            setReportData(data);

            // Generate Video Suggestions based on scores
            const scoreParams = {
                mcq: data.sections.mcq.score,
                communication: data.sections.communication.score,
                aptitude: data.sections.aptitude.score
            };

            const suggestedVideos = getVideoSuggestions(scoreParams, 'General');
            setVideos(suggestedVideos);

        } catch (error) {
            console.error("Error fetching report:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!reportData) return (
        <div className="flex flex-col items-center justify-center text-white p-4 text-center py-20">
            <h1 className="text-2xl font-bold mb-4">अहवाल सापडला नाही</h1>
            <p className="text-slate-400 mb-8">आम्ही तुमचा मूल्यांकन डेटा पुनर्प्राप्त करू शकलो नाही.</p>
        </div>
    );

    const { summary, sections } = reportData;

    const chartData = {
        labels: ['MCQ', 'Communication', 'Aptitude', 'Remaining'],
        datasets: [
            {
                data: [sections.mcq.score, sections.communication.score, sections.aptitude.score, (summary.maxScore - summary.totalScore)],
                backgroundColor: [
                    '#6366f1', // Indigo (MCQ)
                    '#ec4899', // Pink (Comm)
                    '#8b5cf6', // Violet (Apt)
                    '#1e293b', // Slate-800 (Remaining)
                ],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className="text-white font-sans w-full animate-in fade-in zoom-in duration-300">

            {/* Header Section */}
            <div className="mb-12 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    मूल्यांकन कामगिरी
                </h1>
                <p className="text-slate-400 text-lg">
                    तुमच्या तांत्रिक, संभाषण आणि कल कौशल्यांचे सखोल विश्लेषण.
                </p>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

                {/* Main Score Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-white/10 rounded-3xl p-8 relative overflow-hidden flex items-center justify-between"
                >
                    <div className="relative z-10">
                        <h2 className="text-slate-300 font-medium mb-1">एकूण गुण</h2>
                        <div className="text-6xl font-bold text-white mb-2">
                            {summary.totalScore}
                            <span className="text-2xl text-slate-400 font-normal">/{summary.maxScore}</span>
                        </div>
                        <div className="px-3 py-1 bg-white/10 w-fit rounded-full text-sm">
                            {summary.percentage > 70 ? 'उत्कृष्ट कामगिरी 🌟' : summary.percentage > 40 ? 'चांगली प्रगती 📈' : 'सुधारणेची गरज 📚'}
                        </div>
                    </div>

                    <div className="h-32 w-32 md:h-40 md:w-40 relative z-10">
                        <Doughnut data={chartData} options={{ cutout: '70%', plugins: { legend: { display: false }, tooltip: { enabled: false } } }} />
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">
                            {Math.round(summary.percentage)}%
                        </div>
                    </div>

                    {/* BG glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                </motion.div>

                {/* Action Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 flex flex-col justify-center items-center text-center"
                >
                    <h3 className="text-xl font-bold mb-4">तुमचे गुण सुधारा</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        आमच्या व्हिडिओ लायब्ररीसह तुमच्या कमकुवत क्षेत्रांवर लक्ष केंद्रित करा.
                    </p>
                    <button
                        onClick={() => document.getElementById('recommendations').scrollIntoView({ behavior: 'smooth' })}
                        className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                    >
                        सूचना पहा &darr;
                    </button>
                </motion.div>

            </div>

            {/* Breakdown Section */}
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                सविस्तर विश्लेषण
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

                {/* MCQ Card */}
                <div className="bg-slate-900/50 border border-t-4 border-t-indigo-500 border-white/5 rounded-2xl p-6 hover:bg-slate-900 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold">MCQ / तांत्रिक</h3>
                        <span className="text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded text-xs">२० गुण</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{sections.mcq.score}</div>
                    <p className="text-slate-400 text-sm mb-4">
                        तुमच्या नवीनतम प्रश्नमंजुषा कामगिरीवर आधारित.
                    </p>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${sections.mcq.percentage}%` }}></div>
                    </div>
                </div>

                {/* Communication Card */}
                <div className="bg-slate-900/50 border border-t-4 border-t-pink-500 border-white/5 rounded-2xl p-6 hover:bg-slate-900 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold">संभाषण</h3>
                        <span className="text-pink-400 bg-pink-400/10 px-2 py-1 rounded text-xs">२० गुण</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{sections.communication.score}</div>
                    <p className="text-slate-400 text-sm mb-4">
                        तुमच्या बोलण्याच्या सरावातून प्राप्त.
                    </p>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${(sections.communication.score / 20) * 100}%` }}></div>
                    </div>
                </div>

                {/* Aptitude Card */}
                <div className="bg-slate-900/50 border border-t-4 border-t-purple-500 border-white/5 rounded-2xl p-6 hover:bg-slate-900 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold">कल / परिस्थिती</h3>
                        <span className="text-purple-400 bg-purple-400/10 px-2 py-1 rounded text-xs">१० गुण</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{sections.aptitude.score}</div>
                    <p className="text-slate-400 text-sm mb-4">
                        परिस्थितीजन्य निर्णय चाचण्यांवर आधारित.
                    </p>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(sections.aptitude.score / 10) * 100}%` }}></div>
                    </div>
                </div>

            </div>

            {/* Video Recommendations Section */}
            <div id="recommendations">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                    <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
                    वैयक्तिक सुधारणा योजना
                </h2>
                <p className="text-slate-400 mb-8">
                    तुमच्या सर्वात कमी गुण असलेल्या क्षेत्रांवर आधारित निवडक व्हिडिओ.
                </p>

                {videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video, idx) => (
                            <VideoSuggestionCard key={idx} video={video} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-green-900/20 border border-green-500/20 rounded-2xl p-8 text-center">
                        <h3 className="text-xl font-bold text-green-400 mb-2">खूप छान! 🌟</h3>
                        <p className="text-slate-300">
                            तुमचे गुण सर्व विभागांमध्ये चांगले आहेत. तुमची कामगिरी अशीच ठेवा!
                        </p>
                        <button
                            className="mt-4 text-green-400 hover:text-green-300 font-medium underline"
                            onClick={() => setVideos(getVideoSuggestions({ mcq: 0, communication: 0, aptitude: 0 }))} // Dummy trigger to show all
                        >
                            (तरीही सर्व व्हिडिओ पहा)
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}
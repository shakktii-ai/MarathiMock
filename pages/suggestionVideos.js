//pages/suggestionVideos.js
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { IoMdArrowBack } from "react-icons/io";

/* ================= HELPER: EXTRACT VIDEO ID ================= */
const getVideoId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

/* ================= COMPONENT: INLINE VIDEO CARD ================= */
const VideoCard = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // CRITICAL FIX: Handle missing video or missing URL safely
  if (!video) return null;
  
  // Ensure url is always a string so .includes() never crashes
  const safeUrl = video.url || ""; 
  const videoId = getVideoId(safeUrl);
  
  // 1. Determine Thumbnail URL
  // If backend provides one, use it. Otherwise, generate from ID.
  const thumbnailUrl = video.thumbnail || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "https://via.placeholder.com/640x360?text=No+Thumbnail");

  // 2. Determine Embed URL
  let embedUrl = "";
  
  if (videoId) {
    // Standard YouTube Video
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } else if (safeUrl.includes("search_query")) {
    // Search Query Link
    const searchMatch = safeUrl.match(/search_query=([^&]+)/);
    const query = searchMatch ? searchMatch[1] : video.title;
    embedUrl = `https://www.youtube.com/embed?listType=search&list=${query}&autoplay=1`;
  } else {
    // Fallback: If no URL exists, search by title
    const query = encodeURIComponent(video.title || "ITI Tutorial");
    embedUrl = `https://www.youtube.com/embed?listType=search&list=${query}&autoplay=1`;
  }

  return (
    <motion.div
      whileHover={!isPlaying ? { y: -5 } : {}}
      className="bg-slate-900 rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all duration-300 flex flex-col h-full shadow-lg"
    >
      {/* VIDEO AREA */}
      <div className="aspect-video w-full bg-black relative">
        {isPlaying ? (
          // STATE: PLAYING (Show Iframe)
          <iframe
            src={embedUrl}
            title={video.title || "Video"}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          // STATE: PAUSED (Show Thumbnail)
          <div 
            className="w-full h-full relative cursor-pointer group"
            onClick={() => setIsPlaying(true)}
          >
            <img 
              src={thumbnailUrl} 
              alt={video.title || "Video"}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-300"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/640x360?text=Video+Unavailable'; }}
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all duration-300">
              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition duration-300">
                <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <span className="absolute bottom-3 text-xs font-bold text-white bg-black/60 px-2 py-1 rounded backdrop-blur-md opacity-0 group-hover:opacity-100 transition delay-100">
                येथे क्लिक करून पहा (Click to Play)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* TEXT AREA */}
      <div className="p-5 flex flex-col flex-1 border-t border-white/5 bg-slate-900">
        <h3 className="text-base font-bold text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">
          {video.title || "No Title"}
        </h3>
        <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
          {video.description || "अधिक माहितीसाठी हा व्हिडिओ पहा."}
        </p>
      </div>
    </motion.div>
  );
};

/* ================= MAIN PAGE COMPONENT ================= */
export default function SuggestedVideos() {
  const router = useRouter();
  const [videoGroups, setVideoGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

// const fetchVideos = async () => {
//   try {
//     const userStr = localStorage.getItem("user");
//     if (!userStr) { 
//       router.push("/login"); 
//       return; 
//     }

//     const user = JSON.parse(userStr);

//     // 👇 You can dynamically set subject if stored
//     const subject = user.selectedSubject || "PCB";

//     const res = await fetch(`/api/randomVideos?subject=${subject}`);
//     const data = await res.json();

//     if (data.videos?.length > 0) {
//       setVideoGroups([
//         {
//           id: "current",
//           subject: subject,
//           date: new Date().toLocaleDateString("mr-IN"),
//           videos: data.videos
//         }
//       ]);
//     }

//   } catch (error) {
//     console.error("Failed to fetch videos", error);
//   } finally {
//     setLoading(false);
//   }
// };
const fetchVideos = async () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);

    const res = await fetch(`/api/randomVideos?email=${user.email}`);
    const data = await res.json();

    if (!data.groups || data.groups.length === 0) {
      setLoading(false);
      return;
    }

    const formattedGroups = data.groups.map(group => ({
      id: group.testId,
      subject: group.subject,
      date: new Date(group.date).toLocaleDateString("mr-IN"),
      videos: group.videos
    }));

    setVideoGroups(formattedGroups);

  } catch (error) {
    console.error("Failed to fetch videos", error);
  } finally {
    setLoading(false);
  }
};


  // const fetchVideos = async () => {
  //   try {
  //     const userStr = localStorage.getItem("user");
  //     if (!userStr) { router.push("/login"); return; }
      
  //     const user = JSON.parse(userStr);
  //     const res = await fetch(`/api/get-reports?email=${user.email}`);
  //     const data = await res.json();

  //     if (data.reports) {
  //       const groups = data.reports
  //         .filter(r => r.aiReport?.videoSuggestions?.length > 0)
  //         .map(report => ({
  //           id: report._id,
  //           subject: report.technicalAssessment?.subject || "General ITI",
  //           date: new Date(report.createdAt).toLocaleDateString("mr-IN"),
  //           videos: report.aiReport.videoSuggestions
  //         }))
  //         .sort((a, b) => new Date(b.date) - new Date(a.date));

  //       setVideoGroups(groups);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch videos", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <Head>
        <title>व्हिडिओ ट्युटोरियल्स (Video Tutorials)</title>
      </Head>

      <div className="min-h-screen bg-slate-950 text-white px-4 py-12 md:px-12">
         <div className="mb-4 ">
              <button 
                onClick={() => router.push('/')} 
                className="flex items-center "
              >
                  <IoMdArrowBack className="w-8 h-8 text-gray-100 " />
              </button>
            </div>
        {/* HEADER */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            व्हिडिओ ट्युटोरियल्स
            </h1>
          </div>
          <p className="text-slate-400 max-w-2xl text-lg">
            तुमच्या मागील परीक्षांमधील कामगिरीवर आधारित खास व्हिडिओ ट्युटोरियल्स.
            
          </p>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-500"></div>
            <p className="text-slate-500 animate-pulse">व्हिडिओ लोड होत आहेत...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && videoGroups.length === 0 && (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-white/5 mx-auto max-w-2xl">
           
            <h3 className="text-2xl font-bold text-slate-300">कोणतेही व्हिडिओ सापडले नाहीत</h3>
            <p className="text-slate-500 mt-2">तुमची पहिली चाचणी पूर्ण केल्यानंतर येथे व्हिडिओ दिसतील.</p>
          </div>
        )}

        {/* VIDEO GROUPS */}
        <div className="max-w-7xl mx-auto space-y-16">
          {videoGroups.map((group) => (
            <div key={group.id} className="relative">
              {/* Section Header */}
              <div className="flex flex-wrap items-end gap-4 mb-8 border-b border-white/10 pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-indigo-400">
                  {group.subject}
                </h2>
                <span className="text-slate-500 text-sm font-mono mb-1.5 bg-slate-900 px-3 py-1 rounded-full border border-white/10">
                  चाचणी दिनांक: {group.date}
                </span>
              </div>

              {/* Video Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.videos.map((video, idx) => (
                  <VideoCard key={idx} video={video} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
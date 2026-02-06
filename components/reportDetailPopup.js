import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/router";
import { jsPDF } from "jspdf";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

/* ================= SCORE CIRCLE ================= */
const ScoreCircleSmall = ({ obtained = 0, size = "sm" }) => {
  const percentage = Math.min(Math.max(obtained || 0, 0), 100);
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let colorClass = "text-red-500";
  if (percentage >= 80) colorClass = "text-emerald-400";
  else if (percentage >= 60) colorClass = "text-blue-400";
  else if (percentage >= 40) colorClass = "text-yellow-400";

  const sizeClass = size === "lg" ? "w-28 h-28" : "w-16 h-16";
  const fontSize = size === "lg" ? "text-2xl" : "text-sm";

  return (
    <div className={`relative flex items-center justify-center ${sizeClass}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
        <circle
          className="text-slate-800"
          strokeWidth="3"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="20"
          cy="20"
        />
        <circle
          className={`${colorClass} transition-all duration-700`}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="20"
          cy="20"
        />
      </svg>
      <div className={`absolute ${colorClass} font-bold`}>
        <span className={fontSize}>{percentage}%</span>
      </div>
    </div>
  );
};

/* ================= SECTION CARD ================= */
function SectionCard({ title, score, markdown }) {
  return (
    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-10 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-indigo-400">
          {title}
        </h2>
        <ScoreCircleSmall obtained={score} size="sm" />
      </div>

      <div className="prose prose-invert max-w-none text-left text-white">
        <ReactMarkdown
  components={{
    h1: ({ node, ...props }) => (
      <h1
        className="text-2xl md:text-3xl font-extrabold text-white mt-8 mb-4 border-b border-white/10 pb-3"
        {...props}
      />
    ),
    h2: ({ node, ...props }) => (
      <h2
        className="text-xl md:text-2xl font-bold text-indigo-300 mt-6 mb-3"
        {...props}
      />
    ),
    h3: ({ node, ...props }) => (
      <h3
        className="text-lg font-semibold text-white mt-4 mb-2"
        {...props}
      />
    ),
    p: ({ node, ...props }) => (
      <p
        className="text-sm md:text-base text-slate-300 leading-relaxed mb-4"
        {...props}
      />
    ),
    li: ({ node, ...props }) => (
      <li
        className="text-sm md:text-base text-slate-300 mb-2 ml-5 list-disc"
        {...props}
      />
    ),
    ul: ({ node, ...props }) => (
      <ul className="mb-5 space-y-2" {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className="mb-5 space-y-2 list-decimal ml-5" {...props} />
    ),
    strong: ({ node, ...props }) => (
      <strong className="text-white font-semibold" {...props} />
    ),
    hr: () => (
      <div className="border-t border-white/10 my-6" />
    )
  }}
>
  {markdown || "अहवाल उपलब्ध नाही."}
</ReactMarkdown>

      </div>
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */
function ReportDetailPopup({ user, isOpen, setIsOpen }) {
  const router = useRouter();

  const [reports, setReports] = useState([]);
  const [reportVisibility, setReportVisibility] = useState([]);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  /* ================= FETCH REPORTS ================= */
  useEffect(() => {
    if (!user?.email) return;

    const fetchReports = async () => {
      try {
        const response = await fetch(
          `/api/get-reports?email=${encodeURIComponent(user.email)}`
        );
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data = await response.json();
        const sorted = (data.reports || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReports(sorted);
        setReportVisibility(new Array(sorted.length).fill(false));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchReports();
  }, [user]);

  const toggleReport = (index) => {
    setReportVisibility((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

 const handleClosee = (e) => {
  e.stopPropagation();
  setIsOpen(false);
};


  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-md px-4 sm:px-6 md:px-8 py-6"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 40 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-[95vw] sm:max-w-xl md:max-w-3xl lg:max-w-5xl bg-gradient-to-br from-[#0f172a] to-[#111827] rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="px-6 py-6 text-center relative border-b border-white/10 bg-[#0f1b35] sticky top-0 z-20">
            <button
              onClick={handleClose}
              className="absolute left-6 top-6 text-white hover:text-indigo-300 transition"
            >
              <IoIosArrowBack size={24} />
            </button>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              मुलाखत अहवाल
            </h2>
          </div>

          {/* CONTENT */}
          <div className="max-h-[75vh] overflow-y-auto px-4 sm:px-6 md:px-8 py-6">
            {error && (
              <div className="text-red-400 text-center">{error}</div>
            )}

            {reports.length === 0 && (
              <div className="text-center text-gray-400">
                अहवाल उपलब्ध नाही.
              </div>
            )}

            {reports.map((report, index) => (
              <div
                key={index}
                className="bg-slate-800/50 border border-white/10 rounded-2xl mb-6 overflow-hidden"
              >
                <div
                  className="bg-indigo-600 p-4 cursor-pointer flex justify-between items-center text-white"
                  onClick={() => toggleReport(index)}
                >
                  <span>
                    {reportVisibility[index] ? "रिपोर्ट लपवा" : "रिपोर्ट पहा"}
                  </span>
                  <span className="text-xs">
                    {new Date(report.createdAt).toLocaleString("mr-IN")}
                  </span>
                </div>

                {reportVisibility[index] && (
                  <div className="p-6">
                    <SectionCard
                      title="टेक्निकल असेसमेंट"
                      score={report.technicalAssessment?.percentage}
                      markdown={report.aiReport?.technicalReport}
                    />

                    <SectionCard
                      title="कम्युनिकेशन असेसमेंट"
                      score={report.voiceInterview?.percentage}
                      markdown={report.aiReport?.communicationReport}
                    />

                    <SectionCard
                      title="सिच्युएशन असेसमेंट"
                      score={report.situationAssessment?.percentage}
                      markdown={report.aiReport?.situationReport}
                    />

                {/* ================= VIDEO PROGRESS ================= */}
<div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-10 mb-8">
  <h2 className="text-xl md:text-2xl font-bold text-indigo-400 mb-6">
    व्हिडिओ प्रगती (Video Progress)
  </h2>

  {report.aiReport?.videoSuggestions?.length > 0 ? (
    <div className="space-y-4">
      {report.aiReport.videoSuggestions.map((video, vidIndex) => {
        const minutes = Math.floor((video.watchTime || 0) / 60);
        const seconds = (video.watchTime || 0) % 60;

        return (
          <div
            key={vidIndex}
            className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-white/5"
          >
            <div>
              <p className="text-white font-medium text-sm md:text-base">
                {video.title}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Watch Time: {minutes}m {seconds}s
              </p>
            </div>

            <div>
              {video.watched ? (
                <span className="text-green-400 font-bold">
                  ✅ Completed
                </span>
              ) : (
                <span className="text-yellow-400 font-semibold">
                   In Progress
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Overall Status */}
      {(() => {
        const total = report.aiReport.videoSuggestions.length;
        const completed = report.aiReport.videoSuggestions.filter(v => v.watched).length;

        return (
          <div className="mt-6 p-4 bg-slate-800 rounded-xl text-center border border-white/5">
            {completed === total ? (
              <p className="text-green-400 font-bold text-lg">
                ✅ All Videos Completed
              </p>
            ) : (
              <p className="text-indigo-300 font-semibold">
                {completed} / {total} Videos Completed
              </p>
            )}
          </div>
        );
      })()}
    </div>
  ) : (
    <p className="text-slate-400">No videos available.</p>
  )}
</div>


                  </div>
                  
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export default ReportDetailPopup;

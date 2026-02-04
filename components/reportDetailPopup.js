

// import React, { useState, useEffect } from 'react';
// import { IoIosArrowBack } from "react-icons/io";
// import { useRouter } from 'next/router';
// import { CircularProgressbar } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
// import { jsPDF } from "jspdf";

// function ReportDetailPopup({ user, isOpen, setIsOpen }) {
//   if (!isOpen ) return null;
//   const router = useRouter();

//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [isEmailFetched, setIsEmailFetched] = useState(false);
//   const [visibility, setVisibility] = useState({
//     report: false,
//     previousReports: false,
//   });
//   const [reportVisibility, setReportVisibility] = useState([]);

//   const handleClosee = (e) => {
//     e.stopPropagation();  // Prevent the click event from propagating to the parent
//     setIsOpen(false); // Close the modal
//   };

//   const extractScore = (report, scoreType) => {
//     // console.log("Extracting score from:", report);s

//     if (!report || !report.reportAnalysis) {
//       return 0; // Return 0 if no report or reportAnalysis field is available
//     }



//     // const match = report.reportAnalysis.match(scoreRegex);
//     const regexNoParentheses = new RegExp(`${scoreType}:\\s*(\\d+\\/10)`, 'i');

//     // Regex to match '(2/10)' with parentheses
//     const regexWithParentheses = new RegExp(`${scoreType}:\\s*\\((\\d+\\/10)\\)`, 'i');


//     const match = report.reportAnalysis.match(regexNoParentheses) || report.reportAnalysis.match(regexWithParentheses);


//     if (match) {
//       return parseInt(match[1], 10); // Return the numeric value found
//     }

//     return 0; // Return 0 if no score is found
//   };
  
//   const extractScoreAndFeedback = (report, category) => {
//     // console.log(report);

//     if (!report || !report.reportAnalysis) {
//       return { score: 0, feedback: 'No data available.' };
//     }

//     // Regex to extract score (format: "Technical Proficiency: 2/10")
//     const scoreRegex = new RegExp(`${category}:\\s*(\\d+\\/10)`, 'i');//**Technical Proficiency: 0/10**
//     const regexWithParentheses = new RegExp(`${category}:\\s*\\((\\d+\\/10)\\)`, 'i');//**Technical Proficiency: (0/10)**
//     const scoreStarRegex = new RegExp(`${category}:\\*\\*\\s*(\\d+/10)`, 'i');  //**Technical Proficiency:** 0/10

//     const scoreoverallRegex = new RegExp(`${category}:\\s*(\\d+\\/50)`, 'i');
//     const regexWithoverallParentheses = new RegExp(`${category}:\\s*\\((\\d+\\/50)\\)`, 'i');
//     const scoreStarOverallRegex = new RegExp(`${category}:\\*\\*\\s*(\\d+/50)`, 'i');

//     const feedbackRegex = new RegExp(`${category}:\\s*(\\d+/10)\\s*([^]*?)(?=\n[A-Z][a-zA-Z ]+:|Overall|$)`, 'i');
//     const feedbackRegexParentheses = new RegExp(`${category}:\\s*\\((\\d+/10)\\)\\s*([^]*?)(?=\n[A-Z][a-zA-Z ]+:|Overall Report|$)`, 'i');
//     const feedbackRegexStarParentheses = new RegExp(`${category}:\\*\\*\\s*(\\d+/10)\\s*([^]*?)(?=\n[A-Z][a-zA-Z ]+:|Overall Report|$)`, 'i');
    
//     const feedbackOverallRegex = new RegExp(`${category}:\\s*(\\d+/50)\\s*([^]*?)(?=\n[A-Z][a-zA-Z ]+:|Overall|$)`, 'i');
//     const feedbackRegexOverallParentheses = new RegExp(`${category}:\\s*\\((\\d+/50)\\)\\s*([^]*?)(?=\n[A-Z][a-zA-Z ]+:|Overall Report|$)`, 'i');
//     const feedbackRegexStarOverallParentheses = new RegExp(`${category}:\\*\\*\\s*(\\d+/50)\\s*([^]*?)(?=\n[A-Z][a-zA-Z ]+:|Overall Report|$)`, 'i');



//     const scoreMatch = report.reportAnalysis.match(scoreRegex) || report.reportAnalysis.match(regexWithParentheses) || report.reportAnalysis.match(scoreoverallRegex) || report.reportAnalysis.match(regexWithoverallParentheses)||report.reportAnalysis.match(scoreStarRegex)||report.reportAnalysis.match(scoreStarOverallRegex)
//     const feedbackMatch = report.reportAnalysis.match(feedbackRegex) || report.reportAnalysis.match(feedbackRegexParentheses) ||report.reportAnalysis.match(feedbackOverallRegex) || report.reportAnalysis.match(feedbackRegexOverallParentheses)||report.reportAnalysis.match(feedbackRegexStarParentheses)||report.reportAnalysis.match(feedbackRegexStarOverallParentheses)
//     // console.log(feedbackMatch);
//     const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
//     const feedback = feedbackMatch ? feedbackMatch[0] : 'No feedback available.';

//     return { score, feedback };
//   };

//   // Extract Overall Score

//   // Extract Recommendations
//   const extractRecommendations = (report) => {
//     const regex = /Recommendation:([\s\S]*?)(?=(\n|$))/i;
//     const match = report.reportAnalysis.match(regex);
//     return match ? match[1].trim() : 'No recommendations available.';
//   };

//   // Fetch email from localStorage
//   useEffect(() => {
//     const userFromStorage = user
//     if (userFromStorage) {
//       // const parsedUser = JSON.parse(userFromStorage);
//       const email = userFromStorage.email;

//       if (email) {
//         setEmail(email);
//         setIsEmailFetched(true);
//         setVisibility((prevVisibility) => ({
//           ...prevVisibility,
//           previousReports: true,
//         }));
//       } else {
//         setError("Email is missing in localStorage");
//       }
//     } else {
//       setError("No user data found in localStorage");
//     }
//   }, []);

//   // Fetch reports when email is set
//   useEffect(() => {
//     if (email && isEmailFetched) {
//       const fetchReportsByEmail = async () => {
//         try {
//           const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/saveAndGetReport?email=${email}`);
//           if (!response.ok) {
//             throw new Error(`Failed to fetch reports, status: ${response.status}`);
//           }
//           const data = await response.json();
//           if (data.reports && data.reports.length > 0) {
//             const sortedReports = data.reports.sort((a, b) => {
//               const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
//               const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
//               return dateB - dateA;
//             });
//             setReports(sortedReports);
//             setReportVisibility(new Array(sortedReports.length).fill(false));
//           } else {
//             setReports([]);
//           }
//         } catch (err) {
//           setError(`Error fetching reports: ${err.message}`);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchReportsByEmail();
//     }
//   }, [email, isEmailFetched]);

//   // Handle Go Back Logic
//   const goBack = () => {
//     if (document.referrer.includes('/report')) {
//       router.push('/');
//     } else {
//       router.back('/');
//     }
//   };

//   // Handle toggle visibility of report sections
//   const toggleVisibility = (section) => {
//     setVisibility((prevVisibility) => ({
//       ...prevVisibility,
//       [section]: !prevVisibility[section],
//     }));
//   };

//   // Toggle visibility for individual reports
//   const toggleIndividualReportVisibility = (index) => {
//     setReportVisibility((prevVisibility) => {
//       const newVisibility = [...prevVisibility];
//       newVisibility[index] = !newVisibility[index];
//       return newVisibility;
//     });
//   };

//   // Generate PDF Report
//   const downloadReport = (reportContent, report) => {
//     const doc = new jsPDF();
//     const reportDate = report.createdAt ? new Date(report.createdAt).toLocaleString() : "Unknown Date";
//     let marginX = 20;
//     let marginY = 20;
//     let pageHeight = doc.internal.pageSize.height;

//     // Title
//     doc.setFontSize(20);
//     doc.text("Interview Report", doc.internal.pageSize.width / 2, marginY, { align: "center" });

//     // Report Role and Date
//     marginY += 15;
//     doc.setFontSize(14);
//     doc.text(`Role: ${report.role}`, marginX, marginY);
//     marginY += 10;
//     doc.text(`Date: ${reportDate}`, marginX, marginY);

//     // Analysis Header
//     marginY += 15;
//     doc.setFontSize(14);
//     doc.text("Analysis:", marginX, marginY);

//     // Wrap long content
//     doc.setFontSize(12);
//     marginY += 10;
//     let wrappedText = doc.splitTextToSize(reportContent.replace(/<[^>]*>/g, ' '), 170);
//     wrappedText.forEach(line => {
//       if (marginY + 10 > pageHeight - 20) {
//         doc.addPage();
//         marginY = 20;
//       }
//       doc.text(line, marginX, marginY);
//       marginY += 7;
//     });

//     // Scores Section
//     marginY += 10;
//     const scores = [
//       { label: 'Technical Proficiency', score: extractScore(report, 'Technical Proficiency') },
//       { label: 'Communication', score: extractScore(report, 'Communication') },
//       { label: 'Decision-Making', score: extractScore(report, 'Decision-Making') },
//       { label: 'Confidence', score: extractScore(report, 'Confidence') },
//       { label: 'Language Fluency', score: extractScore(report, 'Language Fluency') },
//       { label: 'Overall Score', score: extractScore(report, 'Overall Score') },
//     ];

//     scores.forEach((score) => {
//       if (marginY + 15 > pageHeight - 20) {
//         doc.addPage();
//         marginY = 20;
//       }
//       doc.setFontSize(12);
//       doc.text(`${score.label}:`, marginX, marginY);

//       // Progress Bar (Replaces Circle)
//       let progressWidth = (score.score / 10) * 50;
//       doc.setFillColor(50, 150, 250); // Blue color
//       doc.rect(marginX + 80, marginY - 5, progressWidth, 5, "F"); // Progress bar
//       doc.text(`${score.score}/10`, marginX + 140, marginY);

//       marginY += 15;
//     });

//     // Separator Line
//     if (marginY + 10 > pageHeight - 20) {
//       doc.addPage();
//       marginY = 20;
//     }
//     doc.setLineWidth(0.5);
//     doc.line(marginX, marginY, 190, marginY);
//     marginY += 10;

//     // Recommendations Section
//     if (marginY + 10 > pageHeight - 20) {
//       doc.addPage();
//       marginY = 20;
//     }
//     doc.setFontSize(12);
//     doc.text("Recommendations:", marginX, marginY);
//     marginY += 10;
//     doc.setFontSize(12);
//     doc.text(extractRecommendations(report), marginX, marginY);

//     // Save the PDF
//     doc.save(`report_${report.role}_${reportDate.replace(/[:/,]/g, '-')}.pdf`);
//   };

//   if (error) {
//     return <div>Error: {error}</div>;
//   }




//   const ScoreCard = ({ label, score, feedback }) => {
//     const isOverallScore = label === 'Overall Score';
//     const maxScore = isOverallScore ? 50 : 10;  // Set max score to 50 for Overall Score, else 10
//     const scoreText = isOverallScore ? `${score}/50` : `${score}/10`; // Display score accordingly
    
//     return (
//       <div className="card-container text-black">
//         <div className="card relative w-full h-full">
//           {/* Front Side */}
//           <div className="front flex justify-center items-center p-4 bg-[#b393f8] rounded-lg">
//             <div>
//               <h5 className="text-xl font-semibold">{label}</h5>
//               <div className="mt-4">
//                 <CircularProgressbar
//                   value={score}
//                   maxValue={maxScore} // Dynamically set maxValue
//                   text={scoreText}  // Dynamically set text
//                   strokeWidth={12}
//                   styles={{
//                     path: { stroke: '#0700e7' },
//                     trail: { stroke: '#e0e0e0' },
//                     text: { fill: '#000000', fontSize: '18px', fontWeight: 'bold' },
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
  
//           {/* Back Side */}
//           <div className="back flex flex-col justify-center items-center p-4 bg-[#b393f8] rounded-lg overflow-y-auto">
//             <h5 className="text-xl font-semibold">{label} - तपशील</h5>
//             <p className="mt-4 text-sm">
//               {feedback.split(" ").slice(0, 32).join(" ")}...
//             </p>
  
//             <p className="mt-4 text-sm">अधिक जाणून घ्या</p>
//           </div>
//         </div>
//       </div>
//     );
//   };
  

// return (
//     <div
//       className="modal-background text-white"
//       onClick={handleClosee} // Close modal if clicked outside
//     >
//       <div
//         className="modal-container"
//         onClick={(e) => e.stopPropagation()} // Prevent closing if clicked inside modal
//       >
//         <div className="modal-header">
//           <div className="back-button" onClick={handleClosee}>
//             <IoIosArrowBack />
//           </div>
//           <h1 className="text-center">मुलाखत अहवाल</h1>
//         </div>
        
//         <div className="mx-auto mt-5">
//           {visibility.previousReports && (
//             <div className="mx-auto">
//               {reports && reports.length > 0 ? (
//                 reports.map((report, index) => (
//                   <div
//                     key={index}
//                     className="bg-transparent shadow-lg rounded-lg p-2 max-w-2xl mx-auto"
//                   >
//                     <div
//                       className="bg-purple-500 text-white p-4 rounded-t-lg cursor-pointer flex justify-between items-center"
//                       onClick={() => toggleIndividualReportVisibility(index)}
//                     >
//                       {/* Hide the toggle text if the report is visible */}
//                       <span>{reportVisibility[index] ? 'Hide Report' : 'Show Report'} ▼</span>
//                       <span className="text-sm">{new Date(report.createdAt).toLocaleString()}</span>
//                     </div>

//                     {reportVisibility[index] && (
//                       <div className="p-4">
//                         <h2 className="text-lg font-semibold">
//                           <strong>पद:</strong> {report.role}
//                         </h2>
//                         <div className="report-analysis mt-4">
//                           <h4 className="text-xl font-semibold mb-2">
//                             <strong>परीक्षण</strong>
//                           </h4>

//                           <div className="score-cards-container">
//                             {['Technical Proficiency', 'Communication', 'Decision-Making', 'Confidence', 'Language Fluency', 'Overall Score'].map((category) => {
//                               const { score, feedback } = extractScoreAndFeedback(report, category);
//                               return <ScoreCard key={category} label={category} score={score} feedback={feedback} />;
//                             })}
//                           </div>

//                           <button
//                             className="button mt-4"
//                             onClick={() => downloadReport(report.reportAnalysis, report)}
//                           >
//                             रिपोर्ट डाउनलोड करा
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center mt-5 text-gray-600">अहवाल पाहण्यासाठी कृपया ५ मिनिटांनंतर पुन्हा भेट द्या</div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>

//   );
// }

// export default ReportDetailPopup;



import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from 'next/router';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { jsPDF } from "jspdf";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

/* ================= SCORE CIRCLE (from assessmentReport.js) ================= */
const ScoreCircleSmall = ({ obtained = 0, total = 100, size = "sm" }) => {
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
        <circle className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="transparent" r={radius} cx="20" cy="20" />
        <circle className={`${colorClass} transition-all duration-700`} strokeWidth="3" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="20" cy="20" />
      </svg>
      <div className={`absolute ${colorClass} font-bold`}><span className={fontSize}>{percentage}%</span></div>
    </div>
  );
};

/* ================= SECTION CARD (from assessmentReport.js) ================= */
function SectionCard({ title, score, markdown, accent, questions = [] }) {
  const [showQuestions, setShowQuestions] = useState(false);
  return (
    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-10 mb-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${accent.replace("text", "bg")}`}></span>
          <h2 className={`text-xl md:text-2xl font-bold tracking-wide ${accent}`}>
            {title}
          </h2>
        </div>
        <ScoreCircleSmall obtained={score} total={100} size="sm" />
      </div>

      {/* CONTENT */}
      <div className="prose prose-invert max-w-none text-left">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-8 mb-4 text-white border-b border-white/10 pb-2" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-lg font-semibold mt-6 mb-3 text-indigo-300" {...props} />,
            p: ({ node, ...props }) => <p className="text-sm text-slate-300 leading-relaxed mb-3" {...props} />,
            li: ({ node, ...props }) => <li className="text-sm text-slate-300 mb-2 list-disc ml-5" {...props} />,
            ul: ({ node, ...props }) => <ul className="mb-4" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal ml-5 mb-4" {...props} />
          }}
        >
          {markdown || "अहवाल उपलब्ध नाही."}
        </ReactMarkdown>
      </div>

      {/* QUESTIONS TOGGLE */}
      {questions.length > 0 && (
        <div className="mt-6 border-t border-white/5 pt-4">
          <button onClick={() => setShowQuestions(!showQuestions)} className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition">
            {showQuestions ? "प्रश्नावली लपवा ↑" : "प्रश्नावली पहा →"}
          </button>

          {showQuestions && (
            <div className="mt-6 space-y-4">
              {questions.map((q, index) => (
                <div key={index} className="bg-slate-800 border border-white/5 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-white mb-2">Q{index + 1}. {q.questionText}</h4>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div><span className="font-semibold text-emerald-400">बरोबर उत्तर:</span> {q.correctAnswer}</div>
                    <div><span className="font-semibold text-yellow-400">तुमचे उत्तर:</span> {q.userAnswer}</div>
                    <div>{q.isCorrect ? <span className="text-emerald-400 font-semibold">✅ बरोबर</span> : <span className="text-red-400 font-semibold">❌ चुकीचे</span>}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReportDetailPopup({ user, isOpen, setIsOpen }) {
  if (!isOpen) return null;
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [isEmailFetched, setIsEmailFetched] = useState(false);
  const [visibility, setVisibility] = useState({
    report: false,
    previousReports: false,
  });
  const [reportVisibility, setReportVisibility] = useState([]);

  const handleClosee = (e) => {
    e.stopPropagation();  // Prevent the click event from propagating to the parent
    setIsOpen(false); // Close the modal
  };

  const extractScore = (report, category) => {
    if (!report) return 0;

    if (report.technicalAssessment && (category === 'Technical Proficiency' || category === 'Technical')) {
      return Math.round((report.technicalAssessment.percentage / 100) * 20); // Out of 20
    } else if (report.situationAssessment && (category === 'Decision-Making' || category === 'Situation')) {
      return Math.round(report.situationAssessment.percentage / 10); // Out of 10
    } else if (report.voiceInterview && (category === 'Communication' || category === 'Confidence' || category === 'Language Fluency')) {
      return report.voiceInterview.percentage || 0; // Pure percentage
    } else if (category === 'Overall Score' || category === 'Overall') {
      return report.aiReport?.overallScore || 0; // Pure percentage
    }
    return 0;
  };

  const extractScoreAndFeedback = (report, category) => {
    let score = 0;
    let feedback = 'विश्लेषण उपलब्ध नाही.';

    if (report.technicalAssessment && (category === 'Technical Proficiency' || category === 'Technical')) {
      score = Math.round((report.technicalAssessment.percentage / 100) * 20);
      feedback = report.aiReport?.technicalReport || 'तांत्रिक विश्लेषण उपलब्ध नाही.';
    } else if (report.situationAssessment && (category === 'Decision-Making' || category === 'Situation')) {
      score = Math.round(report.situationAssessment.percentage / 10);
      feedback = report.aiReport?.situationReport || 'परिस्थिती विश्लेषण उपलब्ध नाही.';
    } else if (report.voiceInterview && (category === 'Communication' || category === 'Confidence' || category === 'Language Fluency')) {
      score = report.voiceInterview.percentage || 0;
      feedback = report.aiReport?.communicationReport || 'संवाद विश्लेषण उपलब्ध नाही.';
    } else if (category === 'Overall Score' || category === 'Overall') {
      score = report.aiReport?.overallScore || 0;
      feedback = report.aiReport?.overallSummary || 'एकूण सारांश उपलब्ध नाही.';
    }

    return { score, feedback };
  };


  // Fetch email from localStorage
  useEffect(() => {
    const userFromStorage = user
    if (userFromStorage) {
      // const parsedUser = JSON.parse(userFromStorage);
      const email = userFromStorage.email;

      if (email) {
        setEmail(email);
        setIsEmailFetched(true);
        setVisibility((prevVisibility) => ({
          ...prevVisibility,
          previousReports: true,
        }));
      } else {
        setError("Email is missing in user object");
      }
    } else {
      setError("No user data provided to popup");
    }
  }, [user]);

  // Fetch reports when email is set
  useEffect(() => {
    if (email && isEmailFetched) {
      const fetchReportsByEmail = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/get-reports?email=${email}`);
          if (response.status === 404) {
            setReports([]);
            setLoading(false);
            return;
          }
          if (!response.ok) {
            throw new Error(`Failed to fetch reports, status: ${response.status}`);
          }
          const data = await response.json();
          if (data.reports && data.reports.length > 0) {
            const sortedReports = data.reports.sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
              const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
              return dateB - dateA;
            });
            setReports(sortedReports);
            setReportVisibility(new Array(sortedReports.length).fill(false));
          } else {
            setReports([]);
          }
        } catch (err) {
          setError(`Error fetching reports: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchReportsByEmail();
    }
  }, [email, isEmailFetched, user]);

  // Handle Go Back Logic
  const goBack = () => {
    if (document.referrer.includes('/report')) {
      router.push('/');
    } else {
      router.back('/');
    }
  };

  // Handle toggle visibility of report sections
  const toggleVisibility = (section) => {
    setVisibility((prevVisibility) => ({
      ...prevVisibility,
      [section]: !prevVisibility[section],
    }));
  };

  // Toggle visibility for individual reports
  const toggleIndividualReportVisibility = (index) => {
    setReportVisibility((prevVisibility) => {
      const newVisibility = [...prevVisibility];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  // Generate PDF Report
  const downloadReport = (report) => {
    const doc = new jsPDF();
    const reportDate = report.createdAt ? new Date(report.createdAt).toLocaleString() : "Unknown Date";
    let marginX = 20;
    let marginY = 20;
    let pageHeight = doc.internal.pageSize.height;

    // Title
    doc.setFontSize(20);
    doc.text("Interview Report", doc.internal.pageSize.width / 2, marginY, { align: "center" });

    // Report Role and Date
    marginY += 15;
    doc.setFontSize(14);
    doc.text(`Email: ${report.email}`, marginX, marginY);
    marginY += 10;
    doc.text(`Date: ${reportDate}`, marginX, marginY);

    // Analysis Header
    marginY += 15;
    doc.setFontSize(14);
    doc.text("Analysis Summary:", marginX, marginY);

    // AI Summary
    doc.setFontSize(11);
    marginY += 10;
    const summary = report.aiReport?.overallSummary || "AI विश्लेषण उपलब्ध नाही.";
    let wrappedSummary = doc.splitTextToSize(summary, 170);
    wrappedSummary.forEach(line => {
      if (marginY + 10 > pageHeight - 20) {
        doc.addPage();
        marginY = 20;
      }
      doc.text(line, marginX, marginY);
      marginY += 7;
    });

    // Scores Section
    marginY += 10;
    const scores = [
      { label: 'Technical Proficiency', score: extractScore(report, 'Technical') },
      { label: 'Situation Assessment', score: extractScore(report, 'Situation') },
      { label: 'Communication Score', score: extractScore(report, 'Communication') },
      { label: 'Overall Result', score: extractScore(report, 'Overall') },
    ];

    scores.forEach((score) => {
      if (marginY + 15 > pageHeight - 20) {
        doc.addPage();
        marginY = 20;
      }
      doc.setFontSize(12);
      doc.text(`${score.label}:`, marginX, marginY);

      let max = score.label.includes('Overall') ? 50 : 10;
      let progressWidth = (score.score / max) * 50;
      doc.setFillColor(50, 150, 250);
      doc.rect(marginX + 80, marginY - 5, progressWidth, 5, "F");
      doc.text(`${score.score}/${max}`, marginX + 140, marginY);

      marginY += 15;
    });

    // Save the PDF
    doc.save(`report_${report.email}_${reportDate.replace(/[:/,]/g, '-')}.pdf`);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const ScoreCard = ({ label, score, feedback }) => {
    // Legacy ScoreCard for downloadReport compatibility if needed, or we just use SectionCard
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-background text-white"
          onClick={handleClosee}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="modal-container shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="back-button" onClick={handleClosee}>
                <IoIosArrowBack />
              </div>
              <h1 className="text-center">मुलाखत अहवाल</h1>
            </div>

            <div className="mx-auto mt-5">
              {visibility.previousReports && (
                <div className="mx-auto">
                  {reports && reports.length > 0 ? (
                    reports.map((report, index) => (
                      <div
                        key={index}
                        className="bg-transparent shadow-lg rounded-lg p-2 max-w-2xl mx-auto"
                      >
                        <div
                          className="bg-purple-500 text-white p-4 rounded-t-lg cursor-pointer flex justify-between items-center"
                          onClick={() => toggleIndividualReportVisibility(index)}
                        >
                          {/* Hide the toggle text if the report is visible */}
                          <span>{reportVisibility[index] ? 'Hide Report' : 'Show Report'} ▼</span>
                          <span className="text-sm">{new Date(report.createdAt).toLocaleString()}</span>
                        </div>

                        {reportVisibility[index] && (
                          <div className="p-4 md:p-8">
                            {/* Internal Header like User Side */}
                            <div className="flex justify-between items-start mb-12 bg-slate-900/50 p-6 rounded-3xl border border-white/5">
                              <div>
                                <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide">
                                  {report.technicalAssessment?.subject || "चाचणी"}
                                </h2>
                                <div className="text-slate-400 text-sm mt-2">
                                  📅 {new Date(report.createdAt).toLocaleDateString("mr-IN", { year: 'numeric', month: 'short', day: 'numeric' })}
                                </div>
                              </div>
                              <ScoreCircleSmall obtained={report.aiReport?.overallScore} size="lg" />
                            </div>

                            <div className="mt-4 space-y-12">
                              <SectionCard
                                title="टेक्निकल असेसमेंट"
                                score={report.technicalAssessment?.percentage}
                                markdown={report.aiReport?.technicalReport}
                                accent="text-indigo-400"
                                questions={report.technicalAssessment?.details || []}
                              />

                              <SectionCard
                                title="कम्युनिकेशन असेसमेंट"
                                score={report.voiceInterview?.percentage}
                                markdown={report.aiReport?.communicationReport}
                                accent="text-purple-400"
                              />

                              <SectionCard
                                title="सिच्युएशन असेसमेंट"
                                score={report.situationAssessment?.percentage}
                                markdown={report.aiReport?.situationReport}
                                accent="text-blue-400"
                                questions={report.situationAssessment?.details || []}
                              />

                              <div className="bg-slate-900 border border-white/10 rounded-3xl p-10">
                                <h4 className="text-xl font-bold text-white border-b border-white/20 pb-2 mb-4">संपूर्ण सारांश (Overall Summary)</h4>
                                <div className="prose prose-invert max-w-none text-left">
                                  <ReactMarkdown
                                    components={{
                                      p: ({ node, ...props }) => <p className="text-slate-300 leading-relaxed mb-3" {...props} />
                                    }}
                                  >
                                    {report.aiReport?.overallSummary || 'सारांश उपलब्ध नाही.'}
                                  </ReactMarkdown>
                                </div>
                              </div>

                              <button
                                className="button mt-4"
                                onClick={() => downloadReport(report)}
                              >
                                रिपोर्ट डाउनलोड करा
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center mt-5 text-gray-600">अहवाल पाहण्यासाठी कृपया ५ मिनिटांनंतर पुन्हा भेट द्या</div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ReportDetailPopup;

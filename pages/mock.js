// // import React, { useState, useRef, useEffect } from 'react';
// // import { useRouter } from 'next/router';
// // import { IoIosArrowBack, IoMdmic } from "react-icons/io";
// // import { FaMicrophone, FaVolumeUp, FaCheckCircle, FaPlay, FaStop } from 'react-icons/fa';

// // // --- Configuration & Data ---
// // const ALL_QUESTIONS = [
// //     "Tell me about yourself.",
// //     "Why do you want to work with our company?",
// //     "What are your strengths and weaknesses?",
// //     "Where do you see yourself in the next 3–5 years?",
// //     "Why should we hire you?",
// //     "How do you handle stress or pressure at work?",
// //     "Describe a situation where you faced a challenge and how you solved it.",
// //     "What motivates you to do your best at work?",
// //     "How do you handle conflicts or disagreements with team members?",
// //     "Are you comfortable working in a team as well as independently?"
// // ];

// // const SLIDES = [
// //     {
// //         id: 1,
// //         title: "Understand the job role",
// //         content: "1. Understanding the job role means researching its key responsibilities, required skills, and expectations. This helps you tailor your resume, answer interview questions confidently.",
// //     },
// //     {
// //         id: 2,
// //         title: "Understand the Job Description",
// //         content: "2. Carefully read and analyze the job description to grasp the key qualifications, duties, and expectations. Prepare examples of how your skills and experiences match.",
// //     },
// //     {
// //         id: 3,
// //         title: "Understand the company's background",
// //         content: "3. Learn about its history, mission, values, products, services, and industry position to align your answers and show genuine interest.",
// //     },
// //     {
// //         id: 4,
// //         title: "Practice Your Self Introduction",
// //         content: "4. Introduce yourself briefly, highlight key skills, experience, and achievements, and connect them to the job role.",
// //     },
// //     {
// //         id: 5,
// //         title: "Present Yourself Professionally",
// //         content: "5. Dress appropriately for the industry. Pay attention to grooming and personal hygiene to make a positive impression.",
// //     },
// // ];

// // // --- Helper: Random Question Selector ---
// // const getRandomQuestions = (count) => {
// //     const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random());
// //     return shuffled.slice(0, count);
// // };

// // function InterviewApp() {
// //     const router = useRouter();
    
// //     // --- State: App Mode ---
// //     // Modes: 'INSTRUCTION' | 'INTERVIEW' | 'COMPLETED'
// //     const [appMode, setAppMode] = useState('INSTRUCTION'); 

// //     // --- State: Instructions ---
// //     const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
// //     const [deviceTests, setDeviceTests] = useState({
// //         speaker: { done: false, testing: false },
// //         microphone: { done: false, testing: false, status: '' },
// //     });

// //     // --- State: Interview ---
// //     const [interviewQuestions, setInterviewQuestions] = useState([]);
// //     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
// //     const [isListening, setIsListening] = useState(false);
// //     const [transcript, setTranscript] = useState('');
// //     const [results, setResults] = useState([]); // Stores final { question, answer }
// //     const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);

// //     // --- Refs ---
// //     const recognitionRef = useRef(null);
// //     const synthRef = useRef(null);

// //     // --- Lifecycle: Setup Speech Synthesis ---
// //     useEffect(() => {
// //         if (typeof window !== 'undefined') {
// //             synthRef.current = window.speechSynthesis;
// //         }
// //         // Cleanup speech on unmount
// //         return () => {
// //             if (synthRef.current) synthRef.current.cancel();
// //             if (recognitionRef.current) recognitionRef.current.stop();
// //         };
// //     }, []);

// //     // --- Lifecycle: Auto-Advance Slides ---
// //     useEffect(() => {
// //         if (appMode !== 'INSTRUCTION') return;
// //         const timer = setInterval(() => {
// //             setCurrentSlideIndex(prev => (prev + 1) % SLIDES.length);
// //         }, 8000);
// //         return () => clearInterval(timer);
// //     }, [appMode]);


// //     // ==========================================
// //     // MODULE 1: DEVICE TESTING LOGIC
// //     // ==========================================

// //     const testSpeaker = () => {
// //         setDeviceTests(prev => ({ ...prev, speaker: { ...prev.speaker, testing: true } }));
// //         const utterance = new SpeechSynthesisUtterance('System check. Speaker is operational.');
// //         utterance.onend = () => {
// //             setDeviceTests(prev => ({ ...prev, speaker: { done: true, testing: false } }));
// //         };
// //         synthRef.current.speak(utterance);
// //     };

// //     const testMicrophone = () => {
// //         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// //         if (!SpeechRecognition) {
// //             alert("Browser doesn't support speech recognition.");
// //             return;
// //         }

// //         const recognition = new SpeechRecognition();
// //         recognition.lang = 'en-US';
// //         recognition.interimResults = false;
// //         recognition.maxAlternatives = 1;

// //         recognition.onstart = () => {
// //             setDeviceTests(prev => ({
// //                 ...prev,
// //                 microphone: { ...prev.microphone, testing: true, status: 'Listening...' }
// //             }));
// //         };

// //         recognition.onresult = (event) => {
// //             const text = event.results[0][0].transcript;
// //             if (text) {
// //                 setDeviceTests(prev => ({
// //                     ...prev,
// //                     microphone: { done: true, testing: false, status: '✓ Microphone detected input' }
// //                 }));
// //             }
// //         };

// //         recognition.onerror = () => {
// //             setDeviceTests(prev => ({
// //                 ...prev,
// //                 microphone: { done: false, testing: false, status: 'Error detecting audio' }
// //             }));
// //         };

// //         recognition.start();
// //     };


// //     // ==========================================
// //     // MODULE 2: INTERVIEW LOGIC
// //     // ==========================================

// //     const startInterview = () => {
// //         if (!deviceTests.speaker.done || !deviceTests.microphone.done) {
// //             alert("Please complete both Speaker and Microphone tests first.");
// //             return;
// //         }
        
// //         // 1. Generate 5 random questions
// //         const selectedQuestions = getRandomQuestions(5);
// //         setInterviewQuestions(selectedQuestions);
        
// //         // 2. Switch Mode
// //         setAppMode('INTERVIEW');
        
// //         // 3. Trigger first question read-aloud (small delay for UI transition)
// //         setTimeout(() => speakQuestion(selectedQuestions[0]), 1000);
// //     };

// //     const speakQuestion = (text) => {
// //         if (!synthRef.current) return;
        
// //         // Cancel any ongoing speech
// //         synthRef.current.cancel();

// //         const utterance = new SpeechSynthesisUtterance(text);
// //         utterance.rate = 0.9; // Slightly slower for clarity
        
// //         utterance.onstart = () => setIsSpeakingQuestion(true);
// //         utterance.onend = () => setIsSpeakingQuestion(false);
        
// //         synthRef.current.speak(utterance);
// //     };

// //     const toggleRecording = () => {
// //         if (isListening) {
// //             stopRecording();
// //         } else {
// //             startRecording();
// //         }
// //     };

// //     const startRecording = () => {
// //         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// //         if (!SpeechRecognition) return;

// //         // Stop TTS if user interrupts
// //         if (synthRef.current) synthRef.current.cancel();

// //         const recognition = new SpeechRecognition();
// //         recognitionRef.current = recognition;
// //         recognition.continuous = true;
// //         recognition.interimResults = true;
// //         recognition.lang = 'en-US';

// //         recognition.onstart = () => setIsListening(true);
        
// //         recognition.onresult = (event) => {
// //             let finalTranscript = '';
// //             for (let i = event.resultIndex; i < event.results.length; ++i) {
// //                 if (event.results[i].isFinal) {
// //                     finalTranscript += event.results[i][0].transcript + ' ';
// //                 } else {
// //                     // You could handle interim results here if needed
// //                 }
// //             }
// //             // Append new text to existing transcript
// //             if (finalTranscript) {
// //                 setTranscript(prev => prev + finalTranscript);
// //             }
// //         };

// //         recognition.onend = () => {
// //             // If it stopped but we didn't explicitly stop it (silence), restart if needed
// //             // For this logic, we'll let the user manually toggle mostly, or handle simple stops
// //             if (isListening) {
// //                // Optional: Auto-restart logic can go here, 
// //                // but usually better to let UI show 'stopped'
// //                setIsListening(false);
// //             }
// //         };

// //         recognition.start();
// //     };

// //     const stopRecording = () => {
// //         if (recognitionRef.current) {
// //             recognitionRef.current.stop();
// //             setIsListening(false);
// //         }
// //     };

// //     const handleNextQuestion = () => {
// //         stopRecording();

// //         // 1. Save Answer
// //         const currentQ = interviewQuestions[currentQuestionIndex];
// //         const newResult = {
// //             question: currentQ,
// //             answer: transcript || "No answer provided."
// //         };
        
// //         const updatedResults = [...results, newResult];
// //         setResults(updatedResults);
// //         setTranscript(''); // Clear buffer

// //         // 2. Move to next or Finish
// //         if (currentQuestionIndex < 4) {
// //             const nextIndex = currentQuestionIndex + 1;
// //             setCurrentQuestionIndex(nextIndex);
// //             speakQuestion(interviewQuestions[nextIndex]);
// //         } else {
// //             setAppMode('COMPLETED');
// //         }
// //     };


// //     // ==========================================
// //     // RENDER: INSTRUCTION MODE
// //     // ==========================================
// //     if (appMode === 'INSTRUCTION') {
// //         return (
// //             <div className="min-h-screen bg-gray-50 p-6 font-sans text-slate-800">
// //                 <button onClick={() => router.back()} className="text-2xl mb-8 text-gray-600 hover:text-black transition">
// //                     <IoIosArrowBack />
// //                 </button>

// //                 <div className="max-w-2xl mx-auto">
// //                     <div className="text-center mb-10">
// //                         <h1 className="text-4xl font-bold mb-2 text-slate-900">Interview Setup</h1>
// //                         <p className="text-gray-500">Read instructions and check your devices</p>
// //                     </div>

// //                     {/* Slideshow Card */}
// //                     <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 h-64 relative border border-gray-100">
// //                         {SLIDES.map((slide, index) => (
// //                             <div key={slide.id} className={`absolute inset-0 p-8 flex flex-col justify-center transition-all duration-500 transform ${index === currentSlideIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
// //                                 <div className="flex items-center mb-4">
// //                                     <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3">
// //                                         {slide.id}
// //                                     </span>
// //                                     <h3 className="text-xl font-bold text-indigo-900">{slide.title}</h3>
// //                                 </div>
// //                                 <p className="text-gray-600 leading-relaxed">{slide.content}</p>
// //                             </div>
// //                         ))}
// //                         {/* Dots */}
// //                         <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
// //                             {SLIDES.map((_, i) => (
// //                                 <button key={i} onClick={() => setCurrentSlideIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentSlideIndex ? 'bg-indigo-600 w-4' : 'bg-gray-300'}`} />
// //                             ))}
// //                         </div>
// //                     </div>

// //                     {/* Device Check Card */}
// //                     <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
// //                         <h3 className="text-lg font-bold mb-6 text-gray-800">System Check</h3>
                        
// //                         {/* Speaker Test */}
// //                         <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
// //                             <div className="flex items-center">
// //                                 <div className={`p-3 rounded-full mr-4 ${deviceTests.speaker.done ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
// //                                     <FaVolumeUp />
// //                                 </div>
// //                                 <div>
// //                                     <p className="font-medium">Speaker</p>
// //                                     <p className="text-xs text-gray-500">{deviceTests.speaker.done ? 'Audio confirmed' : 'Test audio output'}</p>
// //                                 </div>
// //                             </div>
// //                             <button 
// //                                 onClick={testSpeaker}
// //                                 disabled={deviceTests.speaker.testing}
// //                                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${deviceTests.speaker.done ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
// //                             >
// //                                 {deviceTests.speaker.testing ? 'Testing...' : deviceTests.speaker.done ? 'Retest' : 'Test Sound'}
// //                             </button>
// //                         </div>

// //                         {/* Mic Test */}
// //                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
// //                             <div className="flex items-center">
// //                                 <div className={`p-3 rounded-full mr-4 ${deviceTests.microphone.done ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
// //                                     <FaMicrophone />
// //                                 </div>
// //                                 <div>
// //                                     <p className="font-medium">Microphone</p>
// //                                     <p className="text-xs text-gray-500">{deviceTests.microphone.status || 'Test audio input'}</p>
// //                                 </div>
// //                             </div>
// //                             <button 
// //                                 onClick={testMicrophone}
// //                                 disabled={deviceTests.microphone.testing}
// //                                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${deviceTests.microphone.done ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
// //                             >
// //                                 {deviceTests.microphone.testing ? 'Speak Now...' : deviceTests.microphone.done ? 'Retest' : 'Test Mic'}
// //                             </button>
// //                         </div>
// //                     </div>

// //                     <button 
// //                         onClick={startInterview}
// //                         className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] ${
// //                             deviceTests.speaker.done && deviceTests.microphone.done 
// //                             ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-200' 
// //                             : 'bg-gray-200 text-gray-400 cursor-not-allowed'
// //                         }`}
// //                     >
// //                         Begin Voice Interview
// //                     </button>
// //                 </div>
// //             </div>
// //         );
// //     }


// //     // ==========================================
// //     // RENDER: INTERVIEW MODE
// //     // ==========================================
// //     if (appMode === 'INTERVIEW') {
// //         const currentQ = interviewQuestions[currentQuestionIndex];
        
// //         return (
// //             <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
// //                 {/* Background Blobs for Visual Appeal */}
// //                 <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
// //                 <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

// //                 <div className="w-full max-w-3xl z-10">
// //                     {/* Header Progress */}
// //                     <div className="flex items-center justify-between mb-8 text-slate-400 text-sm font-medium tracking-wider uppercase">
// //                         <span>Question {currentQuestionIndex + 1} of 5</span>
// //                         <span>AI Interviewer</span>
// //                     </div>

// //                     {/* Progress Bar */}
// //                     <div className="w-full h-1 bg-slate-800 rounded-full mb-12">
// //                         <div 
// //                             className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
// //                             style={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}
// //                         ></div>
// //                     </div>

// //                     {/* Question Card */}
// //                     <div className="min-h-[200px] flex flex-col items-center justify-center text-center mb-12">
// //                         {isSpeakingQuestion && (
// //                             <div className="mb-6 flex space-x-1">
// //                                 <span className="w-1 h-4 bg-indigo-400 animate-pulse"></span>
// //                                 <span className="w-1 h-6 bg-indigo-400 animate-pulse delay-75"></span>
// //                                 <span className="w-1 h-4 bg-indigo-400 animate-pulse delay-150"></span>
// //                             </div>
// //                         )}
// //                         <h2 className="text-3xl md:text-4xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
// //                             {currentQ}
// //                         </h2>
// //                         <button 
// //                             onClick={() => speakQuestion(currentQ)} 
// //                             className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-2"
// //                         >
// //                             <FaVolumeUp /> Replay Question
// //                         </button>
// //                     </div>

// //                     {/* Recording Interface */}
// //                     <div className="flex flex-col items-center">
// //                         <div className="relative mb-8">
// //                             {/* Ripple Effect when recording */}
// //                             {isListening && (
// //                                 <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-20 animate-ping"></span>
// //                             )}
                            
// //                             <button
// //                                 onClick={toggleRecording}
// //                                 className={`relative w-20 h-20 rounded-full flex items-center justify-center text-2xl shadow-2xl transition-all duration-300 ${
// //                                     isListening 
// //                                     ? 'bg-red-500 text-white scale-110' 
// //                                     : 'bg-indigo-600 hover:bg-indigo-500 text-white'
// //                                 }`}
// //                             >
// //                                 {isListening ? <FaStop /> : <FaMicrophone />}
// //                             </button>
// //                         </div>

// //                         <p className="text-slate-400 mb-8 h-6 text-center">
// //                             {isListening ? "Listening..." : transcript.length > 0 ? "Microphone paused." : "Tap microphone to answer"}
// //                         </p>

// //                         {/* Live Transcript Preview */}
// //                         <div className="w-full bg-slate-800/50 rounded-xl p-6 min-h-[120px] mb-8 border border-slate-700/50 backdrop-blur-sm">
// //                             <p className="text-slate-300 italic">
// //                                 {transcript || "Your answer will appear here..."}
// //                             </p>
// //                         </div>

// //                         <button
// //                             onClick={handleNextQuestion}
// //                             className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
// //                         >
// //                             {currentQuestionIndex === 4 ? 'Finish Interview' : 'Next Question'}
// //                         </button>
// //                     </div>
// //                 </div>
// //             </div>
// //         );
// //     }


// //     // ==========================================
// //     // RENDER: COMPLETED MODE
// //     // ==========================================
// //     if (appMode === 'COMPLETED') {
// //         return (
// //             <div className="min-h-screen bg-gray-50 p-6">
// //                 <div className="max-w-3xl mx-auto">
// //                     <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
// //                         <div className="bg-green-600 p-8 text-center text-white">
// //                             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
// //                                 <FaCheckCircle />
// //                             </div>
// //                             <h1 className="text-3xl font-bold mb-2">Interview Completed!</h1>
// //                             <p className="opacity-90">Thank you for your responses.</p>
// //                         </div>

// //                         <div className="p-8">
// //                             <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Your Responses</h2>
// //                             <div className="space-y-8">
// //                                 {results.map((item, index) => (
// //                                     <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
// //                                         <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Question {index + 1}</p>
// //                                         <h3 className="text-lg font-bold text-gray-900 mb-3">{item.question}</h3>
// //                                         <div className="bg-white p-4 rounded-lg border border-gray-200">
// //                                             <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{item.answer}</p>
// //                                         </div>
// //                                     </div>
// //                                 ))}
// //                             </div>
                            
// //                             <div className="mt-8 flex justify-center">
// //                                 <button 
// //                                     onClick={() => window.location.reload()}
// //                                     className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors"
// //                                 >
// //                                     Start New Session
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     return null;
// // }

// // export default InterviewApp;



// // import { useState, useEffect } from "react";
// // import Head from "next/head";
// // import Link from "next/link";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { useRouter } from "next/router";
// // import { IoIosArrowBack } from 'react-icons/io';
// // // Icons for better UI
// // const ChevronLeft = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
// // const ChevronRight = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
// // const CheckCircle = () => <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

// // export default function Assessment() {
// //   const router = useRouter();

// //   // --- States ---
// //   const [step, setStep] = useState('input'); // input, loading, test, submitting, success
// //   const [formData, setFormData] = useState({ standard: '', subject: '' });
// //   const [questions, setQuestions] = useState([]);
// //   const [answers, setAnswers] = useState({});
// //   const [currentQIndex, setCurrentQIndex] = useState(0); // Track current question
// //   const [user, setUser] = useState(null);
// //   const [errorMsg, setErrorMsg] = useState('');

// //   // --- 1. Load User & Handle Session Logic ---
// //   useEffect(() => {
// //     // A. Load User
// //     const userStr = localStorage.getItem('user');
// //     if (userStr) {
// //       setUser(JSON.parse(userStr));
// //     }

// //     // B. Smart Session Restoration
// //     const navEntry = typeof performance !== 'undefined' ? performance.getEntriesByType("navigation")[0] : null;

// //     if (navEntry && navEntry.type === 'reload') {
// //       try {
// //         const savedSession = localStorage.getItem('shakkti_active_session');
// //         if (savedSession) {
// //           const sessionData = JSON.parse(savedSession);
// //           if (sessionData.step === 'test' || sessionData.step === 'submitting') {
// //             setFormData(sessionData.formData);
// //             setQuestions(sessionData.questions);
// //             setAnswers(sessionData.answers);
// //             setCurrentQIndex(sessionData.currentQIndex || 0);
// //             setStep('test');
// //           }
// //         }
// //       } catch (e) {
// //         console.error("Session restore failed", e);
// //         localStorage.removeItem('shakkti_active_session');
// //       }
// //     } else {
// //       localStorage.removeItem('shakkti_active_session');
// //       setStep('input');
// //       setQuestions([]);
// //       setAnswers({});
// //       setFormData({ standard: '', subject: '' });
// //     }
// //   }, []);

// //   // --- 2. Save Session (Auto-Save) ---
// //   useEffect(() => {
// //     if (step === 'test' && questions.length > 0) {
// //       const sessionData = { step, formData, questions, answers, currentQIndex };
// //       localStorage.setItem('shakkti_active_session', JSON.stringify(sessionData));
// //     }
// //   }, [step, formData, questions, answers, currentQIndex]);

// //   // --- Helpers ---
// //   const handleInputChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //     setErrorMsg('');
// //   };

// //   const handleOptionSelect = (option) => {
// //     setAnswers(prev => ({ ...prev, [currentQIndex]: option }));
// //   };

// //   // *** ROBUST FETCH FUNCTION ***
// //   const safeFetch = async (url, payload) => {
// //     try {
// //       const res = await fetch(url, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(payload)
// //       });

// //       const text = await res.text();
// //       try {
// //         const data = JSON.parse(text);
// //         if (!res.ok) throw new Error(data.error || "API Error");
// //         return data;
// //       } catch (jsonError) {
// //         console.error("Server returned non-JSON:", text.substring(0, 100));
// //         throw new Error(`Server Error: API endpoint invalid.`);
// //       }
// //     } catch (error) {
// //       throw error;
// //     }
// //   };

// //   // --- 3. Start Assessment ---
// //   const startAssessment = async (e) => {
// //     e.preventDefault();
// //     setErrorMsg('');

// //     if (!formData.standard || !formData.subject) {
// //       setErrorMsg("कृपया इयत्ता आणि विषय दोन्ही भरा.");
// //       return;
// //     }

// //     localStorage.removeItem('shakkti_active_session');
// //     setAnswers({});
// //     setQuestions([]);
// //     setCurrentQIndex(0);
// //     setStep('loading');

// //     try {
// //       const data = await safeFetch('/api/assessment', {
// //         type: 'generate_questions',
// //         standard: formData.standard,
// //         subject: formData.subject
// //       });

// //       if (data.result && Array.isArray(data.result)) {
// //         setQuestions(data.result);
// //         setStep('test');
// //       } else {
// //         throw new Error("Invalid data format received from API");
// //       }
// //     } catch (error) {
// //       console.error("Start Error:", error);
// //       setErrorMsg(error.message);
// //       setStep('input');
// //     }
// //   };

// //   // --- 4. Submit Assessment ---
// //   const submitAssessment = async () => {
// //     setErrorMsg('');

// //     const answeredCount = Object.keys(answers).length;
// //     if (answeredCount < questions.length) {
// //       if (!confirm(`तुम्ही ${questions.length} पैकी फक्त ${answeredCount} सोडवले आहेत. तरीही सबमिट करायचे आहे का?`)) return;
// //     }

// //     setStep('submitting');

// //     try {
// //       const userStr = localStorage.getItem('user');
// //       const currentUser = userStr ? JSON.parse(userStr) : null;

// //       if (!currentUser || !currentUser.email) {
// //         alert("कृपया सबमिट करण्यासाठी पुन्हा लॉगिन करा.");
// //         router.push('/login');
// //         return;
// //       }

// //       const data = await safeFetch('/api/assessment', {
// //         type: 'evaluate_answers',
// //         standard: formData.standard,
// //         subject: formData.subject,
// //         questions: questions,
// //         userAnswers: answers, // Sends object {0: "Option A", 1: "Option C"}
// //         email: currentUser.email,
// //         collageName: currentUser.collageName || "Individual User",
// //         role: currentUser.role || "Student"
// //       });

// //       if (data.result) {
// //         localStorage.removeItem('shakkti_active_session');
// //         setStep('success');
// //       }

// //     } catch (error) {
// //       console.error("Submission Error:", error);
// //       alert(`त्रुटी: ${error.message}`);
// //       setStep('test');
// //     }
// //   };

// //   // Navigation Helpers
// //   const nextQuestion = () => {
// //     if (currentQIndex < questions.length - 1) setCurrentQIndex(prev => prev + 1);
// //   };

// //   const prevQuestion = () => {
// //     if (currentQIndex > 0) setCurrentQIndex(prev => prev - 1);
// //   };

// //   const jumpToQuestion = (index) => {
// //     setCurrentQIndex(index);
// //   };

// //   // Progress Stats
// //   const filledCount = Object.keys(answers).length;
// //   const progressPercent = questions.length > 0 ? (filledCount / questions.length) * 100 : 0;

// //   return (
// //     <>
// //       <Head>
// //         <title>MCQ परीक्षा | Shakkti AI</title>
// //         <meta name="viewport" content="width=device-width, initial-scale=1" />
// //       </Head>

// //       <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans relative overflow-x-hidden selection:bg-purple-500/30">

// //         {/* Background Ambient Light */}
// //         <div className="fixed inset-0 z-0 pointer-events-none">
// //           <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]"></div>
// //           <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px]"></div>
// //         </div>

// //         {/* --- NAVBAR --- */}
// //         <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
// //           <Link href="/">
// //             <div className="flex items-center gap-2 cursor-pointer group">

// //               <IoIosArrowBack size={24} />

// //             </div>
// //           </Link>

// //           {step === 'test' && (
// //             <div className="flex flex-col items-end">
// //               <div className="text-xs text-slate-400 font-medium mb-1">प्रगती</div>
// //               <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
// //                 <div
// //                   className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out"
// //                   style={{ width: `${progressPercent}%` }}
// //                 ></div>
// //               </div>
// //             </div>
// //           )}
// //         </nav>

// //         <main className="relative z-10 flex-grow p-4 md:p-6 flex justify-center items-start pt-8 md:pt-12">
// //           <div className="w-full max-w-6xl">

// //             <AnimatePresence mode="wait">

// //               {/* === STEP 1: INPUT FORM === */}
// //               {step === 'input' && (
// //                 <motion.div
// //                   initial={{ opacity: 0, y: 20 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                   exit={{ opacity: 0, scale: 0.95 }}
// //                   className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl max-w-xl mx-auto"
// //                 >
// //                   <div className="text-center mb-10">
// //                     <h1 className="text-3xl font-bold text-white mb-2">MCQ सराव परीक्षा</h1>
// //                     <p className="text-slate-400">AI द्वारे तयार केलेले 25 वस्तुनिष्ठ प्रश्न.</p>
// //                   </div>

// //                   {errorMsg && (
// //                     <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-sm text-center flex items-center justify-center gap-2">
// //                       <span>⚠</span> {errorMsg}
// //                     </div>
// //                   )}

// //                   <form onSubmit={startAssessment} className="space-y-6">


// //                     <div className="space-y-2">
// //                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
// //                         विषय (Subject)
// //                       </label>

// //                       <select
// //                         name="subject"
// //                         value={formData.subject}
// //                         onChange={handleInputChange}
// //                         required
// //                         className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all"
// //                       >
// //                         <option value="" className="text-slate-400">
// //                           -- विषय निवडा --
// //                         </option>
// //                         <option value="PCB">
// //                           PCB (Printed Circuit Board)
// //                         </option>
// //                         <option value="AAO">
// //                           AAO (Automotive Assembly Operator)
// //                         </option>
// //                       </select>
// //                     </div>
// //                     <div className="space-y-2">
// //                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">तुमची इयत्ता (Class)</label>
// //                       <input
// //                         type="text" name="standard" value={formData.standard} onChange={handleInputChange}
// //                         placeholder="उदा. 10वी, 12वी Science..."
// //                         className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
// //                       />
// //                     </div>
// //                     {/* <div className="space-y-2">
// //                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">विषय (Subject)</label>
// //                       <input 
// //                         type="text" name="subject" value={formData.subject} onChange={handleInputChange}
// //                         placeholder="उदा. मराठी, इतिहास, जीवशास्त्र..."
// //                         className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all placeholder:text-slate-600"
// //                       />
// //                     </div> */}

// //                     <button
// //                       type="submit"
// //                       className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:-translate-y-0.5 transition-all"
// //                     >
// //                       परीक्षा सुरू करा &rarr;
// //                     </button>
// //                   </form>
// //                 </motion.div>
// //               )}

// //               {/* === STEP 2 & 3: LOADING STATES === */}
// //               {(step === 'loading' || step === 'submitting') && (
// //                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-40">
// //                   <div className="relative w-24 h-24 mx-auto mb-8">
// //                     <div className={`absolute inset-0 border-[6px] ${step === 'loading' ? 'border-indigo-500/20' : 'border-green-500/20'} rounded-full`}></div>
// //                     <div className={`absolute inset-0 border-[6px] ${step === 'loading' ? 'border-t-indigo-500' : 'border-t-green-500'} rounded-full animate-spin`}></div>
// //                   </div>
// //                   <h2 className="text-3xl font-bold text-white mb-3">
// //                     {step === 'loading' ? 'प्रश्नपत्रिका तयार होत आहे...' : 'निकाल तयार करत आहोत...'}
// //                   </h2>
// //                   <p className="text-slate-400 text-lg">
// //                     {step === 'loading' ? 'AI 25 महत्त्वाचे प्रश्न शोधत आहे.' : 'तुमच्या उत्तरांचे विश्लेषण चालू आहे.'}
// //                   </p>
// //                 </motion.div>
// //               )}

// //               {/* === STEP 4: MCQ INTERFACE === */}
// //               {step === 'test' && questions.length > 0 && (
// //                 <motion.div
// //                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
// //                   className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 h-full"
// //                 >

// //                   {/* LEFT: Question Area (Span 8 cols) */}
// //                   <div className="lg:col-span-8 flex flex-col">
// //                     <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl flex-grow min-h-[500px] flex flex-col justify-between relative overflow-hidden">

// //                       {/* Decoration */}
// //                       <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

// //                       {/* Header */}
// //                       <div className="flex justify-between items-center mb-8 relative z-10">
// //                         <span className="text-slate-400 font-mono text-sm tracking-wider uppercase">Question {currentQIndex + 1} of {questions.length}</span>
// //                         <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-bold text-slate-300 border border-white/5">{formData.subject}</span>
// //                       </div>

// //                       {/* Question Text */}
// //                       <div className="mb-8 relative z-10">
// //                         <h2 className="text-xl md:text-2xl font-medium text-white leading-relaxed">
// //                           {questions[currentQIndex].question}
// //                         </h2>
// //                       </div>

// //                       {/* Options Grid */}
// //                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
// //                         {questions[currentQIndex].options.map((option, idx) => {
// //                           const isSelected = answers[currentQIndex] === option;
// //                           return (
// //                             <div
// //                               key={idx}
// //                               onClick={() => handleOptionSelect(option)}
// //                               className={`
// //                                 cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group
// //                                 ${isSelected
// //                                   ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
// //                                   : 'bg-slate-950/50 border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'}
// //                               `}
// //                             >
// //                               <div className={`
// //                                 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-colors
// //                                 ${isSelected ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-600 text-slate-500 group-hover:border-slate-400'}
// //                               `}>
// //                                 {String.fromCharCode(65 + idx)}
// //                               </div>
// //                               <span className={`text-base ${isSelected ? 'text-white' : 'text-slate-300'}`}>
// //                                 {option}
// //                               </span>
// //                             </div>
// //                           );
// //                         })}
// //                       </div>

// //                       {/* Bottom Navigation */}
// //                       <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/5 relative z-10">
// //                         <button
// //                           onClick={prevQuestion}
// //                           disabled={currentQIndex === 0}
// //                           className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
// //                         >
// //                           <ChevronLeft /> मागील (Prev)
// //                         </button>

// //                         {currentQIndex === questions.length - 1 ? (
// //                           <button
// //                             onClick={submitAssessment}
// //                             className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 hover:shadow-green-900/40 hover:-translate-y-0.5 transition-all"
// //                           >
// //                             पेपर सबमिट करा <CheckCircle />
// //                           </button>
// //                         ) : (
// //                           <button
// //                             onClick={nextQuestion}
// //                             className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 hover:bg-slate-200 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all"
// //                           >
// //                             पुढील (Next) <ChevronRight />
// //                           </button>
// //                         )}
// //                       </div>

// //                     </div>
// //                   </div>

// //                   {/* RIGHT: Question Palette (Span 4 cols) */}
// //                   <div className="lg:col-span-4">
// //                     <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 h-full shadow-xl">
// //                       <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
// //                         <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
// //                         प्रश्न सूची (Palette)
// //                       </h3>

// //                       <div className="grid grid-cols-5 gap-3">
// //                         {questions.map((_, idx) => {
// //                           const isAnswered = answers[idx] !== undefined;
// //                           const isCurrent = currentQIndex === idx;

// //                           return (
// //                             <button
// //                               key={idx}
// //                               onClick={() => jumpToQuestion(idx)}
// //                               className={`
// //                                 aspect-square rounded-lg flex items-center justify-center font-bold text-sm transition-all
// //                                 ${isCurrent
// //                                   ? 'ring-2 ring-white bg-indigo-600 text-white scale-110 z-10'
// //                                   : isAnswered
// //                                     ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
// //                                     : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'}
// //                               `}
// //                             >
// //                               {idx + 1}
// //                             </button>
// //                           );
// //                         })}
// //                       </div>

// //                       <div className="mt-8 space-y-3">
// //                         <div className="flex items-center gap-3 text-sm text-slate-400">
// //                           <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/50"></div>
// //                           <span>सोडवलेले (Answered)</span>
// //                         </div>
// //                         <div className="flex items-center gap-3 text-sm text-slate-400">
// //                           <div className="w-4 h-4 rounded bg-indigo-600 ring-1 ring-white"></div>
// //                           <span>सध्याचा प्रश्न (Current)</span>
// //                         </div>
// //                         <div className="flex items-center gap-3 text-sm text-slate-400">
// //                           <div className="w-4 h-4 rounded bg-slate-800 border border-slate-700"></div>
// //                           <span>बाकी (Not Visited)</span>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>

// //                 </motion.div>
// //               )}

// //               {/* === STEP 5: SUCCESS === */}
// //               {step === 'success' && (
// //                 <motion.div
// //                   initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
// //                   className="bg-slate-900/80 backdrop-blur-2xl border border-green-500/20 p-10 md:p-16 rounded-[2.5rem] shadow-2xl text-center max-w-lg mx-auto"
// //                 >
// //                   <div className="w-24 h-24 bg-gradient-to-tr from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
// //                     <CheckCircle />
// //                   </div>

// //                   <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">अभिनंदन!</h2>
// //                   <p className="text-lg text-slate-300 leading-relaxed mb-10">
// //                     तुमचा पेपर यशस्वीरित्या सबमिट झाला आहे. <br />
// //                     AI ने गुण आणि विश्लेषण तयार केले आहे.
// //                   </p>

// //                   <div className="flex flex-col gap-4">
// //                     <Link href="/assessmentReport" className="w-full">
// //                       <button className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all shadow-lg shadow-white/10">
// //                         माझा अहवाल पहा (View Report)
// //                       </button>
// //                     </Link>
// //                     <Link href="/" className="w-full">
// //                       <button className="w-full py-4 bg-slate-800 text-slate-300 hover:text-white rounded-xl font-bold transition-all border border-slate-700 hover:bg-slate-700">
// //                         होम पेजवर जा
// //                       </button>
// //                     </Link>
// //                   </div>
// //                 </motion.div>
// //               )}

// //             </AnimatePresence>
// //           </div>
// //         </main>
// //       </div>
// //     </>
// //   );
// // }. so the flow is the user give give the assessment first with questions and then the user give give the voice interview and the user should not be able to stop the mic once the mock is started and next button to go to next question and there must be only 5 questions
// // and fter the interview there must be a situation based apptitude the questions will come fomr situationapti route similar to assessment. and this is the flow assessment->mock(voice interview of 5 question)->situation(20 questions). this must be visually appering and all data must be stored with question and answer use best thinking to design the ui the ui must be same for assessment and situation and give full workign code use best ui ux and dont show user the answer just submit them the answer in a verable that has all the information




// import React, { useState, useEffect, useRef } from 'react';
// import Head from 'next/head';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//     IoMdMicrophone, 
//     IoMdCheckmarkCircle,
//     IoIosArrowDown,
//     IoMdVolumeHigh,
//     IoMdWarning
// } from 'react-icons/io';
// import { 
//     FaVolumeUp, 
//     FaMicrophone, 
//     FaArrowRight, 
//     FaBrain, 
//     FaUserGraduate,
//     FaClipboardList
// } from 'react-icons/fa';

// // --- CONFIGURATION: 10 Interview Questions in Marathi ---
// const INTERVIEW_POOL = [
//     "तुमच्याबद्दल थोडक्यात सांगा.", 
//     "तुम्हाला आमच्या कंपनीत काम का करायचे आहे?", 
//     "तुमच्या जमेच्या बाजू (Strengths) आणि कमकुवत बाजू (Weaknesses) कोणत्या आहेत?",
//     "पुढील ३-५ वर्षांत तुम्ही स्वतःला कुठे पाहता?", 
//     "आम्ही तुमची निवड का करावी?", 
//     "तुम्ही कामाचा ताण किंवा दबाव कसा हाताळता?", 
//     "एखाद्या कठीण प्रसंगाचे वर्णन करा ज्याचा तुम्ही सामना केला आणि तो कसा सोडवला?", 
//     "तुम्हाला काम करण्यासाठी कोणती गोष्ट प्रेरित करते?", 
//     "टीममधील मतभेद किंवा संघर्ष तुम्ही कसे हाताळता?", 
//     "तुम्ही स्वतंत्रपणे आणि टीममध्ये काम करण्यास तयार आहात का?" 
// ];

// // --- HELPER: ROBUST MARATHI TEXT TO SPEECH ---
// const speakText = (text, onEndCallback) => {
//     if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
//         console.warn("TTS not supported");
//         if(onEndCallback) onEndCallback();
//         return;
//     }

//     // Cancel any ongoing speech to prevent overlap
//     window.speechSynthesis.cancel();

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.9; // Slightly slower for clarity
//     utterance.lang = 'mr-IN'; // Force Marathi Language

//     // Try to find a specific Google Marathi/Hindi voice if available
//     const voices = window.speechSynthesis.getVoices();
//     const marathiVoice = voices.find(v => v.lang.includes('mr') || v.lang.includes('hi'));
//     if (marathiVoice) utterance.voice = marathiVoice;

//     utterance.onend = () => {
//         if (onEndCallback) onEndCallback();
//     };

//     utterance.onerror = (e) => {
//         console.error("TTS Error:", e);
//         if (onEndCallback) onEndCallback();
//     };

//     window.speechSynthesis.speak(utterance);
// };

// // --- API HELPER ---
// const fetchQuestionsFromAPI = async (endpoint, userDetails) => {
//     try {
//         console.log(`Fetching from ${endpoint}...`);
//         const response = await fetch(endpoint, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 type: 'generate_questions',
//                 standard: userDetails.standard,
//                 subject: userDetails.subject
//             })
//         });
        
//         const data = await response.json();
        
//         if (data.result && Array.isArray(data.result)) {
//             return data.result;
//         } else if (data.questions) {
//             return data.questions;
//         } else {
//             throw new Error("Invalid Format");
//         }
//     } catch (error) {
//         console.error(`Error fetching from ${endpoint}:`, error);
//         // Fallback Mock Data (Marathi) to ensure app doesn't crash
//         const isSituation = endpoint.includes('situation');
//         return Array.from({ length: isSituation ? 20 : 25 }, (_, i) => ({
//             id: i + 1,
//             question: isSituation 
//                 ? `(डेमो) खालीलपैकी कोणत्या परिस्थितीत तुम्ही काय कराल? प्रश्न क्रमांक ${i + 1}`
//                 : `(डेमो) विषयाशी संबंधित तांत्रिक प्रश्न क्रमांक ${i + 1}?`,
//             options: ["पर्याय अ", "पर्याय ब", "पर्याय क", "पर्याय ड"],
//             correctAnswer: "पर्याय अ" 
//         }));
//     }
// };

// // ==========================================
// // 1. INPUT STAGE (मराठी)
// // ==========================================
// const InputStage = ({ onComplete }) => {
//     const [formData, setFormData] = useState({ standard: '', subject: 'PCB' });

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (formData.standard && formData.subject) {
//             onComplete(formData);
//         } else {
//             alert("कृपया सर्व माहिती भरा.");
//         }
//     };

//     return (
//         <motion.div 
//             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
//             className="max-w-xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl"
//         >
//             <div className="text-center mb-8">
//                 <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400 text-2xl">
//                     <FaUserGraduate />
//                 </div>
//                 <h2 className="text-3xl font-bold text-white">विद्यार्थी तपशील</h2>
//                 <p className="text-slate-400 mt-2">परीक्षा सुरू करण्यासाठी खालील माहिती भरा.</p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                     <label className="block text-slate-400 text-xs font-bold mb-2 uppercase">तुमची इयत्ता (Standard)</label>
//                     <input 
//                         type="text" 
//                         placeholder="उदा. १२वी सायन्स, डिप्लोमा..."
//                         value={formData.standard}
//                         onChange={(e) => setFormData({...formData, standard: e.target.value})}
//                         className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
//                         required
//                     />
//                 </div>
//                 <div className="relative">
//                     <label className="block text-slate-400 text-xs font-bold mb-2 uppercase">विषय निवडा (Subject)</label>
//                     <select 
//                         value={formData.subject}
//                         onChange={(e) => setFormData({...formData, subject: e.target.value})}
//                         className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
//                     >
//                         <option value="PCB">PCB (Printed Circuit Board)</option>
//                         <option value="AAO">AAO (Automotive Assembly Operator)</option>
//                     </select>
//                     <div className="pointer-events-none absolute bottom-4 right-4 text-slate-400"><IoIosArrowDown /></div>
//                 </div>
//                 <button type="submit" className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform mt-4">
//                     परीक्षा सुरू करा &rarr;
//                 </button>
//             </form>
//         </motion.div>
//     );
// };

// // ==========================================
// // 2. MCQ STAGE (Reusable - मराठी)
// // ==========================================
// const MCQStage = ({ title, endpoint, userData, themeColor, onComplete }) => {
//     const [questions, setQuestions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentQIndex, setCurrentQIndex] = useState(0);
//     const [answers, setAnswers] = useState({}); 

//     useEffect(() => {
//         const load = async () => {
//             setLoading(true);
//             const data = await fetchQuestionsFromAPI(endpoint, userData);
//             setQuestions(data);
//             setLoading(false);
//         };
//         load();
//     }, [endpoint, userData]);

//     const handleSelect = (option) => {
//         setAnswers(prev => ({ ...prev, [currentQIndex]: option }));
//     };

//     const handleSubmit = () => {
//         if (Object.keys(answers).length < questions.length) {
//             if(!confirm("तुम्ही सर्व प्रश्न सोडवले नाहीत. तरीही सबमिट करायचे आहे का?")) return;
//         }
        
//         const resultPayload = {
//             questions: questions,
//             answers: answers
//         };
//         onComplete(resultPayload);
//     };

//     if (loading) return <LoadingScreen text={`${title} तयार होत आहे...`} color={themeColor} />;
    
//     if (!questions || questions.length === 0) return <div className="text-center text-white">No questions loaded.</div>;

//     const currentQ = questions[currentQIndex];
//     const progress = ((Object.keys(answers).length) / questions.length) * 100;

//     return (
//         <div className="w-full max-w-5xl mx-auto h-full flex flex-col">
//             <div className="flex justify-between items-end mb-6">
//                 <div>
//                     <h2 className={`text-2xl font-bold text-${themeColor}-400`}>{title}</h2>
//                     <p className="text-slate-400 text-sm">प्रश्न {currentQIndex + 1} / {questions.length}</p>
//                 </div>
//                 <div className="flex flex-col items-end">
//                     <span className="text-xs text-slate-500 mb-1">{Math.round(progress)}% पूर्ण</span>
//                     <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
//                         <div className={`h-full bg-${themeColor}-500 transition-all duration-500`} style={{ width: `${progress}%` }}></div>
//                     </div>
//                 </div>
//             </div>

//             <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-8 shadow-2xl min-h-[400px] flex flex-col justify-between">
//                 <div>
//                     <h3 className="text-xl text-white font-medium mb-8 leading-relaxed">
//                         {currentQ?.question || currentQ?.questionText}
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {currentQ?.options?.map((opt, idx) => {
//                             const isSelected = answers[currentQIndex] === opt;
//                             return (
//                                 <button
//                                     key={idx}
//                                     onClick={() => handleSelect(opt)}
//                                     className={`p-4 rounded-xl border-2 text-left transition-all flex items-center ${
//                                         isSelected 
//                                         ? `bg-${themeColor}-600/20 border-${themeColor}-500 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]` 
//                                         : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-600'
//                                     }`}
//                                 >
//                                     <span className={`w-8 h-8 rounded-full border flex items-center justify-center mr-3 font-bold text-sm ${isSelected ? `bg-${themeColor}-500 border-${themeColor}-500` : 'border-slate-600'}`}>
//                                         {String.fromCharCode(65 + idx)}
//                                     </span>
//                                     {opt}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
//                     <button 
//                         onClick={() => setCurrentQIndex(p => Math.max(0, p - 1))} 
//                         disabled={currentQIndex === 0} 
//                         className="px-6 py-2 rounded-lg text-slate-400 hover:bg-white/5 disabled:opacity-30 transition-colors"
//                     >
//                         मागील (Prev)
//                     </button>
//                     {currentQIndex === questions.length - 1 ? (
//                         <button onClick={handleSubmit} className={`px-8 py-3 bg-${themeColor}-600 hover:bg-${themeColor}-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg`}>
//                             सबमिट करा <IoMdCheckmarkCircle />
//                         </button>
//                     ) : (
//                         <button onClick={() => setCurrentQIndex(p => Math.min(questions.length - 1, p + 1))} className="px-8 py-3 bg-white text-black rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200">
//                             पुढील (Next) <FaArrowRight />
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ==========================================
// // 3. SYSTEM CHECK STAGE (मराठी UI)
// // ==========================================
// const DeviceCheckStage = ({ onComplete }) => {
//     const [speakerStatus, setSpeakerStatus] = useState('idle'); 
//     const [micStatus, setMicStatus] = useState('idle');

//     // Load voices on mount
//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             window.speechSynthesis.getVoices();
//         }
//     }, []);

//     const testSpeaker = () => {
//         setSpeakerStatus('testing');
//         speakText("नमस्कार, ही सिस्टम चेक टेस्ट आहे. तुम्हाला माझा आवाज ऐकू येत आहे का?", () => {
//             setSpeakerStatus('success');
//         });
//     };

//     const testMic = () => {
//         setMicStatus('testing');
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
//         if (!SpeechRecognition) {
//             alert("Browser Mic Not Supported (Try Chrome)");
//             setMicStatus('success'); // Bypass for debugging
//             return;
//         }

//         const recognition = new SpeechRecognition();
//         recognition.lang = 'mr-IN'; // Marathi
//         recognition.onresult = () => {
//             setMicStatus('success');
//             recognition.stop();
//         };
//         recognition.onerror = () => {
//             alert("Mic Error. Please allow permissions.");
//             setMicStatus('idle');
//         };
        
//         try {
//             recognition.start();
//             // Fallback: If no sound in 4s, assume failed or stop
//             setTimeout(() => { if(micStatus !== 'success') recognition.stop(); }, 4000);
//         } catch (e) { console.error(e); }
//     };

//     const isReady = speakerStatus === 'success' && micStatus === 'success';

//     return (
//         <div className="max-w-xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center">
//             <h2 className="text-3xl font-bold text-white mb-2">सिस्टम चेक (System Check)</h2>
//             <p className="text-slate-400 mb-8">मुलाखत सुरू करण्यापूर्वी आपले डिव्हाइस तपासा.</p>

//             <div className="space-y-4 mb-10">
//                 {/* Speaker */}
//                 <div className={`p-4 rounded-2xl border flex justify-between items-center transition-colors ${speakerStatus === 'success' ? 'bg-green-500/10 border-green-500' : 'bg-slate-800 border-slate-700'}`}>
//                     <div className="flex items-center gap-4 text-left">
//                         <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white"><FaVolumeUp /></div>
//                         <div><p className="text-white font-bold">स्पीकर (Speaker)</p><p className="text-xs text-slate-400">आवाज तपासण्यासाठी क्लिक करा</p></div>
//                     </div>
//                     <button onClick={testSpeaker} className={`px-4 py-2 rounded-lg text-white text-sm font-bold ${speakerStatus === 'testing' ? 'bg-yellow-500' : 'bg-indigo-600'}`}>
//                         {speakerStatus === 'testing' ? 'ऐकू येत आहे...' : speakerStatus === 'success' ? 'सत्यापित (Verified)' : 'टेस्ट करा'}
//                     </button>
//                 </div>

//                 {/* Mic */}
//                 <div className={`p-4 rounded-2xl border flex justify-between items-center transition-colors ${micStatus === 'success' ? 'bg-green-500/10 border-green-500' : 'bg-slate-800 border-slate-700'}`}>
//                     <div className="flex items-center gap-4 text-left">
//                         <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white"><FaMicrophone /></div>
//                         <div><p className="text-white font-bold">माईक (Microphone)</p><p className="text-xs text-slate-400">क्लिक करा आणि 'हॅलो' बोला</p></div>
//                     </div>
//                     <button onClick={testMic} className={`px-4 py-2 rounded-lg text-white text-sm font-bold ${micStatus === 'testing' ? 'bg-red-500 animate-pulse' : 'bg-indigo-600'}`}>
//                         {micStatus === 'testing' ? 'बोला...' : micStatus === 'success' ? 'सत्यापित (Verified)' : 'टेस्ट करा'}
//                     </button>
//                 </div>
//             </div>

//             <button onClick={onComplete} disabled={!isReady} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isReady ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
//                 मुलाखत सुरू करा (Start Interview)
//             </button>
//         </div>
//     );
// };

// // ==========================================
// // 4. VOICE INTERVIEW STAGE (मराठी)
// // ==========================================
// const VoiceStage = ({ onComplete }) => {
//     const [qIndex, setQIndex] = useState(0);
//     const [isSpeaking, setIsSpeaking] = useState(false);
//     const [isRecording, setIsRecording] = useState(false);
//     const [transcript, setTranscript] = useState('');
//     const [questions, setQuestions] = useState([]);
//     const [results, setResults] = useState({}); 
    
//     const recognitionRef = useRef(null);

//     // Init: Random 5 questions
//     useEffect(() => {
//         const shuffled = [...INTERVIEW_POOL].sort(() => 0.5 - Math.random());
//         setQuestions(shuffled.slice(0, 5));
//     }, []);

//     // Start flow when questions are ready
//     useEffect(() => {
//         if (questions.length > 0) {
//             setTimeout(() => playQuestion(0), 1000);
//         }
//         return () => {
//             if (typeof window !== 'undefined') window.speechSynthesis.cancel();
//             if (recognitionRef.current) recognitionRef.current.stop();
//         };
//     }, [questions]);

//     const playQuestion = (index) => {
//         if (index >= questions.length) return;
        
//         setTranscript('');
//         setIsRecording(false);
//         if (recognitionRef.current) recognitionRef.current.stop();

//         setIsSpeaking(true);
//         speakText(questions[index], () => {
//             setIsSpeaking(false);
//             startListening(); // Auto-start mic after question ends
//         });
//     };

//     const startListening = () => {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return;

//         const recognition = new SpeechRecognition();
//         recognition.lang = 'mr-IN'; // Marathi STT
//         recognition.continuous = true;
//         recognition.interimResults = true;
//         recognitionRef.current = recognition;

//         recognition.onstart = () => setIsRecording(true);
//         recognition.onresult = (event) => {
//             let final = '';
//             for (let i = event.resultIndex; i < event.results.length; ++i) {
//                 if (event.results[i].isFinal) final += event.results[i][0].transcript + ' ';
//             }
//             setTranscript(prev => prev + final);
//         };
        
//         try {
//             recognition.start();
//         } catch(e) { console.error("Mic start error", e); }
//     };

//     const handleNext = () => {
//         if (recognitionRef.current) recognitionRef.current.stop();
//         setIsRecording(false);

//         // Save current answer
//         const currentAnswerData = { 
//             question: questions[qIndex], 
//             answer: transcript.trim() || "उत्तर रेकॉर्ड केले नाही (No Audio)" 
//         };
        
//         const updatedResults = { ...results, [qIndex]: currentAnswerData };
//         setResults(updatedResults);

//         if (qIndex < 4) {
//             setQIndex(prev => prev + 1);
//             // Delay before next audio
//             setTimeout(() => playQuestion(qIndex + 1), 500);
//         } else {
//             // Finish
//             onComplete({ answers: updatedResults }); 
//         }
//     };

//     if (questions.length === 0) return <LoadingScreen text="मुलाखत तयार होत आहे..." color="purple" />;

//     return (
//         <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
//             <div className="w-full text-center mb-8">
//                 <span className="text-purple-400 font-bold uppercase text-sm">प्रश्न {qIndex + 1} / 5</span>
//                 <div className="w-full h-1 bg-slate-800 rounded-full mt-4"><div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${((qIndex+1)/5)*100}%` }}></div></div>
//             </div>

//             <div className="relative w-full bg-slate-900/80 border border-slate-700 p-12 rounded-3xl shadow-2xl text-center">
//                 <h2 className="text-3xl text-white font-bold mb-8 leading-normal">{questions[qIndex]}</h2>

//                 <div className="flex justify-center mb-8 h-24 items-center">
//                     {isSpeaking ? (
//                         <div className="flex items-center gap-2 text-purple-400"><FaVolumeUp className="animate-pulse text-3xl" /> प्रश्न बोलला जात आहे...</div>
//                     ) : (
//                         <div className="flex flex-col items-center gap-2">
//                              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl transition-all ${isRecording ? 'bg-red-500 animate-pulse shadow-[0_0_40px_rgba(239,68,68,0.5)]' : 'bg-slate-700'}`}>
//                                 <IoMdMicrophone />
//                              </div>
//                              {isRecording && <span className="text-red-400 text-xs tracking-widest animate-pulse font-bold mt-2">ऐकत आहे...</span>}
//                         </div>
//                     )}
//                 </div>

//                 <div className="bg-black/30 rounded-xl p-6 min-h-[120px] mb-8 text-slate-300 italic border border-white/5 text-left text-lg">
//                     {transcript || (isRecording ? "ऐकत आहे..." : "प्रश्नाची प्रतीक्षा करा...")}
//                 </div>

//                 <button onClick={handleNext} disabled={isSpeaking} className={`px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all flex items-center gap-2 mx-auto ${isSpeaking ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-white text-black hover:scale-105'}`}>
//                     {qIndex === 4 ? "मुलाखत संपवा (Finish)" : "पुढील प्रश्न (Next)"} <FaArrowRight />
//                 </button>
//             </div>
//         </div>
//     );
// };

// // ==========================================
// // 5. HELPER COMPONENTS
// // ==========================================
// const LoadingScreen = ({ text, color = 'indigo' }) => (
//     <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
//         <div className={`w-16 h-16 border-4 border-${color}-500/30 border-t-${color}-500 rounded-full animate-spin mb-6`}></div>
//         <h3 className="text-xl text-white font-medium">{text}</h3>
//     </div>
// );

// const TransitionScreen = ({ title, subtitle, icon, color, onNext }) => (
//     <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0}} className="max-w-md mx-auto text-center bg-slate-900/80 backdrop-blur-xl border border-white/10 p-12 rounded-[2.5rem] shadow-2xl">
//         <div className={`w-24 h-24 bg-${color}-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-${color}-400 text-4xl`}>{icon}</div>
//         <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
//         <p className="text-slate-400 mb-8 text-lg">{subtitle}</p>
//         <button onClick={onNext} className={`px-8 py-4 bg-${color}-600 hover:bg-${color}-500 text-white rounded-full font-bold shadow-lg flex items-center gap-2 mx-auto transition-transform hover:scale-105`}>
//             पुढे जा (Continue) <FaArrowRight />
//         </button>
//     </motion.div>
// );

// // ==========================================
// // MAIN CONTROLLER
// // ==========================================
// export default function FullAssessmentFlow() {
//     const [stage, setStage] = useState('input'); 
//     const [userData, setUserData] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
    
//     // We keep data in a REF or State to survive re-renders, but State is safer for async updates
//     const [masterData, setMasterData] = useState({ assessment: null, interview: null, situation: null });

//     const handleInputComplete = (data) => {
//         setUserData(data);
//         setStage('assessment');
//     };

//     const handleStageData = (key, data) => {
//         console.log(`Saving data for ${key}:`, data);
//         setMasterData(prev => ({ ...prev, [key]: data }));
//     };

//     const formatAndSubmitData = async (finalSituationData) => {
//         setIsSubmitting(true);
        
//         // 1. Prepare Payload
//         const payload = {
//             email: "student@example.com", // Replace with real auth email if available
//             userInfo: userData, 
//             masterData: {
//                 assessment: masterData.assessment, // Saved from stage 1
//                 voiceInterview: masterData.interview, // Saved from stage 2
//                 situation: finalSituationData      // Passed directly from stage 3
//             }
//         };

//         console.log("Submitting Payload:", payload);

//         try {
//             const res = await fetch('/api/submit-full-assessment', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(payload)
//             });

//             if (res.ok) {
//                 setStage('success');
//             } else {
//                 alert("Submission Failed. Check console.");
//             }
//         } catch (error) {
//             console.error("Submission Error", error);
//             alert("Network Error during submission.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (isSubmitting) return <LoadingScreen text="निकाल जतन करत आहोत... (Saving Results...)" color="green" />;

//     return (
//         <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
//             <Head><title>Full Assessment | Shakkti AI</title></Head>

//             {/* Ambient Background */}
//             <div className="fixed inset-0 z-0 pointer-events-none">
//                 <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"></div>
//                 <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px]"></div>
//             </div>

//             <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
//                 <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
//                     <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">S</span> 
//                     Shakkti AI
//                 </div>
//             </nav>

//             <main className="relative z-10 container mx-auto px-4 py-8 min-h-[85vh] flex flex-col justify-center">
//                 <AnimatePresence mode="wait">
                    
//                     {stage === 'input' && (
//                         <InputStage key="input" onComplete={handleInputComplete} />
//                     )}

//                     {stage === 'assessment' && (
//                         <motion.div key="assessment" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
//                             <MCQStage 
//                                 title="तांत्रिक परीक्षा (Technical Assessment)" 
//                                 endpoint="/api/assessment" 
//                                 userData={userData} 
//                                 themeColor="indigo" 
//                                 onComplete={(data) => {
//                                     handleStageData('assessment', data);
//                                     setStage('interview_intro');
//                                 }} 
//                             />
//                         </motion.div>
//                     )}

//                     {stage === 'interview_intro' && (
//                         <TransitionScreen key="t1" title="तांत्रिक परीक्षा पूर्ण" subtitle="पुढील: व्हॉइस इंटरव्ह्यू (Voice Interview)" icon={<FaMicrophone />} color="purple" onNext={() => setStage('system_check')} />
//                     )}

//                     {stage === 'system_check' && (
//                         <motion.div key="check" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
//                             <DeviceCheckStage onComplete={() => setStage('interview')} />
//                         </motion.div>
//                     )}

//                     {stage === 'interview' && (
//                         <motion.div key="interview" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
//                             <VoiceStage onComplete={(data) => {
//                                 handleStageData('interview', data);
//                                 setStage('situation_intro');
//                             }} />
//                         </motion.div>
//                     )}

//                     {stage === 'situation_intro' && (
//                         <TransitionScreen key="t2" title="इंटरव्ह्यू पूर्ण झाला" subtitle="पुढील: सिच्युएशन अ‍ॅप्टिट्यूड (Situation Aptitude)" icon={<FaBrain />} color="emerald" onNext={() => setStage('situation')} />
//                     )}

//                     {stage === 'situation' && (
//                         <motion.div key="situation" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
//                             <MCQStage 
//                                 title="सिच्युएशन अ‍ॅप्टिट्यूड (Situation Aptitude)" 
//                                 endpoint="/api/situationque" 
//                                 userData={userData} 
//                                 themeColor="emerald" 
//                                 onComplete={(data) => formatAndSubmitData(data)} 
//                             />
//                         </motion.div>
//                     )}

//                     {stage === 'success' && (
//                         <motion.div key="success" initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="text-center max-w-xl mx-auto bg-slate-900/80 p-12 rounded-[3rem] border border-white/10 shadow-2xl">
//                             <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
//                                 <IoMdCheckmarkCircle className="text-green-400 text-6xl" />
//                             </div>
//                             <h2 className="text-4xl font-bold text-white mb-4">अभिनंदन! (Congratulations)</h2>
//                             <p className="text-slate-400 mb-8 text-lg">तुमचा पेपर यशस्वीरित्या सबमिट झाला आहे. AI विश्लेषण करत आहे.</p>
//                             <button onClick={() => window.location.reload()} className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all">होम पेजवर जा</button>
//                         </motion.div>
//                     )}

//                 </AnimatePresence>
//             </main>
//         </div>
//     );
// }


// import React, { useState, useEffect, useRef } from 'react';
// import Head from 'next/head';
// import { useRouter } from 'next/router'; // Added router for redirection
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//     IoMdMicrophone, 
//     IoMdCheckmarkCircle,
//     IoIosArrowDown,
//     IoMdWarning
// } from 'react-icons/io';
// import { 
//     FaVolumeUp, 
//     FaMicrophone, 
//     FaArrowRight, 
//     FaBrain, 
//     FaUserGraduate,
// } from 'react-icons/fa';

// // --- CONFIGURATION: 10 Interview Questions in Marathi ---
// const INTERVIEW_POOL = [
//     "तुमच्याबद्दल थोडक्यात सांगा.", 
//     "तुम्हाला आमच्या कंपनीत काम का करायचे आहे?", 
//     "तुमच्या जमेच्या बाजू (Strengths) आणि कमकुवत बाजू (Weaknesses) कोणत्या आहेत?",
//     "पुढील ३-५ वर्षांत तुम्ही स्वतःला कुठे पाहता?", 
//     "आम्ही तुमची निवड का करावी?", 
//     "तुम्ही कामाचा ताण किंवा दबाव कसा हाताळता?", 
//     "एखाद्या कठीण प्रसंगाचे वर्णन करा ज्याचा तुम्ही सामना केला आणि तो कसा सोडवला?", 
//     "तुम्हाला काम करण्यासाठी कोणती गोष्ट प्रेरित करते?", 
//     "टीममधील मतभेद किंवा संघर्ष तुम्ही कसे हाताळता?", 
//     "तुम्ही स्वतंत्रपणे आणि टीममध्ये काम करण्यास तयार आहात का?" 
// ];

// // --- HELPER: ROBUST MARATHI TEXT TO SPEECH ---
// const speakText = (text, onEndCallback) => {
//     if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
//         if(onEndCallback) onEndCallback();
//         return;
//     }
//     window.speechSynthesis.cancel();
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.9; 
//     utterance.lang = 'mr-IN'; 
//     const voices = window.speechSynthesis.getVoices();
//     const marathiVoice = voices.find(v => v.lang.includes('mr') || v.lang.includes('hi'));
//     if (marathiVoice) utterance.voice = marathiVoice;

//     utterance.onend = () => { if (onEndCallback) onEndCallback(); };
//     utterance.onerror = () => { if (onEndCallback) onEndCallback(); };
//     window.speechSynthesis.speak(utterance);
// };

// // --- API HELPER ---
// const fetchQuestionsFromAPI = async (endpoint, userDetails) => {
//     try {
//         const response = await fetch(endpoint, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 type: 'generate_questions',
//                 standard: userDetails.standard,
//                 subject: userDetails.subject
//             })
//         });
//         const data = await response.json();
//         if (data.result && Array.isArray(data.result)) return data.result;
//         if (data.questions) return data.questions;
//         throw new Error("Invalid Format");
//     } catch (error) {
//         console.error(`Error fetching from ${endpoint}:`, error);
//         // Fallback Mock Data
//         const isSituation = endpoint.includes('situation');
//         return Array.from({ length: isSituation ? 20 : 25 }, (_, i) => ({
//             id: i + 1,
//             question: isSituation 
//                 ? `(डेमो) खालीलपैकी कोणत्या परिस्थितीत तुम्ही काय कराल? प्रश्न क्रमांक ${i + 1}`
//                 : `(डेमो) विषयाशी संबंधित तांत्रिक प्रश्न क्रमांक ${i + 1}?`,
//             options: ["पर्याय अ", "पर्याय ब", "पर्याय क", "पर्याय ड"],
//             correctAnswer: "पर्याय अ" 
//         }));
//     }
// };

// // ==========================================
// // 1. INPUT STAGE 
// // ==========================================
// // ==========================================
// // 1. INPUT STAGE (UPDATED)
// // ==========================================
// // ==========================================
// // 1. INPUT STAGE (Visual Fixes)
// // ==========================================
// const InputStage = ({ onComplete }) => {
//     const [formData, setFormData] = useState({ standard: '', subject: '' });

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (formData.standard && formData.subject) {
//             onComplete(formData);
//         } else {
//             alert("कृपया सर्व माहिती भरा. (Please fill all details)");
//         }
//     };

//     return (
//         <motion.div 
//             initial={{ opacity: 0, scale: 0.95 }} 
//             animate={{ opacity: 1, scale: 1 }} 
//             // FIX: Darker, less transparent background for better readability
//             className="max-w-xl mx-auto bg-slate-800/90 backdrop-blur-xl border border-slate-700 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden"
//         >
//             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
//             <div className="text-center mb-10">
//                 <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl shadow-lg shadow-purple-500/30">
//                     <FaUserGraduate />
//                 </div>
//                 <h2 className="text-4xl font-bold text-white mb-2">विद्यार्थी तपशील</h2>
//                 <p className="text-slate-300">तुमची माहिती भरून परीक्षा सुरू करा</p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                     {/* FIX: Brighter Label Color */}
//                     <label className="block text-indigo-200 text-xs font-bold mb-2 uppercase tracking-wider">
//                         तुमची इयत्ता (Standard)
//                     </label>
//                     <input 
//                         type="text" 
//                         placeholder="उदा. १२वी सायन्स" 
//                         value={formData.standard} 
//                         onChange={(e) => setFormData({...formData, standard: e.target.value})} 
//                         // FIX: Darker input bg (slate-950) + Visible Placeholder
//                         className="w-full bg-slate-950 border border-slate-600 text-white rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-400" 
//                         required 
//                     />
//                 </div>

//                 <div className="relative">
//                     <label className="block text-indigo-200 text-xs font-bold mb-2 uppercase tracking-wider">
//                         विषय निवडा (Subject)
//                     </label>
//                     <select 
//                         value={formData.subject} 
//                         onChange={(e) => setFormData({...formData, subject: e.target.value})} 
//                         // FIX: Logic to show placeholder text clearly
//                         className={`w-full bg-slate-950 border border-slate-600 rounded-xl px-5 py-4 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer ${formData.subject === "" ? "text-slate-400" : "text-white"}`}
//                         required
//                     >
//                         <option value="" disabled className="bg-slate-800 text-slate-500">Select Subject</option>
//                         <option value="PCB" className="bg-slate-900 text-white py-2">PCB (Printed Circuit Board)</option>
//                         <option value="AAO" className="bg-slate-900 text-white py-2">AAO (Automotive Assembly Operator)</option>
//                     </select>
//                     {/* FIX: Brighter Arrow Icon */}
//                     <div className="pointer-events-none absolute bottom-5 right-5 text-indigo-400 text-xl">
//                         <IoIosArrowDown />
//                     </div>
//                 </div>

//                 <button 
//                     type="submit" 
//                     className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl mt-6 shadow-lg shadow-indigo-600/30 transform transition hover:-translate-y-1"
//                 >
//                     परीक्षा सुरू करा &rarr;
//                 </button>
//             </form>
//         </motion.div>
//     );
// };
// // ==========================================
// // 2. MCQ STAGE (Reusable)
// // ==========================================
// const MCQStage = ({ title, endpoint, userData, themeColor, onComplete }) => {
//     const [questions, setQuestions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentQIndex, setCurrentQIndex] = useState(0);
//     const [answers, setAnswers] = useState({}); 

//     useEffect(() => {
//         const load = async () => {
//             setLoading(true);
//             const data = await fetchQuestionsFromAPI(endpoint, userData);
//             setQuestions(data);
//             setLoading(false);
//         };
//         load();
//     }, [endpoint, userData]);

//     const handleSelect = (option) => setAnswers(prev => ({ ...prev, [currentQIndex]: option }));

//     const handleSubmit = () => {
//         if (Object.keys(answers).length < questions.length) {
//             if(!confirm("काही प्रश्न बाकी आहेत. तरीही सबमिट करायचे?")) return;
//         }
//         onComplete({ questions, answers });
//     };

//     if (loading) return <LoadingScreen text={`${title} तयार होत आहे...`} color={themeColor} />;
//     const currentQ = questions[currentQIndex];
//     const progress = ((Object.keys(answers).length) / questions.length) * 100;

//     return (
//         <div className="w-full max-w-5xl mx-auto h-full flex flex-col">
//             <div className="flex justify-between items-end mb-6">
//                 <div>
//                     <h2 className={`text-2xl font-bold text-${themeColor}-400`}>{title}</h2>
//                     <p className="text-slate-400 text-sm">प्रश्न {currentQIndex + 1} / {questions.length}</p>
//                 </div>
//                 <div className="flex flex-col items-end">
//                     <span className="text-xs text-slate-500 mb-1">{Math.round(progress)}% पूर्ण</span>
//                     <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
//                         <div className={`h-full bg-${themeColor}-500 transition-all duration-500`} style={{ width: `${progress}%` }}></div>
//                     </div>
//                 </div>
//             </div>
//             <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-8 shadow-2xl min-h-[400px] flex flex-col justify-between">
//                 <div>
//                     <h3 className="text-xl text-white font-medium mb-8 leading-relaxed">{currentQ?.question || currentQ?.questionText}</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {currentQ?.options?.map((opt, idx) => {
//                             const isSelected = answers[currentQIndex] === opt;
//                             return (
//                                 <button key={idx} onClick={() => handleSelect(opt)} className={`p-4 rounded-xl border-2 text-left transition-all flex items-center ${isSelected ? `bg-${themeColor}-600/20 border-${themeColor}-500 text-white` : 'bg-slate-950/50 border-slate-800 text-slate-300'}`}>
//                                     <span className={`w-8 h-8 rounded-full border flex items-center justify-center mr-3 font-bold text-sm ${isSelected ? `bg-${themeColor}-500 border-${themeColor}-500` : 'border-slate-600'}`}>{String.fromCharCode(65 + idx)}</span>
//                                     {opt}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>
//                 <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
//                     <button onClick={() => setCurrentQIndex(p => Math.max(0, p - 1))} disabled={currentQIndex === 0} className="px-6 py-2 rounded-lg text-slate-400 hover:bg-white/5 disabled:opacity-30">मागील</button>
//                     {currentQIndex === questions.length - 1 ? (
//                         <button onClick={handleSubmit} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-bold flex items-center gap-2`}>सबमिट करा <IoMdCheckmarkCircle /></button>
//                     ) : (
//                         <button onClick={() => setCurrentQIndex(p => Math.min(questions.length - 1, p + 1))} className="px-8 py-3 bg-white text-black rounded-xl font-bold flex items-center gap-2">पुढील <FaArrowRight /></button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ==========================================
// // 3. SYSTEM CHECK STAGE
// // ==========================================
// const DeviceCheckStage = ({ onComplete }) => {
//     const [speakerStatus, setSpeakerStatus] = useState('idle'); 
//     const [micStatus, setMicStatus] = useState('idle');

//     useEffect(() => { if (typeof window !== 'undefined') window.speechSynthesis.getVoices(); }, []);

//     const testSpeaker = () => {
//         setSpeakerStatus('testing');
//         speakText("नमस्कार, ही सिस्टम चेक टेस्ट आहे.", () => setSpeakerStatus('success'));
//     };

//     const testMic = () => {
//         setMicStatus('testing');
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) { alert("Mic Not Supported"); setMicStatus('success'); return; }
        
//         const recognition = new SpeechRecognition();
//         recognition.lang = 'mr-IN';
//         recognition.onresult = () => { setMicStatus('success'); recognition.stop(); };
//         recognition.onerror = () => { setMicStatus('idle'); alert("Mic Error"); };
//         recognition.start();
//         setTimeout(() => { if(micStatus !== 'success') recognition.stop(); }, 4000);
//     };

//     const isReady = speakerStatus === 'success' && micStatus === 'success';

//     return (
//         <div className="max-w-xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center">
//             <h2 className="text-3xl font-bold text-white mb-2">सिस्टम चेक</h2>
//             <p className="text-slate-400 mb-8">मुलाखत सुरू करण्यापूर्वी डिव्हाइस तपासा.</p>
//             <div className="space-y-4 mb-10">
//                 <div className={`p-4 rounded-2xl border flex justify-between items-center ${speakerStatus === 'success' ? 'border-green-500 bg-green-500/10' : 'border-slate-700 bg-slate-800'}`}>
//                     <div className="flex items-center gap-4"><div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white"><FaVolumeUp /></div><p className="font-bold">स्पीकर</p></div>
//                     <button onClick={testSpeaker} className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-bold">{speakerStatus === 'success' ? 'Verified' : 'Test'}</button>
//                 </div>
//                 <div className={`p-4 rounded-2xl border flex justify-between items-center ${micStatus === 'success' ? 'border-green-500 bg-green-500/10' : 'border-slate-700 bg-slate-800'}`}>
//                     <div className="flex items-center gap-4"><div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white"><FaMicrophone /></div><p className="font-bold">माईक</p></div>
//                     <button onClick={testMic} className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-bold">{micStatus === 'success' ? 'Verified' : 'Test'}</button>
//                 </div>
//             </div>
//             <button onClick={onComplete} disabled={!isReady} className={`w-full py-4 rounded-xl font-bold text-lg ${isReady ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>मुलाखत सुरू करा</button>
//         </div>
//     );
// };

// // ==========================================
// // 4. VOICE INTERVIEW STAGE
// // ==========================================
// const VoiceStage = ({ onComplete }) => {
//     const [qIndex, setQIndex] = useState(0);
//     const [isSpeaking, setIsSpeaking] = useState(false);
//     const [isRecording, setIsRecording] = useState(false);
//     const [transcript, setTranscript] = useState('');
//     const [questions, setQuestions] = useState([]);
//     const [results, setResults] = useState({}); 
//     const recognitionRef = useRef(null);

//     useEffect(() => {
//         const shuffled = [...INTERVIEW_POOL].sort(() => 0.5 - Math.random());
//         setQuestions(shuffled.slice(0, 5));
//     }, []);

//     useEffect(() => {
//         if (questions.length > 0) setTimeout(() => playQuestion(0), 1000);
//         return () => { if (recognitionRef.current) recognitionRef.current.stop(); };
//     }, [questions]);

//     const playQuestion = (index) => {
//         if (index >= questions.length) return;
//         setTranscript('');
//         setIsRecording(false);
//         if (recognitionRef.current) recognitionRef.current.stop();
//         setIsSpeaking(true);
//         speakText(questions[index], () => {
//             setIsSpeaking(false);
//             startListening(); 
//         });
//     };

//     const startListening = () => {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return;
//         const recognition = new SpeechRecognition();
//         recognition.lang = 'mr-IN';
//         recognition.continuous = true;
//         recognition.interimResults = true;
//         recognitionRef.current = recognition;
//         recognition.onstart = () => setIsRecording(true);
//         recognition.onresult = (event) => {
//             let final = '';
//             for (let i = event.resultIndex; i < event.results.length; ++i) {
//                 if (event.results[i].isFinal) final += event.results[i][0].transcript + ' ';
//             }
//             setTranscript(prev => prev + final);
//         };
//         try { recognition.start(); } catch(e) { console.error(e); }
//     };

//     const handleNext = () => {
//         if (recognitionRef.current) recognitionRef.current.stop();
//         setIsRecording(false);
//         const currentAnswerData = { question: questions[qIndex], answer: transcript.trim() || "No Audio" };
//         const updatedResults = { ...results, [qIndex]: currentAnswerData };
//         setResults(updatedResults);

//         if (qIndex < 4) {
//             setQIndex(prev => prev + 1);
//             setTimeout(() => playQuestion(qIndex + 1), 500);
//         } else {
//             onComplete({ answers: updatedResults }); 
//         }
//     };

//     if (questions.length === 0) return <LoadingScreen text="मुलाखत तयार होत आहे..." color="purple" />;

//     return (
//         <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
//             <div className="w-full text-center mb-8">
//                 <span className="text-purple-400 font-bold uppercase text-sm">प्रश्न {qIndex + 1} / 5</span>
//                 <div className="w-full h-1 bg-slate-800 rounded-full mt-4"><div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${((qIndex+1)/5)*100}%` }}></div></div>
//             </div>
//             <div className="relative w-full bg-slate-900/80 border border-slate-700 p-12 rounded-3xl shadow-2xl text-center">
//                 <h2 className="text-3xl text-white font-bold mb-8 leading-normal">{questions[qIndex]}</h2>
//                 <div className="flex justify-center mb-8 h-24 items-center">
//                     {isSpeaking ? (
//                         <div className="flex items-center gap-2 text-purple-400"><FaVolumeUp className="animate-pulse text-3xl" /> प्रश्न बोलला जात आहे...</div>
//                     ) : (
//                         <div className="flex flex-col items-center gap-2">
//                              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl transition-all ${isRecording ? 'bg-red-500 animate-pulse shadow-[0_0_40px_rgba(239,68,68,0.5)]' : 'bg-slate-700'}`}><IoMdMicrophone /></div>
//                              {isRecording && <span className="text-red-400 text-xs tracking-widest animate-pulse font-bold mt-2">रेकॉर्डिंग चालू आहे...</span>}
//                         </div>
//                     )}
//                 </div>
//                 <div className="bg-black/30 rounded-xl p-6 min-h-[120px] mb-8 text-slate-300 italic border border-white/5 text-left text-lg">
//                     {transcript || (isRecording ? "ऐकत आहे..." : "प्रश्नाची प्रतीक्षा करा...")}
//                 </div>
//                 <button onClick={handleNext} disabled={isSpeaking} className={`px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all flex items-center gap-2 mx-auto ${isSpeaking ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-white text-black hover:scale-105'}`}>
//                     {qIndex === 4 ? "मुलाखत संपवा" : "पुढील प्रश्न"} <FaArrowRight />
//                 </button>
//             </div>
//         </div>
//     );
// };

// // ==========================================
// // 5. HELPER COMPONENTS
// // ==========================================
// const LoadingScreen = ({ text, color = 'indigo' }) => (
//     <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
//         <div className={`w-16 h-16 border-4 border-${color}-500/30 border-t-${color}-500 rounded-full animate-spin mb-6`}></div>
//         <h3 className="text-xl text-white font-medium">{text}</h3>
//     </div>
// );

// const TransitionScreen = ({ title, subtitle, icon, color, onNext }) => (
//     <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="max-w-md mx-auto text-center bg-slate-900/80 backdrop-blur-xl border border-white/10 p-12 rounded-[2.5rem] shadow-2xl">
//         <div className={`w-24 h-24 bg-${color}-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-${color}-400 text-4xl`}>{icon}</div>
//         <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
//         <p className="text-slate-400 mb-8 text-lg">{subtitle}</p>
//         <button onClick={onNext} className={`px-8 py-4 bg-${color}-600 hover:bg-${color}-500 text-white rounded-full font-bold shadow-lg flex items-center gap-2 mx-auto`}>पुढे जा <FaArrowRight /></button>
//     </motion.div>
// );

// // ==========================================
// // MAIN CONTROLLER
// // ==========================================
// export default function FullAssessmentFlow() {
//     const router = useRouter();
//     const [stage, setStage] = useState('input'); 
//     const [formUserInfo, setFormUserInfo] = useState(null); // Data from the input form
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [masterData, setMasterData] = useState({ assessment: null, interview: null, situation: null });
    
//     // --- AUTH STATE ---
//     const [loggedInUser, setLoggedInUser] = useState(null); // User from LocalStorage
//     const [authToken, setAuthToken] = useState(null); // Token from LocalStorage

//     // 1. On Mount: Get Logged In User
//     useEffect(() => {
//         const userStr = localStorage.getItem('user');
//         const token = localStorage.getItem('token');
//         if (userStr) setLoggedInUser(JSON.parse(userStr));
//         if (token) setAuthToken(token);
//     }, []);

//     const handleInputComplete = (data) => {
//         setFormUserInfo(data);
//         setStage('assessment');
//     };

//     const handleStageData = (key, data) => {
//         setMasterData(prev => ({ ...prev, [key]: data }));
//     };

//     const formatAndSubmitData = async (finalSituationData) => {
//         setIsSubmitting(true);
        
//         // --- 2. FIXED: Use Dynamic Email ---
//         const userEmail = loggedInUser?.email || "anonymous@student.com";

//         const payload = {
//             email: userEmail, // <--- NOW DYNAMIC
//             userInfo: formUserInfo, 
//             masterData: {
//                 assessment: masterData.assessment,
//                 voiceInterview: masterData.interview,
//                 situation: finalSituationData      
//             }
//         };

//         try {
//             const res = await fetch('/api/submit-full-assessment', { // Use your correct API route name
//                 method: 'POST',
//                 headers: { 
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${authToken}` // <--- 3. FIXED: Add Token
//                 }, 
//                 body: JSON.stringify(payload)
//             });

//             if (res.ok) {
//                 setStage('success');
//             } else {
//                 console.error("Server Error:", await res.text());
//                 alert("Submission Failed. Please try again.");
//             }
//         } catch (error) {
//             console.error("Network Error", error);
//             alert("Network Error.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (isSubmitting) return <LoadingScreen text="निकाल जतन करत आहोत..." color="green" />;

//     return (
//         <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
//             <Head><title>Full Assessment | Shakkti AI</title></Head>
//             <div className="fixed inset-0 z-0 pointer-events-none">
//                 <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"></div>
//                 <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px]"></div>
//             </div>

//             <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
//                 <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
//                     <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">S</span> Shakkti AI
//                 </div>
//                 {loggedInUser && <div className="text-sm text-slate-400">Hi, {loggedInUser.fullName}</div>}
//             </nav>

//             <main className="relative z-10 container mx-auto px-4 py-8 min-h-[85vh] flex flex-col justify-center">
//                 <AnimatePresence mode="wait">
//                     {stage === 'input' && <InputStage key="input" onComplete={handleInputComplete} />}
                    
//                     {stage === 'assessment' && (
//                         <motion.div key="assessment" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
//                             <MCQStage title="तांत्रिक परीक्षा" endpoint="/api/assessment" userData={formUserInfo} themeColor="indigo" onComplete={(data) => { handleStageData('assessment', data); setStage('interview_intro'); }} />
//                         </motion.div>
//                     )}

//                     {stage === 'interview_intro' && <TransitionScreen key="t1" title="तांत्रिक परीक्षा पूर्ण" subtitle="पुढील: व्हॉइस इंटरव्ह्यू" icon={<FaMicrophone />} color="purple" onNext={() => setStage('system_check')} />}

//                     {stage === 'system_check' && <motion.div key="check" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full"><DeviceCheckStage onComplete={() => setStage('interview')} /></motion.div>}

//                     {stage === 'interview' && (
//                         <motion.div key="interview" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
//                             <VoiceStage onComplete={(data) => { handleStageData('interview', data); setStage('situation_intro'); }} />
//                         </motion.div>
//                     )}

//                     {stage === 'situation_intro' && <TransitionScreen key="t2" title="इंटरव्ह्यू पूर्ण झाला" subtitle="पुढील: सिच्युएशन अ‍ॅप्टिट्यूड" icon={<FaBrain />} color="emerald" onNext={() => setStage('situation')} />}

//                     {stage === 'situation' && (
//                         <motion.div key="situation" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
//                             <MCQStage title="सिच्युएशन अ‍ॅप्टिट्यूड" endpoint="/api/situationque" userData={formUserInfo} themeColor="emerald" onComplete={(data) => formatAndSubmitData(data)} />
//                         </motion.div>
//                     )}

//                     {stage === 'success' && (
//                         <motion.div key="success" initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="text-center max-w-xl mx-auto bg-slate-900/80 p-12 rounded-[3rem] border border-white/10 shadow-2xl">
//                             <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]"><IoMdCheckmarkCircle className="text-green-400 text-6xl" /></div>
//                             <h2 className="text-4xl font-bold text-white mb-4">अभिनंदन!</h2>
//                             <p className="text-slate-400 mb-8 text-lg">तुमचा पेपर यशस्वीरित्या सबमिट झाला आहे.</p>
//                             <button onClick={() => router.push('/')} className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all">होम पेजवर जा</button>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </main>
//         </div>
//     );
// }

// import React, { useState, useEffect, useRef } from 'react';
// import Head from 'next/head';
// import { useRouter } from 'next/router';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//     IoMdMicrophone, 
//     IoMdCheckmarkCircle,
//     IoIosArrowDown,
//     IoMdPause,
//     IoMdPlay
// } from 'react-icons/io';
// import { 
//     FaVolumeUp, 
//     FaMicrophone, 
//     FaArrowRight, 
//     FaBrain, 
//     FaUserGraduate,
// } from 'react-icons/fa';

// // ==========================================
// // 0. CONFIGURATION & UTILS
// // ==========================================

// const INTERVIEW_POOL = [
//     "तुमच्याबद्दल थोडक्यात सांगा.", 
//     "तुम्हाला आमच्या कंपनीत काम का करायचे आहे?", 
//     "तुमच्या जमेच्या बाजू (Strengths) आणि कमकुवत बाजू (Weaknesses) कोणत्या आहेत?",
//     "पुढील ३-५ वर्षांत तुम्ही स्वतःला कुठे पाहता?", 
//     "आम्ही तुमची निवड का करावी?", 
//     "तुम्ही कामाचा ताण किंवा दबाव कसा हाताळता?", 
//     "एखाद्या कठीण प्रसंगाचे वर्णन करा ज्याचा तुम्ही सामना केला आणि तो कसा सोडवला?", 
//     "तुम्हाला काम करण्यासाठी कोणती गोष्ट प्रेरित करते?", 
//     "टीममधील मतभेद किंवा संघर्ष तुम्ही कसे हाताळता?", 
//     "तुम्ही स्वतंत्रपणे आणि टीममध्ये काम करण्यास तयार आहात का?" 
// ];

// // Robust Text-to-Speech
// const speakText = (text, onEndCallback) => {
//     if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
//         if(onEndCallback) onEndCallback();
//         return;
//     }
//     window.speechSynthesis.cancel();
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.9; 
//     utterance.lang = 'mr-IN'; 
    
//     // Try to find a Marathi or Hindi voice
//     const voices = window.speechSynthesis.getVoices();
//     const specificVoice = voices.find(v => v.lang.includes('mr') || v.lang.includes('hi'));
//     if (specificVoice) utterance.voice = specificVoice;

//     utterance.onend = () => { if (onEndCallback) onEndCallback(); };
//     utterance.onerror = (e) => { console.error(e); if (onEndCallback) onEndCallback(); };
//     window.speechSynthesis.speak(utterance);
// };

// // API Fetcher with Fallback
// const fetchQuestionsFromAPI = async (endpoint, userDetails) => {
//     try {
//         const response = await fetch(endpoint, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 type: 'generate_questions',
//                 standard: userDetails.standard,
//                 subject: userDetails.subject
//             })
//         });
//         const data = await response.json();
//         if (data.result && Array.isArray(data.result)) return data.result;
//         if (data.questions) return data.questions;
//         throw new Error("Invalid Format");
//     } catch (error) {
//         console.warn(`API Error (${endpoint}), using fallback data.`);
//         const isSituation = endpoint.includes('situation');
//         return Array.from({ length: isSituation ? 20 : 25 }, (_, i) => ({
//             id: i + 1,
//             question: isSituation 
//                 ? `(डेमो) खालीलपैकी कोणत्या परिस्थितीत तुम्ही काय कराल? प्रश्न क्रमांक ${i + 1}`
//                 : `(डेमो) विषयाशी संबंधित तांत्रिक प्रश्न क्रमांक ${i + 1}?`,
//             options: ["पर्याय अ", "पर्याय ब", "पर्याय क", "पर्याय ड"],
//             correctAnswer: "पर्याय अ" 
//         }));
//     }
// };

// // ==========================================
// // 1. INPUT STAGE 
// // ==========================================
// const InputStage = ({ onComplete }) => {
//     const [formData, setFormData] = useState({ standard: '', subject: '' });

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (formData.standard && formData.subject) {
//             onComplete(formData);
//         } else {
//             alert("कृपया सर्व माहिती भरा. (Please fill all details)");
//         }
//     };

//     return (
//         <motion.div 
//             initial={{ opacity: 0, y: 20 }} 
//             animate={{ opacity: 1, y: 0 }} 
//             className="max-w-xl mx-auto bg-slate-800/90 backdrop-blur-xl border border-slate-700 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
//         >
//             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
//             <div className="text-center mb-8">
//                 <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl shadow-lg shadow-purple-500/30">
//                     <FaUserGraduate />
//                 </div>
//                 <h2 className="text-3xl font-bold text-white mb-2">विद्यार्थी तपशील</h2>
//                 <p className="text-slate-400">तुमची माहिती भरून परीक्षा सुरू करा</p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                     <label className="block text-indigo-300 text-xs font-bold mb-2 uppercase tracking-wider">
//                         तुमची इयत्ता (Standard)
//                     </label>
//                     <input 
//                         type="text" 
//                         placeholder="उदा. १२वी सायन्स" 
//                         value={formData.standard} 
//                         onChange={(e) => setFormData({...formData, standard: e.target.value})} 
//                         className="w-full bg-slate-950 border border-slate-600 text-white rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500 transition-all" 
//                         required 
//                     />
//                 </div>

//                 <div className="relative">
//                     <label className="block text-indigo-300 text-xs font-bold mb-2 uppercase tracking-wider">
//                         विषय निवडा (Subject)
//                     </label>
//                     <select 
//                         value={formData.subject} 
//                         onChange={(e) => setFormData({...formData, subject: e.target.value})} 
//                         className={`w-full bg-slate-950 border border-slate-600 rounded-xl px-5 py-4 appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer ${formData.subject === "" ? "text-slate-500" : "text-white"}`}
//                         required
//                     >
//                         <option value="" disabled>Select Subject</option>
//                         <option value="PCB">PCB (Printed Circuit Board)</option>
//                         <option value="AAO">AAO (Automotive Assembly Operator)</option>
//                     </select>
//                     <div className="pointer-events-none absolute bottom-5 right-5 text-indigo-400">
//                         <IoIosArrowDown size={20} />
//                     </div>
//                 </div>

//                 <button 
//                     type="submit" 
//                     className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl mt-4 shadow-lg shadow-indigo-600/30 transform transition hover:-translate-y-1"
//                 >
//                     परीक्षा सुरू करा &rarr;
//                 </button>
//             </form>
//         </motion.div>
//     );
// };

// // ==========================================
// // 2. MCQ STAGE (Fixed Progress Bar)
// // ==========================================
// const MCQStage = ({ title, endpoint, userData, themeColor, onComplete }) => {
//     const [questions, setQuestions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentQIndex, setCurrentQIndex] = useState(0);
//     const [answers, setAnswers] = useState({}); 

//     useEffect(() => {
//         const load = async () => {
//             setLoading(true);
//             const data = await fetchQuestionsFromAPI(endpoint, userData);
//             setQuestions(data);
//             setLoading(false);
//         };
//         load();
//     }, [endpoint, userData]);

//     const handleSelect = (option) => {
//         setAnswers(prev => ({ ...prev, [currentQIndex]: option }));
//     };

//     const handleSubmit = () => {
//         if (Object.keys(answers).length < questions.length) {
//             if(!confirm("काही प्रश्न बाकी आहेत. तरीही सबमिट करायचे?")) return;
//         }
//         onComplete({ questions, answers });
//     };

//     // --- FIX: Robust Progress Calculation ---
//     const totalQuestions = questions.length;
//     const answeredCount = Object.keys(answers).length;
//     const progressPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
    
//     if (loading) return <LoadingScreen text={`${title} तयार होत आहे...`} color={themeColor} />;
    
//     const currentQ = questions[currentQIndex];

//     return (
//         <div className="w-full max-w-5xl mx-auto flex flex-col min-h-[600px]">
//             {/* Header & Progress */}
//             <div className="flex justify-between items-end mb-6 px-2">
//                 <div>
//                     <h2 className={`text-2xl font-bold text-${themeColor}-400`}>{title}</h2>
//                     <p className="text-slate-400 text-sm mt-1">
//                         प्रश्न {currentQIndex + 1} / {totalQuestions}
//                     </p>
//                 </div>
//                 <div className="flex flex-col items-end w-1/3">
//                     <span className="text-xs text-slate-500 mb-2 font-mono">
//                         {Math.round(progressPercentage)}% पूर्ण
//                     </span>
//                     <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
//                         <div 
//                             className={`h-full bg-${themeColor}-500 transition-all duration-700 ease-out`} 
//                             style={{ width: `${progressPercentage}%` }}
//                         ></div>
//                     </div>
//                 </div>
//             </div>

//             {/* Question Card */}
//             <div className="flex-1 bg-slate-900/80 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl flex flex-col justify-between backdrop-blur-sm">
//                 <div>
//                     <h3 className="text-xl md:text-2xl text-white font-medium mb-10 leading-relaxed">
//                         {currentQ?.question}
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {currentQ?.options?.map((opt, idx) => {
//                             const isSelected = answers[currentQIndex] === opt;
//                             return (
//                                 <button 
//                                     key={idx} 
//                                     onClick={() => handleSelect(opt)} 
//                                     className={`p-5 rounded-xl border-2 text-left transition-all flex items-center group
//                                         ${isSelected 
//                                             ? `bg-${themeColor}-900/40 border-${themeColor}-500 text-white shadow-[0_0_15px_rgba(var(--${themeColor}-500),0.3)]` 
//                                             : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-900'
//                                         }`}
//                                 >
//                                     <span className={`w-8 h-8 min-w-[2rem] rounded-full border flex items-center justify-center mr-4 font-bold text-sm transition-colors
//                                         ${isSelected 
//                                             ? `bg-${themeColor}-500 border-${themeColor}-500 text-white` 
//                                             : 'border-slate-600 text-slate-500 group-hover:border-slate-400'
//                                         }`}
//                                     >
//                                         {String.fromCharCode(65 + idx)}
//                                     </span>
//                                     <span className="text-lg">{opt}</span>
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* Footer Controls */}
//                 <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
//                     <button 
//                         onClick={() => setCurrentQIndex(p => Math.max(0, p - 1))} 
//                         disabled={currentQIndex === 0} 
//                         className="px-6 py-3 rounded-xl text-slate-400 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                     >
//                         मागील (Previous)
//                     </button>
                    
//                     {currentQIndex === totalQuestions - 1 ? (
//                         <button 
//                             onClick={handleSubmit} 
//                             className={`px-8 py-3 bg-${themeColor}-600 hover:bg-${themeColor}-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105`}
//                         >
//                             सबमिट करा <IoMdCheckmarkCircle size={20} />
//                         </button>
//                     ) : (
//                         <button 
//                             onClick={() => setCurrentQIndex(p => Math.min(totalQuestions - 1, p + 1))} 
//                             className="px-8 py-3 bg-white text-black hover:bg-slate-200 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
//                         >
//                             पुढील (Next) <FaArrowRight />
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ==========================================
// // 3. SYSTEM CHECK STAGE
// // ==========================================
// const DeviceCheckStage = ({ onComplete }) => {
//     const [speakerStatus, setSpeakerStatus] = useState('idle'); 
//     const [micStatus, setMicStatus] = useState('idle');

//     useEffect(() => { 
//         if (typeof window !== 'undefined') window.speechSynthesis.getVoices(); 
//     }, []);

//     const testSpeaker = () => {
//         setSpeakerStatus('testing');
//         speakText("नमस्कार, ही सिस्टम चेक टेस्ट आहे. आवाज स्पष्ट येत आहे का?", () => setSpeakerStatus('success'));
//     };

//     const testMic = () => {
//         setMicStatus('testing');
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) { 
//             alert("Mic Not Supported in this browser."); 
//             setMicStatus('error'); 
//             return; 
//         }
        
//         const recognition = new SpeechRecognition();
//         recognition.lang = 'mr-IN';
//         recognition.onresult = () => { setMicStatus('success'); recognition.stop(); };
//         recognition.onerror = () => { setMicStatus('idle'); alert("Mic Error. Check permissions."); };
//         recognition.start();
        
//         // Auto-stop after 4s if no sound
//         setTimeout(() => { if(micStatus !== 'success') recognition.stop(); }, 4000);
//     };

//     const isReady = speakerStatus === 'success' && micStatus === 'success';

//     return (
//         <div className="max-w-xl mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-700 p-10 rounded-[2.5rem] shadow-2xl text-center">
//             <h2 className="text-3xl font-bold text-white mb-2">सिस्टम चेक</h2>
//             <p className="text-slate-400 mb-8">मुलाखत सुरू करण्यापूर्वी डिव्हाइस तपासा.</p>
            
//             <div className="space-y-4 mb-10">
//                 {/* Speaker Check */}
//                 <div className={`p-5 rounded-2xl border flex justify-between items-center transition-colors ${speakerStatus === 'success' ? 'border-green-500/50 bg-green-500/10' : 'border-slate-700 bg-slate-800'}`}>
//                     <div className="flex items-center gap-4">
//                         <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-white">
//                             <FaVolumeUp size={20}/>
//                         </div>
//                         <div className="text-left">
//                             <p className="font-bold text-white">स्पीकर</p>
//                             <p className="text-xs text-slate-400">आवाज तपासा</p>
//                         </div>
//                     </div>
//                     <button onClick={testSpeaker} className={`px-5 py-2 rounded-lg font-bold text-sm ${speakerStatus === 'success' ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
//                         {speakerStatus === 'success' ? 'OK ✔' : 'Test'}
//                     </button>
//                 </div>

//                 {/* Mic Check */}
//                 <div className={`p-5 rounded-2xl border flex justify-between items-center transition-colors ${micStatus === 'success' ? 'border-green-500/50 bg-green-500/10' : 'border-slate-700 bg-slate-800'}`}>
//                     <div className="flex items-center gap-4">
//                         <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-white">
//                             <FaMicrophone size={20}/>
//                         </div>
//                         <div className="text-left">
//                             <p className="font-bold text-white">माईक</p>
//                             <p className="text-xs text-slate-400">रेकॉर्डिंग तपासा</p>
//                         </div>
//                     </div>
//                     <button onClick={testMic} className={`px-5 py-2 rounded-lg font-bold text-sm ${micStatus === 'success' ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
//                         {micStatus === 'success' ? 'OK ✔' : 'Test'}
//                     </button>
//                 </div>
//             </div>

//             <button 
//                 onClick={onComplete} 
//                 disabled={!isReady} 
//                 className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isReady ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/25' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
//             >
//                 मुलाखत सुरू करा
//             </button>
//         </div>
//     );
// };

// // ==========================================
// // 4. VOICE INTERVIEW STAGE (REFACTORED)
// // ==========================================
// const VoiceStage = ({ onComplete }) => {
//     const [qIndex, setQIndex] = useState(0);
//     const [status, setStatus] = useState('preparing'); // preparing, speaking_question, listening, paused
    
//     // Transcript State
//     const [permanentTranscript, setPermanentTranscript] = useState(''); // Stores text before pause
//     const [interimTranscript, setInterimTranscript] = useState(''); // Stores text during current session
    
//     const [questions, setQuestions] = useState([]);
//     const [results, setResults] = useState({}); 
    
//     const recognitionRef = useRef(null);

//     // 1. Initialize Questions
//     useEffect(() => {
//         const shuffled = [...INTERVIEW_POOL].sort(() => 0.5 - Math.random());
//         setQuestions(shuffled.slice(0, 5));
//     }, []);

//     // 2. Play Question when qIndex changes
//     useEffect(() => {
//         if (questions.length > 0) {
//             playQuestion(qIndex);
//         }
//         return () => stopRecognition(); // Cleanup
//     }, [questions, qIndex]);

//     const playQuestion = (index) => {
//         if (index >= questions.length) return;
        
//         stopRecognition();
//         setPermanentTranscript('');
//         setInterimTranscript('');
//         setStatus('speaking_question');

//         speakText(questions[index], () => {
//             setStatus('listening');
//             startRecognition(); 
//         });
//     };

//     const startRecognition = () => {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return;

//         const recognition = new SpeechRecognition();
//         recognition.lang = 'mr-IN';
//         recognition.continuous = true;
//         recognition.interimResults = true;
//         recognitionRef.current = recognition;

//         recognition.onstart = () => {
//              // Ensure status is listening only if we meant to start
//              // Logic handled by caller usually
//         };

//         recognition.onresult = (event) => {
//             let finalStr = '';
//             for (let i = event.resultIndex; i < event.results.length; ++i) {
//                 if (event.results[i].isFinal) {
//                     finalStr += event.results[i][0].transcript + ' ';
//                 }
//             }
//             // Update the temporary part
//             setInterimTranscript(prev => prev + finalStr);
//         };

//         recognition.onerror = (e) => console.error("Rec Error", e);
        
//         try { recognition.start(); } catch(e) { console.error(e); }
//     };

//     const stopRecognition = () => {
//         if (recognitionRef.current) {
//             recognitionRef.current.stop();
//             recognitionRef.current = null;
//         }
//     };

//     // --- PAUSE / RESUME LOGIC ---
//     const togglePause = () => {
//         if (status === 'listening') {
//             // PAUSE: Stop mic, save interim to permanent
//             stopRecognition();
//             setPermanentTranscript(prev => prev + interimTranscript);
//             setInterimTranscript('');
//             setStatus('paused');
//         } else if (status === 'paused') {
//             // RESUME: Start mic
//             setStatus('listening');
//             startRecognition();
//         }
//     };

//     const handleNext = () => {
//         stopRecognition();
        
//         // Combine all text
//         const finalAnswer = (permanentTranscript + interimTranscript).trim() || "No Audio Recorded";
        
//         const currentAnswerData = { question: questions[qIndex], answer: finalAnswer };
//         const updatedResults = { ...results, [qIndex]: currentAnswerData };
//         setResults(updatedResults);

//         if (qIndex < 4) {
//             setQIndex(prev => prev + 1);
//         } else {
//             onComplete({ answers: updatedResults }); 
//         }
//     };

//     if (questions.length === 0) return <LoadingScreen text="मुलाखत तयार होत आहे..." color="purple" />;

//     // Helper to display full text
//     const fullDisplayText = (permanentTranscript + " " + interimTranscript).trim();

//     return (
//         <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[600px]">
//             {/* Progress */}
//             <div className="w-full text-center mb-8">
//                 <span className="text-purple-400 font-bold uppercase text-sm tracking-widest">प्रश्न {qIndex + 1} / 5</span>
//                 <div className="w-full h-1 bg-slate-800 rounded-full mt-4">
//                     <div className="h-full bg-purple-500 transition-all duration-500 ease-in-out" style={{ width: `${((qIndex+1)/5)*100}%` }}></div>
//                 </div>
//             </div>

//             {/* Main Card */}
//             <div className="relative w-full bg-slate-900/80 border border-slate-700 p-12 rounded-[2rem] shadow-2xl text-center backdrop-blur-md">
                
//                 <h2 className="text-2xl md:text-3xl text-white font-bold mb-10 leading-normal min-h-[3rem]">
//                     {questions[qIndex]}
//                 </h2>

//                 {/* Animation / Icon Area */}
//                 <div className="flex justify-center mb-10 h-32 items-center">
//                     {status === 'speaking_question' && (
//                         <div className="flex flex-col items-center gap-4 text-purple-400 animate-pulse">
//                             <FaVolumeUp className="text-6xl" /> 
//                             <span className="text-sm font-bold">प्रश्न बोलला जात आहे...</span>
//                         </div>
//                     )}

//                     {status === 'listening' && (
//                         <div className="relative">
//                             <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center text-white text-4xl animate-pulse shadow-[0_0_50px_rgba(239,68,68,0.6)]">
//                                 <IoMdMicrophone />
//                             </div>
//                             <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-red-400 text-xs font-bold tracking-widest whitespace-nowrap">
//                                 REC ●
//                             </span>
//                         </div>
//                     )}

//                     {status === 'paused' && (
//                         <div className="flex flex-col items-center gap-4 text-yellow-500">
//                             <div className="w-24 h-24 border-4 border-yellow-500 rounded-full flex items-center justify-center text-4xl">
//                                 <IoMdPause />
//                             </div>
//                             <span className="text-sm font-bold">माईक थांबवला आहे (Paused)</span>
//                         </div>
//                     )}
//                 </div>

//                 {/* Transcript Box */}
//                 <div className="bg-black/40 rounded-2xl p-6 min-h-[140px] mb-8 text-slate-300 italic border border-white/5 text-left text-lg shadow-inner overflow-y-auto max-h-[200px]">
//                     {fullDisplayText || (
//                         <span className="text-slate-600">
//                             {status === 'speaking_question' ? "प्रश्नाची प्रतीक्षा करा..." : "येथे तुमचे उत्तर दिसेल..."}
//                         </span>
//                     )}
//                 </div>

//                 {/* Controls */}
//                 <div className="flex justify-center gap-4">
//                     {/* Pause/Resume Button */}
//                     {(status === 'listening' || status === 'paused') && (
//                         <button 
//                             onClick={togglePause}
//                             className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all shadow-lg
//                                 ${status === 'listening' 
//                                     ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500 hover:bg-yellow-500 hover:text-white' 
//                                     : 'bg-green-500/20 text-green-400 border border-green-500 hover:bg-green-500 hover:text-white'
//                                 }`}
//                             title={status === 'listening' ? "Pause" : "Resume"}
//                         >
//                             {status === 'listening' ? <IoMdPause /> : <IoMdPlay className="ml-1"/>}
//                         </button>
//                     )}

//                     {/* Next Button */}
//                     <button 
//                         onClick={handleNext} 
//                         disabled={status === 'speaking_question'} 
//                         className={`px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all flex items-center gap-3
//                             ${status === 'speaking_question' 
//                                 ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
//                                 : 'bg-white text-black hover:scale-105 hover:bg-slate-200'
//                             }`}
//                     >
//                         {qIndex === 4 ? "मुलाखत संपवा" : "पुढील प्रश्न"} <FaArrowRight />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ==========================================
// // 5. HELPER COMPONENTS
// // ==========================================
// const LoadingScreen = ({ text, color = 'indigo' }) => (
//     <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
//         <div className={`w-16 h-16 border-4 border-${color}-500/30 border-t-${color}-500 rounded-full animate-spin mb-6`}></div>
//         <h3 className="text-xl text-white font-medium tracking-wide">{text}</h3>
//     </div>
// );

// const TransitionScreen = ({ title, subtitle, icon, color, onNext }) => (
//     <motion.div 
//         initial={{opacity:0, scale:0.95}} 
//         animate={{opacity:1, scale:1}} 
//         className="max-w-md mx-auto text-center bg-slate-900/80 backdrop-blur-xl border border-white/10 p-12 rounded-[2.5rem] shadow-2xl"
//     >
//         <div className={`w-24 h-24 bg-${color}-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-${color}-400 text-4xl shadow-[0_0_30px_rgba(var(--${color}-500),0.2)]`}>
//             {icon}
//         </div>
//         <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
//         <p className="text-slate-400 mb-10 text-lg leading-relaxed">{subtitle}</p>
//         <button 
//             onClick={onNext} 
//             className={`px-10 py-4 bg-${color}-600 hover:bg-${color}-500 text-white rounded-full font-bold shadow-lg flex items-center gap-3 mx-auto transition-transform hover:scale-105`}
//         >
//             पुढे जा <FaArrowRight />
//         </button>
//     </motion.div>
// );

// // ==========================================
// // MAIN CONTROLLER
// // ==========================================
// export default function FullAssessmentFlow() {
//     const router = useRouter();
//     const [stage, setStage] = useState('input'); 
//     const [formUserInfo, setFormUserInfo] = useState(null); 
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [masterData, setMasterData] = useState({ assessment: null, interview: null, situation: null });
    
//     // Auth
//     const [loggedInUser, setLoggedInUser] = useState(null);
//     const [authToken, setAuthToken] = useState(null);

//     useEffect(() => {
//         const userStr = localStorage.getItem('user');
//         const token = localStorage.getItem('token');
//         if (userStr) setLoggedInUser(JSON.parse(userStr));
//         if (token) setAuthToken(token);
//     }, []);

//     const handleInputComplete = (data) => {
//         setFormUserInfo(data);
//         setStage('assessment');
//     };

//     const handleStageData = (key, data) => {
//         setMasterData(prev => ({ ...prev, [key]: data }));
//     };

//     const formatAndSubmitData = async (finalSituationData) => {
//         setIsSubmitting(true);
//         const userEmail = loggedInUser?.email || "anonymous@student.com";

//         const payload = {
//             email: userEmail,
//             userInfo: formUserInfo, 
//             masterData: {
//                 assessment: masterData.assessment,
//                 voiceInterview: masterData.interview,
//                 situation: finalSituationData      
//             }
//         };

//         try {
//             const res = await fetch('/api/submit-full-assessment', { 
//                 method: 'POST',
//                 headers: { 
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${authToken}`
//                 }, 
//                 body: JSON.stringify(payload)
//             });

//             if (res.ok) {
//                 setStage('success');
//             } else {
//                 console.error("Server Error:", await res.text());
//                 alert("Submission Failed. Please try again.");
//             }
//         } catch (error) {
//             console.error("Network Error", error);
//             alert("Network Error.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (isSubmitting) return <LoadingScreen text="निकाल जतन करत आहोत..." color="green" />;

//     return (
//         <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
//             <Head><title>Full Assessment | Shakkti AI</title></Head>
            
//             {/* Background Ambience */}
//             <div className="fixed inset-0 z-0 pointer-events-none">
//                 <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"></div>
//                 <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px]"></div>
//             </div>

//             {/* Navbar */}
//             <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
//                 <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
//                     <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">S</span> 
//                     Shakkti AI
//                 </div>
//                 {loggedInUser && <div className="text-sm text-slate-400 bg-white/5 px-4 py-2 rounded-full">Hi, {loggedInUser.fullName}</div>}
//             </nav>

//             {/* Main Content Area */}
//             <main className="relative z-10 container mx-auto px-4 py-12 min-h-[85vh] flex flex-col justify-center">
//                 <AnimatePresence mode="wait">
//                     {stage === 'input' && <InputStage key="input" onComplete={handleInputComplete} />}
                    
//                     {stage === 'assessment' && (
//                         <motion.div key="assessment" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
//                             <MCQStage title="तांत्रिक परीक्षा" endpoint="/api/assessment" userData={formUserInfo} themeColor="indigo" onComplete={(data) => { handleStageData('assessment', data); setStage('interview_intro'); }} />
//                         </motion.div>
//                     )}

//                     {stage === 'interview_intro' && <TransitionScreen key="t1" title="तांत्रिक परीक्षा पूर्ण" subtitle="पुढील: व्हॉइस इंटरव्ह्यू (Voice Interview)" icon={<FaMicrophone />} color="purple" onNext={() => setStage('system_check')} />}

//                     {stage === 'system_check' && <motion.div key="check" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full"><DeviceCheckStage onComplete={() => setStage('interview')} /></motion.div>}

//                     {stage === 'interview' && (
//                         <motion.div key="interview" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
//                             <VoiceStage onComplete={(data) => { handleStageData('interview', data); setStage('situation_intro'); }} />
//                         </motion.div>
//                     )}

//                     {stage === 'situation_intro' && <TransitionScreen key="t2" title="इंटरव्ह्यू पूर्ण झाला" subtitle="पुढील: सिच्युएशन अ‍ॅप्टिट्यूड" icon={<FaBrain />} color="emerald" onNext={() => setStage('situation')} />}

//                     {stage === 'situation' && (
//                         <motion.div key="situation" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
//                             <MCQStage title="सिच्युएशन अ‍ॅप्टिट्यूड" endpoint="/api/situationque" userData={formUserInfo} themeColor="emerald" onComplete={(data) => formatAndSubmitData(data)} />
//                         </motion.div>
//                     )}

//                     {stage === 'success' && (
//                         <motion.div key="success" initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="text-center max-w-xl mx-auto bg-slate-900/80 p-12 rounded-[3rem] border border-white/10 shadow-2xl backdrop-blur-md">
//                             <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
//                                 <IoMdCheckmarkCircle className="text-green-400 text-6xl" />
//                             </div>
//                             <h2 className="text-4xl font-bold text-white mb-4">अभिनंदन!</h2>
//                             <p className="text-slate-400 mb-10 text-lg">तुमचा पेपर यशस्वीरित्या सबमिट झाला आहे.</p>
//                             <button onClick={() => router.push('/')} className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700">
//                                 होम पेजवर जा
//                             </button>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </main>
//         </div>
//     );
// }


// import React, { useState, useEffect, useRef } from 'react';
// import Head from 'next/head';
// import { useRouter } from 'next/router';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//     IoMdMicrophone, 
//     IoMdCheckmarkCircle,
//     IoIosArrowDown,
//     IoMdPause,
//     IoMdPlay
// } from 'react-icons/io';
// import { 
//     FaVolumeUp, 
//     FaMicrophone, 
//     FaArrowRight, 
//     FaBrain, 
//     FaUserGraduate,
// } from 'react-icons/fa';

// // ==========================================
// // 0. CONFIGURATION & UTILS
// // ==========================================

// const INTERVIEW_POOL = [
//     "तुमच्याबद्दल थोडक्यात सांगा.", 
//     "तुम्हाला आमच्या कंपनीत काम का करायचे आहे?", 
//     "तुमच्या जमेच्या बाजू (Strengths) आणि कमकुवत बाजू (Weaknesses) कोणत्या आहेत?",
//     "पुढील ३-५ वर्षांत तुम्ही स्वतःला कुठे पाहता?", 
//     "आम्ही तुमची निवड का करावी?", 
//     "तुम्ही कामाचा ताण किंवा दबाव कसा हाताळता?", 
//     "एखाद्या कठीण प्रसंगाचे वर्णन करा ज्याचा तुम्ही सामना केला आणि तो कसा सोडवला?", 
//     "तुम्हाला काम करण्यासाठी कोणती गोष्ट प्रेरित करते?", 
//     "टीममधील मतभेद किंवा संघर्ष तुम्ही कसे हाताळता?", 
//     "तुम्ही स्वतंत्रपणे आणि टीममध्ये काम करण्यास तयार आहात का?" 
// ];

// // Robust Text-to-Speech
// const speakText = (text, onEndCallback) => {
//     if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
//         if(onEndCallback) onEndCallback();
//         return;
//     }
//     window.speechSynthesis.cancel();
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.9; 
//     utterance.lang = 'mr-IN'; 
    
//     const voices = window.speechSynthesis.getVoices();
//     const specificVoice = voices.find(v => v.lang.includes('mr') || v.lang.includes('hi'));
//     if (specificVoice) utterance.voice = specificVoice;

//     utterance.onend = () => { if (onEndCallback) onEndCallback(); };
//     utterance.onerror = (e) => { console.error(e); if (onEndCallback) onEndCallback(); };
//     window.speechSynthesis.speak(utterance);
// };

// // API Fetcher - UPDATED to use GET for reliability where needed and strictly wait
// const fetchQuestionsFromAPI = async (endpoint, userDetails) => {
//     try {
//         // Construct URL for GET request if needed, or use POST body
//         // Note: Your backend Situation API seemed to prefer GET or POST. 
//         // We will stick to the method that matches your specific backend route handler logic.
//         // Assuming your updated backend handles POST for generation:
        
//         const response = await fetch(endpoint, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 type: 'generate_questions',
//                 standard: userDetails.standard,
//                 subject: userDetails.subject
//             })
//         });

//         if (!response.ok) {
//             throw new Error(`API Error: ${response.status}`);
//         }

//         const data = await response.json();
        
//         // Robust check for array data
//         if (data.result && Array.isArray(data.result) && data.result.length > 0) return data.result;
//         if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) return data.questions;
        
//         throw new Error("Invalid or Empty Data Format");

//     } catch (error) {
//         console.error(`Error fetching from ${endpoint}:`, error);
//         throw error; // Throw error to let the component handle the loading state or retry
//     }
// };
// export const fetchAssessmentQuestions = async (userDetails) => {
//   try {
//     const res = await fetch("/api/assessment", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         type: "generate_questions",
//         standard: userDetails.standard,
//         subject: userDetails.subject
//       })
//     });

//     if (!res.ok) {
//       throw new Error(await res.text());
//     }

//     const data = await res.json();

//     if (!data.result || !Array.isArray(data.result)) {
//       throw new Error("Invalid assessment response");
//     }

//     return data.result.map((q, index) => ({
//       id: q.id ?? index + 1,
//       question: q.question,
//       options: q.options,
//       correctAnswer: q.correctAnswer
//     }));

//   } catch (err) {
//     console.error("Assessment API error:", err);
//     throw err;
//   }
// };
// export const fetchSituationQuestions = async () => {
//   try {
//     const res = await fetch("/api/situationque", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" }
//     });

//     if (!res.ok) {
//       throw new Error(await res.text());
//     }

//     const data = await res.json();

//     if (!data.result || !Array.isArray(data.result)) {
//       throw new Error("Invalid situation response");
//     }

//     return data.result.map((q, index) => ({
//       id: q.id ?? index + 1,
//       question: q.question,
//       options: q.options,
//       correctAnswer: q.correctAnswer
//     }));

//   } catch (err) {
//     console.error("Situation API error:", err);
//     throw err;
//   }
// };


// // ==========================================
// // 1. INPUT STAGE 
// // ==========================================
// const InputStage = ({ onComplete }) => {
//     const [formData, setFormData] = useState({ standard: '', subject: '' });

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (formData.standard && formData.subject) {
//             onComplete(formData);
//         } else {
//             alert("कृपया सर्व माहिती भरा. (Please fill all details)");
//         }
//     };

//     return (
//         <motion.div 
//             initial={{ opacity: 0, y: 20 }} 
//             animate={{ opacity: 1, y: 0 }} 
//             className="max-w-xl mx-auto bg-slate-800/90 backdrop-blur-xl border border-slate-700 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
//         >
//             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
//             <div className="text-center mb-8">
//                 <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl shadow-lg shadow-purple-500/30">
//                     <FaUserGraduate />
//                 </div>
//                 <h2 className="text-3xl font-bold text-white mb-2">विद्यार्थी तपशील</h2>
//                 <p className="text-slate-400">तुमची माहिती भरून परीक्षा सुरू करा</p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                     <label className="block text-indigo-300 text-xs font-bold mb-2 uppercase tracking-wider">
//                         तुमची इयत्ता (Standard)
//                     </label>
//                     <input 
//                         type="text" 
//                         placeholder="उदा. १२वी सायन्स" 
//                         value={formData.standard} 
//                         onChange={(e) => setFormData({...formData, standard: e.target.value})} 
//                         className="w-full bg-slate-950 border border-slate-600 text-white rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500 transition-all" 
//                         required 
//                     />
//                 </div>

//                 <div className="relative">
//                     <label className="block text-indigo-300 text-xs font-bold mb-2 uppercase tracking-wider">
//                         विषय निवडा (Subject)
//                     </label>
//                     <select 
//                         value={formData.subject} 
//                         onChange={(e) => setFormData({...formData, subject: e.target.value})} 
//                         className={`w-full bg-slate-950 border border-slate-600 rounded-xl px-5 py-4 appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer ${formData.subject === "" ? "text-slate-500" : "text-white"}`}
//                         required
//                     >
//                         <option value="" disabled>Select Subject</option>
//                         <option value="PCB">PCB (Printed Circuit Board)</option>
//                         <option value="AAO">AAO (Automotive Assembly Operator)</option>

//                     </select>
//                     <div className="pointer-events-none absolute bottom-5 right-5 text-indigo-400">
//                         <IoIosArrowDown size={20} />
//                     </div>
//                 </div>

//                 <button 
//                     type="submit" 
//                     className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl mt-4 shadow-lg shadow-indigo-600/30 transform transition hover:-translate-y-1"
//                 >
//                     परीक्षा सुरू करा &rarr;
//                 </button>
//             </form>
//         </motion.div>
//     );
// };

// // ==========================================
// // 2. MCQ STAGE (With strict Loading State)
// // ==========================================
// const MCQStage = ({ title, endpoint, userData, themeColor, onComplete }) => {
//     const [questions, setQuestions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [currentQIndex, setCurrentQIndex] = useState(0);
//     const [answers, setAnswers] = useState({}); 

//     useEffect(() => {
//         let isMounted = true;
        
//         const load = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const data = await fetchQuestionsFromAPI(endpoint, userData);
//                 if (isMounted) {
//                     setQuestions(data);
//                     setLoading(false);
//                 }
//             } catch (err) {
//                 if (isMounted) {
//                     // Fallback only on explicit error, but mark as loaded
//                     console.error("Failed to load questions, retrying or using fallback");
//                     // Minimal fallback to prevent crash, but strictly labeled
//                     setQuestions(Array.from({ length: 10 }, (_, i) => ({
//                         id: i + 1,
//                         question: "Server is busy. Please try reloading or continue with this demo question.",
//                         options: ["Option A", "Option B", "Option C", "Option D"],
//                         correctAnswer: "Option A"
//                     })));
//                     setLoading(false);
//                 }
//             }
//         };
        
//         load();
        
//         return () => { isMounted = false; };
//     }, [endpoint, userData]);

//     const handleSelect = (option) => {
//         setAnswers(prev => ({ ...prev, [currentQIndex]: option }));
//     };

//     const handleSubmit = () => {
//         if (Object.keys(answers).length < questions.length) {
//             if(!confirm("काही प्रश्न बाकी आहेत. तरीही सबमिट करायचे?")) return;
//         }
//         // Just return data to parent, do NOT call API here
//         onComplete({ questions, answers });
//     };

//     // Calculate Progress
//     const totalQuestions = questions.length;
//     const answeredCount = Object.keys(answers).length;
//     const progressPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
    
//     // Strict Loading View - No Garbage Values
//     if (loading) return <LoadingScreen text={`${title} तयार होत आहे... (Generating Questions)`} color={themeColor} />;
    
//     if (questions.length === 0) return <div className="text-center text-white">No questions loaded. Please refresh.</div>;

//     const currentQ = questions[currentQIndex];

//     return (
//         <div className="w-full max-w-5xl mx-auto flex flex-col min-h-[600px]">
//             {/* Header & Progress */}
//             <div className="flex justify-between items-end mb-6 px-2">
//                 <div>
//                     <h2 className={`text-2xl font-bold text-${themeColor}-400`}>{title}</h2>
//                     <p className="text-slate-400 text-sm mt-1">
//                         प्रश्न {currentQIndex + 1} / {totalQuestions}
//                     </p>
//                 </div>
//                 <div className="flex flex-col items-end w-1/3">
//                     <span className="text-xs text-slate-500 mb-2 font-mono">
//                         {Math.round(progressPercentage)}% पूर्ण
//                     </span>
//                     <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
//                         <div 
//                             className={`h-full bg-${themeColor}-500 transition-all duration-700 ease-out`} 
//                             style={{ width: `${progressPercentage}%` }}
//                         ></div>
//                     </div>
//                 </div>
//             </div>

//             {/* Question Card */}
//             <div className="flex-1 bg-slate-900/80 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl flex flex-col justify-between backdrop-blur-sm">
//                 <div>
//                     <h3 className="text-xl md:text-2xl text-white font-medium mb-10 leading-relaxed">
//                         {currentQ?.question}
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {currentQ?.options?.map((opt, idx) => {
//                             const isSelected = answers[currentQIndex] === opt;
//                             return (
//                                 <button 
//                                     key={idx} 
//                                     onClick={() => handleSelect(opt)} 
//                                     className={`p-5 rounded-xl border-2 text-left transition-all flex items-center group
//                                         ${isSelected 
//                                             ? `bg-${themeColor}-900/40 border-${themeColor}-500 text-white shadow-[0_0_15px_rgba(var(--${themeColor}-500),0.3)]` 
//                                             : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-900'
//                                         }`}
//                                 >
//                                     <span className={`w-8 h-8 min-w-[2rem] rounded-full border flex items-center justify-center mr-4 font-bold text-sm transition-colors
//                                         ${isSelected 
//                                             ? `bg-${themeColor}-500 border-${themeColor}-500 text-white` 
//                                             : 'border-slate-600 text-slate-500 group-hover:border-slate-400'
//                                         }`}
//                                     >
//                                         {String.fromCharCode(65 + idx)}
//                                     </span>
//                                     <span className="text-lg">{opt}</span>
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* Footer Controls */}
//                 <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
//                     <button 
//                         onClick={() => setCurrentQIndex(p => Math.max(0, p - 1))} 
//                         disabled={currentQIndex === 0} 
//                         className="px-6 py-3 rounded-xl text-slate-400 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                     >
//                         मागील (Previous)
//                     </button>
                    
//                     {currentQIndex === totalQuestions - 1 ? (
//                         <button 
//                             onClick={handleSubmit} 
//                             className={`px-8 py-3 bg-${themeColor}-600 hover:bg-${themeColor}-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105`}
//                         >
//                             पुढील टप्पा <IoMdCheckmarkCircle size={20} />
//                         </button>
//                     ) : (
//                         <button 
//                             onClick={() => setCurrentQIndex(p => Math.min(totalQuestions - 1, p + 1))} 
//                             className="px-8 py-3 bg-white text-black hover:bg-slate-200 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
//                         >
//                             पुढील (Next) <FaArrowRight />
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ==========================================
// // 3. SYSTEM CHECK STAGE
// // ==========================================
// const DeviceCheckStage = ({ onComplete }) => {
//     const [speakerStatus, setSpeakerStatus] = useState('idle'); 
//     const [micStatus, setMicStatus] = useState('idle');

//     useEffect(() => { 
//         if (typeof window !== 'undefined') window.speechSynthesis.getVoices(); 
//     }, []);

//     const testSpeaker = () => {
//         setSpeakerStatus('testing');
//         speakText("नमस्कार, ही सिस्टम चेक टेस्ट आहे. आवाज स्पष्ट येत आहे का?", () => setSpeakerStatus('success'));
//     };

//     const testMic = () => {
//         setMicStatus('testing');
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) { 
//             alert("Mic Not Supported in this browser."); 
//             setMicStatus('error'); 
//             return; 
//         }
        
//         const recognition = new SpeechRecognition();
//         recognition.lang = 'mr-IN';
//         recognition.onresult = () => { setMicStatus('success'); recognition.stop(); };
//         recognition.onerror = () => { setMicStatus('idle'); alert("Mic Error. Check permissions."); };
//         recognition.start();
//         setTimeout(() => { if(micStatus !== 'success') recognition.stop(); }, 4000);
//     };

//     const isReady = speakerStatus === 'success' && micStatus === 'success';

//     return (
//         <div className="max-w-xl mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-700 p-10 rounded-[2.5rem] shadow-2xl text-center">
//             <h2 className="text-3xl font-bold text-white mb-2">सिस्टम चेक</h2>
//             <p className="text-slate-400 mb-8">मुलाखत सुरू करण्यापूर्वी डिव्हाइस तपासा.</p>
            
//             <div className="space-y-4 mb-10">
//                 <div className={`p-5 rounded-2xl border flex justify-between items-center transition-colors ${speakerStatus === 'success' ? 'border-green-500/50 bg-green-500/10' : 'border-slate-700 bg-slate-800'}`}>
//                     <div className="flex items-center gap-4">
//                         <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-white"><FaVolumeUp size={20}/></div>
//                         <div className="text-left"><p className="font-bold text-white">स्पीकर</p><p className="text-xs text-slate-400">आवाज तपासा</p></div>
//                     </div>
//                     <button onClick={testSpeaker} className={`px-5 py-2 rounded-lg font-bold text-sm ${speakerStatus === 'success' ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white'}`}>{speakerStatus === 'success' ? 'OK ✔' : 'Test'}</button>
//                 </div>

//                 <div className={`p-5 rounded-2xl border flex justify-between items-center transition-colors ${micStatus === 'success' ? 'border-green-500/50 bg-green-500/10' : 'border-slate-700 bg-slate-800'}`}>
//                     <div className="flex items-center gap-4">
//                         <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-white"><FaMicrophone size={20}/></div>
//                         <div className="text-left"><p className="font-bold text-white">माईक</p><p className="text-xs text-slate-400">रेकॉर्डिंग तपासा</p></div>
//                     </div>
//                     <button onClick={testMic} className={`px-5 py-2 rounded-lg font-bold text-sm ${micStatus === 'success' ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white'}`}>{micStatus === 'success' ? 'OK ✔' : 'Test'}</button>
//                 </div>
//             </div>

//             <button onClick={onComplete} disabled={!isReady} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isReady ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>मुलाखत सुरू करा</button>
//         </div>
//     );
// };

// // ==========================================
// // 4. VOICE INTERVIEW STAGE
// // ==========================================
// const VoiceStage = ({ onComplete }) => {
//     const [qIndex, setQIndex] = useState(0);
//     const [status, setStatus] = useState('preparing'); 
//     const [permanentTranscript, setPermanentTranscript] = useState('');
//     const [interimTranscript, setInterimTranscript] = useState('');
//     const [questions, setQuestions] = useState([]);
//     const [results, setResults] = useState({}); 
//     const recognitionRef = useRef(null);

//     useEffect(() => {
//         const shuffled = [...INTERVIEW_POOL].sort(() => 0.5 - Math.random());
//         setQuestions(shuffled.slice(0, 5));
//     }, []);

//     useEffect(() => {
//         if (questions.length > 0) playQuestion(qIndex);
//         return () => stopRecognition();
//     }, [questions, qIndex]);

//     const playQuestion = (index) => {
//         if (index >= questions.length) return;
//         stopRecognition();
//         setPermanentTranscript('');
//         setInterimTranscript('');
//         setStatus('speaking_question');
//         speakText(questions[index], () => { setStatus('listening'); startRecognition(); });
//     };

//     const startRecognition = () => {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return;
//         const recognition = new SpeechRecognition();
//         recognition.lang = 'mr-IN';
//         recognition.continuous = true;
//         recognition.interimResults = true;
//         recognitionRef.current = recognition;
//         recognition.onresult = (event) => {
//             let finalStr = '';
//             for (let i = event.resultIndex; i < event.results.length; ++i) {
//                 if (event.results[i].isFinal) finalStr += event.results[i][0].transcript + ' ';
//             }
//             setInterimTranscript(prev => prev + finalStr);
//         };
//         try { recognition.start(); } catch(e) { console.error(e); }
//     };

//     const stopRecognition = () => {
//         if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
//     };

//     const togglePause = () => {
//         if (status === 'listening') {
//             stopRecognition();
//             setPermanentTranscript(prev => prev + interimTranscript);
//             setInterimTranscript('');
//             setStatus('paused');
//         } else if (status === 'paused') {
//             setStatus('listening');
//             startRecognition();
//         }
//     };

//     const handleNext = () => {
//         stopRecognition();
//         const finalAnswer = (permanentTranscript + interimTranscript).trim() || "No Audio Recorded";
//         const currentAnswerData = { question: questions[qIndex], answer: finalAnswer };
//         const updatedResults = { ...results, [qIndex]: currentAnswerData };
//         setResults(updatedResults);
//         if (qIndex < 4) { setQIndex(prev => prev + 1); } 
//         else { onComplete({ answers: updatedResults }); } // Store locally, don't submit yet
//     };

//     if (questions.length === 0) return <LoadingScreen text="मुलाखत तयार होत आहे..." color="purple" />;
//     const fullDisplayText = (permanentTranscript + " " + interimTranscript).trim();

//     return (
//         <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[600px]">
//             <div className="w-full text-center mb-8">
//                 <span className="text-purple-400 font-bold uppercase text-sm tracking-widest">प्रश्न {qIndex + 1} / 5</span>
//                 <div className="w-full h-1 bg-slate-800 rounded-full mt-4"><div className="h-full bg-purple-500" style={{ width: `${((qIndex+1)/5)*100}%` }}></div></div>
//             </div>
//             <div className="relative w-full bg-slate-900/80 border border-slate-700 p-12 rounded-[2rem] shadow-2xl text-center backdrop-blur-md">
//                 <h2 className="text-2xl md:text-3xl text-white font-bold mb-10">{questions[qIndex]}</h2>
//                 <div className="flex justify-center mb-10 h-32 items-center">
//                     {status === 'speaking_question' && <div className="text-purple-400 animate-pulse"><FaVolumeUp className="text-6xl mx-auto" /><span className="text-sm font-bold">Speaking...</span></div>}
//                     {status === 'listening' && <div className="text-red-500 animate-pulse"><IoMdMicrophone className="text-8xl mx-auto" /><span className="text-xs font-bold">REC ●</span></div>}
//                     {status === 'paused' && <div className="text-yellow-500"><IoMdPause className="text-8xl mx-auto" /><span className="text-sm font-bold">Paused</span></div>}
//                 </div>
//                 <div className="bg-black/40 rounded-2xl p-6 min-h-[140px] mb-8 text-slate-300 italic border border-white/5 text-left text-lg shadow-inner overflow-y-auto max-h-[200px]">
//                     {fullDisplayText || <span className="text-slate-600">{status === 'speaking_question' ? "Wait for question..." : "Listening..."}</span>}
//                 </div>
//                 <div className="flex justify-center gap-4">
//                     {(status === 'listening' || status === 'paused') && (
//                         <button onClick={togglePause} className="w-16 h-16 rounded-full flex items-center justify-center text-2xl bg-white/10 hover:bg-white/20 text-white transition-all">
//                             {status === 'listening' ? <IoMdPause /> : <IoMdPlay />}
//                         </button>
//                     )}
//                     <button onClick={handleNext} disabled={status === 'speaking_question'} className="px-10 py-4 bg-white text-black hover:bg-slate-200 rounded-full font-bold flex items-center gap-3">
//                         {qIndex === 4 ? "Finish Interview" : "Next"} <FaArrowRight />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ==========================================
// // 5. HELPER COMPONENTS
// // ==========================================
// const LoadingScreen = ({ text, color = 'indigo' }) => (
//     <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
//         <div className={`w-16 h-16 border-4 border-${color}-500/30 border-t-${color}-500 rounded-full animate-spin mb-6`}></div>
//         <h3 className="text-xl text-white font-medium tracking-wide animate-pulse">{text}</h3>
//     </div>
// );

// const TransitionScreen = ({ title, subtitle, icon, color, onNext }) => (
//     <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="max-w-md mx-auto text-center bg-slate-900/80 backdrop-blur-xl border border-white/10 p-12 rounded-[2.5rem] shadow-2xl">
//         <div className={`w-24 h-24 bg-${color}-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-${color}-400 text-4xl shadow-[0_0_30px_rgba(var(--${color}-500),0.2)]`}>{icon}</div>
//         <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
//         <p className="text-slate-400 mb-10 text-lg leading-relaxed">{subtitle}</p>
//         <button onClick={onNext} className={`px-10 py-4 bg-${color}-600 hover:bg-${color}-500 text-white rounded-full font-bold shadow-lg flex items-center gap-3 mx-auto transition-transform hover:scale-105`}>पुढे जा <FaArrowRight /></button>
//     </motion.div>
// );

// // ==========================================
// // MAIN CONTROLLER
// // ==========================================
// export default function FullAssessmentFlow() {
//     const router = useRouter();
//     const [stage, setStage] = useState('input'); 
//     const [formUserInfo, setFormUserInfo] = useState(null); 
//     const [isSubmitting, setIsSubmitting] = useState(false);
    
//     // Master State to hold ALL data locally before final submit
//     const [masterData, setMasterData] = useState({ 
//         assessment: null, 
//         interview: null, 
//         situation: null 
//     });
    
//     // Auth
//     const [loggedInUser, setLoggedInUser] = useState(null);
//     const [authToken, setAuthToken] = useState(null);

//     useEffect(() => {
//         const userStr = localStorage.getItem('user');
//         const token = localStorage.getItem('token');
//         if (userStr) setLoggedInUser(JSON.parse(userStr));
//         if (token) setAuthToken(token);
//     }, []);

//     const handleInputComplete = (data) => {
//         setFormUserInfo(data);
//         setStage('assessment');
//     };

//     // Store stage data locally and move to transition or next stage
//     const handleStageData = (key, data, nextStage) => {
//         setMasterData(prev => ({ ...prev, [key]: data }));
//         setStage(nextStage);
//     };

//     // FINAL SUBMISSION ONLY
//     const finalizeAndSubmit = async (finalSituationData) => {
//         setIsSubmitting(true);
//         const userEmail = loggedInUser?.email || "anonymous@student.com";

//         // Construct final payload with all accumulated data
//         const payload = {
//             email: userEmail,
//             userInfo: formUserInfo, 
//             masterData: {
//                 assessment: masterData.assessment,
//                 voiceInterview: masterData.interview,
//                 situation: finalSituationData // This comes from the last step
//             }
//         };

//         try {
//             const res = await fetch('/api/submit-full-assessment', { 
//                 method: 'POST',
//                 headers: { 
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${authToken}`
//                 }, 
//                 body: JSON.stringify(payload)
//             });

//             if (res.ok) {
//                 setStage('success');
//             } else {
//                 console.error("Server Error:", await res.text());
//                 alert("Submission Failed. Please try again.");
//             }
//         } catch (error) {
//             console.error("Network Error", error);
//             alert("Network Error.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (isSubmitting) return <LoadingScreen text="पूर्ण निकाल जतन करत आहोत..." color="green" />;

//     return (
//         <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
//             <Head><title>Full Assessment | Shakkti AI</title></Head>
            
//             <div className="fixed inset-0 z-0 pointer-events-none">
//                 <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"></div>
//                 <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px]"></div>
//             </div>

//             <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
//                 <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
//                     <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">S</span> 
//                     Shakkti AI
//                 </div>
//                 {loggedInUser && <div className="text-sm text-slate-400 bg-white/5 px-4 py-2 rounded-full">Hi, {loggedInUser.fullName}</div>}
//             </nav>

//             <main className="relative z-10 container mx-auto px-4 py-12 min-h-[85vh] flex flex-col justify-center">
//                 <AnimatePresence mode="wait">
//                     {stage === 'input' && <InputStage key="input" onComplete={handleInputComplete} />}
                    
//                     {/* 1. Assessment Stage - Post to create questions, then store local */}
//                     {stage === 'assessment' && (
//                         <motion.div key="assessment" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
//                             <MCQStage 
//                                 title="तांत्रिक परीक्षा" 
//                                 endpoint="/api/assessment" // Generates questions
//                                 userData={formUserInfo} 
//                                 themeColor="indigo" 
//                                 onComplete={(data) => handleStageData('assessment', data, 'interview_intro')} 
//                             />
//                         </motion.div>
//                     )}

//                     {stage === 'interview_intro' && <TransitionScreen key="t1" title="तांत्रिक परीक्षा पूर्ण" subtitle="पुढील: व्हॉइस इंटरव्ह्यू (Voice Interview)" icon={<FaMicrophone />} color="purple" onNext={() => setStage('system_check')} />}

//                     {stage === 'system_check' && <motion.div key="check" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full"><DeviceCheckStage onComplete={() => setStage('interview')} /></motion.div>}

//                     {/* 2. Interview Stage - Store local */}
//                     {stage === 'interview' && (
//                         <motion.div key="interview" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
//                             <VoiceStage onComplete={(data) => handleStageData('interview', data, 'situation_intro')} />
//                         </motion.div>
//                     )}

//                     {stage === 'situation_intro' && <TransitionScreen key="t2" title="इंटरव्ह्यू पूर्ण झाला" subtitle="पुढील: सिच्युएशन अ‍ॅप्टिट्यूड" icon={<FaBrain />} color="emerald" onNext={() => setStage('situation')} />}

//                     {/* 3. Situation Stage - Generates questions, then Final Submit */}
//                     {stage === 'situation' && (
//                         <motion.div key="situation" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
//                             <MCQStage 
//                                 title="सिच्युएशन अ‍ॅप्टिट्यूड" 
//                                 endpoint="/api/situationque" // Generates questions
//                                 userData={formUserInfo} 
//                                 themeColor="emerald" 
//                                 onComplete={(data) => finalizeAndSubmit(data)} // <--- Final Submit here
//                             />
//                         </motion.div>
//                     )}

//                     {stage === 'success' && (
//                         <motion.div key="success" initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="text-center max-w-xl mx-auto bg-slate-900/80 p-12 rounded-[3rem] border border-white/10 shadow-2xl backdrop-blur-md">
//                             <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
//                                 <IoMdCheckmarkCircle className="text-green-400 text-6xl" />
//                             </div>
//                             <h2 className="text-4xl font-bold text-white mb-4">अभिनंदन!</h2>
//                             <p className="text-slate-400 mb-10 text-lg">तुमचा पेपर यशस्वीरित्या सबमिट झाला आहे.</p>
//                             <button onClick={() => router.push('/')} className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700">
//                                 होम पेजवर जा
//                             </button>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </main>
//         </div>
//     );
// }

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    IoMdMicrophone, 
    IoMdCheckmarkCircle,
    IoIosArrowDown,
    IoMdPause,
    IoMdPlay
} from 'react-icons/io';
import { 
    FaVolumeUp, 
    FaMicrophone, 
    FaArrowRight, 
    FaBrain, 
    FaUserGraduate,
} from 'react-icons/fa';

// ==========================================
// 0. API & UTILITIES
// ==========================================

const INTERVIEW_POOL = [
    "तुमच्याबद्दल थोडक्यात सांगा.", 
    "तुम्हाला आमच्या कंपनीत काम का करायचे आहे?", 
    "तुमच्या जमेच्या बाजू (Strengths) आणि कमकुवत बाजू (Weaknesses) कोणत्या आहेत?",
    "पुढील ३-५ वर्षांत तुम्ही स्वतःला कुठे पाहता?", 
    "आम्ही तुमची निवड का करावी?", 
    "तुम्ही कामाचा ताण किंवा दबाव कसा हाताळता?", 
    "एखाद्या कठीण प्रसंगाचे वर्णन करा ज्याचा तुम्ही सामना केला आणि तो कसा सोडवला?", 
    "तुम्हाला काम करण्यासाठी कोणती गोष्ट प्रेरित करते?", 
    "टीममधील मतभेद किंवा संघर्ष तुम्ही कसे हाताळता?", 
    "तुम्ही स्वतंत्रपणे आणि टीममध्ये काम करण्यास तयार आहात का?" 
];

// Text-to-Speech Utility
const speakText = (text, onEndCallback) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        if(onEndCallback) onEndCallback();
        return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; 
    utterance.lang = 'mr-IN'; 
    
    // Attempt to select a local voice (Hindi/Marathi)
    const voices = window.speechSynthesis.getVoices();
    const specificVoice = voices.find(v => v.lang.includes('mr') || v.lang.includes('hi'));
    if (specificVoice) utterance.voice = specificVoice;

    utterance.onend = () => { if (onEndCallback) onEndCallback(); };
    utterance.onerror = (e) => { console.error(e); if (onEndCallback) onEndCallback(); };
    window.speechSynthesis.speak(utterance);
};

// --- API FUNCTIONS ---

export const fetchAssessmentQuestions = async (userDetails) => {
  try {
    const res = await fetch("/api/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "generate_questions",
        standard: userDetails.standard,
        subject: userDetails.subject
      })
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    const resultList = data.result || data.questions; // Handle potential schema variations

    if (!resultList || !Array.isArray(resultList)) {
      throw new Error("Invalid assessment response format");
    }

    return resultList.map((q, index) => ({
      id: q.id ?? index + 1,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer
    }));

  } catch (err) {
    console.error("Assessment API error:", err);
    throw err;
  }
};

export const fetchSituationQuestions = async () => {
  try {
    const res = await fetch("/api/situationque"); // ✅ GET by default

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();

    if (!data.result || !Array.isArray(data.result)) {
      throw new Error("Invalid situation response");
    }

    return data.result.map((q, index) => ({
      id: q.id ?? index + 1,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer
    }));

  } catch (err) {
    console.error("Situation API error:", err);
    throw err;
  }
};


// ==========================================
// 1. INPUT STAGE 
// ==========================================
const InputStage = ({ onComplete }) => {
    const [formData, setFormData] = useState({ standard: '', subject: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.standard && formData.subject) {
            onComplete(formData);
        } else {
            alert("कृपया सर्व माहिती भरा. (Please fill all details)");
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-xl mx-auto bg-slate-800/90 backdrop-blur-xl border border-slate-700 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl shadow-lg shadow-purple-500/30">
                    <FaUserGraduate />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">विद्यार्थी तपशील</h2>
                <p className="text-slate-400">तुमची माहिती भरून परीक्षा सुरू करा</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
             <div className="relative">
                    <label className="block text-indigo-300 text-xs font-bold mb-2 uppercase tracking-wider">
                        विषय निवडा (Subject)
                    </label>
                    <select 
                        value={formData.subject} 
                        onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                        className={`w-full bg-slate-950 border border-slate-600 rounded-xl px-5 py-4 appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer ${formData.subject === "" ? "text-slate-500" : "text-white"}`}
                        required
                    >
                        <option value="" disabled>Select Subject</option>
                        <option value="PCB">PCB (Printed Circuit Board)</option>
                        <option value="AAO">AAO (Automotive Assembly Operator)</option>
                    </select>
                    <div className="pointer-events-none absolute bottom-5 right-5 text-indigo-400">
                        <IoIosArrowDown size={20} />
                    </div>
                </div>
                <div>
                    <label className="block text-indigo-300 text-xs font-bold mb-2 uppercase tracking-wider">
                        तुमची इयत्ता (Standard)
                    </label>
                    <input 
                        type="text" 
                        placeholder="उदा. १२वी सायन्स" 
                        value={formData.standard} 
                        onChange={(e) => setFormData({...formData, standard: e.target.value})} 
                        className="w-full bg-slate-950 border border-slate-600 text-white rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500 transition-all" 
                        required 
                    />
                </div>

               

                <button 
                    type="submit" 
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl mt-4 shadow-lg shadow-indigo-600/30 transform transition hover:-translate-y-1"
                >
                    परीक्षा सुरू करा &rarr;
                </button>
            </form>
        </motion.div>
    );
};

// ==========================================
// 2. MCQ STAGE 
// ==========================================
const MCQStage = ({ title, fetchData, themeColor, onComplete }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({}); 

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            setLoading(true);
            try {
                // Execute the passed function (Assessment or Situation)
                const data = await fetchData();
                if (isMounted) {
                    setQuestions(data);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Failed to load questions", err);
                if (isMounted) {
                    // Fallback for demo stability
                    setQuestions([
                        {
                            id: 1,
                            question: "Unable to load API. This is a demo fallback question.",
                            options: ["Option A", "Option B", "Option C", "Option D"],
                            correctAnswer: "Option A"
                        }
                    ]);
                    setLoading(false);
                }
            }
        };
        load();
        return () => { isMounted = false; };
    }, [fetchData]);

    const handleSelect = (option) => {
        setAnswers(prev => ({ ...prev, [currentQIndex]: option }));
    };

    const handleSubmit = () => {
        if (Object.keys(answers).length < questions.length) {
            if(!confirm("काही प्रश्न बाकी आहेत. तरीही सबमिट करायचे?")) return;
        }
        // Send data back up
        onComplete({ questions, answers });
    };

    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).length;
    const progressPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
    
    if (loading) return <LoadingScreen text={`${title} तयार होत आहे...`} color={themeColor} />;
    
    const currentQ = questions[currentQIndex];

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col min-h-[600px]">
            {/* Header & Progress */}
            <div className="flex justify-between items-end mb-6 px-2">
                <div>
                    <h2 className={`text-2xl font-bold text-${themeColor}-400`}>{title}</h2>
                    <p className="text-slate-400 text-sm mt-1">
                        प्रश्न {currentQIndex + 1} / {totalQuestions}
                    </p>
                </div>
                <div className="flex flex-col items-end w-1/3">
                    <span className="text-xs text-slate-500 mb-2 font-mono">
                        {Math.round(progressPercentage)}% पूर्ण
                    </span>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div 
                            className={`h-full bg-${themeColor}-500 transition-all duration-700 ease-out`} 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Question Card */}
            <div className="flex-1 bg-slate-900/80 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl flex flex-col justify-between backdrop-blur-sm">
                <div>
                    <h3 className="text-xl md:text-2xl text-white font-medium mb-10 leading-relaxed">
                        {currentQ?.question}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQ?.options?.map((opt, idx) => {
                            const isSelected = answers[currentQIndex] === opt;
                            return (
                                <button 
                                    key={idx} 
                                    onClick={() => handleSelect(opt)} 
                                    className={`p-5 rounded-xl border-2 text-left transition-all flex items-center group
                                        ${isSelected 
                                            ? `bg-${themeColor}-900/40 border-${themeColor}-500 text-white shadow-[0_0_15px_rgba(var(--${themeColor}-500),0.3)]` 
                                            : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-900'
                                        }`}
                                >
                                    <span className={`w-8 h-8 min-w-[2rem] rounded-full border flex items-center justify-center mr-4 font-bold text-sm transition-colors
                                        ${isSelected 
                                            ? `bg-${themeColor}-500 border-${themeColor}-500 text-white` 
                                            : 'border-slate-600 text-slate-500 group-hover:border-slate-400'
                                        }`}
                                    >
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="text-lg">{opt}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
                    <button 
                        onClick={() => setCurrentQIndex(p => Math.max(0, p - 1))} 
                        disabled={currentQIndex === 0} 
                        className="px-6 py-3 rounded-xl text-slate-400 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        मागील (Previous)
                    </button>
                    
                    {currentQIndex === totalQuestions - 1 ? (
                        <button 
                            onClick={handleSubmit} 
                            className={`px-8 py-3 bg-${themeColor}-600 hover:bg-${themeColor}-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105`}
                        >
                            पुढील टप्पा <IoMdCheckmarkCircle size={20} />
                        </button>
                    ) : (
                        <button 
                            onClick={() => setCurrentQIndex(p => Math.min(totalQuestions - 1, p + 1))} 
                            className="px-8 py-3 bg-white text-black hover:bg-slate-200 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                        >
                            पुढील (Next) <FaArrowRight />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 3. SYSTEM CHECK STAGE
// ==========================================
const DeviceCheckStage = ({ onComplete }) => {
    const [speakerStatus, setSpeakerStatus] = useState('idle'); 
    const [micStatus, setMicStatus] = useState('idle');

    useEffect(() => { 
        if (typeof window !== 'undefined') window.speechSynthesis.getVoices(); 
    }, []);

    const testSpeaker = () => {
        setSpeakerStatus('testing');
        speakText("नमस्कार, ही सिस्टम चेक टेस्ट आहे. आवाज स्पष्ट येत आहे का?", () => setSpeakerStatus('success'));
    };

    const testMic = () => {
        setMicStatus('testing');
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) { 
            alert("Mic Not Supported in this browser (Use Chrome)."); 
            setMicStatus('error'); 
            return; 
        }
        
        const recognition = new SpeechRecognition();
        recognition.lang = 'mr-IN';
        recognition.onresult = () => { setMicStatus('success'); recognition.stop(); };
        recognition.onerror = () => { setMicStatus('idle'); alert("Mic Error. Check permissions."); };
        recognition.start();
        
        // Auto stop after 4 seconds if no sound
        setTimeout(() => { if(micStatus !== 'success') recognition.stop(); }, 4000);
    };

    const isReady = speakerStatus === 'success' && micStatus === 'success';

    return (
        <div className="max-w-xl mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-700 p-10 rounded-[2.5rem] shadow-2xl text-center">
            <h2 className="text-3xl font-bold text-white mb-2">सिस्टम चेक</h2>
            <p className="text-slate-400 mb-8">मुलाखत सुरू करण्यापूर्वी डिव्हाइस तपासा.</p>
            
            <div className="space-y-4 mb-10">
                {/* Speaker */}
                <div className={`p-5 rounded-2xl border flex justify-between items-center transition-colors ${speakerStatus === 'success' ? 'border-green-500/50 bg-green-500/10' : 'border-slate-700 bg-slate-800'}`}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-white"><FaVolumeUp size={20}/></div>
                        <div className="text-left"><p className="font-bold text-white">स्पीकर</p><p className="text-xs text-slate-400">आवाज तपासा</p></div>
                    </div>
                    <button onClick={testSpeaker} className={`px-5 py-2 rounded-lg font-bold text-sm ${speakerStatus === 'success' ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white'}`}>{speakerStatus === 'success' ? 'OK ✔' : 'Test'}</button>
                </div>

                {/* Mic */}
                <div className={`p-5 rounded-2xl border flex justify-between items-center transition-colors ${micStatus === 'success' ? 'border-green-500/50 bg-green-500/10' : 'border-slate-700 bg-slate-800'}`}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-white"><FaMicrophone size={20}/></div>
                        <div className="text-left"><p className="font-bold text-white">माईक</p><p className="text-xs text-slate-400">रेकॉर्डिंग तपासा</p></div>
                    </div>
                    <button onClick={testMic} className={`px-5 py-2 rounded-lg font-bold text-sm ${micStatus === 'success' ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white'}`}>{micStatus === 'success' ? 'OK ✔' : 'Test'}</button>
                </div>
            </div>

            <button onClick={onComplete} disabled={!isReady} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isReady ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>मुलाखत सुरू करा</button>
        </div>
    );
};

// ==========================================
// 4. VOICE INTERVIEW STAGE
// ==========================================
const VoiceStage = ({ onComplete }) => {
    const [qIndex, setQIndex] = useState(0);
    const [status, setStatus] = useState('preparing'); 
    const [permanentTranscript, setPermanentTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [questions, setQuestions] = useState([]);
    const [results, setResults] = useState({}); 
    const recognitionRef = useRef(null);

    useEffect(() => {
        const shuffled = [...INTERVIEW_POOL].sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 5));
    }, []);

    useEffect(() => {
        if (questions.length > 0) playQuestion(qIndex);
        return () => stopRecognition();
    }, [questions, qIndex]);

    const playQuestion = (index) => {
        if (index >= questions.length) return;
        stopRecognition();
        setPermanentTranscript('');
        setInterimTranscript('');
        setStatus('speaking_question');
        // Wait for speech to finish before starting mic
        speakText(questions[index], () => { 
            setStatus('listening'); 
            startRecognition(); 
        });
    };

    const startRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;
        
        try {
            const recognition = new SpeechRecognition();
            recognition.lang = 'mr-IN';
            recognition.continuous = true;
            recognition.interimResults = true;
            recognitionRef.current = recognition;
            
            recognition.onresult = (event) => {
                let finalStr = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) finalStr += event.results[i][0].transcript + ' ';
                }
                setPermanentTranscript(prev => prev + finalStr);
                // Reset interim if final found, else show it
                if(finalStr) setInterimTranscript('');
                else setInterimTranscript(event.results[event.results.length -1][0].transcript);
            };

            recognition.start();
        } catch(e) { 
            console.error(e); 
        }
    };

    const stopRecognition = () => {
        if (recognitionRef.current) { 
            recognitionRef.current.stop(); 
            recognitionRef.current = null; 
        }
    };

    const togglePause = () => {
        if (status === 'listening') {
            stopRecognition();
            setStatus('paused');
        } else if (status === 'paused') {
            setStatus('listening');
            startRecognition();
        }
    };

    const handleNext = () => {
        stopRecognition();
        const finalAnswer = (permanentTranscript + interimTranscript).trim() || "No Audio Recorded";
        const currentAnswerData = { question: questions[qIndex], answer: finalAnswer };
        const updatedResults = { ...results, [qIndex]: currentAnswerData };
        setResults(updatedResults);
        
        if (qIndex < 4) { 
            setQIndex(prev => prev + 1); 
        } else { 
            onComplete({ answers: updatedResults }); 
        }
    };

    if (questions.length === 0) return <LoadingScreen text="मुलाखत तयार होत आहे..." color="purple" />;

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[600px]">
            <div className="w-full text-center mb-8">
                <span className="text-purple-400 font-bold uppercase text-sm tracking-widest">प्रश्न {qIndex + 1} / 5</span>
                <div className="w-full h-1 bg-slate-800 rounded-full mt-4"><div className="h-full bg-purple-500" style={{ width: `${((qIndex+1)/5)*100}%` }}></div></div>
            </div>
            <div className="relative w-full bg-slate-900/80 border border-slate-700 p-12 rounded-[2rem] shadow-2xl text-center backdrop-blur-md">
                <h2 className="text-2xl md:text-3xl text-white font-bold mb-10">{questions[qIndex]}</h2>
                <div className="flex justify-center mb-10 h-32 items-center">
                    {status === 'speaking_question' && <div className="text-purple-400 animate-pulse"><FaVolumeUp className="text-6xl mx-auto" /><span className="text-sm font-bold">Speaking...</span></div>}
                    {status === 'listening' && <div className="text-red-500 animate-pulse"><IoMdMicrophone className="text-8xl mx-auto" /><span className="text-xs font-bold">REC ●</span></div>}
                    {status === 'paused' && <div className="text-yellow-500"><IoMdPause className="text-8xl mx-auto" /><span className="text-sm font-bold">Paused</span></div>}
                </div>
                <div className="bg-black/40 rounded-2xl p-6 min-h-[140px] mb-8 text-slate-300 italic border border-white/5 text-left text-lg shadow-inner overflow-y-auto max-h-[200px]">
                    {(permanentTranscript + " " + interimTranscript).trim() || <span className="text-slate-600">{status === 'speaking_question' ? "Wait for question..." : "Listening..."}</span>}
                </div>
                <div className="flex justify-center gap-4">
                    {(status === 'listening' || status === 'paused') && (
                        <button onClick={togglePause} className="w-16 h-16 rounded-full flex items-center justify-center text-2xl bg-white/10 hover:bg-white/20 text-white transition-all">
                            {status === 'listening' ? <IoMdPause /> : <IoMdPlay />}
                        </button>
                    )}
                    <button onClick={handleNext} disabled={status === 'speaking_question'} className="px-10 py-4 bg-white text-black hover:bg-slate-200 rounded-full font-bold flex items-center gap-3">
                        {qIndex === 4 ? "Finish Interview" : "Next"} <FaArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 5. HELPER COMPONENTS
// ==========================================
const LoadingScreen = ({ text, color = 'indigo' }) => (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
        <div className={`w-16 h-16 border-4 border-${color}-500/30 border-t-${color}-500 rounded-full animate-spin mb-6`}></div>
        <h3 className="text-xl text-white font-medium tracking-wide animate-pulse">{text}</h3>
    </div>
);

const TransitionScreen = ({ title, subtitle, icon, color, onNext }) => (
    <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="max-w-md mx-auto text-center bg-slate-900/80 backdrop-blur-xl border border-white/10 p-12 rounded-[2.5rem] shadow-2xl">
        <div className={`w-24 h-24 bg-${color}-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-${color}-400 text-4xl shadow-[0_0_30px_rgba(var(--${color}-500),0.2)]`}>{icon}</div>
        <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
        <p className="text-slate-400 mb-10 text-lg leading-relaxed">{subtitle}</p>
        <button onClick={onNext} className={`px-10 py-4 bg-${color}-600 hover:bg-${color}-500 text-white rounded-full font-bold shadow-lg flex items-center gap-3 mx-auto transition-transform hover:scale-105`}>पुढे जा <FaArrowRight /></button>
    </motion.div>
);

// ==========================================
// MAIN CONTROLLER
// ==========================================
export default function FullAssessmentFlow() {
    const router = useRouter();
    const [stage, setStage] = useState('input'); 
    const [formUserInfo, setFormUserInfo] = useState(null); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Master State to hold ALL data locally before final submit
    const [masterData, setMasterData] = useState({ 
        assessment: null, 
        interview: null, 
        situation: null 
    });
    
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) setLoggedInUser(JSON.parse(userStr));
    }, []);

    const handleInputComplete = (data) => {
        setFormUserInfo(data);
        setStage('assessment');
    };

    // Store stage data locally and move to transition or next stage
    const handleStageData = (key, data, nextStage) => {
        setMasterData(prev => ({ ...prev, [key]: data }));
        setStage(nextStage);
    };

    // FINAL SUBMISSION
    const finalizeAndSubmit = async (finalSituationData) => {
        setIsSubmitting(true);
        const userEmail = loggedInUser?.email || "anonymous@student.com";

        // Construct final payload
        const payload = {
            email: userEmail,
            userInfo: formUserInfo, 
            masterData: {
                assessment: masterData.assessment,
                voiceInterview: masterData.interview,
                situation: finalSituationData // Comes from the last step
            }
        };

        try {
            const res = await fetch('/api/submit-full-assessment', { 
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // If needed
                }, 
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setStage('success');
            } else {
                console.error("Server Error:", await res.text());
                alert("Submission Failed. Please try again.");
            }
        } catch (error) {
            console.error("Network Error", error);
            alert("Network Error. Check console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitting) return <LoadingScreen text="पूर्ण निकाल जतन करत आहोत..." color="green" />;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
            <Head><title>Full Assessment | Shakkti AI</title></Head>
            
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px]"></div>
            </div>

            <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
                <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
                    <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">S</span> 
                    Shakkti AI
                </div>
                {loggedInUser && <div className="text-sm text-slate-400 bg-white/5 px-4 py-2 rounded-full">Hi, {loggedInUser.fullName}</div>}
            </nav>

            <main className="relative z-10 container mx-auto px-4 py-12 min-h-[85vh] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {stage === 'input' && <InputStage key="input" onComplete={handleInputComplete} />}
                    
                    {/* 1. Assessment Stage (Uses fetchAssessmentQuestions) */}
                    {stage === 'assessment' && (
                        <motion.div key="assessment" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
                            <MCQStage 
                                title="तांत्रिक परीक्षा" 
                                fetchData={() => fetchAssessmentQuestions(formUserInfo)}
                                themeColor="indigo" 
                                onComplete={(data) => handleStageData('assessment', data, 'interview_intro')} 
                            />
                        </motion.div>
                    )}

                    {stage === 'interview_intro' && <TransitionScreen key="t1" title="तांत्रिक परीक्षा पूर्ण" subtitle="पुढील: व्हॉइस इंटरव्ह्यू (Voice Interview)" icon={<FaMicrophone />} color="purple" onNext={() => setStage('system_check')} />}

                    {stage === 'system_check' && <motion.div key="check" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full"><DeviceCheckStage onComplete={() => setStage('interview')} /></motion.div>}

                    {/* 2. Interview Stage */}
                    {stage === 'interview' && (
                        <motion.div key="interview" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
                            <VoiceStage onComplete={(data) => handleStageData('interview', data, 'situation_intro')} />
                        </motion.div>
                    )}

                    {stage === 'situation_intro' && <TransitionScreen key="t2" title="इंटरव्ह्यू पूर्ण झाला" subtitle="पुढील: सिच्युएशन अ‍ॅप्टिट्यूड" icon={<FaBrain />} color="emerald" onNext={() => setStage('situation')} />}

                    {/* 3. Situation Stage (Uses fetchSituationQuestions) */}
                    {stage === 'situation' && (
                        <motion.div key="situation" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
                            <MCQStage 
                                title="सिच्युएशन अ‍ॅप्टिट्यूड" 
                                fetchData={() => fetchSituationQuestions()}
                                themeColor="emerald" 
                                onComplete={(data) => finalizeAndSubmit(data)} 
                            />
                        </motion.div>
                    )}

                    {stage === 'success' && (
                        <motion.div key="success" initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="text-center max-w-xl mx-auto bg-slate-900/80 p-12 rounded-[3rem] border border-white/10 shadow-2xl backdrop-blur-md">
                            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                                <IoMdCheckmarkCircle className="text-green-400 text-6xl" />
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-4">अभिनंदन!</h2>
                            <p className="text-slate-400 mb-10 text-lg">तुमचा पेपर यशस्वीरित्या सबमिट झाला आहे.</p>
                            <button onClick={() => router.push('/')} className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700">
                                होम पेजवर जा
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
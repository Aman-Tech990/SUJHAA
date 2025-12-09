import React, { useState, useEffect } from "react";
import {
  Check,
  Clock,
  X,
  Send,
  MessageSquare,
  Sparkles,
  Calendar,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Mic,      // Added Mic Icon
  MicOff    // Added MicOff Icon
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const MySchemes = () => {
  const [applications, setApplications] = useState([]);

  // Grievance States
  const [openGrievance, setOpenGrievance] = useState(false);
  const [activeApplication, setActiveApplication] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Speech to Text States
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Predefined Templates for Grievances
  const GRIEVANCE_TEMPLATES = [
    "My application status hasn't changed in weeks.",
    "I have completed verification but status is pending.",
    "Funds have not been credited to my account yet.",
    "I need to correct my personal details.",
    "When will the training start?",
  ];

  /* -------------------- TIMELINE BUILDER -------------------- */
  const generateTimeline = (app) => [
    {
      title: "Application Submitted",
      date: app.applied_date ? new Date(app.applied_date).toDateString() : "--",
      desc: "Application submitted by beneficiary",
      completed: true,
      icon: "📝",
      color: "emerald"
    },
    {
      title: "Field Verification",
      date: app.field_verified_at ? new Date(app.field_verified_at).toDateString() : "Pending",
      desc: app.field_verified ? "Verified by Field Officer" : "Awaiting field verification",
      completed: app.field_verified || false,
      current: !app.field_verified,
      icon: "🔍",
      color: "blue"
    },
    {
      title: "District Officer Review",
      date: app.district_approved_at ? new Date(app.district_approved_at).toDateString() : "Pending",
      desc: app.district_approved_by ? "Approved at District Level" : "Waiting for district officer",
      completed: !!app.district_approved_by,
      icon: "👨‍💼",
      color: "purple"
    },
    {
      title: "State Officer Approval",
      date: app.state_approved_at ? new Date(app.state_approved_at).toDateString() : "Pending",
      desc: app.state_approved_by ? "Approved at State Level" : "Waiting for state officer",
      completed: !!app.state_approved_by,
      icon: "🏛️",
      color: "indigo"
    },
    {
      title: "Central Ministry Approval",
      date: app.central_approved_at ? new Date(app.central_approved_at).toDateString() : "Pending",
      desc: app.central_approved_by ? "Approved by Central Authority" : "Awaiting central approval",
      completed: !!app.central_approved_by,
      icon: "🏢",
      color: "violet"
    },
    {
      title: "Training Assignment",
      date: app.trainingStartDate ? new Date(app.trainingStartDate).toDateString() : "Pending",
      desc: app.trainingSkill ? `Training: ${app.trainingSkill}` : "Training not assigned",
      completed: app.trainingStatus === "ONGOING" || app.trainingStatus === "COMPLETED",
      icon: "🎓",
      color: "cyan"
    },
    {
      title: "Fund Release (DBT)",
      date: app.funds?.find((f) => f.status === "RELEASED")?.releasedAt || "Pending",
      desc: app.funds?.some((f) => f.status === "RELEASED") ? "Funds released via DBT" : "Funds not released yet",
      completed: app.funds?.some((f) => f.status === "RELEASED") || false,
      icon: "💰",
      color: "green"
    },
    {
      title: "Enterprise Kit Distribution",
      date: app.enterpriseKit?.distributedAt ? new Date(app.enterpriseKit.distributedAt).toDateString() : "Pending",
      desc: app.enterpriseKit?.distributed ? "Kit distributed to beneficiary" : "Kit not distributed",
      completed: app.enterpriseKit?.distributed || false,
      icon: "📦",
      color: "orange"
    },
  ];

  /* -------------------- FETCH APPLICATIONS -------------------- */
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get(
          "https://sujhaa-backend.onrender.com/api/application/my-applications",
          { withCredentials: true }
        );
        if (res.data.success) {
          setApplications(res.data.applications);
        }
      } catch {
        toast.error("Failed to fetch applications");
      }
    };
    fetchApps();
  }, []);

  /* -------------------- SPEECH RECOGNITION SETUP -------------------- */
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.lang = "en-US";
      recognitionInstance.interimResults = false;

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage((prev) => (prev ? prev + " " + transcript : transcript));
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast.error("Voice input failed/stopped.");
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      toast.error("Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      toast.info("Listening... Speak now");
    }
  };

  /* -------------------- GRIEVANCE HANDLERS -------------------- */
  const openGrievanceModal = (app) => {
    setActiveApplication(app);
    setMessages(app.grievanceThread || []);
    setOpenGrievance(true);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg = {
      sender: "BENEFICIARY",
      text: message,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
    toast.success("Complaint has been raised successfully");
  };

  const handleTemplateClick = (text) => {
    setMessage(text);
  };

  /* -------------------- UI RENDER -------------------- */
  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-800">

      {/* HEADER SECTION */}
      <div className="max-w-5xl mx-auto mb-12 text-center">
        <div className="inline-block mb-4">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg shadow-indigo-200">
            Beneficiary Dashboard
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 py-2">
          My Applications
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Track the real-time status and progress of your beneficiary schemes
        </p>
      </div>

      {applications.length === 0 ? (
        // EMPTY STATE
        <div className="max-w-xl mx-auto mt-10 bg-white rounded-3xl shadow-xl shadow-slate-200 p-12 text-center border border-slate-100">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-full">
              <Sparkles className="w-12 h-12 text-indigo-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">No Active Applications</h2>
          <p className="text-slate-500 mb-8">Start your journey today by applying for a new scheme.</p>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:scale-105 active:scale-95">
            Apply Now
          </button>
        </div>
      ) : (
        // CONTENT
        <div className="max-w-6xl mx-auto space-y-20">
          {applications.map((scheme, index) => (
            <div key={index} className="relative">

              {/* --- APP HEADER --- */}
              <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 p-6 md:p-8 mb-20 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full -mr-20 -mt-20 opacity-60 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-50 to-cyan-50 rounded-full -ml-16 -mb-16 opacity-60 blur-2xl"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider border border-slate-200 shadow-sm">
                        {scheme.application_id}
                      </span>
                      <span className="text-slate-400 text-xs flex items-center gap-1.5 font-medium bg-slate-50 px-3 py-1.5 rounded-full">
                        <Calendar size={14} /> {new Date(scheme.applied_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{scheme.scheme_id?.name}</h2>
                    <p className="text-slate-500 text-sm">Track your application progress through each verification stage</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-5 py-2 rounded-full text-sm font-bold border-2 shadow-md backdrop-blur-sm ${scheme.status === "APPROVED"
                      ? "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200"
                      : "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200"
                      }`}>
                      {scheme.status}
                    </span>
                    <button
                      onClick={() => openGrievanceModal(scheme)}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-2 px-5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95 hover:shadow-xl">
                      <MessageSquare size={16} /> Help
                    </button>
                  </div>
                </div>
              </div>

              {/* --- VERTICAL TIMELINE --- */}
              <div className="relative">
                {/* Central Spine Line with Gradient */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 via-blue-300 to-slate-200 -ml-0.25 md:-ml-0.25 transform md:translate-x-0"></div>

                <div className="space-y-8 pb-12">
                  {generateTimeline(scheme).map((step, i) => {
                    const isEven = i % 2 === 0;

                    return (
                      <div key={i} className={`relative flex items-center md:justify-between ${isEven ? 'md:flex-row-reverse' : ''} group`}>

                        {/* EMPTY SPACE for balance */}
                        <div className="hidden md:block w-5/12"></div>

                        {/* CENTER NODE */}
                        <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                          <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-4 flex items-center justify-center transition-all duration-500 
                                    ${step.completed
                              ? "bg-gradient-to-br from-emerald-400 to-green-500 border-white shadow-2xl shadow-emerald-300 scale-110"
                              : step.current
                                ? "bg-white border-amber-400 shadow-2xl shadow-amber-200 animate-pulse scale-110"
                                : "bg-white border-slate-200 shadow-lg"
                            }`}>
                            {step.completed && <Check size={24} className="text-white drop-shadow-md" strokeWidth={3.5} />}
                            {step.current && <Clock size={24} className="text-amber-500" strokeWidth={2.5} />}
                            {!step.completed && !step.current && <span className="w-3 h-3 rounded-full bg-slate-300"></span>}
                          </div>

                          {/* Pulse effect for current step */}
                          {step.current && (
                            <>
                              <div className="absolute w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-amber-300 animate-ping opacity-40"></div>
                              <div className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full border border-amber-200 animate-pulse"></div>
                            </>
                          )}
                        </div>

                        {/* --- THE CARD --- */}
                        <div className="ml-24 md:ml-0 w-full md:w-5/12">
                          <div className={`p-6 md:p-7 rounded-2xl border-2 bg-white transition-all duration-300 relative overflow-hidden hover:scale-[1.02] ${step.completed
                            ? "border-emerald-200 shadow-[0_8px_30px_rgba(16,185,129,0.15)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.25)]"
                            : step.current
                              ? "border-amber-300 shadow-[0_10px_40px_rgba(251,191,36,0.2)] bg-gradient-to-br from-white to-amber-50/30 hover:shadow-[0_15px_50px_rgba(251,191,36,0.3)]"
                              : "border-slate-200 shadow-md opacity-60 hover:opacity-100 hover:shadow-lg"
                            }`}>

                            {/* Background Pattern */}
                            <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                              <div className="text-6xl">{step.icon}</div>
                            </div>

                            {/* Connector Line (Pointing to Center) */}
                            <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 ${isEven ? '-left-6 w-6' : '-right-6 w-6'
                              } h-0.5 ${step.completed ? 'bg-gradient-to-r from-emerald-400 to-emerald-300'
                                : step.current ? 'bg-gradient-to-r from-amber-400 to-amber-300'
                                  : 'bg-slate-200'
                              }`}></div>

                            {/* Top Section: Status Badge + Date */}
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-2">
                                <span className="text-3xl">{step.icon}</span>
                                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wide uppercase shadow-sm ${step.completed ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200'
                                  : step.current ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200'
                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                  }`}>
                                  {step.completed ? "✓ Completed" : step.current ? "⏳ In Progress" : "○ Pending"}
                                </span>
                              </div>
                              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${step.completed ? 'bg-emerald-50 text-emerald-600'
                                : step.current ? 'bg-amber-50 text-amber-600'
                                  : 'bg-slate-100 text-slate-400'
                                }`}>
                                {step.date}
                              </span>
                            </div>

                            {/* Title */}
                            <h4 className={`font-bold text-xl mb-2.5 tracking-tight ${step.completed ? 'text-slate-800'
                              : step.current ? 'text-slate-800'
                                : 'text-slate-500'
                              }`}>
                              {step.title}
                            </h4>

                            {/* Description */}
                            <p className={`text-sm leading-relaxed font-medium ${step.completed ? 'text-slate-600'
                              : step.current ? 'text-slate-700'
                                : 'text-slate-400'
                              }`}>
                              {step.desc}
                            </p>

                            {/* Progress Indicator for Current Step */}
                            {step.current && (
                              <div className="mt-4 pt-4 border-t border-amber-100">
                                <div className="flex items-center justify-between text-xs text-amber-600 font-semibold mb-2">
                                  <span>Processing</span>
                                  <span className="flex items-center gap-1">
                                    <div className="flex gap-0.5">
                                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                  </span>
                                </div>
                                <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                                </div>
                              </div>
                            )}

                            {/* Completion Badge for Completed Steps */}
                            {step.completed && (
                              <div className="mt-4 pt-4 border-t border-emerald-100">
                                <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <Check size={12} strokeWidth={3} />
                                  </div>
                                  <span>Verification Complete</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* --- END CARD --- */}

                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- GRIEVANCE MODAL --- */}
      {openGrievance && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] scale-100 animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-5 flex justify-between items-center shadow-lg z-10">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2"><MessageSquare size={20} /> Support Chat</h3>
                <p className="text-xs text-indigo-100 opacity-90 mt-1 font-mono">ID: {activeApplication?.application_id}</p>
              </div>
              <button onClick={() => setOpenGrievance(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-sm hover:scale-110 active:scale-95"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-10 opacity-60">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"><Sparkles className="text-indigo-500" size={36} /></div>
                  <p className="text-sm text-slate-600 font-semibold mb-1">How can we help you today?</p>
                  <p className="text-xs text-slate-400">Select a quick option or type your message</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === "BENEFICIARY" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`} style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className={`max-w-[80%] px-5 py-3.5 rounded-2xl shadow-md text-sm transition-all hover:scale-[1.02] ${msg.sender === "BENEFICIARY"
                    ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-md shadow-indigo-200"
                    : "bg-white text-slate-700 border-2 border-slate-100 rounded-bl-md shadow-slate-200"
                    }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] mt-2 text-right font-medium ${msg.sender === "BENEFICIARY" ? "text-indigo-200" : "text-slate-400"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border-t-2 border-slate-100 p-3 pb-0">
              <div className="flex items-center gap-2 mb-2 px-1"><Sparkles size={16} className="text-indigo-500" /><span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Select</span></div>
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                {GRIEVANCE_TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    onClick={() => handleTemplateClick(tpl)}
                    className="whitespace-nowrap flex-shrink-0 px-4 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 border-2 border-slate-200 hover:border-indigo-300 rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md">
                    {tpl}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 pt-2">
              <div className="flex gap-2 items-end bg-slate-50 border-2 border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500 transition-all">

                {/* --- MICROPHONE BUTTON --- */}
                <button
                  onClick={toggleListening}
                  className={`p-3 rounded-xl transition-all duration-300 ${isListening
                    ? "bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-200 scale-105"
                    : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                    }`}
                  title="Speak to text"
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isListening ? "Listening..." : "Type your message..."}
                  className="flex-1 bg-transparent border-none px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none resize-none max-h-24"
                  rows="1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />

                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className={`p-3 rounded-xl transition-all duration-200 ${message.trim()
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 scale-100 hover:scale-110 active:scale-95"
                    : "bg-slate-200 text-slate-400 scale-95 cursor-not-allowed"
                    }`}>
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySchemes;
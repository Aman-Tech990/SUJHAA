import React, { useEffect, useMemo, useState } from "react";
import {
  Save,
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Clock,
  LogOut,
  User,
  MessageSquare,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Activity,
} from "lucide-react";

// --- SUJHAA THEME CONFIG ---
const THEME = {
  primaryHex: "#FF7A00",
  gradientBg: "bg-gradient-to-b from-orange-50 via-slate-50 to-slate-100",
};

const TrainerDashboard = () => {
  const today = new Date().toISOString().split("T")[0];

  // --- CORE STATE ---
  const [activeTab, setActiveTab] = useState("attendance");
  const [selectedDate, setSelectedDate] = useState(today);
  const [isAttendanceSaved, setIsAttendanceSaved] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true); // global loader (fetch)
  const [isSaving, setIsSaving] = useState(false); // attendance saving
  const [lastSavedAt, setLastSavedAt] = useState(null);

  // Messaging & profile
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageStatus, setMessageStatus] = useState(null); // "success" | "error" | null

  // "Backend" data
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState({});
  const [currentAttendance, setCurrentAttendance] = useState({});

  // --- FAKE BACKEND HELPERS (SIMULATED API CALLS) ---

  // 1) Fetch beneficiaries with delay, realistic batch of 40 learners
  const fakeFetchBeneficiariesFromServer = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        const moduleTemplates = [
          { id: 101, title: "Intro to Sewing Machines" },
          { id: 102, title: "Threading & Bobbin Winding" },
          { id: 103, title: "Basic Seams & Hems" },
          { id: 104, title: "Maintenance & Safety" },
        ];

        const baseBeneficiaries = [
          { id: "SC-001", name: "Rajesh Kumar", fatherName: "Suresh Kumar", phone: "9876500001", village: "Khandagiri", completedModules: 2 },
          { id: "SC-002", name: "Sunita Rani", fatherName: "Ramesh Chandra", phone: "9876500002", village: "Damana", completedModules: 1 },
          { id: "SC-003", name: "Amit Paswan", fatherName: "Dinesh Paswan", phone: "9876500003", village: "Rasulgarh", completedModules: 0 },
          { id: "SC-004", name: "Pooja Das", fatherName: "Narayan Das", phone: "9876500004", village: "Nayapalli", completedModules: 3 },
          { id: "SC-005", name: "Gita Majhi", fatherName: "Lalit Majhi", phone: "9876500005", village: "Patia", completedModules: 2 },
          { id: "SC-006", name: "Sanjay Bauri", fatherName: "Prafulla Bauri", phone: "9876500006", village: "Sailashree Vihar", completedModules: 1 },
          { id: "SC-007", name: "Kiran Behera", fatherName: "Raghunath Behera", phone: "9876500007", village: "Old Town", completedModules: 2 },
          { id: "SC-008", name: "Laxmi Naik", fatherName: "Binod Naik", phone: "9876500008", village: "Jagamara", completedModules: 1 },
          { id: "SC-009", name: "Manoj Kumar", fatherName: "Harish Kumar", phone: "9876500009", village: "Baramunda", completedModules: 3 },
          { id: "SC-010", name: "Rekha Sahu", fatherName: "Dilip Sahu", phone: "9876500010", village: "Chandrasekharpur", completedModules: 4 },

          { id: "SC-011", name: "Sanjana Rout", fatherName: "Pratap Rout", phone: "9876500011", village: "Madhusudan Nagar", completedModules: 2 },
          { id: "SC-012", name: "Deepak Mallick", fatherName: "Lakshman Mallick", phone: "9876500012", village: "BJB Nagar", completedModules: 1 },
          { id: "SC-013", name: "Anita Jena", fatherName: "Hari Jena", phone: "9876500013", village: "Hanspal", completedModules: 0 },
          { id: "SC-014", name: "Rakesh Nayak", fatherName: "Gobinda Nayak", phone: "9876500014", village: "Mancheswar", completedModules: 3 },
          { id: "SC-015", name: "Sarita Khatua", fatherName: "Gopal Khatua", phone: "9876500015", village: "Dumduma", completedModules: 2 },
          { id: "SC-016", name: "Vikram Singh", fatherName: "Balram Singh", phone: "9876500016", village: "Kalinga Nagar", completedModules: 1 },
          { id: "SC-017", name: "Priya Munda", fatherName: "Jitendra Munda", phone: "9876500017", village: "Pokhariput", completedModules: 0 },
          { id: "SC-018", name: "Suresh Hembram", fatherName: "Jagan Hembram", phone: "9876500018", village: "Laxmisagar", completedModules: 2 },
          { id: "SC-019", name: "Alka Toppo", fatherName: "Chandra Toppo", phone: "9876500019", village: "Sahid Nagar", completedModules: 4 },
          { id: "SC-020", name: "Bikash Kumar", fatherName: "Ajit Kumar", phone: "9876500020", village: "VSS Nagar", completedModules: 3 },

          { id: "SC-021", name: "Rina Soren", fatherName: "Biren Soren", phone: "9876500021", village: "Unit-8", completedModules: 2 },
          { id: "SC-022", name: "Ajay Kullu", fatherName: "Chaitanya Kullu", phone: "9876500022", village: "Unit-6", completedModules: 1 },
          { id: "SC-023", name: "Mamta Murmu", fatherName: "Jitram Murmu", phone: "9876500023", village: "Sahid Nagar", completedModules: 4 },
          { id: "SC-024", name: "Devendra Lohar", fatherName: "Ganesh Lohar", phone: "9876500024", village: "Patrapada", completedModules: 3 },
          { id: "SC-025", name: "Komal Bhoi", fatherName: "Niranjan Bhoi", phone: "9876500025", village: "Khandagiri", completedModules: 2 },
          { id: "SC-026", name: "Chandan Tudu", fatherName: "Babulal Tudu", phone: "9876500026", village: "Damana", completedModules: 1 },
          { id: "SC-027", name: "Nisha Ekka", fatherName: "Manoj Ekka", phone: "9876500027", village: "Rasulgarh", completedModules: 0 },
          { id: "SC-028", name: "Pritam Lakra", fatherName: "Binay Lakra", phone: "9876500028", village: "Nayapalli", completedModules: 2 },
          { id: "SC-029", name: "Rakesh Oraon", fatherName: "Sibu Oraon", phone: "9876500029", village: "Patia", completedModules: 3 },
          { id: "SC-030", name: "Chandni Kerketta", fatherName: "Mahesh Kerketta", phone: "9876500030", village: "Sailashree Vihar", completedModules: 4 },

          { id: "SC-031", name: "Mohan Minz", fatherName: "Lazarus Minz", phone: "9876500031", village: "Old Town", completedModules: 2 },
          { id: "SC-032", name: "Anjali Toppo", fatherName: "Peter Toppo", phone: "9876500032", village: "Jagamara", completedModules: 1 },
          { id: "SC-033", name: "Sunny Tanti", fatherName: "Ramesh Tanti", phone: "9876500033", village: "Baramunda", completedModules: 0 },
          { id: "SC-034", name: "Meena Panna", fatherName: "Kishore Panna", phone: "9876500034", village: "Chandrasekharpur", completedModules: 2 },
          { id: "SC-035", name: "Vijay Lugun", fatherName: "Sahdev Lugun", phone: "9876500035", village: "Madhusudan Nagar", completedModules: 3 },
          { id: "SC-036", name: "Rupa Kisku", fatherName: "Shyam Kisku", phone: "9876500036", village: "BJB Nagar", completedModules: 1 },
          { id: "SC-037", name: "Prakash Horo", fatherName: "Doman Horo", phone: "9876500037", village: "Hanspal", completedModules: 0 },
          { id: "SC-038", name: "Sneha Baskey", fatherName: "Sital Baskey", phone: "9876500038", village: "Mancheswar", completedModules: 4 },
          { id: "SC-039", name: "Tapan Murmu", fatherName: "Sabitri Murmu", phone: "9876500039", village: "Dumduma", completedModules: 3 },
          { id: "SC-040", name: "Lalita Mardi", fatherName: "Biren Mardi", phone: "9876500040", village: "Kalinga Nagar", completedModules: 2 },
        ];

        const withModules = baseBeneficiaries.map((b) => ({
          ...b,
          category: "SC",
          district: "Khordha",
          state: "Odisha",
          modules: moduleTemplates.map((m, idx) => ({
            ...m,
            completed: idx < b.completedModules,
          })),
        }));

        resolve(withModules);
      }, 900); // ~0.9s network delay
    });

  // 2) Save attendance to backend (simulated)
  const fakeSaveAttendanceToServer = (payload) =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log("ATTENDANCE SENT TO BACKEND:", payload);
        resolve(true);
      }, 1000);
    });

  // 3) Send message to learner (simulated)
  const fakeSendMessageToLearner = (beneficiaryId, message) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!message || message.trim().length < 5) {
          reject(new Error("Message too short"));
        } else {
          console.log("MESSAGE SENT TO BACKEND:", {
            beneficiaryId,
            message,
            sentAt: new Date().toISOString(),
          });
          resolve(true);
        }
      }, 800);
    });

  // --- INITIAL LOAD ---
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fakeFetchBeneficiariesFromServer()
      .then((data) => {
        if (!isMounted) return;
        setBeneficiaries(data);

        // Example historical day data
        const initialHistory = {
          "2023-11-28": data.reduce((acc, b, index) => {
            acc[b.id] = index % 5 === 0 ? "absent" : "present"; // roughly 20% absent
            return acc;
          }, {}),
        };

        setAttendanceHistory(initialHistory);

        // Default today's attendance: everyone present
        const defaultToday = {};
        data.forEach((b) => {
          defaultToday[b.id] = "present";
        });
        setCurrentAttendance(defaultToday);
        setIsAttendanceSaved(false);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // --- HELPERS ---
  const isEditable = selectedDate === today;

  const calculateProgress = (modules) => {
    if (!modules || modules.length === 0) return 0;
    const completed = modules.filter((m) => m.completed).length;
    return Math.round((completed / modules.length) * 100);
  };

  const totalStudents = beneficiaries.length;

  const presentCount = useMemo(() => {
    if (!totalStudents) return 0;
    return Object.values(currentAttendance).filter((s) => s === "present").length;
  }, [currentAttendance, totalStudents]);

  const attendancePercentage = useMemo(() => {
    if (!totalStudents) return 0;
    return Math.round((presentCount / totalStudents) * 100);
  }, [presentCount, totalStudents]);

  const averageCompletion = useMemo(() => {
    if (!beneficiaries.length) return 0;
    const sum = beneficiaries.reduce(
      (acc, b) => acc + calculateProgress(b.modules),
      0
    );
    return Math.round(sum / beneficiaries.length);
  }, [beneficiaries]);

  const loadAttendanceForDate = (date) => {
    setSelectedDate(date);

    if (attendanceHistory[date]) {
      setCurrentAttendance(attendanceHistory[date]);
      setIsAttendanceSaved(true);
    } else {
      const defaultState = {};
      beneficiaries.forEach((b) => {
        defaultState[b.id] = "present";
      });
      setCurrentAttendance(defaultState);
      setIsAttendanceSaved(false);
    }
  };

  const handleDateChange = (newDate) => {
    if (!newDate) return;
    if (newDate > today) return; // no future
    if (!beneficiaries.length) return;
    loadAttendanceForDate(newDate);
  };

  const toggleAttendance = (id) => {
    if (!isEditable || isSaving) return;
    setCurrentAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === "present" ? "absent" : "present",
    }));
    setIsAttendanceSaved(false);
  };

  const saveAttendance = async () => {
    if (!beneficiaries.length || isSaving) return;
    setIsSaving(true);
    setIsAttendanceSaved(false);
    setMessageStatus(null);

    try {
      await fakeSaveAttendanceToServer({
        date: selectedDate,
        batchCode: "OD-BBSR-042",
        center: "Skill Wing — Bhubaneswar",
        trainerId: "TRN-01",
        attendance: currentAttendance,
      });

      setAttendanceHistory((prev) => ({
        ...prev,
        [selectedDate]: currentAttendance,
      }));
      setIsAttendanceSaved(true);
      setLastSavedAt(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
      setIsAttendanceSaved(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    const ok = window.confirm("Are you sure you want to sign out?");
    if (ok) {
      console.log("Trainer signed out");
      // you can navigate to /login here in real app
    }
  };

  const openBeneficiaryProfile = (b) => {
    setSelectedBeneficiary(b);
    setIsProfileOpen(true);
  };

  const closeBeneficiaryProfile = () => {
    setIsProfileOpen(false);
    // small delay before clearing for smooth animation if needed
    setTimeout(() => setSelectedBeneficiary(null), 200);
  };

  const openMessageBoxForBeneficiary = (b) => {
    setSelectedBeneficiary(b);
    setMessageText("");
    setMessageStatus(null);
    setIsMessageModalOpen(true);
  };

  const handleSendMessage = async () => {
    if (!selectedBeneficiary || !messageText.trim() || isSendingMessage) return;
    setIsSendingMessage(true);
    setMessageStatus(null);

    try {
      await fakeSendMessageToLearner(selectedBeneficiary.id, messageText.trim());
      setMessageStatus("success");
      setMessageText("");
    } catch (err) {
      console.error(err);
      setMessageStatus("error");
    } finally {
      setIsSendingMessage(false);
    }
  };

  // --- UI SKELETONS ---
  const renderAttendanceSkeleton = () => (
    <div className="p-5 md:p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="w-full sm:w-72 h-10 bg-slate-100 rounded-xl animate-pulse" />
        <div className="w-32 h-7 bg-slate-100 rounded-full animate-pulse" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white/80 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100" />
              <div className="space-y-1">
                <div className="h-3 w-32 rounded bg-slate-100" />
                <div className="h-2 w-24 rounded bg-slate-100" />
              </div>
            </div>
            <div className="h-9 w-28 rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );

  // --- MAIN JSX ---
  return (
    <div className={`min-h-screen font-sans text-gray-800 ${THEME.gradientBg} relative selection:bg-orange-200`}>
      {/* Backdrop blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[340px] bg-gradient-to-b from-orange-100/80 via-orange-50 to-transparent" />
        <div className="absolute top-[-120px] right-[-80px] w-[420px] h-[420px] bg-orange-300 rounded-full mix-blend-multiply filter blur-[110px] opacity-40" />
        <div className="absolute top-[120px] left-[-120px] w-[420px] h-[420px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[110px] opacity-40" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* NAVBAR */}
        <nav className="sticky top-0 z-40 px-4 py-2 backdrop-blur-md">
          <div className="max-w-6xl mx-auto bg-white/80 border border-white/60 shadow-sm rounded-2xl px-4 h-14 flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg shadow-sm">
                <Users className="text-white h-4 w-4" />
              </div>
              <div>
                <span className="block text-base font-bold text-gray-900 leading-tight">
                  PM-AJAY
                </span>
                <span className="text-[10px] font-bold text-orange-600 tracking-widest uppercase">
                  Trainer Portal
                </span>
              </div>
            </div>

            {/* Right: Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen((p) => !p)}
                className="flex items-center gap-2.5 pl-2.5 pr-1 py-1 rounded-full bg-white/70 border border-white/80 hover:bg-white shadow-sm transition-all"
              >
                <div className="hidden md:flex flex-col items-end mr-1">
                  <span className="text-xs font-bold text-gray-800">
                    Rahul Verma
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    Master Trainer • Skill Wing
                  </span>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white shadow-sm">
                  <User size={16} />
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden">
                  <button className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600">
                    <User size={14} className="mr-2" /> My Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={14} className="mr-2" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
          {/* Header & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Batch info */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white/70 shadow-sm flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider border border-orange-200">
                  OD-BBSR-042
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                  Sewing Machine Operator
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                  40 Trainees
                </span>
              </div>
              <h1 className="text-lg md:text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
                Skill Wing Training Center • Bhubaneswar
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                PM-AJAY — Skill Development & Livelihood | Session 2025
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden flex flex-col justify-between min-h-[150px]">
              <div className="absolute top-0 right-0 p-3 opacity-20">
                <TrendingUp size={72} />
              </div>
              <div>
                <p className="text-indigo-200 font-medium text-[11px] uppercase tracking-[0.16em] mb-1">
                  Today&apos;s Attendance — {selectedDate === today ? "Live" : "History"}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black tracking-tighter">
                    {presentCount}
                  </span>
                  <span className="text-lg text-indigo-200 font-medium">
                    / {totalStudents || "--"}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-indigo-100">
                  {attendancePercentage || 0}% trainees marked present
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-indigo-100 font-medium">
                      Training Completion (Avg)
                    </span>
                    <span className="font-semibold">
                      {averageCompletion || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-orange-400 h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${averageCompletion || 0}%` }}
                    />
                  </div>
                </div>
                {lastSavedAt && (
                  <p className="text-[10px] text-indigo-200">
                    Last attendance sync: <span className="font-semibold">{lastSavedAt}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="bg-white p-1 rounded-full shadow-sm border border-gray-200 flex w-full md:w-auto">
              <button
                onClick={() => setActiveTab("attendance")}
                className={`flex-1 md:flex-none px-5 py-2 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "attendance"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                <Clock size={14} /> Attendance
              </button>
              <button
                onClick={() => setActiveTab("modules")}
                className={`flex-1 md:flex-none px-5 py-2 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "modules"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                <BookOpen size={14} /> Modules
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <span>Present</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                <span>Absent</span>
              </div>
            </div>
          </div>

          {/* CONTENT CARD */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/70 min-h-[380px] overflow-hidden relative">
            {/* ATTENDANCE TAB */}
            {activeTab === "attendance" && (
              <>
                {isLoading ? (
                  renderAttendanceSkeleton()
                ) : (
                  <div className="p-5 md:p-6">
                    {/* Date bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                      <div className="flex items-center bg-gray-100 rounded-xl p-1">
                        <button
                          onClick={() => {
                            const d = new Date(selectedDate);
                            d.setDate(d.getDate() - 1);
                            handleDateChange(d.toISOString().split("T")[0]);
                          }}
                          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-600"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <div className="px-3 font-bold text-sm text-gray-700 min-w-[140px] text-center">
                          <input
                            type="date"
                            max={today}
                            value={selectedDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="bg-transparent text-center outline-none cursor-pointer w-full"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const d = new Date(selectedDate);
                            d.setDate(d.getDate() + 1);
                            handleDateChange(d.toISOString().split("T")[0]);
                          }}
                          disabled={selectedDate === today}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${selectedDate === today
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-600 hover:bg-white hover:shadow-sm"
                            }`}
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>

                      {isEditable ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wide animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                          Live session — Mark in real-time
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-wide">
                          <Clock size={10} /> Historical Attendance (View Only)
                        </div>
                      )}
                    </div>

                    {/* Attendance list */}
                    <div className="space-y-2.5 max-h-[390px] overflow-y-auto pr-1">
                      {beneficiaries.map((b) => (
                        <div
                          key={b.id}
                          className="group flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/40 hover:shadow-sm bg-white transition-all"
                        >
                          <div className="flex items-center gap-3 w-full sm:w-auto mb-3 sm:mb-0">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-black text-base group-hover:bg-white shadow-inner">
                              {b.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-sm">
                                {b.name}
                              </h3>
                              <p className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
                                {b.id}
                                <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                                {b.category} • {b.village}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => openBeneficiaryProfile(b)}
                              className="flex-1 sm:flex-none px-3 py-2 rounded-lg text-[11px] font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                              View
                            </button>
                            <button
                              onClick={() => toggleAttendance(b.id)}
                              disabled={!isEditable || isSaving}
                              className={`flex-1 sm:flex-none w-full sm:w-32 py-2.5 rounded-lg font-bold text-xs shadow-sm transition-all active:scale-95 ${!isEditable || isSaving
                                ? "opacity-60 cursor-not-allowed"
                                : "hover:shadow"
                                } ${currentAttendance[b.id] === "present"
                                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                                  : "bg-white border-2 border-red-100 text-red-500 hover:bg-red-50"
                                }`}
                            >
                              {currentAttendance[b.id] === "present"
                                ? "Present"
                                : "Absent"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Save attendance */}
                    {isEditable && (
                      <div className="mt-5 flex justify-end">
                        <button
                          onClick={saveAttendance}
                          disabled={isSaving || isAttendanceSaved}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-md transition-all ${isAttendanceSaved
                            ? "bg-emerald-500 cursor-default"
                            : isSaving
                              ? "bg-slate-500 cursor-wait"
                              : "bg-gray-700 hover:bg-orange-500 hover:shadow-orange-500/30"
                            }`}
                        >
                          {isSaving ? (
                            <>
                              <Activity size={18} className="animate-spin" />{" "}
                              Saving...
                            </>
                          ) : isAttendanceSaved ? (
                            <>
                              <CheckCircle2 size={18} /> Saved Successfully
                            </>
                          ) : (
                            <>
                              <Save size={18} /> Save Record
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* MODULES TAB */}
            {activeTab === "modules" && (
              <div className="p-5 md:p-6 bg-gray-50/60 min-h-[380px]">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-11 w-11 rounded-full bg-slate-100" />
                          <div className="space-y-1">
                            <div className="h-3 w-28 rounded bg-slate-100" />
                            <div className="h-2 w-20 rounded bg-slate-100" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2.5 w-full rounded bg-slate-50" />
                          <div className="h-2.5 w-[90%] rounded bg-slate-50" />
                          <div className="h-2.5 w-[80%] rounded bg-slate-50" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
                    {beneficiaries.map((b) => {
                      const progress = calculateProgress(b.modules);
                      const isComplete = progress === 100;

                      return (
                        <div
                          key={b.id}
                          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-12">
                                <svg
                                  className="h-full w-full text-gray-100"
                                  viewBox="0 0 36 36"
                                >
                                  <path
                                    d="M18 2.0845
                                       a 15.9155 15.9155 0 0 1 0 31.831
                                       a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                  />
                                </svg>
                                <svg
                                  className={`h-full w-full absolute inset-0 ${isComplete
                                    ? "text-emerald-500"
                                    : "text-indigo-600"
                                    }`}
                                  viewBox="0 0 36 36"
                                >
                                  <path
                                    d="M18 2.0845
                                       a 15.9155 15.9155 0 0 1 0 31.831
                                       a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeDasharray={`${progress}, 100`}
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800">
                                  {progress}%
                                </div>
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 text-sm">
                                  {b.name}
                                </h3>
                                <p className="text-[11px] text-gray-400 font-medium">
                                  {b.id} • {b.village}
                                </p>
                              </div>
                            </div>
                            {isComplete && (
                              <div className="bg-green-100 text-green-700 p-1.5 rounded-full">
                                <CheckCircle2 size={16} />
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            {b.modules.map((m) => (
                              <div
                                key={m.id}
                                className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-all ${m.completed
                                  ? "bg-green-50 border-green-100"
                                  : "bg-white border-gray-100"
                                  }`}
                              >
                                <div
                                  className={`h-4 w-4 rounded-full flex items-center justify-center border ${m.completed
                                    ? "bg-green-500 border-green-500"
                                    : "bg-white border-gray-300"
                                    }`}
                                >
                                  {m.completed && (
                                    <CheckCircle2
                                      size={10}
                                      className="text-white"
                                    />
                                  )}
                                </div>
                                <span
                                  className={`text-sm font-medium ${m.completed
                                    ? "text-gray-500 line-through"
                                    : "text-gray-700"
                                    }`}
                                >
                                  {m.title}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-3 flex justify-between items-center">
                            <button
                              onClick={() => openBeneficiaryProfile(b)}
                              className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                            >
                              <User size={12} /> View Profile
                            </button>
                            <button
                              onClick={() => openMessageBoxForBeneficiary(b)}
                              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                            >
                              <MessageSquare size={12} /> Message
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* BENEFICIARY PROFILE DRAWER */}
      {selectedBeneficiary && (
        <div
          className={`fixed inset-0 z-40 flex justify-end transition ${isProfileOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
        >
          {/* Overlay */}
          <div
            className={`flex-1 bg-black/30 backdrop-blur-sm transition-opacity ${isProfileOpen ? "opacity-100" : "opacity-0"
              }`}
            onClick={closeBeneficiaryProfile}
          />

          {/* Drawer */}
          <div
            className={`w-full sm:w-[360px] md:w-[380px] bg-white shadow-2xl border-l border-gray-100 p-5 flex flex-col gap-4 transform transition-transform ${isProfileOpen ? "translate-x-0" : "translate-x-full"
              }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-[11px] font-semibold text-orange-600 uppercase tracking-[0.16em]">
                  Trainee Profile
                </p>
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedBeneficiary.name}
                </h2>
              </div>
              <button
                onClick={closeBeneficiaryProfile}
                className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold flex items-center justify-center">
                {selectedBeneficiary.name.charAt(0)}
              </div>
              <div className="text-xs text-gray-600">
                <p>
                  <span className="font-semibold">ID:</span>{" "}
                  {selectedBeneficiary.id}
                </p>
                <p>
                  <span className="font-semibold">Father&apos;s Name:</span>{" "}
                  {selectedBeneficiary.fatherName}
                </p>
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {selectedBeneficiary.category}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-700 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-orange-500" />
                <span>
                  {selectedBeneficiary.village}, {selectedBeneficiary.district},{" "}
                  {selectedBeneficiary.state}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-emerald-500" />
                <span>+91-{selectedBeneficiary.phone}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-3">
              <p className="text-[11px] font-semibold text-gray-500 mb-1">
                Training Progress
              </p>
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14">
                  {(() => {
                    const progress = calculateProgress(
                      selectedBeneficiary.modules
                    );
                    return (
                      <>
                        <svg
                          className="h-full w-full text-gray-100"
                          viewBox="0 0 36 36"
                        >
                          <path
                            d="M18 2.0845
                               a 15.9155 15.9155 0 0 1 0 31.831
                               a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                        </svg>
                        <svg
                          className="h-full w-full absolute inset-0 text-orange-500"
                          viewBox="0 0 36 36"
                        >
                          <path
                            d="M18 2.0845
                               a 15.9155 15.9155 0 0 1 0 31.831
                               a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${progress}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800">
                          {progress}%
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="flex-1 text-[11px] text-gray-600">
                  {selectedBeneficiary.modules.map((m) => (
                    <p key={m.id} className="flex items-center justify-between">
                      <span className={m.completed ? "line-through" : ""}>
                        {m.title}
                      </span>
                      <span
                        className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${m.completed
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-gray-50 text-gray-500"
                          }`}
                      >
                        {m.completed ? "Done" : "Pending"}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => openMessageBoxForBeneficiary(selectedBeneficiary)}
              className="mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md"
            >
              <MessageSquare size={16} /> Send Message / Remark
            </button>
          </div>
        </div>
      )}

      {/* MESSAGE MODAL */}
      {isMessageModalOpen && selectedBeneficiary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[11px] font-semibold text-orange-600 uppercase tracking-[0.16em]">
                  Message Trainee
                </p>
                <h3 className="text-sm font-bold text-gray-900">
                  {selectedBeneficiary.name} ({selectedBeneficiary.id})
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsMessageModalOpen(false);
                  setMessageStatus(null);
                }}
                className="h-7 w-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
              <Mail size={13} className="text-indigo-500" />
              <span>
                This will be stored as a{" "}
                <span className="font-semibold">trainer remark</span> in
                SUJHAA backend (demo mode).
              </span>
            </div>

            <textarea
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Example: Rajesh has improved on basic seams but needs more practice on machine maintenance..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 resize-none"
            />

            {messageStatus === "success" && (
              <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={12} /> Remark stored successfully for this
                trainee.
              </p>
            )}
            {messageStatus === "error" && (
              <p className="mt-2 text-xs text-red-500">
                Message too short. Please add at least a few words.
              </p>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsMessageModalOpen(false);
                  setMessageStatus(null);
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={isSendingMessage}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white flex items-center gap-2 disabled:opacity-60"
              >
                {isSendingMessage ? (
                  <>
                    <Activity size={14} className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <MessageSquare size={14} /> Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;

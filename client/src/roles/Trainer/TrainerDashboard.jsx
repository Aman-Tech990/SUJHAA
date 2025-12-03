import React, { useState } from 'react';
import { 
  Calendar, 
  Save, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2,
  BookOpen,
  Clock,
  LogOut,
  User,
  LayoutGrid,
  TrendingUp
} from 'lucide-react';

const TrainerDashboard = () => {
  // --- 1. CONFIGURATION & STATE (UNCHANGED) ---
  const today = new Date().toISOString().split('T')[0];
  const [activeTab, setActiveTab] = useState('attendance'); 
  const [selectedDate, setSelectedDate] = useState(today);
  const [isAttendanceSaved, setIsAttendanceSaved] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // --- MOCK DATA (Stable) ---
  const [beneficiaries, setBeneficiaries] = useState([
    { 
      id: 'SC-001', name: 'Rajesh Kumar', fatherName: 'Suresh Kumar', category: 'SC',
      modules: [
        { id: 101, title: "Intro to Sewing Machines", completed: true },
        { id: 102, title: "Threading & Bobbin Winding", completed: true },
        { id: 103, title: "Basic Seams & Hems", completed: false },
        { id: 104, title: "Maintenance & Safety", completed: false },
      ]
    },
    { 
      id: 'SC-002', name: 'Sunita Devi', fatherName: 'Ramesh Chandra', category: 'SC',
      modules: [
        { id: 101, title: "Intro to Sewing Machines", completed: true },
        { id: 102, title: "Threading & Bobbin Winding", completed: false },
        { id: 103, title: "Basic Seams & Hems", completed: false },
        { id: 104, title: "Maintenance & Safety", completed: false },
      ]
    },
    { 
      id: 'SC-003', name: 'Amit Paswan', fatherName: 'Dinesh Paswan', category: 'SC',
      modules: [
        { id: 101, title: "Intro to Sewing Machines", completed: false },
        { id: 102, title: "Threading & Bobbin Winding", completed: false },
        { id: 103, title: "Basic Seams & Hems", completed: false },
        { id: 104, title: "Maintenance & Safety", completed: false },
      ] 
    },
  ]);

  const [attendanceHistory, setAttendanceHistory] = useState({
    '2023-11-28': { 'SC-001': 'present', 'SC-002': 'present', 'SC-003': 'absent' },
  });
  
  const [currentAttendance, setCurrentAttendance] = useState(() => {
    if (attendanceHistory[today]) return attendanceHistory[today];
    const defaultState = {};
    beneficiaries.forEach(b => defaultState[b.id] = 'present');
    return defaultState;
  });

  const loadAttendanceForDate = (date) => {
    setSelectedDate(date);
    if (attendanceHistory[date]) {
      setCurrentAttendance(attendanceHistory[date]);
      setIsAttendanceSaved(true);
    } else {
      const defaultState = {};
      beneficiaries.forEach(b => defaultState[b.id] = 'present');
      setCurrentAttendance(defaultState);
      setIsAttendanceSaved(false);
    }
  };

  const handleDateChange = (newDate) => {
    if (newDate > today) return; 
    loadAttendanceForDate(newDate);
  };

  const toggleAttendance = (id) => {
    if (selectedDate !== today) return; 
    setCurrentAttendance(prev => ({
      ...prev,
      [id]: prev[id] === 'present' ? 'absent' : 'present'
    }));
    setIsAttendanceSaved(false);
  };

  const saveAttendance = () => {
    setAttendanceHistory(prev => ({ ...prev, [selectedDate]: currentAttendance }));
    setIsAttendanceSaved(true);
    alert(`Attendance for ${selectedDate} saved successfully.`);
  };

  const toggleModule = (beneficiaryId, moduleId) => {
    setBeneficiaries(prev => prev.map(b => {
      if (b.id === beneficiaryId) {
        const newModules = b.modules.map(m => 
          m.id === moduleId ? { ...m, completed: !m.completed } : m
        );
        return { ...b, modules: newModules };
      }
      return b;
    }));
  };

  const calculateProgress = (modules) => {
    const completed = modules.filter(m => m.completed).length;
    return Math.round((completed / modules.length) * 100);
  };

  const handleSignOut = () => {
    const confirm = window.confirm("Are you sure you want to sign out?");
    if(confirm) console.log("User signed out");
  };

  // --- STATS ---
  const isEditable = selectedDate === today;
  const presentCount = Object.values(currentAttendance).filter(s => s === 'present').length;
  const totalStudents = beneficiaries.length;
  const attendancePercentage = Math.round((presentCount / totalStudents) * 100);

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-slate-50 relative selection:bg-orange-200">
      
      {/* 1. BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-orange-50 to-slate-50"></div>
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-orange-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse"></div>
        <div className="absolute top-[80px] left-[-80px] w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50"></div>
      </div>

      {/* 2. WRAPPER */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* --- MEDIUM GLASS NAVBAR --- */}
        <nav className="sticky top-0 z-50 px-4 py-2">
          <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-lg border border-white/50 shadow-md rounded-2xl px-4 h-14 flex items-center justify-between transition-all hover:bg-white/90">
             
             {/* Logo */}
             <div className="flex items-center gap-2.5">
               <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg shadow-sm">
                 <Users className="text-white h-4 w-4" />
               </div>
               <div>
                 <span className="block text-base font-bold text-gray-900 leading-none">PM-AJAY</span>
                 <span className="text-[10px] font-bold text-orange-600 tracking-widest uppercase">Trainer Portal</span>
               </div>
             </div>

             {/* Profile */}
             <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 pl-2.5 pr-1 py-1 rounded-full bg-white/60 border border-white/70 hover:bg-white transition-all shadow-sm hover:cursor-pointer"
                >
                  <div className="hidden md:flex flex-col items-end mr-1">
                    <span className="text-xs font-bold text-gray-800">Rahul Verma</span>
                    <span className="text-[10px] text-gray-500 font-medium">Master Trainer</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white shadow-sm">
                    <User size={16} />
                  </div>
                </button>

                {/* Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 border border-gray-100 overflow-hidden origin-top-right">
                    <button className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors hover:cursor-pointer">
                      <User size={14} className="mr-2" /> My Profile
                    </button>
                    <button 
                      onClick={handleSignOut}
                      className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors hover:cursor-pointer"
                    >
                      <LogOut size={14} className="mr-2" /> Sign Out
                    </button>
                  </div>
                )}
             </div>
          </div>
        </nav>

        {/* --- MAIN DASHBOARD AREA --- */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
          
          {/* Header & Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Title Section */}
            <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                 <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider border border-orange-200">
                   OD-BBSR-042
                 </span>
                 <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                   Skill Wing
                 </span>
              </div>
              <h1 className="text-lg md:text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
                Sewing Machine Operator
              </h1>
              <p className="text-sm text-gray-500 font-medium">Batch A • Session 2025</p>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden flex flex-col justify-between min-h-[140px]">
               <div className="absolute top-0 right-0 p-3 opacity-10">
                 <TrendingUp size={80} />
               </div>
               <div>
                 <p className="text-indigo-200 font-medium text-xs uppercase tracking-wider mb-1">Today's Attendance</p>
                 <div className="flex items-baseline gap-1.5">
                   <span className="text-2xl font-black tracking-tighter">{presentCount}</span>
                   <span className="text-lg text-indigo-300 font-medium">/ {totalStudents}</span>
                 </div>
               </div>
               <div className="mt-3">
                 <div className="w-full bg-black/20 rounded-full h-1.5 mb-1.5">
                   <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${attendancePercentage}%` }}></div>
                 </div>
                 <p className="text-[10px] text-indigo-200 font-medium">{attendancePercentage}% Present</p>
               </div>
            </div>
          </div>

          {/* Controls & Tabs */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
             {/* Pill Tabs - Medium Size */}
             <div className="bg-white p-1 rounded-full shadow-sm border border-gray-200 flex w-full md:w-auto ">
                <button 
                  onClick={() => setActiveTab('attendance')}
                  className={`flex-1 md:flex-none px-5 py-2 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:cursor-pointer ${
                    activeTab === 'attendance' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Clock size={14} /> Attendance
                </button>
                <button 
                  onClick={() => setActiveTab('modules')}
                  className={`flex-1 md:flex-none px-5 py-2 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:cursor-pointer ${
                    activeTab === 'modules' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <BookOpen size={14} /> Modules
                </button>
             </div>
          </div>

          {/* --- CONTENT AREA (CARD) --- */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl shadow-lg border border-white/60 min-h-[350px] overflow-hidden">
            
            {/* ATTENDANCE VIEW */}
            {activeTab === 'attendance' && (
              <div className="p-5 md:p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Date Navigation */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                   <div className="flex items-center bg-gray-100 rounded-xl p-1">
                      <button 
                        onClick={() => {
                          const d = new Date(selectedDate); d.setDate(d.getDate() - 1); handleDateChange(d.toISOString().split('T')[0]);
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <div className="px-3 font-bold text-sm text-gray-700 min-w-[120px] text-center">
                        <input 
                           type="date" max={today} value={selectedDate} 
                           onChange={(e) => handleDateChange(e.target.value)}
                           className="bg-transparent text-center outline-none cursor-pointer w-full"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const d = new Date(selectedDate); d.setDate(d.getDate() + 1); handleDateChange(d.toISOString().split('T')[0]);
                        }}
                        disabled={selectedDate === today}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${selectedDate === today ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-white hover:shadow-sm text-gray-600'}`}
                      >
                        <ChevronRight size={18} />
                      </button>
                   </div>
                   
                   {/* Status Indicator */}
                   {isEditable ? (
                     <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wide animate-pulse">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Live Session
                     </div>
                   ) : (
                     <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-wide">
                       <Clock size={10} /> Historical Data
                     </div>
                   )}
                </div>

                {/* List View - Tighter spacing */}
                <div className="space-y-2.5">
                  {beneficiaries.map((b) => (
                    <div key={b.id} className="group flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 hover:shadow-sm transition-all duration-200 bg-white">
                       <div className="flex items-center gap-3 w-full sm:w-auto mb-3 sm:mb-0">
                          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-black text-base group-hover:bg-white shadow-inner">
                            {b.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-base">{b.name}</h3>
                            <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                              {b.id} <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span> {b.category}
                            </p>
                          </div>
                       </div>

                       <button
                         onClick={() => toggleAttendance(b.id)}
                         disabled={!isEditable}
                         className={`
                           w-full sm:w-36 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-all duration-300 hover:cursor-pointer transform active:scale-95
                           ${!isEditable ? 'opacity-50 cursor-not-allowed' : 'hover:shadow'}
                           ${currentAttendance[b.id] === 'present' 
                             ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                             : 'bg-white border-2 border-red-100 text-red-500 hover:bg-red-50'}
                         `}
                       >
                         {currentAttendance[b.id] === 'present' ? 'Present' : 'Absent'}
                       </button>
                    </div>
                  ))}
                </div>

                {/* Save Button - Medium Size */}
                {isEditable && (
                  <div className="mt-6 flex justify-end sticky bottom-0 pt-3">
                     <button 
                       onClick={saveAttendance}
                       disabled={isAttendanceSaved}
                       className={`
                         flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:cursor-pointer
                         ${isAttendanceSaved 
                           ? 'bg-slate-400 cursor-default shadow-none' 
                           : 'bg-gray-500 hover:bg-orange-500 hover:shadow-orange-500/20'}
                       `}
                     >
                       {isAttendanceSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                       {isAttendanceSaved ? 'Saved Successfully' : 'Save Record'}
                     </button>
                  </div>
                )}
              </div>
            )}

            {/* MODULES VIEW - Medium Size */}
            {activeTab === 'modules' && (
              <div className="p-5 md:p-6 bg-gray-50/50 min-h-[350px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {beneficiaries.map((b) => {
                    const progress = calculateProgress(b.modules);
                    const isComplete = progress === 100;

                    return (
                      <div key={b.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-5">
                           <div className="flex items-center gap-3">
                              <div className="relative h-12 w-12">
                                <svg className="h-full w-full" viewBox="0 0 36 36">
                                  <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                  <path className={`${isComplete ? 'text-green-500' : 'text-indigo-600'} transition-all duration-1000`} strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                                  {progress}%
                                </div>
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 text-base">{b.name}</h3>
                                <p className="text-xs text-gray-400 font-medium">Progress Tracking</p>
                              </div>
                           </div>
                           {isComplete && <div className="bg-green-100 text-green-700 p-1.5 rounded-full"><CheckCircle2 size={16}/></div>}
                        </div>

                        <div className="space-y-2">
                           {b.modules.map((m) => (
                             <div 
                               key={m.id}
                               onClick={() => toggleModule(b.id, m.id)}
                               className={`
                                 flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all duration-200 border
                                 ${m.completed 
                                   ? 'bg-green-50 border-green-100' 
                                   : 'bg-white border-gray-100 hover:bg-indigo-50 hover:border-indigo-100'}
                               `}
                             >
                               <div className={`
                                  h-4 w-4 rounded-full flex items-center justify-center border transition-all
                                  ${m.completed ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}
                               `}>
                                 {m.completed && <CheckCircle2 size={10} className="text-white" />}
                               </div>
                               <span className={`text-sm font-medium ${m.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                                 {m.title}
                               </span>
                             </div>
                           ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default TrainerDashboard;
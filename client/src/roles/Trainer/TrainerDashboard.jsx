import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Save, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Clock,
  BarChart3
} from 'lucide-react';

const TrainerDashboard = () => {
  // --- 1. CONFIGURATION & STATE ---
  const today = new Date().toISOString().split('T')[0];
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' or 'modules'
  const [selectedDate, setSelectedDate] = useState(today);
  const [isAttendanceSaved, setIsAttendanceSaved] = useState(false);

  // --- MOCK DATA ---
  // Default Modules for the "Sewing Machine Operator" Course (Example)
  const defaultModules = [
    { id: 101, title: "Intro to Sewing Machines", completed: false },
    { id: 102, title: "Threading & Bobbin Winding", completed: false },
    { id: 103, title: "Basic Seams & Hems", completed: false },
    { id: 104, title: "Maintenance & Safety", completed: false },
  ];

  const [beneficiaries, setBeneficiaries] = useState([
    { 
      id: 'SC-001', name: 'Rajesh Kumar', fatherName: 'Suresh Kumar', category: 'SC', aadhaarLast4: '4521',
      modules: [
        { id: 101, title: "Intro to Sewing Machines", completed: true },
        { id: 102, title: "Threading & Bobbin Winding", completed: true },
        { id: 103, title: "Basic Seams & Hems", completed: false },
        { id: 104, title: "Maintenance & Safety", completed: false },
      ]
    },
    { 
      id: 'SC-002', name: 'Sunita Devi', fatherName: 'Ramesh Chandra', category: 'SC', aadhaarLast4: '8823',
      modules: [
        { id: 101, title: "Intro to Sewing Machines", completed: true },
        { id: 102, title: "Threading & Bobbin Winding", completed: false },
        { id: 103, title: "Basic Seams & Hems", completed: false },
        { id: 104, title: "Maintenance & Safety", completed: false },
      ]
    },
    { 
      id: 'SC-003', name: 'Amit Paswan', fatherName: 'Dinesh Paswan', category: 'SC', aadhaarLast4: '1102',
      modules: JSON.parse(JSON.stringify(defaultModules)) // Copy default structure
    },
  ]);

  // Attendance History (Mock Database)
  const [attendanceHistory, setAttendanceHistory] = useState({
    '2023-11-28': { 'SC-001': 'present', 'SC-002': 'present', 'SC-003': 'absent' },
  });
  
  // Current Attendance Session Buffer
  const [currentAttendance, setCurrentAttendance] = useState({});

  // --- 2. LOGIC: ATTENDANCE ---
  useEffect(() => {
    if (attendanceHistory[selectedDate]) {
      setCurrentAttendance(attendanceHistory[selectedDate]);
      setIsAttendanceSaved(true);
    } else {
      const defaultState = {};
      beneficiaries.forEach(b => defaultState[b.id] = 'present');
      setCurrentAttendance(defaultState);
      setIsAttendanceSaved(false);
    }
  }, [selectedDate, beneficiaries, attendanceHistory]);

  const toggleAttendance = (id) => {
    if (selectedDate !== today) return; // Strict Date Rule
    setCurrentAttendance(prev => ({
      ...prev,
      [id]: prev[id] === 'present' ? 'absent' : 'present'
    }));
    setIsAttendanceSaved(false);
  };

  const saveAttendance = () => {
    setAttendanceHistory(prev => ({ ...prev, [selectedDate]: currentAttendance }));
    setIsAttendanceSaved(true);
    alert(`Attendance for ${selectedDate} saved.`);
  };

  // --- 3. LOGIC: MODULES ---
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

  // Stats for Header
  const isEditable = selectedDate === today;
  const attendanceStats = {
    total: beneficiaries.length,
    present: Object.values(currentAttendance).filter(s => s === 'present').length
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-12">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
             <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="text-orange-600" />
                PM-AJAY Trainer Portal
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-1">Skill Development Wing • Batch A</p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs text-gray-400 uppercase font-bold">Current Date</p>
              <p className="text-sm font-semibold">{new Date().toDateString()}</p>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-6 border-b border-gray-100 -mb-4 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('attendance')}
              className={`pb-4 px-2 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'attendance' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Clock size={16} /> Daily Attendance
            </button>
            <button 
              onClick={() => setActiveTab('modules')}
              className={`pb-4 px-2 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'modules' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen size={16} /> Course Progress (Modules)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        
        {/* ======================= TAB 1: ATTENDANCE ======================= */}
        {activeTab === 'attendance' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-300">
                <button 
                  onClick={() => setSelectedDate(prev => {
                    const d = new Date(prev); d.setDate(d.getDate() - 1); return d.toISOString().split('T')[0];
                  })}
                  className="p-2 hover:bg-gray-100 rounded-md text-gray-600"
                ><ChevronLeft size={20} /></button>
                <div className="relative">
                  <input 
                    type="date" max={today} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-9 pr-3 py-1.5 outline-none font-medium text-gray-700 bg-transparent"
                  />
                  <Calendar size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button 
                  onClick={() => setSelectedDate(prev => {
                    const d = new Date(prev); d.setDate(d.getDate() + 1); 
                    const res = d.toISOString().split('T')[0]; return res > today ? today : res;
                  })}
                  className={`p-2 rounded-md ${selectedDate === today ? 'opacity-30' : 'hover:bg-gray-100'}`}
                  disabled={selectedDate === today}
                ><ChevronRight size={20} /></button>
              </div>

              {!isEditable ? (
                <span className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                  <AlertCircle size={14} /> View Only (History)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full animate-pulse">
                  <CheckCircle2 size={14} /> Live Editing
                </span>
              )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Beneficiary</th>
                    <th className="px-6 py-4 text-center">Current Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {beneficiaries.map((b) => (
                    <tr key={b.id}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{b.name}</div>
                        <div className="text-xs text-gray-500">ID: {b.id}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleAttendance(b.id)}
                          disabled={!isEditable}
                          className={`
                            px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all
                            ${!isEditable ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                            ${currentAttendance[b.id] === 'present' 
                              ? 'bg-green-100 text-green-700 border border-green-200' 
                              : 'bg-red-50 text-red-600 border border-red-100'}
                          `}
                        >
                          {currentAttendance[b.id]}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isEditable && (
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                  <button 
                    onClick={saveAttendance}
                    disabled={isAttendanceSaved}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${isAttendanceSaved ? 'bg-gray-300 text-white' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
                  >
                    <Save size={18} /> {isAttendanceSaved ? 'Saved' : 'Save Today\'s Record'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================= TAB 2: MODULE PROGRESS ======================= */}
        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {beneficiaries.map((b) => {
              const progress = calculateProgress(b.modules);
              return (
                <div key={b.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{b.name}</h3>
                      <p className="text-xs text-gray-500">ID: {b.id}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-blue-600">{progress}%</span>
                      <p className="text-[10px] text-gray-400 uppercase">Completed</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Modules Checklist */}
                  <div className="space-y-2">
                    {b.modules.map((m) => (
                      <div 
                        key={m.id} 
                        onClick={() => toggleModule(b.id, m.id)}
                        className={`
                          flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all select-none
                          ${m.completed 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-white border-gray-100 hover:border-blue-200 hover:bg-blue-50'}
                        `}
                      >
                        <div className={`
                          w-5 h-5 rounded flex items-center justify-center border transition-colors
                          ${m.completed ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}
                        `}>
                          {m.completed && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                        <span className={`text-sm ${m.completed ? 'text-gray-600 font-medium' : 'text-gray-500'}`}>
                          {m.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default TrainerDashboard;
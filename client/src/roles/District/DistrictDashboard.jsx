import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { 
  Users, 
  IndianRupee, 
  TrendingUp, 
  Clock, 
  Check, 
  X, 
  CheckCircle,
  FileCheck 
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
} from 'recharts';

const DistrictDashboard = () => {
  const navigate = useNavigate(); // 2. Initialize Hook

  // --- 1. MOCK DATA ---
  
  // KPI Data
  const stats = [
    // Added 'textColor' to ensure Tailwind renders the icons correctly
    { label: 'Total Applications', value: '133', change: '+12%', icon: Users, color: 'bg-blue-500', textColor: 'text-blue-500' },
    { label: 'Pending Approval', value: '45', change: 'Urgent', icon: Clock, color: 'bg-amber-500', textColor: 'text-amber-500' },
    { label: 'Funds Disbursed', value: '₹42.5L', change: '85% of Goal', icon: IndianRupee, color: 'bg-green-600', textColor: 'text-green-600' },
    { label: 'Avg. Feedback Score', value: '4.2/5', change: '+0.3', icon: TrendingUp, color: 'bg-purple-500', textColor: 'text-purple-500' },
  ];

  // Chart Data: Application Status (Pie)
  const statusData = [
    { name: 'Approved', value: 100 },
    { name: 'Rejected', value: 33 },
  ];
  const COLORS = ['#00a851', '#ef4444'];

  // --- 2. INTERACTIVE STATE FOR APPROVALS ---
  
  const [approvalsList, setApprovalsList] = useState([
    { id: 101, name: "Ravi Kumar", scheme: "Skill Training", fieldStatus: "Verified", date: "2024-10-24", status: "Pending" },
    { id: 102, name: "Sunita Devi", scheme: "Income Generation", fieldStatus: "Verified", date: "2024-10-25", status: "Pending" },
    { id: 103, name: "Amit Das", scheme: "Education Aid", fieldStatus: "Verified", date: "2024-10-26", status: "Pending" },
    { id: 104, name: "Priya Sethi", scheme: "Skill Training", fieldStatus: "Verified", date: "2024-10-26", status: "Pending" },
    { id: 105, name: "Kiran Bedi", scheme: "Income Generation", fieldStatus: "Verified", date: "2024-10-27", status: "Pending" },
  ]);

  // Handle Approve (Tick)
  const handleApprove = (id) => {
    setApprovalsList(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'Approved' } : app
    ));
  };

  // Handle Reject (Cross)
  const handleReject = (id) => {
    setApprovalsList(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'Rejected' } : app
    ));
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">District Overview</h1>
          <p className="text-sm text-gray-500">Welcome back, Officer. Here is the latest progress for Khordha District.</p>
        </div>
      </div>

      {/* --- KPI STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              <span className={`text-xs font-medium ${stat.change.includes('Urgent') ? 'text-red-600' : 'text-green-600'}`}>
                {stat.change}
              </span>
            </div>
            {/* FIXED: Using explicit textColor for icons */}
            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
              <stat.icon size={24} className={stat.textColor} />
            </div>
          </div>
        ))}
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: APPROVAL TABLE (Interactive) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div>
              <h3 className="font-bold text-gray-800">Field Verified List</h3>
              <p className="text-xs text-gray-500">Only applications verified by Field Officers are shown here.</p>
            </div>
          </div>
          
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Beneficiary</th>
                <th className="px-6 py-3">Scheme Type</th>
                <th className="px-6 py-3">Field Status</th>
                <th className="px-6 py-3 text-center">District Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {approvalsList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* Name & ID - CLICKABLE FOR NAVIGATION */}
                  <td className="px-6 py-4">
                    <div 
                        onClick={() => navigate(`/districtOfficer/application/${item.id}`)}
                        className="font-medium text-blue-600 cursor-pointer hover:underline hover:text-blue-800 transition-colors"
                    >
                        {item.name}
                    </div>
                    <div className="text-[10px] text-gray-400">ID: {item.id}</div>
                  </td>
                  
                  {/* Scheme */}
                  <td className="px-6 py-4 text-gray-600">{item.scheme}</td>
                  
                  {/* Field Status */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-1 rounded w-fit text-xs font-semibold">
                       <FileCheck size={14} /> Verified
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      {item.date}
                    </div>
                  </td>
                  
                  {/* ACTION BUTTONS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      
                      {/* IF PENDING: Show Buttons */}
                      {item.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(item.id)}
                            title="Approve"
                            className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                          >
                            <Check size={18} strokeWidth={3} />
                          </button>
                          
                          <button 
                            onClick={() => handleReject(item.id)}
                            title="Reject"
                            className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          >
                            <X size={18} strokeWidth={3} />
                          </button>
                        </>
                      )}

                      {/* IF APPROVED: Show Badge */}
                      {item.status === 'Approved' && (
                        <span className="flex items-center gap-1 text-green-600 font-bold text-xs">
                          <CheckCircle size={16} /> Approved
                        </span>
                      )}

                      {/* IF REJECTED: Show Badge */}
                      {item.status === 'Rejected' && (
                        <span className="flex items-center gap-1 text-red-600 font-bold text-xs">
                          <X size={16} /> Rejected
                        </span>
                      )}

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT: PIE CHART */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col ">
          <h3 className="font-bold text-gray-800 mb-4">Application Status</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Total 133 Applications</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DistrictDashboard;
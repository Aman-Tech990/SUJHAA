import React, { useState } from 'react';
import { 
  Download, 
  Calendar, 
  IndianRupee, 
  Users, 
  TrendingUp, 
  PieChart as PieIcon,
  FileText,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const MISReport = () => {
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [exportMonth, setExportMonth] = useState('Oct'); // Default for export

  // --- MOCK DATA: Scaled down to fit < 50 Lakhs Budget ---
  // Total Annual Budget assumed: ₹50.00 Lakhs
  const monthlyData = [
    { month: 'Apr', allocated: 4.5, utilized: 2.1, verified: 12 },
    { month: 'May', allocated: 4.5, utilized: 3.4, verified: 18 },
    { month: 'Jun', allocated: 4.5, utilized: 4.1, verified: 22 },
    { month: 'Jul', allocated: 5.0, utilized: 4.8, verified: 28 },
    { month: 'Aug', allocated: 5.0, utilized: 3.2, verified: 35 },
    { month: 'Sep', allocated: 5.0, utilized: 4.9, verified: 30 },
    { month: 'Oct', allocated: 6.0, utilized: 5.5, verified: 42 },
    { month: 'Nov', allocated: 6.0, utilized: 5.8, verified: 48 },
    { month: 'Dec', allocated: 6.0, utilized: 2.1, verified: 15 }, // Current partial month
  ];

  // Calculate Totals for KPI Cards
  const totalUtilized = monthlyData.reduce((acc, curr) => acc + curr.utilized, 0).toFixed(2);
  const totalVerified = monthlyData.reduce((acc, curr) => acc + curr.verified, 0);
  
  // Total Annual Allocation Limit for this District
  const totalDistrictBudget = 50.00; 
  const remainingFunds = (totalDistrictBudget - totalUtilized).toFixed(2);

  const handleExport = () => {
    alert(`Generating PDF Report for ${exportMonth} ${selectedYear}...`);
    // Logic to generate PDF would go here
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* --- HEADER & CONTROLS --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">MIS Report Generation</h1>
          <p className="text-sm text-gray-500">Monitoring & Performance Tracking (FY {selectedYear})</p>
        </div>
        
        {/* Export Controls */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
          
          {/* Year Select */}
          <div className="relative">
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm py-2 px-3 pr-8 rounded-lg focus:outline-none focus:border-green-500"
            >
              <option>2024-2025</option>
              <option>2023-2024</option>
            </select>
            <Calendar size={14} className="absolute right-2.5 top-3 text-gray-500 pointer-events-none" />
          </div>

          <div className="h-6 w-px bg-gray-300 mx-1"></div>

          {/* Month Select for Export */}
          <span className="text-xs font-semibold text-gray-500">Export:</span>
          <select 
            value={exportMonth}
            onChange={(e) => setExportMonth(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm py-2 px-3 rounded-lg focus:outline-none focus:border-green-500 cursor-pointer"
          >
            {monthlyData.map((d) => (
              <option key={d.month} value={d.month}>{d.month}</option>
            ))}
          </select>

          {/* Export Button */}
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-[#00a851] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <FileText size={16} />
            Download PDF
          </button>
        </div>
      </div>

      {/* --- KPI SUMMARY (Scaled for District) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Utilized */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Utilized</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{totalUtilized}L</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <IndianRupee size={20} />
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(totalUtilized/totalDistrictBudget)*100}%` }}></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">of ₹{totalDistrictBudget}L Total Budget</p>
        </div>

        {/* Remaining */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Funds Remaining</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{remainingFunds}L</h3>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <PieIcon size={20} />
            </div>
          </div>
          <p className="text-xs text-amber-600 font-medium mt-4">Available for Disbursement</p>
        </div>

        {/* Verified */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Verified Users</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalVerified}</h3>
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <p className="text-xs text-green-600 font-medium mt-4">+12% vs last month</p>
        </div>

        {/* REPLACED: Rejection Rate (Quality Control) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Rejection Rate</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">12.5%</h3>
            </div>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertCircle size={20} />
            </div>
          </div>
          {/* Progress bar showing the "Bad" percentage */}
          <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '12.5%' }}></div>
          </div>
           <p className="text-xs text-red-600 font-medium mt-2">Top Reason: Doc Mismatch</p>
        </div>
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: MONTHLY FUND UTILIZATION (Adjusted Scale 0-10L) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Monthly Fund Utilization (₹ Lakhs)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} unit="L" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f3f4f6' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="utilized" name="Utilized Amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
                <Bar dataKey="allocated" name="Monthly Limit" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: BENEFICIARY VERIFICATION */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Beneficiaries Verified (Monthly)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00a851" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00a851" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Area 
                  type="monotone" 
                  dataKey="verified" 
                  name="Verified Beneficiaries" 
                  stroke="#00a851" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVerified)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MISReport;
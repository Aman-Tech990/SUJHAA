import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  Users,
  Wallet,
  TrendingUp,
  Calendar,
  Landmark // Icon for State Fund/Bank
} from 'lucide-react';

// --- MOCK DATA ---
const officerData = {
  // name: "Rajesh Kumar",
  // state: "Odisha",
  // Mocking financial totals for the cards
  total_allocation_cr: 22.5,
  total_utilized_cr: 15.9
};

const districtPerformance = [
  { district: 'Khordha', allocation: 500, utilized: 420, beneficiaries: 1200 },
  { district: 'Cuttack', allocation: 450, utilized: 380, beneficiaries: 950 },
  { district: 'Puri', allocation: 300, utilized: 290, beneficiaries: 800 },
  { district: 'Ganjam', allocation: 600, utilized: 550, beneficiaries: 1500 },
  { district: 'Sambalpur', allocation: 400, utilized: 150, beneficiaries: 600 },
  { district: 'Balasore', allocation: 350, utilized: 300, beneficiaries: 700 },
  { district: 'Rourkela', allocation: 200, utilized: 180, beneficiaries: 400 },
];


const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const user = JSON.parse(localStorage.getItem("sujhaa-user"));

const StateDashboard = () => {

  // 1. Calculate Remaining Balance
  const remainingBalance = (officerData.total_allocation_cr - officerData.total_utilized_cr).toFixed(1);

  // 2. Logic: Filter Top 5 Districts by Utilization
  const top5Districts = useMemo(() => {
    return [...districtPerformance]
      .sort((a, b) => b.utilized - a.utilized)
      .slice(0, 5);
  }, []);

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-800">

      {/* --- WELCOME SECTION --- */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user.name} 
        </h1>
        <div className="flex items-center gap-2 text-slate-500 mt-1 text-sm">
          <span>Overview for <span className="font-semibold text-slate-700">{user.state}</span></span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar size={14} /> {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* --- KPI CARDS (Updated) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        {/* 1. Total Allocation */}
        <KPICard
          title="Total Fund Allocated"
          value={`₹ ${officerData.total_allocation_cr} Cr`}
          icon={<Wallet className="text-blue-600" />}
          trend="FY 2024-25 Budget"
          trendColor="text-slate-500"
        />

        {/* 2. Fund Utilized */}
        <KPICard
          title="Fund Utilized"
          value={`₹ ${officerData.total_utilized_cr} Cr`}
          icon={<TrendingUp className="text-green-600" />}
          trend="70.6% Utilization Rate"
          trendColor="text-green-600"
        />

        {/* 3. NEW: Remaining Balance */}
        <KPICard
          title="Remaining State Fund"
          value={`₹ ${remainingBalance} Cr`}
          icon={<Landmark className="text-purple-600" />}
          trend="Available for Disbursement"
          trendColor="text-purple-600"
        />

        {/* 4. Beneficiaries */}
        <KPICard
          title="Total Beneficiaries"
          value="5,050"
          icon={<Users className="text-orange-600" />}
          trend="+540 this month"
          trendColor="text-green-600"
        />
      </div>

      {/* --- MAIN CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Chart 1: Top 5 Districts by Fund */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Top 5 Districts: Fund Utilization</h3>
            <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">High Performance</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top5Districts} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="district" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="allocation" fill="#6366f1" name="Allocated (Lakhs)" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="utilized" fill="#10b981" name="Utilized (Lakhs)" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top 5 Districts by Beneficiaries */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Top 5 Districts: Beneficiary Count</h3>
            <span className="text-xs font-medium px-2 py-1 bg-orange-50 text-orange-700 rounded-full">By Volume</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={top5Districts} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="district" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Area type="monotone" dataKey="beneficiaries" stroke="#f59e0b" fillOpacity={1} fill="url(#colorBen)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


    </div>
  );
};

// Helper Component for KPI Cards
const KPICard = ({ title, value, icon, trend, trendColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-slate-100 rounded-lg">
        {icon}
      </div>
    </div>
    <p className={`text-xs font-medium ${trendColor}`}>{trend}</p>
  </div>
);

export default StateDashboard;
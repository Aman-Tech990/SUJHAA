import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Users, Wallet, Building2, TrendingUp, MapPin, 
  LayoutGrid, ArrowRight, IndianRupee, Activity 
} from 'lucide-react';

// --- CONFIGURATION & COLORS ---
const COLORS = {
  skill: '#3b82f6', // Blue
  infra: '#10b981', // Emerald
  income: '#f59e0b', // Amber
  bg: '#f8fafc',
  card: '#ffffff'
};

// --- MOCK DATA: PM-AJAY GIA SPECIFIC ---

// 1. National Level Aggregates
const KPI_DATA = [
  { title: "Total GIA Released", value: "4,250", unit: "Cr", icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
  { title: "Total Beneficiaries", value: "8.5", unit: "Lakh", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  { title: "Assets Created", value: "12,450", unit: "Units", icon: Building2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { title: "Avg. Utilization", value: "92.4", unit: "%", icon: Activity, color: "text-amber-600", bg: "bg-amber-50" },
];

// 2. State Specific Data (Simulating API response)
// Utilization > 80 is High (Green), 60-80 Medium (Amber), < 60 Low (Red)
const STATE_DATA = [
  { 
    id: 'UP', name: 'Uttar Pradesh', utilization: 88, beneficiaries: 125000, allocated: 1200, utilized: 1056,
    breakdown: [
      { name: 'Skill Dev', value: 400, color: COLORS.skill },
      { name: 'Infrastructure', value: 350, color: COLORS.infra },
      { name: 'Income Gen', value: 306, color: COLORS.income }
    ]
  },
  { 
    id: 'MH', name: 'Maharashtra', utilization: 78, beneficiaries: 98000, allocated: 950, utilized: 741,
    breakdown: [
      { name: 'Skill Dev', value: 300, color: COLORS.skill },
      { name: 'Infrastructure', value: 200, color: COLORS.infra },
      { name: 'Income Gen', value: 241, color: COLORS.income }
    ]
  },
  { 
    id: 'MP', name: 'Madhya Pradesh', utilization: 92, beneficiaries: 110000, allocated: 750, utilized: 690,
    breakdown: [
      { name: 'Skill Dev', value: 250, color: COLORS.skill },
      { name: 'Infrastructure', value: 250, color: COLORS.infra },
      { name: 'Income Gen', value: 190, color: COLORS.income }
    ]
  },
  { 
    id: 'BR', name: 'Bihar', utilization: 65, beneficiaries: 85000, allocated: 800, utilized: 520,
    breakdown: [
      { name: 'Skill Dev', value: 200, color: COLORS.skill },
      { name: 'Infrastructure', value: 200, color: COLORS.infra },
      { name: 'Income Gen', value: 120, color: COLORS.income }
    ]
  },
  { 
    id: 'RJ', name: 'Rajasthan', utilization: 55, beneficiaries: 72000, allocated: 500, utilized: 275,
    breakdown: [
      { name: 'Skill Dev', value: 100, color: COLORS.skill },
      { name: 'Infrastructure', value: 100, color: COLORS.infra },
      { name: 'Income Gen', value: 75, color: COLORS.income }
    ]
  },
  { 
    id: 'TN', name: 'Tamil Nadu', utilization: 72, beneficiaries: 65000, allocated: 600, utilized: 432,
    breakdown: [
      { name: 'Skill Dev', value: 200, color: COLORS.skill },
      { name: 'Infrastructure', value: 132, color: COLORS.infra },
      { name: 'Income Gen', value: 100, color: COLORS.income }
    ]
  },
  { 
    id: 'KA', name: 'Karnataka', utilization: 85, beneficiaries: 55000, allocated: 450, utilized: 382,
    breakdown: [
      { name: 'Skill Dev', value: 150, color: COLORS.skill },
      { name: 'Infrastructure', value: 150, color: COLORS.infra },
      { name: 'Income Gen', value: 82, color: COLORS.income }
    ]
  },
  { 
    id: 'WB', name: 'West Bengal', utilization: 45, beneficiaries: 45000, allocated: 400, utilized: 180,
    breakdown: [
      { name: 'Skill Dev', value: 80, color: COLORS.skill },
      { name: 'Infrastructure', value: 50, color: COLORS.infra },
      { name: 'Income Gen', value: 50, color: COLORS.income }
    ]
  },
];

// --- SUB-COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

// New Design: A visual "Heatmap Grid" instead of a geo-map
const StateHeatmapGrid = ({ states, activeState, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {states.map((state) => {
        // Determine color intensity based on utilization
        let intensityClass = 'bg-rose-50 border-rose-200 hover:border-rose-400';
        let barColor = 'bg-rose-500';
        if (state.utilization > 80) {
          intensityClass = 'bg-emerald-50 border-emerald-200 hover:border-emerald-400';
          barColor = 'bg-emerald-500';
        } else if (state.utilization > 60) {
          intensityClass = 'bg-amber-50 border-amber-200 hover:border-amber-400';
          barColor = 'bg-amber-500';
        }

        const isActive = activeState?.id === state.id;

        return (
          <button
            key={state.id}
            onClick={() => onSelect(state)}
            className={`relative p-3 rounded-lg border text-left transition-all duration-200
              ${isActive ? 'ring-2 ring-blue-600 shadow-md transform scale-[1.02]' : ''}
              ${intensityClass} hover:shadow-sm
            `}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-slate-700 text-sm">{state.name}</span>
              {isActive && <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />}
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Progress</span>
                <span className="font-medium text-slate-700">{state.utilization}%</span>
              </div>
              <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-slate-100">
                <div 
                  className={`h-full rounded-full ${barColor}`} 
                  style={{ width: `${state.utilization}%` }} 
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

// The Detail Panel (Right Side)
const StateInspector = ({ state }) => {
  if (!state) return (
    <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
      <MapPin size={48} className="mb-4 opacity-20" />
      <p>Select a state from the grid to view breakdown.</p>
    </div>
  );

  return (
    <div className="h-full animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{state.name}</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            GIA Beneficiary Status
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase font-semibold">Utilization Score</p>
          <p className={`text-2xl font-bold ${state.utilization > 80 ? 'text-emerald-600' : state.utilization > 60 ? 'text-amber-600' : 'text-rose-600'}`}>
            {state.utilization}%
          </p>
        </div>
      </div>

      {/* 3 Main Metrics for this State */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-[10px] uppercase text-slate-500 font-bold">Allocated</p>
          <p className="text-lg font-bold text-slate-800">₹{state.allocated}<span className="text-xs font-normal text-slate-500">Cr</span></p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-[10px] uppercase text-slate-500 font-bold">Utilized</p>
          <p className="text-lg font-bold text-slate-800">₹{state.utilized}<span className="text-xs font-normal text-slate-500">Cr</span></p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-[10px] uppercase text-slate-500 font-bold">Beneficiaries</p>
          <p className="text-lg font-bold text-slate-800">{(state.beneficiaries/1000).toFixed(1)}<span className="text-xs font-normal text-slate-500">k</span></p>
        </div>
      </div>

      {/* Component Breakdown Chart */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <LayoutGrid size={16} /> Component Breakdown (₹ Cr)
        </h3>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={state.breakdown} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: '#64748b'}} 
                width={80}
              />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                {state.breakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="text-xs text-slate-400 italic border-t border-slate-100 pt-3">
        * Data represents GIA funds exclusively. Does not include administrative costs.
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD ---

export default function PMAJAYDashboard() {
  const [selectedState, setSelectedState] = useState(STATE_DATA[0]); // Default to first state

  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-6 font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">PM-AJAY Grant-in-Aid</h1>
        <p className="text-slate-500 text-sm">Monitoring Skill Dev, Infrastructure & Income Generation Components</p>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {KPI_DATA.map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-300 transition-colors">
            <div className={`p-3 rounded-lg ${kpi.bg}`}>
              <kpi.icon className={kpi.color} size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{kpi.title}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">{kpi.value}</span>
                <span className="text-sm text-slate-400 font-medium">{kpi.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN SPLIT VIEW: MAP (GRID) vs DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* LEFT: The "Map" (Interactive Grid) - Takes 7 Cols */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin size={20} className="text-blue-600"/> State Performance Grid
              </h2>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> High</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Med</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Low</span>
              </div>
            </div>
            
            <StateHeatmapGrid 
              states={STATE_DATA} 
              activeState={selectedState} 
              onSelect={setSelectedState} 
            />
          </Card>

          {/* Component Trends Chart (Bottom Left) */}
          <Card>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Component-wise Fund Release Trends</h2>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                    { month: 'Jan', skill: 40, infra: 24, income: 24 },
                    { month: 'Feb', skill: 30, infra: 13, income: 22 },
                    { month: 'Mar', skill: 20, infra: 98, income: 22 },
                    { month: 'Apr', skill: 27, infra: 39, income: 20 },
                    { month: 'May', skill: 18, infra: 48, income: 21 },
                    { month: 'Jun', skill: 23, infra: 38, income: 25 },
                  ]} 
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSkill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.skill} stopOpacity={0.1}/>
                      <stop offset="95%" stopColor={COLORS.skill} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInfra" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.infra} stopOpacity={0.1}/>
                      <stop offset="95%" stopColor={COLORS.infra} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                  <Area type="monotone" dataKey="skill" stackId="1" stroke={COLORS.skill} fill="url(#colorSkill)" name="Skill Dev" />
                  <Area type="monotone" dataKey="infra" stackId="1" stroke={COLORS.infra} fill="url(#colorInfra)" name="Infrastructure" />
                  <Area type="monotone" dataKey="income" stackId="1" stroke={COLORS.income} fill={COLORS.income} fillOpacity={0.3} name="Income Gen" />
                  <Legend iconType="circle" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* RIGHT: State Dossier (Inspector) - Takes 5 Cols */}
        <div className="lg:col-span-4">
          <Card className="h-full border-t-4 border-t-blue-500 sticky top-6">
            <StateInspector state={selectedState} />
          </Card>
        </div>

      </div>
    </div>
  );
}
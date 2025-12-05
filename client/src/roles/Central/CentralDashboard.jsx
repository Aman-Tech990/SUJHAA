import React, { useState, useEffect, useRef } from "react";
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
  Area,
  Cell,
} from "recharts";
import {
  Users,
  Wallet,
  Building2,
  Activity,
  MapPin,
  LayoutGrid,
  CheckCircle,
  XCircle,
  Loader2,
  ClipboardList,
  MessageCircle,
  Send,
} from "lucide-react";

// --- CONFIGURATION & COLORS ---
const COLORS = {
  skill: "#3b82f6", // Blue
  infra: "#10b981", // Emerald
  income: "#f59e0b", // Amber
};

const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// --- BASE STATE DATA (SIMULATED BACKEND SNAPSHOT) ---
const STATE_DATA_INITIAL = [
  {
    id: "UP",
    name: "Uttar Pradesh",
    utilization: 88,
    beneficiaries: 125000,
    allocated: 1200,
    utilized: 1056,
    breakdown: [
      { name: "Skill Dev", value: 400, color: COLORS.skill },
      { name: "Infrastructure", value: 350, color: COLORS.infra },
      { name: "Income Gen", value: 306, color: COLORS.income },
    ],
  },
  {
    id: "MH",
    name: "Maharashtra",
    utilization: 78,
    beneficiaries: 98000,
    allocated: 950,
    utilized: 741,
    breakdown: [
      { name: "Skill Dev", value: 300, color: COLORS.skill },
      { name: "Infrastructure", value: 200, color: COLORS.infra },
      { name: "Income Gen", value: 241, color: COLORS.income },
    ],
  },
  {
    id: "MP",
    name: "Madhya Pradesh",
    utilization: 92,
    beneficiaries: 110000,
    allocated: 750,
    utilized: 690,
    breakdown: [
      { name: "Skill Dev", value: 250, color: COLORS.skill },
      { name: "Infrastructure", value: 250, color: COLORS.infra },
      { name: "Income Gen", value: 190, color: COLORS.income },
    ],
  },
  {
    id: "BR",
    name: "Bihar",
    utilization: 65,
    beneficiaries: 85000,
    allocated: 800,
    utilized: 520,
    breakdown: [
      { name: "Skill Dev", value: 200, color: COLORS.skill },
      { name: "Infrastructure", value: 200, color: COLORS.infra },
      { name: "Income Gen", value: 120, color: COLORS.income },
    ],
  },
  {
    id: "RJ",
    name: "Rajasthan",
    utilization: 55,
    beneficiaries: 72000,
    allocated: 500,
    utilized: 275,
    breakdown: [
      { name: "Skill Dev", value: 100, color: COLORS.skill },
      { name: "Infrastructure", value: 100, color: COLORS.infra },
      { name: "Income Gen", value: 75, color: COLORS.income },
    ],
  },
  {
    id: "TN",
    name: "Tamil Nadu",
    utilization: 72,
    beneficiaries: 65000,
    allocated: 600,
    utilized: 432,
    breakdown: [
      { name: "Skill Dev", value: 200, color: COLORS.skill },
      { name: "Infrastructure", value: 132, color: COLORS.infra },
      { name: "Income Gen", value: 100, color: COLORS.income },
    ],
  },
  {
    id: "KA",
    name: "Karnataka",
    utilization: 85,
    beneficiaries: 55000,
    allocated: 450,
    utilized: 382,
    breakdown: [
      { name: "Skill Dev", value: 150, color: COLORS.skill },
      { name: "Infrastructure", value: 150, color: COLORS.infra },
      { name: "Income Gen", value: 82, color: COLORS.income },
    ],
  },
  {
    id: "WB",
    name: "West Bengal",
    utilization: 45,
    beneficiaries: 45000,
    allocated: 400,
    utilized: 180,
    breakdown: [
      { name: "Skill Dev", value: 80, color: COLORS.skill },
      { name: "Infrastructure", value: 50, color: COLORS.infra },
      { name: "Income Gen", value: 50, color: COLORS.income },
    ],
  },
  {
    id: "GJ",
    name: "Gujarat",
    utilization: 82,
    beneficiaries: 60000,
    allocated: 650,
    utilized: 533,
    breakdown: [
      { name: "Skill Dev", value: 210, color: COLORS.skill },
      { name: "Infrastructure", value: 220, color: COLORS.infra },
      { name: "Income Gen", value: 200, color: COLORS.income },
    ],
  },
  {
    id: "OD",
    name: "Odisha",
    utilization: 74,
    beneficiaries: 58000,
    allocated: 580,
    utilized: 429,
    breakdown: [
      { name: "Skill Dev", value: 190, color: COLORS.skill },
      { name: "Infrastructure", value: 200, color: COLORS.infra },
      { name: "Income Gen", value: 160, color: COLORS.income },
    ],
  },
  {
    id: "AS",
    name: "Assam",
    utilization: 68,
    beneficiaries: 42000,
    allocated: 420,
    utilized: 286,
    breakdown: [
      { name: "Skill Dev", value: 130, color: COLORS.skill },
      { name: "Infrastructure", value: 150, color: COLORS.infra },
      { name: "Income Gen", value: 120, color: COLORS.income },
    ],
  },
  {
    id: "KL",
    name: "Kerala",
    utilization: 90,
    beneficiaries: 38000,
    allocated: 360,
    utilized: 324,
    breakdown: [
      { name: "Skill Dev", value: 140, color: COLORS.skill },
      { name: "Infrastructure", value: 130, color: COLORS.infra },
      { name: "Income Gen", value: 90, color: COLORS.income },
    ],
  },
  {
    id: "HR",
    name: "Haryana",
    utilization: 79,
    beneficiaries: 30000,
    allocated: 330,
    utilized: 261,
    breakdown: [
      { name: "Skill Dev", value: 110, color: COLORS.skill },
      { name: "Infrastructure", value: 120, color: COLORS.infra },
      { name: "Income Gen", value: 90, color: COLORS.income },
    ],
  },
  {
    id: "PB",
    name: "Punjab",
    utilization: 83,
    beneficiaries: 29000,
    allocated: 320,
    utilized: 266,
    breakdown: [
      { name: "Skill Dev", value: 115, color: COLORS.skill },
      { name: "Infrastructure", value: 115, color: COLORS.infra },
      { name: "Income Gen", value: 90, color: COLORS.income },
    ],
  },
  {
    id: "UK",
    name: "Uttarakhand",
    utilization: 76,
    beneficiaries: 22000,
    allocated: 260,
    utilized: 198,
    breakdown: [
      { name: "Skill Dev", value: 90, color: COLORS.skill },
      { name: "Infrastructure", value: 90, color: COLORS.infra },
      { name: "Income Gen", value: 70, color: COLORS.income },
    ],
  },
  {
    id: "HP",
    name: "Himachal Pradesh",
    utilization: 88,
    beneficiaries: 18000,
    allocated: 210,
    utilized: 185,
    breakdown: [
      { name: "Skill Dev", value: 80, color: COLORS.skill },
      { name: "Infrastructure", value: 80, color: COLORS.infra },
      { name: "Income Gen", value: 50, color: COLORS.income },
    ],
  },
  {
    id: "JH",
    name: "Jharkhand",
    utilization: 62,
    beneficiaries: 39000,
    allocated: 370,
    utilized: 229,
    breakdown: [
      { name: "Skill Dev", value: 130, color: COLORS.skill },
      { name: "Infrastructure", value: 130, color: COLORS.infra },
      { name: "Income Gen", value: 90, color: COLORS.income },
    ],
  },
  {
    id: "CH",
    name: "Chhattisgarh",
    utilization: 67,
    beneficiaries: 41000,
    allocated: 380,
    utilized: 255,
    breakdown: [
      { name: "Skill Dev", value: 135, color: COLORS.skill },
      { name: "Infrastructure", value: 135, color: COLORS.infra },
      { name: "Income Gen", value: 100, color: COLORS.income },
    ],
  },
  {
    id: "TG",
    name: "Telangana",
    utilization: 84,
    beneficiaries: 36000,
    allocated: 340,
    utilized: 286,
    breakdown: [
      { name: "Skill Dev", value: 120, color: COLORS.skill },
      { name: "Infrastructure", value: 120, color: COLORS.infra },
      { name: "Income Gen", value: 100, color: COLORS.income },
    ],
  },
  {
    id: "AP",
    name: "Andhra Pradesh",
    utilization: 80,
    beneficiaries: 52000,
    allocated: 520,
    utilized: 416,
    breakdown: [
      { name: "Skill Dev", value: 180, color: COLORS.skill },
      { name: "Infrastructure", value: 190, color: COLORS.infra },
      { name: "Income Gen", value: 150, color: COLORS.income },
    ],
  },
  {
    id: "TR",
    name: "Tripura",
    utilization: 70,
    beneficiaries: 15000,
    allocated: 160,
    utilized: 112,
    breakdown: [
      { name: "Skill Dev", value: 55, color: COLORS.skill },
      { name: "Infrastructure", value: 55, color: COLORS.infra },
      { name: "Income Gen", value: 50, color: COLORS.income },
    ],
  },
  {
    id: "MN",
    name: "Manipur",
    utilization: 64,
    beneficiaries: 12000,
    allocated: 140,
    utilized: 90,
    breakdown: [
      { name: "Skill Dev", value: 45, color: COLORS.skill },
      { name: "Infrastructure", value: 50, color: COLORS.infra },
      { name: "Income Gen", value: 45, color: COLORS.income },
    ],
  },
  {
    id: "NL",
    name: "Nagaland",
    utilization: 60,
    beneficiaries: 11000,
    allocated: 130,
    utilized: 78,
    breakdown: [
      { name: "Skill Dev", value: 40, color: COLORS.skill },
      { name: "Infrastructure", value: 45, color: COLORS.infra },
      { name: "Income Gen", value: 45, color: COLORS.income },
    ],
  },
  {
    id: "GA",
    name: "Goa",
    utilization: 93,
    beneficiaries: 6000,
    allocated: 80,
    utilized: 74,
    breakdown: [
      { name: "Skill Dev", value: 30, color: COLORS.skill },
      { name: "Infrastructure", value: 30, color: COLORS.infra },
      { name: "Income Gen", value: 20, color: COLORS.income },
    ],
  },
  {
    id: "JK",
    name: "Jammu & Kashmir",
    utilization: 69,
    beneficiaries: 26000,
    allocated: 280,
    utilized: 193,
    breakdown: [
      { name: "Skill Dev", value: 95, color: COLORS.skill },
      { name: "Infrastructure", value: 95, color: COLORS.infra },
      { name: "Income Gen", value: 90, color: COLORS.income },
    ],
  },
  {
    id: "AR",
    name: "Arunachal Pradesh",
    utilization: 66,
    beneficiaries: 9000,
    allocated: 120,
    utilized: 79,
    breakdown: [
      { name: "Skill Dev", value: 40, color: COLORS.skill },
      { name: "Infrastructure", value: 45, color: COLORS.infra },
      { name: "Income Gen", value: 35, color: COLORS.income },
    ],
  },
  {
    id: "ML",
    name: "Meghalaya",
    utilization: 72,
    beneficiaries: 10000,
    allocated: 130,
    utilized: 94,
    breakdown: [
      { name: "Skill Dev", value: 45, color: COLORS.skill },
      { name: "Infrastructure", value: 50, color: COLORS.infra },
      { name: "Income Gen", value: 35, color: COLORS.income },
    ],
  },
  {
    id: "MZ",
    name: "Mizoram",
    utilization: 75,
    beneficiaries: 8000,
    allocated: 110,
    utilized: 83,
    breakdown: [
      { name: "Skill Dev", value: 40, color: COLORS.skill },
      { name: "Infrastructure", value: 40, color: COLORS.infra },
      { name: "Income Gen", value: 30, color: COLORS.income },
    ],
  },
  {
    id: "SK",
    name: "Sikkim",
    utilization: 88,
    beneficiaries: 5000,
    allocated: 70,
    utilized: 62,
    breakdown: [
      { name: "Skill Dev", value: 25, color: COLORS.skill },
      { name: "Infrastructure", value: 25, color: COLORS.infra },
      { name: "Income Gen", value: 20, color: COLORS.income },
    ],
  },
];

// Sample district mapping (for AAP preview realism)
const STATE_DISTRICTS = {
  UP: ["Lucknow", "Varanasi", "Prayagraj"],
  MH: ["Pune", "Nagpur", "Nashik"],
  MP: ["Bhopal", "Indore", "Gwalior"],
  BR: ["Patna", "Gaya", "Muzaffarpur"],
  RJ: ["Jaipur", "Udaipur", "Jodhpur"],
  TN: ["Chennai", "Coimbatore", "Madurai"],
  KA: ["Bengaluru Urban", "Mysuru", "Belagavi"],
  WB: ["Kolkata", "Howrah", "Darjeeling"],
  GJ: ["Ahmedabad", "Surat", "Rajkot"],
  OD: ["Khordha", "Ganjam", "Sambalpur"],
  AS: ["Guwahati", "Dibrugarh", "Silchar"],
  KL: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
  HR: ["Gurugram", "Faridabad", "Hisar"],
  PB: ["Amritsar", "Ludhiana", "Jalandhar"],
  UK: ["Dehradun", "Haridwar", "Nainital"],
  HP: ["Shimla", "Kangra", "Mandi"],
  JH: ["Ranchi", "Jamshedpur", "Dhanbad"],
  CH: ["Raipur", "Bilaspur", "Durg"],
  TG: ["Hyderabad", "Warangal", "Nizamabad"],
  AP: ["Vishakhapatnam", "Guntur", "Nellore"],
  TR: ["Agartala", "Khowai"],
  MN: ["Imphal East", "Imphal West"],
  NL: ["Kohima", "Dimapur"],
  GA: ["North Goa", "South Goa"],
  JK: ["Srinagar", "Jammu"],
  AR: ["Itanagar", "Tawang"],
  ML: ["Shillong", "Tura"],
  MZ: ["Aizawl", "Lungleh"],
  SK: ["Gangtok", "Namchi"],
};

// --- INITIAL AAP LIST (ALL STATES HAVE SAMPLE AAP + CHAT THREAD) ---
const buildInitialAAPList = () => {
  const splits = [
    { incomeGen: 40, skillDev: 35, infraSupport: 25 },
    { incomeGen: 35, skillDev: 40, infraSupport: 25 },
    { incomeGen: 45, skillDev: 30, infraSupport: 25 },
  ];

  const years = ["2024-25", "2025-26"];

  return STATE_DATA_INITIAL.map((s, idx) => {
    const split = splits[idx % splits.length];
    const year = years[idx % years.length];

    return {
      stateId: s.id,
      stateName: s.name,
      year,
      budgetCr: Math.round(s.allocated * 0.9),
      components: split,
      priorityDistricts: STATE_DISTRICTS[s.id] || ["Key Aspirational Districts"],
      prevUtilization: s.utilization,
      status: "PENDING", // PENDING | UNDER_REVIEW | APPROVED | RETURNED
      lastAction: "AAP received from State. Awaiting central verification.",
      remarks: "",
      submittedAt: new Date(
        Date.now() - randInt(2, 15) * 24 * 60 * 60 * 1000
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      decidedAt: null,
      // WhatsApp-style chat thread
      messages: [
        {
          id: `INIT-${s.id}`,
          sender: "STATE",
          text: `Respected Central PM–AJAY Cell, kindly review ${s.name}'s Annual Action Plan for ${year}.`,
          at: new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    };
  });
};

// --- HELPERS TO COMPUTE NATIONAL KPI FROM STATE DATA ---
const computeKpis = (states) => {
  const totals = states.reduce(
    (acc, s) => {
      acc.beneficiaries += s.beneficiaries;
      acc.allocated += s.allocated;
      acc.utilized += s.utilized;
      return acc;
    },
    { beneficiaries: 0, allocated: 0, utilized: 0 }
  );

  const avgUtilization =
    totals.allocated > 0 ? (totals.utilized / totals.allocated) * 100 : 0;

  const assetsCreated = Math.round(totals.beneficiaries / 15); // just to look realistic

  return [
    {
      title: "Total Funds Utilized",
      value: totals.utilized.toLocaleString("en-IN"),
      unit: "Cr",
      icon: Wallet,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Beneficiaries",
      value: (totals.beneficiaries / 100000).toFixed(2),
      unit: "Cr",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Assets Created",
      value: assetsCreated.toLocaleString("en-IN"),
      unit: "Units",
      icon: Building2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Avg. Utilization",
      value: avgUtilization.toFixed(1),
      unit: "%",
      icon: Activity,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];
};

// --- SIMPLE CARD WRAPPER ---
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl border border-slate-200 shadow-sm p-6 ${className}`}
  >
    {children}
  </div>
);

// --- STATUS BADGE FOR AAP ---
const AAPStatusBadge = ({ status }) => {
  let text = "";
  let cls = "";

  switch (status) {
    case "PENDING":
      text = "Pending Review";
      cls = "bg-amber-50 text-amber-700 border border-amber-200";
      break;
    case "UNDER_REVIEW":
      text = "Under Verification";
      cls = "bg-blue-50 text-blue-700 border border-blue-200";
      break;
    case "APPROVED":
      text = "Approved";
      cls = "bg-emerald-50 text-emerald-700 border border-emerald-200";
      break;
    case "RETURNED":
      text = "Returned for Changes";
      cls = "bg-rose-50 text-rose-700 border border-rose-200";
      break;
    default:
      text = status;
      cls = "bg-slate-50 text-slate-600 border border-slate-200";
  }

  return (
    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${cls}`}>
      {text}
    </span>
  );
};

// --- STATE HEATMAP GRID ---
const StateHeatmapGrid = ({ states, activeStateId, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {states.map((state) => {
        let intensityClass =
          "bg-rose-50 border-rose-200 hover:border-rose-400";
        let barColor = "bg-rose-500";
        if (state.utilization > 80) {
          intensityClass =
            "bg-emerald-50 border-emerald-200 hover:border-emerald-400";
          barColor = "bg-emerald-500";
        } else if (state.utilization > 60) {
          intensityClass =
            "bg-amber-50 border-amber-200 hover:border-amber-400";
          barColor = "bg-amber-500";
        }

        const isActive = activeStateId === state.id;

        return (
          <button
            key={state.id}
            onClick={() => onSelect(state.id)}
            className={`relative p-3 rounded-lg border text-left transition-all duration-200
              ${isActive ? "ring-2 ring-blue-600 shadow-md scale-[1.02]" : ""}
              ${intensityClass} hover:shadow-sm
            `}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-slate-700 text-sm">
                {state.name}
              </span>
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Progress</span>
                <span className="font-medium text-slate-700">
                  {state.utilization}%
                </span>
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

// --- STATE DETAIL INSPECTOR ---
const StateInspector = ({ state }) => {
  if (!state)
    return (
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
          <p className="text-xs text-slate-500 uppercase font-semibold">
            Utilization Score
          </p>
          <p
            className={`text-2xl font-bold ${state.utilization > 80
                ? "text-emerald-600"
                : state.utilization > 60
                  ? "text-amber-600"
                  : "text-rose-600"
              }`}
          >
            {state.utilization}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-[10px] uppercase text-slate-500 font-bold">
            Allocated
          </p>
          <p className="text-lg font-bold text-slate-800">
            ₹{state.allocated}
            <span className="text-xs font-normal text-slate-500"> Cr</span>
          </p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-[10px] uppercase text-slate-500 font-bold">
            Utilized
          </p>
          <p className="text-lg font-bold text-slate-800">
            ₹{state.utilized}
            <span className="text-xs font-normal text-slate-500"> Cr</span>
          </p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-[10px] uppercase text-slate-500 font-bold">
            Beneficiaries
          </p>
          <p className="text-lg font-bold text-slate-800">
            {(state.beneficiaries / 1000).toFixed(1)}
            <span className="text-xs font-normal text-slate-500"> k</span>
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <LayoutGrid size={16} /> Component Breakdown (₹ Cr)
        </h3>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={state.breakdown}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                width={80}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
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
        * Data represents GIA funds exclusively. Does not include administrative
        costs.
      </div>
    </div>
  );
};

// --- STATE-TO-STATE COMPARISON ---
const CompareStates = ({
  states,
  compareAId,
  compareBId,
  onChangeA,
  onChangeB,
}) => {
  const stateA = states.find((s) => s.id === compareAId);
  const stateB = states.find((s) => s.id === compareBId);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">
          State Comparison (Live)
        </h2>
        <span className="text-[10px] uppercase text-slate-400">
          Endpoint: GET /api/central/pmajay/state-comparison
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="space-y-1">
          <label className="text-xs text-slate-500 font-medium">
            State A
          </label>
          <select
            value={compareAId}
            onChange={(e) => onChangeA(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          >
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-500 font-medium">
            State B
          </label>
          <select
            value={compareBId}
            onChange={(e) => onChangeB(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          >
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {stateA && stateB && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <p className="uppercase text-slate-400 font-semibold mb-2">
              Utilization %
            </p>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-700">{stateA.name}</span>
              <span
                className={`font-bold ${stateA.utilization >= stateB.utilization
                    ? "text-emerald-600"
                    : "text-slate-500"
                  }`}
              >
                {stateA.utilization}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mb-2 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${stateA.utilization}%` }}
              />
            </div>

            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-700">{stateB.name}</span>
              <span
                className={`font-bold ${stateB.utilization > stateA.utilization
                    ? "text-emerald-600"
                    : "text-slate-500"
                  }`}
              >
                {stateB.utilization}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${stateB.utilization}%` }}
              />
            </div>
          </div>

          <div>
            <p className="uppercase text-slate-400 font-semibold mb-2">
              Beneficiaries (k)
            </p>
            <p className="mb-1 text-slate-700">
              {stateA.name}:{" "}
              <span className="font-bold">
                {(stateA.beneficiaries / 1000).toFixed(1)}k
              </span>
            </p>
            <p className="mb-1 text-slate-700">
              {stateB.name}:{" "}
              <span className="font-bold">
                {(stateB.beneficiaries / 1000).toFixed(1)}k
              </span>
            </p>
          </div>

          <div>
            <p className="uppercase text-slate-400 font-semibold mb-2">
              Funds Utilized (₹ Cr)
            </p>
            <p className="mb-1 text-slate-700">
              {stateA.name}:{" "}
              <span className="font-bold">₹{stateA.utilized}</span>
            </p>
            <p className="mb-1 text-slate-700">
              {stateB.name}:{" "}
              <span className="font-bold">₹{stateB.utilized}</span>
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

// --- VALIDATION BLOCK SUBCOMPONENT ---
const AAPValidationBlock = ({ aap }) => {
  const totalPercent =
    aap.components.incomeGen +
    aap.components.skillDev +
    aap.components.infraSupport;

  const checks = [
    {
      label: "Component split sums to 100%",
      pass: totalPercent === 100,
    },
    {
      label: "Previous year utilization ≥ 60%",
      pass: aap.prevUtilization >= 60,
    },
    {
      label: "Proposed budget ≤ 120% of current GIA allocation (approx.)",
      pass: true, // keep visually passing for demo
    },
  ];

  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
      <p className="text-xs font-semibold text-slate-800 mb-2">
        Automated Validation Checks
      </p>
      <ul className="space-y-1">
        {checks.map((c, idx) => (
          <li
            key={idx}
            className={`flex items-start gap-2 text-[11px] ${c.pass ? "text-emerald-700" : "text-rose-700"
              }`}
          >
            {c.pass ? (
              <CheckCircle size={12} className="mt-[2px]" />
            ) : (
              <XCircle size={12} className="mt-[2px]" />
            )}
            <span>{c.label}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] text-slate-400">
        * These checks simulate rules used by Central PM–AJAY Cell during
        scrutiny of State AAPs. Final decision rests with the approving officer.
      </p>
    </div>
  );
};

// --- MAIN DASHBOARD ---
const CentralDashboard = () => {
  const [stateData, setStateData] = useState(STATE_DATA_INITIAL);
  const [selectedStateId, setSelectedStateId] = useState(
    STATE_DATA_INITIAL[0].id
  );
  const [kpis, setKpis] = useState(() => computeKpis(STATE_DATA_INITIAL));
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const [compareAId, setCompareAId] = useState("UP");
  const [compareBId, setCompareBId] = useState("BR");

  const selectedState = stateData.find((s) => s.id === selectedStateId);

  // AAP Inbox states
  const [aapList, setAapList] = useState(buildInitialAAPList);
  const [activeAAP, setActiveAAP] = useState(null);
  const [aapDetailLoading, setAapDetailLoading] = useState(false);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [remarksInput, setRemarksInput] = useState("");
  const [chatInput, setChatInput] = useState("");

  // --- LIVE DATA SIMULATION: looks like backend API polling ---
  useEffect(() => {
    const pollInterval = setInterval(() => {
      setIsSyncing(true);

      setTimeout(() => {
        setStateData((prev) => {
          const updated = prev.map((s) => {
            const deltaUtil = randInt(-3, 3);
            const newUtil = clamp(s.utilization + deltaUtil, 40, 95);

            const deltaBenefPercent = randInt(-2, 3); // -2% to +3%
            const newBenef = Math.max(
              8000,
              Math.round(s.beneficiaries * (1 + deltaBenefPercent / 100))
            );

            const newUtilized = Math.round((s.allocated * newUtil) / 100);

            return {
              ...s,
              utilization: newUtil,
              beneficiaries: newBenef,
              utilized: newUtilized,
            };
          });

          setKpis(computeKpis(updated));
          setLastUpdated(new Date());
          setIsSyncing(false);
          return updated;
        });
      }, randInt(300, 900));
    }, 8000);

    return () => clearInterval(pollInterval);
  }, []);

  const chatContainerRef = useRef(null);

  const selectedAAP = activeAAP
    ? aapList.find((a) => a.stateId === activeAAP.stateId)
    : null;

  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    if (!chatContainerRef.current) return;
    if (!selectedAAP || !selectedAAP.messages) return;
    chatContainerRef.current.scrollTop =
      chatContainerRef.current.scrollHeight;
  }, [selectedAAP?.messages?.length, activeAAP?.stateId]);

  // OPEN AAP DETAIL WITH FAKE BACKEND DELAY
  const openAAPDetail = (stateId) => {
    const target = aapList.find((a) => a.stateId === stateId);
    if (!target) return;

    setAapDetailLoading(true);
    setActiveAAP({ stateId });
    setChatInput("");

    setTimeout(() => {
      setAapList((prev) =>
        prev.map((a) =>
          a.stateId === stateId && a.status === "PENDING"
            ? {
              ...a,
              status: "UNDER_REVIEW",
              lastAction: "Central officer opened AAP for verification.",
            }
            : a
        )
      );
      setAapDetailLoading(false);
    }, randInt(500, 900));
  };

  // DECISION FLOW
  const applyDecision = (stateId, decisionStatus) => {
    if (!selectedAAP) return;
    const trimmedRemarks = remarksInput.trim();

    setDecisionLoading(true);

    setTimeout(() => {
      const nowStr = new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const label =
        decisionStatus === "APPROVED"
          ? "AAP approved for release of funds."
          : "AAP returned to State with remarks for modification.";

      setAapList((prev) =>
        prev.map((a) =>
          a.stateId === stateId
            ? {
              ...a,
              status: decisionStatus,
              lastAction: label,
              decidedAt: nowStr,
              remarks: trimmedRemarks || a.remarks,
            }
            : a
        )
      );

      setDecisionLoading(false);
      setRemarksInput("");
    }, randInt(800, 1300));
  };

  // CHAT SEND HANDLER (CENTRAL → STATE) + AUTO REPLY
  const handleSendMessage = (stateId) => {
    if (!selectedAAP) return;
    const text = chatInput.trim();
    if (!text) return;

    const timeNow = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const centralMsg = {
      id: `CENTRAL-${stateId}-${Date.now()}`,
      sender: "CENTRAL",
      text,
      at: timeNow,
    };

    // Push central message
    setAapList((prev) =>
      prev.map((a) =>
        a.stateId === stateId
          ? {
            ...a,
            messages: [...(a.messages || []), centralMsg],
            lastAction:
              "Central sent clarification to State (notified on State dashboard).",
          }
          : a
      )
    );

    setChatInput("");

    // Auto State reply (simulation)
    const autoReplies = [
      "Noted. We will revise the AAP and re-submit.",
      "Received. We will share district-wise breakup within 24 hours.",
      "Thank you. We will upload UCs and progress photos shortly.",
      "Acknowledged. Our State PM–AJAY Cell will incorporate these suggestions.",
    ];

    const replyText =
      autoReplies[Math.floor(Math.random() * autoReplies.length)];

    const delay = randInt(1500, 3000);

    setTimeout(() => {
      const replyMsg = {
        id: `STATE-${stateId}-${Date.now()}`,
        sender: "STATE",
        text: replyText,
        at: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setAapList((prev) =>
        prev.map((a) =>
          a.stateId === stateId
            ? {
              ...a,
              messages: [...(a.messages || []), replyMsg],
            }
            : a
        )
      );
    }, delay);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-6 font-sans text-slate-900">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            PM-AJAY Grant-in-Aid (Central Live MIS)
          </h1>
          <p className="text-slate-500 text-sm">
            Monitoring State-wise Skill Development, Infrastructure & Income
            Generation Components
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-1 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium ${isSyncing
                  ? "bg-amber-50 text-amber-700"
                  : "bg-emerald-50 text-emerald-700"
                }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${isSyncing
                    ? "bg-amber-500 animate-pulse"
                    : "bg-emerald-500"
                  }`}
              ></span>
              {isSyncing
                ? "Syncing with State PM-AJAY portals..."
                : "Connected · Live Snapshot"}
            </span>
          </div>
          <span className="text-slate-400">
            Last synced:{" "}
            {lastUpdated.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}{" "}
            IST · Auto-refresh every 8s
          </span>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-300 transition-colors"
          >
            <div className={`p-3 rounded-lg ${kpi.bg}`}>
              <kpi.icon className={kpi.color} size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">
                {kpi.title}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">
                  {kpi.value}
                </span>
                <span className="text-sm text-slate-400 font-medium">
                  {kpi.unit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* STATE GRID */}
          <Card className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin size={20} className="text-blue-600" /> State
                Performance Grid
              </h2>
              <div className="flex flex-col items-end gap-1">
                <div className="flex gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{" "}
                    High
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>{" "}
                    Medium
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>{" "}
                    Low
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Source: /api/central/pmajay/state-summary
                </span>
              </div>
            </div>

            <StateHeatmapGrid
              states={stateData}
              activeStateId={selectedStateId}
              onSelect={setSelectedStateId}
            />
          </Card>

          {/* TRENDS CHART */}
          <Card>
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Component-wise Fund Release Trends (Simulated)
            </h2>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { month: "Jan", skill: 40, infra: 24, income: 24 },
                    { month: "Feb", skill: 35, infra: 28, income: 22 },
                    { month: "Mar", skill: 45, infra: 32, income: 30 },
                    { month: "Apr", skill: 50, infra: 40, income: 36 },
                    { month: "May", skill: 55, infra: 44, income: 40 },
                    { month: "Jun", skill: 60, infra: 50, income: 45 },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorSkill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={COLORS.skill}
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.skill}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorInfra"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={COLORS.infra}
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.infra}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="skill"
                    stackId="1"
                    stroke={COLORS.skill}
                    fill="url(#colorSkill)"
                    name="Skill Dev"
                  />
                  <Area
                    type="monotone"
                    dataKey="infra"
                    stackId="1"
                    stroke={COLORS.infra}
                    fill="url(#colorInfra)"
                    name="Infrastructure"
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stackId="1"
                    stroke={COLORS.income}
                    fill={COLORS.income}
                    fillOpacity={0.3}
                    name="Income Gen"
                  />
                  <Legend iconType="circle" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* STATE COMPARISON */}
          <CompareStates
            states={stateData}
            compareAId={compareAId}
            compareBId={compareBId}
            onChangeA={setCompareAId}
            onChangeB={setCompareBId}
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-4">
          <Card className="h-full border-t-4 border-t-blue-500 sticky top-6">
            <StateInspector state={selectedState} />
          </Card>
        </div>
      </div>

      {/* ============================
          AAP INBOX & VERIFICATION PANEL
      ============================ */}
      <Card className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList size={18} className="text-indigo-600" />
              Annual Action Plan Inbox – All States
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Central PM–AJAY Cell view of all AAPs submitted by States for
              the current cycle.
            </p>
          </div>
          <span className="text-[10px] text-slate-400">
            Source: /api/central/pmajay/aap-inbox
          </span>
        </div>

        {/* SUMMARY STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <p className="text-[10px] text-slate-500 uppercase font-bold">
              Total States
            </p>
            <p className="text-lg font-bold text-slate-900">
              {aapList.length}
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <p className="text-[10px] text-slate-500 uppercase font-bold">
              Pending
            </p>
            <p className="text-lg font-bold text-amber-700">
              {aapList.filter((a) => a.status === "PENDING").length}
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <p className="text-[10px] text-slate-500 uppercase font-bold">
              Under Review
            </p>
            <p className="text-lg font-bold text-blue-700">
              {aapList.filter((a) => a.status === "UNDER_REVIEW").length}
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <p className="text-[10px] text-slate-500 uppercase font-bold">
              Approved
            </p>
            <p className="text-lg font-bold text-emerald-700">
              {aapList.filter((a) => a.status === "APPROVED").length}
            </p>
          </div>
        </div>

        {/* AAP LIST */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left p-2 md:p-3 text-slate-500 font-semibold">
                  State
                </th>
                <th className="text-left p-2 md:p-3 text-slate-500 font-semibold">
                  Year
                </th>
                <th className="text-left p-2 md:p-3 text-slate-500 font-semibold">
                  Budget (₹ Cr)
                </th>
                <th className="text-left p-2 md:p-3 text-slate-500 font-semibold">
                  Prev Utilization
                </th>
                <th className="text-left p-2 md:p-3 text-slate-500 font-semibold">
                  Status
                </th>
                <th className="text-left p-2 md:p-3 text-slate-500 font-semibold">
                  Last Action
                </th>
                <th className="text-right p-2 md:p-3 text-slate-500 font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {aapList.map((a) => (
                <tr
                  key={a.stateId}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${activeAAP && activeAAP.stateId === a.stateId
                      ? "bg-indigo-50/40"
                      : ""
                    }`}
                >
                  <td className="p-2 md:p-3 font-medium text-slate-800">
                    {a.stateName}
                  </td>
                  <td className="p-2 md:p-3 text-slate-600">{a.year}</td>
                  <td className="p-2 md:p-3 text-slate-700">
                    ₹{a.budgetCr}
                  </td>
                  <td className="p-2 md:p-3 text-slate-700">
                    {a.prevUtilization}%
                  </td>
                  <td className="p-2 md:p-3">
                    <AAPStatusBadge status={a.status} />
                  </td>
                  <td className="p-2 md:p-3 text-[11px] md:text-xs text-slate-500 max-w-[260px] truncate">
                    {a.lastAction}
                  </td>
                  <td className="p-2 md:p-3 text-right">
                    <button
                      onClick={() => openAAPDetail(a.stateId)}
                      className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                      disabled={
                        aapDetailLoading && activeAAP?.stateId === a.stateId
                      }
                    >
                      {aapDetailLoading &&
                        activeAAP?.stateId === a.stateId ? (
                        <span className="flex items-center gap-1">
                          <Loader2 size={12} className="animate-spin" />
                          Opening…
                        </span>
                      ) : (
                        "Open"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AAP DETAIL SLIDE-IN PANEL */}
        {selectedAAP && (
          <div className="mt-6 border-t border-slate-200 pt-4 animate-in slide-in-from-bottom-4 duration-300">
            {aapDetailLoading ? (
              <div className="flex items-center justify-center py-8 text-slate-500 text-sm">
                <Loader2 className="mr-2 animate-spin" size={18} />
                Fetching AAP details from /api/central/pmajay/aap/
                {selectedAAP.stateId}
                …
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT: Summary + Validation + Chat */}
                <div className="lg:col-span-2">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    {selectedAAP.stateName} – Annual Action Plan
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Submitted on {selectedAAP.submittedAt} · Financial Year{" "}
                    <b>{selectedAAP.year}</b>
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-xs">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <p className="text-[10px] uppercase text-slate-500 font-bold">
                        Proposed Budget
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        ₹{selectedAAP.budgetCr} Cr
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <p className="text-[10px] uppercase text-slate-500 font-bold">
                        Prev Utilization
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        {selectedAAP.prevUtilization}%
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <p className="text-[10px] uppercase text-slate-500 font-bold">
                        Priority Districts
                      </p>
                      <p className="text-xs text-slate-800">
                        {selectedAAP.priorityDistricts.join(", ")}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <p className="text-[10px] uppercase text-slate-500 font-bold">
                        Current Status
                      </p>
                      <div className="mt-1">
                        <AAPStatusBadge status={selectedAAP.status} />
                      </div>
                    </div>
                  </div>

                  {/* COMPONENT SPLIT & VALIDATION */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-xs font-semibold text-slate-800 mb-2">
                        Component-wise Allocation (%)
                      </p>
                      <ul className="text-xs text-slate-700 space-y-1">
                        <li>
                          Skill Development:{" "}
                          <b>{selectedAAP.components.skillDev}%</b>
                        </li>
                        <li>
                          Income Generation:{" "}
                          <b>{selectedAAP.components.incomeGen}%</b>
                        </li>
                        <li>
                          Infrastructure Support:{" "}
                          <b>{selectedAAP.components.infraSupport}%</b>
                        </li>
                      </ul>
                    </div>

                    <AAPValidationBlock aap={selectedAAP} />
                  </div>

                  {/* Existing remarks */}
                  {selectedAAP.remarks && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 text-xs text-amber-800">
                      <p className="font-semibold mb-1">
                        Previous Central Remarks
                      </p>
                      <p>{selectedAAP.remarks}</p>
                      {selectedAAP.decidedAt && (
                        <p className="mt-1 text-[10px] text-amber-700">
                          Last updated: {selectedAAP.decidedAt}
                        </p>
                      )}
                    </div>
                  )}

                  {/* CHAT THREAD – WHATSAPP STYLE */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                        <MessageCircle
                          size={14}
                          className="text-indigo-600"
                        />
                        Clarifications between State & Central
                      </p>
                      <span className="text-[10px] text-slate-400">
                        Demo: appears as a shared thread on both dashboards
                      </span>
                    </div>

                    <div
                      ref={chatContainerRef}
                      className="h-64 max-h-72 overflow-y-auto border border-slate-200 rounded-lg bg-slate-50 px-3 py-2 space-y-2"
                    >
                      {selectedAAP.messages &&
                        selectedAAP.messages.length > 0 ? (
                        selectedAAP.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === "CENTRAL"
                                ? "justify-end"
                                : "justify-start"
                              }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs shadow-sm ${msg.sender === "CENTRAL"
                                  ? "bg-emerald-500 text-white rounded-br-sm"
                                  : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"
                                }`}
                            >
                              <div className="text-[10px] mb-0.5 opacity-80">
                                {msg.sender === "CENTRAL"
                                  ? "Central PM–AJAY Cell"
                                  : "State Nodal Officer"}
                              </div>
                              <div>{msg.text}</div>
                              {msg.at && (
                                <div
                                  className={`mt-1 text-[9px] opacity-75 ${msg.sender === "CENTRAL"
                                      ? "text-emerald-50"
                                      : "text-slate-400"
                                    }`}
                                >
                                  {msg.at}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex items-center justify-center text-[11px] text-slate-400">
                          No messages yet. Use the box below to ask for
                          clarification.
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border border-slate-300 rounded-full px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        placeholder="Type a clarification or instruction to the State..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(selectedAAP.stateId);
                          }
                        }}
                      />
                      <button
                        onClick={() =>
                          handleSendMessage(selectedAAP.stateId)
                        }
                        disabled={!chatInput.trim()}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                      >
                        <Send size={14} />
                        Send
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Decision panel */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-800 mb-2">
                    Central Officer – Decision & Remarks
                  </p>

                  <textarea
                    rows={5}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-xs mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    placeholder="Enter brief justification for approval or specific changes requested from the State..."
                    value={remarksInput}
                    onChange={(e) => setRemarksInput(e.target.value)}
                  />

                  <div className="flex flex-col gap-2 mt-2">
                    <button
                      disabled={
                        decisionLoading ||
                        selectedAAP.status === "APPROVED"
                      }
                      onClick={() =>
                        applyDecision(selectedAAP.stateId, "APPROVED")
                      }
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {decisionLoading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Processing…
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} />
                          Approve AAP
                        </>
                      )}
                    </button>
                    <button
                      disabled={decisionLoading}
                      onClick={() =>
                        applyDecision(selectedAAP.stateId, "RETURNED")
                      }
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 disabled:opacity-60"
                    >
                      <XCircle size={14} />
                      Return / Request Changes
                    </button>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Decisions recorded here are assumed to be synced with the
                      central PM–AJAY portal and visible to State Nodal
                      Officers.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CentralDashboard;

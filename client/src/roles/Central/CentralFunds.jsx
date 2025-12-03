import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from "recharts";

import {
  Landmark,
  IndianRupee,
  Wallet2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";

// Utility
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Fake Backend Endpoints
const ENDPOINTS = [
  "/api/pmajay/funds-summary",
  "/api/pmajay/disbursement",
  "/api/pmajay/state-wise",
  "/api/pmajay/sector-allocation",
  "/api/pmajay/yearly-growth",
];

const randomEndpoint = () => ENDPOINTS[rand(0, ENDPOINTS.length - 1)];

const CentralFunds = () => {

  // ─────────────────────────────────────────
  //  KPI (LIVE)
  // ─────────────────────────────────────────
  const [kpi, setKpi] = useState([
    { label: "Total Funds Sanctioned", value: 1200, icon: Landmark, color: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Total Funds Disbursed", value: 842, icon: IndianRupee, color: "bg-green-100", iconColor: "text-green-600" },
    { label: "Remaining Balance", value: 358, icon: Wallet2, color: "bg-amber-100", iconColor: "text-amber-600" },
  ]);

  // ─────────────────────────────────────────
  // CHART DATA (LIVE)
  // ─────────────────────────────────────────
  const [stateFunds, setStateFunds] = useState([
    { state: "Odisha", sanctioned: 120, disbursed: 98 },
    { state: "Karnataka", sanctioned: 135, disbursed: 110 },
    { state: "Maharashtra", sanctioned: 160, disbursed: 130 },
    { state: "Rajasthan", sanctioned: 115, disbursed: 92 },
    { state: "Gujarat", sanctioned: 140, disbursed: 120 },
  ]);

  const [sectors, setSectors] = useState([
    { name: "Skill Dev", value: 350 },
    { name: "Income Gen", value: 200 },
    { name: "Infrastructure", value: 150 },
  ]);

  const sectorColors = ["#3b82f6", "#22c55e", "#f97316"];

  const [yearlyFlow, setYearlyFlow] = useState([
    { year: "2019", funds: 150 },
    { year: "2020", funds: 220 },
    { year: "2021", funds: 280 },
    { year: "2022", funds: 310 },
    { year: "2023", funds: 340 },
    { year: "2024", funds: 420 },
  ]);

  // ─────────────────────────────────────────
  // LIVE INSIGHTS + API LOGS
  // ─────────────────────────────────────────
  const [insights, setInsights] = useState([]);
  const [apiLogs, setApiLogs] = useState([]);

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Add API log
  const pushLog = () => {
    setApiLogs(prev => [
      {
        id: Date.now(),
        endpoint: randomEndpoint(),
        status: "200 OK",
        time: `${rand(150, 700)}ms`,
        ts: new Date().toLocaleTimeString("en-IN")
      },
      ...prev.slice(0, 12)
    ]);
  };

  // Generate insight
  const generateInsight = () => {
    const insightsList = [
      "Odisha leads with the highest fund utilization this cycle.",
      "Maharashtra’s sanctioned-disbursed gap reduced significantly.",
      "Infrastructure sector funding grew by 8.4% this week.",
      "Skill Development allocation rising consistently since 2019.",
      "3 states achieved over 90% disbursement efficiency.",
      "Sector allocation imbalance detected in smaller states.",
    ];
    setInsights(prev => [
      {
        text: insightsList[rand(0, insightsList.length - 1)],
        time: new Date().toLocaleTimeString("en-IN")
      },
      ...prev.slice(0, 4)
    ]);
  };

  // ─────────────────────────────────────────
  // MAIN LIVE LOOP (EVERY 8 SECONDS)
  // ─────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(true);

      pushLog();
      generateInsight();

      // Update KPIs
      setKpi(prev =>
        prev.map(item => ({
          ...item,
          value: +(item.value + rand(-5, 8)).toFixed(1),
        }))
      );

      // Update state disbursement chart
      setStateFunds(prev =>
        prev.map(s => ({
          ...s,
          disbursed: s.disbursed + rand(-3, 4),
        }))
      );

      // Update sector chart
      setSectors(prev =>
        prev.map(s => ({
          ...s,
          value: s.value + rand(-10, 12)
        }))
      );

      // Update line chart
      setYearlyFlow(prev =>
        prev.map(s => ({
          ...s,
          funds: s.funds + rand(-4, 10),
        }))
      );

      setLastUpdated(new Date());
      setIsSyncing(false);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // ─────────────────────────────────────────
  // UI STARTS HERE
  // ─────────────────────────────────────────

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Central Funds Disbursement (Live)
        </h1>
        <p className="text-sm text-gray-500">
          Real-time tracking of state allocations & disbursement flows
        </p>

        <div className="flex items-center gap-3 text-xs mt-2">
          <span className={`px-2 py-1 rounded-full flex items-center gap-1
            ${isSyncing ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
            {isSyncing ? <Loader2 size={12} className="animate-spin" /> : "●"}
            {isSyncing ? "Syncing..." : "Connected"}
          </span>
          <span className="text-gray-400">
            Last update: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpi.map((item, index) => (
          <div key={index} className="bg-white p-5 rounded-lg shadow border flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <h3 className="text-2xl font-bold mt-1">₹{item.value} Cr</h3>
            </div>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${item.color}`}>
              <item.icon size={26} className={item.iconColor} />
            </div>
          </div>
        ))}
      </div>

      {/* STATE BAR + SECTOR PIE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* BAR CHART */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">State-wise Fund Disbursement (Live)</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateFunds}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sanctioned" fill="#3b82f6" name="Sanctioned" />
                <Bar dataKey="disbursed" fill="#22c55e" name="Disbursed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE */}
        <div className="bg-white p-5 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-2">Sector Allocation (Live)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={sectors} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {sectors.map((_, i) => (
                  <Cell key={i} fill={sectorColors[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* GROWTH TREND + INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LINE */}
        <div className="bg-white p-5 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">Fund Growth Trend (Live)</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyFlow}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="funds" stroke="#9333ea" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* INSIGHTS */}
        <div className="bg-white p-5 rounded-lg shadow border flex flex-col">
          <h3 className="text-lg font-semibold mb-3">Live Insights</h3>
          <div className="space-y-3 overflow-y-auto max-h-[260px] pr-2">
            {insights.map((item, i) => (
              <div key={i} className="flex gap-3 p-2 bg-gray-50 rounded border text-sm">
                <CheckCircle2 size={16} className="text-green-600 mt-1" />
                <div>
                  {item.text}
                  <div className="text-xs text-gray-400">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* API LOGS */}
      <div className="bg-white p-5 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-3">API Logs (Realistic Simulation)</h3>

        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {apiLogs.map((log, i) => (
            <div key={i} className="text-xs flex justify-between p-2 bg-gray-50 rounded border">
              <span className="font-medium">{log.endpoint}</span>
              <span>{log.status}</span>
              <span>{log.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CentralFunds;

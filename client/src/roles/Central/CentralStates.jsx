import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  IndianRupee,
  Star,
} from "lucide-react";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const PIE_COLORS = ["#22c55e", "#f59e0b", "#3b82f6"];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const API_ENDPOINTS = [
  "/api/central/sujhaa/performance",
  "/api/central/sujhaa/training",
  "/api/central/sujhaa/income-growth",
  "/api/central/sujhaa/satisfaction",
  "/api/central/sujhaa/employment",
];

const randomEndpoint = () =>
  API_ENDPOINTS[rand(0, API_ENDPOINTS.length - 1)];

const CentralStates = () => {
  // ─────────────────────────────────────────
  //  LIVE KPIs
  // ─────────────────────────────────────────
  const [stats, setStats] = useState([
    { label: "Total Beneficiaries", value: 10450, icon: Users, color: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Funds Utilized", value: 3.2, icon: IndianRupee, color: "bg-green-100", iconColor: "text-green-600" },
    { label: "Avg. Income Growth", value: 18.6, icon: TrendingUp, color: "bg-amber-100", iconColor: "text-amber-600" },
    { label: "Satisfaction Score", value: 4.4, icon: Star, color: "bg-purple-100", iconColor: "text-purple-600" },
  ]);

  // ─────────────────────────────────────────
  // STATE COMPARISON CHART DATA
  // ─────────────────────────────────────────
  const [stateComparisonData, setStateComparisonData] = useState([
    { name: "Odisha", beneficiaries: 420000, funds: 120, training: 78 },
    { name: "Karnataka", beneficiaries: 390000, funds: 105, training: 70 },
    { name: "Maharashtra", beneficiaries: 510000, funds: 150, training: 82 },
  ]);

  // ─────────────────────────────────────────
  // GROWTH TREND LINE CHART
  // ─────────────────────────────────────────
  const [growthStateData, setGrowthStateData] = useState([
    { year: "2019", odisha: 40, karnataka: 25, maharashtra: 50 },
    { year: "2020", odisha: 65, karnataka: 40, maharashtra: 72 },
    { year: "2021", odisha: 95, karnataka: 55, maharashtra: 100 },
    { year: "2022", odisha: 125, karnataka: 75, maharashtra: 130 },
    { year: "2023", odisha: 155, karnataka: 95, maharashtra: 160 },
    { year: "2024", odisha: 185, karnataka: 120, maharashtra: 185 },
  ]);

  // ─────────────────────────────────────────
  // EMPLOYMENT CONVERSION
  // ─────────────────────────────────────────
  const [employmentData, setEmploymentData] = useState([
    { state: "Odisha", conversion: 42 },
    { state: "Karnataka", conversion: 38 },
    { state: "Maharashtra", conversion: 51 },
  ]);

  // ─────────────────────────────────────────
  // INSIGHTS & API LOGS
  // ─────────────────────────────────────────
  const [insights, setInsights] = useState([]);
  const [apiLogs, setApiLogs] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);

  // ─────────────────────────────────────────
  // Helper: Push API Log
  // ─────────────────────────────────────────
  const pushApiLog = () => {
    const log = {
      id: Date.now(),
      ts: new Date().toLocaleTimeString(),
      endpoint: randomEndpoint(),
      status: "200 OK",
      time: `${rand(120, 700)}ms`,
    };
    setApiLogs((prev) => [log, ...prev.slice(0, 14)]);
  };

  // ─────────────────────────────────────────
  // Helper: Generate Insight
  // ─────────────────────────────────────────
  const generateInsight = () => {
    const list = [
      "Odisha shows strong growth in training outcomes.",
      "Maharashtra leads in fund utilization this cycle.",
      "Karnataka employment conversion dipped slightly.",
      "National fund utilization increased by 4.2%.",
      "Beneficiary satisfaction trending upward.",
      "Skill training participation rising across states.",
    ];
    setInsights((prev) => [
      { text: list[rand(0, list.length - 1)], time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 4),
    ]);
  };

  // ─────────────────────────────────────────
  // LIVE UPDATE EVERY 8 SECONDS
  // ─────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(true);

      // Logs
      pushApiLog();
      generateInsight();

      // KPIs
      setStats((prev) =>
        prev.map((s) => ({
          ...s,
          value: +((s.value + rand(-2, 3) * 0.5).toFixed(1)),
        }))
      );

      // Comparison
      setStateComparisonData((prev) =>
        prev.map((s) => ({
          ...s,
          beneficiaries: s.beneficiaries + rand(-3000, 4500),
          funds: s.funds + rand(-2, 3),
          training: s.training + rand(-1, 2),
        }))
      );

      // Employment
      setEmploymentData((prev) =>
        prev.map((s) => ({
          ...s,
          conversion: s.conversion + rand(-1, 2),
        }))
      );

      setLastUpdated(new Date());
      setIsSyncing(false);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // ─────────────────────────────────────────
  // UI STARTS
  // ─────────────────────────────────────────

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Scheme Impact Analysis (Live)</h1>
        <p className="text-gray-500 text-sm">
          A real-time view of PM-AJAY statewide performance indicators
        </p>

        <div className="mt-2 flex items-center gap-3 text-xs">
          <span className={`px-2 py-1 rounded-full ${isSyncing ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
            ● {isSyncing ? "Syncing..." : "Connected"}
          </span>
          <span className="text-gray-400">
            Last update: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow border flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 uppercase">{s.label}</p>
              <h3 className="text-2xl font-bold mt-1">
                {s.label === "Funds Utilized" ? `₹${s.value} Cr` : s.value}
              </h3>
            </div>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${s.color}`}>
              <s.icon className={s.iconColor} size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* INSIGHTS BOX */}
      <div className="bg-white rounded-lg shadow border p-4">
        <h3 className="text-lg font-semibold mb-2">Live Insights</h3>
        <div className="space-y-2">
          {insights.map((ins, index) => (
            <div key={index} className="bg-gray-50 border rounded p-2 text-sm flex justify-between">
              <span>{ins.text}</span>
              <span className="text-gray-400">{ins.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* STATE COMPARISON */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">State Comparison Overview</h3>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateComparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tickFormatter={(v) => `${v / 1000}k`} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />

                <Bar yAxisId="left" dataKey="beneficiaries" fill="#3b82f6" name="Beneficiaries" />
                <Bar yAxisId="right" dataKey="funds" fill="#10b981" name="Funds (Cr)" />
                <Bar yAxisId="right" dataKey="training" fill="#f59e0b" name="Training (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GROWTH LINE CHART */}
        <div className="bg-white p-5 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">Yearly Growth Trend</h3>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthStateData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line dataKey="odisha" stroke="#2563eb" strokeWidth={2} dot />
                <Line dataKey="karnataka" stroke="#22c55e" strokeWidth={2} dot />
                <Line dataKey="maharashtra" stroke="#f59e0b" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BOTTOM CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PIE CHART */}
        <div className="bg-white p-5 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-3">Category Distribution</h3>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[
                  { name: "Skill Training", value: 4200 },
                  { name: "Infrastructure Development", value: 2700 },
                  { name: "Income Generation", value: 750 },
                ]}
                  outerRadius={80}
                  innerRadius={50}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {PIE_COLORS.map((c, i) => (
                    <Cell key={i} fill={c} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* EMPLOYMENT CHART */}
        <div className="bg-white p-5 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">Employment Conversion Rate</h3>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={employmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="conversion"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* API LOGS */}
      <div className="bg-white rounded-lg shadow border p-5">
        <h3 className="text-lg font-semibold mb-2">API Logs (Simulated)</h3>

        <div className="max-h-[240px] overflow-y-auto space-y-2">
          {apiLogs.map((log, i) => (
            <div key={i} className="border p-2 rounded bg-gray-50 text-xs flex justify-between">
              <span>{log.endpoint}</span>
              <span>{log.status}</span>
              <span>{log.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CentralStates;

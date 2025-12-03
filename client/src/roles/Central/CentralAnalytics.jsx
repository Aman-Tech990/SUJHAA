import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { MapPin, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

// Utility
const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);

// Fake API endpoints
const ENDPOINTS = [
  "/api/pmajay/beneficiaries/gender",
  "/api/pmajay/beneficiaries/age",
  "/api/pmajay/beneficiaries/state-wise",
  "/api/pmajay/beneficiaries/scheme-usage",
  "/api/pmajay/beneficiaries/highlights",
];

const randomEndpoint = () => ENDPOINTS[rand(0, ENDPOINTS.length)];

const CentralBeneficiaryAnalytics = () => {
  // -----------------------------
  // LIVE STATES
  // -----------------------------
  const [genderData, setGenderData] = useState([
    { name: "Male", value: 420000 },
    { name: "Female", value: 510000 },
    { name: "Others", value: 12000 },
  ]);
  const genderColors = ["#3b82f6", "#ec4899", "#a855f7"];

  const [ageGroups, setAgeGroups] = useState([
    { group: "18-25", age: 18 },
    { group: "25-40", age: 25 },
    { group: "40-60", age: 40 },
    { group: "60+", age: 60 },
  ]);

  const [stateData, setStateData] = useState([
    { state: "Odisha", beneficiaries: 340000 },
    { state: "Karnataka", beneficiaries: 280000 },
    { state: "Maharashtra", beneficiaries: 410000 },
    { state: "Bihar", beneficiaries: 220000 },
    { state: "UP", beneficiaries: 390000 },
  ]);

  const [schemeUsage, setSchemeUsage] = useState([
    { scheme: "Skill Training", beneficiary: 420000 },
    { scheme: "Income Generation", beneficiary: 240000 },
    { scheme: "Infastructure", beneficiary: 95000 },
  ]);

  const [insights, setInsights] = useState([]);
  const [apiLogs, setApiLogs] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Add new log
  const pushLog = () => {
    setApiLogs((prev) => [
      {
        endpoint: randomEndpoint(),
        status: "200 OK",
        time: `${rand(120, 800)}ms`,
        ts: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 12),
    ]);
  };

  // Add new insight
  const pushInsight = () => {
    const randomInsights = [
      "Female participation increased by 3.4% this cycle.",
      "UP and Maharashtra show the fastest beneficiary onboarding.",
      "18–25 age group is adopting skill courses rapidly.",
      "Other gender participation improved by 12% this year.",
      "Income Generation schemes saw a 7.3% rise this month.",
      "Odisha continues leading with 3.4 lakh registrations.",
    ];
    setInsights((prev) => [
      {
        text: randomInsights[rand(0, randomInsights.length)],
        time: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 4),
    ]);
  };

  // -----------------------------
  // LIVE DATA UPDATE LOOP
  // -----------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(true);
      pushLog();
      pushInsight();

      // Gender fluctuations
      setGenderData((prev) =>
        prev.map((g) => ({
          ...g,
          value: g.value + rand(-2000, 2000),
        }))
      );

      // State beneficiary fluctuations
      setStateData((prev) =>
        prev.map((s) => ({
          ...s,
          beneficiaries: s.beneficiaries + rand(-5000, 5000),
        }))
      );

      // Scheme usage fluctuations
      setSchemeUsage((prev) =>
        prev.map((s) => ({
          ...s,
          beneficiary: s.beneficiary + rand(-3000, 3000),
        }))
      );

      setLastUpdate(new Date());
      setIsSyncing(false);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // -----------------------------
  // UI 
  // -----------------------------
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Beneficiary Analytics (Live)</h1>
        <p className="text-base text-gray-500">Real-time demographic and engagement insights.</p>

        <div className="mt-2 flex items-center gap-3 text-xs">
          <span
            className={`px-2 py-1 rounded-full flex items-center gap-1 ${isSyncing ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
              }`}
          >
            {isSyncing ? <Loader2 size={12} className="animate-spin" /> : "●"}{" "}
            {isSyncing ? "Syncing…" : "Connected"}
          </span>

          <span className="text-gray-400">Last update: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* ROW 1: Gender + Age */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* GENDER */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-xl font-semibold mb-4">Gender Distribution (Live)</h3>
          <div className="h-[320px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  dataKey="value"
                >
                  {genderData.map((_, i) => (
                    <Cell key={i} fill={genderColors[i]} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AGE */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-xl font-semibold mb-4">Age Group Distribution (%)</h3>
          <div className="h-[320px]">
            <ResponsiveContainer>
              <BarChart data={ageGroups}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="group" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="age" fill="#10b981" radius={[6, 6, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ROW 2: STATES + SCHEMES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* STATE BENEFICIARIES */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-xl font-semibold mb-4">Top States by Beneficiaries (Live)</h3>
          <div className="h-[320px]">
            <ResponsiveContainer>
              <BarChart data={stateData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="state" />
                <YAxis tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip />
                <Bar dataKey="beneficiaries" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SCHEME USAGE */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-xl font-semibold mb-4">Most Applied Schemes (Live)</h3>
          <div className="h-[320px]">
            <ResponsiveContainer>
              <BarChart layout="vertical" data={schemeUsage}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `${v / 1000}k`} />
                <YAxis type="category" dataKey="scheme" width={120} />
                <Tooltip />
                <Bar dataKey="beneficiary" fill="#f97316" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* LIVE INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Impact highlights (static visual cards) */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-xl font-semibold mb-6">State Impact Highlights</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[
              ["Odisha", "Over 3.4 lakh individuals benefitted.", "orange"],
              ["Maharashtra", "Entrepreneurship uplifted 4 lakh+ people.", "blue"],
              ["Uttar Pradesh", "3.9 lakh skilled under training.", "green"],
              ["Karnataka", "Modern training boosted employability.", "purple"],
              ["Bihar", "2.2 lakh+ families supported.", "rose"],
            ].map(([state, text, color], i) => (
              <div
                key={i}
                className={`p-5 rounded-lg border-l-4 border-${color}-500 bg-${color}-50/60 hover:bg-${color}-100 transition`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={18} className={`text-${color}-600`} />
                  <b className="text-base font-bold">{state}</b>
                </div>
                <p className="text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* LIVE INSIGHTS FEED */}
        <div className="bg-white p-6 rounded-xl shadow border flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Live Insights</h3>
          <div className="space-y-3 overflow-y-auto max-h-[260px] pr-2">
            {insights.map((ins, i) => (
              <div key={i} className="p-2 rounded border bg-gray-50 flex gap-2">
                <CheckCircle2 size={18} className="text-green-600" />
                <span className="text-sm">
                  {ins.text}
                  <div className="text-xs text-gray-400">{ins.time}</div>
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* API LOGS */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h3 className="text-lg font-semibold mb-4">API Logs (Live Simulation)</h3>
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
          {apiLogs.map((log, i) => (
            <div
              key={i}
              className="text-xs flex justify-between p-2 bg-gray-50 rounded border"
            >
              <span>{log.endpoint}</span>
              <span className="text-green-700">{log.status}</span>
              <span>{log.time}</span>
              <span className="text-gray-400">{log.ts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CentralBeneficiaryAnalytics;

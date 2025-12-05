/* ============================
   STATE DASHBOARD WITH AAP MODULE + SEND FLOW
   ============================ */

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  Users,
  Calendar,
  Activity,
  BarChart3,
  Building2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ClipboardPenLine,
  X,
  CheckCircle,
  Loader2,
  Send,
} from "lucide-react";

const STATE_DASHBOARD_KEY = "sujhaa-state-dashboard";
const AAP_STORAGE_KEY = "sujhaa-aap-data";
const AAP_SENT_KEY = "sujhaa-aap-sent";

/* ----------------------------
   DEFAULT MOCK VALUES
---------------------------- */
const defaultStateSummary = {
  totalBeneficiaries: 5050,
  totalApplications: 6230,
  approved: 4290,
  pendingVerification: 820,
  fundsAllocatedCr: 22.5,
  fundsUtilizedCr: 15.9,
};

const defaultInsights = [
  { msg: "Skill Development applications increased by 26% this month.", trend: "positive" },
  { msg: "Ganjam district shows high demand for dairy-based Income Generation schemes.", trend: "neutral" },
  { msg: "Cuttack utilization rate is lower than average, likely due to field officer delay.", trend: "negative" },
];

const defaultActivityFeed = [
  { time: "2 min ago", event: "Rajiv Sharma application approved at State Level." },
  { time: "10 min ago", event: "Khordha District disbursed ₹8.2L for Skill Training." },
  { time: "1 hour ago", event: "New scheme request received from Ganjam." },
  { time: "3 hours ago", event: "District Officer Cuttack reviewed 45 applications." },
];

const defaultSchemeBreakdown = [
  { name: "Income Generation", value: 45 },
  { name: "Skill Development", value: 35 },
  { name: "Infrastructure Support", value: 20 },
];

const COLORS = ["#4f46e5", "#06b6d4", "#f59e0b"];

const user = JSON.parse(localStorage.getItem("sujhaa-user")) || {
  state: "Odisha",
  name: "State Officer",
};

/* ============================
   MAIN COMPONENT
============================ */
const StateDashboard = () => {
  const [stateSummary, setStateSummary] = useState(defaultStateSummary);
  const [activityFeed, setActivityFeed] = useState(defaultActivityFeed);
  const [schemeBreakdown, setSchemeBreakdown] = useState(defaultSchemeBreakdown);

  const [showAAPModal, setShowAAPModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  const [savedAAP, setSavedAAP] = useState(null);
  const [aapSentStatus, setAapSentStatus] = useState(
    JSON.parse(localStorage.getItem(AAP_SENT_KEY) || "null")
  );

  // Load dashboard and AAP data
  useEffect(() => {
    const saved = localStorage.getItem(STATE_DASHBOARD_KEY);
    const aapData = localStorage.getItem(AAP_STORAGE_KEY);

    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.stateSummary) setStateSummary(p.stateSummary);
        if (p.activityFeed) setActivityFeed(p.activityFeed);
        if (p.schemeBreakdown) setSchemeBreakdown(p.schemeBreakdown);
      } catch {
        // ignore parse error
      }
    }

    if (aapData) {
      try {
        setSavedAAP(JSON.parse(aapData));
      } catch {
        // ignore
      }
    }
  }, []);

  // Auto-update
  useEffect(() => {
    const interval = setInterval(() => {
      setStateSummary((prev) => ({
        ...prev,
        totalApplications: prev.totalApplications + Math.floor(Math.random() * 5),
        approved: prev.approved + Math.floor(Math.random() * 3),
        pendingVerification:
          prev.pendingVerification > 10
            ? prev.pendingVerification - Math.floor(Math.random() * 3)
            : prev.pendingVerification + Math.floor(Math.random() * 2),
        fundsUtilizedCr: +(prev.fundsUtilizedCr + Math.random() * 0.3).toFixed(1),
      }));

      setSchemeBreakdown((prev) =>
        prev.map((x) => ({
          ...x,
          value: x.value + Math.floor(Math.random() * 2),
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const totalSchemes = schemeBreakdown.reduce((a, b) => a + b.value, 0);

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-800">

      {/* ============================
          HEADER
      ============================ */}
      <header className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            State Dashboard – {user.state}
          </h1>
          <p className="flex items-center gap-2 text-slate-500 mt-1">
            <Calendar size={16} />
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <button
          onClick={() => setShowAAPModal(true)}
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <ClipboardPenLine size={18} /> Prepare Annual Action Plan
        </button>
      </header>

      {/* ============================
          SUMMARY CARDS
      ============================ */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <SummaryCard
          title="Total Beneficiaries"
          value={stateSummary.totalBeneficiaries}
          icon={<Users className="text-orange-500" />}
        />

        <SummaryCard
          title="Applications Received"
          value={stateSummary.totalApplications}
          icon={<BarChart3 className="text-blue-600" />}
        />

        <SummaryCard
          title="Approved at State"
          value={stateSummary.approved}
          icon={<TrendingUp className="text-green-600" />}
        />

        <SummaryCard
          title="Pending Verification"
          value={stateSummary.pendingVerification}
          icon={<Building2 className="text-purple-600" />}
        />
      </section>

      {/* ============================
          AI INSIGHTS
      ============================ */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="text-indigo-600" /> State AI Insights
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {defaultInsights.map((ins, i) => (
            <InsightCard key={i} msg={ins.msg} trend={ins.trend} />
          ))}
        </div>
      </section>

      {/* ============================
          CHARTS IN ONE ROW
      ============================ */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Pie */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Scheme Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={schemeBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                label={({ value }) =>
                  `${((value / totalSchemes) * 100).toFixed(1)}%`
                }
              >
                {schemeBreakdown.map((d, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border col-span-2">
          <h3 className="text-lg font-semibold mb-4">Monthly Applications Trend</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={[
                { month: "Jan", value: 480 },
                { month: "Feb", value: 610 },
                { month: "Mar", value: 580 },
                { month: "Apr", value: 720 },
                { month: "May", value: 690 },
                { month: "Jun", value: 770 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ============================
          FUND UTILIZATION LINE CHART
      ============================ */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mt-8">
        <h3 className="text-lg font-semibold mb-4">Fund Utilization Trend</h3>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={[
              { month: "Jan", utilization: 10 },
              { month: "Feb", utilization: 13 },
              { month: "Mar", utilization: 15 },
              { month: "Apr", utilization: 17 },
              { month: "May", utilization: 19 },
              { month: "Jun", utilization: stateSummary.fundsUtilizedCr },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis unit=" Cr" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="utilization"
              stroke="#00a851"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ============================
          AAP MODAL (PREPARE)
      ============================ */}
      {showAAPModal && (
        <AAPModal
          onClose={() => setShowAAPModal(false)}
          onSave={(data) => {
            setSavedAAP(data);
            localStorage.setItem(AAP_STORAGE_KEY, JSON.stringify(data));
            setShowAAPModal(false);
          }}
        />
      )}

      {/* ============================
          SEND AAP MODAL (CENTRAL)
      ============================ */}
      {showSendModal && savedAAP && (
        <SendAAPModal
          aapData={savedAAP}
          onClose={() => setShowSendModal(false)}
          onSent={(status) => {
            setAapSentStatus(status);
            localStorage.setItem(AAP_SENT_KEY, JSON.stringify(status));
            setShowSendModal(false);
          }}
        />
      )}

      {/* If saved AAP exists, show summary & send actions */}
      {savedAAP && (
        <div className="mt-10 bg-white p-6 rounded-xl border shadow">
          <h3 className="text-xl font-bold mb-3">✔ Annual Action Plan Prepared</h3>
          <p className="text-sm text-slate-600">Financial Year: {savedAAP.year}</p>
          <p className="text-sm text-slate-600 mt-1">
            Total Proposed Budget: ₹{savedAAP.budgetCr} Cr
          </p>

          {/* STATUS OF SENDING */}
          {aapSentStatus ? (
            <p className="mt-3 text-green-700 text-sm">
              📤 Sent to Central Officer on <b>{aapSentStatus.time}</b>
            </p>
          ) : (
            <p className="mt-3 text-orange-700 text-sm">
              ⚠️ Not yet sent to Central Officer
            </p>
          )}

          <div className="flex gap-3 mt-4">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
              onClick={() => setShowAAPModal(true)}
            >
              View / Edit AAP
            </button>

            {!aapSentStatus && (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm flex items-center gap-2"
                onClick={() => setShowSendModal(true)}
              >
                <Send size={16} /> Send to Central Officer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================
   SUMMARY CARD
============================ */
const SummaryCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
      </div>
      <div className="p-3 bg-slate-100 rounded-xl">{icon}</div>
    </div>
  </div>
);

/* ============================
   INSIGHT CARD
============================ */
const InsightCard = ({ msg, trend }) => {
  const color =
    trend === "positive"
      ? "text-green-600"
      : trend === "negative"
        ? "text-red-600"
        : "text-blue-600";

  const Icon =
    trend === "positive"
      ? ArrowUpRight
      : trend === "negative"
        ? ArrowDownRight
        : Activity;

  return (
    <div className="p-4 bg-white border rounded-xl shadow-sm flex gap-3 items-start hover:shadow-md transition">
      <Icon className={`${color} mt-1`} />
      <p className="text-slate-700 text-sm font-medium">{msg}</p>
    </div>
  );
};

/* ============================
   AAP MODAL (PREP & PREVIEW)
============================ */
const AAPModal = ({ onClose, onSave }) => {
  const [year, setYear] = useState("2025-26");
  const [districts, setDistricts] = useState({
    Khordha: false,
    Cuttack: false,
    Ganjam: false,
    Puri: false,
    Balasore: false,
  });
  const [budgetCr, setBudgetCr] = useState(18);
  const [components, setComponents] = useState({
    incomeGen: 40,
    skillDev: 35,
    infraSupport: 25,
  });

  const selectedDistricts = Object.keys(districts).filter((d) => districts[d]);

  const total =
    components.incomeGen + components.skillDev + components.infraSupport;

  const handleSave = () => {
    const data = {
      year,
      selectedDistricts,
      components,
      budgetCr,
      timestamp: new Date().toISOString(),
    };
    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-xl">
        {/* MODAL HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Prepare Annual Action Plan (AAP)</h2>
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* YEAR SELECTION */}
        <div className="mb-6">
          <label className="text-sm font-medium">Financial Year</label>
          <select
            className="w-full border p-2 rounded mt-1"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option>2024-25</option>
            <option>2025-26</option>
            <option>2026-27</option>
          </select>
        </div>

        {/* DISTRICT PRIORITY */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">Priority Districts</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(districts).map((d) => (
              <label key={d} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={districts[d]}
                  onChange={(e) =>
                    setDistricts({ ...districts, [d]: e.target.checked })
                  }
                />
                {d}
              </label>
            ))}
          </div>
        </div>

        {/* BUDGET */}
        <div className="mb-6">
          <label className="text-sm font-medium">
            Total Proposed Budget (₹ Cr)
          </label>
          <input
            type="number"
            className="w-full border p-2 rounded mt-1"
            value={budgetCr}
            onChange={(e) => setBudgetCr(e.target.value)}
          />
        </div>

        {/* COMPONENT SPLIT */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">
            Component-wise Allocation (%)
          </p>

          {[
            ["Income Generation", "incomeGen"],
            ["Skill Development", "skillDev"],
            ["Infrastructure Support", "infraSupport"],
          ].map(([label, key]) => (
            <div className="mb-3" key={key}>
              <label className="text-sm">{label}</label>
              <input
                type="number"
                className="w-full border p-2 rounded mt-1"
                value={components[key]}
                onChange={(e) =>
                  setComponents({
                    ...components,
                    [key]: Number(e.target.value),
                  })
                }
              />
            </div>
          ))}

          {total !== 100 && (
            <p className="text-red-600 text-sm">
              Split must total 100% (Current: {total}%)
            </p>
          )}
        </div>

        {/* AAP PREVIEW */}
        <div className="bg-slate-100 p-4 rounded-xl mt-6">
          <h3 className="font-bold text-lg mb-2">
            📄 Annual Action Plan Summary
          </h3>

          <p className="text-sm">
            The State of <b>Odisha</b> proposes the Annual Action Plan for the
            financial year <b>{year}</b> under PM–AJAY.
          </p>

          <p className="text-sm mt-3">
            <b>Priority Districts:</b>{" "}
            {selectedDistricts.length > 0
              ? selectedDistricts.join(", ")
              : "None selected"}
          </p>

          <p className="text-sm mt-3">
            <b>Total Budget Proposed:</b> ₹{budgetCr} Crore
          </p>

          <p className="text-sm mt-4">
            <b>Component Allocation:</b>
          </p>
          <ul className="text-sm list-disc ml-5">
            <li>Income Generation — {components.incomeGen}%</li>
            <li>Skill Development — {components.skillDev}%</li>
            <li>Infrastructure Support — {components.infraSupport}%</li>
          </ul>

          <p className="mt-4 text-sm italic">
            This AAP is prepared as per MoSJ guidelines, considering gap-filling
            needs, district demand, and previous year utilization trends.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            Cancel
          </button>

          <button
            disabled={total !== 100}
            onClick={handleSave}
            className={`px-5 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 ${total !== 100 ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            <CheckCircle size={16} /> Save Annual Action Plan
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================
   SEND AAP MODAL (CENTRAL FLOW)
============================ */
const SendAAPModal = ({ aapData, onClose, onSent }) => {
  const [isSending, setIsSending] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);

  const STEPS = [
    "Validating AAP with State rules…",
    "Checking previous year utilization & UC status…",
    "Packaging component-wise proposals (Income / Skill / Infra)…",
    "Encrypting data and preparing payload for NIC servers…",
    "Uploading AAP to Central PM–AJAY portal…",
    "Applying digital signature of State Nodal Officer…",
    "Notifying Central Officer (MoSJ)…",
    "✔ AAP successfully delivered to Central Officer",
  ];

  const startSending = () => {
    if (isSending) return;
    setIsSending(true);
    setStageIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setStageIndex(current);

      if (current === STEPS.length - 1) {
        clearInterval(interval);

        const status = {
          sent: true,
          time: new Date().toLocaleString("en-IN"),
        };

        // Give a tiny pause to show "success"
        setTimeout(() => {
          onSent(status);
        }, 800);
      }
    }, 1300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-[800px] max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-xl">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              Send AAP to Central Officer
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              This simulates the secure submission from State to Central PM–AJAY
              portal.
            </p>
          </div>
          <button onClick={onClose} disabled={isSending}>
            <X size={22} />
          </button>
        </div>

        {/* AAP SNAPSHOT */}
        <div className="mb-5 bg-slate-50 border rounded-lg p-4">
          <p className="text-sm">
            <b>State:</b> Odisha
          </p>
          <p className="text-sm">
            <b>Financial Year:</b> {aapData.year}
          </p>
          <p className="text-sm">
            <b>Proposed Budget:</b> ₹{aapData.budgetCr} Cr
          </p>
          <p className="text-sm mt-1">
            <b>Priority Districts:</b>{" "}
            {aapData.selectedDistricts && aapData.selectedDistricts.length > 0
              ? aapData.selectedDistricts.join(", ")
              : "Not specified"}
          </p>
        </div>

        {/* STAGES TIMELINE */}
        <div className="mb-5">
          <h3 className="text-sm font-semibold mb-2">
            Submission Pipeline (State → Central)
          </h3>
          <ol className="space-y-2 text-sm">
            {STEPS.map((step, idx) => {
              const isDone = idx < stageIndex;
              const isActive = idx === stageIndex;

              return (
                <li
                  key={idx}
                  className={`flex items-center gap-2 p-2 rounded-md ${isDone
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : isActive
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : "bg-slate-50 text-slate-600 border border-slate-100"
                    }`}
                >
                  <span className="w-5 flex justify-center">
                    {isDone ? (
                      <CheckCircle size={16} />
                    ) : isActive && isSending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <span className="text-xs">•</span>
                    )}
                  </span>
                  <span>{step}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            disabled={isSending}
            className="px-4 py-2 border rounded-lg bg-white text-sm"
          >
            Cancel
          </button>

          <button
            onClick={startSending}
            disabled={isSending}
            className="px-5 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 text-sm"
          >
            {isSending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Sending to Central…
              </>
            ) : (
              <>
                <Send size={16} /> Start Sending
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StateDashboard;

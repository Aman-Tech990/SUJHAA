/* ============================
   STATE DASHBOARD WITH AAP MODULE + SEND FLOW
   (AAP SESSION-SCOPED)
============================ */

import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Legend,
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

/* ============================
    STORAGE KEYS (SESSION ONLY FOR AAP)
============================ */
const STATE_DASHBOARD_KEY = "sujhaa-state-dashboard";
const AAP_STORAGE_KEY = "sujhaa-session-aap-data";
const AAP_SENT_KEY = "sujhaa-session-aap-sent";

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
    JSON.parse(sessionStorage.getItem(AAP_SENT_KEY) || "null")
  );

  /* ============================
     LOAD DASHBOARD + AAP (SESSION)
  ============================ */
  useEffect(() => {
    const saved = localStorage.getItem(STATE_DASHBOARD_KEY);
    const aapData = sessionStorage.getItem(AAP_STORAGE_KEY);

    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.stateSummary) setStateSummary(p.stateSummary);
        if (p.activityFeed) setActivityFeed(p.activityFeed);
        if (p.schemeBreakdown) setSchemeBreakdown(p.schemeBreakdown);
      } catch { }
    }

    if (aapData) {
      try {
        setSavedAAP(JSON.parse(aapData));
      } catch { }
    }
  }, []);

  /* ============================
     AUTO UPDATE METRICS
  ============================ */
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

      {/* ================= HEADER ================= */}
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

      {/* ================= SUMMARY CARDS ================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <SummaryCard title="Total Beneficiaries" value={stateSummary.totalBeneficiaries} icon={<Users className="text-orange-500" />} />
        <SummaryCard title="Applications Received" value={stateSummary.totalApplications} icon={<BarChart3 className="text-blue-600" />} />
        <SummaryCard title="Approved at State" value={stateSummary.approved} icon={<TrendingUp className="text-green-600" />} />
        <SummaryCard title="Pending Verification" value={stateSummary.pendingVerification} icon={<Building2 className="text-purple-600" />} />
      </section>

      {/* ================= AI INSIGHTS ================= */}
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

      {/* ================= CHARTS ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Scheme Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={schemeBreakdown}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                label={({ value }) => `${((value / totalSchemes) * 100).toFixed(1)}%`}
              >
                {schemeBreakdown.map((d, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border col-span-2">
          <h3 className="text-lg font-semibold mb-4">Monthly Applications Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={[
              { month: "Jan", value: 480 },
              { month: "Feb", value: 610 },
              { month: "Mar", value: 580 },
              { month: "Apr", value: 720 },
              { month: "May", value: 690 },
              { month: "Jun", value: 770 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ================= FUND UTILIZATION ================= */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mt-8">
        <h3 className="text-lg font-semibold mb-4">Fund Utilization Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={[
            { month: "Jan", utilization: 10 },
            { month: "Feb", utilization: 13 },
            { month: "Mar", utilization: 15 },
            { month: "Apr", utilization: 17 },
            { month: "May", utilization: 19 },
            { month: "Jun", utilization: stateSummary.fundsUtilizedCr },
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis unit=" Cr" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="utilization" stroke="#00a851" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= AAP STATUS ================= */}
      {savedAAP && (
        <div className="mt-10 bg-white p-6 rounded-xl border shadow">
          <h3 className="text-xl font-bold mb-3">✔ Annual Action Plan Prepared</h3>
          <p className="text-sm">Financial Year: {savedAAP.year}</p>
          <p className="text-sm">Budget: ₹{savedAAP.budgetCr} Cr</p>

          {aapSentStatus ? (
            <p className="mt-3 text-green-700">
              Sent to Central on <b>{aapSentStatus.time}</b>
            </p>
          ) : (
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
              onClick={() => setShowSendModal(true)}
            >
              <Send size={16} /> Send to Central Officer
            </button>
          )}
        </div>
      )}

      {showAAPModal && (
        <AAPModal
          onClose={() => setShowAAPModal(false)}
          onSave={(data) => {
            setSavedAAP(data);
            sessionStorage.setItem(AAP_STORAGE_KEY, JSON.stringify(data));
            setShowAAPModal(false);
          }}
        />
      )}

      {showSendModal && savedAAP && (
        <SendAAPModal
          onClose={() => setShowSendModal(false)}
          onSent={(status) => {
            setAapSentStatus(status);
            sessionStorage.setItem(AAP_SENT_KEY, JSON.stringify(status));
            setShowSendModal(false);
          }}
        />
      )}
    </div>
  );
};

/* ============================
   SUPPORT COMPONENTS
============================ */
const SummaryCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl border shadow-sm">
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h3 className="text-3xl font-bold mt-2">{value}</h3>
      </div>
      <div className="p-3 bg-slate-100 rounded-xl">{icon}</div>
    </div>
  </div>
);

const InsightCard = ({ msg, trend }) => {
  const color =
    trend === "positive" ? "text-green-600" :
      trend === "negative" ? "text-red-600" : "text-blue-600";

  const Icon =
    trend === "positive" ? ArrowUpRight :
      trend === "negative" ? ArrowDownRight : Activity;

  return (
    <div className="p-4 bg-white border rounded-xl shadow-sm flex gap-3">
      <Icon className={`${color} mt-1`} />
      <p className="text-sm">{msg}</p>
    </div>
  );
};

/* ============================
   AAP MODAL (PROFESSIONAL + DETAILED)
============================ */
const AAPModal = ({ onClose, onSave }) => {
  const [year, setYear] = useState("2025-26");
  const [budgetCr, setBudgetCr] = useState("");
  const [incomeGenerationCr, setIncomeGenerationCr] = useState("");
  const [skillDevelopmentCr, setSkillDevelopmentCr] = useState("");
  const [infraSupportCr, setInfraSupportCr] = useState("");
  const [focusDistricts, setFocusDistricts] = useState("");
  const [keyOutcomes, setKeyOutcomes] = useState("");

  const handleSave = () => {
    const payload = {
      year,
      budgetCr: Number(budgetCr) || 0,
      allocation: {
        incomeGenerationCr: Number(incomeGenerationCr) || 0,
        skillDevelopmentCr: Number(skillDevelopmentCr) || 0,
        infrastructureSupportCr: Number(infraSupportCr) || 0,
      },
      focusDistricts,
      keyOutcomes,
      createdAt: new Date().toISOString(),
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <ClipboardPenLine size={20} className="text-indigo-600" />
              Prepare Annual Action Plan (AAP)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Capture state-level priorities, budget split and expected outcomes for PM-AJAY GIA.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Row 1 – Year + Total Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Financial Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 2025-26"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Total Budget (₹ in Crores)
              </label>
              <input
                type="number"
                value={budgetCr}
                onChange={(e) => setBudgetCr(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 25"
                min="0"
              />
            </div>
          </div>

          {/* Row 2 – Scheme-wise allocation */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">
              Scheme-wise Budget Allocation (₹ in Crores)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="border rounded-lg p-3">
                <p className="text-xs font-semibold text-slate-600 mb-1">Income Generation</p>
                <input
                  type="number"
                  value={incomeGenerationCr}
                  onChange={(e) => setIncomeGenerationCr(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 10"
                  min="0"
                />
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-xs font-semibold text-slate-600 mb-1">Skill Development</p>
                <input
                  type="number"
                  value={skillDevelopmentCr}
                  onChange={(e) => setSkillDevelopmentCr(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 8"
                  min="0"
                />
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-xs font-semibold text-slate-600 mb-1">Infrastructure Support</p>
                <input
                  type="number"
                  value={infraSupportCr}
                  onChange={(e) => setInfraSupportCr(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 7"
                  min="0"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              * This split helps Central quickly see how your state is prioritising GIA funds.
            </p>
          </div>

          {/* Row 3 – Focus Districts */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Focus Districts / Blocks
            </label>
            <textarea
              value={focusDistricts}
              onChange={(e) => setFocusDistricts(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[70px]"
              placeholder="e.g., Ganjam, Malkangiri, Kalahandi – SC-dominated, high backwardness index..."
            />
          </div>

          {/* Row 4 – Key Outcomes */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Key Outcomes & Targets (High-level)
            </label>
            <textarea
              value={keyOutcomes}
              onChange={(e) => setKeyOutcomes(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[90px]"
              placeholder={
                "• 5,000 SC households to get income generation support\n" +
                "• 3,000 youth to complete skill training & placed\n" +
                "• 40 model SC bastis with basic infra support"
              }
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="mt-6 flex justify-between items-center gap-3">
          <p className="text-xs text-slate-400">
            This AAP is stored only for this browser session (for demo). In production, it will be saved to SUJHAA backend.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
            >
              <CheckCircle size={16} />
              Save AAP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================
   SEND AAP MODAL
============================ */
const SendAAPModal = ({ onClose, onSent }) => {
  const [remarks, setRemarks] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    setIsSending(true);

    // Simulate API call
    setTimeout(() => {
      const status = {
        time: new Date().toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        remarks,
        referenceId: `AAP-${Date.now()}`,
      };

      onSent(status);
      setIsSending(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Send size={18} className="text-green-600" />
              Send AAP to Central Officer
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              This will mark the AAP as submitted at State Level and visible in Central dashboard.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 flex items-start gap-2">
            <CheckCircle size={16} className="text-emerald-600 mt-0.5" />
            <p className="text-xs text-emerald-800">
              In live SUJHAA, this would trigger a workflow: central inbox entry + email/notification
              to concerned PM-AJAY division.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Remarks (optional)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[70px]"
              placeholder="e.g., Requesting early approval as schemes are aligned with SC livelihood clusters..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending}
            className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 disabled:opacity-70"
          >
            {isSending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Confirm & Send
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StateDashboard;

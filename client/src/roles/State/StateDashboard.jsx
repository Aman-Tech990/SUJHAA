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
} from "lucide-react";

const STATE_DASHBOARD_KEY = "sujhaa-state-dashboard";

const defaultStateSummary = {
  totalBeneficiaries: 5050,
  totalApplications: 6230,
  approved: 4290,
  pendingVerification: 820,
  fundsAllocatedCr: 22.5,
  fundsUtilizedCr: 15.9,
};

const defaultInsights = [
  {
    msg: "Skill Development applications increased by 26% this month.",
    trend: "positive",
  },
  {
    msg: "Ganjam district shows high demand for dairy-based Income Generation schemes.",
    trend: "neutral",
  },
  {
    msg: "Cuttack utilization rate is lower than average, likely due to field officer delay.",
    trend: "negative",
  },
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

const StateDashboard = () => {
  const [stateSummary, setStateSummary] = useState(defaultStateSummary);
  const [activityFeed, setActivityFeed] = useState(defaultActivityFeed);
  const [schemeBreakdown, setSchemeBreakdown] = useState(defaultSchemeBreakdown);

  // Load dashboard state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STATE_DASHBOARD_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.stateSummary) setStateSummary(parsed.stateSummary);
        if (parsed.activityFeed) setActivityFeed(parsed.activityFeed);
        if (parsed.schemeBreakdown) setSchemeBreakdown(parsed.schemeBreakdown);
      } catch (err) {
        console.error("Failed to parse dashboard data:", err);
      }
    }
  }, []);

  // Auto-update data every 10 seconds
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
        prev.map((item) => ({
          ...item,
          value: item.value + Math.floor(Math.random() * 3),
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const totalSchemes = schemeBreakdown.reduce((a, b) => a + b.value, 0);

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-800">
      {/* ---------------- WELCOME ---------------- */}
      <header className="mb-10">
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
      </header>

      {/* ---------------- SUMMARY CARDS ---------------- */}
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

      {/* ---------------- AI INSIGHTS ---------------- */}
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

      {/* ---------------- INTERACTIVE LAYOUT ---------------- */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ---------------- DONUT PIE CHART ---------------- */}
        <div className="bg-white rounded-xl p-6 shadow-sm border relative">
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
                {schemeBreakdown.map((e, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ---------------- ACTIVITY FEED ---------------- */}
        <div className="bg-white rounded-xl p-6 shadow-sm border lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

          <ul className="space-y-4">
            {activityFeed.map((a, i) => (
              <li
                key={i}
                className="p-4 bg-slate-100 rounded-lg flex justify-between items-start"
              >
                <p className="font-medium text-slate-700">{a.event}</p>
                <span className="text-xs text-slate-500">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- BAR CHART ---------------- */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mt-8">
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

      {/* ---------------- LINE CHART ---------------- */}
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
    </div>
  );
};

/* ---------------- COMPONENTS ---------------- */
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

export default StateDashboard;

import React, { useState, useEffect } from "react";
import {
    IndianRupee,
    Users,
    TrendingUp,
    PieChart as PieIcon,
    Activity
} from "lucide-react";

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
    LineChart,
    Line,
    Pie,
    Cell,
    PieChart,
} from "recharts";

const ProjectProgress = () => {
    const [selectedYear, setSelectedYear] = useState("2024-2025");
    const [selectedMonth, setSelectedMonth] = useState("Dec");

    // ---------- BASE DATA ----------
    const dataByYearBase = {
        "2024-2025": [
            { month: "Apr", allocated: 6.0, utilized: 4.1, verified: 45, approved: 35, rejected: 10, growth: 15, training: 25 },
            { month: "May", allocated: 6.0, utilized: 4.6, verified: 52, approved: 40, rejected: 12, growth: 17, training: 28 },
            { month: "Jun", allocated: 6.0, utilized: 5.0, verified: 60, approved: 48, rejected: 12, growth: 18, training: 32 },
            { month: "Jul", allocated: 6.5, utilized: 5.4, verified: 68, approved: 54, rejected: 14, growth: 20, training: 35 },
            { month: "Aug", allocated: 6.5, utilized: 5.1, verified: 75, approved: 60, rejected: 15, growth: 22, training: 38 },
            { month: "Sep", allocated: 6.5, utilized: 5.7, verified: 82, approved: 66, rejected: 16, growth: 23, training: 42 },
            { month: "Oct", allocated: 7.0, utilized: 6.1, verified: 90, approved: 72, rejected: 18, growth: 24, training: 46 },
            { month: "Nov", allocated: 7.0, utilized: 6.4, verified: 96, approved: 76, rejected: 20, growth: 25, training: 52 },
            { month: "Dec", allocated: 7.0, utilized: 3.2, verified: 40, approved: 32, rejected: 8, growth: 12, training: 22 },
        ],
        // → other years unchanged...
        "2023-2024": [
            { month: "Apr", allocated: 5.0, utilized: 3.4, verified: 28, approved: 20, rejected: 8, growth: 10, training: 12 },
            { month: "May", allocated: 5.0, utilized: 3.8, verified: 34, approved: 27, rejected: 7, growth: 11, training: 15 },
            { month: "Jun", allocated: 5.0, utilized: 4.1, verified: 42, approved: 33, rejected: 9, growth: 12, training: 18 },
            { month: "Jul", allocated: 5.5, utilized: 4.5, verified: 50, approved: 40, rejected: 10, growth: 13, training: 20 },
            { month: "Aug", allocated: 5.5, utilized: 3.9, verified: 56, approved: 45, rejected: 11, growth: 14, training: 22 },
            { month: "Sep", allocated: 5.5, utilized: 4.7, verified: 60, approved: 48, rejected: 12, growth: 15, training: 26 },
            { month: "Oct", allocated: 6.0, utilized: 5.1, verified: 68, approved: 52, rejected: 16, growth: 16, training: 30 },
            { month: "Nov", allocated: 6.0, utilized: 5.3, verified: 72, approved: 55, rejected: 17, growth: 17, training: 33 },
            { month: "Dec", allocated: 6.0, utilized: 2.4, verified: 28, approved: 20, rejected: 8, growth: 8, training: 10 },
        ],
        "2022-2023": [
            { month: "Apr", allocated: 3.5, utilized: 1.9, verified: 15, approved: 10, rejected: 5, growth: 5, training: 4 },
            { month: "May", allocated: 3.5, utilized: 2.2, verified: 20, approved: 15, rejected: 5, growth: 6, training: 6 },
            { month: "Jun", allocated: 3.5, utilized: 2.6, verified: 24, approved: 18, rejected: 6, growth: 7, training: 8 },
            { month: "Jul", allocated: 4.0, utilized: 2.9, verified: 30, approved: 22, rejected: 8, growth: 8, training: 10 },
            { month: "Aug", allocated: 4.0, utilized: 2.5, verified: 36, approved: 28, rejected: 8, growth: 9, training: 11 },
            { month: "Sep", allocated: 4.0, utilized: 3.3, verified: 40, approved: 30, rejected: 10, growth: 10, training: 15 },
            { month: "Oct", allocated: 4.2, utilized: 3.7, verified: 45, approved: 33, rejected: 12, growth: 11, training: 18 },
            { month: "Nov", allocated: 4.2, utilized: 3.8, verified: 48, approved: 36, rejected: 12, growth: 12, training: 19 },
            { month: "Dec", allocated: 4.2, utilized: 1.7, verified: 18, approved: 12, rejected: 6, growth: 6, training: 7 },
        ],
        "2021-2022": [
            { month: "Apr", allocated: 2.0, utilized: 0.6, verified: 4, approved: 3, rejected: 1, growth: 2, training: 1 },
            { month: "May", allocated: 2.0, utilized: 0.8, verified: 6, approved: 4, rejected: 2, growth: 3, training: 1 },
            { month: "Jun", allocated: 2.0, utilized: 1.1, verified: 8, approved: 6, rejected: 2, growth: 4, training: 2 },
            { month: "Jul", allocated: 2.2, utilized: 1.3, verified: 10, approved: 7, rejected: 3, growth: 4, training: 2 },
            { month: "Aug", allocated: 2.2, utilized: 1.0, verified: 12, approved: 9, rejected: 3, growth: 4, training: 3 },
            { month: "Sep", allocated: 2.2, utilized: 1.5, verified: 15, approved: 11, rejected: 4, growth: 5, training: 4 },
            { month: "Oct", allocated: 2.5, utilized: 1.6, verified: 18, approved: 14, rejected: 4, growth: 5, training: 5 },
            { month: "Nov", allocated: 2.5, utilized: 1.8, verified: 20, approved: 15, rejected: 5, growth: 5, training: 6 },
            { month: "Dec", allocated: 2.5, utilized: 0.7, verified: 8, approved: 6, rejected: 2, growth: 3, training: 3 },
        ]
    };

    // LIVE STATE
    const [dataByYear, setDataByYear] = useState(dataByYearBase);

    // ⭐ NEW: LIVE INSIGHTS
    const [insights, setInsights] = useState({
        utilizationChange: 0,
        verifiedChange: 0,
        approvalChange: 0,
        trainingChange: 0,
    });

    // ---------- LIVE UPDATE ENGINE ----------
    useEffect(() => {
        const interval = setInterval(() => {
            // Update Graph Data
            setDataByYear(prev => {
                const updated = { ...prev };
                updated[selectedYear] = prev[selectedYear].map(d => ({
                    ...d,
                    utilized: Math.max(0, d.utilized + (Math.random() * .2 - .1)),
                    verified: d.verified + Math.floor(Math.random() * 3),
                    approved: d.approved + Math.floor(Math.random() * 2),
                    rejected: d.rejected + (Math.random() > 0.9 ? 1 : 0),
                    growth: Math.max(0, d.growth + (Math.random() * 1 - 0.5)),
                    training: d.training + Math.floor(Math.random() * 2),
                }));
                return updated;
            });

            // Update Live Insights
            setInsights({
                utilizationChange: (Math.random() * 2).toFixed(1),
                verifiedChange: Math.floor(Math.random() * 20),
                approvalChange: (Math.random() * 3).toFixed(1),
                trainingChange: Math.floor(Math.random() * 15)
            });

        }, 5000);

        return () => clearInterval(interval);
    }, [selectedYear]);

    // ---------- DYNAMIC DATA ----------
    const monthlyData = dataByYear[selectedYear];
    const selectedMonthData = monthlyData.find(d => d.month === selectedMonth);

    // KPIs
    const totalDistrictBudget = 50;
    const totalUtilized = monthlyData.reduce((s, d) => s + d.utilized, 0).toFixed(1);
    const totalVerified = monthlyData.reduce((s, d) => s + d.verified, 0);
    const remainingFunds = (totalDistrictBudget - totalUtilized).toFixed(1);
    const highestGrowth = monthlyData.reduce((max, d) => d.growth > max.growth ? d : max);

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        MIS Report ({selectedYear})
                        <span className="text-green-600 text-sm animate-pulse">
                            ● Live
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500">
                        Showing insights for:{" "}
                        <span className="font-bold">{selectedMonth}</span>
                    </p>
                </div>

                {/* FILTERS */}
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow border">
                    <select className="border rounded-lg px-3 py-2" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        <option>2024-2025</option>
                        <option>2023-2024</option>
                        <option>2022-2023</option>
                        <option>2021-2022</option>
                    </select>

                    <select className="border rounded-lg px-3 py-2" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                        {monthlyData.map((m) => (
                            <option key={m.month} value={m.month}>{m.month}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ⭐ NEW: LIVE INSIGHTS PANEL */}
            <LiveInsights insights={insights} />

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KpiCard title="Total Utilized" value={`₹${totalUtilized}L`} color="blue" icon={<IndianRupee />} />
                <KpiCard title="Remaining Funds" value={`₹${remainingFunds}L`} color="amber" icon={<PieIcon />} />
                <KpiCard title="Verified Beneficiaries" value={totalVerified} color="green" icon={<Users />} />
                <KpiCard title="Highest Growth" value={`${highestGrowth.month} (${highestGrowth.growth.toFixed(1)}%)`} color="purple" icon={<TrendingUp />} />
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartGrid title="Monthly Fund Utilization">
                    <BarChartGraph data={monthlyData} highlight={selectedMonth} />
                </ChartGrid>

                <ChartGrid title="Verification Trend">
                    <VerificationChart data={monthlyData} />
                </ChartGrid>

                <ChartGrid title="Approval vs Rejection">
                    <ApprovalChart data={monthlyData} />
                </ChartGrid>

                <ChartGrid title="Scheme Categories">
                    <CategoryChart categoryData={[
                        { name: "Skill Development", value: 40 },
                        { name: "Income Generation", value: 35 },
                        { name: "Infrastructure Support", value: 15 },
                        { name: "Livelihood Training", value: 10 },
                    ]} />
                </ChartGrid>
            </div>

            {/* Growth Chart */}
            <ChartGrid title="Growth Rate">
                <GrowthChart data={monthlyData} />
            </ChartGrid>

        </div>
    );
};

// ---------------------------------------
// ⭐ LIVE INSIGHTS PANEL
// ---------------------------------------

const LiveInsights = ({ insights }) => (
    <div className="bg-white border shadow rounded-xl p-4 animate-fadeIn">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Activity className="text-green-600" />
            Live Insights
        </h2>

        <ul className="space-y-1 text-sm text-gray-700">
            <li>📈 Utilization increased by <b>{insights.utilizationChange}%</b> this cycle</li>
            <li>👥 Verified beneficiaries grew by <b>+{insights.verifiedChange}</b></li>
            <li>✔ Approval rate improved by <b>{insights.approvalChange}%</b></li>
            <li>🎓 Training participation increased by <b>+{insights.trainingChange}</b></li>
        </ul>

        <p className="text-xs text-gray-400 mt-2 italic">
            Auto-refreshing every 5 seconds…
        </p>
    </div>
);

// ---------------------------------------
// REUSABLE UI
// ---------------------------------------

const KpiCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow border hover:shadow-lg transition">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg text-${color}-600 bg-${color}-100`}>
                {icon}
            </div>
        </div>
    </div>
);

const ChartGrid = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow border my-4">
        <h3 className="font-bold text-gray-800 mb-4">{title}</h3>
        <div className="h-80">{children}</div>
    </div>
);

// ---------------------------------------
// RECHARTS
// ---------------------------------------

const BarChartGraph = ({ data, highlight }) => (
    <ResponsiveContainer>
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis unit="L" />
            <Tooltip />
            <Legend />

            <Bar dataKey="utilized" fill="#3b82f6">
                {data.map((entry, index) => (
                    <Cell key={index} fill={entry.month === highlight ? "#1d4ed8" : "#3b82f6"} />
                ))}
            </Bar>

            <Bar dataKey="allocated" fill="#d1d5db" />
        </BarChart>
    </ResponsiveContainer>
);

const VerificationChart = ({ data }) => (
    <ResponsiveContainer>
        <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area dataKey="verified" stroke="#00a851" strokeWidth={3} fillOpacity={0.4} fill="#00a851" />
        </AreaChart>
    </ResponsiveContainer>
);

const ApprovalChart = ({ data }) => (
    <ResponsiveContainer>
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="approved" fill="#00a851" />
            <Bar dataKey="rejected" fill="#ef4444" />
        </BarChart>
    </ResponsiveContainer>
);

const CategoryChart = ({ categoryData }) => (
    <ResponsiveContainer>
        <PieChart>
            <Pie data={categoryData} cx="50%" cy="50%" outerRadius={120} label dataKey="value">
                {categoryData.map((entry, index) => (
                    <Cell key={index} fill={["#00a851", "#3b82f6", "#f59e0b", "#ef4444"][index]} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    </ResponsiveContainer>
);

const GrowthChart = ({ data }) => (
    <ResponsiveContainer>
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis unit="%" />
            <Tooltip />
            <Line type="monotone" dataKey="growth" stroke="#8b5cf6" strokeWidth={3} />
        </LineChart>
    </ResponsiveContainer>
);

export default ProjectProgress;

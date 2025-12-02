import React from "react";
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
  CartesianGrid
} from "recharts";

const CentralStatePerformance = () => {

  // KPI CARDS
  const stats = [
    {
      label: "Total Beneficiaries Impacted",
      value: "10,450",
      icon: Users,
      color: "bg-blue-600",
      textColor: "text-blue-600",
    },
    {
      label: "Funds Utilized",
      value: "₹3.2 Cr",
      icon: IndianRupee,
      color: "bg-green-600",
      textColor: "text-green-600",
    },
    {
      label: "Avg. Income Growth",
      value: "18.6%",
      icon: TrendingUp,
      color: "bg-amber-600",
      textColor: "text-amber-600",
    },
    {
      label: "Satisfaction Score",
      value: "4.4/5",
      icon: Star,
      color: "bg-purple-600",
      textColor: "text-purple-600",
    },
  ];

  // PIE CHART DATA
  const categoryData = [
    { name: "Skill Training", value: 4200 },
    { name: "Entrepreneurship", value: 2700 },
    { name: "Financial Assistance", value: 750 },
  ];

  const PIE_COLORS = ["#22c55e", "#f59e0b", "#3b82f6", "#ef4444"];

  // STATE COMPARISON (LEFT BIG CHART)
  const stateComparisonData = [
    { name: "Odisha", beneficiaries: 420000, funds: 120, training: 78 },
    { name: "Karnataka", beneficiaries: 390000, funds: 105, training: 70 },
    { name: "Maharashtra", beneficiaries: 510000, funds: 150, training: 82 },
  ];

  // ⭐ NEW — GROWTH BY STATES (NOT SCHEME)
  const growthStateData = [
    { year: "2019", odisha: 40, karnataka: 25, maharashtra: 50 },
    { year: "2020", odisha: 65, karnataka: 40, maharashtra: 72 },
    { year: "2021", odisha: 95, karnataka: 55, maharashtra: 100 },
    { year: "2022", odisha: 125, karnataka: 75, maharashtra: 130 },
    { year: "2023", odisha: 155, karnataka: 95, maharashtra: 160 },
    { year: "2024", odisha: 185, karnataka: 120, maharashtra: 185 },
  ];

  // EMPLOYMENT CONVERSION
  const employmentData = [
    { state: "Odisha", conversion: 42 },
    { state: "Karnataka", conversion: 38 },
    { state: "Maharashtra", conversion: 51 },
  ];

  return (
    <div className="p-6 space-y-12">

      {/* HEADER */}
      <div>
        <h1 className="text-5xl font-extrabold text-gray-800">
          Scheme Impact Analysis
        </h1>
        <p className="text-2xl text-gray-600">
          Evaluate the effectiveness of PM-AJAY schemes across states
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 flex items-center justify-between"
          >
            <div>
              <p className="text-2xl text-gray-500">{s.label}</p>
              <h3 className="text-4xl font-bold mt-3">{s.value}</h3>
            </div>
            <div className={`h-16 w-16 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon size={40} className="text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* ⭐ MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT – STATE COMPARISON */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-10">
          <h3 className="text-4xl font-bold text-gray-800 mb-10">
            State Comparison Overview
          </h3>

          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 20 }} />
                <YAxis tick={{ fontSize: 20 }} />
                <Tooltip contentStyle={{ fontSize: 20 }} />
                <Legend wrapperStyle={{ fontSize: 24 }} />

                <Bar dataKey="beneficiaries" fill="#3b82f6" name="Beneficiaries" />
                <Bar dataKey="funds" fill="#10b981" name="Funds (Cr)" />
                <Bar dataKey="training" fill="#f59e0b" name="Training (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT — ⭐ NEW CHART (GROWTH OF STATES) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-4xl font-bold text-gray-800 mb-8">
            Growth of States by Scheme (Year-wise)
          </h3>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthStateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 18 }} />
                <YAxis tick={{ fontSize: 18 }} />
                <Tooltip contentStyle={{ fontSize: 20 }} />
                <Legend wrapperStyle={{ fontSize: 22 }} />

                <Line type="monotone" dataKey="odisha" stroke="#2563eb" strokeWidth={4} dot={{ r: 6 }} name="Odisha" />
                <Line type="monotone" dataKey="karnataka" stroke="#22c55e" strokeWidth={4} dot={{ r: 6 }} name="Karnataka" />
                <Line type="monotone" dataKey="maharashtra" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6 }} name="Maharashtra" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* PIE CHART */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-4xl font-bold text-gray-800 mb-8">
          Scheme Category Distribution
        </h3>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                label={{ fontSize: 18 }}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 20 }} />
              <Legend wrapperStyle={{ fontSize: 22 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* EMPLOYMENT CONVERSION */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10">
        <h3 className="text-4xl font-bold text-gray-800 mb-10">
          Employment Conversion Rate (%)
        </h3>

        <div className="h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={employmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" tick={{ fontSize: 20 }} />
              <YAxis tick={{ fontSize: 20 }} />
              <Tooltip contentStyle={{ fontSize: 20 }} />
              <Legend wrapperStyle={{ fontSize: 24 }} />

              <Line
                type="monotone"
                dataKey="conversion"
                stroke="#10b981"
                strokeWidth={5}
                dot={{ r: 8, strokeWidth: 3, fill: "white" }}
                name="Conversion Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default CentralStatePerformance;
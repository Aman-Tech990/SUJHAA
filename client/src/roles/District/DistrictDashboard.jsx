import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Users,
  IndianRupee,
  TrendingUp,
  Clock,
  FileCheck,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const DistrictDashboard = () => {
  const user = JSON.parse(localStorage.getItem("sujhaa-user"));
  const navigate = useNavigate();

  // ---------- APPLICATION DATA (BACKEND) ----------
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------- REALISTIC KPI VALUES ----------
  const stats = [
    {
      label: "Total Applications",
      value: 143,
      change: "+18%",
      icon: Users,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      label: "Pending Approval",
      value: 27,
      change: "Urgent",
      icon: Clock,
      color: "bg-amber-500",
      textColor: "text-amber-600",
    },
    {
      label: "Funds Disbursed",
      value: "₹58.2L",
      change: "79% of Goal",
      icon: IndianRupee,
      color: "bg-green-600",
      textColor: "text-green-700",
    },
    {
      label: "Avg. Feedback Score",
      value: "4.4/5",
      change: "+0.4",
      icon: TrendingUp,
      color: "bg-purple-500",
      textColor: "text-purple-700",
    },
  ];

  // ---------- BACKEND FETCH ----------
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/district/applications",
          { withCredentials: true }
        );

        setApplications(
          res.data.applications.map((a) => ({
            id: a.applicationRefId,
            name: a.beneficiaryName,
            schemeCategory: a.schemeCategory,
            fieldStatus: "Verified",
            date: new Date(a.appliedAt).toISOString().split("T")[0],
            status: "Pending",
          }))
        );

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load district applications");
      }
    };

    fetchApps();
  }, []);

  // ---------- REALISTIC PIE CHART DATA ----------
  const statusData = [
    { name: "Approved", value: 66 }, // 46%
    { name: "Rejected", value: 31 }, // 22%
    { name: "Pending", value: 46 }, // 32%
  ];

  const COLORS = ["#00a851", "#ef4444", "#f59e0b"];

  // ---------- REALISTIC MONTHLY TREND ----------
  const monthlyTrend = [
    { month: "Apr", verified: 22 },
    { month: "May", verified: 28 },
    { month: "Jun", verified: 35 },
    { month: "Jul", verified: 41 },
    { month: "Aug", verified: 50 },
    { month: "Sep", verified: 58 },
    { month: "Oct", verified: 66 },
    { month: "Nov", verified: 72 },
    { month: "Dec", verified: 40 },
  ];

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">Loading dashboard...</div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            District Overview
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back, Officer. Here is the latest progress report under
            PM–AJAY.
          </p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </h3>
              <span
                className={`text-xs font-medium ${stat.change.includes("Urgent")
                  ? "text-red-600"
                  : "text-green-600"
                  }`}
              >
                {stat.change}
              </span>
            </div>

            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
              <stat.icon size={24} className={stat.textColor} />
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT TABLE - BACKEND DATA */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h3 className="font-bold text-gray-800">Field Verified List</h3>
            <p className="text-xs text-gray-500">
              Applications verified by Field Officers.
            </p>
          </div>

          <table className="w-full text-sm text-left">
            <thead className="bg-white text-gray-500 border-b">
              <tr>
                <th className="px-6 py-3">Beneficiary</th>
                <th className="px-6 py-3">Scheme Type</th>
                <th className="px-6 py-3">Field Status</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {applications.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(`/districtOfficer/application/${item.id}`)
                  }
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-blue-600 hover:underline">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      Ref: {item.id}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {item.schemeCategory}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-1 rounded w-fit text-xs font-semibold">
                      <FileCheck size={14} /> Verified
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="text-yellow-600 font-semibold text-xs bg-yellow-100 px-2 py-1 rounded">
                      Pending
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT PIE CHART */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-bold text-gray-800 mb-4">
            Application Status Summary
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            Total Applications: 143
          </div>
        </div>
      </div>

      {/* MONTHLY VERIFICATION TREND */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-bold text-gray-800 mb-4">
          Monthly Verification Trend
        </h3>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="verified"
                stroke="#00a851"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DistrictDashboard;

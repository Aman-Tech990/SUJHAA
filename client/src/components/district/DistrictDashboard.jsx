import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import { FaUsers, FaMoneyBillWave, FaClipboardCheck, FaClock } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";

ChartJS.register(
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const DistrictDashboard = () => {
    // Simulated data — can be connected to backend later
    const [summary, setSummary] = useState({
        beneficiaries: 12840,
        fundsAllocated: 5600000,
        schemesActive: 8,
        pendingVerifications: 72,
    });

    const [fundUtilization, setFundUtilization] = useState({
        labels: ["Health", "Education", "Employment", "Housing", "Women Empowerment"],
        data: [70, 55, 80, 65, 50],
    });

    const [beneficiaryTrend, setBeneficiaryTrend] = useState({
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        data: [800, 1000, 1200, 1600, 1800, 2100, 2400, 2600],
    });

    const grievances = [
        { id: 1, name: "Fund Delay in Block A", status: "Pending" },
        { id: 2, name: "Verification not updated", status: "Resolved" },
        { id: 3, name: "Scheme eligibility issue", status: "Pending" },
        { id: 4, name: "Grievance not acknowledged", status: "Resolved" },
        { id: 5, name: "Form submission error", status: "Pending" },
    ];

    // Chart Data
    const pieData = {
        labels: fundUtilization.labels,
        datasets: [
            {
                data: fundUtilization.data,
                backgroundColor: [
                    "#4F46E5",
                    "#22C55E",
                    "#FACC15",
                    "#F97316",
                    "#EF4444",
                ],
                borderWidth: 1,
            },
        ],
    };

    const lineData = {
        labels: beneficiaryTrend.months,
        datasets: [
            {
                label: "Beneficiaries Added",
                data: beneficiaryTrend.data,
                borderColor: "#4F46E5",
                backgroundColor: "rgba(79,70,229,0.1)",
                fill: true,
                tension: 0.3,
            },
        ],
    };

    return (
        <div className="flex-1 p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome, District Officer — Khordha
                </h1>
                <p className="text-gray-500">Saturday, October 11, 2025</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-indigo-50 border-none">
                    <CardContent className="flex items-center justify-between p-5">
                        <div>
                            <p className="text-sm text-gray-500">Total Beneficiaries</p>
                            <h3 className="text-xl font-semibold text-gray-800">
                                {summary.beneficiaries.toLocaleString()}
                            </h3>
                        </div>
                        <FaUsers className="text-indigo-600 text-2xl" />
                    </CardContent>
                </Card>

                <Card className="bg-green-50 border-none">
                    <CardContent className="flex items-center justify-between p-5">
                        <div>
                            <p className="text-sm text-gray-500">Funds Allocated</p>
                            <h3 className="text-xl font-semibold text-gray-800">
                                ₹{(summary.fundsAllocated / 100000).toFixed(1)} L
                            </h3>
                        </div>
                        <FaMoneyBillWave className="text-green-600 text-2xl" />
                    </CardContent>
                </Card>

                <Card className="bg-yellow-50 border-none">
                    <CardContent className="flex items-center justify-between p-5">
                        <div>
                            <p className="text-sm text-gray-500">Schemes Active</p>
                            <h3 className="text-xl font-semibold text-gray-800">
                                {summary.schemesActive}
                            </h3>
                        </div>
                        <FaClipboardCheck className="text-yellow-500 text-2xl" />
                    </CardContent>
                </Card>

                <Card className="bg-red-50 border-none">
                    <CardContent className="flex items-center justify-between p-5">
                        <div>
                            <p className="text-sm text-gray-500">Pending Verifications</p>
                            <h3 className="text-xl font-semibold text-gray-800">
                                {summary.pendingVerifications}
                            </h3>
                        </div>
                        <FaClock className="text-red-500 text-2xl" />
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="p-4">
                        <h2 className="font-semibold text-lg mb-3 text-gray-700">
                            Fund Utilization by Scheme
                        </h2>
                        <Pie data={pieData} />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <h2 className="font-semibold text-lg mb-3 text-gray-700">
                            Monthly Beneficiary Growth
                        </h2>
                        <Line data={lineData} />
                    </CardContent>
                </Card>
            </div>

            {/* Grievances */}
            <Card>
                <CardContent className="p-4">
                    <h2 className="font-semibold text-lg mb-3 text-gray-700">
                        Recent Grievances
                    </h2>
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-500 border-b">
                            <tr>
                                <th className="py-2">#</th>
                                <th>Grievance</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grievances.map((g, i) => (
                                <tr
                                    key={g.id}
                                    className={`border-b ${g.status === "Resolved" ? "bg-green-50" : "bg-red-50"
                                        }`}
                                >
                                    <td className="py-2 px-2">{i + 1}</td>
                                    <td className="py-2 px-2">{g.name}</td>
                                    <td className="py-2 px-2 font-medium">
                                        {g.status === "Resolved" ? (
                                            <span className="text-green-600">Resolved</span>
                                        ) : (
                                            <span className="text-red-600">Pending</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
};

export default DistrictDashboard;

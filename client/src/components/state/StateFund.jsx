import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { FaFilePdf, FaBell, FaCheck } from "react-icons/fa";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const fundDataSample = [
    { district: "Bhubaneswar", allocated: 2.3, disbursed: 2.1 },
    { district: "Cuttack", allocated: 1.8, disbursed: 1.5 },
    { district: "Puri", allocated: 2.5, disbursed: 2.0 },
];

const monthWiseDisbursement = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
        {
            label: "Funds Disbursed (Cr)",
            data: [0.5, 0.8, 1.2, 1.5, 1.8, 2.0],
            borderColor: "#3b82f6",
            backgroundColor: "#3b82f6",
            tension: 0.3,
            fill: false,
        },
    ],
};

const StateFund = () => {
    const [fundData, setFundData] = useState(fundDataSample);
    const [aiAlerts, setAiAlerts] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setAiAlerts([
                { id: 1, message: "District Cuttack is under-utilizing funds (80%)", type: "warning" },
                { id: 2, message: "District Puri fund release delayed by 15 days", type: "alert" },
            ]);
        }, 500);
    }, []);

    const allocationChartData = {
        labels: fundData.map((d) => d.district),
        datasets: [
            { label: "Allocated Funds (Cr)", data: fundData.map((d) => d.allocated), backgroundColor: "#3b82f6" },
            { label: "Disbursed Funds (Cr)", data: fundData.map((d) => d.disbursed), backgroundColor: "#10b981" },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 20, bottom: 20, left: 10, right: 10 } }, // padding to center chart
        plugins: {
            legend: { position: "bottom", labels: { font: { size: 12 } } },
            tooltip: { mode: "index", intersect: false },
        },
        scales: {
            y: { beginAtZero: true },
            x: { ticks: { padding: 5 } },
        },
    };

    const totalAllocated = fundData.reduce((acc, d) => acc + d.allocated, 0).toFixed(2);
    const totalDisbursed = fundData.reduce((acc, d) => acc + d.disbursed, 0).toFixed(2);
    const remainingBalance = (totalAllocated - totalDisbursed).toFixed(2);
    const utilizationPct = ((totalDisbursed / totalAllocated) * 100).toFixed(1);

    const handleAction = (action) => alert(`${action} executed!`);

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-6 flex-1">
            <h2 className="text-2xl font-bold text-gray-800">Fund Allocation & Disbursement</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Total Funds Sanctioned", value: `₹ ${totalAllocated} Cr` },
                    { title: "Total Funds Disbursed", value: `₹ ${totalDisbursed} Cr` },
                    { title: "Remaining Balance", value: `₹ ${remainingBalance} Cr` },
                    { title: "% Utilization", value: `${utilizationPct} %` },
                ].map((card, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-lg shadow-md border">
                        <div className="text-gray-500 text-sm">{card.title}</div>
                        <div className="text-xl font-semibold mt-1">{card.value}</div>
                    </div>
                ))}
            </div>

            {/* District Table */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto min-w-[600px] border border-gray-200 bg-white rounded-lg shadow-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="py-2 px-3 text-left">District</th>
                            <th className="py-2 px-3 text-left">Allocated (Cr)</th>
                            <th className="py-2 px-3 text-left">Disbursed (Cr)</th>
                            <th className="py-2 px-3 text-left">Utilization %</th>
                            <th className="py-2 px-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fundData.map((d, idx) => {
                            const utilization = ((d.disbursed / d.allocated) * 100).toFixed(1);
                            const status = utilization >= 90 ? "On Track" : utilization >= 70 ? "At Risk" : "Delayed";
                            const statusColor = status === "On Track" ? "text-green-700" : status === "At Risk" ? "text-yellow-700" : "text-red-700";
                            return (
                                <tr key={idx} className="border-t hover:bg-gray-50 transition">
                                    <td className="py-2 px-3">{d.district}</td>
                                    <td className="py-2 px-3">{d.allocated}</td>
                                    <td className="py-2 px-3">{d.disbursed}</td>
                                    <td className="py-2 px-3">{utilization} %</td>
                                    <td className={`py-2 px-3 font-medium ${statusColor}`}>{status}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-4 h-80 flex flex-col justify-center">
                    <h3 className="font-semibold text-lg mb-2 text-center">Allocation vs Disbursement</h3>
                    <div className="flex-1">
                        <Bar data={allocationChartData} options={chartOptions} />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 h-80 flex flex-col justify-center">
                    <h3 className="font-semibold text-lg mb-2 text-center">Month-wise Disbursal Trend</h3>
                    <div className="flex-1">
                        <Line data={monthWiseDisbursement} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold text-lg mb-2">AI Suggestions</h3>
                {aiAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center gap-2 mb-2 p-2 border-l-4 border-yellow-500 bg-yellow-50 rounded-md text-sm">
                        <FaBell className="text-yellow-600" />
                        <span className="text-gray-800">{alert.message}</span>
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                {[
                    { label: "Approve Fund Release", color: "green", icon: <FaCheck /> },
                    { label: "Generate Report (PDF)", color: "blue", icon: <FaFilePdf /> },
                    { label: "Notify District Officer", color: "purple", icon: <FaBell /> },
                ].map((btn, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAction(btn.label)}
                        className={`flex items-center justify-center gap-2 flex-1 sm:flex-auto bg-${btn.color}-600 text-white px-4 py-2 rounded-lg hover:bg-${btn.color}-700 transition`}
                    >
                        {btn.icon} {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StateFund;

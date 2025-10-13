import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
} from "chart.js";
import { TrendingUp, Users, Wallet, BrainCircuit } from "lucide-react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const CentralDashBoard = () => {
    // Mock Data
    const fundData = {
        labels: ["Education", "Healthcare", "Infrastructure", "Training", "Welfare"],
        datasets: [
            {
                label: "Funds Utilized (in ₹ Lakhs)",
                data: [120, 150, 180, 90, 130],
                backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
            },
        ],
    };

    const trainingData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Training Completion %",
                data: [60, 72, 78, 81, 89, 93],
                borderColor: "#3b82f6",
                backgroundColor: "#93c5fd",
                fill: true,
                tension: 0.3,
            },
        ],
    };

    const sectorData = {
        labels: ["Rural", "Urban", "Semi-Urban"],
        datasets: [
            {
                label: "Beneficiary Distribution",
                data: [55, 30, 15],
                backgroundColor: ["#60a5fa", "#34d399", "#fbbf24"],
            },
        ],
    };

    return (
        <div className="flex-1 ml-[250px] p-6 bg-gray-50 min-h-screen mt-24">
            {/* Header */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Welcome, Central Officer!
            </h2>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-500">Total Beneficiaries</h3>
                        <Users className="text-blue-600" size={20} />
                    </div>
                    <p className="text-2xl font-semibold text-gray-800">1,24,560</p>
                    <span className="text-green-600 text-sm flex items-center mt-1">
                        <TrendingUp size={14} className="mr-1" /> +8.2% this quarter
                    </span>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-500">Funds Disbursed</h3>
                        <Wallet className="text-green-600" size={20} />
                    </div>
                    <p className="text-2xl font-semibold text-gray-800">₹8.7 Cr</p>
                    <span className="text-green-600 text-sm flex items-center mt-1">
                        <TrendingUp size={14} className="mr-1" /> +12.5% YoY
                    </span>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
                        <BrainCircuit className="text-purple-600" size={20} />
                    </div>
                    <p className="text-2xl font-semibold text-gray-800">42</p>
                    <span className="text-yellow-500 text-sm mt-1">3 nearing completion</span>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-500">AI Recommendations</h3>
                        <BrainCircuit className="text-indigo-600" size={20} />
                    </div>
                    <p className="text-2xl font-semibold text-gray-800">18</p>
                    <span className="text-blue-500 text-sm mt-1">4 new insights added</span>
                </div>
            </div>

            {/* Middle Section: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bar Chart */}
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Fund Allocation Overview</h3>
                    <Bar data={fundData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>

                {/* Line Chart */}
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Training Progress</h3>
                    <Line data={trainingData} options={{ responsive: true }} />
                </div>

                {/* Pie Chart */}
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Beneficiary Spread</h3>
                    <Pie data={sectorData} options={{ responsive: true }} />
                </div>
            </div>

            {/* Bottom Section: Insights */}
            <div className="bg-white mt-8 p-6 rounded-2xl shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">AI Insights Summary</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Districts with high fund utilization show 14% faster project completion.</li>
                    <li>• Rural training participation up by 11% in last quarter.</li>
                    <li>• Healthcare infrastructure expansion correlates with improved beneficiary outreach.</li>
                    <li>• Suggested: Reallocate 5% funds from low-impact zones to training initiatives.</li>
                </ul>
            </div>
        </div>
    );
};

export default CentralDashBoard;

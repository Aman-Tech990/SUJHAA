import React, { useState, useEffect } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { FaFileUpload, FaExclamationTriangle } from "react-icons/fa";

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

const trainingCentersSample = [
    { center: "CV Raman Center", course: "Welding", duration: "3 Months", enrolled: 50, completed: 32, status: "Ongoing" },
    { center: "Tech Skill Hub", course: "Electrical", duration: "2 Months", enrolled: 40, completed: 40, status: "Completed" },
    { center: "Skill India Academy", course: "Plumbing", duration: "1.5 Months", enrolled: 30, completed: 20, status: "Ongoing" },
];

const StateTraining = () => {
    const [trainingCenters, setTrainingCenters] = useState(trainingCentersSample);
    const [aiInsights, setAiInsights] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setAiInsights([
                { id: 1, message: "District Bhubaneswar → 15% dropout risk detected", type: "warning" },
                { id: 2, message: "District Puri → 10% dropout risk detected", type: "alert" },
            ]);
        }, 500);
    }, []);

    const completionData = {
        labels: ["Welding", "Electrical", "Plumbing"],
        datasets: [
            {
                data: [64, 100, 66],
                backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
            },
        ],
    };

    const monthlyGrowthData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Beneficiaries Trained",
                data: [30, 50, 60, 80, 90, 100],
                borderColor: "#3b82f6",
                backgroundColor: "#3b82f6",
                tension: 0.3,
                fill: false,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: { font: { size: 12 } }
            }
        },
        scales: { y: { beginAtZero: true }, x: { ticks: { padding: 5 } } },
    };

    const totalCenters = trainingCenters.length;
    const totalBatches = trainingCenters.length;
    const totalTrained = trainingCenters.reduce((acc, c) => acc + c.completed, 0);

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen flex-1">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Training & Skill Development</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-white rounded-lg shadow-md border">
                    <div className="text-gray-500 text-sm">Active Centers</div>
                    <div className="text-2xl font-semibold mt-2">{totalCenters}</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-md border">
                    <div className="text-gray-500 text-sm">Ongoing Batches</div>
                    <div className="text-2xl font-semibold mt-2">{totalBatches}</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-md border">
                    <div className="text-gray-500 text-sm">Beneficiaries Trained</div>
                    <div className="text-2xl font-semibold mt-2">{totalTrained}</div>
                </div>
            </div>

            {/* Batch Tracker Table */}
            <div className="overflow-x-auto mb-8">
                <table className="w-full table-auto min-w-[700px] border border-gray-200 bg-white rounded-lg shadow-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="py-3 px-4 text-left">Center</th>
                            <th className="py-3 px-4 text-left">Course</th>
                            <th className="py-3 px-4 text-left">Duration</th>
                            <th className="py-3 px-4 text-left">Enrolled</th>
                            <th className="py-3 px-4 text-left">Completed</th>
                            <th className="py-3 px-4 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainingCenters.map((c, idx) => {
                            const statusColor = c.status === "Completed" ? "text-green-700" : "text-yellow-700";
                            return (
                                <tr key={idx} className="border-t hover:bg-gray-50 transition">
                                    <td className="py-2 px-4">{c.center}</td>
                                    <td className="py-2 px-4">{c.course}</td>
                                    <td className="py-2 px-4">{c.duration}</td>
                                    <td className="py-2 px-4">{c.enrolled}</td>
                                    <td className="py-2 px-4">{c.completed}</td>
                                    <td className={`py-2 px-4 font-medium ${statusColor}`}>{c.status}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-4 flex flex-col" style={{ minHeight: "350px" }}>
                    <h3 className="font-semibold text-lg mb-4">Completion by Skill Domain</h3>
                    <div className="flex-1">
                        <Pie data={completionData} options={chartOptions} />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 flex flex-col" style={{ minHeight: "350px" }}>
                    <h3 className="font-semibold text-lg mb-4">Monthly Training Growth</h3>
                    <div className="flex-1">
                        <Line data={monthlyGrowthData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <FaFileUpload className="text-2xl text-blue-600" />
                <div className="flex-1">
                    <label className="block text-gray-700 font-medium mb-2">Upload Attendance / Feedback</label>
                    <input type="file" className="border rounded-lg p-2 w-full sm:w-auto" accept=".csv, .xlsx, .xls" />
                </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-8">
                <h3 className="font-semibold text-lg mb-4">AI Insights</h3>
                {aiInsights.map((alert) => (
                    <div key={alert.id} className="flex items-center gap-3 mb-3 p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded-md text-sm">
                        <FaExclamationTriangle className="text-yellow-600 text-lg" />
                        <span className="text-gray-800">{alert.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StateTraining;

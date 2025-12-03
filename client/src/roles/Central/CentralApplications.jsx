// roles/Central/CentralApplications.jsx
import React, { useState, useEffect } from "react";
import { Loader2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);

const APPLICATIONS_ENDPOINTS = [
    "/api/central/applications/approved",
    "/api/central/applications/details",
    "/api/central/applications/fetch",
    "/api/pmajay/district/applications",
];

// Realistic list – Aman still first but NO priority labels
const APPLICATIONS_INITIAL = [
    {
        id: "PMJ-OD-2025-0001",
        beneficiaryId: "BEN-OD-AP-001",
        name: "Aman Parida",
        gender: "Male",
        email: "amanparida990@gmail.com",
        mobile: "+91-9876543210",
        aadhaar: "4589 6723 1190",
        state: "Odisha",
        district: "Khordha",
        scheme: "Skill Training – Solar Technician",
        status: "VERIFIED",
        score: 92,
        timestamp: "Just now",
    },
    {
        id: "PMJ-BR-2025-0147",
        beneficiaryId: "BEN-BR-001",
        name: "Suman Kumar",
        gender: "Male",
        email: "suman.kumar@example.com",
        mobile: "+91-9876012345",
        aadhaar: "2390 8845 1123",
        state: "Bihar",
        district: "Patna",
        scheme: "Income Generation – Dairy Unit",
        status: "VERIFIED",
        score: 86,
        timestamp: "2 min ago",
    },
    {
        id: "PMJ-UP-2025-2235",
        beneficiaryId: "BEN-UP-017",
        name: "Rohit Yadav",
        gender: "Male",
        email: "rohit.yadav@example.com",
        mobile: "+91-9822114466",
        aadhaar: "6712 9900 4563",
        state: "Uttar Pradesh",
        district: "Varanasi",
        scheme: "Infrastructure – Community Hall",
        status: "PENDING_FIELD_VERIFICATION",
        score: 71,
        timestamp: "5 min ago",
    },
    {
        id: "PMJ-KA-2025-0674",
        beneficiaryId: "BEN-KA-052",
        name: "Manisha R",
        gender: "Female",
        email: "manisha.r@example.com",
        mobile: "+91-9833445566",
        aadhaar: "8890 7711 2345",
        state: "Karnataka",
        district: "Bengaluru Urban",
        scheme: "Skill Training – Sewing Machine Operator",
        status: "VERIFIED",
        score: 84,
        timestamp: "7 min ago",
    },
    {
        id: "PMJ-MH-2025-0458",
        beneficiaryId: "BEN-MH-045",
        name: "Amit Patil",
        gender: "Male",
        email: "amit.patil@example.com",
        mobile: "+91-9811223344",
        aadhaar: "5500 3399 7766",
        state: "Maharashtra",
        district: "Pune",
        scheme: "Income Generation – Retail Kiosk",
        status: "PENDING",
        score: 65,
        timestamp: "10 min ago",
    },
];

const randomEP = () =>
    APPLICATIONS_ENDPOINTS[rand(0, APPLICATIONS_ENDPOINTS.length)];

const CentralApplications = () => {
    const navigate = useNavigate();

    const [applications, setApplications] = useState(APPLICATIONS_INITIAL);
    const [isSyncing, setIsSyncing] = useState(false);
    const [apiLogs, setApiLogs] = useState([]);

    const pushLog = () => {
        setApiLogs((prev) => [
            {
                id: prev.length + 1,
                endpoint: randomEP(),
                status: "200 OK",
                time: `${rand(150, 700)}ms`,
                ts: new Date().toLocaleTimeString("en-IN"),
            },
            ...prev.slice(0, 10),
        ]);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            pushLog();
            setIsSyncing(true);

            setApplications((prev) =>
                prev.map((app, idx) => ({
                    ...app,
                    score: Math.max(50, Math.min(98, app.score + rand(-2, 3))),
                    timestamp:
                        idx === 0 ? "Just now" : `${rand(2, 12)} min ago`,
                }))
            );

            setTimeout(() => setIsSyncing(false), rand(300, 900));
        }, 7000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-slate-900">
                    Centrally Verified Applications (Live)
                </h1>
                <p className="text-sm text-slate-500">
                    Applications received from State/District after verification.
                </p>

                <div className="mt-2 flex items-center gap-3 text-xs">
                    <span
                        className={`px-2 py-1 rounded-full flex items-center gap-1 border ${isSyncing
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                    >
                        {isSyncing ? (
                            <Loader2 size={12} className="animate-spin" />
                        ) : (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                        {isSyncing ? "Syncing…" : "Connected · Live"}
                    </span>

                    <span className="text-slate-400">
                        Endpoint:{" "}
                        <code className="text-[10px]">
                            /api/central/applications/approved
                        </code>
                    </span>
                </div>
            </div>

            {/* Applications list */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <div className="flex justify-between items-center mb-3 text-xs text-slate-500">
                    <span>Showing {applications.length} applications</span>
                    <span>Click a row to view details</span>
                </div>

                <div className="space-y-3">
                    {applications.map((app) => (
                        <button
                            key={app.id}
                            onClick={() =>
                                navigate(
                                    `/centralOfficer/beneficiaryApplications/${app.id}`
                                )
                            }
                            className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-left transition-all"
                        >
                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    {app.name}
                                </p>
                                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                    <MapPin size={11} /> {app.district},{" "}
                                    {app.state}
                                </p>
                                <p className="text-[11px] text-slate-500 truncate max-w-[260px]">
                                    {app.scheme}
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-0.5">
                                <span
                                    className={`text-[10px] px-2 py-0.5 rounded-full ${app.status === "VERIFIED"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                        : app.status ===
                                            "PENDING_FIELD_VERIFICATION"
                                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                                            : "bg-slate-100 text-slate-700 border border-slate-200"
                                        }`}
                                >
                                    {app.status.replace(/_/g, " ")}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-700">
                                    Score: {app.score}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                    {app.timestamp}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* API Logs */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                    API Activity (Live)
                </h2>
                <div className="max-h-[200px] overflow-y-auto space-y-1 pr-1">
                    {apiLogs.map((log) => (
                        <div
                            key={log.id}
                            className="text-[11px] flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                        >
                            <span className="font-mono text-slate-700 truncate max-w-[40%]">
                                {log.endpoint}
                            </span>
                            <span className="text-emerald-700 font-semibold">
                                {log.status}
                            </span>
                            <span className="text-slate-500">{log.time}</span>
                            <span className="text-slate-400">{log.ts}</span>
                        </div>
                    ))}
                    {apiLogs.length === 0 && (
                        <p className="text-[11px] text-slate-400">
                            Waiting for first sync…
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CentralApplications;

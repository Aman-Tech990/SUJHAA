// roles/Central/CentralBeneficiaryApproval.jsx
import React, { useEffect, useState } from "react";
import {
    Loader2,
    MapPin,
    CheckCircle2,
    AlertCircle,
    User2,
    IndianRupee,
    ShieldCheck,
    Building2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Same base applications as list – no photo, full Aadhaar, only district & state matter
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
        risk: "Low",
        requestedAmount: 42000,
        recommendedAmount: 40000,
        dbtStatus: "PENDING",
        trainingStatus: "NOT_ASSIGNED",
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
        risk: "Medium",
        requestedAmount: 80000,
        recommendedAmount: 75000,
        dbtStatus: "PENDING",
        trainingStatus: "NOT_REQUIRED",
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
        risk: "Medium",
        requestedAmount: 250000,
        recommendedAmount: 220000,
        dbtStatus: "ON_HOLD",
        trainingStatus: "NOT_APPLICABLE",
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
        risk: "Low",
        requestedAmount: 30000,
        recommendedAmount: 28000,
        dbtStatus: "PENDING",
        trainingStatus: "NOT_ASSIGNED",
    },
];

// Training centers – we will filter by state/district
const TRAINING_CENTERS = [
    {
        id: "TC-OD-KHR-01",
        name: "CV Raman Skill Academy – Bhubaneswar",
        state: "Odisha",
        district: "Khordha",
        trades: ["Solar Technician", "Electrician", "Plumber"],
        seatsTotal: 120,
        seatsFilled: 96,
        nextBatch: "15 Dec 2025",
    },
    {
        id: "TC-OD-KHR-03",
        name: "ITI Patia – Renewable Energy Lab",
        state: "Odisha",
        district: "Khordha",
        trades: ["Solar Technician", "Wireman"],
        seatsTotal: 80,
        seatsFilled: 72,
        nextBatch: "10 Jan 2026",
    },
    {
        id: "TC-BR-PTN-01",
        name: "Patna Livelihood Training Center",
        state: "Bihar",
        district: "Patna",
        trades: ["Dairy Management", "Agri-Entrepreneur"],
        seatsTotal: 100,
        seatsFilled: 81,
        nextBatch: "5 Jan 2026",
    },
    {
        id: "TC-KA-BLR-09",
        name: "Bengaluru Skill Hub – Women ITI",
        state: "Karnataka",
        district: "Bengaluru Urban",
        trades: ["Sewing Operator", "Retail Associate"],
        seatsTotal: 140,
        seatsFilled: 105,
        nextBatch: "20 Dec 2025",
    },
];

const API_ENDPOINTS = [
    "/api/pmajay/applications/dbt/approve",
    "/api/pmajay/applications/dbt/status",
    "/api/pmajay/applications/training-centers",
];

const CentralBeneficiaryApproval = () => {
    const { appId } = useParams();
    const navigate = useNavigate();

    const [applications, setApplications] = useState(APPLICATIONS_INITIAL);
    const [selectedAppId, setSelectedAppId] = useState(
        appId || APPLICATIONS_INITIAL[0].id
    );

    const [dbtProcessing, setDbtProcessing] = useState(false);
    const [dbtStatusMessage, setDbtStatusMessage] = useState("");
    const [centerAssigning, setCenterAssigning] = useState(false);
    const [apiLogs, setApiLogs] = useState([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    const selectedApplication = applications.find((a) => a.id === selectedAppId);

    // keep state in sync with URL
    useEffect(() => {
        if (appId) setSelectedAppId(appId);
    }, [appId]);

    const randomEndpoint = () =>
        API_ENDPOINTS[rand(0, API_ENDPOINTS.length - 1)];

    const pushLog = (custom) => {
        const base = {
            endpoint: randomEndpoint(),
            status: "200 OK",
            time: `${rand(120, 900)}ms`,
            ts: new Date().toLocaleTimeString("en-IN"),
        };
        const log = custom ? { ...base, ...custom } : base;
        setApiLogs((prev) => [log, ...prev.slice(0, 18)]);
    };

    // small live effect for realism
    useEffect(() => {
        const interval = setInterval(() => {
            setIsSyncing(true);
            pushLog();
            setApplications((prev) =>
                prev.map((app) => ({
                    ...app,
                    score: Math.max(50, Math.min(98, app.score + rand(-1, 1))),
                }))
            );
            setLastUpdate(new Date());
            setTimeout(() => setIsSyncing(false), rand(300, 800));
        }, 9000);

        return () => clearInterval(interval);
    }, []);

    const handleApproveDbt = () => {
        if (!selectedApplication) return;
        if (selectedApplication.dbtStatus === "DISBURSED") return;

        setDbtProcessing(true);
        setDbtStatusMessage("Initiating DBT through PFMS…");

        pushLog({
            endpoint: "/api/pmajay/applications/dbt/approve",
            status: "202 ACCEPTED",
        });

        setTimeout(() => {
            setDbtStatusMessage(
                "Verifying Aadhaar and bank seeding with NPCI & PFMS…"
            );
            pushLog({
                endpoint: "/api/pmajay/applications/dbt/status",
                status: "200 OK",
            });
        }, 900);

        setTimeout(() => {
            setDbtProcessing(false);
            setDbtStatusMessage("DBT successfully credited to beneficiary account.");

            setApplications((prev) =>
                prev.map((app) =>
                    app.id === selectedApplication.id
                        ? { ...app, dbtStatus: "DISBURSED" }
                        : app
                )
            );

            pushLog({
                endpoint: "/api/pmajay/applications/dbt/status",
                status: "200 OK",
            });
        }, 2300);
    };

    const handleAssignCenter = (centerId) => {
        if (!selectedApplication) return;
        if (selectedApplication.dbtStatus !== "DISBURSED") return;

        setCenterAssigning(true);
        pushLog({
            endpoint: "/api/pmajay/applications/training-centers",
            status: "202 ACCEPTED",
        });

        setTimeout(() => {
            setCenterAssigning(false);
            setApplications((prev) =>
                prev.map((app) =>
                    app.id === selectedApplication.id
                        ? {
                            ...app,
                            trainingStatus: "ASSIGNED",
                            assignedCenterId: centerId,
                        }
                        : app
                )
            );

            pushLog({
                endpoint: "/api/pmajay/applications/training-centers",
                status: "200 OK",
            });
        }, 1500);
    };

    const getAssignedCenter = () => {
        if (!selectedApplication || !selectedApplication.assignedCenterId) return null;
        return TRAINING_CENTERS.find(
            (c) => c.id === selectedApplication.assignedCenterId
        );
    };

    const assignedCenter = getAssignedCenter();

    const eligibleCenters =
        selectedApplication &&
        TRAINING_CENTERS.filter(
            (c) =>
                c.state === selectedApplication.state ||
                c.district === selectedApplication.district
        );

    return (
        <div className="p-8 bg-slate-50 min-h-screen space-y-6">
            {/* Top bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        Central Approval · DBT & Training (Live)
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        SUJHAA is simulating a real PFMS+PM-AJAY approval flow for the
                        selected beneficiary.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-1 text-xs">
                    <div
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
                        {isSyncing ? "Syncing with SUJHAA Central MIS…" : "Connected · Live"}
                    </div>
                    <p className="text-[10px] text-slate-400">
                        Last sync:{" "}
                        {lastUpdate.toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        })}{" "}
                        IST
                    </p>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="text-xs text-slate-500 flex items-center gap-1">
                <button
                    onClick={() =>
                        navigate("/centralOfficer/beneficiaryApplications")
                    }
                    className="underline hover:text-slate-700"
                >
                    Applications List
                </button>
                <span>/</span>
                <span className="font-mono text-slate-700">
                    {selectedApplication ? selectedApplication.id : "—"}
                </span>
            </div>

            {/* Layout: left details + right actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Beneficiary details */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        {selectedApplication ? (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-orange-100">
                                            <User2 className="text-orange-600" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">
                                                {selectedApplication.name}
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                Application ID: {selectedApplication.id}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] text-slate-500">
                                            Gender: <span className="font-semibold">{selectedApplication.gender}</span>
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                            Aadhaar:{" "}
                                            <span className="font-mono font-semibold">
                                                {selectedApplication.aadhaar}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                    <div className="text-xs space-y-1">
                                        <p className="text-slate-500">
                                            <span className="font-semibold text-slate-700">
                                                District:
                                            </span>{" "}
                                            {selectedApplication.district}
                                        </p>
                                        <p className="text-slate-500">
                                            <span className="font-semibold text-slate-700">
                                                State:
                                            </span>{" "}
                                            {selectedApplication.state}
                                        </p>
                                        <p className="text-slate-500">
                                            <span className="font-semibold text-slate-700">
                                                Email:
                                            </span>{" "}
                                            {selectedApplication.email}
                                        </p>
                                        <p className="text-slate-500">
                                            <span className="font-semibold text-slate-700">
                                                Mobile:
                                            </span>{" "}
                                            {selectedApplication.mobile}
                                        </p>
                                    </div>
                                    <div className="text-xs space-y-1">
                                        <p className="text-slate-500">
                                            <span className="font-semibold text-slate-700">
                                                Scheme:
                                            </span>{" "}
                                            {selectedApplication.scheme}
                                        </p>
                                        <p className="text-slate-500">
                                            <span className="font-semibold text-slate-700">
                                                Current Status:
                                            </span>{" "}
                                            {selectedApplication.status.replace(/_/g, " ")}
                                        </p>
                                        <p className="text-slate-500 flex items-center gap-1">
                                            <MapPin size={12} className="text-slate-500" />
                                            {selectedApplication.district}, {selectedApplication.state}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                                        <p className="text-[10px] text-slate-500 uppercase font-semibold">
                                            AI Eligibility Score
                                        </p>
                                        <p className="text-lg font-bold text-emerald-600">
                                            {selectedApplication.score}/100
                                        </p>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                                        <p className="text-[10px] text-slate-500 uppercase font-semibold">
                                            Socio-economic Risk
                                        </p>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {selectedApplication.risk}
                                        </p>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                                        <p className="text-[10px] text-slate-500 uppercase font-semibold">
                                            Requested Amount
                                        </p>
                                        <p className="text-sm font-bold text-slate-900 flex items-center gap-1">
                                            <IndianRupee size={12} />
                                            {selectedApplication.requestedAmount.toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                                        <p className="text-[10px] text-slate-500 uppercase font-semibold">
                                            Recommended DBT
                                        </p>
                                        <p className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                                            <IndianRupee size={12} />
                                            {selectedApplication.recommendedAmount.toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-slate-200 space-y-1">
                                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                        <ShieldCheck size={12} className="text-emerald-600" />
                                        Field and District verification already completed via SUJHAA.
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                        Geo-tagged house verification, live photo face-match and document
                                        checks (caste, income) were successful at lower levels.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-xs text-slate-400">
                                No application selected. Go back to the list and select one.
                            </p>
                        )}
                    </div>

                    {/* Small timeline bar for DBT + Training */}
                    {selectedApplication && (
                        <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs flex flex-col gap-2">
                            <p className="font-semibold text-slate-800 mb-1">
                                Approval Journey
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> State Approved
                                </span>
                                <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> District Recommended
                                </span>
                                <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Central Screening
                                </span>
                                <span
                                    className={`px-2 py-1 rounded-full border flex items-center gap-1 ${selectedApplication.dbtStatus === "DISBURSED"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                        }`}
                                >
                                    <IndianRupee size={12} />
                                    {selectedApplication.dbtStatus === "DISBURSED"
                                        ? "DBT Credited"
                                        : "DBT Pending"}
                                </span>
                                {selectedApplication.trainingStatus &&
                                    selectedApplication.trainingStatus !== "NOT_APPLICABLE" && (
                                        <span
                                            className={`px-2 py-1 rounded-full border flex items-center gap-1 ${selectedApplication.trainingStatus === "ASSIGNED"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                : "bg-slate-50 text-slate-700 border-slate-200"
                                                }`}
                                        >
                                            <Building2 size={12} />
                                            {selectedApplication.trainingStatus === "ASSIGNED"
                                                ? "Training Center Assigned"
                                                : "Training Assignment Pending"}
                                        </span>
                                    )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: DBT + Training */}
                <div className="space-y-4">
                    {/* DBT card */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <IndianRupee size={16} className="text-emerald-600" />
                                <p className="text-sm font-semibold text-slate-900">
                                    DBT Disbursement (PFMS)
                                </p>
                            </div>
                            <span className="text-[10px] text-slate-400">
                                Linked with PFMS (simulated)
                            </span>
                        </div>

                        {selectedApplication && (
                            <>
                                <p className="text-[11px] text-slate-500 mb-2">
                                    Current DBT status:{" "}
                                    <span
                                        className={`font-semibold ${selectedApplication.dbtStatus === "DISBURSED"
                                            ? "text-emerald-700"
                                            : selectedApplication.dbtStatus === "ON_HOLD"
                                                ? "text-amber-700"
                                                : "text-slate-800"
                                            }`}
                                    >
                                        {selectedApplication.dbtStatus}
                                    </span>
                                </p>

                                <button
                                    onClick={handleApproveDbt}
                                    disabled={
                                        dbtProcessing || selectedApplication.dbtStatus === "DISBURSED"
                                    }
                                    className={`w-full flex items-center justify-center gap-2 text-sm font-semibold rounded-lg px-3 py-2 mt-1 transition ${selectedApplication.dbtStatus === "DISBURSED"
                                        ? "bg-emerald-100 text-emerald-700 cursor-default"
                                        : "bg-[#FF7A00] text-white hover:bg-orange-600"
                                        } disabled:opacity-70`}
                                >
                                    {dbtProcessing ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Processing DBT…
                                        </>
                                    ) : selectedApplication.dbtStatus === "DISBURSED" ? (
                                        <>
                                            <CheckCircle2 size={14} />
                                            DBT Credited
                                        </>
                                    ) : (
                                        <>
                                            <IndianRupee size={14} />
                                            Approve & Disburse DBT
                                        </>
                                    )}
                                </button>

                                {dbtStatusMessage && (
                                    <p className="mt-2 text-[11px] text-slate-500">
                                        {dbtStatusMessage}
                                    </p>
                                )}

                                {selectedApplication.dbtStatus === "ON_HOLD" && (
                                    <p className="mt-2 text-[11px] text-amber-600 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        DBT is currently on hold due to field verification pending.
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    {/* Training center assignment */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Building2 size={16} className="text-sky-600" />
                                <p className="text-sm font-semibold text-slate-900">
                                    Training Center Assignment
                                </p>
                            </div>
                            <span className="text-[10px] text-slate-400">
                                /api/pmajay/training-centers
                            </span>
                        </div>

                        {!selectedApplication && (
                            <p className="text-xs text-slate-400">
                                Select an application first.
                            </p>
                        )}

                        {selectedApplication &&
                            selectedApplication.trainingStatus === "NOT_REQUIRED" && (
                                <p className="text-[11px] text-slate-500">
                                    Training not applicable for this scheme. Only DBT disbursement is
                                    required.
                                </p>
                            )}

                        {selectedApplication &&
                            selectedApplication.trainingStatus !== "NOT_REQUIRED" && (
                                <>
                                    {selectedApplication.dbtStatus !== "DISBURSED" && (
                                        <p className="text-[11px] text-slate-500 mb-2 flex items-center gap-1">
                                            <AlertCircle size={12} className="text-amber-600" />
                                            Complete DBT disbursement first, then assign a training center.
                                        </p>
                                    )}

                                    {assignedCenter && (
                                        <div className="border border-emerald-200 rounded-lg p-3 bg-emerald-50/70 mb-3">
                                            <p className="text-[11px] text-emerald-700 font-semibold mb-1 flex items-center gap-1">
                                                <CheckCircle2 size={13} /> Training Center Assigned
                                            </p>
                                            <p className="text-xs font-semibold text-slate-900">
                                                {assignedCenter.name}
                                            </p>
                                            <p className="text-[11px] text-slate-600">
                                                {assignedCenter.district}, {assignedCenter.state} · Next
                                                batch: {assignedCenter.nextBatch}
                                            </p>
                                            <p className="text-[11px] text-slate-500 mt-1">
                                                Seats: {assignedCenter.seatsFilled}/
                                                {assignedCenter.seatsTotal} filled · Trades:{" "}
                                                {assignedCenter.trades.join(", ")}
                                            </p>
                                        </div>
                                    )}

                                    {selectedApplication.dbtStatus === "DISBURSED" && (
                                        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                                            {eligibleCenters && eligibleCenters.length > 0 ? (
                                                eligibleCenters.map((center) => {
                                                    const seatsLeft =
                                                        center.seatsTotal - center.seatsFilled;
                                                    const isAssigned =
                                                        selectedApplication.assignedCenterId === center.id;

                                                    return (
                                                        <div
                                                            key={center.id}
                                                            className={`border rounded-lg p-2.5 text-xs flex items-start justify-between gap-2 ${isAssigned
                                                                ? "border-emerald-500 bg-emerald-50/70"
                                                                : "border-slate-200 bg-slate-50"
                                                                }`}
                                                        >
                                                            <div>
                                                                <p className="font-semibold text-slate-900 text-[12px]">
                                                                    {center.name}
                                                                </p>
                                                                <p className="text-[11px] text-slate-500">
                                                                    {center.district}, {center.state}
                                                                </p>
                                                                <p className="text-[11px] text-slate-500">
                                                                    Trades: {center.trades.join(", ")}
                                                                </p>
                                                                <p className="text-[11px] text-slate-500">
                                                                    Seats left:{" "}
                                                                    <span
                                                                        className={
                                                                            seatsLeft < 10
                                                                                ? "text-rose-600 font-semibold"
                                                                                : "text-emerald-700 font-semibold"
                                                                        }
                                                                    >
                                                                        {seatsLeft}
                                                                    </span>{" "}
                                                                    · Next batch: {center.nextBatch}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleAssignCenter(center.id)}
                                                                disabled={centerAssigning || isAssigned}
                                                                className={`px-2 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${isAssigned
                                                                    ? "bg-emerald-600 text-white"
                                                                    : "bg-slate-900 text-white hover:bg-slate-700"
                                                                    } disabled:opacity-60`}
                                                            >
                                                                {isAssigned
                                                                    ? "Assigned"
                                                                    : centerAssigning
                                                                        ? "Assigning…"
                                                                        : "Assign"}
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-[11px] text-slate-400">
                                                    No nearby training centers configured for this state/district.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                    </div>
                </div>
            </div>

            {/* API Logs */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                    API Activity (Simulated – DBT & Training)
                </h2>
                <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
                    {apiLogs.map((log, idx) => (
                        <div
                            key={idx}
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
                            Waiting for the first DBT / training action to log activity…
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CentralBeneficiaryApproval;

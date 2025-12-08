import React, { useEffect, useState } from "react";
import {
    GraduationCap,
    MapPin,
    Clock,
    AlertTriangle,
    CheckCircle2,
    X,
    Loader2,
    Activity
} from "lucide-react";

/* =========================
   CONSTANTS & THEME
========================= */
const THEME = {
    primary: "#FF7A00",
    primaryDark: "#E65F00",
    soft: "#FFF3E6",
    bg: "#F9FAFB",
    card: "#FFFFFF",
    border: "#FFE0BF",
    text: "#111827",
    muted: "#6B7280"
};

const SLA_LIMIT_HOURS = 48;
const NOW = Date.now();

/* =========================
   MOCK “BACKEND” DATA
========================= */
const MOCK_APPLICATIONS = [
    {
        id: "APP-001",
        beneficiary: "Aman Parida",
        digitalId: "SUJHAA-OD-0001",
        scheme: "PM-AJAY Skill Training",
        category: "Skill Development",
        village: "Somnathpur",
        block: "Balianta",
        district: "Khordha",
        centralApprovedAt: NOW - 1000 * 60 * 60 * 38,
        status: "PENDING",
        assignedCenter: null,
        impactScore: 72
    },
    {
        id: "APP-002",
        beneficiary: "Rakesh Kumar",
        digitalId: "SUJHAA-OD-0002",
        scheme: "PM-AJAY Livelihood",
        category: "Income Generation",
        village: "Kalinga Nagar",
        block: "Jatni",
        district: "Khordha",
        centralApprovedAt: NOW - 1000 * 60 * 60 * 20,
        status: "ASSIGNED",
        assignedCenter: "Khordha ITI Training Center",
        impactScore: 81
    },
    {
        id: "APP-003",
        beneficiary: "Mamata Sahu",
        digitalId: "SUJHAA-OD-0003",
        scheme: "PM-AJAY Tailoring",
        category: "Women Empowerment",
        village: "Udayagiri",
        block: "Chandaka",
        district: "Khordha",
        centralApprovedAt: NOW - 1000 * 60 * 60 * 44, // near SLA risk
        status: "PENDING",
        assignedCenter: null,
        impactScore: 65
    },
    {
        id: "APP-004",
        beneficiary: "Bikash Nayak",
        digitalId: "SUJHAA-OD-0004",
        scheme: "PM-AJAY Electrical Training",
        category: "Skill Development",
        village: "Patia",
        block: "Bhubaneswar",
        district: "Khordha",
        centralApprovedAt: NOW - 1000 * 60 * 60 * 10,
        status: "PENDING",
        assignedCenter: null,
        impactScore: 55
    },
    {
        id: "APP-005",
        beneficiary: "Kanchan Das",
        digitalId: "SUJHAA-OD-0005",
        scheme: "PM-AJAY Beauty & Wellness",
        category: "Women Empowerment",
        village: "Nimapara",
        block: "Nimapara",
        district: "Puri",
        centralApprovedAt: NOW - 1000 * 60 * 60 * 30,
        status: "ASSIGNED",
        assignedCenter: "Women Skill Hub – Khordha",
        impactScore: 89
    },
    {
        id: "APP-006",
        beneficiary: "Sunil Mahanta",
        digitalId: "SUJHAA-OD-0006",
        scheme: "PM-AJAY Dairy Livelihood",
        category: "Income Generation",
        village: "Jankia",
        block: "Begunia",
        district: "Khordha",
        centralApprovedAt: NOW - 1000 * 60 * 60 * 50, // SLA risk
        status: "PENDING",
        assignedCenter: null,
        impactScore: 48
    },
    {
        id: "APP-007",
        beneficiary: "Pratibha Rout",
        digitalId: "SUJHAA-OD-0007",
        scheme: "PM-AJAY Tailoring",
        category: "Women Empowerment",
        village: "Jatni Town",
        block: "Jatni",
        district: "Khordha",
        centralApprovedAt: NOW - 1000 * 60 * 60 * 5,
        status: "PENDING",
        assignedCenter: null,
        impactScore: 60
    },
    {
        id: "APP-008",
        beneficiary: "Ashok Sethi",
        digitalId: "SUJHAA-OD-0008",
        scheme: "PM-AJAY Skill Training",
        category: "Skill Development",
        village: "Tamando",
        block: "Bhubaneswar",
        district: "Khordha",
        centralApprovedAt: NOW - 1000 * 60 * 60 * 15,
        status: "ASSIGNED",
        assignedCenter: "Rural Livelihood Training Center",
        impactScore: 76
    },
    {
        id: "APP-009",
        beneficiary: "Laxmi Behera",
        digitalId: "SUJHAA-OD-0009",
        scheme: "PM-AJAY Micro Enterprise",
        category: "Income Generation",
        village: "Pipili",
        block: "Pipili",
        district: "Puri",
        centralApprovedAt: NOW - 1000 * 60 * 60 * 8,
        status: "PENDING",
        assignedCenter: null,
        impactScore: 58
    },
    {
        id: "APP-010",
        beneficiary: "Gopal Swain",
        digitalId: "SUJHAA-OD-0010",
        scheme: "PM-AJAY Skill Training",
        category: "Skill Development",
        village: "Lingipur",
        block: "Bhubaneswar",
        district: "Khordha",
        centralApprovedAt: NOW - 1000 * 60 * 60 * 60, // SLA breached region
        status: "PENDING",
        assignedCenter: null,
        impactScore: 42
    },
    {
        id: "APP-011",
        beneficiary: "Rekha Mallick",
        digitalId: "SUJHAA-OD-0011",
        scheme: "PM-AJAY Sewing & Embroidery",
        category: "Women Empowerment",
        village: "Balipatna",
        block: "Balipatna",
        district: "Khordha",
        centralApprovedAt: NOW - 1000 * 60 * 60 * 26,
        status: "ASSIGNED",
        assignedCenter: "Women Skill Hub – Khordha",
        impactScore: 93
    },
    {
        id: "APP-012",
        beneficiary: "Rajesh Pradhan",
        digitalId: "SUJHAA-OD-0012",
        scheme: "PM-AJAY Mobile Repairing",
        category: "Skill Development",
        village: "Khandagiri",
        block: "Bhubaneswar",
        district: "Khordha",
        centralApprovedAt: NOW - 1000 * 60 * 60 * 12,
        status: "PENDING",
        assignedCenter: null,
        impactScore: 67
    }
];

const TRAINING_CENTERS = [
    { name: "Khordha ITI Training Center", capacity: 6, used: 3 },
    { name: "Women Skill Hub – Khordha", capacity: 4, used: 3 },
    { name: "Rural Livelihood Training Center", capacity: 5, used: 2 },
    { name: "Urban Skilling Hub – Bhubaneswar", capacity: 5, used: 1 }
];

/* =========================
   HELPERS & HOOKS
========================= */
const hoursLeft = (approvedAt) =>
    Math.max(
        0,
        SLA_LIMIT_HOURS - Math.floor((Date.now() - approvedAt) / (1000 * 60 * 60))
    );

const getSlaCompliance = (apps) => {
    if (!apps.length) return 0;
    const total = apps.length;
    const withinSla = apps.filter(
        (a) =>
            a.status === "ASSIGNED" ||
            hoursLeft(a.centralApprovedAt) > 0
    ).length;
    return Math.round((withinSla / total) * 100);
};

const mapComplianceToRank = (compliance) => {
    // Fake mapping just for demo
    if (compliance >= 95) return { rank: 3, total: 112 };
    if (compliance >= 85) return { rank: 9, total: 112 };
    if (compliance >= 75) return { rank: 18, total: 112 };
    if (compliance >= 60) return { rank: 32, total: 112 };
    return { rank: 54, total: 112 };
};

function useImpactScore(apps) {
    const [stats, setStats] = useState({ avg: 0, top: 0 });

    useEffect(() => {
        if (!apps.length) {
            setStats({ avg: 0, top: 0 });
            return;
        }
        const scores = apps.map((a) => a.impactScore ?? 0);
        const avg =
            scores.reduce((sum, s) => sum + s, 0) / scores.length;
        const top = Math.max(...scores);
        setStats({
            avg: Math.round(avg),
            top: top
        });
    }, [apps]);

    return stats;
}

/* =========================
   MAIN COMPONENT
========================= */
export default function DistrictTrainingAssignment() {
    const [loading, setLoading] = useState(true);
    const [apps, setApps] = useState([]);
    const [centers, setCenters] = useState([]);
    const [selected, setSelected] = useState(null);
    const [centerChoice, setCenterChoice] = useState("");
    const [fakeSyncing, setFakeSyncing] = useState(false);

    // fake fetch
    useEffect(() => {
        setTimeout(() => {
            setApps(MOCK_APPLICATIONS);
            setCenters(TRAINING_CENTERS);
            setLoading(false);
        }, 1200);
    }, []);

    // fake "sync" button for realism
    const triggerFakeSync = () => {
        setFakeSyncing(true);
        setTimeout(() => setFakeSyncing(false), 900);
    };

    const assignCenter = () => {
        if (!selected || !centerChoice) return;

        setApps((prev) =>
            prev.map((a) =>
                a.id === selected.id
                    ? {
                        ...a,
                        status: "ASSIGNED",
                        assignedCenter: centerChoice
                    }
                    : a
            )
        );

        setCenters((prev) =>
            prev.map((c) =>
                c.name === centerChoice ? { ...c, used: c.used + 1 } : c
            )
        );

        setSelected(null);
        setCenterChoice("");
    };

    const pending = apps.filter((a) => a.status === "PENDING").length;
    const assigned = apps.filter((a) => a.status === "ASSIGNED").length;
    const nearBreach = apps.filter(
        (a) => a.status === "PENDING" && hoursLeft(a.centralApprovedAt) <= 4
    ).length;

    const slaCompliance = getSlaCompliance(apps);
    const { rank, total } = mapComplianceToRank(slaCompliance);
    const impactStats = useImpactScore(apps);

    return (
        <div
            className="min-h-screen p-6 transition-opacity duration-500"
            style={{ background: THEME.bg }}
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 mb-1">
                        <span
                            className="text-white px-3 py-1 rounded-lg"
                            style={{ background: THEME.primary }}
                        >
                            D
                        </span>
                        District Training Assignment
                    </h1>
                    <p className="text-sm" style={{ color: THEME.muted }}>
                        Central Approved Applications → District assigns Training Centers
                        within{" "}
                        <span className="font-semibold text-orange-700">
                            {SLA_LIMIT_HOURS} hours
                        </span>
                        .
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-xs text-right">
                        <p className="text-gray-500">District</p>
                        <p className="font-semibold text-gray-800">
                            Khordha (DIST-OD-01)
                        </p>
                        <p className="text-[10px] text-gray-400">
                            Last sync just now
                        </p>
                    </div>
                    <button
                        onClick={triggerFakeSync}
                        className="px-3 py-2 text-xs rounded-lg border flex items-center gap-1 bg-white"
                        style={{ borderColor: THEME.border }}
                    >
                        {fakeSyncing && (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        )}
                        Sync from Central
                    </button>
                </div>
            </div>

            {/* Top stats row: SLA + Impact + Mini Chart */}
            <div className="grid lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Pending Assignment"
                    value={pending}
                    subtitle="Beneficiaries awaiting center"
                />
                <StatCard
                    title="Assigned Applications"
                    value={assigned}
                    subtitle="Already mapped to centers"
                    accent="green"
                />
                <StatCard
                    title="SLA Near Breach"
                    value={nearBreach}
                    subtitle="Need urgent assignment"
                    danger
                />
                <SlaRankCard
                    compliance={slaCompliance}
                    rank={rank}
                    total={total}
                />
            </div>

            {/* Impact + Mini Chart row */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <ImpactCard stats={impactStats} />
                <MiniAssignmentChart
                    pending={pending}
                    assigned={assigned}
                    nearBreach={nearBreach}
                />
            </div>

            {/* Main content: list + loaders */}
            {loading ? (
                <SkeletonList />
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {apps.map((app, idx) => {
                        const slaLeft = hoursLeft(app.centralApprovedAt);
                        const slaDanger =
                            slaLeft <= 4 && app.status === "PENDING";

                        return (
                            <div
                                key={app.id}
                                className={`p-4 rounded-xl border bg-white hover:shadow-md transition cursor-pointer animate-fade`}
                                style={{ borderColor: THEME.border }}
                                onClick={() => setSelected(app)}
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="font-semibold text-sm md:text-base">
                                            {app.beneficiary}
                                        </h3>
                                        <p className="text-[11px] text-gray-500">
                                            {app.digitalId}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-[11px] px-2 py-1 rounded-full ${app.status === "ASSIGNED"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {app.status}
                                    </span>
                                </div>

                                <p className="text-xs mt-2">{app.scheme}</p>

                                <p className="text-[11px] flex items-center gap-1 mt-1 text-gray-400">
                                    <MapPin size={12} />
                                    {app.village}, {app.block}, {app.district}
                                </p>

                                {/* Impact Score chip */}
                                <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-600">
                                    <Activity className="w-3 h-3 text-orange-500" />
                                    Impact Score:{" "}
                                    <span className="font-semibold text-orange-700">
                                        {app.impactScore}/100
                                    </span>
                                </div>

                                {/* SLA timer */}
                                {app.status === "PENDING" && (
                                    <div
                                        className={`flex items-center gap-1 text-[11px] mt-1 ${slaDanger ? "text-red-600" : "text-orange-600"
                                            }`}
                                    >
                                        <Clock size={12} />
                                        Assign within {slaLeft} hrs
                                        {slaDanger && (
                                            <AlertTriangle size={12} className="ml-1" />
                                        )}
                                    </div>
                                )}

                                {/* Assigned center */}
                                {app.assignedCenter && (
                                    <p className="text-[11px] mt-2 text-green-700 flex items-center gap-1">
                                        <CheckCircle2 size={12} />
                                        {app.assignedCenter}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Slide-in drawer for assignment */}
            {selected && (
                <div className="fixed inset-0 z-50 flex">
                    <div
                        className="flex-1 bg-black/30"
                        onClick={() => setSelected(null)}
                    />
                    <div className="w-full max-w-md bg-white p-5 animate-slide shadow-2xl">
                        <div className="flex justify-between mb-4 items-center">
                            <div>
                                <h2 className="font-semibold text-sm md:text-base">
                                    Assign Training Center
                                </h2>
                                <p className="text-[11px] text-gray-500">
                                    {selected.beneficiary} • {selected.digitalId}
                                </p>
                            </div>
                            <X
                                className="cursor-pointer text-gray-500"
                                onClick={() => setSelected(null)}
                            />
                        </div>

                        <div className="border rounded-lg p-3 bg-gray-50 mb-4">
                            <p className="text-[11px] text-gray-600">
                                Scheme:{" "}
                                <span className="font-medium">
                                    {selected.scheme}
                                </span>
                            </p>
                            <p className="text-[11px] text-gray-600 mt-1">
                                Category:{" "}
                                <span className="text-orange-700 font-medium">
                                    {selected.category}
                                </span>
                            </p>
                            <p className="text-[11px] text-gray-600 mt-1 flex items-center gap-1">
                                <MapPin size={12} className="text-gray-400" />
                                {selected.village}, {selected.block},{" "}
                                {selected.district}
                            </p>
                        </div>

                        <label className="text-xs font-medium text-gray-700 mb-1 block">
                            Select Training Center
                        </label>
                        <select
                            className="w-full border rounded-md p-2 text-sm mb-3"
                            value={centerChoice}
                            onChange={(e) => setCenterChoice(e.target.value)}
                        >
                            <option value="">-- Choose Center --</option>
                            {centers.map((c) => {
                                const remaining = c.capacity - c.used;
                                const full = remaining <= 0;
                                return (
                                    <option
                                        key={c.name}
                                        value={c.name}
                                        disabled={full}
                                    >
                                        {c.name}{" "}
                                        {full
                                            ? "(Full)"
                                            : `(${remaining} seats left)`}
                                    </option>
                                );
                            })}
                        </select>

                        <button
                            onClick={assignCenter}
                            disabled={!centerChoice}
                            className="w-full mt-4 py-2 text-white rounded-md text-sm disabled:opacity-60"
                            style={{ background: THEME.primary }}
                        >
                            Confirm Assignment
                        </button>

                        <p className="text-[10px] text-gray-400 mt-2">
                            Note: For demo, this updates only local state. In
                            production, it would call SUJHAA District API.
                        </p>
                    </div>
                </div>
            )}

            {/* Animations */}
            <style>{`
        .animate-fade { animation: fade 0.4s ease-in; }
        .animate-slide { animation: slide 0.3s ease-out; }
        @keyframes fade { from {opacity:0} to {opacity:1} }
        @keyframes slide { from {transform:translateX(100%)} to {transform:translateX(0)} }
        .skeleton {
          background: linear-gradient(90deg,#f3f4f6 0px,#e5e7eb 40px,#f3f4f6 80px);
          background-size: 600px;
          animation: shimmer 1.2s infinite linear;
        }
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
      `}</style>
        </div>
    );
}

/* =========================
   SUB COMPONENTS
========================= */

function StatCard({ title, value, subtitle, danger, accent }) {
    return (
        <div
            className={`p-4 rounded-xl border bg-white ${danger ? "border-red-300" : "border-gray-200"
                }`}
        >
            <p className="text-xs text-gray-500">{title}</p>
            <p
                className={`text-2xl font-bold ${danger
                    ? "text-red-600"
                    : accent === "green"
                        ? "text-green-600"
                        : "text-gray-900"
                    }`}
            >
                {value}
            </p>
            {subtitle && (
                <p className="text-[11px] text-gray-500 mt-1">
                    {subtitle}
                </p>
            )}
        </div>
    );
}

function SlaRankCard({ compliance, rank, total }) {
    return (
        <div className="p-4 rounded-xl border bg-white border-gray-200">
            <p className="text-xs text-gray-500 mb-1">
                SLA Compliance
            </p>
            <p className="text-2xl font-bold text-orange-600">
                {compliance}%
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
                District Rank:{" "}
                <span className="font-semibold text-gray-800">
                    #{rank}
                </span>{" "}
                out of {total}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
                (Demo) Based on on-time training center assignment
                under SUJHAA.
            </p>
        </div>
    );
}

function ImpactCard({ stats }) {
    return (
        <div className="p-4 rounded-xl border bg-white border-gray-200 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-orange-500" />
                <p className="text-sm font-semibold">
                    Beneficiary Impact Score
                </p>
            </div>
            <p className="text-xs text-gray-500 mb-3">
                Average score combines training completion, income
                potential and verification quality.
            </p>
            <div className="flex items-end gap-6">
                <div>
                    <p className="text-[11px] text-gray-500">Average</p>
                    <p className="text-2xl font-bold text-orange-600">
                        {stats.avg}/100
                    </p>
                </div>
                <div>
                    <p className="text-[11px] text-gray-500">
                        Top Beneficiary
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                        {stats.top}/100
                    </p>
                </div>
            </div>
        </div>
    );
}

function MiniAssignmentChart({ pending, assigned, nearBreach }) {
    const data = [
        { label: "Pending", value: pending },
        { label: "Assigned", value: assigned },
        { label: "SLA Risk", value: nearBreach }
    ];
    const maxVal =
        Math.max(...data.map((d) => d.value), 1) || 1;

    return (
        <div className="p-4 rounded-xl border bg-white border-gray-200">
            <p className="text-sm font-semibold mb-2">
                Assignment Overview (Mini Chart)
            </p>
            <p className="text-[11px] text-gray-500 mb-3">
                Quick view of assignment pipeline – fully frontend,
                simulated as if coming from backend analytics.
            </p>
            <div className="flex items-end gap-3 h-24">
                {data.map((d) => {
                    const height = (d.value / maxVal) * 100;
                    const color =
                        d.label === "Assigned"
                            ? "#16a34a"
                            : d.label === "SLA Risk"
                                ? "#dc2626"
                                : "#f97316";
                    return (
                        <div
                            key={d.label}
                            className="flex-1 flex flex-col items-center"
                        >
                            <div
                                className="w-6 rounded-t-md"
                                style={{
                                    height: `${height || 5}%`,
                                    backgroundColor: color,
                                    transition: "height 0.4s ease"
                                }}
                            />
                            <p className="text-[10px] mt-1 text-gray-600">
                                {d.label}
                            </p>
                            <p className="text-[10px] text-gray-900 font-semibold">
                                {d.value}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function SkeletonList() {
    return (
        <div className="grid md:grid-cols-2 gap-4 mt-4">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="p-4 rounded-xl border bg-white border-gray-200"
                >
                    <div className="flex justify-between mb-3">
                        <div className="h-4 w-32 rounded skeleton" />
                        <div className="h-4 w-16 rounded-full skeleton" />
                    </div>
                    <div className="h-3 w-40 rounded skeleton mb-2" />
                    <div className="h-3 w-32 rounded skeleton mb-2" />
                    <div className="h-3 w-24 rounded skeleton" />
                </div>
            ))}
        </div>
    );
}

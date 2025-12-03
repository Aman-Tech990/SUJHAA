import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Loader2,
    FileText,
} from "lucide-react";
import { toast } from "sonner";

const STATE_DASHBOARD_KEY = "sujhaa-state-dashboard";

// Same defaults as dashboard (fallback)
const defaultStateSummary = {
    totalBeneficiaries: 5050,
    totalApplications: 6230,
    approved: 4290,
    pendingVerification: 820,
    fundsAllocatedCr: 22.5,
    fundsUtilizedCr: 15.9,
    schemesActive: 14,
};

const defaultActivityFeed = [
    { time: "2 min ago", event: "Aman Parida’s application approved at State Level." },
    { time: "10 min ago", event: "Khordha District disbursed ₹8.2L for Skill Training." },
    { time: "1 hour ago", event: "New scheme request received from Ganjam." },
    { time: "3 hours ago", event: "District Officer Cuttack reviewed 45 applications." },
];

// Mocked backend detail (for demo)
const mockDetails = {
    "APP-983017": {
        beneficiary: {
            name: "Aman Parida",
            digitalId: "DID-OD-552201",
            district: "Khordha",
            phone: "+91 9876543210",
        },
        application: {
            schemeName: "Skill Development – Solar Technician",
            schemeCategory: "SKILL_DEVELOPMENT",
            appliedAt: "2025-02-09T10:30:00",
            aiScore: 82,
            verificationStatus: "Approved by District Officer",
        },
    },
};

const StateApplicationDetails = () => {
    const { refId } = useParams(); // should be APP-983017
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        setLoading(true);

        setTimeout(() => {
            const details = mockDetails[refId];
            setData(details || null);
            setLoading(false);
        }, 800);
    }, [refId]);

    const updateDashboardData = (updaterFn) => {
        const saved = localStorage.getItem(STATE_DASHBOARD_KEY);
        let dashboard = {
            stateSummary: defaultStateSummary,
            activityFeed: defaultActivityFeed,
            schemeBreakdown: [
                { name: "Income Generation", value: 45 },
                { name: "Skill Development", value: 35 },
                { name: "Infrastructure Support", value: 20 },
            ],
        };

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                dashboard = {
                    ...dashboard,
                    ...parsed,
                    stateSummary: { ...dashboard.stateSummary, ...parsed.stateSummary },
                    activityFeed: parsed.activityFeed || dashboard.activityFeed,
                    schemeBreakdown: parsed.schemeBreakdown || dashboard.schemeBreakdown,
                };
            } catch (err) {
                console.error("Failed to parse dashboard data in details:", err);
            }
        }

        const updated = updaterFn(dashboard);
        localStorage.setItem(STATE_DASHBOARD_KEY, JSON.stringify(updated));
    };

    const handleApprove = () => {
        if (!data) return;
        setProcessing(true);

        updateDashboardData((dashboard) => {
            const { stateSummary, activityFeed, schemeBreakdown } = dashboard;

            const newSummary = {
                ...stateSummary,
                approved: stateSummary.approved + 1,
                pendingVerification:
                    stateSummary.pendingVerification > 0
                        ? stateSummary.pendingVerification - 1
                        : 0,
            };

            const newFeed = [
                {
                    time: "Just now",
                    event: `State approved ${data.beneficiary.name}'s application (${refId}) and forwarded to Central Level.`,
                },
                ...activityFeed,
            ].slice(0, 6);

            return {
                stateSummary: newSummary,
                activityFeed: newFeed,
                schemeBreakdown,
            };
        });

        toast.success("Application Approved and Forwarded to Central Level");
        setTimeout(() => {
            setProcessing(false);
            navigate("/stateOfficer/applications");
        }, 600);
    };

    const handleReject = () => {
        if (!data) return;
        setProcessing(true);

        updateDashboardData((dashboard) => {
            const { stateSummary, activityFeed, schemeBreakdown } = dashboard;

            const newSummary = {
                ...stateSummary,
                pendingVerification:
                    stateSummary.pendingVerification > 0
                        ? stateSummary.pendingVerification - 1
                        : 0,
            };

            const newFeed = [
                {
                    time: "Just now",
                    event: `State rejected ${data.beneficiary.name}'s application (${refId}).`,
                },
                ...activityFeed,
            ].slice(0, 6);

            return {
                stateSummary: newSummary,
                activityFeed: newFeed,
                schemeBreakdown,
            };
        });

        toast.error("Application Rejected");
        setTimeout(() => {
            setProcessing(false);
            navigate("/stateOfficer/applications");
        }, 600);
    };

    if (loading)
        return (
            <div className="p-10 flex justify-center text-slate-600">
                <Loader2 className="animate-spin mr-2" /> Loading details…
            </div>
        );

    if (!data)
        return <div className="p-10 text-red-600">Application Not Found</div>;

    const { beneficiary, application } = data;

    return (
        <div className="p-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
            >
                <ArrowLeft size={18} /> Back
            </button>

            <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
                <h1 className="text-xl font-bold flex items-center gap-2 mb-4">
                    <FileText className="text-indigo-600" />
                    Application Details – {refId}
                </h1>

                {/* Status Pills */}
                <div className="flex gap-4 mb-6 flex-wrap">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        {application.verificationStatus}
                    </span>

                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                        AI Score: {application.aiScore}/100
                    </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Info label="Beneficiary Name" value={beneficiary.name} />
                    <Info label="Digital ID" value={beneficiary.digitalId} />
                    <Info label="District" value={beneficiary.district} />
                    <Info label="Phone" value={beneficiary.phone} />
                    <Info label="Scheme" value={application.schemeName} />
                    <Info label="Category" value={application.schemeCategory} />
                    <Info
                        label="Applied On"
                        value={new Date(application.appliedAt).toLocaleDateString("en-IN")}
                    />
                </div>

                {/* Approve / Reject Buttons */}
                <div className="mt-8 flex gap-4 flex-wrap">
                    <button
                        disabled={processing}
                        onClick={handleApprove}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
                    >
                        <CheckCircle2 size={18} />
                        Approve & Forward
                    </button>

                    <button
                        disabled={processing}
                        onClick={handleReject}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 disabled:opacity-50"
                    >
                        <XCircle size={18} />
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

const Info = ({ label, value }) => (
    <div>
        <p className="text-xs uppercase text-slate-500 font-semibold">{label}</p>
        <p className="text-lg font-bold text-slate-900">{value}</p>
    </div>
);

export default StateApplicationDetails;

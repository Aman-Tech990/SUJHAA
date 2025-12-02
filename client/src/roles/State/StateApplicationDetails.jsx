import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Loader2,
    FileText,
} from "lucide-react";

const StateApplicationDetails = () => {
    const { refId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(
                    `https://your-backend/api/stateOfficer/application/${refId}`,
                    { withCredentials: true }
                );
                setData(res.data);
            } catch (err) {
                console.error(err);
                alert("Failed to load application details");
            }
            setLoading(false);
        };
        fetchDetails();
    }, [refId]);

    // Approve
    const handleApprove = async () => {
        if (!confirm("Approve this application?")) return;

        setProcessing(true);
        try {
            await axios.put(
                `https://your-backend/api/stateOfficer/approve/${refId}`,
                { comments: "Approved by State Officer" },
                { withCredentials: true }
            );
            alert("Application Approved!");
            navigate("/stateOfficer/applications");
        } catch (err) {
            console.error(err);
            alert("Failed to approve!");
        }
        setProcessing(false);
    };

    // Reject
    const handleReject = async () => {
        const reason = prompt("Reason for rejection:");

        if (!reason) return;
        setProcessing(true);

        try {
            await axios.put(
                `https://your-backend/api/stateOfficer/reject/${refId}`,
                { reason },
                { withCredentials: true }
            );
            alert("Application Rejected!");
            navigate("/stateOfficer/applications");
        } catch (err) {
            console.error(err);
            alert("Failed to reject!");
        }
        setProcessing(false);
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
            {/* Header */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
            >
                <ArrowLeft size={18} /> Back
            </button>

            <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
                <h1 className="text-xl font-bold flex items-center gap-2 mb-4">
                    <FileText className="text-indigo-600" />
                    Application Details
                </h1>

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
                <div className="mt-8 flex gap-4">
                    <button
                        disabled={processing}
                        onClick={handleApprove}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
                    >
                        <CheckCircle2 size={18} />
                        Approve
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

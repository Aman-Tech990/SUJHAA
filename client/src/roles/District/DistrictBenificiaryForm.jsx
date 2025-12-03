import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  MapPin,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  ShieldCheck,
  File,
  Image as ImageIcon,
  IdCard,
  Calendar,
  TrendingUp
} from "lucide-react";

import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ---------------------------------------------------
// FAKE API CALL FOR BENEFICIARY DETAILS
// ---------------------------------------------------
function fetchMockApplication(id) {
  return new Promise((resolve) => {
    console.log("📡 Fetching application details for", id);
    setTimeout(() => {
      resolve({
        name: "Aman Parida",
        digitalId: "SUJHAA-10045",
        aadhaarNumber: "4876 9932 1120",
        category: "SC",
        phone: "9876543210",
        email: "amanparida990@gmail.com",
        address: "Plot 22, Rasulgarh, Bhubaneswar, Khordha, Odisha",

        schemeName: "Income Generation Project – Mushroom Cultivation",
        schemeCategory: "Income Generation",
        schemeDescription:
          "Financial support for setting up mushroom cultivation unit including shed, composting unit, and starter kits.",
        appliedAt: "2025-01-11T10:03:11",

        fieldOfficerVerification: {
          officerName: "FO Khordha – Aman Kumar",
          verifiedOn: "2025-01-15T09:22:10",
          remarks: "House location verified. Beneficiary present.",
          locationMatch: "Matched within 32 meters",
        },

        documents: [
          { name: "Income Certificate", url: "https://via.placeholder.com/400" },
          { name: "Caste Certificate", url: "https://via.placeholder.com/400" },
          { name: "Domicile Certificate", url: "https://via.placeholder.com/400" },
        ],

        fundingEligibility: 78, // %
      });
    }, 1400);
  });
}

// ---------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------
const DistrictBeneficiaryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchMockApplication(id).then((res) => setData(res));
  }, [id]);

  if (!data)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-3">Loading Application Details...</p>
        </div>
      </div>
    );

  // ---------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------
  const handleApprove = () => {
    setLoadingAction(true);
    setTimeout(() => {
      toast.success("Application Approved Successfully!");
      navigate("/districtOfficer/dashboard");
    }, 1500);
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) return alert("Please enter a reason");
    setLoadingAction(true);
    setTimeout(() => {
      toast.message("Application Rejected");
      navigate("/districtOfficer/dashboard");
    }, 1500);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="max-w-5xl mx-auto bg-white shadow border rounded-xl">

        {/* HEADER */}
        <div className="bg-[#1A7431] p-6 text-white flex justify-between items-center">
          <div>
            <p className="flex items-center gap-2 opacity-90 mb-1">
              <ShieldCheck size={18} /> Field Verified Application
            </p>
            <h1 className="text-2xl font-bold">{data.name}</h1>

            <p className="flex items-center gap-2 opacity-90 mt-1">
              <IdCard size={16} /> {data.digitalId}
            </p>
          </div>

          <User size={40} className="text-white bg-white/20 p-2 rounded-full" />
        </div>

        {/* BODY */}
        <div className="p-8 space-y-10">
          {/* PERSONAL DETAILS */}
          <Section title="Personal Details" Icon={User}>
            <Info label="Full Name" value={data.name} />
            <Info label="Aadhaar Number" value={data.aadhaarNumber} />
            <Info label="Category" value={data.category} />
            <Info label="Email ID" value={data.email} Icon={<Mail size={14} />} />
            <Info
              label="Address"
              value={data.address}
              Icon={<MapPin size={14} />}
              full
            />
          </Section>

          {/* APPLICATION INFO */}
          <Section title="Application Details" Icon={FileText}>
            <Info label="Scheme Name" value={data.schemeName} full />
            <Info
              label="Scheme Category"
              value={data.schemeCategory}
              full
            />
            <Info
              label="Applied On"
              value={new Date(data.appliedAt).toLocaleString()}
              Icon={<Calendar size={14} />}
              full
            />

            <p className="text-gray-700 mt-3">{data.schemeDescription}</p>
          </Section>

          {/* FIELD OFFICER */}
          <Section title="Field Officer Verification" Icon={ShieldCheck}>
            <Info
              label="Verified By"
              value={data.fieldOfficerVerification.officerName}
            />
            <Info
              label="Verified On"
              value={new Date(
                data.fieldOfficerVerification.verifiedOn
              ).toLocaleString()}
            />
            <Info
              label="Remarks"
              value={data.fieldOfficerVerification.remarks}
              full
            />
            <Info
              label="Location Match"
              value={data.fieldOfficerVerification.locationMatch}
              full
            />
          </Section>

          {/* FUNDING PROBABILITY */}
          <Section title="Funding Eligibility Score" Icon={TrendingUp}>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 bg-[#1A7431] rounded-full"
                style={{ width: `${data.fundingEligibility}%` }}
              ></div>
            </div>
            <p className="text-sm mt-2 text-gray-700">
              {data.fundingEligibility}% match with GIA guidelines
            </p>
          </Section>

          {/* DOCUMENTS */}
          <Section title="Uploaded Documents" Icon={File}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.documents.map((doc, idx) => (
                <a
                  key={idx}
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-lg border hover:bg-gray-200 transition"
                >
                  <ImageIcon className="text-orange-600" size={20} />
                  <span className="font-medium">{doc.name}</span>
                </a>
              ))}
            </div>
          </Section>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-4 border-t pt-6">
            <button
              onClick={() => setShowReject(true)}
              className="cursor-pointer px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              <XCircle size={18} className="inline-block mr-2" />
              Reject
            </button>

            <button
              onClick={() => setShowApprove(true)}
              className="cursor-pointer px-6 py-3 bg-[#1A7431] text-white rounded-lg hover:bg-green-700"
            >
              <CheckCircle size={18} className="inline-block mr-2" />
              Approve
            </button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showApprove && (
        <ApproveModal
          onClose={() => setShowApprove(false)}
          onApprove={handleApprove}
          loading={loadingAction}
        />
      )}

      {showReject && (
        <RejectModal
          onClose={() => setShowReject(false)}
          onSubmit={handleRejectSubmit}
          loading={loadingAction}
          rejectReason={rejectReason}
          setRejectReason={setRejectReason}
        />
      )}
    </div>
  );
};

// ---------------------------------------------------
// SUBCOMPONENTS
// ---------------------------------------------------

const Section = ({ title, Icon, children }) => (
  <section>
    <h3 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
      <Icon size={18} /> {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </section>
);

const Info = ({ label, value, Icon, full }) => (
  <div className={`${full ? "md:col-span-2" : ""}`}>
    <p className="text-xs text-gray-500 uppercase font-bold">{label}</p>
    <p className="text-gray-800 font-medium flex items-center gap-2">
      {Icon} {value}
    </p>
  </div>
);

// MODALS

const ApproveModal = ({ onClose, onApprove, loading }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-xl w-96 border">
      <h2 className="text-xl font-bold text-[#1A7431] mb-3">Approve Application</h2>
      <p className="text-gray-600 mb-4">
        Are you sure you want to approve this application?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          disabled={loading}
          onClick={onApprove}
          className="px-5 py-2 bg-[#1A7431] text-white rounded-lg hover:bg-green-700"
        >
          {loading ? "Processing..." : "Approve"}
        </button>
      </div>
    </div>
  </div>
);

const RejectModal = ({
  onClose,
  onSubmit,
  loading,
  rejectReason,
  setRejectReason,
}) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-xl w-96 border">
      <h2 className="text-xl font-bold text-red-600 mb-3">Reject Application</h2>

      <textarea
        className="w-full border p-3 rounded-lg h-28"
        placeholder="Enter rejection reason..."
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
      />

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={onSubmit}
          disabled={loading}
          className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          {loading ? "Processing..." : "Reject"}
        </button>
      </div>
    </div>
  </div>
);

export default DistrictBeneficiaryForm;

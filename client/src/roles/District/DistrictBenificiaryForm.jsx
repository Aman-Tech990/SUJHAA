import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
  FileCheck,
  FileTextIcon,
  Image as ImageIcon,
  FileArchive,
  IdCard,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

const DistrictBeneficiaryForm = () => {
  const { id } = useParams(); // APP-830953
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  /* ICON SELECTOR BASED ON DOCUMENT NAME */
  const getDocIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("income")) return <FileTextIcon className="text-green-700" size={18} />;
    if (lower.includes("domicile")) return <FileArchive className="text-blue-600" size={18} />;
    if (lower.includes("caste")) return <FileCheck className="text-purple-600" size={18} />;
    if (lower.includes("aadhaar")) return <ImageIcon className="text-orange-600" size={18} />;
    return <File className="text-gray-600" size={18} />;
  };

  /* ============================================
      FETCH DATA FROM BACKEND
  ============================================ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/district/application/${id}`,
          { withCredentials: true }
        );

        setData({
          /* Beneficiary */
          name: res.data.beneficiary.name,
          digitalId: res.data.beneficiary.digitalId,
          aadhaarNumber: res.data.beneficiary.aadhaarNumber,
          category: res.data.beneficiary.category || "SC",
          phone: res.data.beneficiary.phone,
          email: res.data.beneficiary.email,
          address: res.data.beneficiary.address,

          /* Application */
          applicationId: res.data.application.applicationId,
          appliedAt: res.data.application.appliedAt,
          schemeName: res.data.application.schemeName,
          schemeCategory: res.data.application.schemeCategory,
          schemeDescription: res.data.application.schemeDescription,
          status: res.data.application.status,
          fieldOfficerVerification: res.data.application.fieldOfficerVerification,

          /* Documents (Array of {name,url}) */
          documents: res.data.application.documents || [],
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load application details");
      }
    };

    fetchData();
  }, [id]);

  /* ============================================
      APPROVE FUNCTION
  ============================================ */
  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this application?")) return;

    try {
      setLoadingApprove(true);

      const res = await axios.post(
        `http://localhost:5000/api/district/application/${id}/approve`,
        { comments: "Approved by District Officer" },
        { withCredentials: true }
      );
      console.log(res.data);
      toast.success(res.data.message || "Application Approved Successfully!");
      navigate("/districtOfficer/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Approval failed!");
    } finally {
      setLoadingApprove(false);
    }
  };

  /* ============================================
      REJECT FUNCTION
  ============================================ */
  const handleReject = async () => {
    const reason = prompt("Enter rejection reason:");

    if (!reason) return toast.info("Rejection reason required!");

    try {
      setLoadingReject(true);

      const res = await axios.post(
        `http://localhost:5000/api/district/application/${id}/reject`,
        { reason },
        { withCredentials: true }
      );

      toast.success("Application Rejected Successfully!");
      navigate("/districtOfficer/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Rejection failed!");
    } finally {
      setLoadingReject(false);
    }
  };

  if (!data)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-3">Loading Application...</p>
        </div>
      </div>
    );

  /* ============================================
      UI
  ============================================ */

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
        <div className="bg-[#00a851] p-6 text-white flex justify-between items-center">
          <div>
            <p className="flex items-center gap-2 opacity-90 mb-1">
              <ShieldCheck size={18} /> Verified Application
            </p>
            <h1 className="text-2xl font-bold">{data.name}</h1>

            <p className="flex items-center gap-2 opacity-90 mt-1">
              <IdCard size={16} /> {data.digitalId}
            </p>
          </div>

          <User size={40} className="text-white bg-white/20 p-2 rounded-full" />
        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-10">

          {/* PERSONAL DETAILS */}
          <section>
            <h3 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
              <User size={18} /> Personal Details
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <Info label="Full Name" value={data.name} />
              <Info label="Aadhaar Number" value={data.aadhaarNumber} />
              <Info label="Category" value={data.category} />
              <Info label="Email ID" value={data.email} icon={<Mail size={14} />} />

              <div className="md:col-span-2">
                <Info label="Address" value={data.address} icon={<MapPin size={14} />} />
              </div>
            </div>
          </section>

          {/* APPLICATION INFO */}
          <section>
            <h3 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
              <FileText size={18} /> Application Info
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <Info label="Application ID" value={data.applicationId} />
              <Info label="Applied At" value={new Date(data.appliedAt).toLocaleString()} icon={<Calendar size={14} />} />
              <Info label="Scheme Category" value={data.schemeCategory} />
            </div>

            <p className="mt-3 text-gray-700">{data.schemeDescription}</p>

            <p className="mt-2 font-medium">
              Field Officer Verified:{" "}
              <span className="text-green-600">Yes</span>
            </p>
          </section>

          {/* DOCUMENTS */}
          <section>
            <h3 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2">
              <FileText size={18} /> Documents Uploaded
            </h3>

            <div className="flex flex-col gap-3">
              {data.documents.map((doc, index) => (
                <a
                  key={index}
                  href={doc.url}
                  target="_blank"
                  className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-lg border hover:bg-gray-200 transition"
                >
                  {getDocIcon(doc.name)}
                  <span className="font-medium">{doc.name}</span>
                </a>
              ))}
            </div>
          </section>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-4 border-t pt-6">
            <button
              onClick={handleReject}
              disabled={loadingReject}
              className="cursor-pointer px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              <XCircle size={18} className="inline-block mr-2" />
              {loadingReject ? "Rejecting..." : "Reject Application"}
            </button>

            <button
              onClick={handleApprove}
              disabled={loadingApprove}
              className="cursor-pointer px-6 py-3 bg-[#00a851] text-white rounded-lg hover:bg-green-700"
            >
              <CheckCircle size={18} className="inline-block mr-2" />
              {loadingApprove ? "Approving..." : "Approve Application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Small component for readable UI */
const Info = ({ label, value, icon }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase font-bold">{label}</p>
    <p className="text-gray-800 font-medium flex items-center gap-2">
      {icon} {value}
    </p>
  </div>
);

export default DistrictBeneficiaryForm;

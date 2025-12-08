import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle, User, MapPin, Phone, AlertCircle } from 'lucide-react';
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from 'sonner';

const BeneficiaryForm = () => {

  const user = JSON.parse(localStorage.getItem("sujhaa-user"));

  const location = useLocation();
  const selectedSchemeId = location.state?.schemeId;

  if (!selectedSchemeId) {
    return (
      <div className="p-6 text-red-600">
        Invalid scheme selection. Please go back and choose a scheme again.
      </div>
    );
  }

  // 1. State for Personal Details (Simulating data fetched from Profile/Dashboard)
  const [personalDetails, setPersonalDetails] = useState({
    fullName: "",
    phone: "",
    address: ""
  });

  // Simulate fetching data from an API/Backend
  useEffect(() => {
    // We use setTimeout to make this asynchronous (like a real API request)
    // This stops the "synchronous cascading render" error
    const timer = setTimeout(() => {
      const fetchedData = {
        fullName: "Amit Kumar",
        phone: "+91 98765 12345",
        address: "Plot 45, Saheed Nagar, Bhubaneswar, Odisha"
      };
      setPersonalDetails(fetchedData);
    }, 100); // 100ms delay

    // Cleanup the timer if the user leaves the page before it loads
    return () => clearTimeout(timer);
  }, []);

  // 2. State for Documents
  const [documents, setDocuments] = useState({
    domicile: null,
    income: null,
    caste: null
  });

  // Handle Text Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle File Uploads
  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [docType]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!documents.domicile || !documents.income || !documents.caste) {
      alert("Please upload all required documents");
      return;
    }

    const formData = new FormData();
    formData.append("domicile", documents.domicile);
    formData.append("income", documents.income);
    formData.append("caste", documents.caste);

    try {
      const res = await axios.post(
        `https://sujhaa-backend.onrender.com/api/application/apply/${selectedSchemeId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, 
        }
      );

      toast.success("Application Submitted! Ref: " + res.data.applicationRefId);

    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">

        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Scheme Application Form
          </h2>
          <p className="text-blue-100 mt-1 text-sm">
            Please verify your details and upload the required documents to apply.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* Section 1: Personal Details */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              1. Beneficiary Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={user.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              {/* Address Field (Spans full width) */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Permanent Address
                </label>
                <textarea
                  name="address"
                  value={user.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Document Uploads */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center justify-between">
              <span>2. Required Documents</span>
              <span className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-1 rounded flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Images (JPG/PNG) only
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Helper to render upload boxes */}
              <UploadBox
                label="Domicile Certificate"
                file={documents.domicile}
                onChange={(e) => handleFileChange(e, 'domicile')}
              />
              <UploadBox
                label="Income Certificate"
                file={documents.income}
                onChange={(e) => handleFileChange(e, 'income')}
              />
              <UploadBox
                label="Caste Certificate"
                file={documents.caste}
                onChange={(e) => handleFileChange(e, 'caste')}
              />
            </div>
          </section>

          {/* Footer Actions */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Submit Application
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// Reusable Sub-component for File Uploads
const UploadBox = ({ label, file, onChange }) => {
  return (
    <div className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group
      ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div className="z-10 flex flex-col items-center pointer-events-none">
        {file ? (
          <>
            <CheckCircle className="w-10 h-10 text-green-500 mb-3" />
            <span className="text-sm font-semibold text-green-700 truncate max-w-[150px]">
              {file.name}
            </span>
            <span className="text-xs text-green-600 mt-1">Click to change</span>
          </>
        ) : (
          <>
            <div className="bg-blue-100 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
              Upload {label}
            </span>
            <span className="text-xs text-gray-400 mt-1">
              Drag & drop or click
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default BeneficiaryForm;
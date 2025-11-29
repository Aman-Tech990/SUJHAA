import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Calendar, 
  FileText, 
  CheckCircle, 
  XCircle, 
  ShieldCheck 
} from 'lucide-react';

// 1. MOVE MOCK DATA OUTSIDE THE COMPONENT
// This prevents it from being redefined on every render
const MOCK_DB = {
  101: {
    name: "Ravi Kumar",
    digitalId: "SC-OD-2024-8821",
    fatherName: "Mahesh Kumar",
    dob: "1995-08-12",
    gender: "Male",
    category: "Scheduled Caste (SC)",
    phone: "+91 98765 43210",
    address: "Village Rampur, Block B, Khordha, Odisha",
    scheme: "Skill Development Training",
    status: "Verified by Field Officer",
    fieldOfficerNote: "Candidate visited. Shop location verified. Tools are present.",
    documents: ["Domicile Certificate", "Caste Certificate", "Income Certificate"]
  },
  102: {
    name: "Sunita Devi",
    digitalId: "SC-OD-2024-9932",
    fatherName: "Rajesh Singh",
    dob: "1992-04-20",
    gender: "Female",
    category: "Scheduled Caste (SC)",
    phone: "+91 88776 65544",
    address: "Sector 4, Housing Board, Khordha, Odisha",
    scheme: "Income Generation Scheme",
    status: "Verified by Field Officer",
    fieldOfficerNote: "Cattle shed construction complete. Verified physical assets.",
    documents: ["Domicile Certificate", "Caste Certificate", "Income Certificate"]
  }
};

const DistrictBeneficiaryForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    // 2. USE SETTIMEOUT TO SIMULATE REAL API CALL
    // This fixes the "Synchronous State Update" error
    const timer = setTimeout(() => {
      if (MOCK_DB[id]) {
        setData(MOCK_DB[id]);
      }
    }, 300); // 300ms delay simulates network lag

    // Cleanup function (good practice)
    return () => clearTimeout(timer);
  }, [id]);

  if (!data) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Loading Application Details...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Top Navigation */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors"
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      {/* Main Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-300">
        
        {/* Header Section */}
        <div className="bg-[#00a851] p-6 text-white flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 opacity-90 text-sm font-medium mb-1">
              <ShieldCheck size={16} /> Verified Application
            </div>
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <p className="opacity-80">Digital ID: {data.digitalId}</p>
          </div>
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <User size={32} className="text-white" />
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-8 space-y-8">
          
          {/* Section 1: Personal Information */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
              <User size={18} className="text-gray-400" /> Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                <p className="text-gray-900 font-medium">{data.name}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Father's Name</label>
                <p className="text-gray-900 font-medium">{data.fatherName}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Date of Birth</label>
                <p className="text-gray-900 font-medium flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" /> {data.dob}
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                <p className="text-gray-900 font-medium">{data.category}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Current Address</label>
                <p className="text-gray-900 font-medium flex items-center gap-2">
                  <MapPin size={14} className="text-gray-400" /> {data.address}
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Scheme & Verification */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-gray-400" /> Scheme & Verification
            </h3>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-blue-800 mb-1">Field Officer Report</h4>
              <p className="text-sm text-blue-700 italic">"{data.fieldOfficerNote}"</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Applied Scheme</label>
                <p className="text-gray-900 font-medium">{data.scheme}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Documents Uploaded</label>
                <div className="flex gap-2 mt-1">
                  {data.documents.map((doc, index) => (
                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button className="flex items-center gap-2 px-6 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition">
              <XCircle size={20} /> Reject Application
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#00a851] text-white rounded-lg hover:bg-green-700 font-medium shadow-md transition">
              <CheckCircle size={20} /> Approve Application
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DistrictBeneficiaryForm;
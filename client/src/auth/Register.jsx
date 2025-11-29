import React, { useState } from "react";
// import Autoplay from "embla-carousel-autoplay"; 
import { Link } from "react-router-dom";
import { 
  User, 
  Phone, 
  MapPin, 
  Lock, 
  Eye, 
  EyeOff, 
  Upload, 
  CreditCard,
  ScanText 
} from "lucide-react";

// Shadcn UI Imports
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Register = () => {
  const [formData, setFormData] = useState({
    aadhaar: "",
    phone: "",
    address: "",
    password: "",
    photo: null,
    aadhaarPhoto: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false); 

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  const handleExtractData = () => {
    if (!formData.aadhaarPhoto) return;

    setIsExtracting(true);
    console.log("Extracting data from:", formData.aadhaarPhoto.name);

    setTimeout(() => {
      setIsExtracting(false);
      alert("Data extracted successfully! (Mock)");
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    // 1. UPDATED BACKGROUND: Uses the blurred blobs and gray base from Login
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gray-50">
      
      {/* Decorative Blob 1 (Top Left) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      
      {/* Decorative Blob 2 (Top Right) */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      
      {/* Decorative Blob 3 (Bottom Center) */}
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 2. UPDATED CARD CONTAINER: Added backdrop-blur, bg-white/90, and border to match Login style */}
      <div className="relative w-full max-w-[1200px] h-[85vh] md:h-[90vh] bg-white/90 backdrop-blur-sm rounded-[35px] flex flex-col md:flex-row overflow-hidden shadow-2xl border border-white/20">

        {/* --- LEFT SIDE: IMAGE --- */}
        <div className="hidden md:block w-1/2 h-full relative bg-gray-100">
          <img 
            src="/registerCarousel1.jpg" 
            alt="Scheme Banner" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/5" />
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="w-full md:w-1/2 h-full bg-white/50 flex flex-col no-scrollbar overflow-y-auto">
          <div className="flex-1 px-8 py-8 flex flex-col justify-center">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-block p-3 rounded-full bg-[#1A7431]/10 mb-3">
                <User className="h-6 w-6 text-[#1A7431]" /> 
              </div>
              <h1 className="text-3xl font-black text-[#1A7431] tracking-tight">
                PM-AJAY YOJANA
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Create your beneficiary account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#1A7431]" /> Aadhaar Number
                  </Label>
                  <Input
                    name="aadhaar"
                    placeholder="1234 5678 9101"
                    className="h-10 bg-gray-50 border-gray-200 focus:ring-1 focus:ring-[#1A7431]"
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#1A7431]" /> Phone Number
                  </Label>
                  <Input
                    name="phone"
                    placeholder="+91 98765 43210"
                    className="h-10 bg-gray-50 border-gray-200 focus:ring-1 focus:ring-[#1A7431]"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#1A7431]" /> Address
                </Label>
                <Input
                  name="address"
                  placeholder="Village, District, State..."
                  className="h-10 bg-gray-50 border-gray-200 focus:ring-1 focus:ring-[#1A7431]"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#1A7431]" /> Set Password
                </Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a Strong password"
                    className="h-10 bg-gray-50 border-gray-200 focus:ring-1 focus:ring-[#1A7431] pr-8"
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-[#1A7431]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Photo Upload */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Current Photo</Label>
                  <div className="relative h-10 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center px-3 cursor-pointer">
                    <Upload className="text-gray-400 w-4 h-4 mr-2" />
                    <span className="text-xs text-gray-500 truncate">
                       {formData.photo ? formData.photo.name : "Upload Photo"}
                    </span>
                    <Input 
                        type="file" 
                        name="photo"
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleFileChange} 
                    />
                  </div>
                </div>

                {/* Aadhaar Upload & Extract Section */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700">Aadhaar Photo</Label>
                  
                  <div className="flex gap-2">
                    <div className="relative h-10 flex-1 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center px-3 cursor-pointer">
                      <Upload className="text-gray-400 w-4 h-4 mr-2" />
                      <span className="text-xs text-gray-500 truncate">
                        {formData.aadhaarPhoto ? "Selected" : "Upload Aadhaar"}
                      </span>
                      <Input 
                        type="file" 
                        name="aadhaarPhoto"
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleFileChange} 
                      />
                    </div>

                    <Button
                        type="button"
                        onClick={handleExtractData}
                        disabled={!formData.aadhaarPhoto || isExtracting}
                        className="h-10 px-3 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-200 disabled:text-gray-400 transition-colors text-xs font-bold"
                    >
                        {isExtracting ? "..." : <ScanText size={16} />} 
                        <span className="ml-1 hidden sm:inline">Extract</span>
                    </Button>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-[#1A7431] hover:bg-[#145c28] text-white font-bold py-5 rounded-xl shadow-md">
                Register Beneficiary
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-500 text-xs">
                Already have an account? <Link to="/login" className="text-[#1A7431] font-bold hover:underline">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
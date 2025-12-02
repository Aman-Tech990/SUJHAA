import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Eye,
  EyeOff,
  Upload,
  ScanText,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";

// --------------------------------------------------
// MAIN REGISTER COMPONENT
// --------------------------------------------------
const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [otpPopup, setOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [digitalId, setDigitalId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    phone: "",
    aadhaarNumber: "",
    address: "",
    district: "",
    state: "",
    password: "",
    regPhoto: null,
    aadhaarPhoto: null,
  });

  // -------------------------
  // HANDLERS
  // -------------------------
  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.files[0] }));
  };

  const handleExtractData = () => {
    if (!formData.aadhaarPhoto) return;
    setIsExtracting(true);
    setTimeout(() => {
      toast.success("OCR extraction demo completed!");
      setIsExtracting(false);
    }, 1200);
  };

  // -------------------------
  // SUBMIT REGISTRATION
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) fd.append(key, formData[key]);
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        toast.success("OTP sent to your email");
        setDigitalId(res.data.digitalId);
        setOtpPopup(true); // show OTP popup
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  // -------------------------
  // OTP VERIFY
  // -------------------------
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { digitalId, otp }
      );

      if (res.data.success) {
        toast.success("OTP verified successfully!");
        setOtpPopup(false);

        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gray-50">

      {/* BACKGROUND BLOBS */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-[1200px] h-[85vh] md:h-[90vh] bg-white/90 backdrop-blur-sm rounded-[35px] flex flex-col md:flex-row overflow-hidden shadow-2xl border border-white/20">

        {/* LEFT IMAGE */}
        <div className="hidden md:block w-1/2 h-full relative bg-gray-100">
          <img
            src="/registerCarousel1.jpg"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/5" />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 h-full bg-white/50 flex flex-col overflow-y-auto px-8 py-8">

          <div className="text-center mb-6">
            <div className="inline-block p-3 rounded-full bg-[#1A7431]/10 mb-3">
              <User className="h-6 w-6 text-[#1A7431]" />
            </div>
            <h1 className="text-3xl font-black text-[#1A7431]">PM-AJAY YOJANA</h1>
            <p className="text-sm text-gray-500">Create your beneficiary account</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input name="name" onChange={handleChange} />
              </div>
              <div>
                <Label>Gender</Label>
                <Input name="gender" onChange={handleChange} />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input name="email" onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Aadhaar Number</Label>
                <Input name="aadhaarNumber" onChange={handleChange} />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input name="phone" onChange={handleChange} />
              </div>
            </div>

            <div>
              <Label>Address</Label>
              <Input name="address" onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>District</Label>
                <Input name="district" onChange={handleChange} />
              </div>
              <div>
                <Label>State</Label>
                <Input name="state" onChange={handleChange} />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                />
                <span
                  className="absolute right-2 top-2 cursor-pointer text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </span>
              </div>
            </div>

            {/* PHOTO UPLOAD */}
            <div>
              <Label>Your Photo</Label>
              <div className="relative h-10 border border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center px-3 cursor-pointer">
                <Upload className="text-gray-400 w-4 h-4 mr-2" />
                <span className="text-xs text-gray-500 truncate">
                  {formData.regPhoto ? formData.regPhoto.name : "Upload Photo"}
                </span>
                <Input
                  type="file"
                  name="regPhoto"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* AADHAAR OCR */}
            <div>
              <Label>Aadhaar Photo (OCR Demo)</Label>
              <div className="flex gap-2">
                <div className="relative h-10 border border-dashed flex-1 border-gray-300 rounded-lg bg-gray-50 flex items-center px-3 cursor-pointer">
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
                  disabled={!formData.aadhaarPhoto || isExtracting}
                  onClick={handleExtractData}
                  className="h-10 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center"
                >
                  {isExtracting ? "..." : <ScanText size={16} />}
                  <span className="ml-1 hidden sm:inline">Extract</span>
                </Button>
              </div>
            </div>

            <Button className="w-full bg-[#1A7431] py-5 font-bold">
              Register Beneficiary
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-500 text-xs">
              Already have an account?{" "}
              <Link to="/login" className="text-[#1A7431] font-bold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* OTP POPUP */}
      {/* -------------------------------------------------- */}
      {otpPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-[90%] max-w-sm shadow-xl border">

            <h2 className="text-center text-2xl font-bold text-[#1A7431] mb-1">
              Verify OTP
            </h2>
            <p className="text-center text-gray-600 text-sm mb-4">
              Enter the 6-digit code sent to your email
            </p>

            <div className="flex justify-center gap-2 mb-4">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  maxLength="1"
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/, "");
                    const newOtp = otp.split("");
                    newOtp[i] = val;
                    setOtp(newOtp.join(""));

                    // auto-focus next input
                    if (val && i < 5) {
                      document.getElementById(`otp-${i + 1}`).focus();
                    }
                  }}
                  id={`otp-${i}`}
                  className="w-10 h-12 text-center border rounded-lg text-lg font-bold focus:ring-2 focus:ring-[#1A7431]"
                />
              ))}
            </div>

            <Button
              onClick={handleVerifyOtp}
              className="w-full bg-[#1A7431] py-3 font-bold"
            >
              Verify OTP
            </Button>

            <button
              className="mt-3 w-full text-gray-500 text-xs"
              onClick={() => setOtpPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Register;

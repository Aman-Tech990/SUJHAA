import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Eye,
  EyeOff,
  Upload,
  Loader2
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [otpPopup, setOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [digitalId, setDigitalId] = useState("");

  const [aadhaarPreview, setAadhaarPreview] = useState(null);

  const [loadingBtn, setLoadingBtn] = useState(false);   // ⭐ REGISTER LOADER
  const [otpLoading, setOtpLoading] = useState(false);    // ⭐ OTP VERIFY LOADER

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
  });

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((p) => ({ ...p, [e.target.name]: file }));

    if (e.target.name === "aadhaarPhoto") {
      setAadhaarPreview(URL.createObjectURL(file));
    }
  };

  // ----------------------------------------
  // ⭐ REGISTER USER
  // ----------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingBtn(true); // start loader

    const fd = new FormData();
    const keys = [
      "name",
      "gender",
      "email",
      "phone",
      "aadhaarNumber",
      "address",
      "district",
      "state",
      "password",
      "regPhoto",
    ];

    keys.forEach((key) => {
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
        setOtpPopup(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }

    setLoadingBtn(false); // stop loader
  };

  // ----------------------------------------
  // ⭐ VERIFY OTP
  // ----------------------------------------
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return toast.error("Enter a valid 6-digit OTP");

    setOtpLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { digitalId, otp }
      );

      if (res.data.success) {
        toast.success("OTP verified!");
        setOtpPopup(false);

        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }

    setOtpLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gray-50 relative overflow-hidden">

      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[-15%] right-[-10%] w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      {/* Main Card */}
      <div className="relative w-full max-w-5xl h-[90vh] bg-white/90 shadow-xl rounded-[35px] flex flex-col md:flex-row overflow-hidden">

        {/* Left Image */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src="/registerCarousel1.jpg"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 px-8 py-8 overflow-y-auto">

          <div className="text-center mb-6">
            <div className="inline-block p-3 rounded-full bg-[#1A7431]/10 mb-3">
              <User className="h-7 w-7 text-[#1A7431]" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#1A7431]">
              PM-AJAY YOJANA
            </h1>
            <p className="text-gray-500 text-sm">Create your beneficiary account</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME + GENDER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="my-2">Full Name</Label>
                <Input name="name" onChange={handleChange} />
              </div>

              <div>
                <Label className="my-2">Gender</Label>
                <select
                  name="gender"
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <Label className="my-2">Email</Label>
              <Input name="email" onChange={handleChange} />
            </div>

            {/* AADHAAR + PHONE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="my-2">Aadhaar Number</Label>
                <Input name="aadhaarNumber" onChange={handleChange} />
              </div>
              <div>
                <Label className="my-2">Phone Number</Label>
                <Input name="phone" onChange={handleChange} />
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <Label className="my-2">Address</Label>
              <Input name="address" onChange={handleChange} />
            </div>

            {/* DISTRICT + STATE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="my-2">District</Label>
                <Input name="district" onChange={handleChange} />
              </div>
              <div>
                <Label className="my-2">State</Label>
                <Input name="state" onChange={handleChange} />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <Label className="my-2">Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                />
                <span
                  className="absolute right-3 top-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </span>
              </div>
            </div>

            {/* PHOTO UPLOAD */}
            <div>
              <Label className="my-2">Your Photo</Label>
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

            {/* AADHAAR PHOTO */}
            <div>
              <Label className="my-2">Aadhaar Image</Label>

              <div className="flex flex-col gap-2">
                <div className="relative h-10 border border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center px-3 cursor-pointer">
                  <Upload className="text-gray-400 w-4 h-4 mr-2" />
                  <span className="text-xs text-gray-500">
                    {aadhaarPreview ? "Image Selected" : "Upload Aadhaar Image"}
                  </span>
                  <Input
                    type="file"
                    name="aadhaarPhoto"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>

                {aadhaarPreview && (
                  <img
                    src={aadhaarPreview}
                    alt="AADHAAR PREVIEW"
                    className="w-32 h-20 object-cover rounded-md border"
                  />
                )}
              </div>
            </div>

            {/* SUBMIT BUTTON WITH LOADER */}
            <Button
              disabled={loadingBtn}
              className={`cursor-pointer w-full bg-[#1A7431] py-5 font-bold flex justify-center items-center gap-2 transition-all
                ${loadingBtn ? "opacity-80 cursor-not-allowed" : ""}`}
            >
              {loadingBtn ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Registering...
                </>
              ) : (
                "Register Beneficiary"
              )}
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

      {/* ====================== OTP POPUP ====================== */}
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
                    if (val && i < 5) {
                      document.getElementById(`otp-${i + 1}`).focus();
                    }
                  }}
                  id={`otp-${i}`}
                  className="w-10 h-12 text-center border rounded-lg text-lg font-bold focus:ring-2 focus:ring-[#1A7431]"
                />
              ))}
            </div>

            {/* OTP VERIFY BUTTON WITH LOADER */}
            <Button
              disabled={otpLoading}
              onClick={handleVerifyOtp}
              className={`w-full bg-[#1A7431] py-3 font-bold flex justify-center items-center gap-2
                ${otpLoading ? "opacity-80 cursor-not-allowed" : ""}`}
            >
              {otpLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
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

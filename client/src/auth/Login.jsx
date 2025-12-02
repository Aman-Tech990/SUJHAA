import React, { useState } from 'react';
import { User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    digitalId: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://sujhaa-backend.onrender.com/api/auth/login",
        formData,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data?.message);
        console.log(res.data);
        // Store user info
        localStorage.setItem("sujhaa-user", JSON.stringify(res.data.user));
        localStorage.setItem("sujhaa-role", res.data.role);

        if (res.data.success) {
          toast.success(res.data.message);

          localStorage.setItem("sujhaa-user", JSON.stringify(res.data.user));
          localStorage.setItem("sujhaa-role", res.data.role);

          switch (res.data.role) {
            case "BENEFICIARY":
              window.location.href = "/beneficiary/dashboard";
              break;

            case "DISTRICT_OFFICER":
              window.location.href = "/districtOfficer/dashboard";
              break;

            case "STATE_OFFICER":
              window.location.href = "/stateOfficer/dashboard";
              break;

            case "FIELD_OFFICER":
              window.location.href = "/test-verify";
              break;

            case "CENTER_OFFICER":
              window.location.href = "/centerOfficer/dashboard";
              break;

            case "TRAINER":
              window.location.href = "/trainer";
              break;

            default:
              window.location.href = "/";
          }
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
    setFormData({
      digitalId: '',
      password: ''
    });
  };

  return (
    // 1. "Fantastic" Background: Uses a base color + decorative blurred blobs
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gray-50">

      {/* Decorative Blob 1 (Top Left) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>

      {/* Decorative Blob 2 (Top Right) */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      {/* Decorative Blob 3 (Bottom Center) */}
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Main Card Container */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex min-h-[600px] border border-white/20">

        {/* LEFT SIDE: Pure Image Section 
            - Removed green overlay 
            - Removed text titles
            - Image is now 'object-cover' and fully opaque
        */}
        <div className="hidden md:flex md:w-1/2 relative ">
          <img
            src="/registerCarousel1.jpg"
            alt="Login Visual"
            className="absolute inset-0 w-full h-full p-1 rounded-2xl object-cover"
          />
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/95">

          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-green-900 mb-2">Welcome Back</h1>
              <p className="text-gray-500">Please enter your details to sign in.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Digital ID</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white"
                    placeholder="Enter your ID"
                    value={formData.digitalId}
                    onChange={(e) => setFormData({ ...formData, digitalId: e.target.value })}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-xs text-green-600 hover:text-green-700 font-medium">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  {/* Toggle Password Visibility */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-green-700/30 hover:shadow-green-700/40 hover:-translate-y-0.5"
              >
                Sign In
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              Not registered yet?{' '}
              <Link to='/register'>
                <span className="text-green-700 font-bold hover:underline cursor-pointer">
                  Create an account
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
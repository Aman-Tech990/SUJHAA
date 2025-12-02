import React, { useState } from 'react';
import { Bell, Menu, User, LogOut, ChevronDown, ShieldCheck, FileText } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const DistrictNavbar = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  // // 1. Mock Data for District Officer
  // const user = {
  //   name: "Amit Verma",
  //   role: "District Nodal Officer",
  //   district: "Khordha, Odisha",
  //   initials: "AV"
  // };
  const user = JSON.parse(localStorage.getItem("sujhaa-user"));

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      toast.success(res.data.message || "Logged out successfully");

      localStorage.removeItem("sujhaa-user");
      localStorage.removeItem("token");

      navigate("/login");
    } catch (err) {
      console.log(err);
      toast.error("Logout failed");
    }
  };

  return (
    // Main Header with the Green Background preserved
    < header className="relative z-30 flex h-16 w-full items-center justify-between border-b border-green-600 bg-[#00a851] px-4 shadow-md sm:px-6 lg:px-8" >

      {/* --- LEFT SIDE: Toggle & Logo --- */}
      < div className="flex items-center gap-4" >
        {/* Mobile Menu Toggle */}
        < button
          onClick={onMenuClick}
          className="rounded p-2 text-white hover:bg-green-700 md:hidden"
        >
          <Menu size={24} />
        </button >

        {/* Logo Section */}
        < div className="flex items-center gap-3" >
          {/* Logo Box */}
          < div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white p-1" >
            <img
              src="https://www.pmfias.com/wp-content/uploads/2023/12/PM-AJAY.png"
              alt="pm-ajay logo"
              className="h-full w-full object-contain"
            />
          </div >

          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white">
              SUJHAA
            </span>
            {/* Added a small badge to indicate this is the OFFICER portal */}
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-green-100">
              <ShieldCheck size={10} /> District Portal
            </span>
          </div>
        </div >
      </div >

      {/* --- RIGHT SIDE: Actions & Profile --- */}
      < div className="flex items-center gap-4" >



        {/* Profile Dropdown */}
        < div className="relative" >
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 rounded-full bg-green-700/50 p-1 pr-3 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            {/* Avatar Circle */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-[#00a851]">
              {user.initials}
            </div>

            {/* User Info (Visible on Desktop) */}
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-green-100">{user.role}</p>
            </div>
            <ChevronDown size={16} className="text-green-100" />
          </button>

          {/* Dropdown Menu */}
          {
            isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">

                {/* Added District Info in Dropdown */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Logged in as</p>
                  <p className="text-sm font-semibold text-gray-800">{user.role}</p>
                  <p className="text-xs text-gray-500 truncate">{user.district}</p>
                </div>

                <div className="border-t border-gray-100 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="cursor-pointer flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} className="mr-2" /> Log out
                </button>
              </div>
            )
          }
        </div >
      </div >
    </header >
  );
};

export default DistrictNavbar;
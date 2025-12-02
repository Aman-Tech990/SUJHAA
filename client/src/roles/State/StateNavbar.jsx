import React, { useState } from 'react';
import {
  Menu,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  FileText,
  // New icons for the profile modal
  Phone,
  Mail,
  MapPin,
  FileCheck as IDIcon, // Renamed to avoid conflict
  X
} from 'lucide-react';

const user = JSON.parse(localStorage.getItem("sujhaa-user"));

const StateNavbar = ({ onMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For the small menu
  const [isModalOpen, setIsModalOpen] = useState(false);       // For the big profile popup

  // 1. Mock Data for State Officer
  const officerData = {
    name: user.name,
    officer_id: user.officerId,
    state: user.state,
    email: user.email,
    mobile: user.mobile,
  };

  return (
    <>
      {/* --- MAIN HEADER --- */}
      <header className="relative z-30 flex h-16 w-full items-center justify-between border-b border-green-600 bg-[#00a851] px-4 shadow-md sm:px-6 lg:px-8">

        {/* --- LEFT SIDE: Toggle & Logo --- */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="rounded p-2 text-white hover:bg-green-700 md:hidden"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white p-1">
              <img
                src="https://www.pmfias.com/wp-content/uploads/2023/12/PM-AJAY.png"
                alt="pm-ajay logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white">
                SUJHAA
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-green-100">
                <ShieldCheck size={10} /> State Portal
              </span>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: Actions & Profile --- */}
        <div className="flex items-center gap-4">

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 rounded-full bg-green-700/50 p-1 pr-3 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-[#00a851]">
                {officerData.name[0]}
              </div>

              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-white">{officerData.name}</p>
                <p className="text-xs text-green-100">State Officer</p>
              </div>
              <ChevronDown size={16} className="text-green-100" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">

                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Logged in as</p>
                  <p className="text-sm font-semibold text-gray-800">State Officer</p>
                  <p className="text-xs text-gray-500 truncate">{officerData.state}</p>
                </div>

                {/* MODIFIED: Button triggers Modal instead of being a link */}
                <button
                  onClick={() => {
                    setIsDropdownOpen(false); // Close dropdown
                    setIsModalOpen(true);     // Open Modal
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                >
                  <User size={16} className="mr-2" /> My Profile
                </button>

                <div className="border-t border-gray-100 my-1"></div>

                <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <LogOut size={16} className="mr-2" /> Sign out
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- PROFILE MODAL POPUP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          {/* Modal Container */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">

            {/* Modal Header */}
            <div className="bg-[#00a851] p-6 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-[#00a851] text-2xl font-bold shadow-md">
                  {officerData.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold">{officerData.name}</h2>
                  <p className="text-green-100 text-sm">State Nodal Officer • {officerData.state}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">
                Official Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <IDIcon size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Officer ID</p>
                    <p className="text-sm font-semibold text-slate-800">{officerData.officer_id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <MapPin size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Assigned Location</p>
                    <p className="text-sm font-semibold text-slate-800">{officerData.state} HQ</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <Mail size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Official Email</p>
                    <p className="text-sm font-semibold text-slate-800">{officerData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <Phone size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Contact Number</p>
                    <p className="text-sm font-semibold text-slate-800">{officerData.mobile}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                <div className="text-xs text-slate-400">
                  Last Login: {new Date(officerData.last_login).toLocaleString()}
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full border border-green-200">
                  STATUS: ACTIVE
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default StateNavbar;
import React, { useState } from "react";
import { Bell, Menu, User, LogOut, ChevronDown } from "lucide-react";

const CentralNavbar = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const user = {
    name: "Central Admin",
    role: "Ministry of Social Justice",
  };

  return (
    <header className="relative z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-[#00a851] px-4 shadow-sm sm:px-6 lg:px-8">
      
      {/* LEFT: MENU + LOGO */}
      <div className="flex items-center gap-4">

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={onMenuClick}
          className="rounded p-2 text-white hover:bg-[#008f47] md:hidden"
        >
          <Menu size={24} />
        </button>

        {/* LOGO + TITLE */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg font-bold bg-white">
            <img
              src="https://www.pmfias.com/wp-content/uploads/2023/12/PM-AJAY.png"
              alt="PM AJAY Logo"
              className="h-full w-full object-contain"
            />
          </div>

          {/* TWO-LINE CENTRAL TITLE */}
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-white">SUJHAA</span>
            <span className="text-xs font-semibold text-green-100 tracking-wider">
              Central Portal
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: NOTIFICATIONS + PROFILE */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-white hover:bg-[#008f47] transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* PROFILE DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 rounded-full bg-white p-1 pr-3 hover:bg-gray-50 focus:ring-2 focus:ring-green-500"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
              {user.name.charAt(0)}
            </div>

            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-600">{user.role}</p>
            </div>

            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-md border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/10">
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <User size={16} className="mr-2" /> Profile
              </a>

              <div className="border-t border-gray-200 my-1"></div>

              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} className="mr-2" /> Log Out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CentralNavbar;

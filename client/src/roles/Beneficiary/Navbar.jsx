import React, { useState } from 'react';
import { Bell, Menu, Search, User, LogOut, ChevronDown } from 'lucide-react';

// 1. ACCEPT THE PROP HERE inside the curly braces
const Navbar = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock User Data
  const user = {
    name: "Rajesh Kumar",
    role: "Beneficiary",
    avatar: null,
  };

  return (
    <header className="relative z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-[#00a851] px-4 shadow-sm sm:px-6 lg:px-8">
      
      <div className="flex items-center gap-4">
        {/* 2. USE THE PROP HERE on the button onClick */}
        <button 
          onClick={onMenuClick} 
          className="rounded p-2 text-gray-600 hover:bg-gray-100 md:hidden"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg  font-bold text-white">
            <img src="https://www.pmfias.com/wp-content/uploads/2023/12/PM-AJAY.png" alt="pm-ajay logo" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            SUJHAA
          </span>
        </div>
      </div>

      

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 rounded-full bg-white p-1 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {user.name.charAt(0)}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-gray-700">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <User size={16} className="mr-2" /> Profile
              </a>
              <div className="border-t border-gray-100 my-1"></div>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                <LogOut size={16} className="mr-2" /> Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
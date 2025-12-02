import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileBarChart, MessageSquare, IndianRupeeIcon, User, User2, User2Icon, SkullIcon, Folder } from 'lucide-react';

const StateSidebar = ({ onLinkClick }) => {
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/stateOfficer/dashboard', 
      icon: LayoutDashboard 
    },
    { 
      name: 'District-Wise Fund Report', 
      path: '/stateOfficer/fundreport', 
      icon: IndianRupeeIcon
    },
    { 
      name: 'District-Wise Beneficiaries Report', 
      path: '/stateOfficer/beneficiaryreport', 
      icon: User2Icon
    },
    { 
      name: 'Training Centres Directory', 
      path: '/stateOfficer/trainingreport', 
      icon: Folder
    },
    { 
      name: 'District Applications', 
      path: '/stateOfficer/applications', 
      icon: User
    },
  ];

  return (
    // Preserved the bg-[#ffc72c] (yellow) as requested in your snippet
    <div className="flex flex-col gap-2 p-4 bg-[#ffc72c] h-full border-r border-gray-200">
      
      <div className="mb-4 px-2 text-md font-bold uppercase tracking-wider text-gray-800">
        STATE MENU
      </div>
      
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onLinkClick} // Close sidebar on mobile when clicked
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-medium transition-all duration-200 ${
              isActive
                ? 'bg-green-50 text-green-700 shadow-sm border-r-4 border-green-600' // Green active state
                : 'text-gray-700 hover:bg-white/50 hover:text-gray-900'
            }`
          }
        >
          <item.icon size={20} />
          {item.name}
        </NavLink>
      ))}
    </div>
  );
};

export default StateSidebar;
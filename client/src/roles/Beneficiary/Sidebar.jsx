import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, IndianRupee, HelpCircle, History } from 'lucide-react';

// Accept a prop called 'onLinkClick' (we will use this for mobile later)
const Sidebar = ({ onLinkClick }) => {

  const navItems = [
    { name: 'Dashboard', path: '/beneficiary/dashboard', icon: LayoutDashboard },
    { name: 'My Application', path: '/beneficiary/myschemes', icon: FileText },
    { name: 'Fund Details', path: '/beneficiary/fundDetails', icon: IndianRupee },
    { name: 'Skill Development Journey', path: '/beneficiary/trainingtracker', icon: History },
    { name: 'Help & Support', path: '/beneficiary/support', icon: HelpCircle },
  ];

  return (
    <div className="flex flex-col gap-2 p-4 bg-[#ffc72c] min-h-screen w-70">
      <div className="mb-4 px-2 text-md font-semibold uppercase tracking-wider text-gray-400">
        Menu
      </div>

      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onLinkClick} // <--- Close sidebar when clicked (for mobile)
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-medium transition-all duration-200 ${isActive
              ? 'bg-blue-50 text-blue-700 shadow-sm'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
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

export default Sidebar;
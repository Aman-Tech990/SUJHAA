import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileBarChart, MessageSquare } from 'lucide-react';

const DistrictSidebar = ({ onLinkClick }) => {

  const navItems = [
    {
      name: 'Dashboard',
      path: '/districtOfficer/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Projects Analysis',
      path: '/districtOfficer/projectProgress',
      icon: LayoutDashboard
    },
    {
      name: 'User Feedback',
      path: '/districtOfficer/feedbackAnalysis',
      icon: MessageSquare
    },
  ];

  return (
    // Changed bg-[#ffc72c] to bg-white for a cleaner "Officer" look
    // Changed min-h-screen to h-full so it fits perfectly inside the layout container
    <div className="flex flex-col gap-2 p-4 bg-[#ffc72c] h-full border-r border-gray-200">

      <div className="mb-4 px-2 text-md font-bold uppercase tracking-wider text-gray-600">
        MENU
      </div>

      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onLinkClick} // Close sidebar on mobile when clicked
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-medium transition-all duration-200 ${isActive
              ? 'bg-green-50 text-green-700 shadow-sm border-r-4 ' // Green active state
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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

export default DistrictSidebar;
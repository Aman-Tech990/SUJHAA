import React from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Globe2,
  IndianRupee,
  FileText,
  BarChart2,
} from "lucide-react";

const CentralSidebar = ({ onLinkClick }) => {
  const navItems = [
    { name: "Dashboard", path: "/centralOfficer/dashboard", icon: LayoutDashboard },
    { name: "State Performance", path: "/centralOfficer/statesPerformance", icon: Globe2 },
    { name: "Fund Allocation", path: "/centralOfficer/funds", icon: IndianRupee },
    { name: "Beneficiary Analytics", path: "/centralOfficer/beneficiaryanalytics", icon: BarChart2 },
  ];

  return (
    <div className="flex flex-col gap-2 p-4 bg-[#ffc72c] min-h-screen w-72">
      
      {/* Sidebar Header */}
      <div className="mb-4 px-2 text-md font-semibold uppercase tracking-wider text-gray-700">
        Central Menu
      </div>

      {/* Sidebar Items */}
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onLinkClick}
          className={({ isActive }) =>
            `
            flex items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-medium 
            transition-all duration-200

            ${
              isActive
                ? "bg-white text-gray-900 shadow-md"
                : "text-gray-800 hover:bg-white hover:text-gray-900"
            }
            `
          }
        >
          <item.icon size={20} />
          {item.name}
        </NavLink>
      ))}
    </div>
  );
};

export default CentralSidebar;

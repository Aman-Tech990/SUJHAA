import React from "react";
import { NavLink } from "react-router-dom";
import {
    Home,
    Map,
    Wallet,
    BarChart3,
    FileSearch,
    ClipboardList,
    BrainCircuit,
    Settings,
    MessageSquare,
} from "lucide-react";

const CentralSidebar = () => {
    return (
        <div>
            <div className="fixed top-0 left-0 bg-white shadow-md w-64 h-screen p-4 flex flex-col border-r border-gray-200 mt-10">
                <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                    State Officer Dashboard
                </h1>

                <nav className="flex-1 space-y-1">

                    <NavLink
                        to="/central"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 transition-all duration-200 ${isActive
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "hover:bg-gray-100 hover:text-blue-600"
                            }`
                        }
                    >
                        <Home size={18} />
                        <span>Home</span>
                    </NavLink>

                    <NavLink
                        to="/state-tracker"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 transition-all duration-200 ${isActive
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "hover:bg-gray-100 hover:text-blue-600"
                            }`
                        }
                    >
                        <Map size={18} />
                        <span>State Tracker</span>
                    </NavLink>

                    <NavLink
                        to="/funds"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 transition-all duration-200 ${isActive
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "hover:bg-gray-100 hover:text-blue-600"
                            }`
                        }
                    >
                        <Wallet size={18} />
                        <span>Fund Management</span>
                    </NavLink>

                    <NavLink
                        to="/training-analytics"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 transition-all duration-200 ${isActive
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "hover:bg-gray-100 hover:text-blue-600"
                            }`
                        }
                    >
                        <BarChart3 size={18} />
                        <span>Training Analytics</span>
                    </NavLink>

                    <NavLink
                        to="/audit-logs"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 transition-all duration-200 ${isActive
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "hover:bg-gray-100 hover:text-blue-600"
                            }`
                        }
                    >
                        <FileSearch size={18} />
                        <span>Audit Logs</span>
                    </NavLink>

                    <NavLink
                        to="/reports"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 transition-all duration-200 ${isActive
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "hover:bg-gray-100 hover:text-blue-600"
                            }`
                        }
                    >
                        <ClipboardList size={18} />
                        <span>Reports</span>
                    </NavLink>

                    <NavLink
                        to="/ai-insights"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 transition-all duration-200 ${isActive
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "hover:bg-gray-100 hover:text-blue-600"
                            }`
                        }
                    >
                        <BrainCircuit size={18} />
                        <span>AI Insights</span>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 transition-all duration-200 ${isActive
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "hover:bg-gray-100 hover:text-blue-600"
                            }`
                        }
                    >
                        <Settings size={18} />
                        <span>System Settings</span>
                    </NavLink>

                    <NavLink
                        to="/communication"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 transition-all duration-200 ${isActive
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "hover:bg-gray-100 hover:text-blue-600"
                            }`
                        }
                    >
                        <MessageSquare size={18} />
                        <span>Communication Hub</span>
                    </NavLink>

                </nav>
            </div>
        </div>
    )
}

export default CentralSidebar;
import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { X } from "lucide-react";

// Correct central imports
import CentralNavbar from "./CentralNavbar";
import CentralSidebar from "./CentralSidebar";

const CentralLayout = () => {
  // Sidebar toggle for mobile
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Scroll reset on navigation
  const mainContentRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen flex-col bg-gray-50">

      {/* TOP NAVBAR */}
      <CentralNavbar
        onMenuClick={() => setIsMobileSidebarOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-white">
          <CentralSidebar />
        </aside>

        {/* MOBILE SIDEBAR (SLIDE-IN) */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">

            {/* BACKDROP */}
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsMobileSidebarOpen(false)}
            />

            {/* SIDEBAR DRAWER */}
            <div className="relative w-64 bg-white shadow-xl flex flex-col">

              {/* HEADER */}
              <div className="flex items-center justify-between border-b p-4">
                <span className="text-lg font-semibold text-gray-800">Menu</span>

                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* LINKS */}
              <div className="flex-1 overflow-y-auto">
                <CentralSidebar
                  onLinkClick={() => setIsMobileSidebarOpen(false)}
                />
              </div>

            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <main
          ref={mainContentRef}
          className="flex-1 overflow-y-auto p-6"
        >
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default CentralLayout;

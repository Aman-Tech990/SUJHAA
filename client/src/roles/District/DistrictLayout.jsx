import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

// IMPORTANT: Make sure you create/import the District-specific versions
// If you are reusing the exact same Navbar, you can change this back to './Navbar'
import DistrictNavbar from './DistrictNavbar'; 
import DistrictSidebar from './DistrictSidebar';

const DistrictLayout = () => {
  // State to toggle the mobile sidebar
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Ref for the main container and Effect to reset scroll
  const mainContentRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    // MAIN CONTAINER: Full screen height
    <div className="flex h-screen flex-col bg-gray-50">
      
      {/* DISTRICT NAVBAR 
          Pass the toggle function for the hamburger menu */}
      <DistrictNavbar onMenuClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        
        {/* --- DESKTOP SIDEBAR --- 
            Hidden on mobile, visible on desktop (md:flex) */}
        <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
          <DistrictSidebar />
        </aside>

        {/* --- MOBILE SIDEBAR OVERLAY --- */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Dark Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            
            {/* Sliding Drawer */}
            <div className="relative flex w-64 flex-col bg-white shadow-xl">
              {/* Mobile Header */}
              <div className="flex items-center justify-between border-b p-4">
                 <span className="font-bold text-lg text-gray-800">Officer Menu</span>
                 <button 
                   onClick={() => setIsMobileSidebarOpen(false)}
                   className="rounded-full p-1 hover:bg-gray-100">
                   <X size={24} className="text-gray-600" />
                 </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto">
                <DistrictSidebar onLinkClick={() => setIsMobileSidebarOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* --- MAIN CONTENT AREA (THE OUTLET) --- */}
        <main 
            ref={mainContentRef} 
            className="flex-1 overflow-y-auto pl-4 sm:pl-6 lg:pl-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DistrictLayout;
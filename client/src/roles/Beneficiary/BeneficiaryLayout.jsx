// 1. UPDATED IMPORTS: Added useEffect, useRef, and useLocation
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatWidget from '@/pages/ChatWidget';

const BeneficiaryLayout = () => {
  // State to toggle the mobile sidebar
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // 2. ADDED LOGIC: Ref for the main container and Effect to reset scroll
  const mainContentRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    // 1. MAIN CONTAINER: Full screen height (h-screen)
    <div className="flex h-screen flex-col bg-gray-50">
      {/* 2. NAVBAR: Stays at the top. 
          We pass the toggle function so the Hamburger button works. */}
      <Navbar onMenuClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        {/* --- DESKTOP SIDEBAR --- 
            Hidden on mobile (hidden).
            Visible on Desktop (md:flex).
            No scrollbar (removed overflow-y-auto). 
        */}
        <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
          <Sidebar />
        </aside>
        {/* --- MOBILE SIDEBAR OVERLAY --- 
            Only renders if state is TRUE.
            Hidden on Desktop (md:hidden) via CSS to prevent bugs if screen resizes.
        */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Dark Backdrop - Closes menu when clicked */}
            <div
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => setIsMobileSidebarOpen(false)} />
            {/* Sliding Drawer */}
            <div className="relative flex w-64 flex-col bg-white shadow-xl">
              {/* Header inside Mobile Menu */}
              <div className="flex items-center justify-between border-b p-4">
                <span className="font-bold text-lg text-gray-800">Menu</span>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="rounded-full p-1 hover:bg-gray-100">
                  <X size={24} className="text-gray-600" />
                </button>
              </div>
              {/* Sidebar Content 
                  We pass 'onLinkClick' so the menu closes when a user selects a page.
              */}
              <div className="flex-1 overflow-y-auto">
                <Sidebar onLinkClick={() => setIsMobileSidebarOpen(false)} />
              </div>
            </div>
          </div>
        )}
        {/* 4. MAIN CONTENT AREA (THE OUTLET) 
            Takes remaining width (flex-1).
            Scrolls independently (overflow-y-auto).
        */}

        {/* 3. UPDATED MAIN TAG: Added ref={mainContentRef} */}
        <main
          ref={mainContentRef}
          className="flex-1 overflow-y-auto pl-4 sm:pl-6 lg:pl-8"
        >
          <Outlet />
          <ChatWidget />
        </main>
      </div>
    </div>
  );
};
export default BeneficiaryLayout;
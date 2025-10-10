import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Bell, FileText, Wallet, GraduationCap, FolderOpen, LayoutDashboard,ChevronDown } from "lucide-react";

function DashboardLayout() {
  const location = useLocation();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path:'/' },
    { id: 'applications', label: 'My Applications', icon: FileText , path:'/MyApplications' },
    { id: 'projects', label: 'Apply for a Project', icon: FileText , path:'/NewProject' },
    { id: 'funds', label: 'Fund Status', icon: Wallet , path:'/FundStatus'},
    { id: 'training', label: 'Skill Training', icon: GraduationCap ,path:'/SkillTraining'},
    { id: 'documents', label: 'Documents', icon: FolderOpen, path:'/Documents' }
  ];
  const officer = {
    name: "Rajesh Kumar",
    role: "Beneficiary",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbNog60dqdQy1pC8DVoHK93qp6zlr_3vGszg&s"
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <img src="https://pmajay.dosje.gov.in/public/latest/images/logo.png" alt="PM-AJAY" className="w-12 h-12" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">SUJHAA Portal</h1>
              <p className="text-xs text-gray-500">Grant in Aid under PM-AJAY</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
          <img src={officer.avatar} alt="Officer Avatar" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold text-gray-800 text-sm">{officer.name}</p>
            <p className="text-xs text-gray-500">{officer.role}</p>
          </div>
          
        </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r border-gray-200 sticky top-0 h-screen overflow-y-auto">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />  {/* <- This renders the page component depending on the route */}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

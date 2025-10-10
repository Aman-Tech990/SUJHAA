import { useState } from 'react'
import { Bell, FileText, Wallet, GraduationCap, FolderOpen, LayoutDashboard, ChevronRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import React from 'react'
import { Link, useLocation } from 'react-router-dom';

function Dashboard() {
    const [activeMenu, setActiveMenu] = useState('dashboard');
  const location=useLocation();
  const beneficiary = {
    name: "Rajesh Kumar",
    projectId: "PMAJAY2024001234",
    scheme: "Grant-In-Aid Support",
    status: "Approved",
    totalSanctioned: "₹50,000",
    amountReceived: "₹15,000",
    nextInstallment: "₹35,000",
    installmentDate: "15 Nov 2025"
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard,path:'/' },
    { id: 'applications', label: 'My Applications', icon: FileText , path:'/MyApplications' },
    { id: 'projects', label: 'Apply for a Project', icon: FileText , path:'/NewProject' },
    { id: 'funds', label: 'Fund Status', icon: Wallet , path:'/FundStatus'},
    { id: 'training', label: 'Skill Training', icon: GraduationCap ,path:'/SkillTraining'},
    { id: 'documents', label: 'Documents', icon: FolderOpen, path:'/Documents' }
  ];

  const progressSteps = [
    { label: "Applied", status: "completed", date: "10 Sep 2025" },
    { label: "Under Review", status: "completed", date: "18 Sep 2025" },
    { label: "Approved", status: "current", date: "25 Sep 2025" },
    { label: "Fund Released", status: "pending", date: "Expected: 15 Nov 2025" }
  ];

  const notifications = [
    { type: "success", message: "First installment of ₹15,000 credited successfully", time: "2 days ago" },
    { type: "info", message: "Skills training program starting on 20 Oct 2025", time: "5 days ago" },
    { type: "warning", message: "Document verification pending - Upload Aadhaar card", time: "1 week ago" }
  ];

  return (
  <div className="min-h-screen bg-gray-50">
      

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Overview Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbNog60dqdQy1pC8DVoHK93qp6zlr_3vGszg&s" alt="ohoto" />
                  </div>
                </div>
                <div>
                  <p className="text-orange-100 text-sm mb-1">Welcome back,</p>
                  <h2 className="text-2xl font-bold mb-2">{beneficiary.name}</h2>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="bg-white/20 px-3 py-1 rounded-full">ID: {beneficiary.projectId}</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full">{beneficiary.scheme}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <p className="text-xs text-orange-100">Status</p>
                <p className="font-bold text-lg">{beneficiary.status}</p>
              </div>
            </div>
          </div>
          
           {/* Notifications */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Notifications</h3>
            <div className="space-y-3">
              {notifications.map((notif, index) => (
                <div key={index} className={`flex items-start space-x-3 p-4 rounded-lg ${
                  notif.type === 'success' ? 'bg-green-50' :
                  notif.type === 'info' ? 'bg-blue-50' :
                  'bg-yellow-50'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    notif.type === 'success' ? 'bg-green-500' :
                    notif.type === 'info' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  } text-white`}>
                    {notif.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                     notif.type === 'info' ? <Bell className="w-4 h-4" /> :
                     <AlertCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Application Progress</h3>
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"></div>
              <div className="absolute top-5 left-0 h-0.5 bg-orange-500" style={{ width: '66%' }}></div>
              
              <div className="relative flex justify-between">
                {progressSteps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step.status === 'completed' ? 'bg-green-500 text-white' :
                      step.status === 'current' ? 'bg-orange-500 text-white' :
                      'bg-gray-200 text-gray-400'
                    }`}>
                      {step.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                       step.status === 'current' ? <Clock className="w-5 h-5" /> :
                       <AlertCircle className="w-5 h-5" />}
                    </div>
                    <p className={`text-sm font-medium ${
                      step.status === 'pending' ? 'text-gray-400' : 'text-gray-700'
                    }`}>{step.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fund Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Fund Summary</h3>
                <Wallet className="w-5 h-5 text-orange-500" />
              </div>
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <p className="text-sm text-gray-500">Total Sanctioned</p>
                  <p className="text-2xl font-bold text-gray-800">{beneficiary.totalSanctioned}</p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <p className="text-sm text-gray-500">Amount Received</p>
                  <p className="text-xl font-semibold text-green-600">{beneficiary.amountReceived}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Next Installment</p>
                      <p className="text-lg font-bold text-orange-600">{beneficiary.nextInstallment}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Expected on</p>
                      <p className="text-sm font-medium text-gray-700">{beneficiary.installmentDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Training & Updates */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Training & Updates</h3>
                <GraduationCap className="w-5 h-5 text-orange-500" />
              </div>
              
              {/* Current Training Progress */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border border-green-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">Tailoring & Garment Making</p>
                    <p className="text-sm text-gray-600 mt-1">Current Training Program</p>
                  </div>
                  <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    In Progress
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Training Hours</span>
                    <span className="text-sm font-bold text-green-600">45 / 120 hrs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: '37.5%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">Completed: 45 hours</span>
                    <span className="text-xs text-gray-500">Remaining: 75 hours</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-xs text-gray-600">Expected completion: 15 Dec 2025</p>
                </div>
              </div>
              
              {/* Upcoming Training */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Digital Marketing Skills</p>
                    <p className="text-sm text-gray-600 mt-1">30-day program starting 20 Oct 2025</p>
                    <p className="text-xs text-gray-500 mt-2">Location: Community Center, Sector 12</p>
                  </div>
                </div>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                  Enroll Now
                </button>
              </div>
              
              <div className="text-center">
                <button className="text-orange-600 text-sm font-medium hover:underline flex items-center justify-center mx-auto">
                  View all programs <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div> 
        </main>
    </div>
  );
}

export default Dashboard
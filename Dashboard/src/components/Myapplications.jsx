import { useState } from 'react';
import { Bell, FileText, Wallet, GraduationCap, FolderOpen, LayoutDashboard, CheckCircle, Clock, AlertCircle, ExternalLink, Info } from 'lucide-react';
import React from 'react';

function MyApplications() {
  // Example data of previously applied projects
  const applications = [
    {
      id: 1,
      title: "Goat Rearing Livelihood Project",
      appliedOn: "12 Aug 2025",
      status: "Approved",
      amount: 50000,
      remarks: "Sanctioned and first installment released",
      projectId: "PMAJAY2024001234"
    },
    {
      id: 2,
      title: "Community Dairy Initiative",
      appliedOn: "20 Jun 2025",
      status: "Under Review",
      amount: 75000,
      remarks: "Awaiting district-level committee approval",
      projectId: "PMAJAY2024000987"
    },
    {
      id: 3,
      title: "Solar Powered Irrigation Setup",
      appliedOn: "10 May 2025",
      status: "Rejected",
      amount: 60000,
      remarks: "Proposal did not meet eligibility criteria",
      projectId: "PMAJAY2024000712"
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-300';
      case 'Under Review': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <CheckCircle className="w-5 h-5" />;
      case 'Under Review': return <Clock className="w-5 h-5" />;
      case 'Rejected': return <AlertCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">My Applications</h2>
                <p className="text-orange-100 text-sm">Track all your previously submitted projects under PM-AJAY</p>
              </div>
              <FileText className="w-12 h-12 text-white/80" />
            </div>
          </div>

          {/* Application List */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Application History</h3>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{app.title}</h4>
                        <p className="text-xs text-gray-500">Applied on {app.appliedOn}</p>
                        <p className="text-sm text-gray-600 mt-1">Project ID: {app.projectId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="text-lg font-bold text-orange-600">₹{app.amount.toLocaleString()}</p>
                      <span className={`mt-2 inline-block px-3 py-1 text-xs rounded-full border font-medium ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <p className="text-sm text-gray-700">{app.remarks}</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                <Info className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 mb-2">Need Help with Your Application?</h4>
                <p className="text-sm text-gray-700 mb-4">
                  You can contact your District Welfare Officer or visit the PM-AJAY office for any assistance regarding application status, approval, or rejection.
                </p>
                <div className="flex space-x-3">
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors text-sm">
                    Contact Support
                  </button>
                  <button className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors text-sm border border-orange-200">
                    View FAQs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
    </div>
  );
}

export default MyApplications;

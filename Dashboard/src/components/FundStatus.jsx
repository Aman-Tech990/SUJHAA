import { useState } from 'react'
import { Bell, FileText, Wallet, GraduationCap, FolderOpen, LayoutDashboard, ChevronRight, CheckCircle, Clock, AlertCircle, Download, Upload, IndianRupee, Calendar, ArrowRight, ExternalLink, Info } from 'lucide-react';
import React from 'react'

function FundStatus() {
  const [activeMenu, setActiveMenu] = useState('funds');
  const [selectedInstallment, setSelectedInstallment] = useState(null);

  const beneficiary = {
    name: "Rajesh Kumar",
    projectId: "PMAJAY2024001234",
    scheme: "Grant-In-Aid Support",
    status: "Active"
  };

  const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard,path:'/' },
      { id: 'applications', label: 'My Applications', icon: FileText , path:'/MyApplications' },
      { id: 'projects', label: 'Apply for a Project', icon: FileText , path:'/NewProject' },
      { id: 'funds', label: 'Fund Status', icon: Wallet , path:'/FundStatus'},
      { id: 'training', label: 'Skill Training', icon: GraduationCap ,path:'/SkillTraining'},
      { id: 'documents', label: 'Documents', icon: FolderOpen, path:'/Documents' }
    ];

  const fundSummary = {
    totalSanctioned: 50000,
    totalReleased: 15000,
    totalPending: 35000,
    projectStartDate: "01 Sep 2025",
    projectEndDate: "31 Aug 2026",
    bankAccount: "XXXX-XXXX-4567",
    ifscCode: "SBIN0001234"
  };

  const installments = [
    {
      id: 1,
      installmentNumber: "1st Installment",
      sanctionedAmount: 15000,
      releasedAmount: 15000,
      status: "Completed",
      sanctionDate: "25 Sep 2025",
      releaseDate: "28 Sep 2025",
      transactionId: "DBT202509281234567",
      utrNumber: "SBIN25092812345",
      remarks: "First installment released successfully",
      documentsRequired: [],
      documentsSubmitted: ["Project Proposal", "Bank Details", "Aadhaar Card"]
    },
    {
      id: 2,
      installmentNumber: "2nd Installment",
      sanctionedAmount: 20000,
      releasedAmount: 0,
      status: "Document Pending",
      sanctionDate: "25 Sep 2025",
      releaseDate: null,
      transactionId: null,
      utrNumber: null,
      remarks: "Awaiting progress report and utilization certificate",
      documentsRequired: ["Progress Report", "Utilization Certificate", "Expenditure Statement"],
      documentsSubmitted: []
    },
    {
      id: 3,
      installmentNumber: "3rd Installment",
      sanctionedAmount: 15000,
      releasedAmount: 0,
      status: "Awaiting Previous",
      sanctionDate: "25 Sep 2025",
      releaseDate: null,
      transactionId: null,
      utrNumber: null,
      remarks: "Will be processed after 2nd installment completion",
      documentsRequired: ["Final Report", "Project Completion Certificate", "Audit Report"],
      documentsSubmitted: []
    }
  ];

  const recentTransactions = [
    { date: "28 Sep 2025", description: "1st Installment - DBT Credit", amount: 15000, type: "credit", status: "Success" },
    { date: "25 Sep 2025", description: "Project Sanctioned", amount: 50000, type: "sanctioned", status: "Approved" }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-300';
      case 'Document Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Awaiting Previous': return 'bg-gray-100 text-gray-600 border-gray-300';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircle className="w-5 h-5" />;
      case 'Document Pending': return <AlertCircle className="w-5 h-5" />;
      case 'Awaiting Previous': return <Clock className="w-5 h-5" />;
      case 'Processing': return <Clock className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Page Header */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">Fund Status & Disbursement</h2>
                <p className="text-orange-100 text-sm">Track your financial assistance and payment details</p>
                <div className="flex items-center space-x-4 text-sm mt-4">
                  <span className="bg-white/20 px-3 py-1 rounded-full">Project ID: {beneficiary.projectId}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">{beneficiary.scheme}</span>
                </div>
              </div>
              <Wallet className="w-12 h-12 text-white/80" />
            </div>
          </div>

          {/* Fund Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Sanctioned</p>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">₹{fundSummary.totalSanctioned.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Approved on {fundSummary.projectStartDate}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Amount Released</p>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-600">₹{fundSummary.totalReleased.toLocaleString()}</p>
              <div className="mt-3 bg-blue-50 rounded-lg p-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-blue-600">{((fundSummary.totalReleased / fundSummary.totalSanctioned) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(fundSummary.totalReleased / fundSummary.totalSanctioned) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Pending Amount</p>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-orange-600">₹{fundSummary.totalPending.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Expected by {fundSummary.projectEndDate}</p>
            </div>
          </div>

          {/* Bank Details & DBT Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Payment Details (DBT)</h3>
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                DBT Verified
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bank Account Number</p>
                    <p className="font-semibold text-gray-800">{fundSummary.bankAccount}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">IFSC Code</p>
                    <p className="font-semibold text-gray-800">{fundSummary.ifscCode}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Direct Benefit Transfer (DBT)</p>
                    <p className="text-sm text-gray-700">All payments are made directly to your verified bank account through the Government's DBT system. This ensures transparency and eliminates intermediaries.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Installment-wise Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Installment-wise Fund Breakdown</h3>
            <div className="space-y-4">
              {installments.map((installment) => (
                <div key={installment.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div 
                    className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSelectedInstallment(selectedInstallment === installment.id ? null : installment.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          installment.status === 'Completed' ? 'bg-green-100' :
                          installment.status === 'Document Pending' ? 'bg-yellow-100' :
                          'bg-gray-200'
                        }`}>
                          {getStatusIcon(installment.status)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{installment.installmentNumber}</p>
                          <p className="text-sm text-gray-600">Sanctioned: ₹{installment.sanctionedAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Released Amount</p>
                          <p className={`text-xl font-bold ${installment.releasedAmount > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                            ₹{installment.releasedAmount.toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(installment.status)}`}>
                          {installment.status}
                        </span>
                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${selectedInstallment === installment.id ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  </div>

                  {selectedInstallment === installment.id && (
                    <div className="p-6 bg-white border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800 mb-3">Payment Information</h4>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Sanction Date</span>
                            <span className="text-sm font-medium text-gray-800">{installment.sanctionDate}</span>
                          </div>
                          {installment.releaseDate && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-sm text-gray-600">Release Date</span>
                              <span className="text-sm font-medium text-gray-800">{installment.releaseDate}</span>
                            </div>
                          )}
                          {installment.transactionId && (
                            <>
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Transaction ID</span>
                                <span className="text-sm font-medium text-gray-800">{installment.transactionId}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">UTR Number</span>
                                <span className="text-sm font-medium text-gray-800">{installment.utrNumber}</span>
                              </div>
                            </>
                          )}
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Remarks</p>
                            <p className="text-sm text-gray-800">{installment.remarks}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800 mb-3">Document Status</h4>
                          
                          {installment.documentsSubmitted.length > 0 && (
                            <div className="mb-4">
                              <p className="text-xs text-gray-600 mb-2 font-medium">Submitted Documents</p>
                              <div className="space-y-2">
                                {installment.documentsSubmitted.map((doc, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span className="text-sm text-gray-800">{doc}</span>
                                    </div>
                                    <button className="text-green-600 hover:text-green-700">
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {installment.documentsRequired.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-600 mb-2 font-medium">Required Documents</p>
                              <div className="space-y-2">
                                {installment.documentsRequired.map((doc, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <div className="flex items-center space-x-2">
                                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                                      <span className="text-sm text-gray-800">{doc}</span>
                                    </div>
                                    <button className="text-orange-600 hover:text-orange-700 flex items-center space-x-1 text-xs font-medium">
                                      <Upload className="w-4 h-4" />
                                      <span>Upload</span>
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <button className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Required Documents
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {installment.transactionId && (
                        <div className="flex space-x-3">
                          <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center">
                            <Download className="w-4 h-4 mr-2" />
                            Download Payment Receipt
                          </button>
                          <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Verify on PFMS Portal
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {recentTransactions.map((transaction, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.type === 'credit' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {transaction.type === 'credit' ? 
                        <ArrowRight className="w-5 h-5 text-green-600" /> :
                        <FileText className="w-5 h-5 text-blue-600" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{transaction.description}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <p className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {transaction.date}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          transaction.status === 'Success' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className={`text-lg font-bold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-gray-800'
                  }`}>
                    {transaction.type === 'credit' ? '+' : ''}₹{transaction.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                <Info className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 mb-2">Need Help with Fund Status?</h4>
                <p className="text-sm text-gray-700 mb-4">
                  If you have questions about your fund disbursement or need to update your bank details, please contact our support team or visit the nearest PM-AJAY office.
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

export default FundStatus;
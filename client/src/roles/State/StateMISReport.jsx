import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  ShieldCheck,
  Loader2,
  Calendar,
  FileBarChart
} from 'lucide-react';

const StateMISReport = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [reportStatus, setReportStatus] = useState('Ready'); // Options: Draft, Ready, Sent

  // --- MOCK DATA ---
  const CURRENT_REPORT = {
    month: "November 2025",
    generated_on: "30 Nov 2025",
    total_districts: 30,
    districts_reported: 28, // 2 missing
    total_beneficiaries: 12540,
    financial_ask: "₹ 4.5 Cr"
  };

  const handleSendToCentral = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsModalOpen(false);
      setReportStatus('Sent');
      alert("Report successfully forwarded to Central Ministry!");
    }, 2000);
  };

  const handleDownload = () => {
    alert("Downloading Monthly MIS Report... Please wait.");
  };

  return (
    // REMOVED 'min-h-screen' to fix the scrollbar issue
    <div className="w-full p-6 font-sans text-slate-800">
      
      <div className="max-w-6xl mx-auto">
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="text-indigo-600 h-6 w-6" />
              </div>
              Monthly MIS Submission
            </h1>
            <p className="text-slate-500 text-sm mt-2 ml-1">
              Validate and submit State Progress Reports to the Central Ministry.
            </p>
          </div>

          {/* TOP ACTIONS */}
          <div className="flex gap-3">
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm active:scale-95"
            >
              <Download size={18} />
              Download Report
            </button>
            
            {reportStatus === 'Sent' ? (
               <button disabled className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-5 py-2.5 rounded-lg text-sm font-bold cursor-not-allowed border border-emerald-200">
                 <CheckCircle2 size={18} /> Submitted
               </button>
            ) : (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
              >
                <Send size={18} />
                Send to Central
              </button>
            )}
          </div>
        </div>

        {/* --- MAIN CARD --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Card Header Strip */}
            <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Calendar size={20} />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-slate-800">{CURRENT_REPORT.month}</h3>
                    <p className="text-xs text-slate-500 font-medium">Generated: {CURRENT_REPORT.generated_on}</p>
                 </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border ${
                reportStatus === 'Sent' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                STATUS: {reportStatus.toUpperCase()}
              </span>
            </div>

            {/* Content Body */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Metric 1: Data Coverage */}
                <div className="p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">District Coverage</p>
                    <FileBarChart className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={20}/>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{CURRENT_REPORT.districts_reported}</span>
                    <span className="text-sm text-slate-400 font-medium">/ {CURRENT_REPORT.total_districts} Reported</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4 mb-2">
                    <div 
                      className={`h-1.5 rounded-full ${CURRENT_REPORT.districts_reported < CURRENT_REPORT.total_districts ? 'bg-amber-400' : 'bg-emerald-500'}`} 
                      style={{ width: `${(CURRENT_REPORT.districts_reported/CURRENT_REPORT.total_districts)*100}%` }}
                    ></div>
                  </div>

                  {CURRENT_REPORT.districts_reported < CURRENT_REPORT.total_districts ? (
                      <p className="text-xs text-amber-600 flex items-center gap-1.5 font-medium bg-amber-50 p-2 rounded-lg border border-amber-100 mt-2">
                        <AlertTriangle size={14} /> 
                        Action: 2 Districts Pending to 
                      </p>
                  ) : (
                      <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium mt-2">
                        <CheckCircle2 size={14} /> All Districts Submitted
                      </p>
                  )}
                </div>

                {/* Metric 2: Financials */}
                <div className="p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md transition-all group">
                   <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Financial Ask</p>
                    <CheckCircle2 className="text-slate-300 group-hover:text-emerald-500 transition-colors" size={20}/>
                  </div>
                  <div className="mt-1">
                    <span className="text-3xl font-bold text-slate-900">{CURRENT_REPORT.financial_ask}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                    Total fund requirement requested for this month based on utilized certificates.
                  </p>
                </div>

              </div>
            </div>
        </div>
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            
            {/* Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="text-indigo-600" size={20} /> 
                Confirm Submission
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                You are about to send the <span className="font-bold text-slate-900">November 2025</span> MIS Report to the Central Ministry. This action <span className="text-red-600 font-medium">cannot be undone</span>.
              </p>
              
              <div className="mb-5">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Remarks (Optional)</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  rows="3"
                  placeholder="e.g., Delay in Angul district due to floods..."
                ></textarea>
              </div>

              {CURRENT_REPORT.districts_reported < CURRENT_REPORT.total_districts && (
                <div className="flex gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-xs text-amber-800 leading-snug">
                    <strong>Warning:</strong> 2 Districts have not submitted data. Sending now will mark them as "Zero Performance".
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3 justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-200 hover:text-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendToCentral}
                disabled={isSending}
                className="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <> <Loader2 size={16} className="animate-spin" /> Sending... </>
                ) : (
                  <> Confirm & Send </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateMISReport;
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
  ShieldCheck,
  Send,
  RefreshCw,
  Info,
  ArrowUpRight,
  Download
} from "lucide-react";

const BeneficiaryFundDetails = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  // FETCH APPLICATION FROM BACKEND
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get(
          "https://sujhaa-backend.onrender.com/api/application/my-applications",
          { withCredentials: true }
        );

        if (res.data.success && res.data.applications.length > 0) {
          const latestApp =
            res.data.applications[res.data.applications.length - 1];
          setApplication(latestApp);
        }
      } catch (err) {
        console.log("Error fetching applications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  // LOADING UI
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-base font-medium">Loading details...</p>
        </div>
      </div>
    );

  // NO APPLICATION UI
  if (!application)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-lg p-10 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">
            No Applications Found
          </h2>
          <p className="text-slate-500 text-base mb-8">
            You have not applied to any PM-AJAY GIA scheme yet.
          </p>
          <a
            href="/beneficiary/dashboard"
            className="inline-flex items-center gap-2 font-medium bg-emerald-600 text-white px-8 py-3 rounded-lg text-base hover:bg-emerald-700 transition-colors shadow-md"
          >
            Apply for a Scheme <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    );

  // LOGIC
  const sanctioned = application.scheme_id?.maxFundingAmount || 0;
  const isCentralApproved = application.status === "CENTRAL_APPROVED";

  // MOCK TRANSACTIONS
  const mockTransactions = isCentralApproved
    ? [
      {
        id: "TXN-001",
        date: "12 Dec 2025",
        installment: "1st Installment",
        amount: sanctioned * 0.5,
        status: "Success",
        utr: "SBI00990011",
      },
      {
        id: "TXN-002",
        date: "20 Dec 2025",
        installment: "Final Installment",
        amount: sanctioned * 0.5,
        status: "Success",
        utr: "SBI00990022",
      },
    ]
    : [];

  const stats = {
    sanctioned,
    received: isCentralApproved
      ? mockTransactions.reduce((sum, t) => sum + t.amount, 0)
      : 0,
    pending: isCentralApproved ? 0 : sanctioned,
  };

  const disbursementSteps = [
    {
      id: 1,
      label: "Approval",
      sub: "Ministry Sanction",
      icon: FileText,
      completed: true,
    },
    {
      id: 2,
      label: "Validation",
      sub: "PFMS Check",
      icon: ShieldCheck,
      completed: true,
    },
    {
      id: 3,
      label: "Transfer",
      sub: "Bank Processing",
      icon: Send,
      completed: false,
      current: true,
    },
    {
      id: 4,
      label: "Update",
      sub: "Credit Confirm",
      icon: RefreshCw,
      completed: false,
    },
  ];

  const completedSteps = disbursementSteps.filter((s) => s.completed).length;
  const progressPercent = (completedSteps / (disbursementSteps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-emerald-200">
                Financial Dashboard
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Fund Disbursement
            </h1>
            <p className="text-slate-500 text-base mt-1">
              PM-AJAY Grant-in-Aid Component Details
            </p>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

          {/* SCHEME HEADER */}
          <div className="bg-slate-50/80 px-8 py-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                <FileText className="text-emerald-600 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 leading-tight">
                  {application.scheme_id?.name}
                </h2>
                <p className="text-sm text-slate-500 font-mono mt-1">
                  ID: {application.application_id}
                </p>
              </div>
            </div>
          </div>

          {/* CONTENT BODY */}
          <div className="p-8 space-y-10">

            {/* === FLOWCHART (Medium Size) === */}
            <div className="border border-slate-200 rounded-xl p-8 bg-slate-50/30 relative">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-base font-bold text-slate-700">Tracking Lifecycle</h3>
                <span className="text-xs font-medium text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                  Status: <span className="text-amber-600 font-bold ml-1">Processing</span>
                </span>
              </div>

              <div className="hidden md:block relative px-6">
                {/* Background Line */}
                <div className="absolute top-6 left-0 w-full h-1.5 bg-slate-200 rounded-full -z-0"></div>

                {/* Progress Line */}
                <div
                  className="absolute top-6 left-0 h-1.5 bg-emerald-500 rounded-full transition-all duration-1000 ease-out -z-0 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                ></div>

                <div className="flex justify-between relative z-10">
                  {disbursementSteps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center group w-32">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-300 bg-white ${step.completed
                        ? "border-emerald-500 text-emerald-600 shadow-md scale-105"
                        : step.current
                          ? "border-amber-400 text-amber-500 shadow-lg ring-4 ring-amber-50 scale-110"
                          : "border-slate-200 text-slate-300"
                        }`}>
                        {step.completed ? <CheckCircle size={22} strokeWidth={2.5} /> : <step.icon size={20} />}
                      </div>
                      <div className="text-center mt-4 space-y-1">
                        <p className={`text-sm font-bold ${step.completed ? 'text-slate-800' : 'text-slate-500'}`}>
                          {step.label}
                        </p>
                        <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wide">{step.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Flow (Vertical) */}
              <div className="md:hidden space-y-6">
                {disbursementSteps.map((step, i) => (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${step.completed ? "bg-emerald-50 border-emerald-500 text-emerald-600" :
                      step.current ? "bg-amber-50 border-amber-400 text-amber-600" :
                        "bg-white border-slate-200 text-slate-300"
                      }`}>
                      {step.completed ? <CheckCircle size={18} /> : <step.icon size={18} />}
                    </div>
                    <div>
                      <p className={`text-base font-bold ${step.completed || step.current ? "text-slate-800" : "text-slate-400"}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-slate-400 font-medium uppercase mt-0.5">{step.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* === CURRENT STATUS ALERT === */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-4 shadow-sm">
              <div className="p-2 bg-amber-100 rounded-full flex-shrink-0 text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-900 mb-1">Bank Transfer Initiated</h3>
                <p className="text-sm text-amber-800 leading-relaxed">
                  PFMS validation is complete. The transfer file has been sent to the bank. Please allow <strong>24-48 hours</strong> for the amount to reflect in your account.
                </p>
              </div>
            </div>

            {/* === STATS GRID === */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Sanctioned */}
              <div className="p-6 rounded-xl border border-blue-100 bg-blue-50/50 flex flex-col justify-between h-32">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Sanctioned</span>
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Wallet size={18} /></div>
                </div>
                <p className="text-3xl font-extrabold text-slate-800">₹{stats.sanctioned.toLocaleString()}</p>
              </div>

              {/* Received */}
              <div className="p-6 rounded-xl border border-slate-200 bg-white flex flex-col justify-between h-32">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Received</span>
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><TrendingUp size={18} /></div>
                </div>
                <p className="text-3xl font-extrabold text-slate-400">₹{stats.received.toLocaleString()}</p>
              </div>

              {/* Pending */}
              <div className="p-6 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between h-32">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Pending</span>
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><Clock size={18} /></div>
                </div>
                <p className="text-3xl font-extrabold text-slate-800">₹{stats.pending.toLocaleString()}</p>
              </div>
            </div>

            {/* === TRANSACTION TABLE === */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-700 flex items-center gap-2">
                  <FileText size={20} className="text-slate-500" /> Transaction History
                </h3>
                {mockTransactions.length > 0 && (
                  <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
                    <Download size={14} /> Download CSV
                  </button>
                )}
              </div>

              {mockTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-white text-slate-500 border-b border-slate-100">
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Reference</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {mockTransactions.map((txn) => (
                        <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800">{txn.installment}</div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">UTR: {txn.utr}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{txn.date}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <CheckCircle size={12} strokeWidth={2.5} /> {txn.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-emerald-700 text-base">
                            ₹{txn.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-10 text-center bg-white">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock size={20} className="text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Processing Transfer...</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Transaction details will appear here automatically once the bank confirms the payment.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryFundDetails;
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
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
          // If user has multiple applications → show latest
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
      <div className="p-10 text-center text-gray-500">Loading fund details...</div>
    );

  // NO APPLICATION UI
  if (!application)
    return (
      <div className="p-10 max-w-xl mx-auto mt-10 text-center bg-white border rounded-2xl shadow-sm">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">
          No Applications Found
        </h2>
        <p className="text-gray-500 mt-2">
          You have not applied to any PM-AJAY GIA scheme yet.
        </p>

        <a
          href="/beneficiary/dashboard"
          className="font-semibold mt-5 inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Apply for a Scheme
        </a>
      </div>
    );

  // Extract scheme funding amount
  const sanctioned = application.scheme_id?.maxFundingAmount || 0;

  // Check if central approval is done
  const isCentralApproved = application.status === "CENTRAL_APPROVED";

  // MOCK TRANSACTIONS only if approved
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
    received:
      isCentralApproved &&
      mockTransactions.reduce((sum, t) => sum + t.amount, 0),
    pending: isCentralApproved ? 0 : sanctioned,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      {/* MAIN HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          GIA Fund Disbursement
        </h1>
        <p className="text-gray-500 text-sm">
          Financial assistance details under PM-AJAY GIA Component
        </p>
      </div>

      {/* CARD WRAPPER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="text-green-700 w-5 h-5" />
            <h2 className="text-lg font-bold text-gray-800">
              {application.scheme_id?.name}
            </h2>
          </div>
          <p className="text-xs text-gray-500 ml-7">
            Application ID: {application.application_id}
          </p>
        </div>

        <div className="p-6 space-y-10">
          {/* WARNING – WAIT FOR CENTRAL APPROVAL */}
          {!isCentralApproved && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-yellow-600 w-5 h-5 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-700">
                  Awaiting Central Ministry Approval
                </h3>
                <p className="text-sm text-yellow-700/80 mt-1">
                  Funds will be released once your application is approved by
                  the Central Authority.
                </p>
              </div>
            </div>
          )}

          {/* FUND CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sanctioned */}
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Wallet className="text-blue-600 w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-200 px-2 py-1 rounded">
                  SANCTIONED
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                ₹{stats.sanctioned.toLocaleString()}
              </h3>
            </div>

            {/* Received */}
            <div className="bg-green-50 p-5 rounded-xl border border-green-200">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-green-600/10 rounded-lg">
                  <TrendingUp className="text-green-700 w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-green-700 bg-green-200 px-2 py-1 rounded">
                  RECEIVED
                </span>
              </div>
              <h3 className="text-2xl font-bold text-green-800">
                ₹{false ? stats.received?.toLocaleString() : 0}
              </h3>
            </div>

            {/* Pending */}
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="text-orange-600 w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  PENDING
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                ₹{stats.pending.toLocaleString()}
              </h3>
            </div>
          </div>

          {/* TRANSACTION HISTORY */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">
                Transaction History
              </h3>
            </div>

            {mockTransactions.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4 font-medium">Installment / UTR</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <p className="font-medium text-gray-800 text-sm">
                          {txn.installment}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          UTR: {txn.utr}
                        </p>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{txn.date}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                          <CheckCircle size={10} /> {txn.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-green-700">
                        ₹{txn.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-gray-500 text-sm">
                No fund transactions yet.
                <br />Funds will be credited after Central Ministry Approval.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryFundDetails;

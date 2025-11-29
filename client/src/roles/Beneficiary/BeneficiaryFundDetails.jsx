import React from 'react';
import { Wallet, TrendingUp, Clock, CheckCircle, ArrowDownLeft, FileText } from 'lucide-react';

const BeneficiaryFundDetails = () => {


  // MOCK DATA: Array of Schemes with their specific funds and transactions
  const schemesData = [
    {
      id: "SCH-001",
      name: "Pradhan Mantri Adarsh Gram Yojana (PMAGY)",
      stats: {
        sanctioned: 50000,
        received: 30000,
        pending: 20000,
      },
      transactions: [
        {
          id: "TXN-8829102",
          date: "10 Nov 2024",
          installment: "1st Installment",
          amount: 30000,
          status: "Success",
          utr: "SBI000998877"
        }
      ]
    },
    {
      id: "SCH-002",
      name: "PM-AJAY: Grant Component",
      stats: {
        sanctioned: 25000,
        received: 25000,
        pending: 0,
      },
      transactions: [
        {
          id: "TXN-9910203",
          date: "15 Oct 2024",
          installment: "Advance Payment",
          amount: 10000,
          status: "Success",
          utr: "HDFC002233"
        },
        {
          id: "TXN-9910204",
          date: "25 Nov 2024",
          installment: "Final Settlement",
          amount: 15000,
          status: "Success",
          utr: "HDFC002299"
        }
      ]
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      
      {/* Main Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fund Disbursement Details</h1>
        <p className="text-gray-500 text-sm">Detailed financial breakdown per applied scheme</p>
      </div>

      {/* --- LOOP THROUGH SCHEMES --- */}
      {schemesData.map((scheme) => (
        
        <div key={scheme.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Scheme Header */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
             <div className="flex items-center gap-2 mb-1">
                <FileText className="text-green-700 w-5 h-5" />
                <h2 className="text-lg font-bold text-gray-800">{scheme.name}</h2>
             </div>
             <p className="text-xs text-gray-500 ml-7">Scheme ID: {scheme.id}</p>
          </div>

          <div className="p-6 space-y-8">
            
            {/* 1. THREE CARDS STATS (Specific to this scheme) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Sanctioned */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Wallet className="text-blue-600 w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-200 px-2 py-1 rounded">SANCTIONED</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">₹{scheme.stats.sanctioned.toLocaleString()}</h3>
              </div>

              {/* Card 2: Received */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-5 rounded-xl border border-green-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-green-600/10 rounded-lg">
                    <TrendingUp className="text-green-700 w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-green-700 bg-green-200 px-2 py-1 rounded">RECEIVED</span>
                </div>
                <h3 className="text-2xl font-bold text-green-800">₹{scheme.stats.received.toLocaleString()}</h3>
              </div>

              {/* Card 3: Pending */}
              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="text-orange-600 w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">PENDING</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">₹{scheme.stats.pending.toLocaleString()}</h3>
              </div>
            </div>

            {/* 2. TRANSACTION TABLE (Specific to this scheme) */}
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">Transaction History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4 font-medium">Description / UTR</th>
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {scheme.transactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <p className="font-medium text-gray-800 text-sm">{txn.installment}</p>
                          <p className="text-xs text-gray-400 mt-0.5">UTR: {txn.utr}</p>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{txn.date}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                            <CheckCircle size={10} /> {txn.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-green-700 font-bold flex items-center justify-end gap-1 text-sm">
                            + ₹{txn.amount.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {scheme.transactions.length === 0 && (
                   <div className="p-4 text-center text-sm text-gray-400">No transactions yet.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default BeneficiaryFundDetails;
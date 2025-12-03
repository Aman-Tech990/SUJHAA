import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  MessageCircle
} from 'lucide-react';
import { toast } from "sonner";

// --- MOCK DATA: ALL DISTRICTS ---
const DISTRICT_DATA = [
  { id: 1, name: 'Angul', applied: 1200, verified: 1150, disbursed: 1100, pending: 50 },
  { id: 2, name: 'Balasore', applied: 3400, verified: 2800, disbursed: 2000, pending: 600 },
  { id: 3, name: 'Bargarh', applied: 2100, verified: 2000, disbursed: 1950, pending: 100 },
  { id: 4, name: 'Bhadrak', applied: 1800, verified: 1200, disbursed: 800, pending: 600 },
  { id: 5, name: 'Bolangir', applied: 4500, verified: 4400, disbursed: 4300, pending: 100 },
  { id: 6, name: 'Cuttack', applied: 5200, verified: 3500, disbursed: 3000, pending: 1700 },
  { id: 7, name: 'Deogarh', applied: 800, verified: 780, disbursed: 750, pending: 20 },
  { id: 8, name: 'Dhenkanal', applied: 1500, verified: 1400, disbursed: 1300, pending: 100 },
  { id: 9, name: 'Ganjam', applied: 6500, verified: 6200, disbursed: 6000, pending: 300 },
  { id: 10, name: 'Khordha', applied: 7200, verified: 7000, disbursed: 6900, pending: 200 },
  { id: 11, name: 'Puri', applied: 3100, verified: 1500, disbursed: 1000, pending: 1600 },
  { id: 12, name: 'Sambalpur', applied: 2800, verified: 2600, disbursed: 2500, pending: 200 },
];

const StateBeneficiary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'applied', direction: 'desc' });

  // ⭐ For Message Modal
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [message, setMessage] = useState("");

  // 1. FILTER + SORT
  const processedData = useMemo(() => {
    let data = [...DISTRICT_DATA];

    if (searchTerm) {
      data = data.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    data.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') direction = 'asc';
    setSortConfig({ key, direction });
  };

  // ⭐ Handle Message Send
  const handleSend = () => {
    // fake loading
    toast.loading("Sending message...", { duration: 1500 });

    setTimeout(() => {
      toast.success(`Message sent to ${selectedDistrict} District Officer`);
      setIsMessageOpen(false);
      setMessage("");
    }, 1600);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-800">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="text-indigo-600" />
          District-Wise Beneficiary Report
        </h1>
        <p className="text-slate-500 text-sm">Track verification & disbursement performance.</p>
      </div>

      {/* SEARCH + FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-col md:flex-row justify-between items-center gap-4">

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search district name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">

            <thead>
              <tr className="bg-slate-50 text-xs uppercase text-slate-500">
                <th className="px-6 py-4">District</th>
                <th className="px-6 py-4 cursor-pointer" onClick={() => requestSort('applied')}>
                  Total Applied
                </th>
                <th className="px-6 py-4">Verification Status</th>
                <th className="px-6 py-4 text-right cursor-pointer" onClick={() => requestSort('disbursed')}>
                  Disbursed
                </th>
                <th className="px-6 py-4 text-center">Performance</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {processedData.map((d) => {
                const pct = Math.round((d.verified / d.applied) * 100);
                const lag = pct < 60;

                return (
                  <tr key={d.id} className="hover:bg-slate-50">

                    <td className="px-6 py-4 font-semibold">{d.name}</td>

                    <td className="px-6 py-4">{d.applied.toLocaleString()}</td>

                    <td className="px-6 py-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-green-700">{d.verified} Verified</span>
                        <span className="text-amber-600">{d.pending} Pending</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full">
                        <div className={`h-full ${lag ? "bg-amber-400" : "bg-green-500"}`}
                          style={{ width: `${pct}%` }}>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right font-bold">{d.disbursed.toLocaleString()}</td>

                    <td className="px-6 py-4 text-center">
                      {lag ? (
                        <span className="px-3 py-1 text-xs bg-red-50 text-red-700 rounded-full">
                          <AlertCircle size={12} /> Lagging
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded-full">
                          <CheckCircle2 size={12} /> On Track
                        </span>
                      )}
                    </td>

                    {/* ⭐ ACTION BUTTON (Send Message) */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedDistrict(d.name);
                          setIsMessageOpen(true);
                        }}
                        className="p-2 rounded-lg hover:bg-slate-100"
                      >
                        <MessageCircle className="text-indigo-600" />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ⭐ MESSAGE MODAL */}
      {isMessageOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 w-96 rounded-xl shadow-xl">

            <h2 className="text-lg font-semibold mb-2">
              Message to {selectedDistrict} District Officer
            </h2>

            <textarea
              rows={4}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setIsMessageOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300"
              >
                Cancel
              </button>

              <button
                onClick={handleSend}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Send Message
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default StateBeneficiary;

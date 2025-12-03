import React, { useState, useMemo } from 'react';
import {
  Search, Download, Filter, ChevronDown, Wallet, TrendingUp,
  AlertTriangle, CheckCircle2, ArrowUpDown, MessageCircle, Send
} from 'lucide-react';
import { toast } from "sonner";

// --- PM-AJAY REALISTIC FUNDING MOCK DATA (IN CRORES) ---
const FUND_DATA = [
  { id: 1, district: 'Angul', allocated: 6.5, released: 5.2, utilized: 4.7, schemes: 135 },
  { id: 2, district: 'Balasore', allocated: 8.0, released: 6.0, utilized: 2.5, schemes: 182 },
  { id: 3, district: 'Bargarh', allocated: 4.0, released: 3.8, utilized: 3.7, schemes: 92 },
  { id: 4, district: 'Bhadrak', allocated: 5.1, released: 4.0, utilized: 1.8, schemes: 110 },
  { id: 5, district: 'Bolangir', allocated: 9.0, released: 8.5, utilized: 8.0, schemes: 215 },
  { id: 6, district: 'Cuttack', allocated: 12.0, released: 10.0, utilized: 9.5, schemes: 320 },
  { id: 7, district: 'Deogarh', allocated: 2.0, released: 1.5, utilized: 1.4, schemes: 50 },
  { id: 8, district: 'Dhenkanal', allocated: 5.5, released: 5.0, utilized: 3.5, schemes: 145 },
  { id: 9, district: 'Ganjam', allocated: 15.0, released: 14.0, utilized: 13.5, schemes: 410 },
  { id: 10, district: 'Khordha', allocated: 18.0, released: 17.5, utilized: 17.0, schemes: 530 },
  { id: 11, district: 'Puri', allocated: 7.0, released: 6.5, utilized: 3.0, schemes: 160 },
  { id: 12, district: 'Sambalpur', allocated: 6.0, released: 5.5, utilized: 4.0, schemes: 130 },
];

const StateFundReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'utilized', direction: 'desc' });

  // For Message Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // ------------- FILTER & SORT LOGIC -------------
  const processedData = useMemo(() => {
    let data = [...FUND_DATA];

    if (searchTerm) {
      data = data.filter(d => d.district.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (filterStatus !== 'All') {
      data = data.filter(d => {
        const pct = (d.utilized / d.released) * 100;
        if (filterStatus === 'Critical') return pct < 50;
        if (filterStatus === 'Moderate') return pct >= 50 && pct < 80;
        if (filterStatus === 'Good') return pct >= 80;
        return true;
      });
    }

    data.sort((a, b) => {
      const valA = sortConfig.key === 'status' ? (a.utilized / a.released) : a[sortConfig.key];
      const valB = sortConfig.key === 'status' ? (b.utilized / b.released) : b[sortConfig.key];

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [searchTerm, filterStatus, sortConfig]);

  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  // -------------- SEND MESSAGE TO DISTRICT OFFICER --------------
  const sendMessage = () => {
    if (!message.trim()) return toast.error("Message cannot be empty");

    setSending(true);

    setTimeout(() => {
      setSending(false);
      toast.success(`Successfully sent message to ${selectedDistrict} District Officer`);
      setShowModal(false);
      setMessage('');
    }, 1800); // fake 1.8 sec delay
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-800">

      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Wallet className="text-indigo-600" />
          PM-AJAY Financial Utilization Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Live monitoring of district-level fund allocation, release, and utilization.
        </p>
      </div>

      {/* MODAL FOR MESSAGE */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg animate-fadeIn">
            <h2 className="text-xl font-semibold mb-3">Message to {selectedDistrict} Officer</h2>

            <textarea
              rows="4"
              className="w-full border rounded-lg p-3 text-sm focus:ring-indigo-500"
              placeholder="Type your instructions..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>

            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-slate-200 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2"
                disabled={sending}
                onClick={sendMessage}
              >
                {sending ? (
                  <span className="animate-pulse">Sending...</span>
                ) : (
                  <>
                    <Send size={16} /> Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTROLS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-wrap gap-4 justify-between items-center">

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search district..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-slate-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative w-48">
            <Filter className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <select
              className="w-full pl-9 pr-8 py-2 border rounded-lg bg-slate-50"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Good">On Track (&gt; 80%)</option>
              <option value="Moderate">Moderate (50–80%)</option>
              <option value="Critical">Critical (&lt; 50%)</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 text-slate-400" size={14} />
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
              <th className="px-6 py-4">District</th>
              <th className="px-6 py-4">Allocated</th>
              <th className="px-6 py-4">Released</th>
              <th className="px-6 py-4 w-1/4">Utilization</th>
              <th className="px-6 py-4 text-right">Utilized</th>
              <th className="px-6 py-4 text-center">Message</th>
            </tr>
          </thead>

          <tbody>
            {processedData.map((row) => {
              const pct = Math.round((row.utilized / row.released) * 100);

              return (
                <tr key={row.id} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold">{row.district}</td>
                  <td className="px-6 py-4">₹ {row.allocated} Cr</td>
                  <td className="px-6 py-4 font-medium">₹ {row.released} Cr</td>

                  <td className="px-6 py-4">
                    <div className="text-xs mb-1 text-slate-500">{pct}% Used</div>
                    <div className="bg-slate-100 w-full h-2 rounded-full">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right font-bold">
                    ₹ {row.utilized} Cr
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedDistrict(row.district);
                        setShowModal(true);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg flex items-center gap-1 hover:bg-indigo-700 mx-auto"
                    >
                      <MessageCircle size={14} /> Send
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default StateFundReport;

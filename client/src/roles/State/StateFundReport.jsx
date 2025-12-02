import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  ChevronDown, 
  Wallet,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowUpDown
} from 'lucide-react';

// --- MOCK DATA: FINANCIALS (IN CRORES) ---
const FUND_DATA = [
  { id: 1, district: 'Angul', allocated: 5.0, released: 4.5, utilized: 4.25 },
  { id: 2, district: 'Balasore', allocated: 8.0, released: 6.0, utilized: 2.5 }, // Critical
  { id: 3, district: 'Bargarh', allocated: 4.0, released: 3.8, utilized: 3.7 },
  { id: 4, district: 'Bhadrak', allocated: 4.5, released: 4.0, utilized: 1.8 }, // Critical
  { id: 5, district: 'Bolangir', allocated: 9.0, released: 8.5, utilized: 8.0 },
  { id: 6, district: 'Cuttack', allocated: 12.0, released: 10.0, utilized: 9.5 },
  { id: 7, district: 'Deogarh', allocated: 2.0, released: 1.5, utilized: 1.4 },
  { id: 8, district: 'Dhenkanal', allocated: 5.5, released: 5.0, utilized: 3.5 }, // Moderate
  { id: 9, district: 'Ganjam', allocated: 15.0, released: 14.0, utilized: 13.5 },
  { id: 10, district: 'Khordha', allocated: 18.0, released: 17.5, utilized: 17.0 },
  { id: 11, district: 'Puri', allocated: 7.0, released: 6.5, utilized: 3.0 }, // Critical
  { id: 12, district: 'Sambalpur', allocated: 6.0, released: 5.5, utilized: 4.0 }, // Moderate
];

const StateFundReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // Options: All, Critical, Moderate, Good
  const [sortConfig, setSortConfig] = useState({ key: 'utilized', direction: 'desc' });

  // 1. FILTER & SORT LOGIC
  const processedData = useMemo(() => {
    let data = [...FUND_DATA];

    // Search Filter
    if (searchTerm) {
      data = data.filter(d => d.district.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Status Filter (Based on Utilization %)
    if (filterStatus !== 'All') {
      data = data.filter(d => {
        const pct = (d.utilized / d.released) * 100;
        if (filterStatus === 'Critical') return pct < 50;
        if (filterStatus === 'Moderate') return pct >= 50 && pct < 80;
        if (filterStatus === 'Good') return pct >= 80;
        return true;
      });
    }

    // Sorting
    data.sort((a, b) => {
      // Calculate percentages for sort if sorting by 'status'
      const valA = sortConfig.key === 'status' ? (a.utilized / a.released) : a[sortConfig.key];
      const valB = sortConfig.key === 'status' ? (b.utilized / b.released) : b[sortConfig.key];

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [searchTerm, filterStatus, sortConfig]);

  // Helper to handle sort click
  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-800">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Wallet className="text-indigo-600" />
            District Fund Utilization Report
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track financial allocation, release, and actual utilization across districts.
          </p>
        </div>
      </div>

      {/* --- CONTROLS BAR --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Left: Search & Status Filter */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 text-slate-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search district..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-3 top-2.5 text-slate-400 h-4 w-4" />
            <select 
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Good">On Track (&gt; 80%)</option>
              <option value="Moderate">Moderate (50-80%)</option>
              <option value="Critical">Critical (&lt; 50%)</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 text-slate-400 h-3 w-3 pointer-events-none" />
          </div>
        </div>

        {/* Right: Legend */}
        <div className="hidden md:flex gap-4 text-xs font-medium text-slate-500">
           <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> On Track</span>
           <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Moderate</span>
           <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Critical</span>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Table Header */}
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="px-6 py-4">District</th>
                <th className="px-6 py-4 cursor-pointer hover:text-indigo-600" onClick={() => requestSort('allocated')}>
                  <div className="flex items-center gap-1">Allocated <ArrowUpDown size={12}/></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-indigo-600" onClick={() => requestSort('released')}>
                  <div className="flex items-center gap-1">Released <ArrowUpDown size={12}/></div>
                </th>
                <th className="px-6 py-4 w-1/4">Utilization Progress</th>
                <th className="px-6 py-4 text-right cursor-pointer hover:text-indigo-600" onClick={() => requestSort('utilized')}>
                   <div className="flex items-center justify-end gap-1">Utilized<ArrowUpDown size={12}/></div>
                </th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {processedData.map((row) => {
                const pct = Math.round((row.utilized / row.released) * 100);
                const remaining = (row.released - row.utilized).toFixed(2);
                
                // Color Logic
                let statusColor = 'bg-emerald-500'; // Green
                let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                let Icon = CheckCircle2;
                let statusText = 'Good';

                if (pct < 50) {
                  statusColor = 'bg-red-500';
                  badgeClass = 'bg-red-50 text-red-700 border-red-100';
                  Icon = AlertTriangle;
                  statusText = 'Critical';
                } else if (pct < 80) {
                  statusColor = 'bg-yellow-400';
                  badgeClass = 'bg-yellow-50 text-yellow-700 border-yellow-100';
                  Icon = TrendingUp;
                  statusText = 'Moderate';
                }

                return (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* District */}
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {row.district}
                    </td>

                    {/* Allocated */}
                    <td className="px-6 py-4 text-slate-600">
                      ₹ {row.allocated} Cr
                    </td>

                    {/* Released */}
                    <td className="px-6 py-4 font-medium text-slate-800">
                      ₹ {row.released} Cr
                    </td>

                    {/* Progress Bar */}
                    <td className="px-6 py-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">{pct}% Used</span>
                        <span className="text-slate-400">₹ {remaining} Cr left</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${statusColor}`} 
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </td>

                    {/* Utilized Amount (Right Aligned) */}
                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                      ₹ {row.utilized} Cr
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${badgeClass}`}>
                        <Icon size={12} /> {statusText}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {processedData.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <Wallet size={48} className="mx-auto text-slate-300 mb-3" />
            <p>No fund records found for "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StateFundReport;
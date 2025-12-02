import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  ChevronDown, 
  MoreHorizontal,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

// --- MOCK DATA: ALL DISTRICTS ---
const DISTRICT_DATA = [
  { id: 1, name: 'Angul', applied: 1200, verified: 1150, disbursed: 1100, pending: 50 },
  { id: 2, name: 'Balasore', applied: 3400, verified: 2800, disbursed: 2000, pending: 600 },
  { id: 3, name: 'Bargarh', applied: 2100, verified: 2000, disbursed: 1950, pending: 100 },
  { id: 4, name: 'Bhadrak', applied: 1800, verified: 1200, disbursed: 800, pending: 600 },
  { id: 5, name: 'Bolangir', applied: 4500, verified: 4400, disbursed: 4300, pending: 100 },
  { id: 6, name: 'Cuttack', applied: 5200, verified: 3500, disbursed: 3000, pending: 1700 }, // High pending
  { id: 7, name: 'Deogarh', applied: 800, verified: 780, disbursed: 750, pending: 20 },
  { id: 8, name: 'Dhenkanal', applied: 1500, verified: 1400, disbursed: 1300, pending: 100 },
  { id: 9, name: 'Ganjam', applied: 6500, verified: 6200, disbursed: 6000, pending: 300 },
  { id: 10, name: 'Khordha', applied: 7200, verified: 7000, disbursed: 6900, pending: 200 },
  { id: 11, name: 'Puri', applied: 3100, verified: 1500, disbursed: 1000, pending: 1600 }, // High pending
  { id: 12, name: 'Sambalpur', applied: 2800, verified: 2600, disbursed: 2500, pending: 200 },
];

const StateBeneficiary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'applied', direction: 'desc' });

  // 1. FILTER & SORT LOGIC
  const processedData = useMemo(() => {
    let data = [...DISTRICT_DATA];

    // Search Filter
    if (searchTerm) {
      data = data.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Sorting
    data.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return data;
  }, [searchTerm, sortConfig]);

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
            <Users className="text-indigo-600" />
            District-Wise Beneficiary Report
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Detailed breakdown of beneficiary verification and fund disbursement status.
          </p>
        </div>

        
      </div>

      {/* --- CONTROLS BAR --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 text-slate-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search district name..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Quick Stats Summary */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600">Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="text-slate-600">Pending</span>
          </div>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Table Header */}
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="px-6 py-4">District Name</th>
                <th 
                  className="px-6 py-4 cursor-pointer hover:text-indigo-600"
                  onClick={() => requestSort('applied')}
                >
                  <div className="flex items-center gap-1">
                    Total Applied <ChevronDown size={14} className={sortConfig.key === 'applied' ? 'text-indigo-600' : 'text-slate-300'} />
                  </div>
                </th>
                <th className="px-6 py-4 w-1/3">Verification Status</th>
                <th 
                  className="px-6 py-4 cursor-pointer hover:text-indigo-600 text-right"
                  onClick={() => requestSort('disbursed')}
                >
                  Funds Disbursed
                </th>
                <th className="px-6 py-4 text-center">Performance</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {processedData.map((district) => {
                // Calculate percentages for visuals
                const verifiedPct = Math.round((district.verified / district.applied) * 100);
                const isLagging = verifiedPct < 60;

                return (
                  <tr key={district.id} className="hover:bg-slate-50 transition-colors group">
                    
                    {/* Column 1: Name */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{district.name}</p>
                      <p className="text-xs text-slate-400">ID: OD-{district.id.toString().padStart(2, '0')}</p>
                    </td>

                    {/* Column 2: Total Count */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{district.applied.toLocaleString()}</div>
                    </td>

                    {/* Column 3: Progress Bar */}
                    <td className="px-6 py-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-emerald-700">{district.verified} Verified</span>
                        <span className="text-amber-600">{district.pending} Pending</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isLagging ? 'bg-amber-400' : 'bg-emerald-500'}`} 
                          style={{ width: `${verifiedPct}%` }}
                        ></div>
                      </div>
                    </td>

                    {/* Column 4: Funds */}
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-slate-700">{district.disbursed.toLocaleString()}</div>
                      <span className="text-xs text-slate-400">Beneficiaries Paid</span>
                    </td>

                    {/* Column 5: Status Tag */}
                    <td className="px-6 py-4 text-center">
                      {isLagging ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                          <AlertCircle size={12} /> Lagging
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                          <CheckCircle2 size={12} /> On Track
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Empty State if Search Fails */}
        {processedData.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <Users size={48} className="mx-auto text-slate-300 mb-3" />
            <p>No districts found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StateBeneficiary;
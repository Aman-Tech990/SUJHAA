import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  Map,
  LayoutGrid,
  ChevronDown
} from 'lucide-react';

// --- MOCK DATA: TRAINING CENTRES ---
const CENTRES_DATA = [
  { 
    id: 1, 
    name: 'CV Raman Skill Academy', 
    district: 'Khordha', 
    trades: ['Electrician', 'Solar Panel Tech'], 
    capacity: 120, 
    enrolled: 110, 
    status: 'Active', 
    inspection_due: false,
    rating: 4.8 
  },
  { 
    id: 2, 
    name: 'Maa Tarini Sewing Institute', 
    district: 'Cuttack', 
    trades: ['Tailoring', 'Embroidery'], 
    capacity: 60, 
    enrolled: 45, 
    status: 'Active', 
    inspection_due: true, // Needs inspection
    rating: 4.2 
  },
  { 
    id: 3, 
    name: 'Western Odisha IT Hub', 
    district: 'Sambalpur', 
    trades: ['Data Entry', 'Web Design'], 
    capacity: 200, 
    enrolled: 40, 
    status: 'Under Review', 
    inspection_due: false,
    rating: 3.5 
  },
  { 
    id: 4, 
    name: 'Ganjam Youth Centre', 
    district: 'Ganjam', 
    trades: ['Plumbing', 'Fitter'], 
    capacity: 100, 
    enrolled: 98, 
    status: 'Active', 
    inspection_due: false,
    rating: 4.5 
  },
  { 
    id: 5, 
    name: 'Balasore Tech Park', 
    district: 'Balasore', 
    trades: ['Hardware Networking'], 
    capacity: 50, 
    enrolled: 50, 
    status: 'Inactive', 
    inspection_due: true,
    rating: 2.0 
  },
];

const StateTrainingReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  // Filter Logic
  const filteredCentres = useMemo(() => {
    return CENTRES_DATA.filter(centre => {
      const matchesSearch = centre.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDistrict = selectedDistrict === 'All' || centre.district === selectedDistrict;
      return matchesSearch && matchesDistrict;
    });
  }, [searchTerm, selectedDistrict]);

  return (
    <div className="w-full p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="text-indigo-600" />
              Training Centres Directory
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Monitor capacity, accreditation status, and location of Skill Hubs.
            </p>
          </div>
        </div>

        {/* --- KPI STRIP --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
           <KPISmall label="Total Centres" value="142" icon={<Building2 size={18}/>} color="bg-blue-50 text-blue-600"/>
           <KPISmall label="Total Capacity" value="4,500" icon={<Users size={18}/>} color="bg-indigo-50 text-indigo-600"/>
           <KPISmall label="Inspections Due" value="12" icon={<ClipboardCheck size={18}/>} color="bg-amber-50 text-amber-600"/>
           <KPISmall label="Blacklisted" value="3" icon={<AlertCircle size={18}/>} color="bg-red-50 text-red-600"/>
        </div>

        {/* --- FILTERS & CONTROLS --- */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 text-slate-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Search Centre Name..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* District Filter */}
            <div className="relative w-full md:w-48">
              <MapPin className="absolute left-3 top-2.5 text-slate-400 h-4 w-4" />
              <select 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="All">All Districts</option>
                <option value="Khordha">Khordha</option>
                <option value="Cuttack">Cuttack</option>
                <option value="Sambalpur">Sambalpur</option>
                <option value="Ganjam">Ganjam</option>
                <option value="Balasore">Balasore</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 text-slate-400 h-3 w-3 pointer-events-none" />
            </div>
          </div>

          
        </div>

        {/* --- CONTENT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCentres.map((centre) => (
            <div key={centre.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                <div>
                   <h3 className="font-bold text-slate-800 text-lg leading-tight">{centre.name}</h3>
                   <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                      <MapPin size={12} /> {centre.district} District
                   </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1">
                {/* Status Badges */}
                <div className="flex gap-2 mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    centre.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                    centre.status === 'Inactive' ? 'bg-red-50 text-red-700 border border-red-100' :
                    'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {centre.status}
                  </span>
                  
                  {centre.inspection_due && (
                    <span className="px-2 py-1 rounded text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1">
                      <ClipboardCheck size={12}/> Inspect Now
                    </span>
                  )}
                </div>

                {/* Capacity Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Utilization</span>
                    <span className="font-semibold text-slate-700">{centre.enrolled} / {centre.capacity} Students</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${(centre.enrolled/centre.capacity)*100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Trades Tags */}
                <div className="flex flex-wrap gap-2">
                   {centre.trades.map(trade => (
                     <span key={trade} className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-100">
                       {trade}
                     </span>
                   ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-slate-50 p-3 flex justify-between items-center text-xs font-medium border-t border-slate-100">
                 <span className="text-slate-500">ID: TC-OD-{centre.id}09</span>
                 <button className="text-indigo-600 hover:text-indigo-800">View Details &rarr;</button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCentres.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
            <Building2 className="mx-auto text-slate-300 mb-3" size={48} />
            <p className="text-slate-500 font-medium">No training centres found in {selectedDistrict}</p>
          </div>
        )}

      </div>
    </div>
  );
};

// Helper Component for KPI
const KPISmall = ({ label, value, icon, color }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-500 uppercase font-bold">{label}</p>
      <h4 className="text-xl font-bold text-slate-900">{value}</h4>
    </div>
  </div>
);

export default StateTrainingReports;
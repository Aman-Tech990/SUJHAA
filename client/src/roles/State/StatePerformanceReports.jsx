import React, { useState, useMemo, useEffect } from "react";
import {
  Building2,
  MapPin,
  Users,
  Search,
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  Calendar,
  LineChart as LineChartIcon,
  BarChart3,
  ChevronDown,
  MessageCircle,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { toast } from "sonner";

// --- MOCK DATA: TRAINING CENTRES (PM-AJAY SKILL HUBS) ---
const CENTRES_DATA = [
  {
    id: 1,
    name: "CV Raman Skill Academy",
    district: "Khordha",
    trades: ["Electrician", "Solar Panel Tech"],
    capacity: 120,
    enrolled: 110,
    status: "Active",
    inspection_due: false,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Maa Tarini Sewing Institute",
    district: "Cuttack",
    trades: ["Tailoring", "Embroidery"],
    capacity: 60,
    enrolled: 45,
    status: "Active",
    inspection_due: true, // Needs inspection
    rating: 4.2,
  },
  {
    id: 3,
    name: "Western Odisha IT Hub",
    district: "Sambalpur",
    trades: ["Data Entry", "Web Design"],
    capacity: 200,
    enrolled: 40,
    status: "Under Review",
    inspection_due: false,
    rating: 3.5,
  },
  {
    id: 4,
    name: "Ganjam Youth Centre",
    district: "Ganjam",
    trades: ["Plumbing", "Fitter"],
    capacity: 100,
    enrolled: 98,
    status: "Active",
    inspection_due: false,
    rating: 4.5,
  },
  {
    id: 5,
    name: "Balasore Tech Park",
    district: "Balasore",
    trades: ["Hardware Networking"],
    capacity: 50,
    enrolled: 50,
    status: "Inactive",
    inspection_due: true,
    rating: 2.0,
  },
];

// --- PM-AJAY TRAINING ANALYTICS (FY 2021-22 onwards) ---

// Year-wise summary (state-level) – realistic, slowly improving
const YEARLY_TRAINING = [
  {
    fy: "2021-22",
    enrolled: 1800,
    completed: 1450,
    placed: 1150,
    centresActive: 62,
  },
  {
    fy: "2022-23",
    enrolled: 2500,
    completed: 2100,
    placed: 1680,
    centresActive: 85,
  },
  {
    fy: "2023-24",
    enrolled: 3200,
    completed: 2750,
    placed: 2250,
    centresActive: 112,
  },
  {
    fy: "2024-25",
    enrolled: 4100,
    completed: 3550,
    placed: 2980,
    centresActive: 142,
  },
];

// Month-wise trend for all FYs (April–September demo)
const MONTHLY_TRAINING = {
  "2021-22": [
    { month: "Apr", enrolled: 120, completed: 90, placed: 60 },
    { month: "May", enrolled: 150, completed: 100, placed: 70 },
    { month: "Jun", enrolled: 180, completed: 130, placed: 90 },
    { month: "Jul", enrolled: 200, completed: 160, placed: 120 },
    { month: "Aug", enrolled: 230, completed: 190, placed: 150 },
    { month: "Sep", enrolled: 260, completed: 220, placed: 170 },
  ],

  "2022-23": [
    { month: "Apr", enrolled: 200, completed: 170, placed: 130 },
    { month: "May", enrolled: 230, completed: 180, placed: 150 },
    { month: "Jun", enrolled: 260, completed: 210, placed: 170 },
    { month: "Jul", enrolled: 290, completed: 250, placed: 200 },
    { month: "Aug", enrolled: 320, completed: 270, placed: 220 },
    { month: "Sep", enrolled: 350, completed: 300, placed: 250 },
  ],

  "2023-24": [
    { month: "Apr", enrolled: 240, completed: 210, placed: 180 },
    { month: "May", enrolled: 270, completed: 230, placed: 200 },
    { month: "Jun", enrolled: 300, completed: 260, placed: 220 },
    { month: "Jul", enrolled: 330, completed: 290, placed: 250 },
    { month: "Aug", enrolled: 360, completed: 310, placed: 270 },
    { month: "Sep", enrolled: 390, completed: 340, placed: 300 },
  ],

  "2024-25": [
    { month: "Apr", enrolled: 280, completed: 230, placed: 190 },
    { month: "May", enrolled: 320, completed: 270, placed: 220 },
    { month: "Jun", enrolled: 340, completed: 295, placed: 240 },
    { month: "Jul", enrolled: 360, completed: 310, placed: 255 },
    { month: "Aug", enrolled: 380, completed: 325, placed: 270 },
    { month: "Sep", enrolled: 410, completed: 345, placed: 290 },
  ],
};

const YEAR_OPTIONS = ["2021-22", "2022-23", "2023-24", "2024-25"];
const MONTH_OPTIONS = ["All", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

// ------------------------------------------------------

const StatePerformanceReports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedYear, setSelectedYear] = useState("2024-25");
  const [selectedMonth, setSelectedMonth] = useState("All");

  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // message state for training centres
  const [activeCentreId, setActiveCentreId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // ---------- FILTER: TRAINING CENTRE DIRECTORY ----------
  const filteredCentres = useMemo(() => {
    return CENTRES_DATA.filter((centre) => {
      const matchesSearch = centre.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDistrict =
        selectedDistrict === "All" || centre.district === selectedDistrict;
      return matchesSearch && matchesDistrict;
    });
  }, [searchTerm, selectedDistrict]);

  // ---------- ANALYTICS: YEAR + MONTH FILTERED DATA ----------

  const yearlyChartData = YEARLY_TRAINING; // multi-year line

  const monthlyBase = MONTHLY_TRAINING[selectedYear] || [];
  const monthlyChartData =
    selectedMonth === "All"
      ? monthlyBase
      : monthlyBase.filter((m) => m.month === selectedMonth);

  const currentYearStats =
    YEARLY_TRAINING.find((y) => y.fy === selectedYear) || YEARLY_TRAINING[0];

  const placementRate = currentYearStats.enrolled
    ? Math.round((currentYearStats.placed / currentYearStats.enrolled) * 100)
    : 0;

  const completionRate = currentYearStats.enrolled
    ? Math.round((currentYearStats.completed / currentYearStats.enrolled) * 100)
    : 0;

  // Simulate backend sync when year/month changes
  useEffect(() => {
    setAnalyticsLoading(true);
    const timer = setTimeout(() => {
      setAnalyticsLoading(false);
    }, 700); // small delay to look "live"
    return () => clearTimeout(timer);
  }, [selectedYear, selectedMonth]);

  // Dynamic insight based on placement rate
  let insightText = "";
  if (placementRate >= 75) {
    insightText = `Strong placement conversion in FY ${selectedYear}. PM-AJAY training is effectively translating to jobs for SC youth.`;
  } else if (placementRate >= 55) {
    insightText = `Moderate placement rate in FY ${selectedYear}. Need closer coordination with industry partners for better job linkages.`;
  } else {
    insightText = `Low placement conversion in FY ${selectedYear}. Flag districts with weak employer tie-ups for review.`;
  }

  // ---------- MESSAGE HANDLERS ----------

  const openMessageBox = (centreId) => {
    setActiveCentreId(centreId);
    setMessageText("");
  };

  const handleSendMessage = (centre) => {
    if (!messageText.trim()) {
      toast.error("Please write a short message before sending.");
      return;
    }
    setSendingMessage(true);

    // simulate API call to PM-AJAY training module
    setTimeout(() => {
      setSendingMessage(false);
      setActiveCentreId(null);
      toast.success(
        `Successfully sent message to ${centre.name} Nodal Officer via PM-AJAY portal`
      );
    }, 900);
  };

  return (
    <div className="w-full p-6 font-sans text-slate-800 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="text-indigo-600" />
              PM-AJAY Training & Skill Hubs
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Monitor training centres, SC trainee enrolments, completions and
              placements under the GIA Skill Development component.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100">
            <Calendar size={14} />
            Live view for State – PM-AJAY (GIA)
          </div>
        </div>

        {/* --- KPI STRIP (STATE-LEVEL) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <KPISmall
            label="Total Centres (Active FY)"
            value={currentYearStats.centresActive}
            icon={<Building2 size={18} />}
            color="bg-blue-50 text-blue-600"
          />
          <KPISmall
            label="SC Trainees Enrolled"
            value={currentYearStats.enrolled.toLocaleString()}
            icon={<Users size={18} />}
            color="bg-indigo-50 text-indigo-600"
          />
          <KPISmall
            label="Completion Rate"
            value={`${completionRate}%`}
            icon={<ClipboardCheck size={18} />}
            color="bg-emerald-50 text-emerald-600"
          />
          <KPISmall
            label="Placement Rate"
            value={`${placementRate}%`}
            icon={<BarChart3 size={18} />}
            color="bg-amber-50 text-amber-600"
          />
        </div>

        {/* --- ANALYTICS PANEL: YEAR & MONTH FILTERS + CHARTS --- */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm mb-8 p-5 relative overflow-hidden">
          {/* Loading overlay for analytics */}
          {analyticsLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 text-sm text-slate-600">
              <Loader2 className="animate-spin mb-2" />
              Syncing with PM-AJAY MIS…
            </div>
          )}

          {/* Filters row */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <LineChartIcon className="text-indigo-600" size={18} />
              <h2 className="text-lg font-semibold text-slate-900">
                State Training Performance Analytics
              </h2>
              <span className="text-[10px] uppercase tracking-wide bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                FY 2021-22 onwards
              </span>
            </div>

            <div className="flex gap-3">
              {/* Year Filter */}
              <div className="relative">
                <select
                  className="pl-3 pr-8 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y}>
                      FY {y}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 text-slate-400 h-3 w-3 pointer-events-none" />
              </div>

              {/* Month Filter */}
              <div className="relative">
                <select
                  className="pl-3 pr-8 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {MONTH_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m === "All" ? "All Months" : m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 text-slate-400 h-3 w-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Charts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Multi-year trend chart */}
            <div className="h-72 bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                <LineChartIcon size={14} className="text-indigo-500" />
                Enrolment vs Completion vs Placement (All Years)
              </p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={yearlyChartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="fy" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="enrolled"
                    stroke="#4f46e5"
                    name="Enrolled"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#10b981"
                    name="Completed"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="placed"
                    stroke="#f59e0b"
                    name="Placed"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly breakdown for selected year */}
            <div className="h-72 bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                <BarChart3 size={14} className="text-emerald-500" />
                Month-wise Progress – FY {selectedYear}{" "}
                {selectedMonth !== "All" && `(${selectedMonth})`}
              </p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyChartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="enrolled"
                    name="Enrolled"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="completed"
                    name="Completed"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="placed"
                    name="Placed"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dynamic Insight Bar */}
          <div className="mt-4 bg-slate-100 rounded-lg px-4 py-3 flex items-start gap-2 text-sm">
            {placementRate >= 75 ? (
              <CheckCircle2 className="text-emerald-600 mt-0.5" size={16} />
            ) : placementRate >= 55 ? (
              <AlertCircle className="text-amber-500 mt-0.5" size={16} />
            ) : (
              <AlertCircle className="text-red-500 mt-0.5" size={16} />
            )}
            <p className="text-slate-700">{insightText}</p>
          </div>
        </section>

        {/* --- PM-AJAY STYLE SEPARATOR --- */}
        <div className="flex items-center gap-3 my-8">
          <div className="h-px flex-1 bg-gradient-to-r from-indigo-200 to-transparent" />
          <span className="text-[11px] tracking-[0.25em] uppercase text-slate-500">
            PM-AJAY TRAINING CENTRE DIRECTORY
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-indigo-200 to-transparent" />
        </div>

        {/* --- FILTERS & CONTROLS FOR CENTRE DIRECTORY --- */}
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

        {/* --- TRAINING CENTRE CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCentres.map((centre) => {
            const isActiveMsg = activeCentreId === centre.id;

            return (
              <div
                key={centre.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">
                      {centre.name}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                      <MapPin size={12} /> {centre.district} District
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1">
                  {/* Status Badges */}
                  <div className="flex gap-2 mb-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${centre.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : centre.status === "Inactive"
                          ? "bg-red-50 text-red-700 border border-red-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                    >
                      {centre.status}
                    </span>

                    {centre.inspection_due && (
                      <span className="px-2 py-1 rounded text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1">
                        <ClipboardCheck size={12} /> Inspection Due
                      </span>
                    )}
                  </div>

                  {/* Capacity Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Utilization</span>
                      <span className="font-semibold text-slate-700">
                        {centre.enrolled} / {centre.capacity} Students
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{
                          width: `${(centre.enrolled / centre.capacity) * 100
                            }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Trades Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {centre.trades.map((trade) => (
                      <span
                        key={trade}
                        className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-100"
                      >
                        {trade}
                      </span>
                    ))}
                  </div>

                  {/* Message Box Toggle */}
                  <button
                    onClick={() =>
                      isActiveMsg
                        ? setActiveCentreId(null)
                        : openMessageBox(centre.id)
                    }
                    className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full"
                  >
                    <MessageCircle size={14} />
                    {isActiveMsg
                      ? "Close Message Box"
                      : "Message Centre Nodal Officer"}
                  </button>

                  {/* Message Box */}
                  {isActiveMsg && (
                    <div className="mt-3 border border-indigo-100 rounded-lg bg-indigo-50/40 p-3">
                      <p className="text-[11px] text-slate-600 mb-1">
                        This message will go as a note to the{" "}
                        <span className="font-semibold">
                          PM-AJAY Training Module
                        </span>{" "}
                        for this centre.
                      </p>
                      <textarea
                        rows={3}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        placeholder="e.g. Please schedule a surprise inspection next week focusing on attendance & trainer quality."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          className="text-xs px-3 py-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-100"
                          onClick={() => {
                            setActiveCentreId(null);
                            setMessageText("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={sendingMessage}
                          className="text-xs px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 inline-flex items-center gap-1"
                          onClick={() => handleSendMessage(centre)}
                        >
                          {sendingMessage ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Sending…
                            </>
                          ) : (
                            <>
                              <MessageCircle className="h-3 w-3" />
                              Send Message
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="bg-slate-50 p-3 flex justify-between items-center text-xs font-medium border-t border-slate-100">
                  <span className="text-slate-500">
                    ID: TC-OD-{centre.id}09 • Rating: ⭐ {centre.rating}
                  </span>
                  <button className="text-indigo-600 hover:text-indigo-800">
                    View Details &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCentres.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed mt-6">
            <Building2 className="mx-auto text-slate-300 mb-3" size={48} />
            <p className="text-slate-500 font-medium">
              No training centres found in {selectedDistrict}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Component for KPI
const KPISmall = ({ label, value, icon, color }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    <div>
      <p className="text-xs text-slate-500 uppercase font-bold">{label}</p>
      <h4 className="text-xl font-bold text-slate-900">{value}</h4>
    </div>
  </div>
);

export default StatePerformanceReports;

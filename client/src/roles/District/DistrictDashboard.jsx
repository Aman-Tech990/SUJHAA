import React, { useEffect, useState } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  IndianRupee,
  Activity,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

const DistrictDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState("Khordha");
  const [year, setYear] = useState("2024-25");

  const [data, setData] = useState({});
  const [lastUpdated, setLastUpdated] = useState(0);

  // -------------------------
  // 🌐 AUTO-REFRESH (Every 8 seconds)
  // -------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated((prev) => prev + 8);
      setData((prev) => generateLiveUpdates(prev)); // dynamic update
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  // ---------------------------
  // 📡 INITIAL FETCH (Smooth Fade Loading)
  // ---------------------------
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mock = generateMockData(district, year);
      setData(mock);
      setLastUpdated(0);
      setLoading(false);
    }, 1200);
  }, [district, year]);

  return (
    <div className="p-5 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A7431]">
            SUJHAA — District Dashboard
          </h1>
          <p className="text-xs text-gray-600">
            Real-Time PM–AJAY GIA Monitoring • {district}
          </p>

          {!loading && (
            <p className="text-[11px] text-green-600 flex items-center gap-1 mt-1">
              <span className="animate-pulse">●</span> Updated {lastUpdated}s ago
            </p>
          )}
        </div>

        {/* FILTERS */}
        <div className="flex gap-4 mt-4">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="border px-3 py-1.5 rounded-lg text-sm font-semibold"
          >
            <option>Khordha</option>
            <option>Cuttack</option>
            <option>Puri</option>
            <option>Ganjam</option>
            <option>Balasore</option>
            <option>Mayurbhanj</option>
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border px-3 py-1.5 rounded-lg text-sm font-semibold"
          >
            <option>2024-25</option>
            <option>2023-24</option>
            <option>2022-23</option>
            <option>2021-22</option>
          </select>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <FadeLoader />
      ) : (
        <>
          {/* LIVE INSIGHTS */}
          <LiveInsightsPanel insights={data.liveInsights} />

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {renderKPIs(data)}
          </div>

          {/* MAIN SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Beneficiary Table */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow border overflow-hidden">
              <BeneficiaryTable
                applications={data.applications}
                district={district}
              />
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-xl shadow border p-5">
              <h3 className="font-bold text-gray-800 text-sm mb-2">
                Scheme Category Split
              </h3>
              <div className="h-60">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data.schemes}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label
                    >
                      {data.schemes.map((e, i) => (
                        <Cell
                          key={i}
                          fill={SCHEME_COLORS[i % SCHEME_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* LOWER SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <div className="bg-white rounded-xl shadow border p-5">
              <h3 className="font-bold text-sm mb-3">
                Monthly Verification Trend
              </h3>
              <div className="h-64">
                <ResponsiveContainer>
                  <LineChart data={data.yearlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="verified"
                      stroke="#1A7431"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <FOLeaderboard data={data.foPerformance} />
          </div>

          {/* FUNDS BAR CHART */}
          <div className="bg-white rounded-xl shadow border p-5">
            <h3 className="font-bold text-sm mb-3">
              Fund Allocation vs Utilization
            </h3>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={data.funds}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="allocated" fill="#FF7A00" />
                  <Bar dataKey="utilized" fill="#1A7431" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DistrictDashboard;

/* -------------------------------------
      ✨ LIVE INSIGHTS COMPONENT
------------------------------------- */

const LiveInsightsPanel = ({ insights }) => (
  <div className="bg-white p-4 rounded-xl shadow border">
    <h3 className="font-bold text-sm flex items-center gap-2 text-[#1A7431]">
      <Activity size={16} /> Live Insights
    </h3>

    <ul className="text-[13px] mt-2 space-y-1">
      <li>
        📈 Beneficiary verifications increased by{" "}
        <b>+{insights.verificationGrowth}</b>
      </li>
      <li>
        📊 Trending scheme this cycle: <b>{insights.topScheme}</b>
      </li>
      <li>
        🧾 FO improvement: <b>{insights.foStar}</b> leads with{" "}
        {insights.foStarCount} verifications
      </li>
      <li>
        💰 Utilization improved by <b>{insights.fundRise}%</b> this week
      </li>
      <li>
        👥 Total active beneficiaries updated by{" "}
        <b>+{insights.newBeneficiaries}</b>
      </li>
    </ul>

    <p className="text-xs text-gray-400 mt-2">
      Auto-updating every 8 seconds…
    </p>
  </div>
);

/* -------------------------------------
      ✨ FADE LOADER (SOFT + ELEGANT)
------------------------------------- */

const FadeLoader = () => (
  <div className="space-y-5 animate-pulse">
    <div className="h-6 bg-gray-200/70 rounded-lg"></div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-20 bg-gray-200/70 rounded-xl"></div>
      ))}
    </div>

    <div className="h-72 bg-gray-200/70 rounded-xl"></div>
  </div>
);

/* -------------------------------------
      ✨ KPI CARDS
------------------------------------- */

const renderKPIs = (data) => {
  const total = data.applications.length;
  const verified = data.applications.filter(
    (a) => a.status === "Verified"
  ).length;
  const pending = data.applications.filter(
    (a) => a.status === "Pending"
  ).length;
  const rejected = data.applications.filter(
    (a) => a.status === "Rejected"
  ).length;

  const stats = [
    {
      label: "Total Applications",
      value: total,
      icon: Users,
      color: "bg-[#1A7431]",
    },
    {
      label: "Verified",
      value: verified,
      icon: CheckCircle,
      color: "bg-green-600",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: IndianRupee,
      color: "bg-red-500",
    },
  ];

  return stats.map((stat, i) => (
    <div
      key={i}
      className="bg-white rounded-xl shadow border p-5 flex items-center justify-between"
    >
      <div>
        <p className="text-xs text-gray-500">{stat.label}</p>
        <h3 className="text-xl font-bold">{stat.value}</h3>
      </div>
      <div className={`${stat.color} text-white p-3 rounded-lg`}>
        <stat.icon size={22} />
      </div>
    </div>
  ));
};

/* -------------------------------------
      ✨ BENEFICIARY TABLE
------------------------------------- */

const BeneficiaryTable = ({ applications, district }) => {
  const statusClasses = {
    Verified: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <>
      <div className="p-5 border-b bg-gray-50">
        <h3 className="font-bold text-sm">Beneficiaries — {district}</h3>
        <p className="text-[11px] text-gray-500">
          Field-verified beneficiary list
        </p>
      </div>

      <div className="max-h-[380px] overflow-y-auto">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            {applications.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-3 text-[#1A7431] font-medium">
                  {item.name}
                </td>
                <td className="px-5 py-3 text-gray-600">{item.scheme}</td>
                <td className="px-5 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${statusClasses[item.status]
                      }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

/* -------------------------------------
      ✨ FIELD OFFICER LEADERBOARD
------------------------------------- */

const FOLeaderboard = ({ data }) => (
  <div className="bg-white rounded-xl shadow border p-5">
    <h3 className="font-bold text-sm mb-3">Field Officer Performance</h3>

    <div className="space-y-2">
      {data.map((fo, i) => (
        <div
          key={i}
          className="flex justify-between bg-gray-50 p-3 rounded-lg border"
        >
          <p className="font-medium text-sm">{fo.name}</p>
          <p className="text-xs">
            {fo.count} verifications •
            <span className="font-semibold text-[#1A7431]">
              {" "}
              {fo.schemeFocus}
            </span>
          </p>
        </div>
      ))}
    </div>
  </div>
);

/* -------------------------------------
      🎯 COLORS
------------------------------------- */

const SCHEME_COLORS = ["#1A7431", "#FF7A00", "#3B82F6"];

/* -------------------------------------
      🎯 LIVE UPDATE ENGINE
------------------------------------- */

function generateLiveUpdates(prev) {
  if (!prev || !prev.applications) return prev;

  const updated = { ...prev };

  // Slightly increase verifications
  updated.yearlyStats = prev.yearlyStats.map((m) => ({
    ...m,
    verified: m.verified + Math.floor(Math.random() * 4),
  }));

  // FO performance shifts
  updated.foPerformance = prev.foPerformance.map((fo) => ({
    ...fo,
    count: fo.count + Math.floor(Math.random() * 3),
  }));

  // Fund utilization increases realistically
  updated.funds = prev.funds.map((f) => ({
    ...f,
    utilized: f.utilized + Math.floor(Math.random() * 3),
  }));

  // Live insights regenerate using UPDATED data
  updated.liveInsights = createLiveInsights(updated);

  return updated;
}

/* -------------------------------------
      🎯 LIVE INSIGHTS GENERATOR
------------------------------------- */

function createLiveInsights(prev) {
  const foTop = [...prev.foPerformance].sort((a, b) => b.count - a.count)[0];
  const topScheme = [...prev.schemes].sort((a, b) => b.value - a.value)[0];

  return {
    verificationGrowth: Math.floor(Math.random() * 20 + 5),
    topScheme: topScheme?.name || "Income Generation",
    foStar: foTop?.name || "N/A",
    foStarCount: foTop?.count || 0,
    fundRise: Math.floor(Math.random() * 5 + 2),
    newBeneficiaries: Math.floor(Math.random() * 15 + 5),
  };
}

/* -------------------------------------
      🎯 MOCK DATA GENERATOR
------------------------------------- */

// Random name pool (extra variety)
const RANDOM_NAMES = [
  "Madhusmita Das",
  "Rakesh Kumar",
  "Sushree Nayak",
  "Raj Kishore Sahu",
  "Deepika Panda",
  "Bijay Pradhan",
  "Sanjana Mishra",
  "Sourav Swain",
  "Lipika Parida",
  "Tusar Ranjan",
  "Kalyani Rout",
  "Ashutosh Mohanty",
  "Pranati Sahoo",
  "Rupali Behera",
  "Sanjay Kumar",
  "Arpita Patnaik",
  "Manoj Pradhan",
  "Sasmita Swain",
  "Pabitra Nayak",
  "Chinmoy Das",
];

function generateMockData(district, year) {
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const baseYearFactor = {
    "2024-25": 1.0,
    "2023-24": 0.85,
    "2022-23": 0.7,
    "2021-22": 0.55,
  }[year];

  const districtFactor = {
    Khordha: 1.0,
    Cuttack: 0.95,
    Puri: 0.85,
    Ganjam: 0.9,
    Balasore: 0.8,
    Mayurbhanj: 0.75,
  }[district];

  const schemes = ["Income Generation", "Skill Development", "Infrastructure Support"];

  const statusOptions = ["Verified", "Pending", "Rejected"];

  // Fixed top names per district (Aman ONLY in Khordha)
  const baseNamesByDistrict = {
    Khordha: [
      "Aman Parida",
      "Rashmi Sahoo",
      "Sasmita Nayak",
      "Debasmita Sahu",
      "Lingaraj Pradhan",
      "Bikash Behera",
      "Chinmayee Pradhan",
      "Subrat Das",
      "Puja Mohanty",
      "Rajesh Swain",
    ],
    Cuttack: [
      "Swagatika Barik",
      "Biswa Ranjan Nayak",
      "Pratap Sahoo",
      "Lipika Das",
      "Manaswini Mishra",
      "Abhijit Panda",
      "Jyoti Ranjan Mohanty",
      "Priya Sahoo",
      "Rakesh Behera",
      "Supriya Rout",
    ],
    Puri: [
      "Chittaranjan Behera",
      "Mira Mohanty",
      "Kunal Swain",
      "Tanmayee Dash",
      "Bijay Kishore",
      "Arpita Panda",
      "Sanjay Maharana",
      "Kalyani Sahu",
      "Dilip Rath",
      "Sneha Pradhan",
    ],
    Ganjam: [
      "Deepak Patro",
      "Ranjan Pradhan",
      "Lalita Sahu",
      "Uma Pradhan",
      "Suresh Behera",
      "Rituparna Dash",
      "Sanjiv Kumar",
      "Bhanumati Naik",
      "Pintu Swain",
      "Arati Patro",
    ],
    Balasore: [
      "Rituparna Panda",
      "Dipti Rani Das",
      "Ajit Behera",
      "Nandini Parida",
      "Saroj Raj",
      "Mamata Mishra",
      "Tapan Sahu",
      "Smruti Ranjan",
      "Lopamudra Rout",
      "Ashish Behera",
    ],
    Mayurbhanj: [
      "Madan Hansda",
      "Rajesh Hembram",
      "Sulochana Murmu",
      "Babli Tudu",
      "Kailash Soren",
      "Karuna Mardi",
      "Sandhya Hembram",
      "Bikas Tudu",
      "Ranjita Soren",
      "Chandan Murmu",
    ],
  };

  const baseNames = baseNamesByDistrict[district] || baseNamesByDistrict["Khordha"];

  const applications = [];
  const totalApps = 100;

  // Ensure "Aman Parida" at top only for Khordha
  if (district === "Khordha") {
    applications.push({
      id: "APP-KHR-2024-0001",
      name: "Aman Parida",
      scheme: "Income Generation",
      status: "Verified",
    });
  }

  // Generate remaining applications
  for (let i = applications.length; i < totalApps; i++) {
    // Pick name either from base list or random pool
    let name;
    if (i < baseNames.length) {
      name = baseNames[i];
    } else {
      name = RANDOM_NAMES[i % RANDOM_NAMES.length];
    }

    // Extra safety to NEVER put Aman in non-Khordha
    if (district !== "Khordha" && name === "Aman Parida") {
      name = RANDOM_NAMES[(i + 3) % RANDOM_NAMES.length];
    }

    const scheme = schemes[(i + name.length) % schemes.length];

    // Status distribution (more verified in newer year)
    const r = Math.random();
    let status = "Pending";
    if (r < 0.6 * baseYearFactor) status = "Verified";
    else if (r < 0.85 * baseYearFactor) status = "Pending";
    else status = "Rejected";

    applications.push({
      id: `APP-${district.substring(0, 3).toUpperCase()}-${year.replace(
        "-",
        ""
      )}-${String(i + 1).padStart(4, "0")}`,
      name,
      scheme,
      status,
    });
  }

  // Scheme distribution
  const incomeCount = applications.filter(
    (a) => a.scheme === "Income Generation"
  ).length;
  const skillCount = applications.filter(
    (a) => a.scheme === "Skill Development"
  ).length;
  const infraCount = applications.filter(
    (a) => a.scheme === "Infrastructure Support"
  ).length;

  const schemeData = [
    { name: "Income Generation", value: incomeCount },
    { name: "Skill Development", value: skillCount },
    { name: "Infrastructure Support", value: infraCount },
  ];

  // Monthly stats
  const yearlyStats = months.map((m, idx) => {
    const base = 25 + idx * 4;
    const value = Math.round(
      base * baseYearFactor * districtFactor + Math.random() * 10
    );
    return { month: m, verified: value };
  });

  // Field Officer performance
  const foNamesByDistrict = {
    Khordha: [
      "FO Khordha – Aman Kumar",
      "FO Khordha – Rituparna",
      "FO Khordha – Debasis",
      "FO Khordha – Sanjana",
      "FO Khordha – Laxmi",
    ],
    Cuttack: [
      "FO Cuttack – Satyabrata",
      "FO Cuttack – Meera",
      "FO Cuttack – Niranjan",
      "FO Cuttack – Soumya",
    ],
    Puri: ["FO Puri – Ranjan", "FO Puri – Lopa", "FO Puri – Suresh"],
    Ganjam: [
      "FO Ganjam – Ajay",
      "FO Ganjam – Pratiksha",
      "FO Ganjam – Bikram",
      "FO Ganjam – Rina",
    ],
    Balasore: ["FO Balasore – Anup", "FO Balasore – Sweta", "FO Balasore – Prem"],
    Mayurbhanj: [
      "FO Mayurbhanj – Sona",
      "FO Mayurbhanj – Dilip",
      "FO Mayurbhanj – Laxmi",
      "FO Mayurbhanj – Pintu",
    ],
  };

  const foNames = foNamesByDistrict[district] || foNamesByDistrict["Khordha"];

  const foPerformance = foNames.map((name, i) => {
    const base = 30 + i * 7;
    return {
      name,
      count: Math.round(base * baseYearFactor * districtFactor),
      schemeFocus: schemes[i % schemes.length],
    };
  });

  // Funds
  const baseFund = 40 * districtFactor;
  const funds = [
    {
      year: "2021-22",
      allocated: Math.round(baseFund * 0.7),
      utilized: Math.round(baseFund * 0.5),
    },
    {
      year: "2022-23",
      allocated: Math.round(baseFund * 0.85),
      utilized: Math.round(baseFund * 0.7),
    },
    {
      year: "2023-24",
      allocated: Math.round(baseFund * 1.0),
      utilized: Math.round(baseFund * 0.82),
    },
    {
      year: "2024-25",
      allocated: Math.round(baseFund * 1.1),
      utilized: Math.round(baseFund * 0.9 * baseYearFactor),
    },
  ];

  const baseObject = {
    applications,
    schemes: schemeData,
    yearlyStats,
    foPerformance,
    funds,
  };

  const liveInsights = createLiveInsights(baseObject);

  return {
    ...baseObject,
    liveInsights,
  };
}

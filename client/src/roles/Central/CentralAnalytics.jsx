import React from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const CentralBeneficiaryAnalytics = () => {

  // 1️⃣ Gender Distribution
  const genderData = [
    { name: "Male", value: 420000 },
    { name: "Female", value: 510000 },
    { name: "Transgender", value: 12000 },
  ];
  const genderColors = ["#3b82f6", "#ec4899", "#a855f7"];

  // 2️⃣ Age Group Distribution
  const ageGroups = [
    { group: "18-25", age: 18 },
    { group: "25-40", age: 25 },
    { group: "40-60", age: 40 },
    { group: "60+", age: 60 },
  ];

  // 3️⃣ Top States Beneficiaries
  const stateData = [
    { state: "Odisha", beneficiaries: 340000 },
    { state: "Karnataka", beneficiaries: 280000 },
    { state: "Maharashtra", beneficiaries: 410000 },
    { state: "Bihar", beneficiaries: 220000 },
    { state: "Uttar Pradesh", beneficiaries: 390000 },
  ];

  // 4️⃣ Scheme Usage Analytics
  const schemeUsage = [
    { scheme: "Skill Training", beneficiary: 420000 },
    { scheme: "Livelihood", beneficiary: 240000 },
    { scheme: "Entrepreneurship", beneficiary: 95000 },
  ];

  return (
    <div className="p-10 space-y-14">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Beneficiary Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Key insights into demographics, district performance, and scheme engagement.
        </p>
      </div>

      {/* ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* GENDER DISTRIBUTION */}
        <div className="bg-white p-10 rounded-xl shadow border">
          <h3 className="text-2xl font-bold mb-6">Gender Distribution</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  innerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(1)}%)`
                  }
                >
                  {genderData.map((entry, index) => (
                    <Cell key={index} fill={genderColors[index]} />
                  ))}
                </Pie>

                <Tooltip contentStyle={{ fontSize: 18 }} />
                <Legend wrapperStyle={{ fontSize: 18 }} iconSize={22} />

              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AGE GROUP */}
        <div className="bg-white p-10 rounded-xl shadow border">
          <h3 className="text-2xl font-bold mb-6">Age Group Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGroups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="group" tick={{ fontSize: 18 }} />
                <YAxis tick={{ fontSize: 18 }} />
                <Tooltip contentStyle={{ fontSize: 18 }} />
                <Legend wrapperStyle={{ fontSize: 18 }} />
                <Bar dataKey="age" fill="#10b981" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* STATES BENEFICIARIES */}
        <div className="bg-white p-10 rounded-xl shadow border">
          <h3 className="text-2xl font-bold mb-6">Top States by Beneficiaries</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" tick={{ fontSize: 18 }} />
                <YAxis tick={{ fontSize: 18 }} />
                <Tooltip contentStyle={{ fontSize: 18 }} />
                <Legend wrapperStyle={{ fontSize: 18 }} />
                <Bar dataKey="beneficiaries" fill="#3b82f6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MOST APPLIED SCHEMES */}
        <div className="bg-white p-10 rounded-xl shadow border">
          <h3 className="text-2xl font-bold mb-6">Most Applied Schemes</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={schemeUsage}
                layout="vertical"
                barCategoryGap="20%"
                margin={{ left: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 18 }} />
                <YAxis type="category" dataKey="scheme" tick={{ fontSize: 20 }} width={150} />

                <Tooltip contentStyle={{ fontSize: 18 }} />
                <Legend wrapperStyle={{ fontSize: 18 }} />

                <Bar dataKey="beneficiary" fill="#f97316" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* STATE IMPACT HIGHLIGHTS */}
          <div className="lg:col-span-2 w-full bg-white p-12 rounded-xl shadow border mt-10 space-y-10">


          <h3 className="text-2xl font-bold text-gray-900">
            State Impact Highlights
          </h3>

          <p className="text-lg text-gray-600">
            State-wise progress achieved under PM-AJAY showcasing improved livelihoods and economic upliftment.
          </p>

          <ul className="space-y-6 mt-6">

            <li className="relative p-6 pl-16 rounded-xl border-l-8 border-orange-500 bg-orange-50 hover:bg-orange-100 shadow-sm">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-orange-500 animate-pulse"></span>
              <b className="text-xl text-gray-900 block">Odisha</b>
              <p className="text-lg text-gray-700 mt-2">Over 3.4 lakh individuals benefitted through skill programs.</p>
            </li>

            <li className="relative p-6 pl-16 rounded-xl border-l-8 border-orange-500 bg-orange-50 hover:bg-orange-100 shadow-sm">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-orange-500 animate-pulse"></span>
              <b className="text-xl text-gray-900 block">Maharashtra</b>
              <p className="text-lg text-gray-700 mt-2">Entrepreneurship support uplifted over 4 lakh beneficiaries.</p>
            </li>

            <li className="relative p-6 pl-16 rounded-xl border-l-8 border-orange-500 bg-orange-50 hover:bg-orange-100 shadow-sm">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-orange-500 animate-pulse"></span>
              <b className="text-xl text-gray-900 block">Uttar Pradesh</b>
              <p className="text-lg text-gray-700 mt-2">3.9 lakh individuals gained vocational skills.</p>
            </li>

            <li className="relative p-6 pl-16 rounded-xl border-l-8 border-orange-500 bg-orange-50 hover:bg-orange-100 shadow-sm">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-orange-500 animate-pulse"></span>
              <b className="text-xl text-gray-900 block">Karnataka</b>
              <p className="text-lg text-gray-700 mt-2">Thousands upgraded skills through modern training.</p>
            </li>

            <li className="relative p-6 pl-16 rounded-xl border-l-8 border-orange-500 bg-orange-50 hover:bg-orange-100 shadow-sm">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-orange-500 animate-pulse"></span>
              <b className="text-xl text-gray-900 block">Bihar</b>
              <p className="text-lg text-gray-700 mt-2">2.2 lakh+ families benefitted through micro-enterprises.</p>
            </li>

          </ul>

        </div>

      </div>
    </div>
  );
};

export default CentralBeneficiaryAnalytics;

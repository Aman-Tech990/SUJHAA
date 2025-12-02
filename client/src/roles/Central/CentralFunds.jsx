import React from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from "recharts";
import { Landmark, IndianRupee, Wallet2, Globe } from "lucide-react";

const CentralFundsDisbursement = () => {

const kpi = [
  { label: "Total Funds Sanctioned", value: "₹1,200 Cr", color: "bg-blue-600", icon: Landmark },
  { label: "Total Funds Disbursed", value: "₹842 Cr", color: "bg-green-600", icon: IndianRupee },
  { label: "Remaining Balance", value: "₹358 Cr", color: "bg-amber-600", icon: Wallet2 }
];

const stateFunds = [
  { state: "Odisha", sanctioned: 120, disbursed: 98 },
  { state: "Karnataka", sanctioned: 135, disbursed: 110 },
  { state: "Maharashtra", sanctioned: 160, disbursed: 130 },
  { state: "Rajasthan", sanctioned: 115, disbursed: 92 },
  { state: "Gujarat", sanctioned: 140, disbursed: 120 },
];

const sectors = [
  { name: "Skill Development", value: 350 },
  { name: "Livelihood", value: 200 },
  { name: "Infrastructure", value: 150 },
];


const sectorColors = ["#2563eb", "#16a34a", "#f97316", "#9333ea"];

const yearlyFlow = [
  { year: "2019", funds: 150 },
  { year: "2020", funds: 220 },
  { year: "2021", funds: 280 },
  { year: "2022", funds: 310 },
  { year: "2023", funds: 340 },
  { year: "2024", funds: 420 },
];

return (
  <div className="p-10 space-y-14">

    {/* HEADER */}
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900">
        Central Funds Disbursement
      </h1>
    </div>

    {/* KPI CARDS */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-x-24 gap-y-14 w-full">
  {kpi.map((item, index) => (
    <div 
      key={index} 
      className="bg-white shadow rounded-xl p-8 border flex items-center justify-between"
    >
      <div>
        <p className="text-lg text-gray-500">{item.label}</p>
        <h3 className="text-3xl font-extrabold mt-2">{item.value}</h3>
      </div>

      <div 
        className={`h-16 w-16 rounded-xl flex items-center justify-center ${item.color}`}
      >
        <item.icon size={40} className="text-white" />
      </div>
    </div>
  ))}
</div>



    {/* STATE-WISE BAR CHART */}
    <div className="bg-white rounded-xl shadow p-10 border">
      <h3 className="text-2xl font-bold mb-4">State-wise Fund Disbursement</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stateFunds} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="state" tick={{ fontSize: 16 }} />
            <YAxis tick={{ fontSize: 16 }} />
            <Tooltip contentStyle={{ fontSize: 16 }} />
            <Legend wrapperStyle={{ fontSize: 16 }} />
            <Bar dataKey="sanctioned" fill="#2563eb" radius={[10,10,0,0]} />
            <Bar dataKey="disbursed" fill="#16a34a" radius={[10,10,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* SECTOR PIE CHART */}
    <div className="bg-white rounded-xl shadow p-10 border">
      <h3 className="text-2xl font-bold mb-6">Sector-wise Allocation</h3>
      <div className="h-80 flex justify-center">
        <ResponsiveContainer width="60%" height="100%">
          <PieChart>
            <Pie
              data={sectors}
              cx="50%"
              cy="50%"
              outerRadius={130}
              innerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {sectors.map((_, i) => (
                <Cell key={i} fill={sectorColors[i]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 16 }} />
            <Legend wrapperStyle={{ fontSize: 16 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* YEARLY FLOW GRAPH */}
    <div className="bg-white rounded-xl shadow p-10 border">
      <h3 className="text-2xl font-bold mb-6">Year-wise Fund Growth Trend</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={yearlyFlow}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 16 }} />
            <YAxis tick={{ fontSize: 16 }} />
            <Tooltip contentStyle={{ fontSize: 16 }} />
            <Legend wrapperStyle={{ fontSize: 16 }} />
            <Line type="monotone" dataKey="funds" stroke="#9333ea" strokeWidth={5} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* FUND INSIGHTS */}
    <div className="bg-gray-50 p-10 rounded-xl border shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Fund Distribution Insights</h2>

      <div className="space-y-5 text-lg leading-relaxed">

        <div className="border-l-8 border-green-500 bg-green-50 p-4 rounded-lg">
          • <b>Skill Development</b> received the highest allocation of <b>₹350 Cr</b>.
        </div>

        <div className="border-l-8 border-blue-500 bg-blue-50 p-4 rounded-lg">
          • <b>Education</b> sector holds the second-highest share with <b>₹280 Cr</b>.
        </div>

        <div className="border-l-8 border-amber-500 bg-amber-50 p-4 rounded-lg">
          • <b>Livelihood</b> and <b>Infrastructure</b> sectors combined received <b>₹350 Cr</b>.
        </div>

        <div className="border-l-8 border-purple-500 bg-purple-50 p-4 rounded-lg">
          • Year-over-year allocation trends show a <b>steady increase</b> in budget.
        </div>

        <div className="border-l-8 border-green-600 bg-green-100 p-4 rounded-lg">
          • 12 states have utilized <b>over 75%</b> of their allocated funds.
        </div>

        <div className="border-l-8 border-red-500 bg-red-50 p-4 rounded-lg">
          • 4 states require monitoring due to <b>low utilization rates</b>.
        </div>

        <div className="border-l-8 border-indigo-500 bg-indigo-50 p-4 rounded-lg">
          • Central allocation strongly prioritizes <b>employment & training initiatives</b>.
        </div>

      </div>
    </div>

  </div>
);
};

export default CentralFundsDisbursement;

import React, { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  AlertTriangle, 
  MapPin, 
  Search, 
  Filter,
  BrainCircuit // Icon for AI/NLP
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const DistrictFeedbackAnalysis = () => {
  const [filter, setFilter] = useState('All'); // 'All', 'Positive', 'Negative'

  // --- MOCK DATA ---

  // 1. NLP Sentiment Overview
  const sentimentData = [
    { name: 'Positive', value: 65, color: '#00a851' },
    { name: 'Neutral', value: 20, color: '#9ca3af' },
    { name: 'Negative', value: 15, color: '#ef4444' },
  ];

  // 2. Training Center Performance (Aggregated)
  const centerPerformance = [
    { name: 'Skill Center A', rating: 4.8 },
    { name: 'Tech Hub B', rating: 4.2 },
    { name: 'Vocational C', rating: 2.5 }, // Problematic center
    { name: 'Center D', rating: 3.9 },
  ];

  // 3. Individual User Feedback (with NLP Tags)
  const feedbacks = [
    {
      id: 1,
      user: "Amit Kumar",
      center: "Skill Center A",
      date: "2024-10-28",
      comment: "The computer lab is excellent and the trainer explains Python concepts very clearly. Very happy!",
      rating: 5,
      sentiment: "Positive",
      nlpKeywords: ["Infrastructure", "Teaching Quality"],
      aiConfidence: 98
    },
    {
      id: 2,
      user: "Riya Singh",
      center: "Vocational C",
      date: "2024-10-27",
      comment: "Drinking water is not available and the fan was not working. It was too hot to study.",
      rating: 1,
      sentiment: "Negative",
      nlpKeywords: ["Facility Issue", "Hygiene"],
      aiConfidence: 95
    },
    {
      id: 3,
      user: "Suresh Das",
      center: "Tech Hub B",
      date: "2024-10-26",
      comment: "Class timings are good but the study material provided is a bit outdated.",
      rating: 3,
      sentiment: "Neutral",
      nlpKeywords: ["Course Content", "Curriculum"],
      aiConfidence: 88
    },
    {
      id: 4,
      user: "Manoj P.",
      center: "Vocational C",
      date: "2024-10-25",
      comment: "Trainer is often late to class. We waste 30 mins everyday.",
      rating: 2,
      sentiment: "Negative",
      nlpKeywords: ["Trainer Punctuality", "Time Waste"],
      aiConfidence: 92
    },
  ];

  // Filter Logic
  const filteredFeedbacks = filter === 'All' 
    ? feedbacks 
    : feedbacks.filter(f => f.sentiment === filter);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">District Feedback Analysis</h1>
          <p className="text-sm text-gray-500">AI-driven insights from 12 Training Centers</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full text-green-600"><ThumbsUp size={18}/></div>
            <div>
              <p className="text-xs text-gray-500">Positive</p>
              <p className="font-bold text-gray-800">65%</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full text-red-600"><AlertTriangle size={18}/></div>
            <div>
              <p className="text-xs text-gray-500">Critical</p>
              <p className="font-bold text-gray-800">15%</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- ANALYTICS ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. NLP Sentiment Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit size={20} className="text-purple-600" />
            <h3 className="font-bold text-gray-800">NLP Sentiment Analysis</h3>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="middle" align="right" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Center Performance Ranking */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Center-wise Satisfaction Rating</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={centerPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 5]} hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="rating" name="Avg Rating" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                  {centerPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rating < 3 ? '#ef4444' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- FEEDBACK LIST SECTION --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare size={18} /> Recent Feedback Feed
          </h3>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('All')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${filter === 'All' ? 'bg-gray-800 text-white' : 'bg-white border text-gray-600'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('Negative')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${filter === 'Negative' ? 'bg-red-600 text-white' : 'bg-white border text-gray-600'}`}
            >
              Critical Issues
            </button>
            <button 
              onClick={() => setFilter('Positive')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${filter === 'Positive' ? 'bg-green-600 text-white' : 'bg-white border text-gray-600'}`}
            >
              Praises
            </button>
          </div>
        </div>

        {/* Feedback List */}
        <div className="divide-y divide-gray-100">
          {filteredFeedbacks.map((item) => (
            <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                
                {/* Left: User & Center Info */}
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0
                    ${item.sentiment === 'Positive' ? 'bg-green-500' : item.sentiment === 'Negative' ? 'bg-red-500' : 'bg-gray-400'}
                  `}>
                    {item.rating}★
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{item.user}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin size={12} /> {item.center} 
                      <span className="mx-1">•</span>
                      {item.date}
                    </div>
                  </div>
                </div>

                {/* Right: NLP Analysis Tags */}
                <div className="flex flex-wrap gap-2 items-start md:justify-end">
                   {item.nlpKeywords.map((keyword, idx) => (
                     <span key={idx} className="bg-purple-50 text-purple-700 border border-purple-100 px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wide">
                       {keyword}
                     </span>
                   ))}
                   <span className="text-[10px] text-gray-400 border border-gray-200 px-2 py-1 rounded bg-gray-50" title="AI Confidence Score">
                     AI: {item.aiConfidence}%
                   </span>
                </div>
              </div>

              {/* Comment Body */}
              <div className="mt-3 ml-14">
                <p className="text-gray-700 text-sm leading-relaxed">
                  "{item.comment}"
                </p>
                
                {/* Action for Negative Feedback */}
                {item.sentiment === 'Negative' && (
                  <div className="mt-3 flex gap-3">
                    <button className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline">
                      Create Ticket
                    </button>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline">
                      Contact Center Manager
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}

          {filteredFeedbacks.length === 0 && (
             <div className="p-8 text-center text-gray-500">
               No feedback found for this filter.
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DistrictFeedbackAnalysis;
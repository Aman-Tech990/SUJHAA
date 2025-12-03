import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
  MapPin,
  BrainCircuit, // using just as an analysis icon
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const DistrictFeedbackAnalysis = () => {
  const [filter, setFilter] = useState('All'); // 'All', 'Positive', 'Negative'
  const [feedbacks, setFeedbacks] = useState(BASE_FEEDBACKS);
  const [lastUpdated, setLastUpdated] = useState(0);
  const [nextPoolIndex, setNextPoolIndex] = useState(0);

  // --- LIVE UPDATE: every 8 seconds ---
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated((prev) => prev + 8);

      setFeedbacks((prev) => {
        let updated = [...prev];

        // 1) Occasionally add a new feedback item from the pool (simulate new submissions)
        if (nextPoolIndex < FEEDBACK_POOL.length) {
          const newItem = FEEDBACK_POOL[nextPoolIndex];
          updated = [newItem, ...updated]; // new feedback on top
          setNextPoolIndex((idx) => idx + 1);
        }

        // 2) Slightly nudge ratings on some existing feedback to simulate recalibration
        updated = updated.map((f, idx) => {
          if (idx % 7 === 0) {
            const delta = Math.random() > 0.5 ? 0.1 : -0.1;
            const newRating = Math.min(5, Math.max(1, f.rating + delta));
            return { ...f, rating: parseFloat(newRating.toFixed(1)) };
          }
          return f;
        });

        return updated;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [nextPoolIndex]);

  // --- Derive sentiment counts from feedbacks ---
  const sentimentCounts = feedbacks.reduce(
    (acc, f) => {
      acc[f.sentiment] = (acc[f.sentiment] || 0) + 1;
      return acc;
    },
    { Positive: 0, Neutral: 0, Negative: 0 }
  );

  const totalFeedback = feedbacks.length || 1;
  const positivePercent = Math.round((sentimentCounts.Positive / totalFeedback) * 100);
  const negativePercent = Math.round((sentimentCounts.Negative / totalFeedback) * 100);

  const sentimentData = [
    { name: 'Positive', value: sentimentCounts.Positive, color: '#00a851' },
    { name: 'Neutral', value: sentimentCounts.Neutral, color: '#9ca3af' },
    { name: 'Negative', value: sentimentCounts.Negative, color: '#ef4444' },
  ];

  // --- Compute center-wise average ratings dynamically ---
  const centerMap = {};
  feedbacks.forEach((f) => {
    if (!centerMap[f.center]) {
      centerMap[f.center] = { total: 0, count: 0 };
    }
    centerMap[f.center].total += f.rating;
    centerMap[f.center].count += 1;
  });

  const centerPerformance = Object.entries(centerMap)
    .map(([name, info]) => ({
      name,
      rating: parseFloat((info.total / info.count).toFixed(1)),
    }))
    .sort((a, b) => b.rating - a.rating);

  // Filter Logic
  const filteredFeedbacks =
    filter === 'All'
      ? feedbacks
      : feedbacks.filter((f) => f.sentiment === filter);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">
              District Feedback Analysis
            </h1>
            <span className="text-[11px] text-green-600 flex items-center gap-1">
              <span className="animate-pulse text-green-500">●</span> Live
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Feedback-based quality monitoring across training centers
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Last updated {lastUpdated}s ago • Auto-refresh every 8 seconds
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              <ThumbsUp size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Positive</p>
              <p className="font-bold text-gray-800">{positivePercent}%</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full text-red-600">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Critical</p>
              <p className="font-bold text-gray-800">{negativePercent}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- ANALYTICS ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Sentiment Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit size={20} className="text-purple-600" />
            <h3 className="font-bold text-gray-800">Feedback Sentiment Overview</h3>
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
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Center Performance Ranking */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">
            Center-wise Satisfaction Rating (Live Aggregate)
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={centerPerformance}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 5]} hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar
                  dataKey="rating"
                  name="Avg Rating"
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                >
                  {centerPerformance.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.rating < 3 ? '#ef4444' : '#3b82f6'}
                    />
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
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${filter === 'All'
                ? 'bg-gray-800 text-white'
                : 'bg-white border text-gray-600'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('Negative')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${filter === 'Negative'
                ? 'bg-red-600 text-white'
                : 'bg-white border text-gray-600'
                }`}
            >
              Critical Issues
            </button>
            <button
              onClick={() => setFilter('Positive')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${filter === 'Positive'
                ? 'bg-green-600 text-white'
                : 'bg-white border text-gray-600'
                }`}
            >
              Praises
            </button>
          </div>
        </div>

        {/* Feedback List */}
        <div className="divide-y divide-gray-100">
          {filteredFeedbacks.map((item) => (
            <div
              key={item.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Left: User & Center Info */}
                <div className="flex gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0
                    ${item.sentiment === 'Positive'
                        ? 'bg-green-500'
                        : item.sentiment === 'Negative'
                          ? 'bg-red-500'
                          : 'bg-gray-400'
                      }
                  `}
                  >
                    {item.rating}★
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">
                      {item.user}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin size={12} /> {item.center}
                      <span className="mx-1">•</span>
                      {item.date}
                    </div>
                  </div>
                </div>

                {/* Right: Feedback Tags */}
                <div className="flex flex-wrap gap-2 items-start md:justify-end">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-50 text-purple-700 border border-purple-100 px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                  <span
                    className="text-[10px] text-gray-400 border border-gray-200 px-2 py-1 rounded bg-gray-50"
                    title="System confidence score"
                  >
                    Confidence: {item.confidence}%
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

/* ------------------ BASE FEEDBACK (initial) ------------------ */

const BASE_FEEDBACKS = [
  {
    id: 1,
    user: 'Amit Kumar',
    center: 'Skill Center A',
    date: '2024-10-28',
    comment:
      'The computer lab is excellent and the trainer explains Python concepts very clearly. Very happy!',
    rating: 5,
    sentiment: 'Positive',
    tags: ['Infrastructure', 'Teaching Quality'],
    confidence: 98,
  },
  {
    id: 2,
    user: 'Riya Singh',
    center: 'Vocational C',
    date: '2024-10-27',
    comment:
      'Drinking water is not available and the fan was not working. It was too hot to study.',
    rating: 1,
    sentiment: 'Negative',
    tags: ['Facility Issue', 'Hygiene'],
    confidence: 95,
  },
  {
    id: 3,
    user: 'Suresh Das',
    center: 'Tech Hub B',
    date: '2024-10-26',
    comment:
      'Class timings are good but the study material provided is a bit outdated.',
    rating: 3,
    sentiment: 'Neutral',
    tags: ['Course Content', 'Curriculum'],
    confidence: 88,
  },
  {
    id: 4,
    user: 'Manoj P.',
    center: 'Vocational C',
    date: '2024-10-25',
    comment:
      'Trainer is often late to class. We waste 30 mins everyday.',
    rating: 2,
    sentiment: 'Negative',
    tags: ['Trainer Punctuality', 'Time Management'],
    confidence: 92,
  },
  {
    id: 5,
    user: 'Priya R',
    center: 'Tech Hub B',
    date: '2024-10-24',
    comment:
      'Labs are good and internet speed is decent. Could add more advanced topics.',
    rating: 4,
    sentiment: 'Positive',
    tags: ['Infrastructure', 'Content Depth'],
    confidence: 90,
  },
];

/* ------------------ LIVE FEEDBACK POOL (for new items) ------------------ */

const FEEDBACK_POOL = [
  {
    id: 101,
    user: 'Deepak Mishra',
    center: 'Skill Center A',
    date: '2024-10-29',
    comment:
      'Trainer helped us create our first resume and guided on interview preparation.',
    rating: 5,
    sentiment: 'Positive',
    tags: ['Placement Support', 'Guidance'],
    confidence: 96,
  },
  {
    id: 102,
    user: 'Kavita Das',
    center: 'Vocational C',
    date: '2024-10-29',
    comment:
      'Washrooms are not cleaned regularly. Needs urgent attention.',
    rating: 2,
    sentiment: 'Negative',
    tags: ['Hygiene', 'Facility Issue'],
    confidence: 93,
  },
  {
    id: 103,
    user: 'Rahul Verma',
    center: 'Tech Hub B',
    date: '2024-10-29',
    comment:
      'Good learning environment but systems are sometimes slow.',
    rating: 3,
    sentiment: 'Neutral',
    tags: ['Infrastructure', 'Lab Performance'],
    confidence: 89,
  },
  {
    id: 104,
    user: 'Sneha Patra',
    center: 'Skill Center A',
    date: '2024-10-30',
    comment:
      'Really liked the practical sessions on MS Office and email writing.',
    rating: 4,
    sentiment: 'Positive',
    tags: ['Practical Training', 'Soft Skills'],
    confidence: 94,
  },
  {
    id: 105,
    user: 'Vikash Kumar',
    center: 'Community Training Hall',
    date: '2024-10-30',
    comment:
      'Chairs are broken and fans are very noisy. Classes get disturbed.',
    rating: 2,
    sentiment: 'Negative',
    tags: ['Infrastructure', 'Noise'],
    confidence: 91,
  },
  {
    id: 106,
    user: 'Anjali Singh',
    center: 'Tech Hub B',
    date: '2024-10-31',
    comment:
      'Overall satisfied. Would like more practice tests for competitive exams.',
    rating: 4,
    sentiment: 'Positive',
    tags: ['Tests', 'Content Suggestion'],
    confidence: 90,
  },
];

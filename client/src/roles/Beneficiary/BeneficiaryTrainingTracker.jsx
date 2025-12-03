import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  GraduationCap,
  User,
  Clock,
  Star,
  BookOpen,
  RefreshCw
} from "lucide-react";

// APPLICATION
const MOCK_APPLICATION = {
  status: "CENTRAL_APPROVED",
  training: { status: "ASSIGNED" }
};

// TRAINING DATA
const MOCK_ASSIGNED_TRAINING = {
  center: {
    name: "Skill Development Training Center – Bhubaneswar",
    address: "CRP Square, Bhubaneswar, Odisha",
    trainer: "Rahul Sharma",
    trainerPhone: "9876543210",
  },
  progress: {
    totalSessions: 20,
    completed: 6,
    currentSession: {
      id: 7,
      name: "Session 7: Digital Tools for Entrepreneurship",
    },
  },
  feedbackHistory: [
    {
      sessionId: 5,
      sessionName: "Session 5: Financial Literacy Basics",
      rating: 5,
      feedback: "Very knowledgeable trainer",
      date: "2024-10-18",
    },
  ],
};

const BeneficiaryTrainingTracker = () => {
  const [application, setApplication] = useState(null);
  const [training, setTraining] = useState(null);
  const [isAssigned, setIsAssigned] = useState(false);

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  // INITIAL LOAD
  useEffect(() => {
    setTimeout(() => {
      setApplication(MOCK_APPLICATION);
      if (MOCK_APPLICATION.status === "CENTRAL_APPROVED" &&
        MOCK_APPLICATION.training.status === "ASSIGNED") {
        setTraining(MOCK_ASSIGNED_TRAINING);
        setIsAssigned(true);
      }
      setLoading(false);
    }, 1000);
  }, []);

  // AUTO UPDATE (SLOWER, REALISTIC)
  useEffect(() => {
    if (!training) return;

    const interval = setInterval(() => {
      setSyncing(true);

      setTimeout(() => {
        setTraining((prev) => {
          const t = { ...prev };

          if (t.progress.completed < t.progress.totalSessions) {
            t.progress.completed += 1;

            t.progress.currentSession = {
              id: t.progress.currentSession.id + 1,
              name: `Session ${t.progress.currentSession.id + 1}: Advanced Skill Enhancement`,
            };
          }

          return t;
        });

        toast.info("Training data refreshed");
        setSyncing(false);
      }, 1000);
    }, 25000); // 🔥 25 seconds

    return () => clearInterval(interval);
  }, [training]);

  // SUBMIT FEEDBACK
  const handleSubmitFeedback = () => {
    if (rating === 0) return toast.error("Please select a rating");
    if (!feedback.trim()) return toast.error("Please write feedback");

    const newFeedback = {
      sessionId: training.progress.currentSession.id,
      sessionName: training.progress.currentSession.name,
      rating,
      feedback,
      date: new Date().toLocaleDateString(),
    };

    setTraining((prev) => ({
      ...prev,
      feedbackHistory: [newFeedback, ...prev.feedbackHistory],
    }));

    setRating(0);
    setFeedback("");
    toast.success("Feedback submitted");
  };

  // LOADING
  if (loading) {
    return (
      <div className="flex flex-col items-center mt-20">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 mt-3 text-sm">Loading training details...</p>
      </div>
    );
  }

  // NOT APPROVED
  if (application.status !== "CENTRAL_APPROVED") {
    return (
      <div className="p-8 max-w-lg mx-auto text-center bg-white shadow rounded-xl">
        <img className="w-24 mx-auto opacity-80" src="https://cdn-icons-png.flaticon.com/512/564/564619.png" />
        <h2 className="text-xl font-bold mt-3">Training Not Available</h2>
        <p className="text-gray-600 text-sm mt-1">
          Status: <b>{application.status}</b>
        </p>
      </div>
    );
  }

  // NOT ASSIGNED
  if (!isAssigned) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center bg-white shadow rounded-xl">
        <img className="w-20 mx-auto opacity-80" src="https://cdn-icons-png.flaticon.com/512/1998/1998671.png" />
        <h2 className="text-xl font-bold mt-3">Training Pending</h2>
        <p className="text-gray-600 text-sm mt-1">
          Your district officials are yet to assign a center.
        </p>
      </div>
    );
  }

  // MAIN UI DATA
  const { totalSessions, completed, currentSession } = training.progress;
  const progress = Math.round((completed / totalSessions) * 100);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow border">
        <div>
          <h1 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
            <GraduationCap size={22} /> Training Progress
          </h1>
          <p className="text-xs text-gray-500">
            {syncing ? "Syncing..." : "Last synced just now"}
          </p>
        </div>

        {syncing && (
          <RefreshCw size={22} className="text-indigo-600 animate-spin" />
        )}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Center Card */}
        <div className="bg-white p-4 rounded-xl shadow border">
          <h2 className="font-bold text-indigo-700 text-sm">Training Center</h2>
          <p className="text-sm font-semibold mt-1">{training.center.name}</p>
          <p className="text-xs text-gray-500">{training.center.address}</p>

          <div className="mt-3 border-t pt-2">
            <p className="text-xs text-gray-500">Trainer</p>
            <p className="text-sm font-medium">{training.center.trainer}</p>
            <p className="text-xs text-gray-500">{training.center.trainerPhone}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white p-4 rounded-xl shadow border">
          <h2 className="font-bold text-indigo-700 text-sm">Progress</h2>
          <p className="text-xs text-gray-500">Completed {completed}/{totalSessions}</p>
          <div className="w-full h-3 bg-gray-200 rounded-full mt-2">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-1 text-xs font-semibold text-indigo-700">{progress}%</p>
        </div>

        {/* Current Session */}
        <div className="bg-white p-4 rounded-xl shadow border">
          <h2 className="font-bold text-indigo-700 text-sm">Current Session</h2>
          <p className="text-sm mt-1 flex items-center gap-2">
            <BookOpen size={16} /> {currentSession.name}
          </p>
        </div>

      </div>

      {/* FEEDBACK FORM */}
      <div className="bg-white p-5 rounded-xl shadow border space-y-4">
        <h2 className="font-bold text-indigo-700 text-sm flex items-center gap-2">
          <Star size={18} /> Submit Feedback
        </h2>

        {/* Rating */}
        <div className="flex gap-1 text-2xl">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              onClick={() => setRating(s)}
              className={`cursor-pointer ${rating >= s ? "text-yellow-400" : "text-gray-300"
                }`}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          className="w-full p-3 border rounded-lg text-sm bg-gray-50 focus:bg-white"
          rows={4}
          placeholder="Write your feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <button
          onClick={handleSubmitFeedback}
          className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold"
        >
          Submit
        </button>
      </div>

      {/* FEEDBACK HISTORY */}
      <div className="bg-white p-5 rounded-xl shadow border">
        <h2 className="font-bold text-indigo-700 text-sm mb-3">Previous Feedback</h2>

        <div className="space-y-3">
          {training.feedbackHistory.map((f, i) => (
            <div
              key={i}
              className="p-3 bg-gray-50 rounded-lg border shadow-sm"
            >
              <p className="font-semibold text-sm">{f.sessionName}</p>
              <p className="text-xs text-gray-600 italic">"{f.feedback}"</p>
              <p className="text-[10px] text-gray-500 mt-1">{f.date}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BeneficiaryTrainingTracker;

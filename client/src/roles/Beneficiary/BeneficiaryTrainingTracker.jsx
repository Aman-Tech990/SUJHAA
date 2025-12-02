import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const MOCK_APPLICATION = {
  status: "CENTRAL_APPROVED", // change this to test UI states
  training: {
    status: "ASSIGNED" // or "NOT_ASSIGNED"
  }
};

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

  // FEEDBACK STATES
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  // SUBMIT FEEDBACK HANDLER
  const handleSubmitFeedback = () => {
    if (rating === 0) return alert("Please give a rating ⭐");
    if (!feedback.trim()) return alert("Please write feedback");

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

    toast.success("Feedback submitted successfully!");
  };


  // 🟦 Load mock application in useEffect
  useEffect(() => {
    // Simulate API fetch
    setApplication(MOCK_APPLICATION);

    if (
      MOCK_APPLICATION.status === "CENTRAL_APPROVED" &&
      MOCK_APPLICATION.training.status === "ASSIGNED"
    ) {
      setTraining(MOCK_ASSIGNED_TRAINING);
      setIsAssigned(true);
    }
  }, []);

  // Application still loading
  if (!application) {
    return (
      <div className="text-center p-10 text-gray-500">Loading training...</div>
    );
  }

  // WAIT FOR CENTRAL APPROVAL
  if (application.status !== "CENTRAL_APPROVED") {
    return (
      <div className="p-10 max-w-xl mx-auto mt-10 text-center bg-white border rounded-2xl shadow-sm">
        <img
          src="https://cdn-icons-png.flaticon.com/512/564/564619.png"
          className="w-32 mx-auto opacity-80"
        />
        <h2 className="text-xl font-bold text-gray-800 mt-4">
          Training Not Available Yet
        </h2>
        <p className="text-gray-600 mt-2">
          Your application is currently <b>{application.status}</b>.
          <br />
          Training will be assigned after Central Ministry Approval.
        </p>
      </div>
    );
  }

  // CENTRAL APPROVED BUT TRAINING NOT ASSIGNED
  if (!isAssigned) {
    return (
      <div className="p-10 max-w-xl mx-auto text-center bg-white rounded-2xl shadow-md">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1998/1998671.png"
          className="w-28 mx-auto opacity-80"
        />
        <h2 className="text-xl font-bold mt-3 text-gray-800">
          Training Pending
        </h2>
        <p className="text-gray-600 mt-2">
          Your district/state officials are yet to assign a training center.
        </p>
      </div>
    );
  }

  // TRAINING ASSIGNED – SHOW UI
  const total = training.progress.totalSessions;
  const completed = training.progress.completed;
  const progress = Math.round((completed / total) * 100);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-indigo-700 text-center">
        Training Progress Overview
      </h1>

      {/* CENTER INFO */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold text-indigo-800">Training Center</h2>
        <p className="text-gray-600 mt-1">{training.center.name}</p>
        <p className="text-gray-500">{training.center.address}</p>

        <h3 className="mt-4 font-semibold">Trainer:</h3>
        <p className="text-gray-700">{training.center.trainer}</p>
        <p className="text-sm text-gray-500">{training.center.trainerPhone}</p>
      </div>

      {/* PROGRESS BAR */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-lg font-bold text-indigo-800 mb-2">Progress</h2>
        <p className="text-sm text-gray-600 mb-2">
          Completed {completed} out of {total} sessions
        </p>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-right text-sm mt-1 font-semibold text-indigo-700">
          {progress}% Completed
        </p>
      </div>

      {/* CURRENT SESSION */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-lg font-bold text-indigo-800">Current Session</h2>
        <p className="text-gray-700 mt-1">
          {training.progress.currentSession.name}
        </p>
      </div>

      {/* FEEDBACK HISTORY */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-lg font-bold text-indigo-800 mb-3">
          Previous Session Feedback
        </h2>

        {/* FEEDBACK FORM (ONLY FOR CURRENT SESSION) */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-lg font-bold text-indigo-800 mb-3">
            Submit Feedback for Current Session
          </h2>

          {/* ⭐ RATING */}
          <div className="flex gap-1 text-3xl mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer transition ${rating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
              >
                ★
              </span>
            ))}
          </div>

          {/* 💬 TEXT FEEDBACK */}
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback here..."
            className="w-full h-24 p-3 border rounded-lg text-gray-700 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-300 outline-none"
          ></textarea>

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleSubmitFeedback}
            className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Submit Feedback
          </button>
        </div>

        {training.feedbackHistory.map((f, i) => (
          <div
            key={i}
            className="p-4 border rounded-lg mb-3 bg-gray-50 shadow-sm my-4"
          >
            <p className="font-semibold">{f.sessionName}</p>
            <p className="text-sm text-gray-600 italic">"{f.feedback}"</p>
            <p className="text-xs text-gray-500">{f.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BeneficiaryTrainingTracker;

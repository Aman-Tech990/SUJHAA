import React, { useState, useEffect } from "react";

// 📌 MOCK DATA (Same as before)
const MOCK_DB = {
  training: {
    currentSessionId: 5,
    currentSessionName: "Session 5: Digital Literacy Basics",
    completedSessions: 5,
    totalSessions: 20,
    trainerName: "Rahul Sharma",
  },
  initialHistory: [
    {
      sessionId: 1,
      sessionName: "Session 1: Introduction to PM-AJAY",
      rating: 5,
      feedback: "Great introduction, very informative.",
      date: "2024-10-10",
    },
    {
      sessionId: 2,
      sessionName: "Session 2: Skill Development Overview",
      rating: 4,
      feedback: "Good, but the audio was a bit low.",
      date: "2024-10-12",
    },
    {
      sessionId: 3,
      sessionName: "Session 3: Financial Literacy",
      rating: 5,
      feedback: "Excellent session!",
      date: "2024-10-15",
    },
    {
      sessionId: 4,
      sessionName: "Session 4: Government Schemes",
      rating: 5,
      feedback: "Very helpful.",
      date: "2024-10-18",
    },
  ],
};

const BeneficiaryTrainingTracker = () => {
  // 📌 STATE MANAGEMENT
  const [trainingData, setTrainingData] = useState({
    currentSessionId: 0,
    currentSession: "",
    completedSessions: 0,
    totalSessions: 0,
    trainerName: "",
    progressPercent: 0,
  });

  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // 📌 LOAD DATA
  useEffect(() => {
    const loadData = () => {
      const data = MOCK_DB.training;
      setTrainingData({
        currentSessionId: data.currentSessionId,
        currentSession: data.currentSessionName,
        completedSessions: data.completedSessions,
        totalSessions: data.totalSessions,
        trainerName: data.trainerName,
        progressPercent: Math.round(
          (data.completedSessions / data.totalSessions) * 100
        ),
      });
      setFeedbackHistory(MOCK_DB.initialHistory);
    };
    loadData();
  }, []);

  const hasSubmittedForCurrentSession = feedbackHistory.some(
    (item) => item.sessionId === trainingData.currentSessionId
  );

  const handleFeedbackSubmit = () => {
    if (rating === 0) {
      alert("Please select a star rating!");
      return;
    }
    const newEntry = {
      sessionId: trainingData.currentSessionId,
      sessionName: trainingData.currentSession,
      rating: rating,
      feedback: feedback || "No comment provided.",
      date: new Date().toLocaleDateString(),
    };
    setFeedbackHistory([newEntry, ...feedbackHistory]); // Add to top
    setShowPopup(true);
    setRating(0);
    setFeedback("");
  };

  return (
    <>
      {/* MAIN PAGE CONTAINER - Reduced padding */}
      <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 to-indigo-50 font-poppins pb-20 flex flex-col items-center">
        
        {/* HEADER - Reduced Sizes */}
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-indigo-100 p-6 text-center animate-fadeDown">
          <h1 className="text-3xl font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 drop-shadow-sm">
            Training Progress
            <span className="block w-16 h-1 mx-auto mt-2 rounded-full bg-indigo-400"></span>
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500">
            Track your PM-AJAY Training Journey
          </p>
        </div>

        {/* INFO CARD - Compact Layout */}
        <div className="w-full max-w-4xl mt-6 bg-white rounded-xl shadow-md border p-6 animate-fade">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center md:text-left">
            {[
              ["Current Session", trainingData.currentSession],
              [
                "Completed",
                `${trainingData.completedSessions} / ${trainingData.totalSessions}`,
              ],
              [
                "Remaining",
                `${trainingData.totalSessions - trainingData.completedSessions} Sessions`,
              ],
              ["Trainer", trainingData.trainerName],
            ].map(([label, value], i) => (
              <div key={i} className="hover:-translate-y-1 transition duration-300">
                <p className="text-xs font-semibold uppercase text-gray-400 tracking-wide">{label}</p>
                <p className="text-lg font-bold text-indigo-900 mt-1 leading-tight">{value}</p>
              </div>
            ))}
          </div>

          {/* PROGRESS BAR - Slimmer */}
          <div className="mt-8 text-center">
            <div className="flex justify-between items-end mb-2">
                <h2 className="text-lg font-bold text-indigo-900">Overall Progress</h2>
                <span className="text-sm font-bold text-indigo-600">{trainingData.progressPercent}%</span>
            </div>
            
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${trainingData.progressPercent}%` }}
                className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000 ease-out"
              ></div>
            </div>
          </div>
        </div>

        {/* FEEDBACK FORM CARD - Medium Sizes */}
        <div className="w-full max-w-4xl mt-6 bg-white rounded-xl shadow-lg border p-8 animate-fadeUp relative overflow-hidden">
          
          {/* SUCCESS OVERLAY - Smaller Icon/Text */}
          {hasSubmittedForCurrentSession ? (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl">
              <div className="bg-white p-6 rounded-lg shadow-xl text-center border border-green-200 max-w-md">
                <span className="text-4xl">✅</span>
                <h2 className="text-xl font-bold text-green-700 mt-2">Feedback Submitted!</h2>
                <p className="text-sm text-gray-600 mt-2">
                  You have already reviewed <b>{trainingData.currentSession}</b>.
                </p>
                <p className="text-xs text-gray-400 mt-1">Please wait for the next session.</p>
              </div>
            </div>
          ) : null}

          <h2 className="text-xl font-bold text-indigo-900 mb-4 border-b pb-2">
            Rate: {trainingData.currentSession}
          </h2>

          {/* STAR RATING - Medium Size */}
          <div className="text-3xl mb-4 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => !hasSubmittedForCurrentSession && setRating(star)}
                className={`transition-all duration-200 ${
                  rating >= star ? "text-yellow-400 scale-110" : "text-gray-300"
                } ${!hasSubmittedForCurrentSession ? "cursor-pointer hover:text-yellow-300" : "cursor-default"}`}
              >
                ★
              </span>
            ))}
          </div>

          {/* TEXTBOX - Normal Text Size */}
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={hasSubmittedForCurrentSession}
            placeholder={hasSubmittedForCurrentSession ? "Feedback submitted." : "Share your experience here..."}
            className="w-full h-32 p-3 rounded-lg text-sm text-gray-700 bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:outline-none focus:bg-white transition disabled:opacity-50 resize-none"
          ></textarea>

          {/* SUBMIT BUTTON - Standard Size */}
          <button
            onClick={handleFeedbackSubmit}
            disabled={hasSubmittedForCurrentSession}
            className={`mt-4 w-full py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-white transition
              ${hasSubmittedForCurrentSession 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
              }`}
          >
            {hasSubmittedForCurrentSession ? "Submitted" : "Submit Feedback"}
          </button>
        </div>

        {/* FEEDBACK HISTORY - Clean List */}
        <div className="w-full max-w-4xl mt-8">
          <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
             <span>📜</span> Past Feedback
          </h2>

          <div className="space-y-4">
            {feedbackHistory.length > 0 ? (
              feedbackHistory.map((item, index) => (
                <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-200 transition">
                  
                  {/* LEFT: Session Info */}
                  <div className="flex-1">
                    <div className="flex justify-between sm:justify-start items-center gap-3">
                        <h3 className="text-sm font-bold text-gray-800">{item.sessionName}</h3>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{item.date}</span>
                    </div>
                    <p className="text-gray-600 mt-1 text-sm italic">"{item.feedback}"</p>
                  </div>

                  {/* RIGHT: Rating */}
                  <div className="flex items-center gap-1 text-lg text-yellow-400 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100">
                    <span className="text-xs font-bold text-indigo-400 mr-1 text-black">Rating:</span>
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < item.rating ? "★" : "☆"}</span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm">No feedback history found.</p>
            )}
          </div>
        </div>

      </div>

      {/* SUCCESS POPUP - Reduced Size */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade">
          <div className="bg-white px-8 py-6 rounded-xl shadow-2xl text-center max-w-sm w-full mx-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
               <span className="text-2xl">🎉</span>
            </div>
            <h2 className="text-xl font-bold text-green-700">Thank You!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your feedback has been successfully recorded.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-5 w-full py-2 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BeneficiaryTrainingTracker;
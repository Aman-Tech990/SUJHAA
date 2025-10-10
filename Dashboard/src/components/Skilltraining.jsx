import { useState } from "react";
import { Calendar, Clock, Book, CheckCircle, Award, User } from "lucide-react";

export default function SkillTraining() {
  const [training, setTraining] = useState({
    courseName: "Tailoring & Stitching Training",
    institute: "Adarsh Skill Development Center, Lucknow",
    trainer: "Ms. Priya Sharma",
    startDate: "20 Oct 2025",
    duration: "3 Months",
    hoursCompleted: 65,
    totalHours: 120,
    status: "Ongoing",
    certificate: null,
  });

  const progressPercent = Math.round(
    (training.hoursCompleted / training.totalHours) * 100
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Skill Training
        </h1>

        <div className="space-y-4">
          {/* Course Info */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-orange-700 mb-2 flex items-center gap-2">
              <Book className="w-5 h-5" /> {training.courseName}
            </h2>
            <p className="text-gray-700">
              <strong>Institute:</strong> {training.institute}
            </p>
            <p className="text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" /> <strong>Trainer:</strong>{" "}
              {training.trainer}
            </p>
            <p className="text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> <strong>Start Date:</strong>{" "}
              {training.startDate}
            </p>
            <p className="text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4" /> <strong>Duration:</strong>{" "}
              {training.duration}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-50 border rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium text-gray-800">Training Progress</p>
              <p className="text-sm text-gray-600">
                {training.hoursCompleted}/{training.totalHours} hours
              </p>
            </div>

            <div className="w-full bg-gray-200 h-3 rounded-full">
              <div
                className="h-3 rounded-full bg-orange-500 transition-all"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              {progressPercent < 100
                ? `You’ve completed ${progressPercent}% of your training. Keep going!`
                : "Training completed successfully!"}
            </p>
          </div>

          {/* Status Section */}
          <div className="bg-white border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Current Status
              </h3>
              <p
                className={`font-medium ${
                  training.status === "Completed"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {training.status}
              </p>
            </div>

            {training.status === "Completed" ? (
              <a
                href={training.certificate}
                download
                className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg transition"
              >
                <Award className="w-5 h-5" />
                Download Certificate
              </a>
            ) : (
              <button
                className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-600 px-4 py-2 rounded-lg transition"
                disabled
              >
                <CheckCircle className="w-5 h-5" />
                Certificate Pending
              </button>
            )}
          </div>

          {/* Support */}
          <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 mt-4 text-sm text-gray-700">
            <p>
              📞 For any training-related queries, contact your District Skill
              Coordinator or call the PM-AJAY support helpline at{" "}
              <strong>1800-111-222</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

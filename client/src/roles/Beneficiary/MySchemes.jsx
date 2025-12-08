import React, { useState, useEffect } from "react";
import {
  Check,
  Clock,
  X,
  Send,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const MySchemes = () => {
  const [applications, setApplications] = useState([]);

  // Grievance States
  const [openGrievance, setOpenGrievance] = useState(false);
  const [activeApplication, setActiveApplication] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  /* -------------------- TIMELINE BUILDER -------------------- */
  const generateTimeline = (app) => [
    {
      title: "Application Submitted",
      date: app.applied_date
        ? new Date(app.applied_date).toDateString()
        : "--",
      desc: "Application submitted by beneficiary",
      completed: true,
    },
    {
      title: "Field Verification",
      date: app.field_verified_at
        ? new Date(app.field_verified_at).toDateString()
        : "Pending",
      desc: app.field_verified
        ? "Verified by Field Officer"
        : "Awaiting field verification",
      completed: app.field_verified || false,
      current: !app.field_verified,
    },
    {
      title: "District Officer Review",
      date: app.district_approved_at
        ? new Date(app.district_approved_at).toDateString()
        : "Pending",
      desc: app.district_approved_by
        ? "Approved at District Level"
        : "Waiting for district officer",
      completed: !!app.district_approved_by,
    },
    {
      title: "State Officer Approval",
      date: app.state_approved_at
        ? new Date(app.state_approved_at).toDateString()
        : "Pending",
      desc: app.state_approved_by
        ? "Approved at State Level"
        : "Waiting for state officer",
      completed: !!app.state_approved_by,
    },
    {
      title: "Central Ministry Approval",
      date: app.central_approved_at
        ? new Date(app.central_approved_at).toDateString()
        : "Pending",
      desc: app.central_approved_by
        ? "Approved by Central Authority"
        : "Awaiting central approval",
      completed: !!app.central_approved_by,
    },
    {
      title: "Training Assignment",
      date: app.trainingStartDate
        ? new Date(app.trainingStartDate).toDateString()
        : "Pending",
      desc: app.trainingSkill
        ? `Training: ${app.trainingSkill}`
        : "Training not assigned",
      completed:
        app.trainingStatus === "ONGOING" ||
        app.trainingStatus === "COMPLETED",
    },
    {
      title: "Fund Release (DBT)",
      date:
        app.funds?.find((f) => f.status === "RELEASED")
          ?.releasedAt || "Pending",
      desc: app.funds?.some((f) => f.status === "RELEASED")
        ? "Funds released via DBT"
        : "Funds not released yet",
      completed:
        app.funds?.some((f) => f.status === "RELEASED") ||
        false,
    },
    {
      title: "Enterprise Kit Distribution",
      date: app.enterpriseKit?.distributedAt
        ? new Date(
          app.enterpriseKit.distributedAt
        ).toDateString()
        : "Pending",
      desc: app.enterpriseKit?.distributed
        ? "Kit distributed to beneficiary"
        : "Kit not distributed",
      completed: app.enterpriseKit?.distributed || false,
    },
  ];

  /* -------------------- FETCH APPLICATIONS -------------------- */
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get(
          "https://sujhaa-backend.onrender.com/api/application/my-applications",
          { withCredentials: true }
        );
        if (res.data.success) {
          setApplications(res.data.applications);
        }
      } catch {
        toast.error("Failed to fetch applications");
      }
    };
    fetchApps();
  }, []);

  /* -------------------- GRIEVANCE HANDLERS (MOCK) -------------------- */
  const openGrievanceModal = (app) => {
    setActiveApplication(app);
    setMessages(app.grievanceThread || []);
    setOpenGrievance(true);
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMsg = {
      sender: "BENEFICIARY",
      text: message,
      timestamp: new Date().toISOString(),
    };

    // ✅ LOCAL CHAT UPDATE (Mock)
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");

    // ✅ MOCK SUCCESS FEEDBACK
    toast.success("Complaint has been raised successfully");
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border">
          <h2 className="text-xl font-semibold mb-2">
            No Applications Found
          </h2>
          <p className="text-gray-600">
            You haven’t applied to any scheme yet.
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">
            My Applications
          </h1>

          <div className="space-y-6">
            {applications.map((scheme, index) => (
              <div
                key={index}
                className="bg-white border rounded-lg p-6 shadow-sm"
              >
                {/* Header */}
                <div className="flex justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {scheme.scheme_id?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Application ID: {scheme.application_id}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <span className="px-3 py-1 rounded text-sm bg-orange-100 text-orange-800 font-semibold">
                      {scheme.status}
                    </span>

                    <button
                      onClick={() => openGrievanceModal(scheme)}
                      className="flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100"
                    >
                      <MessageSquare size={16} />
                      Raise Grievance
                    </button>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-6 mt-6">
                  {generateTimeline(scheme).map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full border-2
                        ${step.completed
                            ? "bg-green-600 text-white border-green-600"
                            : step.current
                              ? "bg-orange-500 text-white border-orange-500"
                              : "border-gray-300 text-gray-400"
                          }`}
                      >
                        {step.completed ? (
                          <Check size={16} />
                        ) : (
                          <Clock size={16} />
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {step.desc}
                        </p>
                        <p className="text-xs text-gray-400">
                          {step.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------------- GRIEVANCE MODAL ---------------- */}
      {openGrievance && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden">

            {/* Header */}
            <div className="bg-green-700 text-white px-4 py-3 flex justify-between">
              <div>
                <h3 className="font-semibold">
                  Grievance Support
                </h3>
                <p className="text-xs opacity-90">
                  Application ID: {activeApplication?.application_id}
                </p>
              </div>
              <button onClick={() => setOpenGrievance(false)}>
                <X />
              </button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto bg-gray-50 p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-center text-sm text-gray-500">
                  Start describing your issue.
                </p>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[75%] px-4 py-2 rounded-lg text-sm
                  ${msg.sender === "BENEFICIARY"
                      ? "ml-auto bg-green-600 text-white"
                      : "bg-white border"
                    }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-[10px] mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t p-3 flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your grievance..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-green-700 text-white px-3 rounded-lg hover:bg-green-800"
              >
                <Send size={16} />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default MySchemes;

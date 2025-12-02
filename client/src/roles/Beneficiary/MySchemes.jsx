import React, { useState, useEffect } from "react";
import { Check, Clock } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const MySchemes = () => {
  const [applications, setApplications] = useState([]);

  // PM-AJAY TIMELINE BUILDER
  const generateTimeline = (app) => {
    return [
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
          app.funds?.find((f) => f.status === "RELEASED")?.releasedAt ||
          "Pending",
        desc: app.funds?.some((f) => f.status === "RELEASED")
          ? "Funds released via DBT"
          : "Funds not released yet",
        completed: app.funds?.some((f) => f.status === "RELEASED") || false,
      },

      {
        title: "Enterprise Kit Distribution",
        date: app.enterpriseKit?.distributedAt
          ? new Date(app.enterpriseKit.distributedAt).toDateString()
          : "Pending",
        desc: app.enterpriseKit?.distributed
          ? "Kit distributed to beneficiary"
          : "Kit not distributed",
        completed: app.enterpriseKit?.distributed || false,
      },
    ];
  };

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/application/my-applications",
          { withCredentials: true }
        );

        if (res.data.success) {
          console.log(res.data.applications);
          setApplications(res.data.applications);
          toast.success("Applications loaded!");
        }
      } catch (err) {
        toast.error("Failed to fetch applications");
        console.log(err);
      }
    };

    fetchApps();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* EMPTY STATE */}
      {applications.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 shadow-sm text-center">
          <div className="flex justify-center mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No applications"
              className="w-24 h-24 opacity-80"
            />
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Applications Found
          </h2>

          <p className="text-gray-600 mb-6">
            You haven’t applied to any scheme yet.
            Start your journey by applying for a PM-AJAY scheme.
          </p>

          <a
            href="/beneficiary/dashboard"
            className="font-semibold inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Apply for a Scheme
          </a>
        </div>
      ) : (
        <>
          {/* TITLE */}
          <h1 className="text-2xl font-bold mb-6">My Applications</h1>

          {/* APPLICATION CARDS */}
          <div className="space-y-6">
            {applications.map((scheme, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
              >
                {/* Header Section */}
                <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {scheme.scheme_id?.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Application ID: {scheme.application_id} | Applied:{" "}
                      {scheme.applied_date
                        ? new Date(scheme.applied_date).toDateString()
                        : "--"}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded text-sm font-bold ${scheme.status === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                      }`}
                  >
                    {scheme.status}
                  </span>
                </div>

                {/* PM-AJAY Timeline */}
                <div className="mt-6">
                  <h3 className="text-md font-semibold mb-4">
                    Application Progress
                  </h3>

                  <div className="space-y-6">
                    {generateTimeline(scheme).map((step, idx) => (
                      <div key={idx} className="flex items-start gap-4">

                        {/* Status Icon */}
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-full border-2
                          ${step.completed
                              ? "bg-green-600 border-green-600 text-white"
                              : step.current
                                ? "bg-orange-500 border-orange-500 text-white"
                                : "border-gray-300 text-gray-400"
                            }`}
                        >
                          {step.completed ? (
                            <Check size={18} />
                          ) : (
                            <Clock size={18} />
                          )}
                        </div>

                        {/* Step Info */}
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {step.title}
                          </h4>
                          <p className="text-sm text-gray-500">{step.desc}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {step.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MySchemes;

import React from 'react';
import { Check, Clock } from 'lucide-react';

const MySchemes = () => {

  // --- DATA SECTION ---
  // This is the data structure you requested. 
  // I added a second example with a different status ("In Progress") to show how the timeline changes.
  const mySchemesData = [
    {
      id: "APP-2024-1102",
      schemeName: "Pradhan Mantri Grant-in-Aid",
      appliedDate: "20 Oct 2024",
      status: "Approved",
      // These are the 4 fixed steps you requested
      timeline: [
        { title: "Application Sent", date: "20 Oct 2024", desc: "Application submitted", completed: true },
        { title: "Field Verification", date: "25 Oct 2024", desc: "Verified by Field Officer", completed: true },
        { title: "Final District Approval", date: "05 Nov 2024", desc: "Final Approval from District Officer", completed: true },
        { title: "Funds allocation", date: "10 Nov 2024", desc: "Funds Transfered Through DBT", completed: true, current: true },
      ],
    },
    {
      id: "APP-2025-9988",
      schemeName: "PM-AJAY: Grant Component",
      appliedDate: "15 Nov 2025",
      status: "In Progress",
      // Same 4 steps, but different completion status
      timeline: [
        { title: "Application Sent", date: "15 Nov 2025", desc: "Application submitted", completed: true },
        { title: "Field Verification", date: "Pending", desc: "Officer assigned", completed: false, current: true },
        { title: "Final District Approval", date: "--", desc: "Waiting for verification", completed: false },
        { title: "Funds allocation", date: "--", desc: "Pending approval", completed: false },
      ],
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Applied Schemes</h1>

      {/* --- LIST RENDERING --- */}
      {/* We map through the data array to create a card for each scheme */}
      <div className="space-y-6">
        {mySchemesData.map((scheme, index) => (
          
          /* --- SCHEME CARD --- */
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            
            {/* 1. Header: Scheme Name and Status Badge */}
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{scheme.schemeName}</h2>
                <p className="text-sm text-gray-500 mt-1">Application ID: {scheme.id} | Applied: {scheme.appliedDate}</p>
              </div>
              <span className={`px-3 py-1 rounded text-sm font-bold ${
                scheme.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {scheme.status}
              </span>
            </div>

            {/* 2. Timeline Container */}
            <div className="relative mt-8">
              
              {/* This is the gray background line that runs behind everything */}
              <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-10"></div>

              {/* --- TIMELINE STEPS --- */}
              <div className="flex justify-between items-start">
                
                {scheme.timeline.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex flex-col items-center w-1/4">
                    
                    {/* A. The Circle Icon */}
                    {/* Logic: If completed -> Green. If current -> Orange. Else -> Gray */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white ${
                      step.completed 
                        ? 'bg-green-600 text-white' 
                        : step.current 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-300 text-gray-500'
                    }`}>
                      {step.completed ? <Check size={18} /> : <Clock size={18} />}
                    </div>

                    {/* B. The Text Details */}
                    <div className="text-center mt-3 px-2">
                      <p className={`font-bold text-sm ${step.completed ? 'text-green-700' : 'text-gray-700'}`}>
                        {step.title}
                      </p>
                      
                      <p className="text-xs text-gray-500 mt-1 font-medium">{step.date}</p>
                      
                      {/* C. The Description Box */}
                      <div className="mt-2 p-2 bg-gray-50 text-xs text-gray-600 rounded border border-gray-200 w-full">
                        {step.desc}
                      </div>
                    </div>

                  </div>
                ))}
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySchemes;
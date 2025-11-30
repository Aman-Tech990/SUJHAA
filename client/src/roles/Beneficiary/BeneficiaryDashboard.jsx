import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import SchemeCard from '@/cards/SchemeCard'; // The component we created above
import axios from 'axios';
import { toast } from 'sonner';

const BeneficiaryDashboard = () => {
  // 1. New Data Structure (Based on your API Response)

  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await axios.get("https://sujhaa-backend.vercel.app/api/schemes/all");

        console.log("API Response:", res.data);

        if (res.data.success) {
          setSchemes(res.data.schemes);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch schemes");
      }
    };

    fetchSchemes();
  }, []);

  const handleApply = (scheme) => {
    console.log("User clicked apply for:", scheme.name);
    // Navigate to details page here
  };

  const user = JSON.parse(localStorage.getItem("sujhaa-user"));

  return (
    <div className="space-y-8 p-4 bg-gray-50 min-h-screen">
      {/* --- SECTION 1: Welcome Header --- */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-sm text-gray-500">
            Digital ID: <span className="font-semibold">{user?.digitalId}</span><br />
            Location: {user?.address}, {user?.district}, {user?.state}
          </p>
          {user?.isVerified ? (
            <p className="text-green-600 text-sm font-semibold">✔ Verified Beneficiary</p>
          ) : (
            <p className="text-red-600 text-sm font-semibold">❌ Pending Verification</p>
          )}
        </div>
        <div className="hidden text-right text-sm text-gray-400 md:block">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* --- SECTION 3: Schemes Header & Filter --- */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Recommended Schemes</h2>

      </div>

      {/* --- SECTION 4: Schemes Grid --- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {schemes.map((scheme) => (
          <SchemeCard
            key={scheme._id} // Using _id from API
            scheme={scheme}  // Passing the WHOLE object
            onApply={handleApply}
          />
        ))}
      </div>

    </div>
  );
};

export default BeneficiaryDashboard;
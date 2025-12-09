import React from 'react';
import { Phone, Mail, MapPin, Clock, Headphones } from 'lucide-react';

const BeneficiaryHelp = () => {


  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-500 text-sm">Need assistance? Reach out to our support team or district officers.</p>
      </div>

      {/* Contact Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. Toll-Free Helpline Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-700">
            <Headphones size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">PM-AJAY Helpline</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Available Mon-Sat, 9:00 AM to 6:00 PM for general queries and grievance redressal.
          </p>

          <a href="tel:1800-11-0000" className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-2 transition-colors">
            <Phone size={20} />
            +91-11-24364468
          </a>
          <span className="text-xs text-green-600 mt-2 font-medium bg-green-50 px-2 py-1 rounded">Toll-Free Number</span>
        </div>

        {/* 2. District Officer Contact Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-700">
            <Mail size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">District Nodal Officer</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Contact your local officer directly for application verification issues or specific delays.
          </p>

          <a href="mailto:district.officer@pmajay.gov.in" className="bg-white border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-700 px-6 py-3 rounded-xl font-bold text-lg flex items-center gap-2 transition-all group">
            <Mail size={20} className="text-gray-400 group-hover:text-blue-500" />
            do-officer@sujhaa.gov.in
          </a>
          <span className="text-xs text-gray-400 mt-2">Response time: Within 24-48 Hours</span>
        </div>
      </div>

      {/* 3. Additional Info / Footer */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <MapPin className="text-gray-400 w-5 h-5" />
          <div className="text-sm">
            <p className="font-semibold text-gray-700">Office Address:</p>
            <p className="text-gray-500">Block B, 2nd Floor, Vikas Bhawan, New Delhi - 110001</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="text-gray-400 w-5 h-5" />
          <div className="text-sm">
            <p className="font-semibold text-gray-700">Working Hours:</p>
            <p className="text-gray-500">09:30 AM - 05:30 PM (Closed on Public Holidays)</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BeneficiaryHelp;
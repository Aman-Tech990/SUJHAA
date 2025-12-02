import React from 'react';
import { Wallet, FileText, CheckCircle, IndianRupee, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SchemeCard = ({ scheme, onApply }) => {
  // 1. Helper to format currency (e.g., 60000 -> ₹60,000)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // 2. Helper to make category text readable
  const formatCategory = (text) => {
    return text?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) || 'General';
  };

  const isEligible = scheme.status === 'ACTIVE';

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full">

      {/* --- Top Highlight Bar (Replaces Image) --- */}
      <div className={`h-2 w-full ${isEligible ? 'bg-blue-600' : 'bg-gray-400'}`} />

      <div className="p-5 flex flex-col grow">

        {/* Header: Category & Status */}
        <div className="flex justify-between items-start mb-3">
          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md uppercase tracking-wide">
            {formatCategory(scheme.category)}
          </span>
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isEligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            {isEligible && <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />}
            {scheme.status}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-14">
          {scheme.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 grow">
          {scheme.description}
        </p>

        {/* --- Key Metrics Grid --- */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Funding Amount */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex items-center text-gray-500 text-xs mb-1">
              <Wallet size={12} className="mr-1.5" />
              Assistance
            </div>
            <div className="text-base font-bold text-gray-900">
              {
                isNaN(scheme.maxFundingAmount)
                  ? "Training-Based Support"
                  : formatCurrency(scheme.maxFundingAmount)
              }
            </div>
          </div>

          {/* Income Limit */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex items-center text-gray-500 text-xs mb-1">
              <IndianRupee size={12} className="mr-1.5" />
              Income Limit
            </div>
            <div className="text-base font-bold text-gray-900">
              &lt; {formatCurrency(scheme.eligibility.incomeLimit)}
            </div>
          </div>
        </div>

        {/* Requirements & Docs */}
        <div className="space-y-2 mb-5">
          {/* Caste Req */}
          {/* {scheme.eligibility.casteRequired && (
            <div className="flex items-center text-xs text-gray-600">
              <Users size={14} className="mr-2 text-blue-500" />
              <span>Caste Certificate Required</span>
            </div>
          )} */}

          {/* Doc Count */}
          <div className="flex items-center text-xs text-gray-600">
            <FileText size={14} className="mr-2 text-blue-500" />
            <span>{scheme.requiredDocuments.length} Documents Required</span>
          </div>
        </div>
      </div>

      {/* --- Footer Action --- */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <Link
          to="/beneficiary/beneficiaryForm"
          state={{ schemeId: scheme._id }}
        >
          <button
            onClick={() => onApply(scheme)}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-blue-600 hover:text-white border border-gray-200 hover:border-blue-600 font-medium py-2 px-4 rounded-lg transition-colors text-sm hover:cursor-pointer">
            Apply Now <ArrowRight size={16} />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SchemeCard;
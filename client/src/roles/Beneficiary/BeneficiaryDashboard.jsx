import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import SchemeCard from '@/cards/SchemeCard';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


const BeneficiaryDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("sujhaa-user"));

  // 🔹 FETCH SCHEMES
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await axios.get("https://sujhaa-backend.onrender.com/api/schemes/all");

        if (res.data.success) {
          setSchemes(res.data.schemes);
          setFilteredSchemes(res.data.schemes);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || t("fetch_error"));
      }
    };

    fetchSchemes();
  }, [t]);

  // 🔹 CATEGORY FILTER
  const filterByCategory = (category) => {
    setActiveCategory(category);

    let filtered = schemes;

    if (category !== "ALL") {
      filtered = schemes.filter((scheme) => scheme.category === category);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((scheme) =>
        scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSchemes(filtered);
  };

  // 🔹 SEARCH BOX
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    let result = schemes;

    if (activeCategory !== "ALL") {
      result = result.filter((scheme) => scheme.category === activeCategory);
    }

    if (query.trim()) {
      result = result.filter(
        (scheme) =>
          scheme.name.toLowerCase().includes(query.toLowerCase()) ||
          scheme.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredSchemes(result);
  };

  const handleApply = (scheme) => {
    navigate("/beneficiary/beneficiaryForm", {
      state: { schemeId: scheme._id },
    });
  };

  return (
    <div className="space-y-8 p-4 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {t("welcome_back")}, {user?.name}! 👋
          </h1>

          <p className="text-sm text-gray-500">
            {t("digital_id")}: <span className="font-semibold">{user?.digitalId}</span><br />
            {t("location")}: {user?.address}, {user?.district}, {user?.state}
          </p>

          {user?.isVerified ? (
            <p className="text-green-600 text-sm font-semibold">
              {t("verified_beneficiary")}
            </p>
          ) : (
            <p className="text-red-600 text-sm font-semibold">
              {t("pending_verification")}
            </p>
          )}
        </div>
      </div>

      {/* TITLE */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          {t("recommended_schemes")}
        </h2>
      </div>

      {/* CATEGORY FILTERS + SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        {/* CATEGORY TABS */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: t("category_ALL"), value: "ALL" },
            { label: t("category_INCOME_GENERATION"), value: "INCOME_GENERATION" },
            { label: t("category_INFRASTRUCTURE_SUPPORT"), value: "INFRASTRUCTURE_SUPPORT" },
            { label: t("category_SKILL_DEVELOPMENT"), value: "SKILL_DEVELOPMENT" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => filterByCategory(tab.value)}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold transition ${activeCategory === tab.value
                ? "bg-blue-600 text-white shadow"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SEARCH BOX */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 text-gray-500" size={18} />
          <input
            type="text"
            placeholder={t("search_schemes")}
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>
      </div>

      {/* SCHEMES GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredSchemes.map((scheme) => (
          <SchemeCard key={scheme._id} scheme={scheme} onApply={handleApply} />
        ))}
      </div>
    </div>
  );
};

export default BeneficiaryDashboard;

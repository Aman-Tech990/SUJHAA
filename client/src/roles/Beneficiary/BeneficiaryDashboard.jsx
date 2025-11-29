import React from 'react';
import { Filter } from 'lucide-react';
import SchemeCard from '@/cards/SchemeCard'; // The component we created above

const BeneficiaryDashboard = () => {
  // 1. New Data Structure (Based on your API Response)
const schemes = [
  // 1. Boutique Business Based Cluster
  {
    "_id": "7001",
    "schemeId": "SCH-CLU-001",
    "name": "Boutique Business Cluster",
    "category": "WOMEN_YOUTH_DEVELOPMENT",
    "description": "Cluster-based financial support for women's self-help groups to establish modern boutique and tailoring businesses.",
    "status": "ACTIVE",
    "maxFundingAmount": 25000,
    "eligibility": {
      "casteRequired": true,
      "incomeLimit": 250000
    },
    "requiredDocuments": [
      { "docName": "Domicile Certificate", "isMandatory": true, "_id": "d1a" },
      { "docName": "Caste Certificate", "isMandatory": true, "_id": "d1b" },
      { "docName": "Income Certificate", "isMandatory": true, "_id": "d1c" }
    ]
  },

  // 2. Beauty Parlor Business Based Cluster
  {
    "_id": "7002",
    "schemeId": "SCH-CLU-002",
    "name": "Beauty Parlor Cluster Initiative",
    "category": "LIVELIHOOD_ENTREPRENEURSHIP",
    "description": "Professional kit and infrastructure funding for trained beauticians to set up cluster-based beauty parlors.",
    "status": "ACTIVE",
    "maxFundingAmount": 15000,
    "eligibility": {
      "casteRequired": true,
      "incomeLimit": 250000
    },
    "requiredDocuments": [
      { "docName": "Domicile Certificate", "isMandatory": true, "_id": "d2a" },
      { "docName": "Caste Certificate", "isMandatory": true, "_id": "d2b" },
      { "docName": "Income Certificate", "isMandatory": true, "_id": "d2c" }
    ]
  },

  // 3. Cluster Based Solar Panel Installation Technician
  {
    "_id": "7003",
    "schemeId": "SCH-SKILL-003",
    "name": "Solar Panel Installation Tech",
    "category": "SKILL_DEVELOPMENT_EMPLOYMENT",
    "description": "Technical training and toolkits for youth to become certified solar panel installers and maintenance technicians.",
    "status": "ACTIVE",
    "maxFundingAmount": 40000,
    "eligibility": {
      "casteRequired": true,
      "incomeLimit": 200000
    },
    "requiredDocuments": [
      { "docName": "Domicile Certificate", "isMandatory": true, "_id": "d3a" },
      { "docName": "Caste Certificate", "isMandatory": true, "_id": "d3b" },
      { "docName": "Income Certificate", "isMandatory": true, "_id": "d3c" }
    ]
  },

  // 4. Logistics Vehicle Driver Cluster Based Project
  {
    "_id": "7004",
    "schemeId": "SCH-LOG-004",
    "name": "Logistics Vehicle Driver Project",
    "category": "SKILL_DEVELOPMENT_EMPLOYMENT",
    "description": "Support for obtaining heavy vehicle licenses and employment linkage for commercial logistics and transport drivers.",
    "status": "ACTIVE",
    "maxFundingAmount": 25000,
    "eligibility": {
      "casteRequired": true,
      "incomeLimit": 150000
    },
    "requiredDocuments": [
      { "docName": "Domicile Certificate", "isMandatory": true, "_id": "d4a" },
      { "docName": "Caste Certificate", "isMandatory": true, "_id": "d4b" },
      { "docName": "Income Certificate", "isMandatory": true, "_id": "d4c" }
    ]
  },

  // 5. Kiosk / Kirana (Grocery) Shop / General Store
  {
    "_id": "7005",
    "schemeId": "SCH-RET-005",
    "name": "Kirana & General Store Group",
    "category": "LIVELIHOOD_ENTREPRENEURSHIP",
    "description": "Working capital and inventory support for opening neighborhood Kirana stores, kiosks, or general stores in rural areas.",
    "status": "ACTIVE",
    "maxFundingAmount": 10000,
    "eligibility": {
      "casteRequired": true,
      "incomeLimit": 200000
    },
    "requiredDocuments": [
      { "docName": "Domicile Certificate", "isMandatory": true, "_id": "d5a" },
      { "docName": "Caste Certificate", "isMandatory": true, "_id": "d5b" },
      { "docName": "Income Certificate", "isMandatory": true, "_id": "d5c" }
    ]
  },

  // 6. Service Cluster Based Photographer and Videographer
  {
    "_id": "7006",
    "schemeId": "SCH-MED-006",
    "name": "Digital Media Service Cluster",
    "category": "SKILL_DEVELOPMENT_EMPLOYMENT",
    "description": "Provision of cameras, drones, and editing workstations for youth groups engaged in professional photography.",
    "status": "ACTIVE",
    "maxFundingAmount": 30000,
    "eligibility": {
      "casteRequired": true,
      "incomeLimit": 400000
    },
    "requiredDocuments": [
      { "docName": "Domicile Certificate", "isMandatory": true, "_id": "d6a" },
      { "docName": "Caste Certificate", "isMandatory": true, "_id": "d6b" },
      { "docName": "Income Certificate", "isMandatory": true, "_id": "d6c" }
    ]
  },

  // 7. Auto Rickshaw / E-Rickshaw Driver Service
  {
    "_id": "7007",
    "schemeId": "SCH-TRA-007",
    "name": "E-Rickshaw Driver Cluster",
    "category": "LIVELIHOOD_ENTREPRENEURSHIP",
    "description": "Subsidy for purchasing E-Rickshaws or Auto Rickshaws to provide last-mile connectivity services.",
    "status": "ACTIVE",
    "maxFundingAmount": 30000,
    "eligibility": {
      "casteRequired": true,
      "incomeLimit": 180000
    },
    "requiredDocuments": [
      { "docName": "Domicile Certificate", "isMandatory": true, "_id": "d7a" },
      { "docName": "Caste Certificate", "isMandatory": true, "_id": "d7b" },
      { "docName": "Income Certificate", "isMandatory": true, "_id": "d7c" }
    ]
  },

  // 9. Group Based Dairy and Vermicomposting Business
  {
    "_id": "7009",
    "schemeId": "SCH-AGR-009",
    "name": "Dairy & Vermicompost Unit",
    "category": "AGRICULTURE_RURAL_DEVELOPMENT",
    "description": "Integrated farming support for setting up dairy units (cattle) along with vermicomposting pits for organic fertilizer.",
    "status": "ACTIVE",
    "maxFundingAmount": 20000,
    "eligibility": {
      "casteRequired": true,
      "incomeLimit": 250000
    },
    "requiredDocuments": [
      { "docName": "Domicile Certificate", "isMandatory": true, "_id": "d9a" },
      { "docName": "Caste Certificate", "isMandatory": true, "_id": "d9b" },
      { "docName": "Income Certificate", "isMandatory": true, "_id": "d9c" }
    ]
  },

  // 11. Multi-Skilled Resources for Construction
  {
    "_id": "7011",
    "schemeId": "SCH-INF-011",
    "name": "Multi-Skilled Construction Group",
    "category": "INFRASTRUCTURE_COMMUNITY_ASSETS",
    "description": "Training and tooling for groups involved in construction activities (Masonry, Plumbing, Painting) to form contractor guilds.",
    "status": "ACTIVE",
    "maxFundingAmount": 12000,
    "eligibility": {
      "casteRequired": true,
      "incomeLimit": 200000
    },
    "requiredDocuments": [
      { "docName": "Domicile Certificate", "isMandatory": true, "_id": "d11a" },
      { "docName": "Caste Certificate", "isMandatory": true, "_id": "d11b" },
      { "docName": "Income Certificate", "isMandatory": true, "_id": "d11c" }
    ]
  },

  // 12. Cluster Based Modular Furniture / Carpentry Work
  {
    "_id": "7012",
    "schemeId": "SCH-FUR-015",
    "name": "Modular Furniture Cluster",
    "category": "LIVELIHOOD_BUSINESS_ENTREPRENEURSHIP",
    "description": "Modern carpentry workshop setup for manufacturing modular furniture using advanced wood-working machinery.",
    "status": "ACTIVE",
    "maxFundingAmount": 35000,
    "eligibility": {
      "casteRequired": true,
      "incomeLimit": 250000
    },
    "requiredDocuments": [
      { "docName": "Domicile Certificate", "isMandatory": true, "_id": "d15a" },
      { "docName": "Caste Certificate", "isMandatory": true, "_id": "d15b" },
      { "docName": "Income Certificate", "isMandatory": true, "_id": "d15c" }
    ]
  },  
];

  const handleApply = (scheme) => {
    console.log("User clicked apply for:", scheme.name);
    // Navigate to details page here
  };

  return (
    <div className="space-y-8 p-4 bg-gray-50 min-h-screen">
      {/* --- SECTION 1: Welcome Header --- */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Welcome back, Rajesh! 👋
          </h1>
          <p className="text-sm text-gray-500">
            Here are the schemes you are eligible for based on your profile.
          </p>
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
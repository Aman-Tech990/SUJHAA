import Scheme from "../models/Scheme.js";

export const seedSchemes = async () => {
    const count = await Scheme.countDocuments();

    if (count > 0) {
        console.log("✔ Schemes already seeded");
        return;
    }

    const schemes = [
        // ======================================================
        //                INCOME GENERATION (5)
        // ======================================================
        {
            schemeId: "SCH-IG-001",
            name: "Dairy Unit Assistance",
            category: "INCOME_GENERATION",
            description:
                "Financial assistance for SC households to establish small dairy units (2–4 cattle) under PM-AJAY GIA to enhance sustainable income.",
            eligibility: {
                casteRequired: true,
                incomeLimit: 250000
            },
            requiredDocuments: [
                { docName: "Caste Certificate", isMandatory: true },
                { docName: "Income Certificate", isMandatory: true },
                { docName: "Domicile Certificate", isMandatory: true }
            ],
            maxFundingAmount: 60000,
            status: "ACTIVE"
        },
        {
            schemeId: "SCH-IG-002",
            name: "Goat & Sheep Rearing Support",
            category: "INCOME_GENERATION",
            description:
                "Assistance for marginalized SC families to start goat/sheep rearing units for sustainable livelihood improvement.",
            eligibility: {
                casteRequired: true,
                incomeLimit: 250000
            },
            requiredDocuments: [
                { docName: "Caste Certificate", isMandatory: true },
                { docName: "Income Certificate", isMandatory: true }
            ],
            maxFundingAmount: 50000,
            status: "ACTIVE"
        },
        {
            schemeId: "SCH-IG-003",
            name: "Tailoring & Sewing Machine Support",
            category: "INCOME_GENERATION",
            description:
                "Support for SC women/youth to establish home-based tailoring units promoting micro entrepreneurship.",
            eligibility: {
                casteRequired: true
            },
            requiredDocuments: [
                { docName: "Caste Certificate", isMandatory: true },
                { docName: "Domicile Certificate", isMandatory: true }
            ],
            maxFundingAmount: 25000,
            status: "ACTIVE"
        },
        {
            schemeId: "SCH-IG-004",
            name: "Small Retail Shop Establishment",
            category: "INCOME_GENERATION",
            description:
                "Assistance to SC beneficiaries for setting up micro retail enterprises such as grocery, stationery or repair shops.",
            eligibility: {
                casteRequired: true,
                incomeLimit: 300000
            },
            requiredDocuments: [
                { docName: "Income Certificate", isMandatory: true }
            ],
            maxFundingAmount: 30000,
            status: "ACTIVE"
        },
        {
            schemeId: "SCH-IG-005",
            name: "Poultry Farming Support",
            category: "INCOME_GENERATION",
            description:
                "Support for SC households to set up small-scale poultry units for livelihood generation.",
            eligibility: {
                casteRequired: true
            },
            requiredDocuments: [
                { docName: "Caste Certificate", isMandatory: true }
            ],
            maxFundingAmount: 40000,
            status: "ACTIVE"
        },

        // ======================================================
        //                SKILL DEVELOPMENT (5)
        // ======================================================
        {
            schemeId: "SCH-SD-001",
            name: "Digital Literacy & Computer Training",
            category: "SKILL_DEVELOPMENT",
            description:
                "Training covering computer fundamentals, MS Office, internet operations and basic digital skills for SC youth.",
            durationInDays: 45,
            eligibility: {
                casteRequired: true
            },
            status: "ACTIVE"
        },
        {
            schemeId: "SCH-SD-002",
            name: "Electrician & Domestic Wiring Training",
            category: "SKILL_DEVELOPMENT",
            description:
                "Technical skill training in domestic wiring, electrical safety and installation practices.",
            durationInDays: 60,
            eligibility: { casteRequired: true },
            status: "ACTIVE"
        },
        {
            schemeId: "SCH-SD-003",
            name: "Mobile Repair & Service Technician",
            category: "SKILL_DEVELOPMENT",
            description:
                "Hands-on training in smartphone repairing, troubleshooting and hardware servicing.",
            durationInDays: 30,
            eligibility: { casteRequired: true },
            status: "ACTIVE"
        },
        {
            schemeId: "SCH-SD-004",
            name: "Solar Panel Installation Training",
            category: "SKILL_DEVELOPMENT",
            description:
                "Training program in solar panel installation, maintenance and renewable energy systems.",
            durationInDays: 50,
            eligibility: { casteRequired: true },
            status: "ACTIVE"
        },
        {
            schemeId: "SCH-SD-005",
            name: "Tailoring & Fashion Design Training",
            category: "SKILL_DEVELOPMENT",
            description:
                "Training covering garment cutting, stitching, fashion patterns and enterprise setup.",
            durationInDays: 40,
            eligibility: { casteRequired: true },
            status: "ACTIVE"
        },

        // ======================================================
        //              INFRASTRUCTURE SUPPORT (5)
        // ======================================================
        {
            schemeId: "SCH-INF-001",
            name: "SC Community Hall Construction",
            category: "INFRASTRUCTURE_SUPPORT",
            description:
                "Construction of community halls in SC habitations for social, educational and community activities.",
            maxFundingAmount: 1200000,
            status: "ACTIVE"
        },
        {
            schemeId: "SCH-INF-002",
            name: "Anganwadi Centre Renovation",
            category: "INFRASTRUCTURE_SUPPORT",
            description:
                "Repair, upgradation and renovation support for Anganwadi centres located in SC communities.",
            maxFundingAmount: 300000,
            status: "ACTIVE"
        },
        {
            schemeId: "SCH-INF-003",
            name: "Drinking Water Facility Setup",
            category: "INFRASTRUCTURE_SUPPORT",
            description:
                "Installation of handpumps, borewells, pipelines or RO systems to provide potable water in SC areas.",
            maxFundingAmount: 200000,
            status: "ACTIVE"
        },
        {
            schemeId: "SCH-INF-004",
            name: "Solar Street Light Installation",
            category: "INFRASTRUCTURE_SUPPORT",
            description:
                "Installation of solar-powered LED street lights in SC villages to enhance safety and sustainability.",
            maxFundingAmount: 150000,
            status: "ACTIVE"
        },
        {
            schemeId: "SCH-INF-005",
            name: "Village Road Repair & Pathway Strengthening",
            category: "INFRASTRUCTURE_SUPPORT",
            description:
                "Repair and maintenance of internal village roads and pathways in SC-dominated settlements.",
            maxFundingAmount: 500000,
            status: "ACTIVE"
        }
    ];

    await Scheme.insertMany(schemes);

    console.log("🔥 15 Authentic PM-AJAY Schemes Seeded Successfully!");
};

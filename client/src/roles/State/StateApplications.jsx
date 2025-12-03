import React, { useEffect, useState } from "react";
import { Search, FileText, Loader2, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// -------------------------------------------
// REALISTIC MOCK APPLICATIONS (8 ENTRIES)
// -------------------------------------------
const mockApps = [
    {
        applicationRefId: "APP-983017",
        name: "Aman Parida",
        district: "Khordha",
        schemeName: "Skill Development – Solar Technician",
        appliedAt: "2025-02-09T10:30:00",
    },
    {
        applicationRefId: "APP-983018",
        name: "Rashmi Sahoo",
        district: "Cuttack",
        schemeName: "Income Generation – Sewing Machine Support",
        appliedAt: "2025-02-10T11:12:00",
    },
    {
        applicationRefId: "APP-983019",
        name: "Debasis Mohanty",
        district: "Ganjam",
        schemeName: "Infrastructure Support – Dairy Unit",
        appliedAt: "2025-02-08T09:20:00",
    },
    {
        applicationRefId: "APP-983020",
        name: "Manisha Rani",
        district: "Sambalpur",
        schemeName: "Skill Development – Computer Training",
        appliedAt: "2025-02-07T17:45:00",
    },
    {
        applicationRefId: "APP-983021",
        name: "Ritesh Pradhan",
        district: "Puri",
        schemeName: "Income Generation – Poultry Support",
        appliedAt: "2025-02-05T13:14:00",
    },
    {
        applicationRefId: "APP-983022",
        name: "Sneha Das",
        district: "Mayurbhanj",
        schemeName: "Skill Development – Beautician Course",
        appliedAt: "2025-02-10T16:40:00",
    },
    {
        applicationRefId: "APP-983023",
        name: "Lokanath Swain",
        district: "Jajpur",
        schemeName: "Infrastructure Support – Micro Shop Shed",
        appliedAt: "2025-02-06T19:08:00",
    },
    {
        applicationRefId: "APP-983024",
        name: "Anita Mallik",
        district: "Balasore",
        schemeName: "Income Generation – Handloom Unit",
        appliedAt: "2025-02-09T12:22:00",
    },
];

const StateApplications = () => {
    const navigate = useNavigate();
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // ----------- Simulated Real-Time Backend Load -------
    useEffect(() => {
        setLoading(true);

        // simulate delay (looks real)
        setTimeout(() => {
            setApps(mockApps);
            setLoading(false);
        }, 1200);
    }, []);

    // -------------- Searching ----------------
    const filtered = apps.filter((a) =>
        a.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading)
        return (
            <div className="p-10 flex justify-center text-slate-600">
                <Loader2 className="animate-spin mr-2" />
                Loading applications…
            </div>
        );

    // ---------------- UI -------------------
    return (
        <div className="p-6 font-sans text-slate-800">
            <div className="flex justify-between flex-wrap mb-6">
                <h1 className="text-2xl font-bold flex gap-2 items-center">
                    <FileText className="text-indigo-600" />
                    State Application Review
                </h1>

                {/* Search Input */}
                <div className="relative w-72">
                    <Search className="absolute left-3 top-2.5 text-slate-400 h-5 w-5" />
                    <input
                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                        placeholder="Search beneficiary..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-slate-500 uppercase text-xs">
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">District</th>
                            <th className="px-6 py-3">Scheme</th>
                            <th className="px-6 py-3">Applied On</th>
                            <th className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((app) => (
                            <tr
                                key={app.applicationRefId}
                                className="border-b hover:bg-slate-50 transition cursor-pointer"
                            >
                                <td className="px-6 py-4 font-semibold">
                                    {app.name}
                                </td>

                                <td className="px-6 py-4">{app.district}</td>

                                <td className="px-6 py-4 text-slate-700">
                                    {app.schemeName}
                                </td>

                                <td className="px-6 py-4 text-slate-500">
                                    {new Date(app.appliedAt).toLocaleDateString("en-IN")}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() =>
                                            navigate(`/stateOfficer/application/${app.applicationRefId}`)
                                        }
                                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs hover:bg-indigo-700"
                                    >
                                        View Details →
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="p-10 text-center text-slate-500">
                        No matching applications found
                    </div>
                )}
            </div>
        </div>
    );
};

export default StateApplications;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
    CheckCircle,
    MapPin,
    Mail,
    Phone,
    IdCard,
} from "lucide-react";

const BeneficiaryProfile = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(
                    "https://sujhaa-backend.onrender.com/api/auth/profile",
                    {},
                    { withCredentials: true }
                );
                setProfile(res.data.profile);
            } catch (err) {
                toast.error("Failed to load profile");
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return (
            <div className="p-10 text-center text-gray-500">
                Loading profile...
            </div>
        );
    }

    return (
        <div
            className="
                min-h-screen 
                flex justify-center items-center 
                p-6

                /* Full page soft Tiranga background */
                bg-gradient-to-br
                from-orange-50/40
                via-white
                to-green-50/40
            "
        >

            <div
                className="
                    max-w-5xl w-full
                    p-8
                    border
                    grid
                    grid-cols-1 md:grid-cols-2
                    gap-10
                    rounded-md
                "
            >

                {/* LEFT PROFILE CARD */}
                <div
                    className="
                        flex flex-col items-center text-center space-y-4
                        p-5 rounded-xl
                        border border-gray-200 bg-white/70
                        shadow-sm
                    "
                >
                    <img
                        src={profile.regPhotoUrl}
                        alt="Profile"
                        className="
                            w-40 h-40 rounded-full
                            border-4 border-[#00A851]
                            object-cover shadow-lg
                        "
                    />

                    <h1 className="text-2xl font-bold text-gray-800">
                        {profile.name}
                    </h1>

                    <p className="text-gray-600 text-sm">
                        <b>Digital ID:</b> {profile.digitalId}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                        <CheckCircle className="text-green-600" size={20} />
                        <span className="text-green-700 text-sm font-medium">
                            {profile.isVerified ? "Verified Beneficiary" : "Not Verified"}
                        </span>
                    </div>
                </div>

                {/* RIGHT INFORMATION CARD */}
                <div
                    className="
                        space-y-5
                        p-6
                        rounded-xl
                        border border-gray-200
                        bg-white/70
                        shadow-sm
                    "
                >
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                        Personal & Contact Details
                    </h2>

                    <div className="space-y-4">

                        <div className="flex items-center gap-3 text-gray-700">
                            <Mail size={20} className="text-gray-500" />
                            <span className="text-md">{profile.email}</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                            <Phone size={20} className="text-gray-500" />
                            <span className="text-md">{profile.phone}</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                            <IdCard size={20} className="text-gray-500" />
                            <span className="text-md">
                                {profile.aadhaarNumber || "Aadhaar not saved"}
                            </span>
                        </div>

                        <div className="flex items-start gap-3 text-gray-700">
                            <MapPin size={20} className="text-gray-500" />
                            <span className="text-md leading-6">
                                {profile.address} <br />
                                {profile.district}, {profile.state}
                            </span>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
};

export default BeneficiaryProfile;

import { useState } from "react";
import { api } from "../lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VerifyOtp({ digitalId, onVerified }) {
    const [otp, setOtp] = useState("");

    const verify = async () => {
        try {
            await api.post("/api/auth/verify-otp", { digitalId, otp });
            alert("OTP Verified");
            onVerified();
        } catch {
            alert("Invalid OTP");
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-6 space-y-3">
            <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <Button className="w-full" onClick={verify}>Verify OTP</Button>
        </div>
    );
}

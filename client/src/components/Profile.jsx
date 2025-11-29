import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Card, CardContent } from "@/components/ui/card";

export default function Profile() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        api.get("/api/beneficiary/profile").then((res) => {
            setProfile(res.data.profile);
        });
    }, []);

    if (!profile) return "Loading...";

    return (
        <Card className="max-w-md mx-auto mt-6">
            <CardContent className="p-4 space-y-2">
                <p>Name: {profile.name}</p>
                <p>Digital ID: {profile.digitalId}</p>
                <p>District: {profile.district}</p>
                <p>State: {profile.state}</p>
            </CardContent>
        </Card>
    );
}

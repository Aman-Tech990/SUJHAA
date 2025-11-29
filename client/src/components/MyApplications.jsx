import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Card, CardContent } from "@/components/ui/card";

export default function MyApplications() {
    const [apps, setApps] = useState([]);

    useEffect(() => {
        api.get("/api/application/my-applications").then((res) => {
            setApps(res.data.applications);
        });
    }, []);

    return (
        <div className="max-w-xl mx-auto space-y-4 mt-6">
            {apps.map((app) => (
                <Card>
                    <CardContent className="p-4">
                        <p className="font-semibold">{app.schemeName}</p>
                        <p>Status: {app.status}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

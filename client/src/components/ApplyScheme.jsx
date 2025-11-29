import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

export default function ApplyScheme() {
    const [schemes, setSchemes] = useState([]);
    const [selected, setSelected] = useState("");

    useEffect(() => {
        api.get("/api/schemes/all").then((res) => setSchemes(res.data.schemes));
    }, []);

    const apply = async () => {
        try {
            await api.post("/api/application/apply", { schemeId: selected }, { withCredentials: true});
            alert("Applied Successfully");
        } catch {
            alert("Application Failed");
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-6">
            <Select onValueChange={setSelected}>
                <SelectTrigger>Choose Scheme</SelectTrigger>
                <SelectContent>
                    {schemes.map((s) => (
                        <SelectItem key={s.schemeId} value={s.schemeId}>{s.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button className="w-full mt-3" onClick={apply}>Apply</Button>
        </div>
    );
}

import { useState } from "react";
import { api } from "../lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login({ onLogged }) {
    const [digitalId, setDigitalId] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        try {
            const res = await api.post("/api/auth/login", { digitalId, password });
            alert("Login Success");
            onLogged(res.data.user);
        } catch {
            alert("Login Failed");
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-6 space-y-3">
            <Input placeholder="Digital ID" onChange={(e) => setDigitalId(e.target.value)} />
            <Input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
            <Button className="w-full" onClick={login}>Login</Button>
        </div>
    );
}

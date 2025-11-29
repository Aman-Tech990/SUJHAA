import { useState } from "react";
import OcrUpload from "./OcrUpload";
import { api } from "../lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Register({ onRegistered }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        aadhaarNumber: "",
        address: "",
        district: "",
        state: "",
        password: ""
    });

    const [file, setFile] = useState(null);

    const handleRegister = async () => {
        const fd = new FormData();
        Object.keys(form).forEach((key) => fd.append(key, form[key]));
        fd.append("regPhoto", file);

        try {
            const res = await api.post("/api/auth/register", fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("OTP Sent");
            onRegistered(res.data.digitalId);
        } catch (err) {
            alert("Registration failed");
        }
    };

    return (
        <>
            <OcrUpload onExtract={(data) => setForm({ ...form, ...data })} />

            <Card className="max-w-md mx-auto mt-6 p-4">
                <CardContent className="space-y-3">
                    {Object.keys(form).map((key) => (
                        <div key={key}>
                            <Label>{key}</Label>
                            <Input
                                value={form[key]}
                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                            />
                        </div>
                    ))}

                    <Label>Registration Photo</Label>
                    <Input type="file" onChange={(e) => setFile(e.target.files[0])} />

                    <Button className="w-full mt-3" onClick={handleRegister}>
                        Register
                    </Button>
                </CardContent>
            </Card>
        </>
    );
}

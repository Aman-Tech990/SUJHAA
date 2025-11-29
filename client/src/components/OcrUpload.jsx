import { useState } from "react";
import { api } from "../lib/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OcrUpload({ onExtract }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) return alert("Upload Aadhaar Image");

        const formData = new FormData();
        formData.append("aadhaar", file);

        setLoading(true);

        try {
            const res = await api.post("/api/ocr/aadhaar", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            onExtract(res.data.data); // sends name, aadhaarNumber
        } catch (err) {
            alert("OCR Failed");
        }

        setLoading(false);
    };

    return (
        <Card className="max-w-md mx-auto mt-6">
            <CardContent className="space-y-4 p-4">
                <label className="text-lg font-semibold">Upload Aadhaar</label>
                <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <Button onClick={handleUpload} disabled={loading}>
                    {loading ? "Reading OCR..." : "Extract Details"}
                </Button>
            </CardContent>
        </Card>
    );
}

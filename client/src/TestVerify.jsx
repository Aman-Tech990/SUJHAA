import React, { useState } from "react";
import axios from "axios";

export default function TestVerify() {
    const [applicationId, setApplicationId] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [beneficiaryPhoto, setBeneficiaryPhoto] = useState(null);
    const [housePhoto, setHousePhoto] = useState(null);
    const [result, setResult] = useState(null);

    const handleVerify = async () => {
        const formData = new FormData();
        formData.append("application_id", applicationId);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("beneficiaryPhoto", beneficiaryPhoto);
        formData.append("housePhoto", housePhoto);

        try {
            const res = await axios.post(
                "http://localhost:5000/api/field/verify",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setResult(res.data);
        } catch (err) {
            console.log(err);
            alert("Error: " + err?.response?.data?.message);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>TEST — Field Verification</h2>

            <input
                type="text"
                placeholder="Application ID"
                value={applicationId}
                onChange={e => setApplicationId(e.target.value)}
            /><br /><br />

            <input
                type="number"
                placeholder="Latitude"
                value={latitude}
                onChange={e => setLatitude(e.target.value)}
            /><br /><br />

            <input
                type="number"
                placeholder="Longitude"
                value={longitude}
                onChange={e => setLongitude(e.target.value)}
            /><br /><br />

            <label>Beneficiary Photo:</label><br />
            <input type="file" onChange={e => setBeneficiaryPhoto(e.target.files[0])} />
            <br /><br />

            <label>House Photo:</label><br />
            <input type="file" onChange={e => setHousePhoto(e.target.files[0])} />
            <br /><br />

            <button onClick={handleVerify}>Submit Verification</button>

            {result && (
                <pre style={{ background: "#eee", padding: 20, marginTop: 20 }}>
                    {JSON.stringify(result, null, 2)}
                </pre>
            )}
        </div>
    );
}

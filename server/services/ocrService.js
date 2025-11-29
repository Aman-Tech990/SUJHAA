import Tesseract from "tesseract.js";

function extractAadhaarName(fullText) {
    const lines = fullText
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);

    const skipWords = [
        "GOVERNMENT", "INDIA", "UNIQUE IDENTIFICATION", "UIDAI",
        "DOB", "YEAR", "MALE", "FEMALE", "Address", "To", "Aadhaar",
        "Adhaar", "AADHAAR", "Govt", "Birth"
    ];

    for (let line of lines) {
        const clean = line.trim();

        if (skipWords.some(w => clean.toLowerCase().includes(w.toLowerCase()))) continue;
        if (/\d/.test(clean)) continue;
        if (/^[A-Za-z ]+$/.test(clean) && clean.length >= 3) return clean;
    }
    return null;
}

export const extractAadhaarWithTesseract = async (fileBuffer) => {
    try {
        console.log("⏳ Running Tesseract OCR...");

        const { data: { text } } = await Tesseract.recognize(fileBuffer, "eng", {
            logger: (m) => console.log(m)
        });

        console.log("✔ OCR Completed");

        const fullText = text;

        // Aadhaar Number
        const aadhaarMatch = fullText.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);
        const aadhaarNumber = aadhaarMatch ? aadhaarMatch[0].replace(/\s/g, "") : null;

        // Name
        const name = extractAadhaarName(fullText);

        // Address
        const addressLines = fullText.split("\n").filter((l) =>
            /(address|house|street|road|city|pin|post)/i.test(l)
        );
        const address = addressLines.join(", ").trim();

        return {
            success: true,
            data: {
                name: name || "Not found",
                aadhaar_number: aadhaarNumber || "Not found",
                address: address || "Not found",
                raw_text: fullText
            }
        };

    } catch (err) {
        console.error("❌ Tesseract OCR Error:", err);
        return { success: false, message: err.message };
    }
};

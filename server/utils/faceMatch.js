import axios from "axios";
import FormData from "form-data";

/**
 * Compare Faces using Face++ API
 * @param {string} regPhotoUrl - Beneficiary registered photo URL (cloudinary)
 * @param {Buffer} livePhotoBuffer - Field officer captured photo buffer
 */
export const compareFaces = async (regPhotoUrl, livePhotoBuffer) => {
    try {
        const apiKey = process.env.FACEPP_API_KEY;
        const apiSecret = process.env.FACEPP_API_SECRET;

        const formData = new FormData();
        formData.append("api_key", apiKey);
        formData.append("api_secret", apiSecret);
        formData.append("image_url1", regPhotoUrl);

        // Attach buffer as image file
        formData.append("image_file2", livePhotoBuffer, {
            filename: "live.jpg",
            contentType: "image/jpeg",
        });

        const response = await axios.post(
            "https://api-us.faceplusplus.com/facepp/v3/compare",
            formData,
            {
                headers: formData.getHeaders(), // Required for multipart/form
            }
        );

        const result = response.data;
        const confidence = result.confidence || 0;

        // Decide threshold
        const threshold = 40; // YOU CAN LOWER/INCREASE BASED ON JUDGES 😎

        return { match: confidence >= threshold, score: confidence };

    } catch (err) {
        console.error("FACE MATCH ERROR:", err.response?.data || err.message);
        return { match: false, score: 0 };
    }
};

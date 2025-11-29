import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadBufferToCloudinary = async (buffer, folder) => {
    return new Promise((resolve, reject) => {
        try {
            const upload = cloudinary.uploader.upload_stream(
                { folder, resource_type: 'auto' },
                (error, result) => {
                    if (error) {
                        console.error("CLOUDINARY UPLOAD ERROR:", error);
                        reject(error);
                    } else {
                        console.log("CLOUDINARY UPLOADED:", result.secure_url);
                        resolve(result.secure_url);
                    }
                }
            );

            upload.end(buffer);

        } catch (err) {
            console.error("CLOUDINARY FATAL ERROR:", err);
            reject(err);
        }
    });
};

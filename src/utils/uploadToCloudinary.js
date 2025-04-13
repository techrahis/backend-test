import cloudinary from "../config/cloudinaryConfig.js";
import { Readable } from "stream";

// ✅ Upload function with Buffer support
export const uploadToCloudinary = async (imageBuffer, folder) => {
  try {
    // Create a readable stream from the buffer
    const bufferStream = new Readable();
    bufferStream.push(imageBuffer);
    bufferStream.push(null); // end the stream

    // Upload the buffer stream to Cloudinary
    const result = await new Promise((resolve, reject) => {
      bufferStream.pipe(
        cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: "image", // Cloudinary specific
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
      );
    });

    // Return Cloudinary URL after successful upload
    return result.secure_url; // Return Cloudinary image URL
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);
    return null;
  }
};

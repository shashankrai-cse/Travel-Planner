import { cloudinary } from "../config/cloudinary.js";

export const uploadOnCloudinary = async (fileBuffer, folder = "wayfarer") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

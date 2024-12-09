import pkg from "cloudinary";
const { v2: cloudinary } = pkg;
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables for Cloudinary
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload the file from local storage to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("Local File Path is not defined");
      return null;
    }

    console.log("Uploading file to Cloudinary", localFilePath);

    if (!fs.existsSync(localFilePath)) {
      console.log("File does not exist", localFilePath);
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "raw", // 'raw' for non-image files (e.g., PDF, Word docs)
    });

    console.log("File uploaded to Cloudinary:", response.url);

    // Remove the temporary file after upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.log("Error uploading to Cloudinary", error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

export { uploadOnCloudinary };
